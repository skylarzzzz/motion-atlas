// ===== BATCH 5 =====
// 39 彩绘玻璃
(() => { let Pg; const FS = COMMON + `in vec2 uv; out vec4 o;
  vec2 h22(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
  void main(){ vec2 p = (uv*R - vec2(.68,.42)*R)/R.y; vec2 q = p; float arch = max(abs(q.x)-.32, -1.); float top = length(q - vec2(0.,.25)) - .32; float inside = step(max(arch, q.y>.25 ? top : -1.), 0.)*step(-.5, q.y);
    vec3 col = vec3(0.); if(inside > .5){ vec2 s = q*9.; vec2 n = floor(s), f = fract(s); float m1 = 9., m2 = 9.; vec2 id; for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g = vec2(i,j); vec2 r = g + h22(n+g)*.9 - f; float d = dot(r,r); if(d<m1){ m2 = m1; m1 = d; id = n+g; } else if(d<m2) m2 = d; }
      float lead = smoothstep(.08,.13, sqrt(m2)-sqrt(m1)); float k = h22(id).x; vec3 g = k<.3 ? vec3(.08,.2,.65) : k<.5 ? vec3(.7,.08,.12) : k<.7 ? vec3(.95,.65,.12) : k<.85 ? vec3(.1,.5,.35) : vec3(.55,.2,.6);
      g *= .55 + .5*fbm(vec3(q*30.,1.)); g *= .85 + .3*sin(T*.8 + id.x*.7); float lit = smoothstep(0.,.35, T*.42 - h22(id).y*.5 - (.5 - q.y)*.75 - abs(q.x)*.3); col = g*lead*.95*(.06 + .94*lit) + vec3(1.,.95,.8)*lead*smoothstep(.35,0.,abs(T*.42 - h22(id).y*.5 - (.5 - q.y)*.75 - abs(q.x)*.3 - .05))*.35; float frame = smoothstep(.01,.0, abs(max(arch, q.y>.25?top:-1.))-.01); }
    o = vec4(col, inside); }`;
  ST.push({ key: 'GLASS', cn: '彩绘玻璃', en: 'Stained glass', cat: 'space', desc: '哥特式尖拱窗里的彩绘玻璃被阳光点亮，彩色光柱斜射到石地上，空气里浮着微尘。', render(lt) { if (!Pg) Pg = prog(QVS, FS);
    X.fillStyle = '#16120F'; X.fillRect(0, 0, W, H); const fl = X.createLinearGradient(0, 700, 0, H); fl.addColorStop(0, '#2A221C'); fl.addColorStop(1, '#3E342B'); X.fillStyle = fl; X.fillRect(0, 760, W, 320);
    glClear(0, 0, 0, 0); drawQuad(Pg, { R: [W, H], T: lt }); X.drawImage(glc, 0, 0);
    X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = clamp01((lt - 1.2) / 3); const cols = ['rgba(60,100,255,', 'rgba(255,60,70,', 'rgba(255,190,60,', 'rgba(60,220,140,']; for (let k = 0; k < 4; k++) { const x0 = 1150 + k * 90, x1 = x0 + 90; const g = X.createLinearGradient(x0, 400, x0 - 500, 1000); g.addColorStop(0, cols[k] + '.22)'); g.addColorStop(1, cols[k] + '0)'); X.fillStyle = g; X.beginPath(); X.moveTo(x0, 420); X.lineTo(x1, 420); X.lineTo(x1 - 640, 1000); X.lineTo(x0 - 640, 1000); X.fill();
      X.fillStyle = cols[k] + '.35)'; X.beginPath(); X.ellipse(x0 - 600, 990, 70, 18, 0, 0, 7); X.fill(); } const r = rng(3); for (let i = 0; i < 260; i++) { X.fillStyle = `rgba(255,240,210,${r() * .5})`; X.fillRect(700 + r() * 900 + Math.sin(lt + i) * 4, 380 + r() * 600, 2, 2); } X.restore();
    X.strokeStyle = '#0B0806'; X.lineWidth = 18; const cx = W * .68, cy = H * .58, s = H; X.beginPath(); X.moveTo(cx - .32 * s, cy + .5 * s); X.lineTo(cx - .32 * s, cy - .25 * s); X.arc(cx, cy - .25 * s, .32 * s, Math.PI, 0); X.lineTo(cx + .32 * s, cy + .5 * s); X.stroke(); grain(X, .06); } }); })();
