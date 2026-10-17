(() => {
// ---- 15 线条地球 (ported) ----
(() => {
const MONO = '"DejaVu Sans Mono"', DISP = '"Inter Display"';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t, seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eo = t => 1 - Math.pow(1 - t, 3);
const D2R = Math.PI / 180; const SUNV = (() => { const v = [-.78, .38, .42]; const l = Math.hypot(...v); return v.map(x => x / l); })();
const BG = [3 / 255, 4 / 255, 7 / 255], ACC = [1, .78, .48];
// camera keys [t, lon0, lat0, dist, shiftX, shiftY, focal, roll]
const CAM = [[0, 70, 4, 1.16, .25, -1.32, 1.05, .05], [2.4, 90, 10, 1.3, .27, -1.18, 1.12, .02], [6.6, 112, 24, 2.7, .34, -.02, 1.45, -.06],
  [9.6, 119, 30, 2.55, .33, .0, 1.5, -.08], [12, 121.5, 31.2, 2.05, .3, .04, 1.5, -.1]];
function cam(t) { let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const a = CAM[i], b = CAM[i + 1]; const e = ease(seg(t, a[0], b[0])); return a.slice(1).map((v, k) => lerp(v, b[k + 1], e)); }
function sph(lon, lat, r = 1) { const l = lon * D2R, p = lat * D2R; return [Math.cos(p) * Math.sin(l) * r, Math.sin(p) * r, Math.cos(p) * Math.cos(l) * r]; }
// ---------- static geometry: [x,y,z, cls] per vertex; cls: 0 graticule, 1 graticule major, 2 land, 3 coast ----------
const V = [];
function push(a, b, c) { V.push(a[0], a[1], a[2], c, b[0], b[1], b[2], c); }
for (let lat = -80; lat <= 80; lat += 10) for (let lon = -180; lon < 180; lon += 1.5) push(sph(lon, lat), sph(lon + 1.5, lat), lat % 30 === 0 ? 1 : 0);
for (let lon = -180; lon < 180; lon += 10) for (let lat = -88; lat < 88; lat += 1.5) push(sph(lon, lat), sph(lon, lat + 1.5), lon % 30 === 0 ? 1 : 0);
for (const [lon, lat] of LAND_DOTS) { const a = sph(lon, lat, 1.0015); const b = sph(lon + .55 / Math.max(.2, Math.cos(lat * D2R)), lat, 1.0015); push(a, b, 2); }
for (const ring of COAST) for (let i = 0; i < ring.length - 1; i++) { const [a, b] = [ring[i], ring[i + 1]]; if (Math.abs(a[0] - b[0]) > 90) continue; push(sph(a[0], a[1], 1.002), sph(b[0], b[1], 1.002), 3); }
const NSTAT = V.length / 4;
// ---------- network ----------
const CITY = { SHA: [121.47, 31.23], TYO: [139.69, 35.69], SIN: [103.82, 1.35], HKG: [114.17, 22.32], SYD: [151.21, -33.87], DXB: [55.27, 25.2], LON: [-.13, 51.51], PAR: [2.35, 48.86], FRA: [8.68, 50.11],
  NYC: [-74.0, 40.71], SFO: [-122.42, 37.77], LAX: [-118.24, 34.05], GRU: [-46.63, -23.55], JNB: [28.05, -26.2], BOM: [72.88, 19.08], SEL: [126.98, 37.57], MOS: [37.62, 55.76], CAI: [31.24, 30.04], MEX: [-99.13, 19.43], SCL: [-70.67, -33.45], ANC: [-149.9, 61.2], PER: [115.86, -31.95], IST: [28.98, 41.0], BKK: [100.5, 13.75] };
const NAMES = Object.keys(CITY);
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const ARCS = [];
for (let k = 0; k < 150; k++) { let a = NAMES[Math.floor(rnd() * NAMES.length)], b = NAMES[Math.floor(rnd() * NAMES.length)]; if (k % 3 === 0) a = 'SHA'; if (a === b) continue; ARCS.push({ a, b, t0: -.6 + rnd() * 11, dur: 1.4 + rnd() * 1.4, hot: rnd() < .55 }); }
function slerp(a, b, s) { const d = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)); if (d < 1e-4) return a; const sa = Math.sin((1 - s) * d) / Math.sin(d), sb = Math.sin(s * d) / Math.sin(d); return [a[0] * sa + b[0] * sb, a[1] * sa + b[1] * sb, a[2] * sa + b[2] * sb]; }
// ---------- GL ----------
function sh(t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
function prog(v, f) { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, v)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; }
const VS = `#version 300 es
precision highp float;
in vec4 a; in vec4 col; uniform mat3 M; uniform vec3 E; uniform mat3 Vw; uniform vec4 S; uniform float RO; uniform vec2 R; uniform float REV; uniform vec3 SUN; out vec4 vc;
void main(){ vec3 w = M*a.xyz; vec3 q = Vw*(w - E); float z = -q.z; if(z < .02){ gl_Position = vec4(9.); return; }
  vec2 s = q.xy/z*S.z; float cr = cos(RO), sr = sin(RO); s = mat2(cr,-sr,sr,cr)*s; s.x *= R.y/R.x; s += S.xy; gl_Position = vec4(s, 0., 1.);
  // occlusion by unit sphere
  vec3 d = w - E; float L = length(d); d /= L; float b = dot(E,d), c = dot(E,E)-1., h = b*b-c; float occ = 1.;
  if(h > 0.){ float th = -b - sqrt(h); if(th > 0. && th < L - .004) occ = .07; }
  float cls = a.w; vec3 base; float al;
  float day = smoothstep(-.12,.28, dot(normalize(w), SUN)); float hs = fract(sin(dot(a.xyz, vec3(127.1,311.7,74.7)))*43758.5);
  if(cls < .5){ base = vec3(.45,.55,.7); al = .1*mix(.35,1.,day); } else if(cls < 1.5){ base = vec3(.55,.65,.8); al = .2*mix(.35,1.,day); }
  else if(cls < 2.5){ float city = step(.86, hs)*(1.-day); base = mix(vec3(.95,.92,.86)*day, vec3(1.,.66,.3), city/(city+day+.001)); al = mix(.07,.72,day) + city*1.1; }
  else if(cls < 3.5){ base = vec3(.92,.95,1.); al = mix(.12,.85,day); }
  else { base = col.rgb; al = col.a; }
  float rv = cls < 3.5 ? REV : 1.;
  vc = vec4(base*al*occ*rv, 1.); }`;
const FS = `#version 300 es
precision highp float; in vec4 vc; out vec4 o; void main(){ o = vec4(vc.rgb, 0.); }`;
let P, bS, bD, ST = 8;
function glInit() { P = prog(VS, FS); bS = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bS);
  const a = new Float32Array(NSTAT * 8); for (let i = 0; i < NSTAT; i++) { a.set(V.slice(i * 4, i * 4 + 4), i * 8); } gl.bufferData(gl.ARRAY_BUFFER, a, gl.STATIC_DRAW); bD = gl.createBuffer(); }
function rotM(lon0, lat0) { // bring lon0/lat0 to +z (facing camera)
  const l = -lon0 * D2R, p = lat0 * D2R; const cy = Math.cos(l), sy = Math.sin(l), cp = Math.cos(p), sp = Math.sin(p);
  const Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rx = [[1, 0, 0], [0, cp, -sp], [0, sp, cp]];
  const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) m[i][j] += Rx[i][k] * Ry[k][j]; return m; }
