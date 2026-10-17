// ===== BATCH 3 · graphic & typographic =====
function st2D(meta, fn) { ST.push(Object.assign(meta, { render: fn })); }
// 18 可变字重
st2D({ key: 'VARFONT', cn: '可变字重', en: 'Variable weight', cat: 'type', desc: '同一个单词里每个字母的粗细像波浪一样起伏，可变字体让排版本身变成动画。' }, (lt) => {
  X.fillStyle = '#EFEBE3'; X.fillRect(0, 0, W, H); const words = ['MOTION', 'WEIGHT', 'RHYTHM', 'MOTION', 'WEIGHT']; const ws = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  X.textBaseline = 'alphabetic'; words.forEach((w, row) => { let x = 760 + (row % 2 ? -60 : 0); const y = 190 + row * 205; const size = 210;
    for (let i = 0; i < w.length; i++) { const ph = Math.sin(i * .7 - lt * 2.2 + row * .9); const wi = Math.round((ph * .5 + .5) * 8); font(X, String(ws[wi]), size, F.disp); X.fillStyle = (row === 2 && i === 2) ? '#E63A1F' : '#141414'; X.fillText(w[i], x, y); x += X.measureText(w[i]).width - 4; } });
  X.fillStyle = '#141414'; X.fillRect(760, 1000, 1000, 2); font(X, '500', 14, F.mono); X.fillText('WGHT 100 → 900   ·   INTER DISPLAY VARIABLE', 760, 1030); grain(X, .05, 'multiply'); });
// 19 书法笔触
(() => { const strokes = [ // 永 : [points], start width, end width
  [[[.47, .07], [.505, .12], [.53, .175]], 34, 22], [[[.33, .27], [.47, .265], [.61, .255]], 30, 26], [[[.6, .26], [.585, .5], [.57, .86]], 36, 30], [[[.57, .86], [.53, .83], [.48, .79]], 30, 6],
  [[[.22, .47], [.32, .455], [.42, .45]], 26, 24], [[[.42, .45], [.33, .6], [.2, .73]], 28, 6], [[[.77, .33], [.71, .4], [.635, .47]], 26, 8], [[[.62, .47], [.74, .63], [.9, .8]], 16, 46]];
  st2D({ key: 'BRUSH', cn: '书法笔触', en: 'Dry brush', cat: 'type', desc: '一笔一笔写出「永」字，飞白的枯笔质感由几百根细丝叠成，最后盖上朱红印章。' }, (lt) => {
    X.fillStyle = '#EDE6D6'; X.fillRect(0, 0, W, H); const r0 = rng(3); for (let i = 0; i < 9000; i++) { X.fillStyle = `rgba(120,100,70,${r0() * .05})`; X.fillRect(r0() * W, r0() * H, 1 + r0() * 2, 1); }
    const ox = 880, oy = 80, S = 900; const prog = lt / 6 * strokes.length;
    strokes.forEach(([pts, w0, w1], si) => { const pr = clamp01(prog - si); if (pr <= 0) return; const r = rng(si + 11); const sm = []; for (let k = 0; k <= 40; k++) { const u = k / 40; const a = pts[0], b = pts[1], c = pts[2]; sm.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * b[0] + u * u * c[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * b[1] + u * u * c[1]]); }
      const n = Math.max(2, Math.floor(sm.length * pr)); for (let hb = 0; hb < 220; hb++) { const off = (r() - .5) * 2, dry = r(); X.strokeStyle = `rgba(14,12,10,${.22 + .55 * r()})`; X.lineWidth = .8 + r() * 1.8; X.beginPath(); let pen = false;
        for (let k = 0; k < n; k++) { const u = k / 40; const press = Math.min(1, u * 6 + .35); const w = (w0 + (w1 - w0) * u) * press * 1.25; const [x, y] = sm[k]; const [x2, y2] = sm[Math.min(40, k + 1)]; const tx = x2 - x, ty = y2 - y, tl = Math.hypot(tx, ty) || 1; const px = ox + x * S - ty / tl * off * w, py = oy + y * S + tx / tl * off * w;
          const gap = u > .45 && Math.abs(off) > .45 && fbm2(k * .25 + hb * .7, si) < .3 + dry * .35; if (gap) { pen = false; continue; } if (!pen) { X.moveTo(px, py); pen = true; } else X.lineTo(px, py); } X.stroke(); } });
    const sa = easeO((lt - 6.3) / .3); if (sa > 0) { X.save(); X.translate(1700, 900); X.scale(1 + (1 - sa) * .6, 1 + (1 - sa) * .6); X.globalAlpha = sa; X.fillStyle = '#B5281D'; X.fillRect(-56, -56, 112, 112); X.fillStyle = '#EDE6D6'; font(X, '900', 44, F.serif); X.textAlign = 'center'; X.fillText('永', 0, -4); X.fillText('字', 0, 44); X.textAlign = 'left'; X.restore(); }
    grain(X, .06, 'multiply'); }); })();
