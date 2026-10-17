// ===== BATCH 1 · shader materials =====
const TONE = `vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }`;
// 01 水底焦散
shaderStyle({ key: 'POOL', cn: '水底焦散', en: 'Caustic pool', cat: 'nature', desc: '阳光穿过水面在泳池底织出流动的光网，泳道线斜着把视线引向远处。' }, `in vec2 uv; out vec4 o; ${TONE}
  vec2 h22(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
  float vor(vec2 x, float t){ vec2 n = floor(x), f = fract(x); float m1 = 9., m2 = 9.; for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g = vec2(i,j); vec2 o = .5+.45*sin(t + 6.2831*h22(n+g)); vec2 r = g+o-f; float d = dot(r,r); if(d<m1){ m2 = m1; m1 = d; } else if(d<m2) m2 = d; } return sqrt(m2)-sqrt(m1); }
  float caus(vec2 p, float t){ p += .25*vec2(fbm(vec3(p*.5,t*.2)), fbm(vec3(p*.5+4.,t*.2))); float e = vor(p*1.4, t); float e2 = vor(p*2.3+7., t*1.3); return pow(1.-smoothstep(0.,.18,e),3.)*.9 + pow(1.-smoothstep(0.,.14,e2),3.)*.5; }
  void main(){ vec2 sc = (uv*R-.5*R)/R.y; vec3 ro = vec3(0.,2.2,0.), rd = normalize(vec3(sc.x-.25, sc.y-.75, 1.)); rd.xy = rot(-.12)*rd.xy; float tt = -ro.y/rd.y; vec2 p = ro.xz + rd.xz*tt; p = rot(.35)*p;
    vec2 g = abs(fract(p*2.)-.5); float grout = smoothstep(.46,.5,max(g.x,g.y)); float lane = smoothstep(.13,.11,abs(p.x-1.)); float c = caus(p, T*.9);
    vec3 tile = mix(vec3(.42,.78,.86), vec3(.25,.58,.72), grout*.7); tile = mix(tile, vec3(.03,.14,.38), lane); vec3 col = tile*.55 + vec3(.75,1.,1.)*c*(.9-lane*.4);
    col = mix(col, vec3(.06,.35,.5), 1.-exp(-tt*.09)); col *= 1.-.3*length(sc-vec2(.2,0.)); o = vec4(pow(aces(col*1.15),vec3(.92)),1.); }`, () => grain(X, .05));
// 02 大理石金缮
shaderStyle({ key: 'MARBLE', cn: '大理石金缮', en: 'Kintsugi marble', cat: 'material', desc: '白色大理石的流纹缓缓漂移，一道金缮裂缝斜穿石面，冷与贵在一张画面里。' }, `in vec2 uv; out vec4 o; ${TONE}
  void main(){ vec2 p = (uv*R-.5*R)/R.y; vec2 q = p*1.4 + vec2(T*.03, 0.); float w = fbm(vec3(q*1.3, T*.04)); float w2 = fbm(vec3(q*2.7+w*2., 1.));
    float v = abs(sin((q.x*2.2 + q.y*1.1 + w*4.5 + w2*1.5)*2.)); float vein = pow(1.-v, 18.)*.8 + pow(1.-abs(sin((q.x*.8-q.y*2.+w2*3.)*3.)), 40.)*.5;
    vec3 col = mix(vec3(.97,.96,.94), vec3(.86,.85,.84), w2*.7); col = mix(col, vec3(.16,.2,.22), clamp(vein*1.3,0.,1.)); col *= .9 + .1*smoothstep(-1.,1.,p.x-p.y);
    float cx = p.x - (.25 + .35*p.y + .06*sin(p.y*9.) + .03*sin(p.y*23.)); float gold = smoothstep(.02,.004,abs(cx)) * step(-.6, p.y); float sheen = .5+.5*sin(p.y*30.-T*2.);
    col = mix(col, mix(vec3(.75,.55,.2), vec3(1.,.88,.55), sheen), gold); col += vec3(1.,.95,.85)*.18*smoothstep(.4,0.,abs(p.x+p.y*.6-mod(T*.25,3.)+1.5));
    o = vec4(aces(col*1.05),1.); }`, () => grain(X, .05, 'multiply'));
