import { WebSocketServer } from 'ws';

export function wsServer(port) {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('client connected');

    ws.on('error', (err) => {
      console.log(`client error`, err);
    });
    ws.on('close', () => {
      console.log(`client closed`);
    });

    ws.on('message', (data) => {
      console.log('received: %s', data);
    });
  });

  wss.broadcast = msg => {
    wss.clients.forEach(ws => ws.send(msg));
  };

  return wss;
}


