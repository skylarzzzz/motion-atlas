(() => {
// ================= 08–11 =================
function legacy2D(dx, dy, fn) { const w = W, h = H; W = 1280; H = 720; X.save(); X.setTransform(1.5, 0, 0, 1.5, 0, 0); X.translate(dx, dy); try { fn(); } finally { X.restore(); W = w; H = h; } }
// ---- 08 引力网格 ----
(() => {
  SCENES.push({ key: 'MASS', no: 8, cn: '引力网格', en: 'Mass & spacetime', tagline: 'GRAVITY WELL', side: 'L', theme: 'dark', accent: '216,255,46', hudline: 'M = 1.00   GRID 0.26   ORBIT r 2.90',
    desc: '一颗球体落进克莱因蓝的网格，把时空压出深坑，涟漪向外扩散，荧光绿卫星开始绕行。', tags: ['球体从上方落下，网格被压弯', '落地瞬间涟漪一圈圈扩散', '卫星沿虚线轨道绕行'], pal: ['#0F1FD6', '#EBEEFF', '#FFFFFF', '#D8FF2E'],
    render(lt) { X.fillStyle = '#0F1FD6'; X.fillRect(0, 0, W, H); const cam = lt * .05; const P = cam3([-6.4 + cam, 2.3, 7.2 - cam], [1.0, -1.9, -.2], 56, -.06, [250, 60]);
      const drop = lt < 1.6 ? easeIO(lt / 1.6) : 1; const land = lt - 1.6; const bounce = land > 0 ? Math.abs(Math.sin(land * 7)) * .35 * Math.exp(-land * 3) : 0; const depth = drop;
      const CR = 1.05, C = [0, 3.2 - (3.2 + 1.9) * drop + bounce, 0]; const cs = P(C);
      const well = (x, z) => { const r2 = x * x + z * z, r = Math.sqrt(r2); let y = -3.4 * depth / (1 + r2 * .32) - .25 * Math.exp(-((x - 4) ** 2 + (z + 3) ** 2) * .6); if (land > 0) y += .32 * Math.sin(r * 2.2 - land * 6) * Math.exp(-r * .18) * Math.exp(-land * .45) * sstep(0, 1, land * 3 - r * .25); return y - CR * .1; };
      const segs = []; for (let k = 0; k < 2; k++) for (let a = -16; a <= 16; a += .26) { let prev = null; for (let b = -16; b <= 16; b += .1) { const x = k ? a : b, z = k ? b : a; const p = [x, well(x, z), z]; if (prev) segs.push([prev, p]); prev = p; } }
      const drawSegs = front => { X.save(); X.lineWidth = 1.1; X.beginPath(); for (const [p, q] of segs) { const a = P(p), b = P(q); if (a[2] < .2 || a[2] > 30) continue; if ((a[2] < cs[2]) !== front) continue; X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); } X.strokeStyle = 'rgba(235,238,255,.55)'; X.stroke(); X.restore(); };
      drawSegs(false);
      const og = easeO((lt - 2.4) / 1.2); if (og > 0) { const orb = []; for (let i = 0; i <= 200 * og; i++) { const a = i / 200 * 6.2832 + 2.2; orb.push([Math.cos(a) * 2.9, -1.45 + Math.sin(a) * .9, Math.sin(a) * 2.9]); } X.strokeStyle = 'rgba(255,255,255,.9)'; X.lineWidth = 1.6; X.setLineDash([3, 7]); line3(X, P, orb); X.setLineDash([]); }
      const rr = CR * P.k / cs[2]; const g = X.createRadialGradient(cs[0] - rr * .4, cs[1] - rr * .45, rr * .1, cs[0], cs[1], rr); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.6, '#E4E6F2'); g.addColorStop(1, '#9BA2D8'); X.fillStyle = g; X.beginPath(); X.arc(cs[0], cs[1], rr, 0, 7); X.fill();
      drawSegs(true);
      if (og > 0) { const ma = 2.2 + 6.2832 * og + (lt - 3.6 > 0 ? (lt - 3.6) * .9 : 0); const mp = P([Math.cos(ma) * 2.9, -1.45 + Math.sin(ma) * .9, Math.sin(ma) * 2.9]); X.fillStyle = '#D8FF2E'; X.beginPath(); X.arc(mp[0], mp[1], 20 * 6 / mp[2], 0, 7); X.fill();
        const ca = seg(lt, 4, 4.4) * (1 - seg(lt, 7.3, 7.6)); if (ca > 0) { X.save(); X.globalAlpha = ca; X.strokeStyle = 'rgba(255,255,255,.85)'; X.lineWidth = 1.3; X.beginPath(); X.moveTo(mp[0], mp[1]); X.lineTo(mp[0] + 80, mp[1] - 120); X.lineTo(mp[0] + 80 + 200 * ca, mp[1] - 120); X.stroke(); font(X, '500', 15, F.mono); X.fillStyle = '#fff'; X.fillText('SATELLITE', mp[0] + 86, mp[1] - 132); X.fillStyle = 'rgba(255,255,255,.6)'; X.fillText('v = 7.62 KM/S', mp[0] + 86, mp[1] - 154); X.restore(); } }
      grain(X, .05); } });
})();