// 40 雨落池塘
shaderStyle({ key: 'RAINPOND', cn: '雨落池塘', en: 'Rain on the pond', cat: 'nature', desc: '俯视雨中的池塘，雨点落下的同心波纹互相干涉，几片荷叶和锦鲤的影子在水下游过。' }, `in vec2 uv; out vec4 o;
  vec2 h22(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
  void main(){ vec2 p = (uv*R-.5*R)/R.y; float hgt = 0.; for(int j=-2;j<=2;j++) for(int i=-2;i<=2;i++){ vec2 cell = floor(p*3.) + vec2(i,j); vec2 rnd = h22(cell); float t0 = rnd.x*3.; float tt = mod(T + t0, 3.); vec2 c = (cell + h22(cell+5.))/3.; float d = length(p-c); float rr = tt*.18; hgt += sin((d-rr)*110.)*exp(-abs(d-rr)*30.)*exp(-tt*.9)*1.1; }
    vec3 water = mix(vec3(.04,.1,.12), vec3(.08,.2,.22), uv.y); vec2 kp = p - vec2(.35+.25*sin(T*.3), .1*cos(T*.4)); kp = rot(T*.3)*kp; float koi = smoothstep(.02,0., length(kp*vec2(1.,3.2))-.1); water = mix(water, vec3(.85,.35,.12)*.6, koi*.7);
    vec3 col = water + vec3(.55,.7,.75)*clamp(hgt,0.,1.)*.6 - .1*clamp(-hgt,0.,1.); col += vec3(.7,.8,.85)*pow(max(hgt,0.),3.)*.5;
    for(int k=0;k<3;k++){ vec2 lc = vec2(.15 + float(k)*.32, -.18 + float(k)*.17); float ld = length(p-lc) - (.14 - float(k)*.03); float notch = step(abs(atan(p.y-lc.y,p.x-lc.x) - 1.), .15); float pad = step(ld, 0.)*(1.-notch); col = mix(col, mix(vec3(.16,.36,.18), vec3(.24,.46,.22), smoothstep(.0,.14,length(p-lc))) * (.92+.08*sin(atan(p.y-lc.y,p.x-lc.x)*22.)), pad); }
    o = vec4(col,1.); }`, () => grain(X, .05));
// 41 雷暴闪电
st2D({ key: 'LIGHTNING', cn: '雷暴闪电', en: 'Lightning', cat: 'nature', desc: '紫黑色的雷暴云里，一道分叉闪电劈下来，瞬间照亮云层的轮廓，再慢慢熄灭。' }, (lt) => {
  const ph = lt % 2.6; const flash = Math.exp(-ph * 4) * (ph > .05 ? 1 : ph * 20); const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0B0716'); g.addColorStop(1, '#1A1030'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  const r0 = rng(2); for (let i = 0; i < 70; i++) { const x = r0() * W, y = r0() * 420, rr = 120 + r0() * 260; const cg = X.createRadialGradient(x, y, 0, x, y, rr); cg.addColorStop(0, `rgba(${90 + 160 * flash},${70 + 150 * flash},${140 + 115 * flash},${.25})`); cg.addColorStop(1, 'rgba(40,30,70,0)'); X.fillStyle = cg; X.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  const seed = Math.floor(lt / 2.6) + 4; const bolt = (x, y, ang, len, w, depth, r) => { if (depth > 6 || len < 8) return; let px = x, py = y; X.lineWidth = w; X.beginPath(); X.moveTo(px, py); const n = 10; for (let i = 0; i < n; i++) { ang += (r() - .5) * .7; px += Math.cos(ang) * len / n; py += Math.sin(ang) * len / n; X.lineTo(px, py); if (r() < .22) { const sa = ang + (r() < .5 ? -1 : 1) * (.4 + r() * .5); X.stroke(); bolt(px, py, sa, len * .45, w * .55, depth + 1, r); X.lineWidth = w; X.beginPath(); X.moveTo(px, py); } } X.stroke(); };
  X.save(); X.globalCompositeOperation = 'lighter'; X.lineCap = 'round'; X.strokeStyle = `rgba(190,170,255,${.35 * flash + .02})`; X.filter = 'none'; X.lineJoin = 'round'; bolt(1320, 200, 1.6, 820, 18, 0, rng(seed)); X.strokeStyle = `rgba(255,255,255,${flash})`; bolt(1320, 200, 1.6, 820, 4, 0, rng(seed)); X.restore();
  X.fillStyle = `rgba(200,190,255,${flash * .12})`; X.fillRect(0, 0, W, H); X.fillStyle = '#05030A'; X.beginPath(); X.moveTo(0, H); for (let x = 0; x <= W; x += 8) X.lineTo(x, 1000 - fbm2(x * .003, 5, 4) * 120); X.lineTo(W, H); X.fill(); grain(X, .06); });
