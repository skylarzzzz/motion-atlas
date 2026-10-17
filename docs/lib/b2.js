// ===== BATCH 2 · soft-lit studio sculptures (ray-marched) =====
const SDF = `float sdBox(vec3 p, vec3 b){ vec3 q = abs(p)-b; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.); }
  float sdRBox(vec3 p, vec3 b, float r){ return sdBox(p,b-r)-r; }
  float sdTorus(vec3 p, vec2 t){ vec2 q = vec2(length(p.xz)-t.x,p.y); return length(q)-t.y; }
  float sdCap(vec3 p, vec3 a, vec3 b, float r){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h)-r; }
  float sdCyl(vec3 p, float h, float r){ vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h); return min(max(d.x,d.y),0.) + length(max(d,0.)); }
  float smin(float a, float b, float k){ float h = clamp(.5+.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }
  vec2 U(vec2 a, vec2 b){ return a.x < b.x ? a : b; }`;
function rmStyle(meta, o) {
  shaderStyle(meta, `in vec2 uv; out vec4 o; ${SDF} ${o.pre || ''}
  vec2 map(vec3 p){ ${o.map} }
  vec3 nor(vec3 p){ vec2 e = vec2(.0012,0.); return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x, map(p+e.yxy).x-map(p-e.yxy).x, map(p+e.yyx).x-map(p-e.yyx).x)); }
  float shadow(vec3 ro, vec3 rd){ float res = 1., t = .02; for(int i=0;i<40;i++){ float h = map(ro+rd*t).x; res = min(res, ${o.soft || '10.'}*h/t); t += clamp(h,.02,.3); if(res<.001||t>14.) break; } return clamp(res,0.,1.); }
  float ao(vec3 p, vec3 n){ float a = 0., s = 1.; for(int i=1;i<5;i++){ float hh = .06*float(i); a += (hh-map(p+n*hh).x)*s; s *= .7; } return clamp(1.-2.*a,0.,1.); }
  vec3 pal(float id, vec3 p){ ${o.pal} }
  vec3 bgc(vec2 uv){ ${o.bg} }
  void main(){ vec2 sp = (uv*R-.5*R)/R.y; vec3 ro = ${o.ro}, ta = ${o.ta}; vec3 f = normalize(ta-ro), r = normalize(cross(f, vec3(0.,1.,0.))), u = cross(r,f); vec3 rd = normalize((sp.x - ${o.sx || '.3'})*r + sp.y*u + ${o.fov || '1.6'}*f);
    float t = 0.; vec2 h = vec2(0.); for(int i=0;i<140;i++){ h = map(ro+rd*t); if(h.x<.0006||t>40.) break; t += h.x; }
    vec3 bg = bgc(uv); vec3 col = bg; vec3 L = normalize(${o.L || 'vec3(-.5,.8,.45)'});
    if(t<40.){ vec3 pos = ro+rd*t, n = nor(pos); vec3 alb = pal(h.y, pos); float sh = shadow(pos+n*.003, L); float dif = clamp(dot(n,L),0.,1.); float a = ao(pos,n); float sky = .5+.5*n.y;
      col = alb*(dif*sh*${o.key || '.95'}*vec3(1.04,.98,.92) + sky*a*${o.amb || '.32'}*vec3(.9,.92,1.)) + alb*alb*(1.-dif)*.18*a; col += pow(clamp(dot(reflect(rd,n),L),0.,1.), ${o.shin || '40.'})*${o.spec || '.25'}*sh;
      col = mix(col, bg, 1.-exp(-t*${o.fog || '.02'})); }
    col = clamp((col*(2.51*col+.03))/(col*(2.43*col+.59)+.14),0.,1.); o = vec4(pow(col, vec3(.92)),1.); }`, () => grain(X, .045, 'multiply'));
}
// 08 螺旋坡道
rmStyle({ key: 'SPIRAL', cn: '螺旋坡道', en: 'Spiral ramp', cat: 'space', desc: '俯视一条白色螺旋坡道，弧线一圈圈收向中心，阳光在每一层投下弯曲的影子。' }, {
  map: `vec2 r = vec2(p.y+.0, 0.); float a = atan(p.z,p.x); float rr = length(p.xz); for(int k=0;k<5;k++){ float lev = float(k); float y = (a/6.2832 + lev)*.55 - T*.06; float rad = 2.6 - lev*.42; float d = max(abs(rr-rad)-.22, abs(p.y - y - .3)-.04); d = max(d, -(p.y)); r = U(r, vec2(sdRBox(vec3(rr-rad, p.y-y-.3, 0.), vec3(.22,.05,10.), .02), 1.+lev)); float wall = max(abs(rr-rad-.22)-.025, abs(p.y-y-.38)-.12); r = U(r, vec2(wall, 1.+lev)); }
    r = U(r, vec2(sdCyl(p-vec3(0.,1.2,0.), 1.2, .38), 9.)); return r;`,
  pal: `if(id < .5) return vec3(.93,.9,.86); if(id > 8.5) return vec3(.86,.76,.68); return mix(vec3(.97,.95,.92), vec3(.98,.84,.76), id/6.);`,
  bg: `return mix(vec3(.95,.9,.85), vec3(.86,.84,.9), uv.y);`, ro: `vec3(1.2, 7.5, -3.8)`, ta: `vec3(.4, .6, .2)`, fov: '1.5', L: 'vec3(-.6,.9,.3)', soft: '14.', fog: '.008' });