// ---- 09 枯山水 ----
(() => {
  const FS = COMMON + `
  in vec2 uv; out vec4 o; uniform float RK, SA;
  const vec3 S0 = vec3(1.6, 4.6, .55), S1 = vec3(-.9, 7.2, .38), S2 = vec3(2.9, 9.4, .3);
  float stoneD(vec2 p, vec3 s){ float a = atan(p.y-s.y, p.x-s.x); return length(p-s.xy) - s.z*(1.+.12*sin(a*3.+s.x)+.06*sin(a*7.)); }
  float field(vec2 p){ float d = min(stoneD(p,S0), min(stoneD(p,S1), stoneD(p,S2))); float f = p.y*1. + p.x*.18; return mix(d, f, smoothstep(.6, 1.6, d)); }
  void main(){ vec2 sc = (uv*R - .5*R)/R.y; vec3 ro = vec3(0., 3.4, T*.04); vec3 rd = normalize(vec3(sc.x-.22, sc.y-.62, 1.)); rd.xy = rot(-.1)*rd.xy;
    float tt = -ro.y/rd.y; vec2 p = ro.xz + rd.xz*tt; vec3 col;
    float sd = min(stoneD(p,S0), min(stoneD(p,S1), stoneD(p,S2)));
    float rakeZ = mix(1.5, 16., RK); float raked = smoothstep(rakeZ, rakeZ-.25, p.y + p.x*.25);
    float f = field(p)*13.; float e = .01; float gx = (field(p+vec2(e,0.))-field(p-vec2(e,0.)))*13./(2.*e), gy = (field(p+vec2(0.,e))-field(p-vec2(0.,e)))*13./(2.*e);
    float slope = cos(f*3.14159); vec2 g = normalize(vec2(gx,gy)+1e-5); float lit = slope*dot(g, normalize(vec2(-.7,.5)))*raked;
    float ridge = smoothstep(.25,.0,abs(p.y + p.x*.25 - rakeZ))*step(.001,RK)*step(RK,.999);
    vec3 sand = vec3(.86,.82,.74); col = sand*(.86 + .14*lit) - .03*fbm(vec3(p*40.,0.)) + ridge*.06;
    vec2 L = normalize(vec2(-.8 + SA, -.6)); float shd = 1.; for(int i=0;i<3;i++){ vec3 s = i==0?S0:(i==1?S1:S2); vec2 q = p - s.xy; float along = dot(q, -L); vec2 perp = q + L*along; if(along>0.) shd *= mix(1., .62, smoothstep(.04,-.04, length(perp)/(s.z*1.1) - 1. + along*.12)*smoothstep(3.2,0.,along)); }
    col *= shd;
    if(sd < 0.){ vec3 n = normalize(vec3(-(fbm(vec3(p*6.,1.))-.5)*1.6 + (sd*-2.), 1., (fbm(vec3(p*6.,2.))-.5)*1.6)); float l = clamp(dot(n, normalize(vec3(-.7,.8,.5))),0.,1.); col = mix(vec3(.08,.08,.08), vec3(.45,.43,.4), l)*(.8+.4*fbm(vec3(p*12.,3.))); col *= smoothstep(-.0,-.06,sd)*.4+.6; }
    col = mix(col, vec3(.82,.78,.72), 1.-exp(-tt*.03)); o = vec4(col,1.); }`;
  let Pg;
  SCENES.push({ key: 'ZEN', no: 9, cn: '枯山水', en: 'Raked stillness', tagline: 'DRY LANDSCAPE', side: 'L', theme: 'light', accent: '150,70,40', hudline: 'RAKE 13 / M   STONES 3   SUN 37° W',
    desc: '一道耙痕从近处推向远方，白砂随之起纹，遇到石头自动绕成同心圆，斜阳把影子拉长。', tags: ['耙痕从近到远一道道推开', '遇到石头时绕成同心圆', '太阳缓缓转动，影子跟着移动'], pal: ['#DBD1BD', '#C8BFAE', '#46433E', '#1E1A16'],
    render(lt) { if (!Pg) Pg = prog(QVS, FS); glClear(); drawQuad(Pg, { R: [W, H], T: lt, RK: easeIO((lt - .3) / 4.8), SA: easeIO((lt - 3) / 5) * .5 }); X.drawImage(glc, 0, 0);
      const sg = X.createLinearGradient(0, 0, 900, 0); sg.addColorStop(0, 'rgba(226,219,204,.7)'); sg.addColorStop(1, 'rgba(226,219,204,0)'); X.fillStyle = sg; X.fillRect(0, 0, 900, H); grain(X, .07, 'multiply'); } });
})();