// 42 年轮
shaderStyle({ key: 'TREERING', cn: '年轮', en: 'Tree rings', cat: 'nature', desc: '一截木头的横截面，年轮从中心一圈圈长出来，裂纹顺着木纹放射，暖色木纹像指纹一样独一无二。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R - vec2(.66,.5)*R)/R.y; float a = atan(p.y,p.x); float r = length(p*vec2(1.,1.08)) + .025*fbm(vec3(p*4.,1.)) + .01*sin(a*7.); float grow = clamp(T*.11+.15, 0., .5);
    float rings = fract(r*26. + fbm(vec3(p*2.,2.))*1.2); float late = smoothstep(.0,.25,rings)*smoothstep(1.,.7,rings); vec3 wood = mix(vec3(.55,.32,.16), vec3(.86,.64,.42), late); wood *= .85 + .15*fbm(vec3(p*40.,3.));
    float crack = smoothstep(.012,.0, abs(sin(a*3.+.7) )*r*.6 - .002)*step(.12, r)*step(r, grow*.95); wood = mix(wood, vec3(.2,.1,.05), crack*.8);
    float inside = smoothstep(grow+.004, grow, r); vec3 bark = mix(vec3(.25,.15,.08), vec3(.4,.26,.15), fbm(vec3(a*8.,r*30.,1.))); float barkm = smoothstep(grow+.05, grow+.045, r)*(1.-inside);
    vec3 bg = mix(vec3(.94,.91,.86), vec3(.88,.84,.78), uv.y); vec3 col = mix(bg, bark, barkm); col = mix(col, wood, inside); col *= 1. - .25*smoothstep(.0,.5,r)*inside; o = vec4(col,1.); }`, () => grain(X, .05, 'multiply'));
// 43 等高线
shaderStyle({ key: 'CONTOUR', cn: '等高线', en: 'Topographic lines', cat: 'graphic', desc: '一张会移动的地形图，只用等高线描出山脊和河谷，主等高线加粗，冷静又精确。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R-.5*R)/R.y; vec2 q = p*1.6 + vec2(T*.05, 0.); float hgt = fbm(vec3(q, 1.))*1.2 + .5*exp(-dot(p-vec2(.4,.05),p-vec2(.4,.05))*6.); float lv = hgt*28.; float f = fract(lv); float w = fwidth(lv);
    float line = smoothstep(w*1.2, 0., min(f, 1.-f)); float major = smoothstep(w*2., 0., min(fract(lv/5.), 1.-fract(lv/5.))*5.);
    vec3 paper = vec3(.95,.93,.88); vec3 ink = vec3(.62,.32,.2); vec3 col = paper; col = mix(col, ink, line*.55); col = mix(col, ink*.7, major*.9); col = mix(col, vec3(.85,.88,.92), smoothstep(.36,.34,hgt)*.6);
    o = vec4(col,1.); }`, () => { X.save(); X.strokeStyle = '#9A4E30'; X.fillStyle = '#9A4E30'; font(X, '500', 15, F.mono); X.fillText('N 30°16′  E 120°09′', 1560, 1010); X.fillRect(1560, 1020, 200, 2); X.restore(); grain(X, .05, 'multiply'); });