// 09 胶囊漂浮
rmStyle({ key: 'PILLS', cn: '糖果胶囊', en: 'Floating capsules', cat: 'material', desc: '粉彩胶囊在空中缓缓翻转、沿对角线排成一条队列，影子投在地面上，像药妆广告的产品主视觉。' }, {
  map: `vec2 r = vec2(p.y+1.2, 0.); for(int k=0;k<9;k++){ float fk = float(k); vec3 c = vec3(-2.2 + fk*.62, -.2 + fk*.18 + .12*sin(T*1.2+fk), 1.4 - fk*.35); vec3 q = p - c; float a = T*.5 + fk*.9; q.xy = rot(a)*q.xy; q.yz = rot(a*.6+fk)*q.yz; r = U(r, vec2(sdCap(q, vec3(-.28,0.,0.), vec3(.28,0.,0.), .2), 1. + fk + step(0.,q.x)*.5)); } return r;`,
  pal: `if(id < .5) return vec3(.97,.88,.86); float k = floor(id); float half_ = fract(id); vec3 a = k < 3.5 ? vec3(1.,.62,.66) : k < 6.5 ? vec3(.62,.8,1.) : vec3(.98,.88,.5); return mix(a, vec3(.98,.97,.95), step(.25,half_));`,
  bg: `return mix(vec3(1.,.9,.88), vec3(.95,.86,.92), uv.y);`, ro: `vec3(0.6, .9, -5.)`, ta: `vec3(.2, .1, 0.)`, fov: '1.7', L: 'vec3(-.4,.9,-.5)', soft: '8.', fog: '.01', spec: '.6', shin: '60.' });
// 10 软结
rmStyle({ key: 'ROPE', cn: '珊瑚软结', en: 'Soft knot', cat: 'material', desc: '一根珊瑚色的粗绳打成三叶结，表面带细密的织纹，在柔光里慢慢转动。' }, {
  map: `vec2 r = vec2(p.y+1.35, 0.); vec3 q = p - vec3(.6,.05,0.); q.xz = rot(T*.3)*q.xz; q.yz = rot(.5)*q.yz; float md = 1e5; vec3 prev = vec3(0.);
    for(int i=0;i<=48;i++){ float u = float(i)/48.*6.2832; float rr = cos(3.*u)+2.; vec3 c = vec3(rr*cos(2.*u), rr*sin(2.*u), -sin(3.*u))*.36; if(i>0) md = min(md, sdCap(q, prev, c, .2)); prev = c; }
    md += .008*sin(atan(q.y,q.x)*40. + q.z*30.); r = U(r, vec2(md, 1.)); return r;`,
  pal: `if(id < .5) return vec3(.96,.82,.76); return vec3(1.,.42,.36);`,
  bg: `return mix(vec3(.98,.84,.78), vec3(.93,.78,.78), uv.y);`, ro: `vec3(-.4, .8, -4.6)`, ta: `vec3(.4, 0., 0.)`, fov: '1.6', L: 'vec3(-.6,.8,-.4)', soft: '10.', fog: '.01' });
