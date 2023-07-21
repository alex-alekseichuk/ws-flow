import WebSocket from 'ws';
import {wsServer} from "../common/ws-server.js";
import {controller as createController} from './controller.js';

const WS_PLAYERS_URL = process.env.WS_PLAYERS_URL || 'ws:/localhost:8081';
const WS_GAMES_URL = process.env.WS_GAMES_URL || 'ws:/localhost:8082';
const port = Number(process.env.PORT || 8080);

const wsPlayers = new WebSocket(WS_PLAYERS_URL);
const wsGames = new WebSocket(WS_GAMES_URL);
const wss = wsServer(port);
const controller = createController(wss);

wsPlayers.on('message', function (player) {
  try {
    controller.processPlayer(JSON.parse(player));
  } catch (err) {
  }
});

wsGames.on('message', function (game) {
  try {
    controller.processGame(JSON.parse(game));
  } catch (err) {
  }
});

wss.on('connection', (ws) => {
  ws.on('error', (err) => {
    controller.unsubscribe(ws);
  });
  ws.on('close', () => {
    controller.unsubscribe(ws);
  });

  ws.on('message', (data) => {
    try {
      controller.subscribe(ws, JSON.parse(data));
    } catch (err) {
    }
  });
});

wss.on('close', () => {
  console.log('close server');
  wsPlayers.close();
  wsGames.close();
});

wss.on('error', (err) => {
  console.log('error', err);
  wsPlayers.close();
  wsGames.close();
});
