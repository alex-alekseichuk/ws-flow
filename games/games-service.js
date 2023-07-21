/**
 * Service generates games record and broadcast them to all connected clients.
 * Clients connected via WS.
 * Stop generation if no more clients connected.
 */
import {gamesGenerator} from './games-generator.js';
import {wsServer} from '../common/ws-server.js';

const port = Number(process.env.PORT || 8080);
const wss = wsServer(port);
const generator = gamesGenerator();

wss.on('close', () => {
  console.log('close server');
  generator.stop();
});

wss.on('error', (err) => {
  console.log('error', err);
  generator.stop();
});

wss.on('listening', () => {
  console.log('listening...');
});

wss.on('connection', (ws) => {
  generator.start();

  ws.on('error', (err) => {
    if (wss.clients.size === 0) {
      generator.stop();
    }
  });

  ws.on('close', () => {
    if (wss.clients.size === 0) {
      generator.stop();
    }
  });
});

generator.on('game', (record) => {
  wss.broadcast(JSON.stringify(record));
});
