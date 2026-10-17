// ===== BATCH 6 =====
// 50 不可能三角
st2D({ key: 'PENROSE', cn: '不可能三角', en: 'Impossible triangle', cat: 'space', desc: '一块块方块沿三条边依次落下，首尾在等轴视角里接上，拼成一个现实里造不出来的彭罗斯三角。' }, (lt) => {
  const g = X.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#F6E7DC'); g.addColorStop(1, '#DCE3F2'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  const n = 6, S = 88, ox = 1180, oy = 200 + Math.sin(lt * .8) * 10; const iso = (x, y, z) => [ox + (x - y) * S * .866, oy + ((x + y) * .5 - z) * S];
  const cubes = []; for (let i = 0; i < n; i++) cubes.push([i, 0, 0]); for (let i = 0; i < n; i++) cubes.push([n, i, 0]); for (let i = 0; i < n; i++) cubes.push([n, n, i]);
  const pal = [['#FFFFFF', '#FF8A5B', '#3D4FD8'], ['#FFF4D6', '#F6B93B', '#2B7A78'], ['#FDE7EF', '#E85D75', '#4A3F8C']];
  const face = (pts, c) => { X.fillStyle = c; X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(...p) : X.moveTo(...p)); X.closePath(); X.fill(); X.strokeStyle = c; X.lineWidth = 1; X.stroke(); };
  const drawCube = (c, idx) => { const k = easeO((lt * 6 - idx) / 3); if (k <= 0) return; const [x, y, z0] = c; const z = z0 + (1 - k) * 4; const sg = Math.floor(idx / n), p = pal[sg]; X.globalAlpha = Math.min(1, k * 1.5);
    face([iso(x, y, z + 1), iso(x + 1, y, z + 1), iso(x + 1, y + 1, z + 1), iso(x, y + 1, z + 1)], p[0]);
    face([iso(x + 1, y, z), iso(x + 1, y + 1, z), iso(x + 1, y + 1, z + 1), iso(x + 1, y, z + 1)], p[1]);
    face([iso(x, y + 1, z), iso(x + 1, y + 1, z), iso(x + 1, y + 1, z + 1), iso(x, y + 1, z + 1)], p[2]); X.globalAlpha = 1; };
  const order = cubes.map((c, i) => [c, i]).sort((a, b) => (a[0][0] + a[0][1] + a[0][2]) - (b[0][0] + b[0][1] + b[0][2])); order.forEach(([c, i]) => drawCube(c, i));
  X.save(); const a = iso(0, 0, 0), b = iso(1, 0, 1), cc = iso(0, 1, 1); X.beginPath(); X.moveTo(...iso(0, 1, 0)); X.lineTo(...iso(1, 1, 0)); X.lineTo(...iso(1, 0, 0)); X.lineTo(...iso(1, 0, 1)); X.lineTo(...iso(0, 0, 1)); X.lineTo(...iso(0, 1, 1)); X.closePath(); X.clip(); drawCube(cubes[0], 0); X.restore();
  font(X, '500', 15, F.mono); X.fillStyle = 'rgba(40,40,70,.5)'; X.fillText('x + y + z  →  0', 1500, 980); grain(X, .05, 'multiply'); });
