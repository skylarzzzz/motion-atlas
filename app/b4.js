// ===== BATCH 4 · particles, lines & perspective =====
// 29 椋鸟群
(() => { let Pg; const VS = `#version 300 es
  in float id; uniform vec2 R; uniform float T; out float vA; ${PCG}
  vec3 path(float s, float t){ return vec3(sin(s*2.1 + t*.35)*1.6 + s*1.2 - .2, sin(s*3.3 + t*.5)*.55 + cos(s*1.3)*.3, cos(s*1.7 + t*.3)*1.2); }
  void main(){ float s = h(id)*3.2 - 1.6; vec3 c = path(s, T); vec3 c2 = path(s+.01, T); vec3 tg = normalize(c2-c); vec3 n1 = normalize(cross(tg, vec3(0.,1.,0.))), n2 = cross(tg,n1); float th = h(id+1.)*6.2832, rr = pow(h(id+2.),.6)*(.25 + .2*sin(s*4.+T)); vec3 p = c + (n1*cos(th) + n2*sin(th))*rr;
    p += (vec3(h(id+3.),h(id+4.),h(id+5.))-.5)*.05; float z = 5. - p.z; vec2 sc = p.xy/z*2.4; sc.x *= R.y/R.x; sc.x += .25; gl_Position = vec4(sc,0.,1.); gl_PointSize = (2.6/z*3.2)*R.y/1080.; vA = .55; }`;
  const FS = `#version 300 es
  precision highp float; in float vA; out vec4 o; void main(){ float r = length(gl_PointCoord-.5); float m = smoothstep(.5,.2,r); o = vec4(vec3(.06,.05,.08)*m*vA, m*vA); }`;
  ST.push({ key: 'MURMUR', cn: '椋鸟群飞', en: 'Murmuration', cat: 'nature', desc: '几万只椋鸟在黄昏的天空里聚成一条扭动的丝带，形状一刻不停地变化，像会呼吸的墨迹。', render(lt) { if (!Pg) Pg = prog(VS, FS);
    glClear(0, 0, 0, 0); drawPoints(Pg, 60000, { R: [W, H], T: lt }, false); const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5B6FA8'); g.addColorStop(.55, '#E8A47E'); g.addColorStop(.8, '#F6CF8E'); g.addColorStop(1, '#3E3446'); X.fillStyle = g; X.fillRect(0, 0, W, H);
    X.fillStyle = '#2A2230'; X.beginPath(); X.moveTo(0, H); for (let x = 0; x <= W; x += 10) X.lineTo(x, 930 - fbm2(x * .004, 3, 4) * 70); X.lineTo(W, H); X.fill(); X.drawImage(glc, 0, 0); grain(X, .06); } }); })();
// 30 孔明灯
st2D({ key: 'LANTERN', cn: '孔明灯', en: 'Sky lanterns', cat: 'nature', desc: '几百盏孔明灯从湖面升起，近大远小一路飘向夜空深处，湖面倒映着每一点暖光。' }, (lt) => {
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060A1C'); g.addColorStop(.62, '#1B1E3C'); g.addColorStop(.63, '#090B18'); g.addColorStop(1, '#04050C'); X.fillStyle = g; X.fillRect(0, 0, W, H); const P = cam3([0, 0, 0], [.3, .25, 1], 60, 0, [0, 0]); const r = rng(8); const items = [];
  for (let i = 0; i < 420; i++) { const x = -6 + r() * 14, z = 3 + Math.pow(r(), .7) * 40, y = -1.6 + ((r() * 18 + lt * (.25 + r() * .2)) % 18); items.push([x + Math.sin(lt * .5 + i) * .1, y, z, r()]); } items.sort((a, b) => b[2] - a[2]);
  X.save(); X.globalCompositeOperation = 'lighter'; for (const [x, y, z, k] of items) { const s = P([x, y, z]); if (s[2] < .3) continue; const sz = .16 * P.k / s[2]; const fl = .8 + .2 * Math.sin(lt * 6 + k * 40);
    const gg = X.createRadialGradient(s[0], s[1], 0, s[0], s[1], sz * 3); gg.addColorStop(0, `rgba(255,170,80,${.35 * fl})`); gg.addColorStop(1, 'rgba(255,120,40,0)'); X.fillStyle = gg; X.fillRect(s[0] - sz * 3, s[1] - sz * 3, sz * 6, sz * 6);
    const bg2 = X.createLinearGradient(0, s[1] - sz, 0, s[1] + sz); bg2.addColorStop(0, `rgba(255,150,70,${.7 * fl})`); bg2.addColorStop(1, `rgba(255,230,160,${fl})`); X.fillStyle = bg2; X.fillRect(s[0] - sz * .55, s[1] - sz * .8, sz * 1.1, sz * 1.5);
    const ry = 2 * 650 - s[1]; if (ry > 650 && ry < H) { X.fillStyle = `rgba(255,170,80,${.25 * fl})`; X.fillRect(s[0] - sz * .5, ry - sz * .2 + Math.sin(lt * 3 + k * 9) * 3, sz, sz * 2.4); } } X.restore(); grain(X, .06); });