// 20 钞票纹
st2D({ key: 'GUILLOCHE', cn: '防伪钞票纹', en: 'Guilloché', cat: 'graphic', desc: '钞票上那种层层叠叠的精密花纹，几十条摆线缠绕成玫瑰窗，翡翠绿配金线。' }, (lt) => {
  X.fillStyle = '#F1ECDF'; X.fillRect(0, 0, W, H); const cx = 1260, cy = 540; X.lineWidth = 1.1;
  const rose = (R, r, d, n, col, al, rot) => { X.strokeStyle = col; X.globalAlpha = al; X.beginPath(); for (let i = 0; i <= 2400; i++) { const t = i / 2400 * Math.PI * 2 * n; const x = (R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t), y = (R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t); const a = rot; const X1 = x * Math.cos(a) - y * Math.sin(a), Y1 = x * Math.sin(a) + y * Math.cos(a); i ? X.lineTo(cx + X1, cy + Y1) : X.moveTo(cx + X1, cy + Y1); } X.stroke(); X.globalAlpha = 1; };
  for (let k = 0; k < 14; k++) rose(400, 400 / 13, 150 + k * 10, 13, '#0F5A4A', .5, lt * .05 * (k % 2 ? 1 : -1) + k * .045);
  for (let k = 0; k < 10; k++) rose(270, 270 / 17, 90 + k * 8, 17, '#B88A2E', .7, -lt * .07 + k * .04);
  for (let k = 0; k < 8; k++) rose(140, 140 / 11, 46 + k * 6, 11, '#0F5A4A', .8, lt * .1 + k * .05);
  X.strokeStyle = '#0F5A4A'; X.lineWidth = 2; X.beginPath(); X.arc(cx, cy, 480, 0, 7); X.stroke(); X.lineWidth = 1; X.beginPath(); X.arc(cx, cy, 492, 0, 7); X.stroke();
  font(X, '500', 16, F.mono); X.fillStyle = '#0F5A4A'; X.fillText('SERIAL  A 0 2 6 1 4 9 5 5', 780, 1000); grain(X, .05, 'multiply'); });
// 21 构成主义
st2D({ key: 'CONSTRUCT', cn: '构成主义', en: 'Constructivist', cat: 'graphic', desc: '红黑两色、斜线、巨大的圆和粗体字，二十年代先锋海报的冲击力，元素一个个砸进画面。' }, (lt) => {
  X.fillStyle = '#E9E0CC'; X.fillRect(0, 0, W, H); const k = i => easeO((lt - i * .35) / .5);
  X.save(); X.translate(1300, 540); X.rotate(-.42);
  X.fillStyle = '#C8231B'; X.beginPath(); X.arc(140, -40, 330 * k(0), 0, 7); X.fill();
  X.fillStyle = '#141414'; X.fillRect(-900 + (1 - k(1)) * -800, 120, 1800, 70); X.fillRect(-60, -520 + (1 - k(2)) * -900, 60, 1100);
  X.fillStyle = '#141414'; font(X, '900', 190, F.inter); X.letterSpacing = '-8px'; X.fillText('FORWARD', -760 + (1 - k(3)) * 1400, 100); X.letterSpacing = '0px';
  X.fillStyle = '#C8231B'; X.beginPath(); X.moveTo(220, 240); X.lineTo(820 * k(4) + 220, 240); X.lineTo(220, 330); X.fill(); X.restore();
  X.fillStyle = '#141414'; font(X, '700', 22, F.inter); X.fillText('No. 21   ·   1926 → 2026', 760, 1010); grain(X, .08, 'multiply'); });