// 51 千纸鹤
st2D({ key: 'CRANES', cn: '千纸鹤', en: 'Paper cranes', cat: 'nature', desc: '一群折纸鹤从远处飞来，翅膀一扇一扇，纸的折面在阳光下明暗分明，近大远小铺满天空。' }, (lt) => {
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9CC8E8'); g.addColorStop(1, '#F4E9DA'); X.fillStyle = g; X.fillRect(0, 0, W, H); const P = cam3([0, 0, 0], [.3, .05, 1], 60, 0, [0, 0]); const r = rng(5); const birds = [];
  for (let i = 0; i < 70; i++) { const z = 2.5 + Math.pow(r(), .8) * 30 - lt * 1.2 % 30; birds.push([(r() - .3) * 14, (r() - .4) * 6, ((z % 30) + 30) % 30 + 2.5, r()]); } birds.sort((a, b) => b[2] - a[2]); const cols = ['#E8473C', '#F4F1EA', '#F2B33D', '#2F5BD8'];
  for (const [x, y, z, k] of birds) { const s = P([x, y, z]); if (s[2] < .5) continue; const sz = .7 * P.k / s[2]; const flap = Math.sin(lt * 6 + k * 20); const c = hex(cols[Math.floor(k * 4)]); X.save(); X.translate(s[0], s[1]); X.scale(sz / 100, sz / 100); X.rotate(-.15);
    const tri = (pts, sh) => { X.fillStyle = rgb(lerpC(c, [0, 0, 0], sh)); X.beginPath(); pts.forEach((p, i) => i ? X.lineTo(...p) : X.moveTo(...p)); X.closePath(); X.fill(); };
    tri([[-70, 0], [70, 0], [0, 18]], .25); tri([[0, 0], [-10, -70 * flap], [40, 0]], .05); tri([[0, 0], [10, -60 * flap * .8 + 12], [-40, 0]], .35); tri([[50, 0], [95, -40], [70, 4]], .15); tri([[-50, 0], [-90, -30], [-65, 4]], .2); X.restore(); }
  grain(X, .05, 'multiply'); });
// 52 极光
shaderStyle({ key: 'AURORA', cn: '极光湖', en: 'Aurora lake', cat: 'nature', desc: '北极夜空里绿色和紫红的极光像帘子一样摆动，倒映在雪山脚下静止的湖面上，星星缓慢转动。' }, `in vec2 uv; out vec4 o;
  vec3 sky(vec2 p){ vec3 c = mix(vec3(.01,.02,.06), vec3(.02,.06,.12), smoothstep(.6,-.2,p.y)); vec2 sp = p*rot(T*.01)*90.; vec2 id = floor(sp); float h = fract(sin(dot(id,vec2(12.9,78.2)))*43758.); vec2 f = fract(sp)-.5; c += vec3(.9,.95,1.)*step(.985,h)*smoothstep(.12,.0,length(f))*(.5+.5*sin(T*3.+h*50.));
    float w = smoothstep(-.7,.5,p.x);
    for(int k=0;k<3;k++){ float fk = float(k); float x = p.x*(1.1+fk*.3) + fk*1.7; float yc = -.02 + fk*.07 + .22*fbm(vec3(x*.6, fk, T*.06)) + .06*sin(x*2.3+T*.4+fk);
      float d = p.y - yc; float streak = .45 + .55*pow(n3(vec3(x*38., fk*7., T*.5)),2.); float band = smoothstep(-.012,.01,d)*exp(-max(d,0.)*(5.-fk))*streak;
      vec3 cg = mix(vec3(.15,1.,.55), vec3(.85,.25,.75), smoothstep(.0,.35,d)); c += cg*band*(.55-fk*.12)*w*1.6; }
    return c; }
  float mtn(float x){ return -.12 + .09*fbm(vec3(x*2.,0.,0.)) + .06*abs(sin(x*1.3+.4)); }
  void main(){ vec2 p = (uv*R - .5*R)/R.y; vec3 col; float m = mtn(p.x); float lake = -.2;
    if(p.y > m) col = sky(p); else if(p.y > lake) { col = vec3(.03,.04,.07) + vec3(.6,.7,.8)*smoothstep(m-.03,m,p.y)*.08*smoothstep(.0,.6,fbm(vec3(p*20.,0.)));}
    else { vec2 q = vec2(p.x + .004*sin(p.y*120.+T*2.), 2.*lake - p.y); float mm = mtn(q.x); col = (q.y > mm ? sky(q) : vec3(.02,.03,.05))*.55; col *= .8 + .2*sin(p.y*300.+T); }
    col = 1. - exp(-col*1.4); o = vec4(pow(col,vec3(.9)),1.); }`, () => grain(X, .05));
