(() => {
// ================= OPENERS =================
const PCG = `uint pcg(uint v){ uint s=v*747796405u+2891336453u; uint w=((s>>((s>>28u)+4u))^s)*277803737u; return (w>>22u)^w; }
  float h(float n){ return float(pcg(floatBitsToUint(n)+pcg(floatBitsToUint(n*.731))))/4294967295.; }`;
// ---- 01 A 点云雕塑 ----
(() => {
  const VS = `#version 300 es
  in float id; uniform vec2 R; uniform float T; out float vA; out float vRed; ${PCG}
  vec3 knot(float u){ float r = cos(3.*u)+2.2; return vec3(r*cos(2.*u), r*sin(2.*u), -sin(3.*u)*1.3)*.30; }
  float ease(float x){ x = clamp(x,0.,1.); return x<.5 ? 4.*x*x*x : 1.-pow(-2.*x+2.,3.)/2.; }
  void main(){
    float u = h(id*1.17)*6.2831853, v = h(id*2.31+7.)*6.2831853, r0 = h(id+77.);
    vec3 c = knot(u), c2 = knot(u+.002), tg = normalize(c2-c), nb = normalize(cross(tg, vec3(0.,0.,1.))), bn = cross(tg, nb);
    float tube = .13 + .05*sin(u*7.+T*1.5) + .03*sin(v*3.+u*20.);
    vec3 p = c + (nb*cos(v)+bn*sin(v))*tube; float shell = step(.84, h(id+40.)); p += (nb*cos(v)+bn*sin(v))*shell*(.06+.22*h(id+41.));
    float a = T*.32+.4, b = .55; p.xz = mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz; p.yz = mat2(cos(b),-sin(b),sin(b),cos(b))*p.yz;
    // inflow along a bezier from the near bottom-left corner
    float e = ease((T - .3 - r0*1.9)/1.7);
    vec3 P0 = vec3(.2,-1.05,-1.8) + (vec3(h(id+3.),h(id+5.),h(id+9.))-.5)*vec3(1.8,.4,.5), P1 = vec3(1.5,.7,-.7) + (vec3(h(id+13.),h(id+15.),h(id+19.))-.5)*.9;
    vec3 q = mix(mix(P0,P1,e), mix(P1,p,e), e); float vis = smoothstep(0.,.12,e);
    // scan plane
    float sy = mix(-1.,1.,clamp((T-4.)/1.4,0.,1.)); float scan = smoothstep(.012,.0,abs(q.y-sy))*step(4.,T)*step(T,5.4);
    // burst toward camera at the end
    float x = clamp((T-6.35)/1.6,0.,1.); vec3 dir = normalize(q + vec3(0.,0.,.0001)); q += dir*x*x*(1.2+3.*r0) + vec3(0.,0.,-x*x*3.2*(.3+r0));
    float z = q.z + 3.6; if(z < .15){ gl_Position = vec4(9.); return; }
    vec2 s = q.xy/z*2.3; s.x *= R.y/R.x; s.x += .42; gl_Position = vec4(s, 0., 1.);
    gl_PointSize = clamp(1.6*3.4/z, 1.2, 4.)*R.y/1080.;
    vA = (.22+.22*h(id+11.))*vis*(1.-shell*.5)*clamp(3.6/z,.3,1.6)*(1.+scan*6.); vRed = max(step(.9986, h(id+21.)), scan);
  }`;
  const FS = `#version 300 es
  precision highp float; in float vA; in float vRed; out vec4 o;
  void main(){ float r = length(gl_PointCoord-.5); float m = smoothstep(.5,.25,r); vec3 c = mix(vec3(.93,.95,1.), vec3(1.,.22,.2), vRed); o = vec4(c*m*vA*(1.+vRed*1.5), 0.); }`;
  const DUST = `#version 300 es
  in float id; uniform vec2 R; uniform float T; out float vA; out float vRed; ${PCG}
  void main(){ vec3 p = vec3(h(id)*2.-1., h(id+1.)*2.-1., h(id+2.)*2.-1.)*vec3(4.,2.4,2.); p.x += T*.05*(h(id+4.)-.3); float z = p.z+3.6; vec2 s = p.xy/z*2.6; s.x *= R.y/R.x; gl_Position = vec4(s,0.,1.);
    gl_PointSize = 1.5*R.y/1080.; vA = .35*h(id+5.); vRed = 0.; }`;
  let P, D;
  SCENES.push({ key: 'A', no: 1, cn: '点云雕塑', en: 'Point-cloud sculpture', tagline: 'POINT CLOUD', side: 'L', theme: 'dark', hudline: 'YAW 214.0°   PITCH 31.5°   700,000 PTS',
    desc: '七十万个点从画框外涌入，在右侧三分线上凝成一个扭结雕塑，最后朝镜头炸开。', tags: ['点流从画面下方沿曲线涌入', '红色扫描面扫过雕塑', '整体朝镜头爆散，转场'], pal: ['#040405', '#EEF1F7', '#8A8F99', '#FF3B33'],
    render(lt) { if (!P) { P = prog(VS, FS); D = prog(DUST, FS); } glClear(0, 0, 0, 1); drawPoints(D, 5000, { R: [W, H], T: lt }); drawPoints(P, 700000, { R: [W, H], T: lt });
      X.fillStyle = '#040405'; X.fillRect(0, 0, W, H); X.save(); X.globalCompositeOperation = 'lighter'; X.drawImage(glc, 0, 0); X.globalAlpha = .1; X.drawImage(glc, 3, 0); X.restore(); const sg = X.createLinearGradient(0, 0, 860, 0); sg.addColorStop(0, 'rgba(4,4,5,.75)'); sg.addColorStop(1, 'rgba(4,4,5,0)'); X.fillStyle = sg; X.fillRect(0, 0, 860, H);
      const ca = seg(lt, 3.2, 3.6) * (1 - seg(lt, 6.1, 6.4)); if (ca > 0) { X.save(); X.globalAlpha = ca; X.strokeStyle = 'rgba(242,239,232,.8)'; X.lineWidth = 1.2; X.beginPath(); X.arc(1560, 330, 4, 0, 7); X.stroke(); X.beginPath(); X.moveTo(1560, 330); X.lineTo(1630, 220); X.lineTo(1630 + 200 * ca, 220); X.stroke(); font(X, '500', 14, F.mono); X.fillStyle = 'rgba(242,239,232,.9)'; X.fillText('TORUS KNOT (2, 3)', 1636, 206); X.fillStyle = 'rgba(242,239,232,.5)'; X.fillText('n = 700,000', 1636, 188); X.restore(); }
      grain(X, .06); vignette(X, .5); } });
})();

// ---- 02 · 15 无限拱廊 ----
(() => {
  SCENES.push({ key: 'ARC', no: 2, cn: '无限拱廊', en: 'Infinite arcade', tagline: 'ONE-POINT PERSPECTIVE', side: 'L', theme: 'dark', accent: '255,255,255', hudline: 'VP (0.64, 0.50)   BAYS ∞   BARRAGÁN PALETTE',
    desc: '巴拉甘式的粉、橙、黄墙面一道道拱门向远处延伸，镜头不停穿门而过。', tags: ['拱墙由远及近依次落位', '镜头匀速穿过一道道拱门', '每过一道门，墙色换一次'], pal: ['#E8457B', '#F08A3E', '#F4C430', '#6A4CE0', '#7FB6E6'],
    render(lt) { const vx = W * .66, vy = H * .5, F0 = 1050; X.fillStyle = '#7FB6E6'; X.fillRect(0, 0, W, H);
      const cols = ['#E8457B', '#F08A3E', '#E8457B', '#F4C430', '#E8457B', '#6A4CE0', '#F08A3E', '#E8457B'];
      const proj = (x, y, z) => [vx + x * F0 / z, vy - y * F0 / z]; const dz = .9; const travel = Math.max(0, lt - 1.2) * .62 + Math.max(0, lt - 6.6) ** 2 * .8; const passed = Math.floor(travel / dz), off = travel - passed * dz;
      for (let i = 28; i >= 0; i--) { const z = .5 + i * dz - off; if (z < .22) continue; const kid = i + passed; const c = hex(cols[kid % cols.length]); const fog = clamp01((z - 1) / 24); const cc = lerpC(c, [127, 182, 230], fog * .7);
        const build = easeO((lt - (28 - i) * .03) / .5); if (build <= 0) continue; const dy = (1 - build) * 1.8;
        const [ax, ay] = proj(-.55, -1 + dy, z); const aw = 1.1 * F0 / z, ah = 2.1 * F0 / z;
        X.save(); X.globalAlpha = build; X.beginPath(); X.rect(-50, -50, W + 100, H + 100); X.moveTo(ax, ay); X.lineTo(ax, ay - ah + aw / 2); X.arc(ax + aw / 2, ay - ah + aw / 2, aw / 2, Math.PI, 0); X.lineTo(ax + aw, ay); X.closePath(); X.fillStyle = rgb(cc); X.fill('evenodd');
        const [, fy] = proj(0, -1, z + dz); const sx = ax, ex = ax + aw; X.fillStyle = 'rgba(30,10,40,.16)'; X.beginPath(); X.moveTo(sx, ay); X.lineTo(ex, ay); X.lineTo(vx + (.55 + .9) * F0 / (z + dz), fy); X.lineTo(vx + (-.55 + .9) * F0 / (z + dz), fy); X.closePath(); X.fill();
        X.fillStyle = 'rgba(255,255,255,.2)'; X.fillRect(ax + aw * .94, ay - ah + aw / 2, aw * .06, ah - aw / 2); X.restore(); }
      grain(X, .06, 'multiply'); } });
})();

// ---- 03 B 液态铬花艺 ----
(() => {
  const FS = COMMON + `
  in vec2 uv; out vec4 o; uniform float G, LS, BR;
  float smin(float a,float b,float k){ float h=clamp(.5+.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }
  float cap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
  vec3 path(float t){ return vec3(.32*sin(t*3.3+.4)-.12 + .06*sin(t*11.), -1.02+t*1.95, .2*sin(t*4.6)); }
  float map(vec3 p){
    float d = 1e5; vec3 prev = path(0.);
    for(int i=1;i<=9;i++){ float t=float(i)/9.; if(t > G + .111) break; float tt = min(t, G); vec3 q=path(tt); float r = mix(.17,.045,pow(t,.8)) + .035*sin(t*19.+1.) + .02*sin(t*41.); r *= smoothstep(-.02,.12, G - (t-.111)); d = smin(d, cap(p,prev,q,r), .11); prev=q; }
    d = smin(d, length((p-vec3(0.,-1.06,0.))*vec3(1.,3.2,1.))/3.2-.085*smoothstep(0.,.15,G+.05), .16);
    d += .012*sin(p.y*23.+p.x*9.+T*2.)*sin(p.z*17.);
    d = min(d, length(p-vec3(.78,.42+.04*sin(T*2.),.15))-.075*BR);
    d = min(d, length(p-vec3(-.62,.7,.25))-.04*BR); d = min(d, length(p-vec3(.55,-.45,.4))-.028*BR);
    return d; }
  vec3 nor(vec3 p){ vec2 e=vec2(.0015,0.); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx))); }
  float box(vec3 r, float az0, float el0, float w, float h){ float az=atan(r.x,-r.z), el=asin(clamp(r.y,-1.,1.)); return smoothstep(w, w*.75, abs(az-az0))*smoothstep(h, h*.8, abs(el-el0)); }
  vec3 env(vec3 r){
    vec3 c = mix(vec3(1.25,1.3,1.4), vec3(.1,.22,.72), smoothstep(-.02,.55,r.y));
    c = mix(vec3(.16,.17,.2), c, smoothstep(-.08,.0,r.y)); c += vec3(2.4)*smoothstep(.09,.0,abs(r.y-.02));
    c += vec3(7.)*box(r,-1.05+LS,.42,.32,.42) + vec3(5.,5.2,5.6)*box(r,1.75+LS,.15,.1,.7) + vec3(4.)*box(r,3.1,.4,.6,.25) + vec3(3.)*box(r,-2.4+LS*.5,.2,.08,.6);
    c += vec3(1.2,.5,.3)*box(r,.1,-.25,1.2,.06)*.6; return c; }
  void main(){
    vec2 p = (uv*R*2.-R)/R.y; vec2 pc = p - vec2(.62, 0.);
    vec3 bg = mix(vec3(.62,.70,.92), vec3(.09,.22,.70), smoothstep(-.35,1.,p.y)); bg = mix(bg, vec3(.04,.12,.45), smoothstep(.4,1.4,length(p-vec2(-1.4,1.))));
    vec3 ro = vec3(0.,.15,4.1), rd = normalize(vec3(pc,-2.55)); rd.yz = rot(.04)*rd.yz;
    float tt = (-1.1-ro.y)/rd.y; vec3 col = bg;
    if(tt>0.){ vec3 q = ro+rd*tt; float dd = length(q.xz); if(dd<2.4){ col = mix(vec3(.06,.065,.08), vec3(.11,.12,.15), smoothstep(2.4,0.,dd)*.4); col *= .75+.25*smoothstep(0.,.9,length(q.xz-vec2(.05,0.))); float rim = smoothstep(2.4,2.37,dd)-smoothstep(2.37,2.3,dd); col += vec3(.25,.3,.45)*rim*.6; } }
    float t = 0.; bool hit = false;
    for(int i=0;i<110;i++){ float d = map(ro+rd*t); if(d<.0008){ hit=true; break; } t += d*.9; if(t>9.) break; }
    if(hit){ vec3 q = ro+rd*t, n = nor(q), r = reflect(rd,n); float fr = .55+.45*pow(1.-max(0.,dot(n,-rd)),4.);
      vec3 c = env(r)*fr*vec3(.97,.98,1.)*1.15; float ao = clamp(map(q+n*.06)/.06,0.,1.); c *= .6+.4*ao; col = c; }
    col = col/(1.+col*.35); col = pow(col, vec3(.92)); o = vec4(col,1.); }`;
  let Pg;
  function sprig(c, x0, y0, ang, len, r, g) { const L = len * g; const x1 = x0 + Math.cos(ang) * L, y1 = y0 + Math.sin(ang) * L; c.strokeStyle = 'rgba(120,140,70,.8)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + (r() - .5) * 40, (y0 + y1) / 2, x1, y1); c.stroke();
    const kind = r(), cr = r(); const bloom = clamp01((g - .65) / .35);
    if (bloom > 0) { if (kind < .55) { c.save(); c.translate(x1, y1); c.rotate(ang + Math.PI / 2); c.scale(bloom, bloom); const gg = c.createLinearGradient(0, -18, 0, 18); gg.addColorStop(0, '#7A1E22'); gg.addColorStop(1, '#3E0B10'); c.fillStyle = gg; c.beginPath(); c.ellipse(0, 0, 6.5, 18, 0, 0, 7); c.fill(); c.restore(); }
      else { c.fillStyle = cr < .5 ? '#D9465A' : '#E9707E'; c.beginPath(); c.arc(x1, y1, (6 + cr * 4) * bloom, 0, 7); c.fill(); } }
    for (let k = 0; k < 5; k++) { const s = r() * .9, ox = (r() - .5) * 40, oy = (r() - .5) * 40; if (bloom <= 0) continue; c.fillStyle = 'rgba(120,30,40,.85)'; c.beginPath(); c.arc(x0 + (x1 - x0) * s + ox * g, y0 + (y1 - y0) * s + oy * g, 2 * bloom, 0, 7); c.fill(); } }
  SCENES.push({ key: 'B', no: 3, cn: '液态铬花艺', en: 'Liquid chrome, cut flowers', tagline: 'RAYMARCHED CHROME', side: 'L', theme: 'dark', accent: '255,150,165', hudline: 'IOR ∞   ENV 4 SOFTBOXES   STEPS 110',
    desc: '一股液态铬从桌面升起，拧成花器，枝头一拍炸开地榆和红果，灯光从铬面扫过。', tags: ['液态铬从桌面升起、扭转成形', '枝头一拍炸开放射状花材', '一道柔光扫过铬面'], pal: ['#1A3FA8', '#A9B9E4', '#C9CDD6', '#7A1E22', '#E9707E'],
    render(lt) { if (!Pg) Pg = prog(QVS, FS); const G = easeIO((lt - .2) / 2.6); const LS = -1.2 + easeIO((lt - 4.6) / 2.4) * 2.2; const BR = easeO((lt - 3.4) / .8);
      glClear(); drawQuad(Pg, { R: [W, H], T: lt, G, LS, BR }); X.drawImage(glc, 0, 0);
      const cx = 1181 + 30, cy = 300; const sp = easeO((lt - 2.9) / 1.3); if (sp > 0) { const r = rng(3); for (let i = 0; i < 80; i++) { const a = -Math.PI / 2 + (r() - .5) * 3.4, L = 130 + r() * 300; const g = clamp01(sp * 1.25 - r() * .25); sprig(X, cx + (r() - .5) * 40, cy + (r() - .5) * 30, a, L, r, g); }
        const r2 = rng(8); for (let k = 0; k < 1100; k++) { const a = r2() * 7, d = Math.pow(r2(), .6) * 340 * sp; const al = clamp01(sp * 2 - r2()); X.fillStyle = r2() < .5 ? `rgba(150,40,50,${.8 * al})` : `rgba(245,225,230,${.85 * al})`; X.beginPath(); X.arc(cx + Math.cos(a) * d * 1.2, cy + Math.sin(a) * d * .8 - 40 * sp, 1.3 + r2() * 1.8, 0, 7); X.fill(); } }
      const sh = X.createLinearGradient(0, 0, 900, 0); sh.addColorStop(0, 'rgba(6,16,60,.55)'); sh.addColorStop(1, 'rgba(6,16,60,0)'); X.fillStyle = sh; X.fillRect(0, 0, 900, H);
      grain(X, .05); } });
})();

})();