// 22 装饰艺术
st2D({ key: 'DECO', cn: '装饰艺术', en: 'Art Deco', cat: 'graphic', desc: '黑底金线的扇形放射和阶梯拱门，对称、昂贵，像一座二十年代酒店大堂的入口。' }, (lt) => {
  X.fillStyle = '#0B0B0D'; X.fillRect(0, 0, W, H); const cx = 1280, by = 980; const gold = (a) => `rgba(214,176,98,${a})`; X.lineWidth = 2;
  const g = easeO(lt / 2.5); for (let i = 0; i < 9; i++) { const R = 120 + i * 62; X.strokeStyle = gold(.9 - i * .06); X.beginPath(); X.arc(cx, by, R * g, Math.PI, 0); X.stroke(); }
  for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; X.strokeStyle = gold(.5); X.beginPath(); X.moveTo(cx + Math.cos(a) * 120, by + Math.sin(a) * 120); X.lineTo(cx + Math.cos(a) * 680 * g, by + Math.sin(a) * 680 * g); X.stroke(); }
  for (let s = 0; s < 5; s++) { const w = 760 - s * 110, h = 760 - s * 110; X.strokeStyle = gold(.8); X.lineWidth = s === 0 ? 3 : 1.5; X.beginPath(); X.moveTo(cx - w / 2, by); X.lineTo(cx - w / 2, by - h + w / 2); X.arc(cx, by - h + w / 2, w / 2, Math.PI, 0); X.lineTo(cx + w / 2, by); X.stroke(); }
  const sweep = (lt * .35) % 1.4 - .2; const sg = X.createLinearGradient(cx - 700 + sweep * 1400, 0, cx - 500 + sweep * 1400, 0); sg.addColorStop(0, 'rgba(255,240,200,0)'); sg.addColorStop(.5, 'rgba(255,240,200,.18)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); X.fillStyle = sg; X.fillRect(cx - 800, 100, 1600, by);
  X.fillStyle = gold(1); X.fillRect(cx - 820, by, 1640, 3); font(X, '300', 30, F.disp); X.letterSpacing = '18px'; X.textAlign = 'center'; X.fillText('GRAND  LOBBY', cx, by + 60); X.textAlign = 'left'; X.letterSpacing = '0px'; grain(X, .05); });
// 23 青海波
st2D({ key: 'SEIGAIHA', cn: '青海波', en: 'Seigaiha waves', cat: 'pattern', desc: '日本传统的青海波纹样一层层叠起，像海浪向远处推开，一轮金色满月压在纹样之上。' }, (lt) => {
  X.fillStyle = '#0F2447'; X.fillRect(0, 0, W, H); const R = 70; const off = (lt * 18) % (R * 2);
  for (let row = -2; row < 36; row++) { const y = row * R * .5 + off * .5 - R; for (let col = -1; col < 18; col++) { const x = col * R * 2 + (row % 2 ? R : 0) - 60;
      for (let k = 5; k >= 1; k--) { X.fillStyle = k % 2 ? '#0F2447' : '#E9E2D0'; X.beginPath(); X.arc(x, y, R * k / 5, Math.PI, 0); X.fill(); } } }
  const mg = X.createRadialGradient(1380, 360, 20, 1380, 360, 230); mg.addColorStop(0, '#F5D58A'); mg.addColorStop(1, '#C9952F'); X.fillStyle = mg; X.beginPath(); X.arc(1380, 360, 220, 0, 7); X.fill();
  const sh = X.createLinearGradient(0, 0, 900, 0); sh.addColorStop(0, 'rgba(15,36,71,.95)'); sh.addColorStop(1, 'rgba(15,36,71,0)'); X.fillStyle = sh; X.fillRect(0, 0, 900, H); grain(X, .07); });