// 11 积木倾泻
rmStyle({ key: 'TUMBLE', cn: '积木倾泻', en: 'Block cascade', cat: 'space', desc: '一串彩色积木从左上角沿台阶翻滚而下，每一块都在转身，影子跟着跳动。' }, {
  map: `vec2 r = vec2(p.y+1.2, 0.); for(int k=0;k<6;k++){ float fk = float(k); r = U(r, vec2(sdRBox(p - vec3(-2.2+fk*.9, -1.2 + (5.-fk)*.32*.5, .5), vec3(.45, (5.-fk)*.16+.001, 1.2), .02), 9.)); }
    for(int k=0;k<8;k++){ float fk = float(k); float s = fract(T*.12 + fk/8.); vec3 c = vec3(-2.6 + s*5.6, -.55 + (1.-s)*1.4 + .35*abs(sin(s*18.)), .3 + .2*sin(fk*3.)); vec3 q = p - c; q.xy = rot(-s*9.)*q.xy; q.xz = rot(fk)*q.xz; r = U(r, vec2(sdRBox(q, vec3(.17), .03), 1.+fk)); } return r;`,
  pal: `if(id < .5) return vec3(.95,.93,.9); if(id > 8.5) return vec3(.92,.9,.88); float k = mod(id, 4.); return k < 1. ? vec3(1.,.38,.3) : k < 2. ? vec3(.2,.45,.95) : k < 3. ? vec3(1.,.78,.25) : vec3(.3,.75,.6);`,
  bg: `return mix(vec3(.96,.95,.93), vec3(.9,.9,.92), uv.y);`, ro: `vec3(-1., 1.8, -5.2)`, ta: `vec3(.4, -.3, .3)`, fov: '1.6', L: 'vec3(-.5,.9,-.3)', soft: '12.', fog: '.01' });
// 12 球阵波浪
rmStyle({ key: 'ORBS', cn: '球阵波浪', en: 'Orb wave', cat: 'space', desc: '一整片排成方阵的小球随正弦波起伏，透视把方阵一路铺到地平线，颜色随高度渐变。' }, {
  map: `vec2 r = vec2(p.y+.6, 0.); vec2 id = floor(p.xz/.5+.5); vec3 best = vec3(1e5,0.,0.); for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 c = (id+vec2(i,j))*.5; float hh = .45*sin(length(c-vec2(-2.,6.))*1.3 - T*2.); float d = length(p - vec3(c.x, -.35 + hh, c.y)) - .19; if(d < best.x) best = vec3(d, hh, 0.); } r = U(r, vec2(best.x, 2. + best.y)); return r;`,
  pal: `if(id < .5) return vec3(.9,.89,.92); float hh = id-2.; return mix(vec3(.42,.36,.95), vec3(1.,.55,.6), smoothstep(-.45,.45,hh));`,
  bg: `return mix(vec3(.93,.91,.98), vec3(.98,.86,.86), uv.y);`, ro: `vec3(1.5, 1.4, -3.)`, ta: `vec3(-.5, -.4, 4.)`, fov: '1.3', L: 'vec3(.5,.8,-.4)', soft: '8.', fog: '.045' });
