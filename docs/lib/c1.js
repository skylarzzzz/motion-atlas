// ===== C1 · shader studies =====
const H21 = `float hs(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }`;
// 水墨入水
shaderStyle({ key: 'INKWATER', cn: '水墨入水', en: 'Ink in water', cat: 'nature', desc: '一滴浓墨落进清水，在宣纸色的背景里翻卷、舒展、分叉，像会动的写意山水。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R - .5*R)/R.y; float t = T*.22;
    vec2 q = p; for(int k=0;k<3;k++){ q += .22*vec2(fbm(vec3(q*2.2, t+float(k))), fbm(vec3(q*2.2+7.3, t-float(k)))) - .11; }
    float cx = .33 + .08*sin(p.y*3.+t*2.), top = .62, depth = .25 + T*.11; float y = top - p.y;
    float wdt = .03 + .28*smoothstep(0., .9, y) * (.6+.4*fbm(vec3(q*3.,t)));
    float env = exp(-pow((q.x - cx)/wdt, 2.)) * smoothstep(depth, depth-.35, y) * smoothstep(-.02,.05,y);
    float cl = 0.; for(int k=0;k<3;k++){ float fk = float(k); vec2 c = vec2(.3+.25*sin(fk*2.1), .2 - fk*.18); float rr = .12 + .1*fk; cl += exp(-dot(q-c,q-c)/(rr*rr)) * smoothstep(1.2+fk*.9, 2.6+fk*.9, T); }
    float d = clamp(env*1.3 + cl*.85, 0., 1.); float fib = fbm(vec3(q*9., t*2.)); d *= .55 + .7*fib; d = clamp(d,0.,1.);
    vec3 paper = vec3(.94,.92,.87) - .04*fbm(vec3(p*40.,0.)); vec3 ink = mix(vec3(.12,.16,.24), vec3(.03,.03,.04), smoothstep(.3,.9,d));
    vec3 col = mix(paper, ink, smoothstep(.04,.85,d)); col = mix(col, vec3(.55,.18,.12), smoothstep(.07,0.,length(p-vec2(.72,-.36)))*.0);
    o = vec4(col,1.); }`, () => { grain(X, .07, 'multiply'); X.fillStyle = '#B5322A'; X.fillRect(1700, 820, 54, 54); X.fillStyle = '#F3EFE6'; font(X, '900', 22, F.serif); X.fillText('墨', 1715, 855); });
// 晕渲地形
shaderStyle({ key: 'RELIEF', cn: '晕渲地图', en: 'Shaded relief', cat: 'graphic', desc: '老式地图的晕渲画法：西北来的光照出山脊和沟谷，等高线和分层设色叠在上面，河流一笔蜿蜒穿过。' }, `in vec2 uv; out vec4 o;
  float rid(vec3 p){ float s = 0., a = .5; for(int i=0;i<6;i++){ float n = 1.-abs(n3(p)*2.-1.); s += a*n*n; p = p*2.03 + vec3(1.3,7.1,2.9); p.xy *= rot(.63); a *= .5; } return s; }
  float hf(vec2 p){ return rid(vec3(p*.85, 0.)) * smoothstep(-.9,.4,p.x) - .1; }
  void main(){ vec2 p = (uv*R - .5*R)/R.y; p += vec2(T*.012, T*.006); vec2 e = vec2(.0016,0.); float h = hf(p);
    vec3 n = normalize(vec3(hf(p-e.xy)-hf(p+e.xy), hf(p-e.yx)-hf(p+e.yx), .012)); float sh = clamp(dot(n, normalize(vec3(-.7,.7,.5))), 0., 1.);
    vec3 hyp = h < .1 ? mix(vec3(.62,.74,.6), vec3(.78,.8,.62), h/.1) : h < .3 ? mix(vec3(.78,.8,.62), vec3(.82,.7,.55), (h-.1)/.2) : mix(vec3(.82,.7,.55), vec3(.97,.96,.94), clamp((h-.3)/.2,0.,1.));
    vec3 col = hyp*(.45 + .75*sh);
    float cl = fract(h*28.); float w = fwidth(h*28.); col *= 1. - .22*smoothstep(w*1.5, 0., min(cl, 1.-cl)); float cl5 = fract(h*28./5.); col *= 1. - .3*smoothstep(w*.5, 0., min(cl5,1.-cl5));
    float rv = abs(p.y + .25*sin(p.x*2.3) + .08*fbm(vec3(p*3.,0.)) + .05) ; float rp = smoothstep(.006, .002, rv)*smoothstep(-.6,-.2,p.x); col = mix(col, vec3(.28,.5,.72), rp);
    if(h < 0.){ col = mix(vec3(.62,.78,.86), vec3(.48,.66,.8), clamp(-h*6.,0.,1.)); col *= 1. - .12*smoothstep(.02,0.,fract(-h*40.)); }
    vec2 g = abs(fract(p*4.)-.5); col = mix(col, vec3(.3,.25,.2), .25*smoothstep(.003,0.,min(g.x,g.y)));
    o = vec4(col,1.); }`, () => { grain(X, .07, 'multiply'); font(X, '500', 18, F.mono); X.fillStyle = 'rgba(40,30,20,.75)'; X.fillText('N 30°14′', 1700, 980); X.fillText('E 120°09′', 1700, 1006); X.strokeStyle = 'rgba(40,30,20,.75)'; X.lineWidth = 2; X.beginPath(); X.moveTo(1830, 120); X.lineTo(1845, 170); X.lineTo(1830, 160); X.lineTo(1815, 170); X.closePath(); X.stroke(); font(X, '700', 20, F.inter); X.fillStyle = 'rgba(40,30,20,.75)'; X.fillText('N', 1823, 110); });
// 流动丝绸
shaderStyle({ key: 'SILK', cn: '流动丝绸', en: 'Flowing silk', cat: 'material', desc: '一整幅墨绿真丝在风里起伏，褶皱的高光像水一样滑过，只靠光影就把柔软讲清楚。' }, `in vec2 uv; out vec4 o;
  float hf(vec2 p){ float t = T*.35; p.x += .35*sin(p.y*1.1+t) + .2*fbm(vec3(p*.6,t*.3)); float a = p.x*2.2 + p.y*.9 + t; float h = .55*(1.-abs(sin(a))) ; h += .3*sin(p.x*3.7 - p.y*1.6 - t*1.2); h += .12*(1.-abs(sin(p.x*6.3+p.y*2.9+t*.8))); return h; }
  void main(){ vec2 p = (uv*R - .5*R)/R.y * 2.2 + vec2(-.4,0.); vec2 e = vec2(.004,0.);
    vec3 n = normalize(vec3(hf(p-e.xy)-hf(p+e.xy), hf(p-e.yx)-hf(p+e.yx), .035));
    vec3 L = normalize(vec3(-.5,.6,.6)), V = vec3(0.,0.,1.); vec3 Hh = normalize(L+V);
    float dif = max(dot(n,L),0.); float sh = pow(max(dot(n,Hh),0.), 45.); float sheen = pow(1. - max(dot(n,V),0.), 3.);
    vec3 base = vec3(.015,.16,.12); vec3 col = base*(.12 + 1.5*dif*dif) + vec3(.8,1.,.85)*sh*.9 + vec3(.25,.6,.45)*sheen*.5;
    col *= .75 + .35*smoothstep(-1.2,1.,p.x); col = col/(1.+col*.4); o = vec4(pow(col,vec3(.9)),1.); }`, () => grain(X, .05));
// 星云
shaderStyle({ key: 'NEBULA', cn: '玫瑰星云', en: 'Rosette nebula', cat: 'nature', desc: '一团发光的星际气体，氢的红、氧的青和暗尘带交织，年轻的恒星在中间点亮整片云。' }, `in vec2 uv; out vec4 o; ${H21}
  void main(){ vec2 p = (uv*R - .5*R)/R.y; vec2 c = vec2(.47,.03); vec2 q = (p-c)*rot(T*.05)*1.12/(1. + T*.09); float r = length(q);
    vec2 w = q + .25*vec2(fbm(vec3(q*2.5, T*.03)), fbm(vec3(q*2.5+4., T*.03)));
    float gas = fbm(vec3(w*3., 1.)); float ring = exp(-pow((r - .3 - .08*gas)/.16, 2.));
    vec3 col = vec3(0.); col += vec3(1.,.22,.3)*ring*gas*1.4; col += vec3(.1,.75,.85)*exp(-r*r/.04)*fbm(vec3(w*5.,3.))*1.2;
    col += vec3(1.,.6,.3)*exp(-pow((r-.45)/.2,2.))*pow(fbm(vec3(w*4.,7.)),2.)*.9;
    float dust = smoothstep(.45,.75, fbm(vec3(w*6.,9.))); col *= 1. - .85*dust*smoothstep(.6,.2,r);
    col += vec3(.04,.03,.08)*fbm(vec3(p*2.,2.));
    vec2 g = p*90.; vec2 id = floor(g); float hh = hs(id); if(hh>.985){ vec2 f = fract(g)-.5 - (vec2(hs(id+1.),hs(id+2.))-.5)*.6; float d = length(f); col += vec3(1.,.95,.9)*smoothstep(.12,0.,d)*(.5+.5*sin(T*2.+hh*90.)); }
    vec2 s0 = q; for(int k=0;k<5;k++){ vec2 sc = vec2(hs(vec2(float(k),2.))-.5, hs(vec2(float(k),5.))-.5)*.25; float d = length(s0-sc); col += vec3(.8,.9,1.)*(.0015/(d*d+.0004)); col += vec3(.7,.85,1.)*.002/(abs((s0-sc).x)+.002)*smoothstep(.06,0.,abs((s0-sc).y))*.2; }
    vec2 wq = p - c; float wr = length(wq); vec2 lp = vec2(log(wr + 1e-3)*4. - T*1.4, atan(wq.y,wq.x)*9.55); vec2 wid = floor(lp); vec2 wf = fract(lp) - .5; float wh = hs(wid + 7.); if(wh > .82){ float off = (hs(wid+3.)-.5)*.6; col += vec3(.9,.92,1.)*smoothstep(.07,0.,abs(wf.y - off))*smoothstep(.5,.1,abs(wf.x))*smoothstep(.05,.5,wr)*(.6 + .8*smoothstep(.2,1.,T/8.)); }
    col = 1. - exp(-col*1.2); o = vec4(col,1.); }`, () => grain(X, .05));
// 湿拓画
shaderStyle({ key: 'EBRU', cn: '湿拓画', en: 'Ebru marbling', cat: 'pattern', desc: '颜料滴在水面上一圈圈散开，再用梳子拉出波浪和花，土耳其湿拓画的流动纹理一层层显形。' }, `in vec2 uv; out vec4 o;
  vec3 P(float k){ k = mod(k,5.); return k<1.? vec3(.1,.18,.38) : k<2.? vec3(.93,.88,.76) : k<3.? vec3(.78,.32,.18) : k<4.? vec3(.86,.64,.22) : vec3(.18,.42,.42); }
  void main(){ vec2 p = (uv*R - .5*R)/R.y; vec2 q = p; float t = T;
    float comb1 = smoothstep(1.,3.,t), comb2 = smoothstep(3.,5.5,t);
    q.x -= comb2*.06*sin(q.y*28.);
    q.y -= comb1*.12*sin(q.x*9. + 1.);
    q.x -= .05*sin(q.y*3. + t*.3);
    float best = 9., k = 0.; for(int i=0;i<7;i++){ float fi = float(i); vec2 c = vec2(-.05 + .55*fract(sin(fi*7.1)*43.), -.4 + .8*fract(sin(fi*3.7)*91.)); float d = length(q-c)/(.3+.12*fract(fi*.37)); if(d < best){ best = d; k = fi; } }
    float band = best*7.; vec3 col = P(floor(band) + k*2.); float edge = smoothstep(.0,.06,fract(band))*smoothstep(1.,.94,fract(band)); col *= .85 + .15*edge;
    col = mix(col, vec3(.93,.88,.76), smoothstep(.25,-.05,p.x+.1*sin(p.y*4.)));
    o = vec4(col,1.); }`, () => grain(X, .08, 'multiply'));
// 黑洞
shaderStyle({ key: 'BLACKHOLE', cn: '黑洞', en: 'Event horizon', cat: 'tech', desc: '光线被引力掰弯，吸积盘绕过黑洞后方又从上下露出来，靠近我们的一侧因多普勒效应更亮。' }, `in vec2 uv; out vec4 o; ${H21}
  vec3 stars(vec3 d){ vec2 s = vec2(atan(d.z,d.x), asin(d.y))*60.; vec2 id = floor(s); float h = hs(id); return vec3(.9,.95,1.)*step(.985,h)*smoothstep(.35,.0,length(fract(s)-.5)); }
  void main(){ vec2 sp = (uv*R - .5*R)/R.y; sp.x -= .28; vec3 ro = vec3(0., 1.9 - T*.2, -15.5 + T*.6); vec3 f = normalize(vec3(0.,0.,0.)-ro), r = normalize(cross(f,vec3(0.,1.,0.))), u = cross(r,f);
    vec3 rd = normalize(sp.x*r + sp.y*u + 1.25*f); rd.xy *= rot(-.12) * 1.; vec3 p = ro, v = rd; vec3 col = vec3(0.); float alpha = 1.; float h2 = dot(cross(p,v),cross(p,v));
    for(int i=0;i<260;i++){ float rr = length(p); if(rr < 1.){ alpha = 0.; break; } float dt = .03 + .045*rr; vec3 pn = p + v*dt; v += -1.5*h2*p/pow(rr,5.)*dt;
      if(p.y*pn.y < 0.){ vec3 c = mix(p,pn, p.y/(p.y-pn.y)); float cr = length(c); if(cr > 2.4 && cr < 7.5){ float ang = atan(c.z,c.x); float tex = .6 + .4*fbm(vec3(cr*3., ang*4. - T*1.2/cr, 1.)); float temp = pow(2.4/cr, 1.6); float dop = 1. + .55*dot(normalize(vec3(-c.z,0.,c.x)), -rd); vec3 dc = mix(vec3(1.,.35,.08), vec3(1.,.9,.7), temp)*temp*tex*dop*dop*2.2; dc *= smoothstep(7.5,6.,cr)*smoothstep(2.4,2.8,cr); col += dc*alpha; alpha *= .25; } }
      p = pn; if(rr > 30.) break; }
    col += stars(normalize(v))*alpha; col = 1. - exp(-col*1.3); o = vec4(pow(col,vec3(.95)),1.); }`, () => grain(X, .05));
// 日全食
shaderStyle({ key: 'ECLIPSE', cn: '日全食', en: 'Totality', cat: 'nature', desc: '月亮完全挡住太阳的那几秒，日冕像白色火焰一样向外伸展，边缘亮起一颗钻石环。' }, `in vec2 uv; out vec4 o; ${H21}
  void main(){ vec2 p = (uv*R - .5*R)/R.y; vec2 c = vec2(.3,.1); vec2 q = p - c; float r = length(q), a = atan(q.y,q.x); float R0 = .16;
    vec3 sky = mix(vec3(.02,.03,.08), vec3(.08,.1,.2), smoothstep(-.5,.3,p.y)); sky += vec3(.9,.45,.25)*smoothstep(-.25,-.48,p.y)*.6;
    float str = pow(fbm(vec3(a*3.,a*1., T*.05))*.6 + .4*fbm(vec3(a*12., 0., T*.1)), 2.);
    float cor = exp(-(r-R0)*9./(.4+1.4*str)) * step(R0, r); vec3 col = sky + vec3(.9,.95,1.)*cor*1.4 + vec3(1.,.95,.85)*exp(-(r-R0)*40.)*.8*step(R0,r);
    float k = smoothstep(.5,2.,T); float ba = 2.4; vec2 bp = c + R0*vec2(cos(ba),sin(ba)); col += vec3(1.,.97,.9)*(.0009*k/(dot(p-bp,p-bp)+.00005)); col += vec3(1.,.9,.8)*k*.25*exp(-length(p-bp)*8.);
    col += vec3(1.,.4,.5)*smoothstep(.006,.0,abs(r-R0-.004))*smoothstep(.5,1.,sin(a*7.+1.))*.6;
    col = mix(col, vec3(.005), smoothstep(R0+.002, R0-.002, r));
    vec2 g = p*80.; vec2 id = floor(g); if(hs(id)>.99) col += .6*smoothstep(.2,0.,length(fract(g)-.5))*smoothstep(-.1,.3,p.y);
    float hz = -.36 + .03*fbm(vec3(p.x*4.,0.,0.)) + .02*sin(p.x*9.); col = mix(col, vec3(.01,.012,.02), smoothstep(hz+.003, hz-.003, p.y));
    col = 1. - exp(-col*1.3); o = vec4(col,1.); }`, () => grain(X, .05));
// 土星
shaderStyle({ key: 'SATURN', cn: '土星环', en: 'Ringed giant', cat: 'tech', desc: '斜阳照着土星的云带，光环在星球上投下细细的影子，星球自己的影子又切进光环背面。' }, `in vec2 uv; out vec4 o; ${H21}
  void main(){ vec2 sp = (uv*R - .5*R)/R.y; sp.x -= .26; vec3 ro = vec3(-1.1 + T*.14, .18 + T*.12, -4.4 - T*.14); vec3 f = normalize(-ro), rr = normalize(cross(f,vec3(0.,1.,0.))), u = cross(rr,f);
    vec3 rd = normalize(sp.x*rr + sp.y*u + 1.5*f); mat2 tl = rot(-.38); rd.xy = tl*rd.xy; ro.xy = tl*ro.xy; vec3 L = normalize(vec3(-1.,.35,-.25));
    vec3 col = vec3(.005,.006,.012); vec2 g = (uv*R)/R.y*120.; if(hs(floor(g))>.992) col += .7*smoothstep(.3,0.,length(fract(g)-.5));
    float b = dot(ro,rd), c = dot(ro,ro) - 1.; float hdisc = b*b - c; float tp = hdisc>0. ? -b - sqrt(hdisc) : 1e9;
    float tr = -ro.y/rd.y; vec3 pr = ro + rd*tr; float rl = length(pr.xz);
    if(tp < 1e8){ vec3 pp = ro + rd*tp, n = normalize(pp); float lat = pp.y + .03*fbm(vec3(pp*6.+vec3(T*.1,0.,0.))); vec3 alb = mix(vec3(.85,.72,.52), vec3(.95,.9,.78), .5+.5*sin(lat*38.)) * (.85+.15*sin(lat*91.)); alb = mix(alb, vec3(.6,.45,.3), smoothstep(.75,.95,abs(pp.y)));
      float dif = max(dot(n,L),0.); float rs = -pp.y/L.y; vec3 rpp = pp + L*rs; float rl2 = length(rpp.xz); float ringsh = (rs>0. && rl2>1.25 && rl2<2.3) ? .25 : 1.; col = alb*dif*ringsh*1.3 + alb*.02; }
    if(tr > 0. && rl > 1.25 && rl < 2.3 && tr < tp){ float d = .5 + .5*sin(rl*60.) * .3 + .4*fbm(vec3(rl*40.,0.,0.)); d *= smoothstep(1.25,1.32,rl)*smoothstep(2.3,2.2,rl)*(1. - .85*smoothstep(.03,.0,abs(rl-1.82))); vec3 rc = mix(vec3(.85,.78,.65), vec3(.6,.55,.5), smoothstep(1.3,2.2,rl));
      float bb = dot(pr,L), cc = dot(pr,pr)-1.; float sh = (bb*bb - cc > 0. && -bb - sqrt(bb*bb-cc) > 0.) ? .05 : 1.; col = mix(col, rc*sh*(.4+.8*abs(L.y)*2.), d*.92); }
    col = 1. - exp(-col*1.6); o = vec4(pow(col,vec3(.95)),1.); }`, () => grain(X, .04));
// 拿铁拉花
shaderStyle({ key: 'LATTE', cn: '拿铁拉花', en: 'Latte art', cat: 'product', desc: '俯拍一杯拿铁，奶泡一层层推出郁金香的花瓣，最后一笔拉线收尾，杯沿的白瓷映着窗光。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R - .5*R)/R.y; vec2 c = vec2(.3,0.); vec2 q = p - c; float r = length(q);
    vec3 table = mix(vec3(.55,.42,.32), vec3(.42,.3,.22), fbm(vec3(p*vec2(2.,30.),0.))); table *= .9 + .1*sin(p.y*120. + fbm(vec3(p*4.,1.))*8.);
    vec3 col = table; float sh = smoothstep(.48,.36,length(q - vec2(.04,-.05))); col *= 1. - .45*sh;
    vec2 hq = q - vec2(.47,.0); float handle = smoothstep(.012,.0,abs(length(hq*vec2(1.,.8))-.07)-.022); col = mix(col, vec3(.95,.94,.92), handle);
    if(r < .42){ col = mix(vec3(.96,.95,.93), vec3(.8,.79,.77), smoothstep(.36,.42,r)); }
    if(r < .36){ vec2 w = q*rot(-.3); w += .01*vec2(fbm(vec3(w*12.,T*.2)), fbm(vec3(w*12.+3.,T*.2))); vec3 crema = mix(vec3(.55,.32,.15), vec3(.32,.17,.07), smoothstep(.0,.36,r)); crema *= .9 + .2*fbm(vec3(w*25.,2.));
      float foam = 0.; float n = min(7., floor(T*1.6)+1.);
      for(int k=0;k<7;k++){ float fk = float(k); if(fk >= n) break; float rr = .16*pow(.8,fk); float y0 = -.2 + .055*(1.-pow(.8,fk))/.2 ; vec2 sc = vec2(1.,1.25); float in1 = smoothstep(rr, rr-.005, length((w - vec2(0.,y0))*sc)); float in2 = smoothstep(rr*.84+.003, rr*.84-.002, length((w - vec2(0.,y0+rr*.3))*sc)); foam = mix(foam, 1.-in2, in1); }
      float pull = smoothstep(4.6,5.6,T); foam = max(foam, smoothstep(.009,.004,abs(w.x))*step(-.24, w.y)*step(w.y, .22 - (1.-pull)*.5)*pull);
      vec2 hw = w - vec2(0.,.11); hw.x = abs(hw.x); float heart = smoothstep(.006,0., length(hw*vec2(1.,1.2) - vec2(.02,.0)) - .032)*step(.0,n-6.); foam = max(foam, heart);
      col = mix(crema, vec3(.98,.95,.9), foam); col *= 1. - .25*smoothstep(.28,.36,r); }
    col += vec3(1.)*.15*smoothstep(.06,0.,abs(r-.39))*smoothstep(.0,.5,q.y+q.x*.3);
    o = vec4(col,1.); }`, () => grain(X, .06, 'multiply'));