// 24 祥云纹
st2D({ key: 'XIANGYUN', cn: '祥云漆金', en: 'Auspicious clouds', cat: 'pattern', desc: '中国红漆底上，金色祥云一层层由远及近飘过，前景大、远景小，用视差做出纵深。' }, (lt) => {
  const bg = X.createRadialGradient(1300, 480, 50, 1200, 540, 1300); bg.addColorStop(0, '#B4231C'); bg.addColorStop(1, '#4A0807'); X.fillStyle = bg; X.fillRect(0, 0, W, H);
  const cloud = (x, y, s, a) => { X.save(); X.translate(x, y); X.scale(s, s); X.globalAlpha = a; X.strokeStyle = '#F1C66B'; X.lineWidth = 6 / s * s; X.lineCap = 'round';
    const spiral = (cx, cy, r0, dir) => { X.beginPath(); for (let t = 0; t < 4.2 * Math.PI; t += .1) { const r = r0 * (1 - t / (4.6 * Math.PI)); X.lineTo(cx + Math.cos(t * dir) * r, cy + Math.sin(t * dir) * r); } X.stroke(); };
    spiral(0, 0, 40, 1); spiral(80, -20, 52, -1); spiral(170, 5, 38, 1); X.beginPath(); X.moveTo(-40, 40); X.bezierCurveTo(30, 70, 140, 70, 210, 40); X.bezierCurveTo(260, 25, 300, 40, 330, 30); X.stroke(); X.restore(); };
  const r = rng(5); for (let layer = 0; layer < 4; layer++) { const s = .5 + layer * .55, sp = 30 + layer * 60; for (let k = 0; k < 6 - layer; k++) { const x = ((r() * 2200 + lt * sp) % 2400) - 300, y = 120 + r() * 840; cloud(x, y, s, .35 + layer * .2); } }
  const sh = X.createLinearGradient(0, 0, 900, 0); sh.addColorStop(0, 'rgba(60,6,6,.85)'); sh.addColorStop(1, 'rgba(60,6,6,0)'); X.fillStyle = sh; X.fillRect(0, 0, 900, H); grain(X, .07); });
