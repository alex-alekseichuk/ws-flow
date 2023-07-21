import EventEmitter from 'events';
import {generatePlayer} from "../players/players-generator.js";

function generateSeat(playerId) {
  const player = generatePlayer(playerId);
  return {
    playerId: String(playerId),
    // half of player balance
    stackAtCents: Math.floor(player.balanceAtCents / 2),
    // 2 of 52 cards in the row
    cards: [String(playerId % 52), String((playerId + 1) % 52)],
  };
}

let organizationId = 0;
function generateGame() {
  organizationId++;
  return {
    gameType: organizationId % 2 ? 'NLH' : 'PLO', // Texas Holdem or Omaha
    bbAtCents: organizationId % 2 ? 200 : 0,
    anteAtCents: organizationId % 2 ? 0 : 100,
    organizationId: String(organizationId),
    size: 9,
    seats: organizationId % 3 ? [
      // 2 players take 2 seats
      generateSeat(organizationId * 4 - 3),
      generateSeat(organizationId * 4 - 1),
    ] : [],
  };
}

export function gamesGenerator() {
  const emitter = new EventEmitter();

  let interval;

  emitter.start = () => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      emitter.emit('game', generateGame());
    }, 4000);
  };

  emitter.stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  return emitter;
}