// 31 樱吹雪
st2D({ key: 'SAKURA', cn: '樱吹雪', en: 'Petal storm', cat: 'nature', desc: '一阵风把樱花瓣卷成一条河流，从画面左下涌向右上，近处的花瓣大而清晰，远处的细如尘。' }, (lt) => {
  const g = X.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#F8E9EC'); g.addColorStop(1, '#E7EDF6'); X.fillStyle = g; X.fillRect(0, 0, W, H); const P = cam3([0, 0, 0], [.2, .1, 1], 65, -.08, [0, 0]); const r = rng(2); const items = [];
  for (let i = 0; i < 1800; i++) { const s = (r() + lt * .06 * (.6 + r() * .6)) % 1; const lane = (r() - .5) * 2.2, z = 1.1 + Math.pow(r(), 1.6) * 16; const x = -5 + s * 12, y = -2.6 + s * 4.4 + lane * .7 + Math.sin(s * 8 + i) * .3; items.push([x, y, z, r(), s]); } items.sort((a, b) => b[2] - a[2]);
  for (const [x, y, z, k, s] of items) { const p = P([x, y, z]); if (p[2] < .3) continue; const sz = .13 * P.k / p[2]; X.save(); X.translate(p[0], p[1]); X.rotate(k * 9 + lt * (k - .5) * 3); X.scale(1, .45 + .55 * Math.abs(Math.sin(lt * 2 + k * 20))); const pg = X.createLinearGradient(-sz, 0, sz, 0); pg.addColorStop(0, '#F7B6C6'); pg.addColorStop(1, '#FFF0F3'); X.fillStyle = pg; X.globalAlpha = Math.min(1, 4 / p[2] + .25);
    X.beginPath(); X.moveTo(-sz, 0); X.quadraticCurveTo(0, -sz * .9, sz, -sz * .15); X.lineTo(sz * .7, 0); X.lineTo(sz, sz * .15); X.quadraticCurveTo(0, sz * .9, -sz, 0); X.fill(); X.restore(); }
  X.strokeStyle = '#3A2A2E'; X.lineWidth = 16; X.lineCap = 'round'; X.beginPath(); X.moveTo(W + 20, 40); X.quadraticCurveTo(1600, 120, 1380, 60); X.stroke(); X.lineWidth = 7; X.beginPath(); X.moveTo(1650, 100); X.quadraticCurveTo(1560, 200, 1500, 230); X.stroke(); grain(X, .05, 'multiply'); });