const colMajor = m => [m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]];
const mul = (m, v) => [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2], m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2], m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];
function dyn(t) { // arcs, landing pulses, orbits -> [x,y,z,4, r,g,b,a]
  const d = []; const P2 = (p, q, c, al) => d.push(p[0], p[1], p[2], 4, c[0], c[1], c[2], al, q[0], q[1], q[2], 4, c[0], c[1], c[2], al);
  for (const A of ARCS) { const lt = (t - A.t0) / A.dur; if (lt < 0 || lt > 1.6) continue;
    const a = sph(...CITY[A.a]), b = sph(...CITY[A.b]); const ang = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)); const hgt = .03 + ang * .16;
    const head = eo(clamp(lt)), tail = clamp((lt - .35) / 1.0); const c = A.hot ? ACC : [.9, .94, 1]; const NS = 72;
    let prev = null; for (let i = 0; i <= NS; i++) { const s = tail + (head - tail) * i / NS; const p0 = slerp(a, b, s); const r = 1 + Math.sin(Math.PI * s) * hgt; const p = p0.map(v => v * r);
      if (prev) { const k = i / NS; P2(prev, p, c, (A.hot ? 1.0 : .28) * (.15 + .85 * k * k)); } prev = p; }
    if (lt > 1 && lt < 1.6) { const pr = (lt - 1) / .6; const n = b, u = Math.abs(n[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = norm(cross(u, n)), e2 = cross(n, e1); const rr = .012 + pr * .06; let q = null;
      for (let i = 0; i <= 48; i++) { const an = i / 48 * Math.PI * 2; const p = [0, 1, 2].map(k => n[k] * 1.003 + (e1[k] * Math.cos(an) + e2[k] * Math.sin(an)) * rr); if (q) P2(q, p, c, .9 * (1 - pr)); q = p; } } }
  // orbits: tilted dashed rings with satellites (leading lines through frame)
  const ORB = [[1.32, 68, 14, .7]];
  ORB.forEach(([r, tilt, rot, sp], oi) => { const ct = Math.cos(tilt * D2R), st = Math.sin(tilt * D2R), cr = Math.cos(rot * D2R), sr = Math.sin(rot * D2R); const rv = seg(t, .4 + oi * .5, 2.4 + oi * .5);
    const pt = an => { let x = Math.cos(an) * r, y = 0, z = Math.sin(an) * r; [y, z] = [y * ct - z * st, y * st + z * ct]; [x, z] = [x * cr + z * sr, -x * sr + z * cr]; return [x, y, z]; };
    const NS = 360; for (let i = 0; i < NS * rv; i++) { if (i % 3 === 2) continue; P2(pt(i / NS * 6.2832), pt((i + 1) / NS * 6.2832), [.7, .78, .9], .38); }
    const s0 = t * sp * .55 + oi * 2; for (let k = 0; k < 24; k++) { const an = s0 - k * .012; P2(pt(an), pt(an - .012), oi === 0 ? ACC : [1, 1, 1], (1 - k / 24) * .95 * rv); } });
  return new Float32Array(d); }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function norm(a) { const l = Math.hypot(...a); return a.map(v => v / l); }
