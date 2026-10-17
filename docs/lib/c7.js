// ===== C7 · v3 replacements =====
// 土星 · 日出（电影级运镜：日食逆光 → 太阳从星球边缘爆出 → 拉远环绕）
shaderStyle({ key: 'SATURNX', cn: '土星日出', en: 'Saturn sunrise', cat: 'tech', desc: '日食般的逆光只剩一圈金边，太阳从星球边缘爆出，镜头拉开环绕亮出整颗土星和光环。' }, `in vec2 uv; out vec4 o;
  float hs(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
  float ease(float x){ x = clamp(x,0.,1.); return x<.5 ? 4.*x*x*x : 1.-pow(-2.*x+2.,3.)/2.; }
  void main(){ vec2 sp = (uv*R - .5*R)/R.y; sp.x -= .3;
    float e = ease(T/8.); float a = .02 + 1.55*ease((T-3.4)/4.6)*step(3.4,T); float dist = mix(4.3,3.5,smoothstep(0.,3.4,T)) + .9*smoothstep(3.6,8.,T); float h = .0 + .62*e;
    vec3 ro = dist*vec3(sin(a), h, -cos(a)); vec3 ta = vec3(0., -.05*e, 0.); vec3 f = normalize(ta-ro), rr = normalize(cross(f,vec3(0.,1.,0.))), u = cross(rr,f);
    vec3 rd = normalize(sp.x*rr + sp.y*u + 1.35*f); float roll = -.32 + .18*e; rd = normalize(rd); vec3 Ls = normalize(vec3(.0,.07,1.));
    // roll the view: rotate the screen basis
    vec2 sr = rot(roll)*sp; rd = normalize(sr.x*rr + sr.y*u + 1.35*f);
    vec3 col = vec3(.002,.003,.008); vec2 g = (uv*R)/R.y*140.; float hh = hs(floor(g)); if(hh>.993) col += .55*smoothstep(.3,0.,length(fract(g)-.5));
    float b = dot(ro,rd), c = dot(ro,ro) - 1.; float hd = b*b - c; float tp = hd>0. ? -b - sqrt(hd) : 1e9;
    float tr = -ro.y/rd.y; vec3 pr = ro + rd*tr; float rl = length(pr.xz);
    float sunA = dot(rd, Ls); bool sunHidden = tp < 1e8;
    // closest approach of the sun ray to the planet → limb glow for eclipse
    float bS = dot(ro, Ls); float dS = length(ro - Ls*bS); float occl = smoothstep(1.0, 1.06, dS);
    if(tp < 1e8){ vec3 pp = ro + rd*tp, n = normalize(pp); float lat = pp.y + .03*fbm(vec3(pp*6.+vec3(T*.08,0.,0.))); vec3 alb = mix(vec3(.85,.72,.52), vec3(.97,.91,.78), .5+.5*sin(lat*38.)) * (.85+.15*sin(lat*91.)); alb = mix(alb, vec3(.55,.42,.3), smoothstep(.75,.95,abs(pp.y)));
      float dif = max(dot(n,Ls),0.); float rs = -pp.y/Ls.y; vec3 rpp = pp + Ls*rs; float rl2 = length(rpp.xz); float ringsh = (rs>0. && rl2>1.25 && rl2<2.3) ? .3 : 1.;
      float rim = pow(1. - max(dot(n,-rd),0.), 3.); float fwd = pow(max(dot(rd,Ls),0.), 4.);
      col = alb*dif*ringsh*1.5 + alb*.015 + vec3(1.,.72,.42)*rim*fwd*2.2; }
    if(tr > 0. && rl > 1.25 && rl < 2.3 && tr < tp){ float d = .45 + .25*sin(rl*60.) + .4*fbm(vec3(rl*45.,0.,0.)); d *= smoothstep(1.25,1.32,rl)*smoothstep(2.3,2.2,rl)*(1. - .85*smoothstep(.03,.0,abs(rl-1.82))); d = clamp(d,0.,1.);
      vec3 rc = mix(vec3(.88,.8,.66), vec3(.62,.56,.5), smoothstep(1.3,2.2,rl)); float bb = dot(pr,Ls), cc = dot(pr,pr)-1.; float sh = (bb*bb - cc > 0. && -bb - sqrt(bb*bb-cc) > 0.) ? .06 : 1.;
      float fwd = pow(max(sunA,0.), 5.); float lit = .25 + 1.2*abs(Ls.y)*4. ; vec3 rcol = rc*sh*(lit*.5) + vec3(1.,.8,.55)*fwd*sh*2.2*(1.-d*.5);
      float sparkle = step(.996, hs(floor(pr.xz*900.)))*(.5+.5*sin(T*6.+rl*80.)); rcol += sparkle*sh*.6;
      col = mix(col, rcol, d*.9); }
    // sun disk + flare (only when not behind the planet)
    float vis = sunHidden ? 0. : 1.; vis *= occl;
    float ang = acos(clamp(sunA,-1.,1.));
    vec3 flare = vec3(1.,.95,.88)*smoothstep(.012,.008,ang)*3. + vec3(1.,.75,.45)*(.0009/(ang*ang+.00025)) ;
    vec3 sd = Ls - rd*sunA; vec2 sv = vec2(dot(sd,rr), dot(sd,u)); sv = rot(roll)*sv;
    flare += vec3(1.,.8,.6)*exp(-abs(sv.y)*380.)*exp(-abs(sv.x)*3.)*.9;
    for(int k=0;k<6;k++){ float fa = float(k)*1.047 + .3; vec2 dir = vec2(cos(fa), sin(fa)); float along = dot(sv,dir); float across = abs(sv.x*dir.y - sv.y*dir.x); flare += vec3(1.,.85,.7)*exp(-across*500.)*exp(-abs(along)*14.)*.35; }
    col += flare*vis;
    // limb glow while eclipsed: a ring of light around the planet
    float limb = exp(-max(dS - 1.,0.)*30.)*smoothstep(.4,.0,ang - asin(1./length(ro)));
    col += vec3(1.,.7,.42)*limb*pow(max(sunA,0.),40.)*0.;
    { vec3 oc = ro; float b2 = dot(oc,rd); float d2 = length(oc - rd*b2); if(b2 < 0.){ float halo = exp(-max(d2-1.,0.)*22.)*step(1.,d2); col += vec3(1.,.66,.38)*halo*pow(max(sunA,0.),18.)*2.5*(1.-vis*.6); } }
    float burst = exp(-pow((T - 3.5)/.45,2.)); col += vec3(1.,.85,.7)*burst*.35*vis;
    col = 1. - exp(-col*1.5); o = vec4(pow(col,vec3(.95)),1.); }`, () => grain(X, .04));