// 32 金色烟花
st2D({ key: 'FIREWORK', cn: '长曝光烟花', en: 'Long-exposure fireworks', cat: 'nature', desc: '长曝光下的菊花型烟花，每一颗火星都拖着金色的弧线，在城市天际线上一朵接一朵绽开。' }, (lt) => {
  X.fillStyle = '#05070F'; X.fillRect(0, 0, W, H); const shells = [[1250, 380, 0, 330], [1620, 300, 1.2, 260], [980, 260, 2.4, 230], [1500, 560, 3.4, 200]];
  X.save(); X.globalCompositeOperation = 'lighter'; X.lineCap = 'round';
  shells.forEach(([cx, cy, t0, R], si) => { const tt = lt - t0; if (tt < 0) return; const r = rng(si + 3); const k = Math.min(1, tt / 1.6); const fade = Math.exp(-Math.max(0, tt - 1.6) * .9); const gold = si % 2 ? [255, 200, 110] : [255, 235, 200];
    for (let i = 0; i < 140; i++) { const a = r() * Math.PI * 2, sp = .75 + r() * .3; X.strokeStyle = rgb(gold, (.25 + .4 * r()) * fade); X.lineWidth = 1.4; X.beginPath(); for (let s = 0; s <= 20; s++) { const u = s / 20 * k; const ex = 1 - Math.pow(1 - u, 2.2); const x = cx + Math.cos(a) * R * sp * ex, y = cy + Math.sin(a) * R * sp * ex + u * u * 90; s ? X.lineTo(x, y) : X.moveTo(x, y); } X.stroke();
      const ex = 1 - Math.pow(1 - k, 2.2); const hx = cx + Math.cos(a) * R * sp * ex, hy = cy + Math.sin(a) * R * sp * ex + k * k * 90; X.fillStyle = rgb([255, 250, 230], .8 * fade); X.fillRect(hx - 1.5, hy - 1.5, 3, 3); } });
  X.restore(); X.fillStyle = '#020306'; X.beginPath(); X.moveTo(700, H); let x = 700; const r2 = rng(4); while (x < W) { const w = 30 + r2() * 70, h = 90 + r2() * 220; X.lineTo(x, H - h); X.lineTo(x + w, H - h); x += w; } X.lineTo(W, H); X.fill();
  X.fillStyle = 'rgba(255,210,140,.5)'; const r3 = rng(9); for (let i = 0; i < 160; i++) X.fillRect(700 + r3() * 1220, H - 20 - r3() * 240, 2, 3); grain(X, .06); });
// 33 蒲公英
st2D({ key: 'DANDELION', cn: '蒲公英', en: 'Dandelion', cat: 'nature', desc: '黑底上一颗蒲公英的种子球，上百根细丝组成一个完美的圆，一阵风过，种子一颗颗飞向右边。' }, (lt) => {
  X.fillStyle = '#070707'; X.fillRect(0, 0, W, H); const cx = 1150, cy = 520, R = 300; const r = rng(6); X.strokeStyle = 'rgba(230,230,220,.6)'; X.lineWidth = 3; X.beginPath(); X.moveTo(cx, cy); X.quadraticCurveTo(cx - 30, cy + 300, cx + 20, H + 20); X.stroke();
  const seed = (x, y, a, s, al) => { X.save(); X.translate(x, y); X.rotate(a); X.globalAlpha = al; X.strokeStyle = 'rgba(240,238,228,.9)'; X.lineWidth = 1; X.beginPath(); X.moveTo(0, 0); X.lineTo(s * .75, 0); X.stroke(); X.lineWidth = .6; for (let k = 0; k < 18; k++) { const b = (k / 17 - .5) * 2.2; X.beginPath(); X.moveTo(s * .75, 0); X.lineTo(s * .75 + Math.cos(b) * s * .38, Math.sin(b) * s * .38); X.stroke(); } X.fillStyle = '#9A8C6A'; X.fillRect(-4, -1.5, 9, 3); X.restore(); };
  for (let i = 0; i < 320; i++) { const u = r(), v = r(); const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1); const x0 = Math.sin(ph) * Math.cos(th), y0 = Math.cos(ph), z0 = Math.sin(ph) * Math.sin(th); const rel = .6 + r() * 4.5; const fly = Math.max(0, lt - rel);
    const px = cx + x0 * R * .2 + fly * (120 + r() * 140) + Math.sin(fly * 2 + i) * 20 * fly, py = cy + y0 * R * .2 - fly * (30 + r() * 60) + Math.sin(fly * 3 + i) * 15; const a = Math.atan2(y0, x0) + fly * .4; const depth = .55 + .45 * (z0 * .5 + .5);
    if (fly <= 0) seed(cx + x0 * 20, cy + y0 * 20, Math.atan2(y0, x0), R * .95 * Math.hypot(x0, y0) + 20, depth * .9); else seed(px + x0 * R * .7, py + y0 * R * .7, a, R * .45, Math.max(0, depth - fly * .08)); }
  X.fillStyle = '#B8A878'; X.beginPath(); X.arc(cx, cy, 22, 0, 7); X.fill(); grain(X, .05); });
