(() => {
// ================= 04–07 =================
// ---- 04 亚克力阶梯 ----
(() => {
  const FS = COMMON + `
  in vec2 uv; out vec4 o; uniform float LA;
  float box(vec3 p, vec3 b){ vec3 q = abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
  float rbox(vec3 p, vec3 b, float r){ return box(p,b-r)-r; }
  float ease(float x){ x = clamp(x,0.,1.); return 1.-pow(1.-x,3.) + sin(x*3.14159)*.12*(1.-x); }
  vec2 map(vec3 p){ float d = p.y; float id = -1.; float i0 = clamp(floor(p.x/.62+.5)-1.,0.,13.); for(int j=0;j<3;j++){ float fi = i0+float(j); float b = ease((T - .2 - fi*.13)/.55); vec3 c = vec3(fi*.62, fi*.34 + .17 - (1.-b)*(fi*.34+.6), fi*.18); float s = rbox(p - c, vec3(.31,.17,1.1), .035); s = max(s, -p.y); if(s<d){ d=s; id=fi; } }
    return vec2(d,id); }
  vec3 nor(vec3 p){ vec2 e = vec2(.001,0.); return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x, map(p+e.yxy).x-map(p-e.yxy).x, map(p+e.yyx).x-map(p-e.yyx).x)); }
  float shadow(vec3 ro, vec3 rd){ float res = 1., t = .02; for(int i=0;i<48;i++){ float h = map(ro+rd*t).x; res = min(res, 18.*h/t); t += clamp(h,.02,.3); if(res<.001||t>12.) break; } return clamp(res,0.,1.); }
  vec3 pal(float i){ float s = i/15.; return mix(mix(vec3(1.,.72,.58), vec3(.86,.68,1.), smoothstep(0.,.55,s)), vec3(.55,.92,.84), smoothstep(.5,1.,s)); }
  void main(){ vec2 p = (uv*R - .5*R)/R.y; p.x -= .33; float push = T*.06; vec3 ro = vec3(-2.6 + push, .4 + push*.4, -4.2 + push), ta = vec3(3.6, 3.0, 1.2); vec3 f = normalize(ta-ro), r = normalize(cross(f, vec3(0.,1.,0.))), u = cross(r,f);
    p = rot(-.05)*p; vec3 rd = normalize(p.x*r + p.y*u + 1.0*f); float t = 0.; vec2 h; for(int i=0;i<140;i++){ h = map(ro+rd*t); if(h.x<.0006||t>30.) break; t += h.x; }
    vec3 L = normalize(vec3(-.55*cos(LA) + .45*sin(LA), .85, .45*cos(LA) + .55*sin(LA))); vec3 col;
    vec3 sky = mix(vec3(1.,.86,.8), vec3(.78,.8,1.), uv.y*.8+uv.x*.3);
    if(t>30.) col = sky; else { vec3 pos = ro+rd*t, n = nor(pos); float sh = shadow(pos+n*.003, L); float dif = clamp(dot(n,L),0.,1.); float wrap = clamp(dot(n,L)*.5+.5,0.,1.);
      vec3 alb = h.y >= 0. ? pal(h.y) : vec3(.96,.92,.88); float ao = clamp(map(pos+n*.08).x/.08,0.,1.)*.5+.5;
      vec3 sss = h.y >= 0. ? alb*alb*.45*(1.-dif) : vec3(0.); col = alb*(dif*sh*1.05 + .32*wrap*ao) + sss + vec3(.12,.1,.14)*ao;
      float sp = pow(clamp(dot(reflect(rd,n),L),0.,1.),60.)*sh; col += sp*.5; col = mix(col, sky, 1.-exp(-t*.025)); }
    col = pow(col, vec3(.95)); o = vec4(col,1.); }`;
  let Pg;
  SCENES.push({ key: 'STAIR', no: 4, cn: '亚克力阶梯', en: 'Frosted ascent', tagline: 'RAY-MARCHED ACRYLIC', side: 'L', theme: 'light', accent: '120,80,190', hudline: 'STEPS 16   RISE 0.34   RUN 0.62',
    desc: '十六级磨砂亚克力台阶从地面依次弹起，斜着升向右上方，阳光转动时长影一起扫过。', tags: ['台阶从地面一级级弹出', '颜色从蜜桃过渡到紫和薄荷', '阳光转动，投影随之扫过'], pal: ['#FFB894', '#DBADFF', '#8CEBD6', '#F7EEF0'],
    render(lt) { if (!Pg) Pg = prog(QVS, FS); glClear(); drawQuad(Pg, { R: [W, H], T: lt, LA: -0.5 + easeIO((lt - 3) / 4.6) * 1.4 }); X.drawImage(glc, 0, 0); grain(X, .05, 'multiply'); } });
})();

// ---- 05 欧普艺术 ----
(() => {
  const FS = COMMON + `
  in vec2 uv; out vec4 o; uniform float BG, RD, SH;
  void main(){ vec2 c = vec2(.7 + .04*sin(T*.5), .5); vec2 p = (uv*R - c*R)/R.y; float r = length(p); float bulge = BG*.4*exp(-r*r*6.)*(1.+.08*sin(T*1.3));
    vec2 p2 = (uv*R - vec2(.95,.18)*R)/R.y; float b2 = -.2*BG*exp(-dot(p2,p2)*12.);
    float field = p.y*62. + bulge*85.*cos(atan(p.y,p.x)) + b2*80. + sin(p.x*3.+T*.6)*3.*SH;
    float s = sin(field + T*2.4); float w = fwidth(field); float line = smoothstep(-w*1.2, w*1.2, s);
    vec3 col = mix(vec3(.04), vec3(.95,.94,.92), line);
    vec2 pd = p - vec2(mix(.9,0.,RD), 0.); float rd = length(pd); float mask = smoothstep(.315,.31, rd)*step(.01,RD);
    float f2 = pd.x*72. - bulge*90.; float s2 = smoothstep(-fwidth(f2), fwidth(f2), sin(f2 - T*2.4)); vec3 c2 = mix(vec3(.9,.12,.08), vec3(.95,.94,.92), s2);
    col = mix(col, c2, mask); o = vec4(col,1.); }`;
  let Pg;
  SCENES.push({ key: 'OPT', no: 5, cn: '欧普艺术', en: 'Optical motion', tagline: 'OP ART', side: 'L', theme: 'light', accent: '228,30,20', hudline: '62 LINES / UNIT   BULGE 0.40   PHASE 2.4 Hz',
    desc: '黑白条纹被一个看不见的球体顶起，红色圆盘里的条纹方向相反，越看越像在动。', tags: ['条纹从平直慢慢鼓起', '红色圆盘从右侧滑入', '条纹不停流动，制造错视'], pal: ['#0A0A0A', '#F2F0EB', '#E61F14'],
    render(lt) { if (!Pg) Pg = prog(QVS, FS); glClear(); drawQuad(Pg, { R: [W, H], T: lt, BG: easeIO((lt - .3) / 2.2), RD: easeO((lt - 2.2) / 1.6), SH: easeIO((lt - 4) / 2) });
      X.drawImage(glc, 0, 0); const pw = 760 * easeO((lt) / .6); X.fillStyle = '#F2F0EB'; X.fillRect(0, 0, pw, H); X.fillStyle = '#0A0A0A'; X.fillRect(pw - 3, 0, 3, H); grain(X, .05, 'multiply'); } });
})();

// ---- 06 D 虹彩亮片 ----
(() => {
  const VS = `#version 300 es
  in float id; uniform vec2 R; uniform float T, FR; out vec3 vN; out float vA; out float vF; out vec3 vV; ${PCG}
  float wave(vec2 q){ return .22*sin(q.x*1.6+T*1.4)*cos(q.y*1.1-T*.9) + .12*sin(q.x*3.1-q.y*2.3+T*2.) + .06*sin(q.y*5.+q.x*.7); }
  void main(){ float NX = 340.; float ix = mod(id, NX), iy = floor(id/NX); vec2 q = vec2(ix/NX*15.-6., iy/240.*10.-5.); q.x += mod(iy,2.)*.022;
    float y = wave(q); vec2 e = vec2(.02,0.); vec3 n = normalize(vec3(-(wave(q+e.xy)-wave(q-e.xy))/.04, 1., -(wave(q+e.yx)-wave(q-e.yx))/.04));
    n.x += (h(id)-.5)*.35; n.z += (h(id+3.)-.5)*.35;
    float front = mix(-8.,9.,FR) - q.y*.3; float flip = smoothstep(front-.8, front+.8, q.x); float ang = flip*3.14159; n.yz = mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*n.yz; n.y = abs(n.y); n = normalize(n);
    float lift = sin(flip*3.14159)*.08;
    vec3 p = vec3(q.x*.62, y*.8 + lift, -q.y*.62+.6); p.yz = mat2(cos(.95),-sin(.95),sin(.95),cos(.95))*p.yz;
    float z = -p.z + 3.0; vec2 s = p.xy/z*2.3; s.x *= R.y/R.x; s.x += .18; s.y -= .12; gl_Position = vec4(s, 1.-1./z, 1.);
    gl_PointSize = (30./z)*R.y/720.; vN = n; vV = normalize(vec3(-s.x*.6, .9, .5)); vA = 1.; vF = h(id+9.) + flip*.35; }`;
  const FS = `#version 300 es
  precision highp float; in vec3 vN; in float vA; in float vF; in vec3 vV; out vec4 o;
  vec3 pal(float t){ return .5+.5*cos(6.28318*(t+vec3(.0,.33,.67))); }
  void main(){ vec2 d = gl_PointCoord-.5; float r = length(d); if(r>.5) discard; float edge = smoothstep(.5,.42,r);
    vec3 L = normalize(vec3(-.4,.8,.5)); vec3 Hh = normalize(L+vV); float spec = pow(max(dot(vN,Hh),0.),60.);
    float th = dot(vN, vV); vec3 film = pal(th*1.8+.15+vF*.1); vec3 base = mix(vec3(.72,.93,.86), vec3(.78,.74,.95), smoothstep(.2,.9,th));
    vec3 c = mix(base, film*.6+.4, .3) * (.62+.38*max(dot(vN,L),0.)) + spec*vec3(.55);
    float hole = smoothstep(.07,.1,length(d-vec2(0.,-.3))); o = vec4(c*edge*hole, edge*hole)*vA; }`;
  let Pg;
  SCENES.push({ key: 'D', no: 6, cn: '虹彩亮片', en: 'Sequin weather', tagline: 'IRIDESCENT SEQUINS', side: 'L', theme: 'light', accent: '70,120,130', panelY: 250, hudline: 'SEQUINS 81,600   FILM 280 NM',
    desc: '八万片亮片铺成起伏的丝面，一阵风从左扫到右，亮片逐片翻面，颜色从薄荷翻成淡紫。', tags: ['亮片面像呼吸一样起伏', '风从左到右扫过，逐片翻面', '翻过的地方换一种虹彩'], pal: ['#ECF6F2', '#B9D3CF', '#C9BCE8', '#F3D9E4', '#5E7B86'],
    render(lt) { if (!Pg) Pg = prog(VS, FS); glClear(0, 0, 0, 0); drawPoints(Pg, 340 * 240, { R: [W, H], T: lt, FR: easeIO((lt - 1.2) / 5) }, false);
      const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E8F3EF'); g.addColorStop(.5, '#CFE6DE'); g.addColorStop(1, '#B9D3CF'); X.fillStyle = g; X.fillRect(0, 0, W, H); X.drawImage(glc, 0, 0);
      const fg = X.createLinearGradient(0, 0, 1000, 0); fg.addColorStop(0, 'rgba(236,246,242,.82)'); fg.addColorStop(.7, 'rgba(236,246,242,.5)'); fg.addColorStop(1, 'rgba(236,246,242,0)'); X.fillStyle = fg; X.fillRect(0, 0, 1000, H); grain(X, .04, 'soft-light'); } });
})();

// ---- 07 绯红切面 Crimson Cut ----
(() => {
  const SPR = {}; function sprite(key, size, draw) { if (!SPR[key]) { const cv = document.createElement('canvas'); cv.width = cv.height = size; draw(cv.getContext('2d')); SPR[key] = cv; } return SPR[key]; }
  const R0 = 230;
  function skin(g, c, r) { // full tomato, lit from back-left rim + soft key from top-right
    const b = g.createRadialGradient(c + r * .32, c - r * .36, r * .05, c, c, r); b.addColorStop(0, '#FF7A5C'); b.addColorStop(.35, '#D9261A'); b.addColorStop(.8, '#7C0A07'); b.addColorStop(1, '#3A0303'); g.fillStyle = b; g.beginPath(); g.arc(c, c, r, 0, 7); g.fill();
    const rim = g.createRadialGradient(c, c, r * .82, c, c, r); rim.addColorStop(0, 'rgba(255,150,110,0)'); rim.addColorStop(1, 'rgba(255,170,130,.75)'); g.save(); g.beginPath(); g.arc(c, c, r, 0, 7); g.clip(); const mk = g.createLinearGradient(c - r, c + r, c + r, c - r); g.fillStyle = rim; g.globalCompositeOperation = 'lighter'; g.beginPath(); g.arc(c - r * .06, c + r * .06, r, 0, 7); g.arc(c + r * .1, c - r * .1, r * .98, 0, 7, true); g.fill(); g.restore();
    for (let k = 0; k < 5; k++) { g.strokeStyle = `rgba(60,0,0,${.12})`; g.lineWidth = r * .05; g.beginPath(); g.ellipse(c, c, r * (.25 + k * .15), r * .98, 0, -1.2, 1.2); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.ellipse(c + r * .38, c - r * .42, r * .16, r * .06, -.75, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(c + r * .2, c - r * .62, r * .05, r * .02, -.5, 0, 7); g.fill();
    g.save(); g.translate(c - r * .05, c - r * .93); for (let k = 0; k < 6; k++) { g.rotate(Math.PI / 3 + .1); const sg = g.createLinearGradient(0, 0, 0, -r * .3); sg.addColorStop(0, '#1F4A14'); sg.addColorStop(1, '#4E8A2C'); g.fillStyle = sg; g.beginPath(); g.ellipse(0, -r * .13, r * .04, r * .19, .2, 0, 7); g.fill(); } g.fillStyle = '#2C5A1A'; g.fillRect(-r * .03, -r * .3, r * .06, r * .22); g.restore(); }
  function face(g, c, r) { // cross-section
    const b = g.createRadialGradient(c, c, r * .1, c, c, r); b.addColorStop(0, '#FFE9DA'); b.addColorStop(.3, '#FF7B5E'); b.addColorStop(.86, '#D32A18'); b.addColorStop(.93, '#8E0E08'); b.addColorStop(1, '#5A0604'); g.fillStyle = b; g.beginPath(); g.arc(c, c, r, 0, 7); g.fill();
    for (let k = 0; k < 6; k++) { g.save(); g.translate(c, c); g.rotate(k * Math.PI / 3 + .3); const lg = g.createRadialGradient(0, -r * .5, 4, 0, -r * .5, r * .3); lg.addColorStop(0, 'rgba(255,236,200,.95)'); lg.addColorStop(.7, 'rgba(255,150,110,.75)'); lg.addColorStop(1, 'rgba(230,80,50,.0)'); g.fillStyle = lg; g.beginPath(); g.ellipse(0, -r * .5, r * .17, r * .3, 0, 0, 7); g.fill();
      for (let s2 = 0; s2 < 5; s2++) { g.fillStyle = 'rgba(250,230,160,.95)'; g.beginPath(); g.ellipse((s2 % 2 ? 1 : -1) * r * .055, -r * (.32 + s2 * .065), r * .022, r * .036, (s2 % 2 ? .4 : -.4), 0, 7); g.fill(); } g.restore(); }
    g.strokeStyle = 'rgba(255,220,200,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(c, c, r * .88, 0, 7); g.stroke();
    const gl2 = g.createLinearGradient(c - r, c - r, c + r, c + r); gl2.addColorStop(0, 'rgba(255,255,255,.35)'); gl2.addColorStop(.4, 'rgba(255,255,255,0)'); g.fillStyle = gl2; g.beginPath(); g.arc(c, c, r, 0, 7); g.fill(); }
  function drop(c, x, y, s, ang, str) { c.save(); c.translate(x, y); c.rotate(ang); c.scale(1 + str, 1); const g = c.createRadialGradient(-s * .3, -s * .35, 0, 0, 0, s); g.addColorStop(0, '#FFD6C4'); g.addColorStop(.25, '#F0402A'); g.addColorStop(.85, '#8E0F08'); g.addColorStop(1, '#4A0503'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, s, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(-s * .35, -s * .4, s * .22, s * .12, -.6, 0, 7); c.fill(); c.restore(); }
  SCENES.push({ key: 'TOM', no: 7, cn: '绯红切面', en: 'Crimson cut', tagline: 'BULLET-TIME FOOD FILM', side: 'L', theme: 'dark', accent: '255,150,120', hudline: '1000 FPS EQUIV.   SHUTTER 1/8000   RIM 5600 K',
    desc: '', tags: [], pal: ['#120607', '#7C0A07', '#D9261A', '#FF7A5C', '#FFE9DA'],
    render(lt) { const bg = X.createRadialGradient(1260, 470, 40, 1200, 560, 1250); bg.addColorStop(0, '#3A0D0E'); bg.addColorStop(.5, '#1A0607'); bg.addColorStop(1, '#070203'); X.fillStyle = bg; X.fillRect(0, 0, W, H);
      const back = X.createRadialGradient(1500, 260, 0, 1500, 260, 700); back.addColorStop(0, 'rgba(255,120,90,.22)'); back.addColorStop(1, 'rgba(255,120,90,0)'); X.fillStyle = back; X.fillRect(0, 0, W, H);
      const CUT = 1.15; const tt = lt < CUT ? 0 : (lt - CUT) * .22 + Math.max(0, lt - 7.1) ** 2 * 1.6; // slow motion after cut
      const cx = 1260, cy0 = 540; const fallY = lt < CUT ? -300 + (cy0 + 300) * easeIO(lt / CUT) : cy0; const cy = fallY;
      const ang = -.62, nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2), tx = Math.cos(ang), ty = Math.sin(ang); const sep = tt * 150 + (lt > CUT ? 20 : 0);
      // ribbon helix (back part)
      const rb = easeO((lt - CUT - .2) / 4.5); const ribbon = (front) => { const N = 140; for (let k = 0; k < N * rb; k++) { const s1 = k / N, s2 = (k + 1) / N; const th1 = s1 * 9 + lt * .25, th2 = s2 * 9 + lt * .25; if ((Math.sin(th1) > 0) !== front) continue; const p = (s, th) => [cx + Math.cos(th) * (R0 * 1.55 + s * 120) + (s - .5) * 380, cy - 360 + s * 720 + Math.sin(th) * 50]; const [x1, y1] = p(s1, th1), [x2, y2] = p(s2, th2); const w = (18 + 26 * Math.sin(s1 * 3.14)) * (front ? 1 : .8); const sh = .55 + .45 * Math.cos(th1 - 1);
          X.strokeStyle = rgb(lerpC([90, 6, 4], [235, 50, 30], sh)); X.lineWidth = w; X.lineCap = 'round'; X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke(); X.strokeStyle = `rgba(255,220,200,${.55 * sh * sh})`; X.lineWidth = w * .12; X.beginPath(); X.moveTo(x1 - w * .2, y1 - w * .25); X.lineTo(x2 - w * .2, y2 - w * .25); X.stroke(); } };
      ribbon(false);
      const SK = sprite('skin', R0 * 2 + 20, g => skin(g, R0 + 10, R0)), FC = sprite('face', R0 * 2 + 20, g => face(g, R0 + 10, R0 * .98));
      const halfDraw = (sgn) => { X.save(); const ox = nx * sep * sgn, oy = ny * sep * sgn; const rot = sgn * tt * .5; X.translate(cx + ox, cy + oy); X.rotate(rot);
        X.save(); X.beginPath(); X.rect(-2000 * tx - 2000 * nx * (sgn < 0 ? 1 : 0), -2000, 4000, 4000); X.restore();
        X.save(); X.beginPath(); const L2 = 2000; X.moveTo(-tx * L2, -ty * L2); X.lineTo(tx * L2, ty * L2); X.lineTo(tx * L2 + nx * L2 * sgn, ty * L2 + ny * L2 * sgn); X.lineTo(-tx * L2 + nx * L2 * sgn, -ty * L2 + ny * L2 * sgn); X.closePath(); X.clip();
        X.drawImage(SK, -R0 - 10, -R0 - 10); const open = clamp01(tt * 3); if (lt > CUT) { X.save(); X.translate(nx * -sgn * R0 * .02, 0); X.scale(1, 1); X.globalAlpha = open; X.save(); X.rotate(ang); X.scale(open * .55 + .02, 1); X.rotate(-ang); X.drawImage(FC, -R0 - 10, -R0 - 10); X.restore(); X.restore(); }
        X.restore(); X.restore(); };
      if (lt < CUT) { X.drawImage(SK, cx - R0 - 10, cy - R0 - 10); } else { halfDraw(-1); halfDraw(1); }
      // blade flash
      const fl = lt > CUT - .08 ? Math.exp(-(lt - CUT + .08) * 6) : 0; if (fl > .01) { X.save(); X.globalCompositeOperation = 'lighter'; const L3 = 1400 * clamp01((lt - CUT + .1) * 8); const g = X.createLinearGradient(cx - tx * L3, cy - ty * L3, cx + tx * L3, cy + ty * L3); g.addColorStop(0, 'rgba(255,240,230,0)'); g.addColorStop(.5, `rgba(255,250,245,${fl})`); g.addColorStop(1, 'rgba(255,240,230,0)'); X.strokeStyle = g; X.lineWidth = 3 + 10 * fl; X.beginPath(); X.moveTo(cx - tx * L3, cy - ty * L3); X.lineTo(cx + tx * L3, cy + ty * L3); X.stroke(); X.fillStyle = `rgba(255,230,220,${fl * .25})`; X.fillRect(0, 0, W, H); X.restore(); }
      // juice droplets + seeds frozen in air
      if (lt > CUT) { const r = rng(9); for (let k = 0; k < 120; k++) { const u = (r() - .5) * 2 * R0 * 1.05, sd = r() < .5 ? -1 : 1; const sp = 120 + r() * 520, along = (r() - .5) * 180; const x0 = cx + tx * u, y0 = cy + ty * u; const d = tt + .02;
          const x = x0 + nx * sd * sp * d + tx * along * d, y = y0 + ny * sd * sp * d + ty * along * d + 60 * d * d; const s2 = 3 + Math.pow(r(), 3) * 22; const seed = r() < .25;
          if (seed) { X.save(); X.translate(x, y); X.rotate(r() * 6 + tt * 2); X.fillStyle = 'rgba(250,232,170,.95)'; X.beginPath(); X.ellipse(0, 0, s2 * .35 + 2, s2 * .55 + 3, 0, 0, 7); X.fill(); X.restore(); }
          else drop(X, x, y, s2, Math.atan2(ny * sd, nx * sd), Math.min(.8, sp * .0012)); } }
      ribbon(true);
      const sg = X.createLinearGradient(0, 0, 900, 0); sg.addColorStop(0, 'rgba(10,3,4,.75)'); sg.addColorStop(1, 'rgba(10,3,4,0)'); X.fillStyle = sg; X.fillRect(0, 0, 900, H);
      grain(X, .06); } });
})();

})();