// ---- 10 J 解构高定 ----
(() => {
  function paperTex(r) { const c = document.createElement('canvas'); c.width = 900; c.height = 1050; const g = c.getContext('2d'); g.scale(1.5, 1.5); g.fillStyle = '#EAE4D3'; g.fillRect(0, 0, 600, 700);
    const heads = ['TAX', 'MARKET', 'OPINION', 'THE WEEK', 'MODE']; for (let blk = 0; blk < 9; blk++) { const x = (blk % 3) * 200 + 8, y = Math.floor(blk / 3) * 233 + 8; g.fillStyle = '#151515'; font(g, '900', 22 + r() * 16, F.inter); g.fillText(heads[blk % 5], x, y + 30);
      for (let yy = y + 44; yy < y + 225; yy += 6) for (let col = 0; col < 3; col++) { g.fillStyle = `rgba(25,25,25,${.3 + r() * .35})`; g.fillRect(x + col * 62, yy, 56 - (r() < .1 ? 25 : 0), 2.4); } }
    return c; }
  let PT;
  SCENES.push({ key: 'J', no: 10, cn: '解构高定', en: 'Couture, torn apart', tagline: 'STOP-MOTION COLLAGE', side: 'L', theme: 'dark', accent: '242,214,75', hudline: '12 FPS STOP-MOTION   LAYERS 9',
    desc: '报纸、保鲜膜、量尺、欧根纱，每一拍「啪」地贴上一层，拼成一件礼服。', tags: ['定格动画式的抖动，12 帧每秒', '每一拍贴上一层材料', '最后纱摆飘起来'], pal: ['#0E0D10', '#EAE4D3', '#C9DB8F', '#B9A6E6', '#E9A8C8', '#F2D64B'],
    render(lt) { if (!PT) PT = paperTex(rng(2)); const tq = Math.floor(lt * 12) / 12; const jr = rng(Math.floor(lt * 12) + 1); const jx = (jr() - .5) * 2.4, jy = (jr() - .5) * 2.4;
      const bg = X.createRadialGradient(1300, 450, 80, 1200, 540, 1300); bg.addColorStop(0, '#1C1A20'); bg.addColorStop(1, '#060608'); X.fillStyle = bg; X.fillRect(0, 0, W, H);
      const on = (t0) => tq >= t0; const slam = (t0) => { const x = (tq - t0) * 12; return x < 0 ? 0 : x < 1 ? 1.25 : x < 2 ? .96 : 1; };
      legacy2D(340 + jx, jy, () => { const r = rng(6);
        for (let y = 560; y < H; y += 22) { X.fillStyle = `rgba(255,255,255,${.03 + (y - 560) / 6000})`; X.fillRect(-300, y, W + 300, 1); }
        if (on(.9)) { const s = slam(.9); X.save(); X.translate(470, 190); X.rotate(-.55 + (tq > 5 ? Math.sin(tq * 2) * .04 : 0)); X.scale(s, s); const lg = X.createLinearGradient(-200, 0, 200, 0); lg.addColorStop(0, 'rgba(150,60,100,.85)'); lg.addColorStop(1, 'rgba(235,150,180,.55)'); X.fillStyle = lg; X.beginPath(); X.moveTo(-210, 0); X.bezierCurveTo(-120, -110, 120, -100, 210, 0); X.bezierCurveTo(120, 90, -120, 100, -210, 0); X.fill(); X.strokeStyle = 'rgba(255,225,205,.9)'; X.lineWidth = 2.5; X.stroke();
          X.strokeStyle = 'rgba(255,230,240,.35)'; X.lineWidth = 1; X.beginPath(); X.moveTo(-200, 0); X.lineTo(200, 0); X.stroke(); for (let k = -7; k <= 7; k++) { X.beginPath(); X.moveTo(k * 26, 0); X.quadraticCurveTo(k * 26 + 30, k % 2 ? -40 : 40, k * 26 + 60, k % 2 ? -70 : 70); X.stroke(); } X.restore(); }
        const dress = new Path2D(); dress.moveTo(610, 120); dress.bezierCurveTo(570, 130, 540, 150, 545, 200); dress.lineTo(600, 330); dress.bezierCurveTo(520, 420, 430, 560, 380, 700); dress.lineTo(900, 700); dress.bezierCurveTo(850, 560, 760, 420, 690, 330); dress.lineTo(745, 200); dress.bezierCurveTo(750, 150, 720, 130, 680, 120); dress.closePath();
        if (on(.3)) { X.save(); X.clip(dress); X.save(); X.translate(640, 400); X.rotate(-.12); X.drawImage(PT, -300, -350, 600, 700); X.restore(); X.fillStyle = 'rgba(0,0,0,.18)'; X.fillRect(0, 0, 1280, 720);
          const tiers = [['#C9DB8F', '#B9A6E6'], ['#E9A8C8', '#C9DB8F'], ['#B9A6E6', '#F1C6D9'], ['#C9DB8F', '#E9A8C8']];
          tiers.forEach(([c1, c2], k) => { if (!on(1.5 + k * .45)) return; const sway = tq > 5 ? Math.sin(tq * 3 + k) * 6 : 0; const y0 = 400 + k * 78 + (slam(1.5 + k * .45) - 1) * 30; const g = X.createLinearGradient(380, 0, 900, 0); g.addColorStop(0, c1); g.addColorStop(1, c2); X.globalAlpha = .62; X.fillStyle = g; X.beginPath(); X.moveTo(300, 720); for (let x = 300; x <= 980; x += 6) X.lineTo(x, y0 + Math.sin(x * .045 + k * 2 + sway * .1) * 14 + Math.sin(x * .011 + k) * 10 + sway); X.lineTo(980, 720); X.closePath(); X.fill(); X.globalAlpha = 1;
            X.strokeStyle = 'rgba(250,250,225,.85)'; X.lineWidth = 1.5; X.beginPath(); for (let x = 300; x <= 980; x += 6) X.lineTo(x, y0 + Math.sin(x * .045 + k * 2 + sway * .1) * 14 + Math.sin(x * .011 + k) * 10 + sway); X.stroke(); });
          X.restore(); X.strokeStyle = 'rgba(255,255,255,.25)'; X.lineWidth = 1; X.stroke(dress); }
        if (on(3.4)) { X.save(); const film = new Path2D(); film.ellipse(640, 230, 210, 120, -.1, 0, 7); X.fillStyle = 'rgba(225,235,245,.14)'; X.fill(film); X.clip(film); X.strokeStyle = 'rgba(255,255,255,.7)';
          for (let k = 0; k < 60; k++) { X.lineWidth = .5 + r() * 1.6; X.beginPath(); let x = 430 + r() * 420, y = 110 + r() * 240; X.moveTo(x, y); for (let j = 0; j < 3; j++) { x += (r() - .5) * 70; y += (r() - .3) * 30; X.lineTo(x, y); } X.stroke(); } X.restore(); }
        if (on(3.9)) { const s = slam(3.9); X.save(); X.translate(560, 318); X.rotate(-.06); X.scale(s, s); X.fillStyle = '#F2D64B'; X.fillRect(0, 0, 220, 26); X.fillStyle = '#151515'; for (let k = 0; k < 44; k++) X.fillRect(k * 5, 0, 1, k % 10 === 0 ? 12 : 6); font(X, '700', 10, F.inter); for (let k = 0; k < 5; k++) X.fillText(String(60 + k), k * 50 + 2, 22); X.restore(); }
        if (on(4.4)) { const s = slam(4.4); X.save(); X.translate(650, 92); X.rotate(-.18); X.scale(s, s); const hg = X.createRadialGradient(-10, -6, 4, 0, 0, 70); hg.addColorStop(0, '#A86A3E'); hg.addColorStop(1, '#5E3418'); X.fillStyle = hg; X.beginPath(); X.ellipse(0, 0, 72, 26, 0, 0, 7); X.fill(); X.restore(); }
        if (on(4.9)) { const s = slam(4.9); X.save(); X.translate(700, 250); X.rotate(.12); X.scale(s * 1.1, s * 1.1); X.strokeStyle = '#E8312F'; X.lineWidth = 3; X.strokeRect(-46, -20, 92, 40); font(X, '900', 26, F.inter); X.fillStyle = '#E8312F'; X.textAlign = 'center'; X.fillText('TAX', 0, 10); X.restore(); X.textAlign = 'left'; }
      });
      grain(X, .08); } });
})();

