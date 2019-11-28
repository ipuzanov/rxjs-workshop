const WebSocketServer = require('ws').Server;
const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', ws => {
  ws.on('message', data => {
    const msg = JSON.parse(data);

    if (msg.topic === 'request') {
      ws.send(
        JSON.stringify({
          topic: msg.message.replyTo,
          message: {
            correlationId: msg.message.correlationId,
            payload: 'pong',
          },
        }),
      );
    }
  });
});

app.use('/', express.static(path.join(__dirname)));

server.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