// 13 旋转楼梯
rmStyle({ key: 'STAIRWELL', cn: '螺旋楼梯', en: 'Stairwell', cat: 'space', desc: '从楼梯井正上方往下看，台阶一级级旋向深处，像一枚鹦鹉螺，是纵深感最强的构图之一。' }, {
  map: `float rr = length(p.xz); vec2 r = vec2(1e5, 3.); r = U(r, vec2(sdTorus(p - vec3(0., floor(p.y/.6)*.6+.3, 0.), vec2(.86,.025)), 3.)); r = U(r, vec2(max(1.75 - rr, rr - 1.9), 4.)); float N = 22., dy = .11; float a = atan(p.z,p.x) + T*.9; if(a<0.) a += 6.2832; float s0 = floor(a/(6.2832/N));
    float best = 1e5, bid = 1.; for(int j=-1;j<=1;j++){ float sk = s0 + float(j); for(int l=-1;l<=1;l++){ float lev = floor((-p.y)/(N*dy)) + float(l); float k = sk + lev*N; float yk = -k*dy; float ang = (sk+.5)*(6.2832/N) - T*.9; vec3 q = p - vec3(0., yk, 0.); q.xz = rot(ang)*q.xz; float d = sdBox(q - vec3(1.32,0.,0.), vec3(.44,.045,.2)); if(d < best){ best = d; bid = 1. + mod(k,2.); } } }
    r = U(r, vec2(best, bid)); return r;`,
  pal: `if(id < 1.5) return vec3(.96,.93,.88); if(id < 2.5) return vec3(.9,.85,.78); if(id < 3.5) return vec3(.86,.35,.28); return vec3(.2,.19,.2);`,
  bg: `return vec3(.03,.025,.03);`, ro: `vec3(.05, 4.2 - T*.85, .02)`, ta: `vec3(.6*sin(T*.4), -3. - T*.85, .6*cos(T*.4) - .6)`, fov: '1.05', sx: '.25', L: 'vec3(.25,1.,.2)', soft: '18.', fog: '.09', key: '1.2', amb: '.2' });
// 14 卵石平衡
rmStyle({ key: 'CAIRN', cn: '卵石平衡', en: 'Balanced stones', cat: 'nature', desc: '五颗卵石竖着叠成一座小塔，最上面那颗还在微微晃动，雾灰色的背景让人屏住呼吸。' }, {
  map: `vec2 r = vec2(p.y+1.2, 0.); float sw = .05*sin(T*1.6); vec3 c = vec3(.6,-1.2,0.); float y = 0.; vec3 sz[5]; sz[0] = vec3(.75,.3,.6); sz[1] = vec3(.58,.26,.5); sz[2] = vec3(.48,.24,.42); sz[3] = vec3(.36,.2,.32); sz[4] = vec3(.24,.17,.22);
    for(int k=0;k<5;k++){ vec3 e = sz[k]; y += e.y*.95; vec3 q = p - c - vec3(.04*sin(float(k)*2.1) + sw*float(k)*float(k)*.04, y, 0.); q.xy = rot(.08*sin(float(k)*3.) + sw*float(k)*.1)*q.xy; float d = (length(q/e)-1.)*min(e.x,min(e.y,e.z)); d += .006*fbm(q*8.); r = U(r, vec2(d, 1.+float(k))); y += e.y*.95; } return r;`,
  pal: `if(id < .5) return vec3(.72,.72,.72); float k = id; return k < 1.5 ? vec3(.32,.31,.3) : k < 2.5 ? vec3(.62,.6,.56) : k < 3.5 ? vec3(.24,.24,.25) : k < 4.5 ? vec3(.8,.78,.74) : vec3(.45,.43,.4);`,
  bg: `return mix(vec3(.72,.73,.74), vec3(.84,.85,.86), uv.y);`, ro: `vec3(-.3, .3, -4.)`, ta: `vec3(.2, .1, 0.)`, fov: '1.9', sx: '.05', L: 'vec3(-.6,.7,-.3)', soft: '10.', fog: '.0', key: '1.05', amb: '.45' });