// ---- 11 P 陶土雕塑（第一版） ----
(() => {
  const FS = COMMON + `
  in vec2 uv; out vec4 o; uniform float BA, BX, SB, LA;
  float sdBox(vec3 p, vec3 b){ vec3 q = abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
  float sdTorus(vec3 p, vec2 t){ vec2 q = vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
  float bnc(float x){ x = clamp(x,0.,1.); return 1. - abs(cos(x*7.85))*(1.-x)*(1.-x); }
  vec2 mapM(vec3 p){
    vec2 r = vec2(p.y+1., 0.);
    float s1 = length(p-vec3(mix(-3.6,-.75,BX),-.35,.1))-.65; if(s1<r.x) r = vec2(s1,1.);
    vec3 q = p-vec3(.55,-1.,-.2); q.xy = rot(1.5708)*q.xy; q = q.yxz; float arch = max(sdTorus(vec3(q.x,q.z,q.y), vec2(.62,.17*BA)), -p.y-1.); if(arch<r.x) r = vec2(arch,2.);
    for(int i=0;i<3;i++){ float fi = float(i); float fall = 1.-bnc((T - 1.6 - fi*.45)/.9); vec3 c = p-vec3(1.45,-.9+fi*.22 + fall*3.2,.55); c.xz = rot(fi*.4+T*.3)*c.xz; float d = sdBox(c, vec3(.32-fi*.06,.09,.32-fi*.06))-.03; if(d<r.x) r = vec2(d,3.+fi); }
    float s2 = length(p-vec3(mix(3.4,.2,SB),-.78,.85))-.22; if(s2<r.x) r = vec2(s2,6.);
    return r; }
  float map(vec3 p){ return mapM(p).x; }
  vec3 nor(vec3 p){ vec2 e=vec2(.001,0.); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx))); }
  float shadow(vec3 ro, vec3 rd){ float res=1., t=.02; for(int i=0;i<40;i++){ float h=map(ro+rd*t); res=min(res,10.*h/t); t+=clamp(h,.02,.2); if(res<.001||t>6.) break; } return clamp(res,0.,1.); }
  float ao(vec3 p, vec3 n){ float o2=0., s=1.; for(int i=1;i<5;i++){ float h=.05*float(i); o2+=(h-map(p+n*h))*s; s*=.7; } return clamp(1.-2.2*o2,0.,1.); }
  void main(){ vec2 p = (uv*R*2.-R)/R.y; p.x -= .66; vec3 ro = vec3(.25,1.25,4.3), rd = normalize(vec3(p,-2.5)); rd.yz = rot(.3)*rd.yz;
    float t=0.; vec2 m; for(int i=0;i<110;i++){ m = mapM(ro+rd*t); if(m.x<.0007) break; t+=m.x; if(t>20.) break; }
    vec3 bgc = vec3(.93,.86,.80); vec3 col = bgc;
    if(t<20.){ vec3 q=ro+rd*t, n=nor(q); vec3 L = normalize(vec3(-.55*cos(LA)+.6*sin(LA),.85,.45*cos(LA)+.3*sin(LA)));
      vec3 alb = m.y<.5 ? bgc : m.y<1.5 ? vec3(.72,.77,.66) : m.y<2.5 ? vec3(.86,.6,.52) : m.y<3.5 ? vec3(.97,.94,.89) : m.y<4.5 ? vec3(.93,.83,.74) : m.y<5.5 ? vec3(.97,.94,.89) : vec3(.36,.42,.62);
      float dif = max(dot(n,L),0.)*shadow(q+n*.002,L); float a = ao(q,n); float sky = .5+.5*n.y; float bounce = max(0.,-n.y)*.15;
      col = alb*(dif*vec3(1.05,.98,.9)*1.05 + sky*vec3(.5,.52,.58)*.55*a + bounce); col += pow(max(dot(reflect(rd,n),L),0.),24.)*.12*(m.y>.5?1.:0.);
      col = mix(col, bgc, 1.-exp(-.004*t*t)); }
    col = pow(col, vec3(.95)); o = vec4(col,1.); }`;
  let Pg;
  SCENES.push({ key: 'P', no: 11, cn: '陶土雕塑', en: 'Soft matter', tagline: 'CLAY & SOFT LIGHT', side: 'L', theme: 'light', accent: '170,90,70', hudline: 'KEY 42°   FILL 0.55   AO 5 TAPS',
    desc: '低饱和的陶土几何体在柔光里依次登场：球滚进来，圆拱升起，方块一块块落下叠成塔。', tags: ['大球从左侧滚入画面', '方块依次落下，带回弹叠成塔', '光线缓慢转动，阴影跟着移动'], pal: ['#EDDCCD', '#B8C4A8', '#D9A08C', '#F7F0E3', '#5C6A9E'],
    render(lt) { if (!Pg) Pg = prog(QVS, FS); glClear(); drawQuad(Pg, { R: [W, H], T: lt, BX: easeO((lt - .1) / 1.4), BA: easeO((lt - .8) / .8), SB: easeO((lt - 3.2) / 1.2), LA: easeIO((lt - 3.5) / 4.5) * 1.1 }); X.drawImage(glc, 0, 0); grain(X, .05, 'multiply'); } });
})();

})();