// 03 丝绒沙丘
shaderStyle({ key: 'DUNE', cn: '丝绒沙丘', en: 'Velvet dunes', cat: 'nature', desc: '黄昏的低角度阳光扫过沙丘，山脊线像丝绒褶皱一样层层排开，风在沙面拉出细纹。' }, `in vec2 uv; out vec4 o; ${TONE}
  float hgt(vec2 p){ float d = 0.; d += .9*abs(sin(p.x*.35 + .7*sin(p.y*.21) + p.y*.12)); d += .35*fbm(vec3(p*.25,1.)); d = pow(d,1.6)*.8; return d + .015*sin(p.x*9.+p.y*4.+T); }
  void main(){ vec2 sc = (uv*R-.5*R)/R.y; vec3 ro = vec3(T*.25, 1.6, 0.), rd = normalize(vec3(sc.x+.1, sc.y-.18, 1.2)); float t = .1; float lh = 0., ly = 0.; bool hit = false;
    for(int i=0;i<110;i++){ vec3 p = ro+rd*t; float hh = hgt(p.xz); if(p.y < hh){ t -= (hh-p.y)*.5; hit = true; break; } t += max(.03, (p.y-hh)*.5); if(t>60.) break; }
    vec3 sky = mix(vec3(1.,.66,.45), vec3(.42,.36,.62), clamp(sc.y*1.6+.3,0.,1.)); vec3 col = sky; vec3 sun = normalize(vec3(-.9,.18,.4));
    col += vec3(1.,.8,.5)*pow(max(dot(rd,sun),0.),60.)*1.5;
    if(hit){ vec3 p = ro+rd*t; vec2 e = vec2(.02,0.); vec3 n = normalize(vec3(hgt(p.xz-e.xy)-hgt(p.xz+e.xy), 2.*e.x, hgt(p.xz-e.yx)-hgt(p.xz+e.yx))); float dif = clamp(dot(n,sun),0.,1.);
      vec3 alb = vec3(.86,.5,.32); col = alb*(dif*1.6*vec3(1.,.8,.6) + .18*vec3(.5,.45,.8)); col = mix(col, sky, 1.-exp(-t*.035)); }
    o = vec4(pow(aces(col),vec3(.95)),1.); }`, () => grain(X, .06));
// 05 熔岩灯
shaderStyle({ key: 'LAVA', cn: '熔岩灯', en: 'Lava lamp', cat: 'graphic', desc: '七十年代熔岩灯里的蜡团缓慢融合又分开，高光边让复古配色有了光泽。' }, `in vec2 uv; out vec4 o;
  float field(vec2 p){ float f = 0.; for(int i=0;i<9;i++){ float fi = float(i); vec2 c = vec2(.35*sin(fi*1.7+T*.31*(1.+fi*.07)) + .32, .55*sin(fi*2.3+T*.23*(1.+fi*.05))); float r = .09 + .05*fract(fi*.37); f += r*r/dot(p-c,p-c); } return f; }
  void main(){ vec2 p = (uv*R-.5*R)/R.y; float f = field(p); float e = .002; float fx = field(p+vec2(e,0.))-field(p-vec2(e,0.)), fy = field(p+vec2(0.,e))-field(p-vec2(0.,e)); vec3 n = normalize(vec3(-fx,-fy, .06));
    vec3 bg = mix(vec3(.18,.05,.32), vec3(.95,.35,.45), uv.y); bg = mix(bg, vec3(1.,.75,.35), smoothstep(.5,1.4,uv.x+uv.y*.2)*.4);
    float m = smoothstep(.95,1.05,f); vec3 wax = mix(vec3(1.,.42,.12), vec3(1.,.82,.3), n.y*.5+.5); float spec = pow(max(dot(n, normalize(vec3(-.4,.6,.7))),0.),30.);
    vec3 col = mix(bg, wax + spec*.8, m); col += vec3(1.,.5,.3)*smoothstep(.6,1.,f)*(1.-m)*.25; o = vec4(col,1.); }`, () => grain(X, .07));
