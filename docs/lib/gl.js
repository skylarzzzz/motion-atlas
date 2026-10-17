// ---------- shared WebGL + 2D harness for style key frames ----------
let W = 1920, H = 1080;
const glc = document.createElement('canvas'); glc.width = W; glc.height = H;
const gl = glc.getContext('webgl2', { preserveDrawingBuffer: true, antialias: true, premultipliedAlpha: true, alpha: true });
const ov = document.createElement('canvas'); ov.width = W; ov.height = H; const O = ov.getContext('2d');
const out = document.getElementById('out'); out.width = W; out.height = H; const X = out.getContext('2d');
const F = { sans: '"Noto Sans CJK SC"', serif: '"Noto Serif CJK SC"', inter: 'Inter', disp: '"Inter Display"', mono: '"DejaVu Sans Mono"', lora: 'Lora' };
const STYLES = [];
function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n')); return s; }
function prog(vs, fs) { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; }
const QVS = `#version 300 es
in vec2 P; out vec2 uv; void main(){ uv = P*.5+.5; gl_Position = vec4(P,0.,1.); }`;
const COMMON = `#version 300 es
precision highp float;
uniform vec2 R; uniform float T;
float h1(float n){ return fract(sin(n)*43758.5453123); }
float h31(vec3 p){ p = fract(p*.3183099+.1); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float n3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*n3(p); p=p*2.02+vec3(1.7,9.2,3.1); a*=.5; } return s; }
mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
`;
const quadBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
function drawQuad(p, uni = {}) {
  gl.useProgram(p); const loc = gl.getAttribLocation(p, 'P'); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  setU(p, uni); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); gl.disableVertexAttribArray(loc);
}
function setU(p, uni) { for (const k in uni) { const l = gl.getUniformLocation(p, k); if (!l) continue; const v = uni[k]; if (typeof v === 'number') gl.uniform1f(l, v); else if (v.length === 2) gl.uniform2fv(l, v); else if (v.length === 3) gl.uniform3fv(l, v); else if (v.length === 4) gl.uniform4fv(l, v); } }
const idBufs = {};
function drawPoints(p, n, uni = {}, additive = true) {
  if (!idBufs[n]) { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = i; gl.bufferData(gl.ARRAY_BUFFER, a, gl.STATIC_DRAW); idBufs[n] = b; }
  gl.useProgram(p); const loc = gl.getAttribLocation(p, 'id'); gl.bindBuffer(gl.ARRAY_BUFFER, idBufs[n]); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, 0, 0);
  setU(p, uni); gl.enable(gl.BLEND); if (additive) gl.blendFunc(gl.ONE, gl.ONE); else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.drawArrays(gl.POINTS, 0, n); gl.disable(gl.BLEND); gl.disableVertexAttribArray(loc);
}
function glClear(r = 0, g = 0, b = 0, a = 1) { gl.viewport(0, 0, W, H); gl.clearColor(r, g, b, a); gl.clear(gl.COLOR_BUFFER_BIT); }
// ---------- 2D helpers ----------
function font(c, w, s, f) { c.font = `${w} ${s}px ${f}`; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const GRAIN = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), d = g.createImageData(256, 256), r = rng(7); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
function grain(c, a = .06, mode = 'overlay') { c.save(); c.globalAlpha = a; c.globalCompositeOperation = mode; c.fillStyle = c.createPattern(GRAIN, 'repeat'); c.fillRect(0, 0, W, H); c.restore(); }
function vignette(c, a = .5, col = '0,0,0') { const g = c.createRadialGradient(W / 2, H / 2, W * .25, W / 2, H / 2, W * .72); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function hud(c, opts = {}) { // viewfinder chrome like the reference
  const col = opts.col || 'rgba(255,255,255,.75)', dim = opts.dim || 'rgba(255,255,255,.4)'; c.save(); c.strokeStyle = col; c.lineWidth = 1.2; const m = 26, L = 18;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, a, b]) => { c.beginPath(); c.moveTo(x, y + b * L); c.lineTo(x, y); c.lineTo(x + a * L, y); c.stroke(); });
  font(c, '500', 11, F.mono); c.fillStyle = col; c.fillText(opts.tl || '', 44, 52); c.fillStyle = dim; c.fillText(opts.tl2 || '', 44, 70);
  c.textAlign = 'right'; c.fillStyle = col; c.fillText(opts.tr || '', W - 44, 52); c.textAlign = 'left';
  c.fillStyle = col; c.fillText(opts.bl || '', 44, H - 40); c.textAlign = 'right'; c.fillText(opts.br || '', W - 44, H - 40); c.textAlign = 'left';
  c.fillStyle = dim; c.fillRect(44, H - 30, W - 88, 1); c.fillStyle = col; c.fillRect(44, H - 30, (W - 88) * (opts.prog || .3), 1);
  c.restore(); }