// 15 陶瓷器皿
rmStyle({ key: 'VASE', cn: '素坯静物', en: 'Ceramic still life', cat: 'material', desc: '一排素坯陶瓷器皿在斜光下排成静物，长影在台面上拉出节奏，像一本器物杂志的跨页。' }, {
  map: `vec2 r = vec2(p.y, 0.); r = U(r, vec2(-(p.z-2.4), 0.));
    float d0 = 3.*pow(clamp(1.-T*1.5,0.,1.),2.), d1 = 3.*pow(clamp(1.-(T-.3)*1.5,0.,1.),2.), d2 = 3.*pow(clamp(1.-(T-.6)*1.5,0.,1.),2.);
    vec3 q = p - vec3(-.9,d0,.4); float rr = length(q.xz); float prof = .32 + .18*sin(q.y*3.2+.4) - .1*q.y; r = U(r, vec2(max(rr - prof, abs(q.y-.7)-.7)*.7, 1.));
    q = p - vec3(.3,d1,.9); rr = length(q.xz); prof = .5 - .25*pow(q.y-.35,2.)*3. ; r = U(r, vec2(max(rr - max(prof,.12), abs(q.y-.4)-.4)*.7, 2.));
    q = p - vec3(1.35,d2,.3); rr = length(q.xz); prof = .16 + .22*smoothstep(1.4,.3,q.y); r = U(r, vec2(max(rr - prof, abs(q.y-.8)-.8)*.7, 3.));
    q = p - vec3(-2.4 + 3.*clamp((T-1.2)/4.5,0.,1.)*(2.-clamp((T-1.2)/4.5,0.,1.)), 0., -.3); r = U(r, vec2(length(q - vec3(0.,.22,0.)) - .22, 4.)); return r;`,
  pal: `if(id < .5) return p.z > 2.39 ? vec3(.88,.84,.78) : vec3(.92,.88,.82); return id < 1.5 ? vec3(.86,.78,.68) : id < 2.5 ? vec3(.95,.93,.88) : id < 3.5 ? vec3(.78,.6,.5) : vec3(.4,.45,.42);`,
  bg: `return vec3(.9,.86,.8);`, ro: `vec3(-.5 + T*.12, 1.9 - T*.06, -5.6 + T*.22)`, ta: `vec3(.3, .5, .6)`, fov: '1.9', sx: '.62', L: 'vec3(-.95 + T*.2,.42 + T*.03,-.2 - T*.04)', soft: '18.', fog: '.0' });
// 16 圆环链
rmStyle({ key: 'LINKS', cn: '圆环锁链', en: 'Interlocked rings', cat: 'material', desc: '一串磨砂圆环互相扣住，从画面右下斜着升起，环与环之间的阴影交错。' }, {
  map: `vec2 r = vec2(p.y+1.4, 0.); for(int k=0;k<7;k++){ float fk = float(k); vec3 c = vec3(-1.3 + fk*.55, -1. + fk*.42, 1. - fk*.2); vec3 q = p - c; q.xy = rot(.65)*q.xy; if(mod(fk,2.)>.5) q.yz = rot(1.5708)*q.yz; q.xz = rot(T*.2*(mod(fk,2.)*2.-1.))*q.xz; r = U(r, vec2(sdTorus(q.xzy, vec2(.34,.09)), 1.+mod(fk,3.))); } return r;`,
  pal: `if(id < .5) return vec3(.86,.9,.95); return id < 1.5 ? vec3(.25,.35,.9) : id < 2.5 ? vec3(.96,.96,.98) : vec3(1.,.55,.3);`,
  bg: `return mix(vec3(.86,.9,.97), vec3(.78,.84,.95), uv.y);`, ro: `vec3(1.4, .6, -4.4)`, ta: `vec3(.2, .3, .3)`, fov: '1.6', L: 'vec3(-.4,.9,-.5)', soft: '10.', fog: '.01', spec: '.5' });
// 17 绗缝软垫
rmStyle({ key: 'QUILT', cn: '绗缝软垫', en: 'Quilted puff', cat: 'material', desc: '一整面充气绗缝软垫，菱形格子鼓起来又塌下去，像在呼吸，奶油色里透着一点粉。' }, {
  map: `vec2 r; vec2 q = rot(.785)*p.xz; vec2 cell = fract(q*1.4)-.5; float pf = (.12 + .04*sin(T*1.5 + floor(q.x*1.4)*1.3 + floor(q.y*1.4)*.7))*(1.-pow(max(abs(cell.x),abs(cell.y))*2.,4.)); float d = p.y - pf; r = vec2(d*.7, 1. + step(.0, sin(floor(q.x*1.4)+floor(q.y*1.4))*0.)); return r;`,
  pal: `return vec3(.97,.9,.88);`,
  bg: `return vec3(.95,.88,.86);`, ro: `vec3(-1.2, 1.4, -2.2)`, ta: `vec3(1.4, -.2, 2.)`, fov: '1.3', L: 'vec3(-.7,.5,.2)', soft: '12.', fog: '.06', key: '1.15', amb: '.5' });
