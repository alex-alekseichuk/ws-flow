import EventEmitter from 'events';
import {randomInt} from "../common/utils.js";

export function generatePlayer(playerId) {
  return {
    playerId: String(playerId),
    name: `Test-Player-${playerId}`,
    balanceAtCents: randomInt(1000, 10_000, playerId),
  }
}

export function playersGenerator() {
  const emitter = new EventEmitter();

  let interval;
  let playerId = 0;

  emitter.start = () => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      emitter.emit('player', generatePlayer(++playerId));
    }, 1000);
  };

  emitter.stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  return emitter;
}