// 34 双螺旋
(() => { let Pg; const VS = `#version 300 es
  in float id; uniform vec2 R; uniform float T; out float vA; out float vC; ${PCG}
  void main(){ float N = 140000.; float s = h(id)*1.; float strand = step(.5, h(id+1.)); float kind = h(id+2.); vec3 p; float t = s*14. + T*.6; float L = s*18. - 4.;
    if(kind < .7){ float a = t + strand*3.1416; p = vec3(L, cos(a)*.9, sin(a)*.9) + (vec3(h(id+3.),h(id+4.),h(id+5.))-.5)*.08; vC = strand; }
    else { float bp = floor(s*180.)/180.; float tt = bp*14. + T*.6; float u = h(id+6.)*2.-1.; p = vec3(bp*18.-4., cos(tt)*.9*u, sin(tt)*.9*u); vC = 2.; }
    p.xy = rot2(.42)*p.xy; float z = 6.5 - p.z + p.x*.0; vec3 q = p; q.z += q.x*.45; z = 6.5 - q.z; vec2 sc = q.xy/z*2.2; sc.x *= R.y/R.x; sc.x += .2; gl_Position = vec4(sc,0.,1.); gl_PointSize = 2.2*R.y/1080.; vA = (.45 + .35*h(id+7.))*clamp(6./z,.2,1.6); }`.replace('rot2(.42)', 'mat2(cos(.42),-sin(.42),sin(.42),cos(.42))');
  const FS = `#version 300 es
  precision highp float; in float vA; in float vC; out vec4 o; void main(){ float r = length(gl_PointCoord-.5); float m = smoothstep(.5,.2,r); vec3 c = vC < .5 ? vec3(.35,.9,1.) : vC < 1.5 ? vec3(.95,.97,1.) : vec3(1.,.42,.55); o = vec4(c*m*vA, 0.); }`;
  ST.push({ key: 'HELIX', cn: '双螺旋', en: 'Double helix', cat: 'tech', desc: '十几万个点组成的 DNA 双螺旋斜着冲向远处，碱基对像梯子一样连接两条链，冷光科技感。', render(lt) { if (!Pg) Pg = prog(VS, FS); glClear(0, 0, 0, 1); drawPoints(Pg, 260000, { R: [W, H], T: lt });
    X.fillStyle = '#03050A'; X.fillRect(0, 0, W, H); X.save(); X.globalCompositeOperation = 'lighter'; X.drawImage(glc, 0, 0); X.restore(); grain(X, .05); } }); })();
// 35 摆波
st2D({ key: 'PENDULUM', cn: '摆波', en: 'Pendulum wave', cat: 'space', desc: '二十四个摆长各不相同的铜摆同时放开，相位慢慢错开，排出蛇形、对称、混沌又重新对齐。' }, (lt) => {
  X.fillStyle = '#EDE7DB'; X.fillRect(0, 0, W, H); const P = cam3([-2.1, .9, -1.7], [1.1, -.3, 2.5], 62, 0, [260, 0]); const N = 24; const bobs = [];
  X.strokeStyle = '#2A2622'; X.lineWidth = 4; const a = P([-.5, 1.5, 0]), b = P([-.5, 1.5, N * .25]); X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke();
  for (let i = 0; i < N; i++) { const Ttot = 30, n = 20 + i; const w = 2 * Math.PI * n / Ttot; const L = 9.81 / (w * w); const th = .5 * Math.cos(w * lt * 1.4); const top = [-.5, 1.5, i * .25]; const bob = [top[0] + Math.sin(th) * L * 1.8, top[1] - Math.cos(th) * L * 1.8, top[2]]; bobs.push([top, bob]); }
  bobs.slice().sort((p, q) => V3.len(V3.sub(q[1], P.eye)) - V3.len(V3.sub(p[1], P.eye))).forEach(([top, bob]) => { const s1 = P(top), s2 = P(bob); X.strokeStyle = 'rgba(40,36,32,.6)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(s1[0], s1[1]); X.lineTo(s2[0], s2[1]); X.stroke();
    const sh = P([bob[0], -1.4, bob[2]]); X.fillStyle = 'rgba(60,40,20,.12)'; X.beginPath(); X.ellipse(sh[0], sh[1], 40 / sh[2] * 3, 12 / sh[2] * 3, 0, 0, 7); X.fill(); const rr = .11 * P.k / s2[2]; const g = X.createRadialGradient(s2[0] - rr * .35, s2[1] - rr * .4, rr * .1, s2[0], s2[1], rr); g.addColorStop(0, '#FFE9B0'); g.addColorStop(.4, '#C8933A'); g.addColorStop(1, '#5A3A12'); X.fillStyle = g; X.beginPath(); X.arc(s2[0], s2[1], rr, 0, 7); X.fill(); });
  grain(X, .05, 'multiply'); });