// 25 扎染
shaderStyle({ key: 'SHIBORI', cn: '靛蓝扎染', en: 'Indigo shibori', cat: 'pattern', desc: '靛蓝染液在白布上一圈圈晕开，扎染的折痕形成放射花纹，边缘带着毛细渗透的纹理。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R - vec2(.66,.5)*R)/R.y; float r = length(p), a = atan(p.y,p.x); float fold = abs(sin(a*6. + fbm(vec3(p*3.,1.))*1.5)); float spread = clamp(T*.12+.25,0.,1.);
    float rings = sin(r*42. - fbm(vec3(p*4.,2.))*6. + fold*3.); float dye = smoothstep(spread, spread-.25, r + fbm(vec3(p*8.,3.))*.12) * (.55 + .45*smoothstep(-.3,.6,rings)) * (.65+.35*fold);
    vec2 g = abs(fract(p*3.+.5)-.5); float grid = smoothstep(.02,.0,min(g.x,g.y))*.5; dye = max(dye, grid*smoothstep(spread+.1, spread-.2, r)*.0);
    vec3 cloth = vec3(.95,.94,.9)*(.95+.05*fbm(vec3(uv*vec2(400.,8.),1.))); vec3 ind = vec3(.07,.13,.32); vec3 col = mix(cloth, ind, clamp(dye,0.,1.)); col = mix(col, ind*.7, smoothstep(.8,1.,dye)); o = vec4(col,1.); }`, () => grain(X, .06, 'multiply'));
// 26 LED 点阵屏
st2D({ key: 'LED', cn: 'LED 点阵屏', en: 'Dot-matrix sign', cat: 'tech', desc: '车站信息屏式的琥珀色点阵，文字一个个滚过，每个灯珠都带着微光，透视让屏幕斜着冲出画面。' }, (lt) => {
  X.fillStyle = '#0A0806'; X.fillRect(0, 0, W, H); const tc = document.createElement('canvas'); tc.width = 2000; tc.height = 9; const T2 = tc.getContext('2d'); T2.fillStyle = '#000'; T2.fillRect(0, 0, 2000, 9); T2.fillStyle = '#fff'; T2.font = '9px "DejaVu Sans Mono"'; T2.textBaseline = 'top'; T2.fillText('  NEXT  ·  15 STYLES  ·  OPUS 5.5  ·  ON TIME  ·  PLATFORM 07  ·  NEXT  ·  15 STYLES', -Math.floor(lt * 22) % 300, 0);
  const d = T2.getImageData(0, 0, 2000, 9).data; const cols = 150, rows = 9; const P = cam3([0, 0, 0], [.35, .05, 1], 50, 0, [0, 0]);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const on = d[(j * 2000 + i) * 4] > 100; const wx = -1.2 + i * .06, wy = .3 - j * .07, wz = 3 + i * .045; const s = P([wx, wy, wz]); if (s[2] < .2) continue; const rr = .022 * P.k / s[2];
    if (on) { const g = X.createRadialGradient(s[0], s[1], 0, s[0], s[1], rr * 2.4); g.addColorStop(0, 'rgba(255,190,60,.9)'); g.addColorStop(.4, 'rgba(255,140,20,.35)'); g.addColorStop(1, 'rgba(255,120,0,0)'); X.fillStyle = g; X.fillRect(s[0] - rr * 2.4, s[1] - rr * 2.4, rr * 4.8, rr * 4.8); X.fillStyle = '#FFE3A0'; } else X.fillStyle = '#2A1C10';
    X.beginPath(); X.arc(s[0], s[1], rr, 0, 7); X.fill(); }
  grain(X, .06); });
// 27 黑胶唱片
st2D({ key: 'VINYL', cn: '黑胶唱片', en: 'Spinning vinyl', cat: 'product', desc: '一张黑胶在唱机上旋转，沟槽里的高光随转速流动，唱臂缓缓落下，像唱片封套的产品照。' }, (lt) => {
  const bg = X.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#E6513A'); bg.addColorStop(1, '#C23A26'); X.fillStyle = bg; X.fillRect(0, 0, W, H); const cx = 1250, cy = 560, R = 430; const ang = lt * 3.5;
  X.save(); X.shadowColor = 'rgba(60,10,0,.45)'; X.shadowBlur = 60; X.shadowOffsetY = 30; X.fillStyle = '#0D0D0F'; X.beginPath(); X.arc(cx, cy, R, 0, 7); X.fill(); X.restore();
  for (let r = R - 10; r > 150; r -= 2.2) { X.strokeStyle = `rgba(255,255,255,${.025 + .02 * Math.sin(r * .9)})`; X.lineWidth = 1; X.beginPath(); X.arc(cx, cy, r, 0, 7); X.stroke(); }
  X.save(); X.globalCompositeOperation = 'lighter'; for (const off of [0, Math.PI]) { const a0 = -.75 + off; const g = X.createConicGradient ? X.createConicGradient(a0 - .25, cx, cy) : null; if (g) { g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.04, 'rgba(255,255,255,.22)'); g.addColorStop(.08, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)'); X.fillStyle = g; X.beginPath(); X.arc(cx, cy, R - 12, 0, 7); X.arc(cx, cy, 150, 0, 7, true); X.fill(); } } X.restore();
  X.save(); X.translate(cx, cy); X.rotate(ang); X.fillStyle = '#F3E9D6'; X.beginPath(); X.arc(0, 0, 140, 0, 7); X.fill(); X.fillStyle = '#E6513A'; X.beginPath(); X.arc(0, 0, 140, -Math.PI / 2, Math.PI / 2); X.fill(); font(X, '900', 26, F.disp); X.fillStyle = '#141414'; X.textAlign = 'center'; X.fillText('SIDE A', 0, -60); font(X, '500', 14, F.mono); X.fillText('33⅓ RPM', 0, 80); X.textAlign = 'left'; X.fillStyle = '#141414'; X.beginPath(); X.arc(0, 0, 9, 0, 7); X.fill(); X.restore();
  const arm = -.45 + easeIO((lt - .5) / 2) * .38; X.save(); X.translate(cx + 520, cy - 360); X.rotate(arm); X.strokeStyle = '#D9D9DC'; X.lineWidth = 14; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, 0); X.lineTo(-40, 520); X.lineTo(-110, 600); X.stroke(); X.fillStyle = '#2A2A2E'; X.fillRect(-140, 590, 60, 34); X.fillStyle = '#E2E2E5'; X.beginPath(); X.arc(0, 0, 46, 0, 7); X.fill(); X.restore();
  grain(X, .05); });
// 28 科幻仪表
st2D({ key: 'HUDRING', cn: '科幻仪表', en: 'Sci-fi HUD', cat: 'tech', desc: '电影里的全息界面：同心刻度环以不同速度转动，数据读数不停跳动，青色线条叠在深蓝上。' }, (lt) => {
  X.fillStyle = '#04101C'; X.fillRect(0, 0, W, H); const cx = 1280, cy = 540; X.save(); X.globalCompositeOperation = 'lighter'; const c = (a) => `rgba(90,220,255,${a})`;
  const ring = (R, w, n, sp, gap, a) => { X.strokeStyle = c(a); X.lineWidth = w; for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2 + lt * sp; X.beginPath(); X.arc(cx, cy, R, a0, a0 + (Math.PI * 2 / n) * (1 - gap)); X.stroke(); } };
  ring(420, 2, 1, 0, 0, .25); ring(400, 10, 36, .1, .5, .5); ring(360, 2, 3, -.3, .2, .8); ring(320, 22, 60, .05, .7, .35); ring(270, 3, 8, .5, .3, .7); ring(220, 1.5, 1, 0, 0, .5); ring(200, 14, 4, -.8, .6, .6); ring(140, 2, 12, 1.2, .5, .9);
  for (let i = 0; i < 120; i++) { const a = i / 120 * Math.PI * 2; const L = i % 10 === 0 ? 24 : 10; X.strokeStyle = c(.5); X.lineWidth = 1; X.beginPath(); X.moveTo(cx + Math.cos(a) * 440, cy + Math.sin(a) * 440); X.lineTo(cx + Math.cos(a) * (440 + L), cy + Math.sin(a) * (440 + L)); X.stroke(); }
  const sweep = lt * 1.2; const g = X.createConicGradient(sweep, cx, cy); g.addColorStop(0, 'rgba(90,220,255,.35)'); g.addColorStop(.12, 'rgba(90,220,255,0)'); g.addColorStop(1, 'rgba(90,220,255,0)'); X.fillStyle = g; X.beginPath(); X.arc(cx, cy, 300, 0, 7); X.fill(); X.restore();
  font(X, '200', 120, F.disp); X.fillStyle = '#C9F4FF'; X.textAlign = 'center'; X.fillText(String(Math.floor(87 + 12 * Math.sin(lt))).padStart(2, '0'), cx, cy + 40); font(X, '500', 16, F.mono); X.fillText('SYNC  %', cx, cy + 80); X.textAlign = 'left';
  font(X, '500', 15, F.mono); X.fillStyle = 'rgba(160,235,255,.8)'; for (let k = 0; k < 6; k++) X.fillText(`CH-${k + 1}  ${(Math.sin(lt * 1.3 + k) * 50 + 50).toFixed(2).padStart(6, '0')}`, 1650, 300 + k * 26); grain(X, .05); });
