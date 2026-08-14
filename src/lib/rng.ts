/** Seeded PRNG — mulberry32 + string hash. Same seed, same organism. */

export function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RNG = () => number;

export function rngFrom(seed: number | string, ...salt: Array<number | string>): RNG {
  let s = typeof seed === 'string' ? hashString(seed) : seed >>> 0;
  for (const x of salt) {
    const n = typeof x === 'string' ? hashString(x) : x >>> 0;
    s = (Math.imul(s ^ n, 0x9e3779b9) + 0x85ebca6b) >>> 0;
  }
  return mulberry32(s || 1);
}

export function pick<T>(rand: RNG, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

export function pickN<T>(rand: RNG, arr: readonly T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function range(rand: RNG, min: number, max: number): number {
  return min + rand() * (max - min);
}

export function irange(rand: RNG, min: number, max: number): number {
  return Math.floor(range(rand, min, max + 1));
}

export function chance(rand: RNG, p: number): boolean {
  return rand() < p;
}

export function hexSeed(n = 6): string {
  const alphabet = '0123456789ABCDEF';
  let s = '';
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  for (let i = 0; i < n; i++) s += alphabet[a[i] % 16];
  return s;
}

export function padHex(n: number, len = 6): string {
  return (n >>> 0).toString(16).toUpperCase().padStart(len, '0').slice(-len);
}