// 53 水磨石
st2D({ key: 'TERRAZZO', cn: '水磨石', en: 'Terrazzo', cat: 'pattern', desc: '暖白水磨石里嵌着大小不一的彩色碎石，碎石一片片落位，像一块被慢慢铺好的地面。' }, (lt) => {
  X.fillStyle = '#F1ECE3'; X.fillRect(0, 0, W, H); const r = rng(14); const cols = ['#D9583C', '#2E5E4E', '#E9B44C', '#1F2A44', '#C9B8A6', '#E58C6C']; const r0 = rng(2); for (let i = 0; i < 9000; i++) { X.fillStyle = `rgba(120,110,100,${r0() * .25})`; X.fillRect(r0() * W, r0() * H, 2, 2); }
  for (let i = 0; i < 260; i++) { const x = 700 + r() * 1300, y = r() * H, s = 6 + Math.pow(r(), 3) * 70, c = cols[Math.floor(r() * 6)], n = 5 + Math.floor(r() * 4), a0 = r() * 6; const t0 = (x - 700) / 1300 * 3 + r() * .6; const k = easeO((lt - t0) / .4); if (k <= 0) continue;
    X.save(); X.translate(x, y); X.rotate(a0 + (1 - k) * 2); X.scale(k, k); X.fillStyle = c; X.beginPath(); for (let j = 0; j < n; j++) { const a = j / n * Math.PI * 2, rr = s * (.6 + r() * .5); j ? X.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : X.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } X.closePath(); X.fill(); X.restore(); }
  const sh = X.createLinearGradient(0, 0, W, H); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.6, 'rgba(255,255,255,.12)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); X.fillStyle = sh; X.fillRect(0, 0, W, H); grain(X, .06, 'multiply'); });
// 54 马赛克
st2D({ key: 'MOSAIC', cn: '玻璃马赛克', en: 'Glass mosaic', cat: 'pattern', desc: '几千块小玻璃砖从右往左依次翻面落位，拼出一幅日落海景，每块砖都带一点不规则的光泽。' }, (lt) => {
  X.fillStyle = '#E8E2D6'; X.fillRect(0, 0, W, H); const sz = 26, gap = 3; const r = rng(4);
  for (let y = 0; y < H; y += sz) for (let x = 700; x < W; x += sz) { const u = (x - 700) / (W - 700), v = y / H; let c; if (v < .55) { c = lerpC([255, 120, 80], [80, 60, 140], Math.pow(1 - v / .55, 1.2)); const d = Math.hypot(u - .55, (v - .45) * 1.6); if (d < .14) c = [255, 226, 170]; } else { c = lerpC([30, 60, 120], [10, 20, 50], (v - .55) / .45); if (Math.abs(u - .55) < .1 * (1 - (v - .55) * 1.5) && (Math.floor(y / sz) % 2)) c = [255, 170, 110]; }
    c = c.map(q => q * (.85 + r() * .3)); const t0 = (1 - u) * 2.6 + r() * .5; const k = easeO((lt - t0) / .35); if (k <= 0) continue; X.save(); X.translate(x + sz / 2, y + sz / 2); X.scale(1, k); X.fillStyle = rgb(c); X.fillRect(-sz / 2 + gap / 2, -sz / 2 + gap / 2, sz - gap, sz - gap); X.fillStyle = 'rgba(255,255,255,.22)'; X.fillRect(-sz / 2 + gap / 2, -sz / 2 + gap / 2, sz - gap, 3); X.restore(); }
  grain(X, .05, 'multiply'); });
// 55 水滴微距
shaderStyle({ key: 'DROPLET', cn: '水滴微距', en: 'Dewdrop macro', cat: 'nature', desc: '微距镜头下叶片上的一颗露珠，像一枚透镜把背后的花倒映进去，叶脉在水珠下被放大。' }, `in vec2 uv; out vec4 o;
  vec3 scene(vec2 p){ vec3 leaf = mix(vec3(.12,.38,.14), vec3(.3,.6,.22), .5+.5*p.y); float vein = smoothstep(.01,.0, abs(p.y - .25*p.x - .02*sin(p.x*9.)))*.6 + smoothstep(.006,.0, abs(fract((p.x*.8+p.y)*6.)-.5)*.2)*.25; leaf += vec3(.25,.4,.15)*vein; float fl = exp(-dot(p-vec2(-.5,.5),p-vec2(-.5,.5))*3.); return mix(leaf, vec3(1.,.45,.6), fl*.8); }
  void main(){ vec2 p = (uv*R - vec2(.66,.5)*R)/R.y; vec2 c = vec2(0.,0.); float r = .28 + .005*sin(T*2.); vec2 q = p - c; q.y *= 1.12; float d = length(q); vec3 col;
    if(d < r){ float z = sqrt(r*r - d*d)/r; vec3 n = normalize(vec3(q/r, z)); vec2 refr = -q/r*.55*(1.-z*.4); col = scene(c + refr*1.3*vec2(-1.,-1.))*1.05; float fr = pow(1.-z,3.); col = mix(col, vec3(.85,.95,1.), fr*.5); col += vec3(1.)*pow(max(dot(reflect(vec3(0.,0.,-1.),n), normalize(vec3(-.4,.6,.7))),0.),60.)*1.2; col *= .8 + .2*smoothstep(.0,.5,z); }
    else { col = scene(p); float sh = smoothstep(r+.08, r, length((p-c-vec2(.05,-.05))*vec2(1.,1.12))); col *= 1. - .35*sh; col += vec3(.9,1.,.8)*smoothstep(r*.55,0.,length(p-c-vec2(.06,-.08)))*.15; }
    o = vec4(col,1.); }`, () => grain(X, .05));
// 56 沙漏
st2D({ key: 'HOURGLASS', cn: '沙漏', en: 'Hourglass', cat: 'product', desc: '玻璃沙漏里一缕细沙落下，下方沙丘慢慢长高，上方漏成一个旋涡，玻璃的高光映着暖光。' }, (lt) => {
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1E1A17'); g.addColorStop(1, '#3A2E25'); X.fillStyle = g; X.fillRect(0, 0, W, H); const cx = 1260, top = 170, bot = 930, neck = 550; const p = clamp01(lt / 8);
  const glass = new Path2D(); glass.moveTo(cx - 230, top); glass.bezierCurveTo(cx - 230, top + 250, cx - 20, neck - 60, cx - 12, neck); glass.bezierCurveTo(cx - 20, neck + 60, cx - 230, bot - 250, cx - 230, bot); glass.lineTo(cx + 230, bot); glass.bezierCurveTo(cx + 230, bot - 250, cx + 20, neck + 60, cx + 12, neck); glass.bezierCurveTo(cx + 20, neck - 60, cx + 230, top + 250, cx + 230, top); glass.closePath();
  X.save(); X.clip(glass); const sand = '#E2A55B'; const tl = top + 60 + p * 300; X.fillStyle = sand; X.beginPath(); X.moveTo(cx - 300, neck); X.lineTo(cx - 300, tl); X.quadraticCurveTo(cx, tl + 80, cx + 300, tl); X.lineTo(cx + 300, neck); X.fill();
  const bh = 40 + p * 300; X.beginPath(); X.moveTo(cx - 300, bot); X.lineTo(cx - 300, bot - bh * .35); X.quadraticCurveTo(cx, bot - bh * 1.3, cx + 300, bot - bh * .35); X.lineTo(cx + 300, bot); X.fill(); const sg = X.createLinearGradient(cx - 230, 0, cx + 230, 0); sg.addColorStop(0, 'rgba(0,0,0,.35)'); sg.addColorStop(.5, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,.4)'); X.fillStyle = sg; X.fillRect(cx - 300, top, 600, bot - top);
  const r = rng(Math.floor(lt * 30)); X.fillStyle = '#F2C27E'; for (let i = 0; i < 260; i++) { const y = neck + r() * (bot - bh * .9 - neck); X.fillRect(cx - 2 + (r() - .5) * 5, y, 2, 2); } X.restore();
  X.strokeStyle = 'rgba(255,240,220,.5)'; X.lineWidth = 2; X.stroke(glass); X.strokeStyle = 'rgba(255,255,255,.35)'; X.lineWidth = 8; X.beginPath(); X.moveTo(cx - 180, top + 40); X.bezierCurveTo(cx - 180, top + 200, cx - 60, neck - 90, cx - 40, neck - 40); X.stroke();
  X.fillStyle = '#5A3E28'; X.fillRect(cx - 290, top - 50, 580, 50); X.fillRect(cx - 290, bot, 580, 50); X.fillStyle = '#7A5638'; X.fillRect(cx - 290, top - 50, 580, 10); X.fillRect(cx - 290, bot, 580, 10); grain(X, .06); });
// 57 邮票拼贴
st2D({ key: 'STAMPS', cn: '邮票拼贴', en: 'Stamp collage', cat: 'graphic', desc: '一张张齿孔邮票落到牛皮纸上，盖着邮戳，图案是山、鸟和花，复古的印刷色让画面很耐看。' }, (lt) => {
  X.fillStyle = '#D6BE97'; X.fillRect(0, 0, W, H); const r0 = rng(2); for (let i = 0; i < 12000; i++) { X.fillStyle = `rgba(120,90,50,${r0() * .12})`; X.fillRect(r0() * W, r0() * H, 2, 1); } const r = rng(7); const pals = [['#C8452C', '#F3E6CC', '#1F3A5A'], ['#2E6B4F', '#F1E4C4', '#D9A23A'], ['#1F3A8A', '#F4E8D0', '#E05A47'], ['#7A3B6B', '#F3E3CE', '#3C8C7A']];
  for (let i = 0; i < 14; i++) { const t0 = i * .35; const k = easeO((lt - t0) / .4); if (k <= 0) continue; const x = 760 + (i % 5) * 230 + r() * 60, y = 120 + Math.floor(i / 5) * 300 + r() * 60, w = 170 + r() * 40, h = 220 + r() * 30, rot = (r() - .5) * .3, pal = pals[i % 4];
    X.save(); X.translate(x + w / 2, y + h / 2 - (1 - k) * 80); X.rotate(rot + (1 - k) * .5); X.shadowColor = 'rgba(60,40,20,.35)'; X.shadowBlur = 14; X.shadowOffsetY = 6; X.fillStyle = '#FBF6EA'; X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.fill(); X.shadowColor = 'transparent';
    X.fillStyle = '#D6BE97'; for (let s = -w / 2; s <= w / 2; s += 14) { X.beginPath(); X.arc(s, -h / 2, 4, 0, 7); X.arc(s, h / 2, 4, 0, 7); X.fill(); } for (let s = -h / 2; s <= h / 2; s += 14) { X.beginPath(); X.arc(-w / 2, s, 4, 0, 7); X.arc(w / 2, s, 4, 0, 7); X.fill(); }
    X.fillStyle = pal[1]; X.fillRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 60); X.fillStyle = pal[0]; const ty = i % 3; if (ty === 0) { X.beginPath(); X.moveTo(-w / 2 + 14, h / 2 - 46); X.lineTo(-10, -30); X.lineTo(20, 0); X.lineTo(w / 2 - 14, -50); X.lineTo(w / 2 - 14, h / 2 - 46); X.fill(); X.fillStyle = pal[2]; X.beginPath(); X.arc(40, -60, 20, 0, 7); X.fill(); }
    else if (ty === 1) { for (let k2 = 0; k2 < 5; k2++) { X.save(); X.rotate(k2 * 1.256); X.beginPath(); X.ellipse(0, -30, 14, 30, 0, 0, 7); X.fill(); X.restore(); } X.fillStyle = pal[2]; X.beginPath(); X.arc(0, 0, 12, 0, 7); X.fill(); } else { X.beginPath(); X.moveTo(-50, 0); X.quadraticCurveTo(0, -60, 50, -10); X.quadraticCurveTo(10, -10, -50, 0); X.fill(); X.fillStyle = pal[2]; X.fillRect(-60, 30, 120, 6); }
    font(X, '900', 22, F.inter); X.fillStyle = pal[0]; X.fillText(String(8 + i * 12), -w / 2 + 16, h / 2 - 20); font(X, '500', 11, F.mono); X.fillText('POSTAGE', w / 2 - 74, h / 2 - 22);
    if (i % 3 === 1) { X.strokeStyle = 'rgba(30,30,40,.55)'; X.lineWidth = 2; X.beginPath(); X.arc(w / 2 - 20, -h / 2 + 30, 44, 0, 7); X.stroke(); for (let l = 0; l < 4; l++) { X.beginPath(); X.moveTo(w / 2 + 30, -h / 2 + 10 + l * 12); X.lineTo(w / 2 + 120, -h / 2 + 10 + l * 12); X.stroke(); } }
    X.restore(); } grain(X, .07, 'multiply'); });
// 58 线框巨浪
st2D({ key: 'WIREWAVE', cn: '线框巨浪', en: 'Wireframe wave', cat: 'line', desc: '一道巨浪用线框网格画出来，浪头卷起、向画面左侧压过来，致敬浮世绘的神奈川冲浪。' }, (lt) => {
  X.fillStyle = '#F0EBDF'; X.fillRect(0, 0, W, H); const P = cam3([-2.2, 1.6, -4.6], [1.2, 1.5, 2.6], 64, 0, [260, 40]); const crest = (u, v) => { const ph = lt * .5; const x = u * 10 - 3 - ph, z = v * 8; let y = Math.exp(-Math.pow((u - .55) * 4, 2)) * 3.8 * (1 - v * .2);
      const curl = Math.exp(-Math.pow((u - .62) * 6, 2)) * Math.max(0, y - 1.8); return [x - curl * 1.4 * Math.sin(curl * 1.2), y + Math.sin(u * 30 + v * 4 + lt * 2) * .06 - curl * .3, z]; };
  X.strokeStyle = '#1D3A6E'; X.lineWidth = 1.4; for (let j = 0; j <= 30; j++) { const pts = []; for (let i = 0; i <= 120; i++) pts.push(crest(i / 120, j / 30)); X.globalAlpha = .35 + .5 * (1 - j / 30); line3(X, P, pts); } for (let i = 0; i <= 80; i++) { const pts = []; for (let j = 0; j <= 30; j++) pts.push(crest(i / 80, j / 30)); X.globalAlpha = .25; line3(X, P, pts); } X.globalAlpha = 1;
  X.fillStyle = '#C8452C'; X.beginPath(); X.arc(1650, 230, 60, 0, 7); X.fill(); grain(X, .06, 'multiply'); });
// 59 神经网络
st2D({ key: 'NEURAL', cn: '神经网络', en: 'Neural net', cat: 'tech', desc: '一张多层神经网络的连接图，信号像光点一样沿权重线从左往右传递，亮起的路径就是它的「思考」。' }, (lt) => {
  const bg = X.createRadialGradient(1300, 540, 0, 1300, 540, 900); bg.addColorStop(0, '#0E1230'); bg.addColorStop(1, '#04050B'); X.fillStyle = bg; X.fillRect(0, 0, W, H);
  const layers = [5, 9, 13, 13, 9, 4]; const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => [760 + li * 215, 540 + (i - (n - 1) / 2) * 66])); const r = rng(3);
  X.save(); X.globalCompositeOperation = 'lighter'; for (let l = 0; l < nodes.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) { const w = r(); const hot = w > .62; X.strokeStyle = hot ? `rgba(120,160,255,${.12 + w * .2})` : `rgba(90,120,220,.06)`; X.lineWidth = hot ? 1.4 : .8; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke();
      const ph = ((lt * .8 - l * .3 + w * 3) % 2.2); if (hot && ph > 0 && ph < 1) { const x = a[0] + (b[0] - a[0]) * ph, y = a[1] + (b[1] - a[1]) * ph; const g = X.createRadialGradient(x, y, 0, x, y, 22); g.addColorStop(0, 'rgba(255,215,140,1)'); g.addColorStop(.25, 'rgba(255,160,70,.5)'); g.addColorStop(1, 'rgba(255,120,40,0)'); X.fillStyle = g; X.fillRect(x - 22, y - 22, 44, 44); } }
  nodes.forEach((L, li) => L.forEach(([x, y], i) => { const act = .5 + .5 * Math.sin(lt * 2.2 - li * 1.1 + i * 1.3); const g = X.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, `rgba(255,170,90,${act * .55})`); g.addColorStop(1, 'rgba(255,120,40,0)'); X.fillStyle = g; X.fillRect(x - 40, y - 40, 80, 80); })); X.restore();
  nodes.forEach((L, li) => L.forEach(([x, y], i) => { const act = .5 + .5 * Math.sin(lt * 2.2 - li * 1.1 + i * 1.3); X.fillStyle = '#0A0D20'; X.strokeStyle = `rgba(170,195,255,${.6 + act * .4})`; X.lineWidth = 2.5; X.beginPath(); X.arc(x, y, 15, 0, 7); X.fill(); X.stroke(); X.fillStyle = `rgba(255,200,130,${.3 + act * .7})`; X.beginPath(); X.arc(x, y, 8 * act + 2, 0, 7); X.fill(); }));
  font(X, '500', 14, F.mono); X.fillStyle = 'rgba(170,190,255,.6)'; ['INPUT', 'H1', 'H2', 'H3', 'H4', 'OUT'].forEach((t, i) => X.fillText(t, 745 + i * 215, 1000)); grain(X, .05); });