// 44 孟菲斯
st2D({ key: 'MEMPHIS', cn: '孟菲斯', en: 'Memphis', cat: 'graphic', desc: '八十年代孟菲斯设计：波浪线、圆点、三角和格纹在粉彩底上蹦跳，俏皮又大胆。' }, (lt) => {
  X.fillStyle = '#FDE3D6'; X.fillRect(0, 0, W, H); const r = rng(12); const cols = ['#1A1A1A', '#FF5C8A', '#2EC4B6', '#FFC93C', '#5B5BF0'];
  for (let i = 0; i < 46; i++) { const x = 720 + r() * 1180, y = 60 + r() * 960, s = 60 + r() * 140, c = cols[Math.floor(r() * 5)], ty = Math.floor(r() * 5), rot = r() * 6 + lt * (r() - .5) * 2.2, bob = Math.sin(lt * 2 + i) * 16; const e = clamp01((lt - .15 - ((x - 720) / 1180) * 1.2 - (i % 5) * .08) / .7); if (e <= 0) continue; const el = e >= 1 ? 1 : 1 + Math.pow(2, -9 * e) * Math.sin((e * 9 - .75) * 2.09) * -1;
    X.save(); X.translate(x + (1 - e) * 120, y + bob); X.rotate(rot - (1 - e) * 2); X.scale(el, el); X.fillStyle = c; X.strokeStyle = c; X.lineWidth = 9; X.lineCap = 'round';
    if (ty === 0) { X.beginPath(); X.arc(0, 0, s * .5, 0, 7); X.fill(); } else if (ty === 1) { X.beginPath(); X.moveTo(0, -s * .5); X.lineTo(s * .5, s * .45); X.lineTo(-s * .5, s * .45); X.fill(); } else if (ty === 2) { X.beginPath(); for (let k = 0; k <= 30; k++) X.lineTo(-s + k / 30 * s * 2, Math.sin(k / 30 * 12) * s * .18); X.stroke(); }
    else if (ty === 3) { for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) { X.beginPath(); X.arc(a * 18 - 27, b * 18 - 27, 4, 0, 7); X.fill(); } } else { X.fillRect(-s * .5, -s * .12, s, s * .24); X.fillStyle = '#1A1A1A'; X.fillRect(-s * .5, s * .12, s, 5); } X.restore(); }
  grain(X, .06, 'multiply'); });
// 45 孔版印刷
st2D({ key: 'RISO', cn: '孔版印刷', en: 'Risograph', cat: 'graphic', desc: '荧光粉和青绿两色套印，故意错位的版和颗粒感，大圆和粗体字叠出第三种颜色。' }, (lt) => {
  X.fillStyle = '#F4F0E6'; X.fillRect(0, 0, W, H); const off = 6 + Math.sin(lt * 3) * 4; X.save(); X.globalCompositeOperation = 'multiply';
  X.fillStyle = '#FF48B0'; X.beginPath(); X.arc(1180 + off, 470, 300, 0, 7); X.fill(); font(X, '900', 270, F.inter); X.letterSpacing = '-12px'; X.fillText('RISO', 760 + off, 960); X.fillRect(1500 + off, 140, 260, 260);
  X.fillStyle = '#00A69C'; X.beginPath(); X.arc(1430, 600 - off, 260, 0, 7); X.fill(); X.fillText('PRINT', 760, 780 - off); for (let i = 0; i < 12; i++) X.fillRect(1560, 520 + i * 32, 300, 12); X.restore(); X.letterSpacing = '0px';
  const r = rng(3); for (let i = 0; i < 22000; i++) { X.fillStyle = `rgba(244,240,230,${r() * .55})`; X.fillRect(r() * W, r() * H, 1.6, 1.6); } grain(X, .1, 'multiply'); });
// 46 图标统计
st2D({ key: 'ISOTYPE', cn: '图标统计', en: 'Isotype', cat: 'graphic', desc: '用一个个小人图标排成数据：每个图标代表一份，颜色分组、逐个点亮，冰冷数字变得有体温。' }, (lt) => {
  X.fillStyle = '#F2EFE8'; X.fillRect(0, 0, W, H); const rows = [['2016', 6, '#1E3A8A'], ['2020', 9, '#1E3A8A'], ['2024', 12, '#E4572E'], ['2026', 15, '#E4572E']]; const person = (x, y, s, c) => { X.fillStyle = c; X.beginPath(); X.arc(x, y - s * .9, s * .22, 0, 7); X.fill(); X.beginPath(); X.roundRect(x - s * .28, y - s * .62, s * .56, s * .62, s * .12); X.fill(); };
  rows.forEach(([lab, n, c], ri) => { const y = 230 + ri * 200; font(X, '700', 34, F.inter); X.fillStyle = '#141414'; X.fillText(lab, 760, y - 10); const shown = Math.min(n, Math.floor((lt - ri * .5) * 8)); for (let i = 0; i < n; i++) { const on = i < shown; person(930 + i * 52, y + 40, 72, on ? c : 'rgba(20,20,20,.08)'); } if (shown >= n) { font(X, '900', 30, F.inter); X.fillStyle = c; X.fillText(`${n*2.5}M`, 930 + n * 52 + 10, y - 10); } });
  font(X, '500', 14, F.mono); X.fillStyle = '#141414'; X.fillText('1 FIGURE = 2.5 MILLION', 760, 1010); grain(X, .05, 'multiply'); });