// 烛火
shaderStyle({ key: 'CANDLE', cn: '烛光长廊', en: 'Candlelight', cat: 'space', desc: '几十支蜡烛沿着两条斜线向深处排开，火苗随气流轻轻抖动，暖光一盏比一盏小地退进黑暗里。' }, `in vec2 uv; out vec4 o;
  void main(){ vec2 p = (uv*R - .5*R)/R.y; vec3 col = vec3(.014,.009,.007); float camH = .62;
    for(int j=0;j<26;j++){ int i = 25-j; float fi = float(i); float row = mod(fi,2.); float k = floor(fi/2.); float Z = 1.1 + k*.85 + row*.35; float Xw = (row>.5 ? 1.05 : .15) + .12*sin(fi*2.3); float hw = .22 + .25*fract(sin(fi*13.1)*41.);
      float s = .95/Z; vec2 b = vec2(Xw*s + .02, -camH*s); vec2 tp = vec2(b.x, (hw-camH)*s); float wd = .045*s;
      float wax = step(abs(p.x-b.x), wd)*step(b.y, p.y)*step(p.y, tp.y); float vy = (p.y - b.y)/(tp.y-b.y+1e-4); vec3 wc = vec3(.95,.86,.72)*(.12 + .9*pow(vy,4.))*(.6 + .4*smoothstep(wd, -wd, p.x-b.x)); col = mix(col, wc, wax);
      vec2 fq = (p - tp - vec2(0., .05*s))/s; float fl = fbm(vec3(fi*3., T*5., 0.)); fq.x += .012*sin(fq.y*25.+T*9.+fi)*smoothstep(-.03,.08,fq.y) + .006*(fl-.5); float fd = length(fq*vec2(1., .42));
      vec3 fc = mix(vec3(1.,.5,.12), vec3(1.,.96,.85), smoothstep(.022,.0,fd)); fc = mix(fc, vec3(.3,.4,1.), smoothstep(-.01,-.04,fq.y)*.6);
      col = mix(col, fc*1.25, smoothstep(.032,.024,fd)); vec2 gd = p - tp - vec2(0.,.05*s); col += vec3(1.,.5,.18)*.0016*s/(dot(gd,gd)+.0016*s*s*4.)*.5;
      vec2 rq = p - vec2(tp.x, 2.*b.y - tp.y - .05*s); col += vec3(1.,.5,.18)*.0006*s/(dot(rq*vec2(1.,.4),rq*vec2(1.,.4))+.003*s*s)*.25*step(p.y,b.y); }
    col = 1. - exp(-col*1.25); o = vec4(pow(col,vec3(.95)),1.); }`, () => grain(X, .05));
