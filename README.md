There is an example of 3 WebSocket services:
- players generator
- games generator
- info: relay info of 2 service above

## Run 3 services locally

```
PORT=8081 npm run players
```

```
PORT=8082 npm run games
```

```
WS_PLAYERS_URL=ws://localhost:8081 WS_GAMES_URL=ws://localhost:8082 PORT=8083 npm run info
```

## Run client against info service

```
WS_URL=ws://localhost:8083 npm run ws-client offlinePlayers
WS_URL=ws://localhost:8083 npm run ws-client inGamePlayers
WS_URL=ws://localhost:8083 npm run ws-client occupiedTable
WS_URL=ws://localhost:8083 npm run ws-client freeTable
```