let curM, curE, curC;
function drawGL(t, c) {
  const [lon0, lat0, dist, sx, sy, f, ro] = c; const M = rotM(lon0 + t * 1.5, lat0); const E = [0, 0, dist]; curM = M; curE = E; curC = c;
  gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(P);
  const u = n => gl.getUniformLocation(P, n);
  gl.uniformMatrix3fv(u('M'), false, colMajor(M)); gl.uniform3f(u('E'), ...E); gl.uniformMatrix3fv(u('Vw'), false, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
  gl.uniform4f(u('S'), sx, sy, f, 0); gl.uniform1f(u('RO'), ro); gl.uniform2f(u('R'), W, H); gl.uniform1f(u('REV'), eo(seg(t, 0, 1.2))); gl.uniform3f(u('SUN'), ...SUNV);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
  const la = gl.getAttribLocation(P, 'a'), lc = gl.getAttribLocation(P, 'col');
  gl.bindBuffer(gl.ARRAY_BUFFER, bS); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 4, gl.FLOAT, false, 32, 0); gl.enableVertexAttribArray(lc); gl.vertexAttribPointer(lc, 4, gl.FLOAT, false, 32, 16);
  // land reveal sweep: draw only a growing fraction of static lines in first 1.6s handled by REV
  gl.drawArrays(gl.LINES, 0, NSTAT);
  // dynamic geometry uses world coords already (not rotated by earth) for orbits; arcs need earth rotation -> premultiply in JS
  const dd = dyn(t); for (let i = 0; i < dd.length; i += 8) { /* arcs live on earth: keep in model space (M applied in shader) */ }
  gl.bindBuffer(gl.ARRAY_BUFFER, bD); gl.bufferData(gl.ARRAY_BUFFER, dd, gl.DYNAMIC_DRAW); gl.vertexAttribPointer(la, 4, gl.FLOAT, false, 32, 0); gl.vertexAttribPointer(lc, 4, gl.FLOAT, false, 32, 16);
  gl.drawArrays(gl.LINES, 0, dd.length / 8); gl.uniform4f(u('S'), sx + 1.6 / W, sy + 1.2 / H, f, 0); gl.drawArrays(gl.LINES, 0, dd.length / 8); gl.disable(gl.BLEND); gl.finish(); }