// 47 复古电视
st2D({ key: 'CRT', cn: '复古电视', en: 'CRT signal', cat: 'tech', desc: '一台老式显像管电视，屏幕先是彩条，信号一阵抖动后换成画面，扫描线和曲面玻璃都在。' }, (lt) => {
  X.fillStyle = '#1C1612'; X.fillRect(0, 0, W, H); const sx = 900, sy = 210, sw = 860, sh = 620; X.fillStyle = '#C8B89A'; X.beginPath(); X.roundRect(sx - 70, sy - 70, sw + 140, sh + 200, 40); X.fill(); X.fillStyle = '#A8977A'; X.fillRect(sx - 70, sy + sh + 50, sw + 140, 80);
  X.save(); X.beginPath(); X.roundRect(sx, sy, sw, sh, 60); X.clip(); const bars = ['#C0C0C0', '#C0C000', '#00C0C0', '#00C000', '#C000C0', '#C00000', '#0000C0']; const phase = lt % 5; const glitch = phase > 2.2 && phase < 2.6;
  if (phase < 2.4) bars.forEach((c, i) => { X.fillStyle = c; X.fillRect(sx + i * sw / 7 + (glitch ? (Math.random() - .5) * 40 : 0), sy, sw / 7 + 1, sh * .75); }); else { const g = X.createLinearGradient(0, sy, 0, sy + sh); g.addColorStop(0, '#FF8A5C'); g.addColorStop(.6, '#FFD27A'); g.addColorStop(.61, '#2B4A7A'); g.addColorStop(1, '#14223D'); X.fillStyle = g; X.fillRect(sx, sy, sw, sh); X.fillStyle = '#FFF0C8'; X.beginPath(); X.arc(sx + sw * .6, sy + sh * .6, 90, Math.PI, 0); X.fill(); }
  if (phase < 2.4) { X.fillStyle = '#101010'; X.fillRect(sx, sy + sh * .75, sw, sh * .25); font(X, '700', 46, F.mono); X.fillStyle = '#EEE'; X.fillText('TEST  SIGNAL', sx + 230, sy + sh * .9); }
  for (let y = sy; y < sy + sh; y += 4) { X.fillStyle = 'rgba(0,0,0,.28)'; X.fillRect(sx, y, sw, 2); } const vg = X.createRadialGradient(sx + sw / 2, sy + sh / 2, sh * .3, sx + sw / 2, sy + sh / 2, sw * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); X.fillStyle = vg; X.fillRect(sx, sy, sw, sh);
  X.fillStyle = 'rgba(255,255,255,.08)'; X.beginPath(); X.ellipse(sx + sw * .3, sy + sh * .2, sw * .35, sh * .12, -.2, 0, 7); X.fill(); X.restore();
  [[sx + sw - 80, sy + sh + 90], [sx + sw - 160, sy + sh + 90]].forEach(([x, y]) => { X.fillStyle = '#5A4A38'; X.beginPath(); X.arc(x, y, 24, 0, 7); X.fill(); }); grain(X, .07); });
