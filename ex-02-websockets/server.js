const WebSocketServer = require('ws').Server;
const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', ws => {
  let i = 0;
  setInterval(() => ws.send(JSON.stringify({ message: `s1: ${i++}` })), 1000);
});

app.use('/', express.static(path.join(__dirname)));

server.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