// 36 太阳系仪
st2D({ key: 'ORRERY', cn: '黄铜太阳系仪', en: 'Brass orrery', cat: 'product', desc: '一台黄铜太阳系仪在墨绿色背景前运转，行星沿各自的轨道环以不同速度公转，像古董钟表的广告。' }, (lt) => {
  const g = X.createRadialGradient(1250, 520, 60, 1200, 560, 1200); g.addColorStop(0, '#16352C'); g.addColorStop(1, '#050D0A'); X.fillStyle = g; X.fillRect(0, 0, W, H); const P = cam3([-1.2, 3.2, -6.2], [.6, -.2, 0], 40, -.12, [220, 0]);
  const brass = (a) => `rgba(222,180,100,${a})`; const orbits = [[1, .9, 'MER'], [1.6, .6, 'VEN'], [2.3, .45, 'EAR'], [3.1, .32, 'MAR'], [4.1, .2, 'JUP']];
  const ring = (R, y, w, a) => { const pts = []; for (let i = 0; i <= 160; i++) { const t = i / 160 * Math.PI * 2; pts.push([Math.cos(t) * R, y, Math.sin(t) * R]); } X.strokeStyle = brass(a); X.lineWidth = w; line3(X, P, pts); };
  orbits.forEach(([R], i) => ring(R, 0, 1.4, .55)); ring(4.6, 0, 3, .9); ring(4.75, 0, 1, .6);
  for (let i = 0; i < 48; i++) { const t = i / 48 * Math.PI * 2; const a = P([Math.cos(t) * 4.6, 0, Math.sin(t) * 4.6]), b = P([Math.cos(t) * 4.75, 0, Math.sin(t) * 4.75]); X.strokeStyle = brass(.7); X.lineWidth = 1; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); }
  const c0 = P([0, 0, 0]), cb = P([0, -1.6, 0]); X.strokeStyle = brass(.9); X.lineWidth = 6; X.beginPath(); X.moveTo(c0[0], c0[1]); X.lineTo(cb[0], cb[1]); X.stroke();
  const sun = .42 * P.k / c0[2]; const sg = X.createRadialGradient(c0[0] - sun * .3, c0[1] - sun * .35, sun * .1, c0[0], c0[1], sun); sg.addColorStop(0, '#FFF2C8'); sg.addColorStop(.5, '#E8A63A'); sg.addColorStop(1, '#7A4A10'); X.fillStyle = sg; X.beginPath(); X.arc(c0[0], c0[1], sun, 0, 7); X.fill();
  orbits.forEach(([R, sp], i) => { const t = lt * sp + i * 1.7; const pp = [Math.cos(t) * R, .25, Math.sin(t) * R]; const s = P(pp), arm = P([Math.cos(t) * R, 0, Math.sin(t) * R]); X.strokeStyle = brass(.8); X.lineWidth = 2; X.beginPath(); X.moveTo(c0[0], c0[1]); X.lineTo(arm[0], arm[1]); X.lineTo(s[0], s[1]); X.stroke();
    const rr = (.12 + i * .03) * P.k / s[2]; const cols = ['#B9B1A4', '#E7C98F', '#4C8FD0', '#C8613A', '#D8B48A']; const pg = X.createRadialGradient(s[0] - rr * .3, s[1] - rr * .35, rr * .1, s[0], s[1], rr); pg.addColorStop(0, '#fff'); pg.addColorStop(.35, cols[i]); pg.addColorStop(1, '#111'); X.fillStyle = pg; X.beginPath(); X.arc(s[0], s[1], rr, 0, 7); X.fill(); });
  grain(X, .05); });
