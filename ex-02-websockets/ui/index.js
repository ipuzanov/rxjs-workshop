class WsClient {
  constructor(url) {
    this.reconnectTimer = null;
    this.subs = [];

    this.initSocket(url);
  }

  reconnect(url) {
    clearTimeout(this.reconnectTimer);

    this.reconnectTimer = setTimeout(() => this.initSocket(url));
  }

  initSocket(url) {
    this.ws = new WebSocket(url);

    this.ws.onmessage = evt => {
      this.subs.forEach(cb => cb(JSON.parse(evt.data)));
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

  subscribe(cb) {
    this.subs.push(cb);

    return () => {
      this.subs = this.subs.filter(c => c !== cb);
    }
  }
}

const ws = new WsClient('ws://localhost:3000/ws');

ws.subscribe(x => console.log(x));

