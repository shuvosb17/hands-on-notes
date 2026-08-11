const C = (r, g, b, a = 1) => ({ r, g, b, a });

const clampf = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

const lerpf = (a, b, t) => a + (b - a) * t;

const smoothstep = (e0, e1, x) => {
  const t = clampf((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

const mixColor = (a, b, t) => {
  const k = clampf(t, 0, 1);
  return C(
    lerpf(a.r, b.r, k),
    lerpf(a.g, b.g, k),
    lerpf(a.b, b.b, k),
    lerpf(a.a, b.a, k),
  );
};

const css = (c, alphaScale = 1) =>
  `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${clampf(c.a * alphaScale, 0, 1).toFixed(3)})`;

const SCALE = 200;
const SX = (x) => (x + 2.2) * SCALE;
const SY = (y) => (1.1 - y) * SCALE;
const PI = Math.PI;

const STAR_COUNT = 42;

const STARS = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed;
  };
  return Array.from({ length: STAR_COUNT }, () => ({
    x: -1.9 + (rnd() % 380) / 100,
    y: 0.1 + (rnd() % 85) / 100,
    s: 0.0035 + (rnd() % 8) / 4000,
    phase: (rnd() % 628) / 100,
  }));
})();
