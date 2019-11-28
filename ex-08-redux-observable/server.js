const WebSocketServer = require('ws').Server;
const http = require('http');
const path = require('path');
const express = require('express');
const parser = require('body-parser');

const app = express();
app.use(parser.json());

let user = {
  name: 'John Doe',
  email: 'test@mail.com',
  phone: '123213123',
};

app.get('/api/user', (req, res) => {
  res.json(user);
});

app.put('/api/user', (req, res) => {
  user = { ...user, ...req.body };
  res.json(user);
});

app.use('/', express.static(path.join(__dirname)));

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', ws => {
  let i = 0;
  setInterval(() => ws.send(JSON.stringify({ type: 'error', message: `s1: ${i++}` })), 3000);
});

server.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