// 07 波纹绸
shaderStyle({ key: 'MOIRE', cn: '波纹绸', en: 'Moiré silk', cat: 'graphic', desc: '两组极细的线条稍稍错开角度，叠出像丝绸一样流动的干涉纹。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R-.5*R)/R.y; vec2 c1 = vec2(.42+.05*sin(T*.4), .02), c2 = vec2(.5+.06*cos(T*.3), -.04);
    float a = sin(length(p-c1)*260.); float b = sin(length(p-c2)*260. + T); float l1 = smoothstep(-.2,.2,a), l2 = smoothstep(-.2,.2,b);
    float m = l1*l2; vec3 ink = vec3(.12,.16,.42), paper = vec3(.95,.93,.88); vec3 col = mix(ink, paper, m); float vig = smoothstep(.95,.2,length(p-vec2(.45,0.))); col = mix(paper, col, vig); o = vec4(col,1.); }`, () => grain(X, .05, 'multiply'));
// 08 热成像
shaderStyle({ key: 'THERM', cn: '热成像', en: 'Thermal vision', cat: 'tech', desc: '用红外热像的色阶看世界：冷的地方是深紫，热的地方从橙烧到白。' }, `in vec2 uv; out vec4 o;
  vec3 iron(float t){ t = clamp(t,0.,1.); vec3 c = mix(vec3(.02,0.,.08), vec3(.35,0.,.55), smoothstep(0.,.25,t)); c = mix(c, vec3(.85,.1,.25), smoothstep(.2,.45,t)); c = mix(c, vec3(1.,.55,0.), smoothstep(.45,.7,t)); c = mix(c, vec3(1.,.95,.6), smoothstep(.7,.95,t)); return c; }
  float body(vec2 p){ float d = 0.; d += .35*exp(-dot(p-vec2(.3,.15),p-vec2(.3,.15))*30.); d += .5*exp(-pow(length((p-vec2(.32,-.25))*vec2(1.3,.6)),2.)*12.); d += .25*exp(-dot(p-vec2(.62,-.1),p-vec2(.62,-.1))*60.); return d; }
  void main(){ vec2 p = (uv*R-.5*R)/R.y; vec2 q = p - vec2(.04*sin(T*.5), 0.); float t = body(q) + .12*fbm(vec3(p*3.,T*.2)) + .08 + .06*sin(T*2.+p.y*20.)*body(q);
    t += .35*exp(-dot(p-vec2(.62+.03*sin(T),-.1),p-vec2(.62+.03*sin(T),-.1))*80.)*(.8+.2*sin(T*5.)); t = floor(t*48.)/48.; vec3 col = iron(t*1.3);
    col *= .92 + .08*sin(uv.y*R.y*1.5); o = vec4(col,1.); }`, (lt) => { X.save(); X.strokeStyle = 'rgba(255,255,255,.8)'; X.lineWidth = 1.5; const cx = 1500, cy = 560; X.strokeRect(cx - 60, cy - 60, 120, 120); X.beginPath(); X.moveTo(cx - 10, cy); X.lineTo(cx + 10, cy); X.moveTo(cx, cy - 10); X.lineTo(cx, cy + 10); X.stroke(); font(X, '500', 18, F.mono); X.fillStyle = '#fff'; X.fillText(`${(36.4 + Math.sin(lt * 2) * .3).toFixed(1)} °C`, cx + 72, cy - 40);
  const g = X.createLinearGradient(0, 760, 0, 260); ['#05000F', '#59008C', '#D91A40', '#FF8C00', '#FFF29A'].forEach((c, i) => g.addColorStop(i / 4, c)); X.fillStyle = g; X.fillRect(1820, 260, 14, 500); X.fillText('42°', 1770, 272); X.fillText('18°', 1770, 760); X.restore(); grain(X, .05); });
// 10 金箔
shaderStyle({ key: 'GOLDLEAF', cn: '揉皱金箔', en: 'Crumpled gold', cat: 'material', desc: '一整张揉皱的金箔，褶皱的每个小面都在反光，光源移动时金光像水一样流过。' }, `in vec2 uv; out vec4 o; ${TONE}
  vec2 h22(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
  vec3 cellN(vec2 x){ vec2 n = floor(x), f = fract(x); float md = 9.; vec2 id; for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g = vec2(i,j); vec2 r = g+h22(n+g)-f; float d = dot(r,r); if(d<md){ md = d; id = n+g; } } vec2 hh = h22(id*1.3+7.)-.5; return normalize(vec3(hh*1.1, 1.)); }
  void main(){ vec2 p = (uv*R-.5*R)/R.y; vec2 q = p*7.; vec3 n1 = cellN(q), n2 = cellN(q*2.3+5.); vec3 n = normalize(n1 + n2*.6 + vec3(0.,0.,.5));
    vec2 lp = vec2(.55+.35*sin(T*.5), .2+.25*cos(T*.4)); vec3 L = normalize(vec3(lp - p, .6)); vec3 V = vec3(0.,0.,1.); float spec = pow(max(dot(reflect(-L,n),V),0.),18.); float dif = max(dot(n,L),0.);
    vec3 gold = vec3(1.,.72,.28); vec3 col = gold*(.08 + .5*dif) + vec3(1.,.9,.6)*spec*1.6; col *= .55 + .45*smoothstep(1.4,.1,length(p-vec2(.45,0.)));
    float edge = smoothstep(.0,.04, abs(p.x + .1 - .1*sin(p.y*3.) ) ); col = mix(vec3(.02,.015,.01), col, smoothstep(-.02,.02, p.x + .15 + .08*sin(p.y*4.+1.) + .03*fbm(vec3(p*6.,1.))));
    o = vec4(aces(col*1.2),1.); }`, () => grain(X, .05));
