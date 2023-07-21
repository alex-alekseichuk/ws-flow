export function randomInt(min, max, seed) {
  let x;
  if (seed) {
    x = Math.sin(seed);
    x = x - Math.floor(x);
  } else {
    x = Math.random();
  }
  return Math.floor(x * (max - min + 1)) + min;
}