// 48 魔方翻转
st2D({ key: 'CUBES', cn: '方块翻转', en: 'Cube flip wave', cat: 'space', desc: '一整面立方体阵列被一道波浪依次翻转，每翻一次换一种颜色，从斜上方看像一块会翻页的屏幕。' }, (lt) => {
  X.fillStyle = '#121214'; X.fillRect(0, 0, W, H); const P = cam3([-4, 7, -6], [2.6, 0, 3], 40, 0, [160, 30]); const N = 14; const items = []; const cols = [[255, 92, 64], [245, 240, 230], [60, 90, 230], [255, 200, 60]];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const d = i + j; const ph = (lt * 1.6 - d * .18); const k = Math.floor(ph); const f = clamp01((ph - k) * 3); items.push([i * .6, j * .6, f, ((k % 4) + 4) % 4]); }
  items.sort((a, b) => (b[0] + b[1]) - (a[0] + a[1]));
  for (const [x, z, f, k] of items) { const ang = f * Math.PI / 2; const c1 = cols[k], c2 = cols[(k + 1) % 4]; const s = .26; const rotp = (px, py, pz) => { const ca = Math.cos(ang), sa = Math.sin(ang); return [x + px, py * ca - pz * sa, z + py * sa + pz * ca]; };
    const quad = (pts, c, sh) => { const sc = pts.map(p => P(rotp(...p))); X.fillStyle = rgb(lerpC(c, [0, 0, 0], sh)); X.beginPath(); sc.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.closePath(); X.fill(); };
    quad([[-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s]], ang > .78 ? c2 : c1, .35); quad([[-s, s, -s], [s, s, -s], [s, s, s], [-s, s, s]], ang < .78 ? c1 : c2, 0); quad([[-s, -s, -s], [-s, -s, s], [-s, s, s], [-s, s, -s]], c1, .55); }
  grain(X, .05); });
// 49 无限镜屋
st2D({ key: 'INFINITY', cn: '无限镜屋', en: 'Infinity room', cat: 'space', desc: '四面镜子的房间里垂挂着上千颗彩色小灯，镜面地板把灯阵倒映下去，向四面八方无限延伸，灯色一阵阵呼吸。' }, (lt) => {
  X.fillStyle = '#020205'; X.fillRect(0, 0, W, H); const P = cam3([-.6 + lt * .05, 0, -1], [.6, .05, 6], 70, 0, [260, 0]); const r = rng(5); const pts = []; const hues = [320, 40, 185, 265];
  for (let i = -14; i <= 14; i++) for (let k = 0; k <= 34; k++) for (let q = 0; q < 2; q++) { if (r() > .8) continue; const y = .1 + r() * 2.1; pts.push([i * .55 + (r() - .5) * .3, y, k * .55 + (r() - .5) * .3, r()]); }
  pts.sort((a, b) => b[2] - a[2]); const fl = -1.2;
  X.strokeStyle = 'rgba(120,120,160,.08)'; X.lineWidth = 1; for (let k = 0; k <= 30; k++) line3(X, P, [[-6, fl, k * .8], [6, fl, k * .8]]); for (let i = -8; i <= 8; i++) line3(X, P, [[i * .8, fl, 0], [i * .8, fl, 26]]);
  X.save(); X.globalCompositeOperation = 'lighter';
  for (const [x, y, z, k] of pts) { const hue = hues[Math.floor(k * 4)]; const br = .55 + .45 * Math.sin(lt * 2.5 - z * .35 + k * 6); for (const [yy, m] of [[y - 1.2, 1], [fl * 2 - y + 1.2, .35]]) { const s = P([x, yy, z]); if (s[2] < .3 || s[0] < -60 || s[0] > W + 60 || s[1] < -60 || s[1] > H + 60) continue; const rr = Math.max(1.6, 24 / s[2]); const al = Math.min(1, 9 / s[2]) * br * m;
    const g = X.createRadialGradient(s[0], s[1], 0, s[0], s[1], rr * 4); g.addColorStop(0, `hsla(${hue},100%,85%,${al})`); g.addColorStop(.25, `hsla(${hue},95%,60%,${al * .45})`); g.addColorStop(1, `hsla(${hue},90%,50%,0)`); X.fillStyle = g; X.fillRect(s[0] - rr * 4, s[1] - rr * 4, rr * 8, rr * 8);
    if (m === 1) { const top = P([x, 1.6, z]); X.strokeStyle = `rgba(255,255,255,${.05 * al})`; X.beginPath(); X.moveTo(top[0], top[1]); X.lineTo(s[0], s[1]); X.stroke(); } } } X.restore();
  const v = X.createRadialGradient(1220, 540, 200, 1220, 540, 1200); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.6)'); X.fillStyle = v; X.fillRect(0, 0, W, H); grain(X, .05); });