// 37 激光秀
st2D({ key: 'LASER', cn: '激光秀', en: 'Laser show', cat: 'tech', desc: '烟雾里，几十道激光从舞台一点扇形射出，扫过人群上空，品红和翠绿交替，像演唱会的高潮。' }, (lt) => {
  X.fillStyle = '#04030A'; X.fillRect(0, 0, W, H); const ox = 1300, oy = 760; X.save(); X.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + Math.sin(lt * 1.2 + i * .35) * .9 + (i - 20) * .04; const len = 1800; const ex = ox + Math.cos(a) * len, ey = oy + Math.sin(a) * len; const col = i % 2 ? [255, 40, 200] : [40, 255, 140];
    const g = X.createLinearGradient(ox, oy, ex, ey); g.addColorStop(0, rgb(col, .9)); g.addColorStop(1, rgb(col, 0)); X.strokeStyle = g; X.lineWidth = 2; X.beginPath(); X.moveTo(ox, oy); X.lineTo(ex, ey); X.stroke(); X.lineWidth = 12; X.strokeStyle = g; X.globalAlpha = .08; X.stroke(); X.globalAlpha = 1; }
  const r = rng(4); for (let i = 0; i < 2500; i++) { const x = r() * W, y = r() * H * .8; X.fillStyle = `rgba(150,120,255,${r() * .05})`; X.fillRect(x, y, 2, 2); } const sg = X.createRadialGradient(ox, oy, 0, ox, oy, 180); sg.addColorStop(0, 'rgba(255,255,255,.9)'); sg.addColorStop(1, 'rgba(255,100,220,0)'); X.fillStyle = sg; X.fillRect(ox - 180, oy - 180, 360, 360); X.restore();
  X.fillStyle = '#000'; const r2 = rng(7); X.beginPath(); X.moveTo(0, H); for (let x = 0; x <= W; x += 18) { const hh = 120 + r2() * 40 + (r2() < .15 ? 50 : 0); X.lineTo(x, H - hh); X.arc(x + 9, H - hh - 8, 9, Math.PI, 0); } X.lineTo(W, H); X.fill(); grain(X, .06); });
// 38 字之球
st2D({ key: 'GLYPHSPHERE', cn: '字之球', en: 'Sphere of words', cat: 'type', desc: '几百个汉字按斐波那契排列贴在一颗旋转的球面上，近处清晰、远处退成淡影，文字本身变成了体积。' }, (lt) => {
  X.fillStyle = '#F2EEE6'; X.fillRect(0, 0, W, H); const chars = '天地玄黄宇宙洪荒日月盈昃辰宿列张寒来暑往秋收冬藏闰余成岁律吕调阳云腾致雨露结为霜金生丽水玉出昆冈剑号巨阙珠称夜光果珍李柰菜重芥姜海咸河淡鳞潜羽翔';
  const cx = 1260, cy = 540, R = 400, N = 420; const items = []; const a1 = lt * .25, a2 = .35;
  for (let i = 0; i < N; i++) { const y = 1 - (i + .5) / N * 2; const rr = Math.sqrt(1 - y * y); const th = i * 2.39996; let x = Math.cos(th) * rr, z = Math.sin(th) * rr; [x, z] = [x * Math.cos(a1) - z * Math.sin(a1), x * Math.sin(a1) + z * Math.cos(a1)]; let yy = y * Math.cos(a2) - z * Math.sin(a2); z = y * Math.sin(a2) + z * Math.cos(a2); items.push([x, yy, z, chars[i % chars.length]]); }
  items.sort((a, b) => a[2] - b[2]); X.textAlign = 'center'; X.textBaseline = 'middle';
  for (const [x, y, z, ch] of items) { const persp = 2.4 / (2.4 - z); const sz = 30 * persp; font(X, z > 0 ? '900' : '400', sz, F.serif); X.fillStyle = z > 0 ? `rgba(20,20,20,${.35 + .65 * z})` : `rgba(20,20,20,${.08 + .1 * (1 + z)})`; if (z > .9) X.fillStyle = '#C8231B'; X.fillText(ch, cx + x * R * persp, cy - y * R * persp); }
  X.textAlign = 'left'; X.textBaseline = 'alphabetic'; grain(X, .05, 'multiply'); });