// 彩墨冲撞
shaderStyle({ key: 'COLORINK', cn: '彩墨冲撞', en: 'Ink collision', cat: 'nature', desc: '品红、湛蓝、橙黄、紫罗兰四股墨从画外冲进清水，在中心撞在一起翻卷混色。' }, `in vec2 uv; out vec4 o;
  float seg(vec2 p, vec2 a, vec2 b, out float h){ vec2 pa = p-a, ba = b-a; h = clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa - ba*h); }
  float plume(vec2 q, vec2 s, vec2 dir, float t0, float sp, float wid){ float t = max(T - t0, 0.); if(t <= 0.) return 0.; float L = sp*(1. - exp(-t*.8))*2.0; vec2 bend = vec2(-dir.y, dir.x);
    vec2 e = s + dir*L + bend*.18*sin(t*.7 + s.x*3.); float h; float d = seg(q, s, e, h); float w = .02 + wid*h*(.6 + .4*min(t,2.)); float core = exp(-d*d/(w*w));
    float head = exp(-dot(q-e, q-e)/(pow(wid*1.6*(.5 + .5*min(t*.6,1.)),2.))); return clamp(core*.9 + head*1.1, 0., 1.4)*smoothstep(0.,.25,t); }
  void main(){ vec2 p = (uv*R - .5*R)/R.y; float t = T*.16; vec2 q = p - vec2(.2,0.);
    for(int k=0;k<5;k++){ float fk = float(k); q += (.16 - fk*.025)*vec2(fbm(vec3(q*(1.8+fk*1.4), t + fk*1.3)), fbm(vec3(q*(1.8+fk*1.4)+5.2, t - fk))) - (.08 - fk*.0125); }
    float d1 = plume(q, vec2(.95,.55), normalize(vec2(-.75,-.6)), .0, .58, .14);
    float d2 = plume(q, vec2(.98,-.5), normalize(vec2(-.8,.55)), .35, .56, .13);
    float d3 = plume(q, vec2(.4,-.62), normalize(vec2(.05,1.)), .8, .52, .12);
    float d4 = plume(q, vec2(.25,.62), normalize(vec2(.25,-1.)), 1.25, .46, .11);
    float fil = .35 + 1.1*fbm(vec3(q*11., t*2.)); float fil2 = pow(1. - abs(fbm(vec3(q*22., t*3.))*2. - 1.), 2.);
    float ff = fil*(.65+.55*fil2); d1 = min(d1*ff,1.1); d2 = min(d2*ff,1.1); d3 = min(d3*ff,1.1); d4 = min(d4*ff,1.1);
    vec3 A = d1*vec3(.05,1.5,.55) + d2*vec3(1.6,.45,.05) + d3*vec3(.05,.55,1.7) + d4*vec3(.9,.15,1.2);
    vec3 paper = vec3(.965,.958,.945) - .03*smoothstep(.2,1.2,length(p - vec2(.3,0.))); float S = d1+d2+d3+d4; vec4 wv = pow(vec4(d1,d2,d3,d4)+1e-4, vec4(3.)); A = (wv.x*vec3(.05,1.5,.55) + wv.y*vec3(1.6,.45,.05) + wv.z*vec3(.05,.55,1.7) + wv.w*vec3(.7,1.25,.12))/(wv.x+wv.y+wv.z+wv.w)*min(S,1.4); vec3 col = paper*exp(-A*1.05); float Sl = d1+d2+d3+d4; vec3 nn = normalize(vec3(-dFdx(Sl)*14., -dFdy(Sl)*14., 1.)); float sh = dot(nn, normalize(vec3(-.5,.6,.6))); col *= mix(1., .9 + .16*sh, smoothstep(.05,.6,S)); col = mix(col, col*col*1.1, .25*smoothstep(.3,1.,S));
    col += vec3(1.)*.06*pow(max(0., 1. - length(p - vec2(.55,.35))*1.2), 3.);
    o = vec4(col,1.); }`, () => grain(X, .045, 'multiply'));