function projJS(p) { const w = mul(curM, p); const [lon0, lat0, dist, sx, sy, f, ro] = curC; const z = dist - w[2]; let x = w[0] / z * f, y = w[1] / z * f; [x, y] = [Math.cos(ro) * x - Math.sin(ro) * y, Math.sin(ro) * x + Math.cos(ro) * y]; x = x * H / W + sx; y += sy; return [(x * .5 + .5) * W, (1 - (y * .5 + .5)) * H, w[2] > 1.05 / dist]; }
// ---------- 2D layers ----------
function hud(t, c) { X.save(); const col = 'rgba(226,232,240,.82)', dim = 'rgba(226,232,240,.42)'; X.strokeStyle = 'rgba(226,232,240,.45)'; X.lineWidth = 1.5; const m = 40, L = 22;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, a, b]) => { X.beginPath(); X.moveTo(x, y + b * L); X.lineTo(x, y); X.lineTo(x + a * L, y); X.stroke(); });
  X.font = `500 15px ${MONO}`; X.fillStyle = col; X.fillText("MOTION REEL — '26", 66, 82); X.fillStyle = dim; X.font = `500 13px ${MONO}`;
  const lon = ((c[0] + t * 1.5 + 540) % 360) - 180; X.fillText(`LON ${Math.abs(lon).toFixed(2).padStart(6, ' ')}°${lon >= 0 ? 'E' : 'W'}   LAT ${Math.abs(c[1]).toFixed(2).padStart(5, ' ')}°${c[1] >= 0 ? 'N' : 'S'}   ALT ${((c[2] - 1) * 6371).toFixed(0).padStart(5, ' ')} KM`, 66, 106);
  const f = Math.floor(t * 30); X.textAlign = 'right'; X.font = `500 15px ${MONO}`; X.fillStyle = col; X.fillText(`TC 00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`, W - 66, 82);
  X.fillText('1920×1080 · 30 FPS', W - 66, H - 74); X.textAlign = 'left'; X.fillStyle = `rgb(${ACC.map(v => v * 255 | 0)})`; X.fillRect(66, H - 86, 9, 9); X.fillStyle = col; X.fillText('04 / 08   NETWORK', 86, H - 74);
  X.fillStyle = 'rgba(226,232,240,.16)'; X.fillRect(66, H - 54, W - 132, 1.5); X.fillStyle = 'rgba(226,232,240,.75)'; X.fillRect(66, H - 54, (W - 132) * (.375 + t / DUR * .125), 1.5); X.restore(); }
function title(t) { const a = eo(seg(t, .6, 1.6)); if (a <= 0) return; X.save(); X.globalAlpha = a * (1 - seg(t, 7.2, 8.0));
  X.fillStyle = 'rgba(226,232,240,.5)'; X.font = `500 14px ${MONO}`; X.fillText('FIG. 04 — TERRA', 120, 360);
  X.fillStyle = '#EEF2F7'; X.font = `200 150px ${DISP}`; const dx = (1 - a) * -40; X.fillText('TERRA', 112 + dx, 500); X.font = `800 150px ${DISP}`; X.fillStyle = `rgb(${ACC.map(v => v * 255 | 0)})`; X.fillText('NET', 112 + dx, 640);
  X.fillStyle = 'rgba(226,232,240,.55)'; X.font = `500 13px ${MONO}`; const n = Math.floor(lerp(0, 2481, eo(seg(t, .6, 6))));
  ['14,816 LAND SAMPLES · 0.9° GRID', `${String(n).padStart(4, '0')} ROUTES ACTIVE`, '3 ORBITAL SHELLS'].forEach((s, i) => X.fillText(s, 120, 700 + i * 24));
  X.fillStyle = 'rgba(226,232,240,.3)'; X.fillRect(120, 676, 300 * a, 1); X.restore(); }
