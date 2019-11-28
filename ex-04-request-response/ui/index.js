class WsClient {
  constructor(url) {
    this.reconnectTimer = null;
    this.queue = [];
    this.subs = new Map();

    this.initSocket(url);
  }

  initSocket(url) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log('socket open');
      this.flushQueue();
    };
    this.ws.onmessage = evt => {
      const data = JSON.parse(evt.data);
      const subs = this.subs.get(data.topic);
      if (subs) {
        subs.forEach(cb => cb(data.message));
      }
    };

    this.ws.onerror = err => {
      console.error(err);
      this.reconnect(url);
    };
    this.ws.onclose = () => {
      console.log('socket closed');
      this.reconnect(url);
    };
  }

  flushQueue() {
    while (this.queue.length) {
      this.ws.send(this.queue.shift());
    }
  }

  reconnect(url) {
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.initSocket(url), 1000);
  }

  subscribe(topic, cb) {
    if (!this.subs.get(topic)) this.subs.set(topic, []);

    this.subs.get(topic).push(cb);

    return () => {
      this.subs.set(
        topic,
        this.subs.get(topic).filter(c => c !== cb),
      );
    };
  }

  push(topic, message) {
    if (this.ws.readyState !== 1) {
      this.queue.push(JSON.stringify({ topic, message }));
    } else {
      this.ws.send(JSON.stringify({ topic, message }));
    }
  }
}

const ws = new WsClient('ws://localhost:3000/ws');

const sendRequest = payload => {
  const correlationId = `m_${Math.ceil(Math.random() * 1000000)}`;
  return new Promise(resolve => {
    ws.subscribe('response', msg => {
      if (msg && msg.correlationId === correlationId) {
        console.log(correlationId, msg);
        resolve(msg.payload);
      }
    });

    ws.push('request', { replyTo: 'response', payload, correlationId });
  });
};

sendRequest('ping').then(r => console.log('result: ', r));
sendRequest('ping').then(r => console.log('result: ', r));
sendRequest('ping').then(r => console.log('result: ', r));
sendRequest('ping').then(r => console.log('result: ', r));
