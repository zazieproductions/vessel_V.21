export const pointer = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
};

export const scroll = {
  y: 0,
};

export function writePointer(x: number, y: number, vx: number, vy: number) {
  pointer.x = x;
  pointer.y = y;
  pointer.vx = vx;
  pointer.vy = vy;
}

export function writeScroll(y: number) {
  scroll.y = y;
}