function pins(t) { // labels for cities that are on front side
  const show = seg(t, 2.2, 3.0) * (1 - seg(t, 7.4, 8.0)); if (show <= 0) return; X.save(); X.font = `500 12px ${MONO}`;
  for (const k of ['TYO', 'SIN', 'DXB', 'SYD', 'BOM', 'LON', 'FRA', 'HKG']) { const [x, y, front] = projJS(sph(...CITY[k], 1.003)); if (!front || x < 820) continue;
    X.globalAlpha = show; X.strokeStyle = 'rgba(226,232,240,.7)'; X.lineWidth = 1; X.beginPath(); X.moveTo(x, y); X.lineTo(x + 26, y - 26); X.lineTo(x + 70, y - 26); X.stroke(); X.fillStyle = 'rgba(226,232,240,.85)'; X.fillText(k, x + 30, y - 32);
    X.beginPath(); X.arc(x, y, 3, 0, 7); X.fillStyle = '#fff'; X.fill(); } X.restore(); }
function lock(t) { // final target lock on Shanghai
  const a = seg(t, 9.8, 10.6); if (a <= 0) return; const [x, y] = projJS(sph(...CITY.SHA, 1.003)); X.save(); const acc = `rgba(${ACC.map(v => v * 255 | 0)},`;
  const r = lerp(140, 34, eo(a)); X.strokeStyle = acc + '.95)'; X.lineWidth = 1.5; const L = 12;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { X.beginPath(); X.moveTo(x + sx * r, y + sy * (r - L)); X.lineTo(x + sx * r, y + sy * r); X.lineTo(x + sx * (r - L), y + sy * r); X.stroke(); });
  X.beginPath(); X.moveTo(x - 6, y); X.lineTo(x + 6, y); X.moveTo(x, y - 6); X.lineTo(x, y + 6); X.stroke();
  const b = seg(t, 10.5, 11.1); X.globalAlpha = b; X.strokeStyle = 'rgba(226,232,240,.75)'; X.beginPath(); X.moveTo(x + 34, y - 34); X.lineTo(x + 120, y - 120); X.lineTo(x + 120 + 260 * b, y - 120); X.stroke();
  X.fillStyle = '#EEF2F7'; X.font = `500 18px ${MONO}`; X.fillText('SHANGHAI  ·  SHA', x + 128, y - 132); X.fillStyle = 'rgba(226,232,240,.55)'; X.font = `500 13px ${MONO}`; X.fillText('31.2304° N   121.4737° E', x + 128, y - 104);
  X.fillStyle = acc + '1)'; X.fillText(`${Math.floor(lerp(0, 24, b))} LINKS · LATENCY ${(lerp(0, 38.4, b)).toFixed(1)} MS`, x + 128, y - 84); X.restore(); }