// 60 风动雕塑
st2D({ key: 'KINETIC', cn: '风动雕塑', en: 'Kinetic sculpture', cat: 'space', desc: '几百根细线吊着的木片排成网格，由一组偏心轮驱动，整面木片像海浪一样起伏，安静又精密。' }, (lt) => {
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2A2420'); g.addColorStop(1, '#14110F'); X.fillStyle = g; X.fillRect(0, 0, W, H); const P = cam3([-1.0, .6, -1.4], [1.9, -.55, 2.4], 64, 0, [260, 0]); const items = [];
  for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++) { const x = i * .2, z = j * .2; const y = -.55 + .3 * Math.sin(x * 1.4 + lt * 1.2) * Math.cos(z * 1.1 - lt * .8) + .12 * Math.sin((x + z) * 2.2 + lt * 2); const tilt = .5 * Math.cos(x * 1.4 + lt * 1.2) * Math.cos(z * 1.1 - lt * .8); items.push([x, y, z, tilt]); }
  items.sort((a, b) => V3.len(V3.sub(b, P.eye)) - V3.len(V3.sub(a, P.eye)));
  for (const [x, y, z, tl] of items) { const a = P([x, 3, z]), b = P([x, y, z]); X.strokeStyle = 'rgba(255,230,200,.12)'; X.lineWidth = .7; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); const hw = .085; const q = [[-hw, -tl * hw, -hw], [hw, tl * hw, -hw], [hw, tl * hw, hw], [-hw, -tl * hw, hw]].map(([dx, dy, dz]) => P([x + dx, y + dy, z + dz]));
    const sh = clamp01(.55 + tl * .9 + (y + .55) * .6); X.fillStyle = rgb(lerpC([70, 45, 25], [255, 205, 140], sh)); X.beginPath(); q.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.closePath(); X.fill(); }
  const sp = X.createRadialGradient(1300, 300, 0, 1300, 300, 900); sp.addColorStop(0, 'rgba(255,200,140,.12)'); sp.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = sp; X.fillRect(0, 0, W, H); grain(X, .05); });
