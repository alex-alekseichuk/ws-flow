import { WebSocketServer } from 'ws';
import {generator as createGenerator} from './generator.js';

const port = Number(process.env.PORT || 8080);
const wss = new WebSocketServer({ port });
const generator = createGenerator();

wss.on('connection', (ws) => {
  console.log('client connected');
  console.log(`clients: ${wss.clients.size}`);

  ws.on('error', (err) => {
    console.log(`client error`, err);
  });
  ws.on('close', () => {
    console.log(`client closed`);
  });

  ws.on('message', (data) => {
    console.log('received: %s', data);
  });
  ws.send('something');
});

wss.on('close', () => {
  console.log('close server');
  generator.stop();
});

wss.on('error', (err) => {
  console.log('error', err);
  generator.stop();
});

wss.on('listening', () => {
  console.log('listen...');
  generator.start();
});

generator.on('record', (record) => {
  wss.clients.forEach(ws => ws.send(JSON.stringify(record)));
});
