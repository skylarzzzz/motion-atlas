// ---------- 3D projection + shared helpers for round-6 styles ----------
const V3 = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]), norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
// camera: eye, target, vertical fov (deg), roll (rad), optional lens shift [sx,sy] in px
function cam3(eye, tgt, fov, roll = 0, shift = [0, 0]) {
  const f = V3.norm(V3.sub(tgt, eye)); let r = V3.norm(V3.cross(f, [0, 1, 0])); let u = V3.cross(r, f);
  const cr = Math.cos(roll), sr = Math.sin(roll); const r2 = V3.add(V3.mul(r, cr), V3.mul(u, sr)), u2 = V3.sub(V3.mul(u, cr), V3.mul(r, sr));
  const k = (H / 2) / Math.tan(fov * Math.PI / 360);
  const P = p => { const d = V3.sub(p, eye); const z = V3.dot(d, f); return [W / 2 + shift[0] + V3.dot(d, r2) / z * k, H / 2 + shift[1] - V3.dot(d, u2) / z * k, z]; };
  P.eye = eye; P.f = f; P.r = r2; P.u = u2; P.k = k; return P; }
// polyline in 3D with per-segment alpha callback; clips segments behind camera
function line3(c, P, pts, near = .05) { c.beginPath(); let pen = false; for (const p of pts) { const s = P(p); if (s[2] < near) { pen = false; continue; } if (!pen) { c.moveTo(s[0], s[1]); pen = true; } else c.lineTo(s[0], s[1]); } c.stroke(); }
const lerpC = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const clamp01 = x => Math.max(0, Math.min(1, x));
const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
// editorial label block: number + EN title + CN subtitle + meta line
function plate(c, x, y, no, en, cn, meta, col = '#fff', dim = 'rgba(255,255,255,.55)', size = 64, weight = '300') {
  c.save(); c.fillStyle = dim; font(c, '500', 11, F.mono); c.fillText(no, x, y);
  c.fillStyle = col; font(c, weight, size, F.disp); c.letterSpacing = `${-size * .03}px`; c.fillText(en, x - 3, y + size * .95); c.letterSpacing = '0px';
  font(c, '400', 15, F.sans); c.fillText(cn, x, y + size * .95 + 30); c.fillStyle = dim; font(c, '500', 10, F.mono); c.fillText(meta, x, y + size * .95 + 52); c.restore(); }
function ticks(c, x, y, w, col, n = 40) { c.save(); c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= n; i++) { const xx = x + w * i / n; c.moveTo(xx, y); c.lineTo(xx, y - (i % 10 === 0 ? 9 : i % 5 === 0 ? 6 : 3)); } c.stroke(); c.restore(); }
// simple 2D value noise
const _perm = (() => { const r = rng(99), p = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p.concat(p); })();
function vnoise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const g = (i, j) => _perm[(_perm[(xi + i) & 255] + yi + j) & 255] / 255; return (g(0, 0) * (1 - u) + g(1, 0) * u) * (1 - v) + (g(0, 1) * (1 - u) + g(1, 1) * u) * v; }
function fbm2(x, y, o = 4) { let s = 0, a = .5; for (let i = 0; i < o; i++) { s += a * vnoise(x, y); x = x * 2.03 + 17.1; y = y * 2.03 + 3.7; a *= .5; } return s; }
const seg = (t, a, b) => clamp01((t - a) / (b - a));