// 极光（动感增强版）
shaderStyle({ key: 'AURORAX', cn: '极光', en: 'Aurora', cat: 'nature', desc: '极光像帘子一样摆动、褶皱、忽明忽暗，倒映在雪山下的湖面上。' }, `in vec2 uv; out vec4 o;
  float hs(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
  vec3 sky(vec2 p){ vec3 c = mix(vec3(.004,.01,.03), vec3(.02,.05,.1), smoothstep(.7,-.2,p.y)); vec2 sp = p*rot(T*.02)*110.; vec2 id = floor(sp); float h = hs(id); vec2 f = fract(sp)-.5; c += vec3(.9,.95,1.)*step(.988,h)*smoothstep(.12,.0,length(f))*(.5+.5*sin(T*3.+h*50.));
    float w = smoothstep(-.75,.35,p.x); float surge = .55 + .45*smoothstep(0.,2.5,T) + .25*sin(T*1.7);
    for(int k=0;k<4;k++){ float fk = float(k); float x = p.x*(1.0+fk*.35) + fk*1.7 + T*(.08 + fk*.03); float yc = -.06 + fk*.08 + .26*fbm(vec3(x*.55, fk, T*.18)) + .09*sin(x*2.1 + T*1.1 + fk*2.);
      float d = p.y - yc; float fold = .5 + .5*sin(x*14. + T*2.4 + fbm(vec3(x*3.,fk,T*.4))*6.); float streak = (.35 + .65*pow(n3(vec3(x*42., fk*7., T*1.4)),2.))*(.6 + .6*fold);
      float band = smoothstep(-.015,.012,d)*exp(-max(d,0.)*(3.6-fk*.4))*streak; vec3 cg = mix(vec3(.1,1.,.5), vec3(.95,.2,.75), smoothstep(.02,.42,d)); cg = mix(cg, vec3(.3,.6,1.), smoothstep(.3,.6,d)*.5);
      c += cg*band*(.7-fk*.12)*w*1.9*surge; }
    return c; }
  float mtn(float x){ return -.2 + .1*fbm(vec3(x*2.,0.,0.)) + .07*abs(sin(x*1.3+.4)); }
  void main(){ vec2 p = (uv*R - .5*R)/R.y; p.y += .12 - .1*smoothstep(0.,8.,T); p *= 1. - .05*T/8.; vec3 col; float m = mtn(p.x); float lake = -.29;
    if(p.y > m) col = sky(p); else if(p.y > lake) { col = vec3(.02,.03,.05) + vec3(.6,.7,.8)*smoothstep(m-.03,m,p.y)*.1*smoothstep(.0,.6,fbm(vec3(p*20.,0.)));}
    else { vec2 q = vec2(p.x + .005*sin(p.y*140.+T*3.), 2.*lake - p.y); float mm = mtn(q.x); col = (q.y > mm ? sky(q) : vec3(.02,.03,.05))*.6; col *= .8 + .2*sin(p.y*320.+T*2.); }
    col = 1. - exp(-col*1.5); o = vec4(pow(col,vec3(.9)),1.); }`, () => grain(X, .05));
