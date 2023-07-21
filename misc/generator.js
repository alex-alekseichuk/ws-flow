import EventEmitter from 'events';

export function generator() {
  const emitter = new EventEmitter();

  let interval;

  emitter.start = () => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      emitter.emit('record', {timestamp: new Date().toISOString()})
    }, 3000);
  };
  emitter.stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };
  return emitter;
}