function callout(c, x, y, x2, y2, lines, col = 'rgba(255,255,255,.85)') { c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1; c.beginPath(); c.arc(x, y, 3, 0, 7); c.stroke(); c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.lineTo(x2 + 120, y2); c.stroke();
  font(c, '500', 11, F.mono); lines.forEach((s, i) => c.fillText(s, x2 + 4, y2 - 8 - (lines.length - 1 - i) * 15)); c.restore(); }
window.renderStyle = function (i, t) { const s = STYLES[i]; X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; O.setTransform(1, 0, 0, 1, 0, 0); O.clearRect(0, 0, W, H); gl.viewport(0, 0, W, H); s.render(t); gl.finish(); return s.name; };
window.ready = (async () => { await Promise.all(['900 40px "Noto Sans CJK SC"', '400 40px "Noto Sans CJK SC"', 'bold 40px "Noto Serif CJK SC"', '900 40px Inter', '600 40px Inter', '100 40px "Inter Display"', '900 40px "Inter Display"', '300 40px "Inter Display"', 'italic 400 40px Lora', '500 40px "DejaVu Sans Mono"'].map(s => document.fonts.load(s, '字Aa1'))); return true; })();
// ---------- render-to-texture + depth-of-field post ----------
function makeFBO() { const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null); return { fb, tex }; }
let FBO_A = null, DOFP = null;
const DOF_FS = `#version 300 es
precision highp float; in vec2 uv; out vec4 o; uniform sampler2D S; uniform vec2 R; uniform float F, RG, MR;
float coc(float d){ return clamp(abs(d-F)/RG,0.,1.)*MR; }
void main(){ vec4 c0 = texture(S, uv); float cc = coc(c0.a); vec3 acc = c0.rgb; float wsum = 1.;
  for(int i=1;i<96;i++){ float fi = float(i); float r = sqrt(fi/96.)*MR; float a = fi*2.39996; vec2 off = vec2(cos(a),sin(a))*r/R; vec4 s = texture(S, uv+off); float cs = coc(s.a);
    float w = smoothstep(r-1.5, r+1.5, min(cs, s.a < c0.a ? cs : max(cc, cs))); acc += s.rgb*w; wsum += w; }
  o = vec4(acc/wsum, 1.); }`;
// render a raymarch program (alpha = normalized depth) then apply DOF; focus/range in the same normalized depth units
function drawDOF(p, uni, focus, range, maxR) {
  if (!FBO_A) { FBO_A = makeFBO(); DOFP = prog(QVS, DOF_FS); }
  gl.bindFramebuffer(gl.FRAMEBUFFER, FBO_A.fb); gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); drawQuad(p, uni);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, FBO_A.tex);
  gl.useProgram(DOFP); gl.uniform1i(gl.getUniformLocation(DOFP, 'S'), 0); drawQuad(DOFP, { R: [W, H], F: focus, RG: range, MR: maxR }); }
// 2D helpers for depth composition
function blurLayer(src, px) { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.filter = `blur(${px}px)`; g.drawImage(src, 0, 0); return c; }
function tiltShift(c, px, band0, band1) { const b = blurLayer(out, px); const m = document.createElement('canvas'); m.width = W; m.height = H; const g = m.getContext('2d'); g.drawImage(b, 0, 0);
  g.globalCompositeOperation = 'destination-in'; const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(band0, 'rgba(0,0,0,0)'); gr.addColorStop(band1, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); c.drawImage(m, 0, 0); }
function bokeh(c, seed, n, col, rmin, rmax, region) { const r = rng(seed); c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < n; i++) { const x = region[0] + r() * region[2], y = region[1] + r() * region[3], rad = rmin + r() * (rmax - rmin);
  const g = c.createRadialGradient(x, y, rad * .2, x, y, rad); g.addColorStop(0, col.replace('A', (.25 + r() * .3).toFixed(2))); g.addColorStop(.85, col.replace('A', (.18 + r() * .2).toFixed(2))); g.addColorStop(1, col.replace('A', '0')); c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill(); } c.restore(); }
