export function controller(wss) {
  const requests = {};
  const players = {};

  return {
    subscribe: (ws, request) => {
      requests[ws] = {request, ws};
    },

    unsubscribe: ws => {
      delete requests[ws];
    },

    processPlayer: player => {
      players[player.playerId] = player;
      const offlinePlayers = JSON.stringify({offlinePlayers: player});
      Object.values(requests).forEach(({ws, request}) => {
        if (request.type === 'offlinePlayers') {
          ws.send(offlinePlayers);
        }
      });
    },

    processGame: game => {
      const occupiedTable = JSON.stringify({
        occupiedTable: {
          gameType: game.gameType,
          bbAtCents: game.bbAtCents,
          anteAtCents: game.anteAtCents,
          organizationId: game.organizationId,
          size: game.size,
          occupiedSeatsCount: game.seats.length
        }
      });
      const freeTable = JSON.stringify({
        freeTable: {
          gameType: game.gameType,
          bbAtCents: game.bbAtCents,
          anteAtCents: game.anteAtCents,
          organizationId: game.organizationId,
          size: game.size,
        }
      });
      const inGamePlayers = JSON.stringify({
        inGamePlayers: game.seats.map(seat => ({
          playerId: seat.playerId,
          name: players[seat.playerId],
          totalOnlineTables: 0,
          organizations: [],
        })),
      });

      Object.values(requests).forEach(({request, ws}) => {
        if (request.type === 'occupiedTable' && game.seats.length > 0) {
          ws.send(occupiedTable);
        }
        if (request.type === 'freeTable' && game.seats.length === 0) {
          ws.send(freeTable);
        }
        if (request.type === 'inGamePlayers') {
          ws.send(inGamePlayers);
        }
      });
    },
  }
}