function endType(t) { const a = eo(seg(t, 10.2, 11.2)); if (a <= 0) return; X.save(); X.globalAlpha = a; X.fillStyle = '#EEF2F7'; X.font = `200 92px ${DISP}`; X.fillText('Every place,', 120, 300 + (1 - a) * 30);
  X.font = `800 92px ${DISP}`; X.fillText('one signal.', 120, 400 + (1 - a) * 40); X.restore(); }
  function atmo(t, cx, cy, rr) { const sd = [SUNV[0], -SUNV[1]]; const sl = Math.hypot(...sd); const ux = sd[0] / sl, uy = sd[1] / sl;
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H; const o = oc.getContext('2d');
    const g = o.createRadialGradient(cx, cy, rr * .985, cx, cy, rr * 1.16); g.addColorStop(0, 'rgba(120,190,255,0)'); g.addColorStop(.06, 'rgba(150,205,255,.95)'); g.addColorStop(.22, 'rgba(80,140,255,.35)'); g.addColorStop(1, 'rgba(40,80,200,0)'); o.fillStyle = g; o.beginPath(); o.arc(cx, cy, rr * 1.16, 0, 7); o.arc(cx, cy, rr * .985, 0, 7, true); o.fill();
    o.globalCompositeOperation = 'destination-in'; const m = o.createLinearGradient(cx + ux * rr, cy + uy * rr, cx - ux * rr * .6, cy - uy * rr * .6); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(.55, 'rgba(0,0,0,.25)'); m.addColorStop(1, 'rgba(0,0,0,.06)'); o.fillStyle = m; o.fillRect(0, 0, W, H);
    X.save(); X.globalCompositeOperation = 'lighter'; X.drawImage(oc, 0, 0);
    const fx = cx + ux * rr * 1.004, fy = cy + uy * rr * 1.004; const fa = (.55 + .45 * Math.sin(t * .7)) * (1 - seg(t, 9, 12) * .5);
    const fg = X.createRadialGradient(fx, fy, 0, fx, fy, 260); fg.addColorStop(0, `rgba(255,248,235,${.95 * fa})`); fg.addColorStop(.08, `rgba(255,220,170,${.5 * fa})`); fg.addColorStop(1, 'rgba(255,180,120,0)'); X.fillStyle = fg; X.fillRect(fx - 260, fy - 260, 520, 520);
    const sg = X.createLinearGradient(fx - 900, fy, fx + 900, fy); sg.addColorStop(0, 'rgba(150,200,255,0)'); sg.addColorStop(.5, `rgba(200,225,255,${.55 * fa})`); sg.addColorStop(1, 'rgba(150,200,255,0)'); X.fillStyle = sg; X.fillRect(fx - 900, fy - 1.5, 1800, 3);
    X.restore(); }
  let inited = false;
  SCENES.push({ key: 'GLOBE', no: 15, cn: '线条地球', en: 'Every place, one signal', tagline: 'LINE GLOBE', side: 'L', theme: 'dark', accent: '255,107,43', hudline: 'LAND 14,816 PTS   ROUTES 150   SUN 34°',
    desc: '经纬网、细点陆地和海岸线组成的地球，橙色航线不断升起，镜头推近，最后锁定上海。', tags: ['经纬线与陆地从暗处亮起', '航线弧从各城市发出、落地', '镜头推近地平线，锁定上海'], pal: ['#030407', '#DDE6F0', '#78B4FF', '#FFC27A'],
    render(lt) { if (!inited) { glInit(); inited = true; } const t = lt * 1.5; const c = cam(t);
      drawGL(t, c); X.fillStyle = `rgb(${BG.map(v => v * 255 | 0)})`; X.fillRect(0, 0, W, H); { const sr = rng(31); for (let k = 0; k < 420; k++) { const b = sr(); X.fillStyle = `rgba(220,230,255,${b * b * .7})`; const sz = b > .92 ? 2 : 1.2; X.fillRect(sr() * W, sr() * H, sz, sz); } } X.save(); X.globalCompositeOperation = 'lighter'; X.drawImage(glc, 0, 0); X.restore();
      const [lon0, lat0, dist, sx, sy, f, ro] = c; const rr = f / Math.sqrt(dist * dist - 1) * H / 2; const cx = (sx * .5 + .5) * W, cy = (1 - (sy * .5 + .5)) * H;
      atmo(t, cx, cy, rr);
      const v = X.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, W * .72); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); X.fillStyle = v; X.fillRect(0, 0, W, H);
      lock(t); const sg = X.createLinearGradient(0, 0, 820, 0); sg.addColorStop(0, 'rgba(7,9,13,.7)'); sg.addColorStop(1, 'rgba(7,9,13,0)'); X.fillStyle = sg; X.fillRect(0, 0, 820, H); grain(X, .05); } });
})();

})();
