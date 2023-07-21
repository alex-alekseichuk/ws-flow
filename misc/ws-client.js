import WebSocket from 'ws';

const WS_URL = process.env.WS_URL || 'ws:/localhost:8080';

const type = process.argv[2] || 'offlinePlayers';

const ws = new WebSocket(WS_URL);

ws.on('error', err => {
  console.log('error', err);
});

ws.on('close', () => {
  console.log('closed');
});

ws.on('open', function open() {
  console.log('opened');
  ws.send(JSON.stringify({type}));
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
