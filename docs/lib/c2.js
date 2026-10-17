// ===== C2 · soft-lit studio objects (ray-marched) =====
const LATHE = `float lathe(vec3 q, float h, float kind){ float r = length(q.xz); float y = q.y;
    float base = sdCyl(q - vec3(0.,.06,0.), .06, .34); base = min(base, sdCyl(q - vec3(0.,.15,0.), .03, .27));
    float t = clamp(y/h, 0., 1.); float rad = mix(.2, .09, pow(t,.7)); float body = max(r - rad, abs(y - h*.5) - h*.5)*.8;
    float collar = sdCyl(q - vec3(0.,h*.92,0.), .025, .16);
    float head = kind < .5 ? length(q - vec3(0.,h+.1,0.)) - .15 : kind < 1.5 ? sdTorus(q - vec3(0.,h+.08,0.), vec2(.13,.04)) : min(sdBox(q - vec3(0.,h+.22,0.), vec3(.035,.14,.035)), sdBox(q - vec3(0.,h+.25,0.), vec3(.11,.035,.035)));
    if(kind > .5 && kind < 1.5) head = min(head, length(q - vec3(0.,h+.17,0.)) - .06);
    if(kind > 1.5) head = min(head, sdCyl(q - vec3(0.,h+.04,0.), .05, .14));
    return min(min(base, smin(body, collar, .04)), head); }`;
// 国际象棋
rmStyle({ key: 'CHESS', cn: '残局', en: 'Endgame', cat: 'product', desc: '低机位贴着棋盘看一局残局，象牙白和乌木黑的棋子投下长影，一枚兵正被推向最后一格。' }, {
  pre: LATHE, map: `vec2 r = vec2(p.y, 0.);
    vec3 q = p - vec3(.5,0.,.5 + smoothstep(1.,3.5,T)*1.); r = U(r, vec2(lathe(q, .55, 0.), 1.));
    q = p - vec3(1.5,0.,2.5); r = U(r, vec2(lathe(q, 1.25, 2.), 2.));
    q = p - vec3(-.5,0.,3.5); r = U(r, vec2(lathe(q, 1.05, 1.), 1.));
    q = p - vec3(2.5,0.,.5); r = U(r, vec2(lathe(q, .55, 0.), 2.));
    q = p - vec3(-1.5,0.,1.5); r = U(r, vec2(lathe(q, 1.25, 2.), 1.));
    q = p - vec3(3.5,0.,3.5); r = U(r, vec2(lathe(q, .55, 0.), 2.));
    return r;`,
  pal: `if(id < .5){ float c = mod(floor(p.x)+floor(p.z), 2.); vec3 a = vec3(.82,.66,.45), b = vec3(.28,.15,.08); vec3 w = mix(a,b,c); w *= .88 + .12*sin(p.x*40. + 3.*sin(p.z*6.)); return (abs(p.x)<5. && abs(p.z-2.)<6.) ? w : vec3(.2,.17,.15); } return id < 1.5 ? vec3(.92,.88,.8) : vec3(.035,.035,.04);`,
  bg: `return mix(vec3(.16,.13,.11), vec3(.05,.04,.04), uv.y);`,
  ro: `vec3(-1.3, .8, -1.1)`, ta: `vec3(1.3, .45, 2.)`, fov: '1.5', sx: '.28', L: 'vec3(-.7,.55,.25)', key: '1.15', amb: '.22', spec: '.7', shin: '60.', fog: '.035', soft: '14.'
});
// 蘑菇
rmStyle({ key: 'MUSHROOMS', cn: '黏土蘑菇林', en: 'Clay mushrooms', cat: 'nature', desc: '一丛软陶捏的蘑菇从苔藓上冒出来，伞盖一朵朵撑开，珊瑚红配奶油白，像手作动画的布景。' }, {
  map: `vec2 r = vec2(p.y + .05*sin(p.x*3.)*sin(p.z*2.5), 0.);
    for(int i=0;i<7;i++){ float fi = float(i); vec3 c = vec3(-1. + fi*.55 + .3*sin(fi*3.1), 0., .6 + 1.4*fract(sin(fi*7.7)*43.)); float hh = .45 + .7*fract(sin(fi*5.3)*91.); float g = smoothstep(fi*.35, fi*.35 + 1.4, T); hh *= max(g,.05);
      vec3 q = p - c; float bend = .15*sin(fi); q.x -= bend*q.y*q.y;
      float stem = sdCap(q, vec3(0.), vec3(0.,hh,0.), .07 + .04*(1.-q.y/max(hh,.01)));
      vec3 cq = q - vec3(0.,hh,0.); float cr = (.25 + .2*fract(fi*.71))*(.3+.7*g); float cap = (length(cq/vec3(cr, cr*.75, cr)) - 1.)*cr*.7; cap = max(cap, -cq.y - .02);
      r = U(r, vec2(stem, 1.)); r = U(r, vec2(cap, 2. + mod(fi,2.))); }
    return r;`,
  pal: `if(id < .5) return mix(vec3(.32,.48,.24), vec3(.45,.58,.3), fbm(p*4.)); if(id < 1.5) return vec3(.95,.9,.8); float sp = smoothstep(.06,.04, length(fract(p.xz*7.)-.5)); return mix(id < 2.5 ? vec3(.92,.38,.3) : vec3(.95,.62,.35), vec3(.98,.95,.88), sp*step(.0,p.y-.3));`,
  bg: `return mix(vec3(.96,.86,.78), vec3(.84,.9,.88), uv.y);`,
  ro: `vec3(-2.6, 1.2, -2.2)`, ta: `vec3(.6, .45, 1.2)`, fov: '1.5', sx: '.3', key: '1.05', amb: '.4', spec: '.15', fog: '.03'
});
// 甜甜圈
rmStyle({ key: 'DONUTS', cn: '糖霜甜甜圈', en: 'Glazed donuts', cat: 'product', desc: '三个甜甜圈在粉色背景前慢慢翻转，糖霜边缘自然垂落，彩色糖针撒在上面，像一支甜品广告。' }, {
  map: `vec2 r = vec2(p.y + 1.2, 0.);
    for(int i=0;i<3;i++){ float fi = float(i); vec3 c = vec3(.4 + fi*1.1, -.2 + .25*sin(T*.8+fi*2.), 1. + fi*.8); vec3 q = p - c; q.yz *= rot(1.1 + .3*sin(T*.5+fi) + fi*.4); q.xy *= rot(.3*fi + T*.2);
      float d = sdTorus(q, vec2(.5,.24)); float ic = sdTorus(q, vec2(.5,.255)); float drip = .06*sin(atan(q.z,q.x)*7. + fi*3.) + .03*sin(atan(q.z,q.x)*17.); ic = max(ic, -(q.y - .0 + drip));
      r = U(r, vec2(d, 1.)); r = U(r, vec2(ic, 2. + fi)); }
    return r;`,
  pal: `if(id < .5) return vec3(.98,.78,.82); if(id < 1.5) return vec3(.86,.58,.32); vec3 ic = id < 2.5 ? vec3(.98,.55,.68) : id < 3.5 ? vec3(.35,.2,.14) : vec3(.97,.93,.86);
    vec3 g = floor(p*22.); float h = fract(sin(dot(g, vec3(12.9,78.2,37.7)))*43758.); vec3 f = fract(p*22.) - .5; if(h > .82 && length(f) < .3) { float k = fract(h*91.); ic = k < .25 ? vec3(.2,.6,1.) : k < .5 ? vec3(1.,.85,.2) : k < .75 ? vec3(.3,.85,.5) : vec3(1.,1.,1.); } return ic;`,
  bg: `return mix(vec3(1.,.8,.84), vec3(.98,.68,.75), uv.y);`,
  ro: `vec3(-.5, 1.3, -1.7)`, ta: `vec3(1.3, .15, 1.7)`, fov: '1.55', sx: '.3', key: '1.0', amb: '.45', spec: '.55', shin: '50.', fog: '.0'
});
// 书堆
rmStyle({ key: 'BOOKS', cn: '书堆', en: 'Book stacks', cat: 'product', desc: '几摞精装书高低错落地叠着，布面书脊是赭石、墨绿和牛津蓝，书页的切口在侧光里泛着暖白。' }, {
  map: `vec2 r = vec2(p.y, 0.);
    for(int s=0;s<3;s++){ float fs = float(s); vec3 base = vec3(-.4 + fs*1.25, 0., .7 + fs*.65); float y = 0.; float bb = sdBox(p - base - vec3(0.,.8,0.), vec3(.8,.85,.65)); if(bb > .15){ r = U(r, vec2(bb, 1.)); continue; }
      for(int i=0;i<7;i++){ float fi = float(i) + fs*7.; float th = .1 + .07*fract(sin(fi*7.3)*31.); if(float(i) > 3. + fs*1.5) break; vec3 q = p - base - vec3(.05*sin(fi*2.7), y + th*.5, 0.); q.xz *= rot(.25*sin(fi*1.9));
        float w = .45 + .12*fract(sin(fi*3.1)*17.), d = .32 + .06*fract(sin(fi*5.1)*13.); r = U(r, vec2(sdRBox(q, vec3(w, th*.5, d), .012), 1. + fi)); y += th; } }
    vec3 q = p - vec3(3.,0.,1.8); q.xy *= rot(-.25); r = U(r, vec2(sdRBox(q - vec3(0.,.55,0.), vec3(.08,.55,.38), .01), 30.));
    return r;`,
  pal: `if(id < .5) return vec3(.9,.86,.8); float k = mod(id*5.37, 6.); vec3 c = k<1. ? vec3(.78,.38,.2) : k<2. ? vec3(.16,.42,.33) : k<3. ? vec3(.2,.3,.58) : k<4. ? vec3(.9,.82,.62) : k<5. ? vec3(.72,.2,.18) : vec3(.95,.72,.3);
    float fy = fract(p.y*9.); return c;`,
  bg: `return mix(vec3(.93,.9,.85), vec3(.86,.84,.8), uv.y);`,
  ro: `vec3(-1.1, 1.05, -1.6)`, ta: `vec3(1.3, .4, 1.6)`, fov: '1.5', sx: '.28', L: 'vec3(-.8,.6,.3)', key: '1.1', amb: '.45', spec: '.12', fog: '.0', soft: '12.'
});
// 梯田泳池
rmStyle({ key: 'TERRACE', cn: '粉色梯池', en: 'Terrace pools', cat: 'space', desc: '一圈圈环形水池像梯田一样往下叠，粉色池壁、绿松石的水面，像建筑杂志里的度假村航拍。' }, {
  map: `vec3 q = p - vec3(1.4,0.,2.2); float rr = length(q.xz); vec2 r = vec2(1e3,0.);
    for(int i=0;i<6;i++){ float fi = float(i); float R0 = .55 + fi*.62; float kk = clamp((T - .1 - (5.-fi)*.2)/.75,0.,1.); float top = mix(-3.2, -fi*.3, 1.+2.70158*(kk-1.)*(kk-1.)*(kk-1.)+1.70158*(kk-1.)*(kk-1.)); float lvl = max(rr - R0, q.y - top); r = U(r, vec2(lvl*.9, 1.));
      float pool = max(max(abs(rr - (R0 - .3)) - .2, abs(q.y - top) - .06), -9.); r.x = max(r.x, -pool); }
    float wl = 1e3; for(int i=0;i<6;i++){ float fi = float(i); float R0 = .55 + fi*.62; float kk = clamp((T - .1 - (5.-fi)*.2)/.75,0.,1.); float top = mix(-3.2, -fi*.3, 1.+2.70158*(kk-1.)*(kk-1.)*(kk-1.)+1.70158*(kk-1.)*(kk-1.)); float w = max(abs(rr - (R0 - .3)) - .2, q.y - top + .035 + .004*sin(rr*30.-T*3.)); w = max(w, -(q.y - top + .07)); wl = min(wl, w); }
    r = U(r, vec2(wl, 2.)); r = U(r, vec2(p.y + 2.2, 0.)); return r;`,
  pal: `if(id < .5) return vec3(.92,.74,.66); if(id < 1.5) return mix(vec3(.97,.7,.64), vec3(.99,.84,.76), step(.5, fract(length(p.xz - vec2(1.4,2.2))*.0)) ); return vec3(.25,.8,.8);`,
  bg: `return mix(vec3(.98,.86,.78), vec3(.8,.88,.95), uv.y);`,
  ro: `vec3(1.4 + 5.2*cos(-2.3 + T*.13), 4.9 - T*.12, 2.2 + 5.2*sin(-2.3 + T*.13))`, ta: `vec3(1.4, -.7, 2.2)`, fov: '1.45', sx: '.55', L: 'vec3(-.6,.8,.2)', key: '1.0', amb: '.42', spec: '.8', shin: '80.', fog: '.0'
});
// 珍珠项链
rmStyle({ key: 'PEARLS', cn: '珍珠项链', en: 'Strand of pearls', cat: 'product', desc: '一串南洋珍珠蜿蜒地躺在香槟色缎面上，每颗珠子都有自己的晕彩，光沿着珠串一颗颗滑过。' }, {
  map: `vec2 r = vec2(p.y - .05*sin(p.x*1.1+p.z*1.4), 0.); float sp = .33;
    float i0 = floor(p.x/sp); for(int k=-1;k<=2;k++){ float i = i0 + float(k); float x = i*sp; if(x < -1. || x > 4.) continue; vec3 c = vec3(x, .16 + .05*sin(x*1.1+(1.5 + .7*sin(x*1.3))*1.4), 1.5 + .7*sin(x*1.3) + .25*sin(x*2.9)); r = U(r, vec2((length(p - c) - .16)*.85, 1. + mod(i,3.))); }
    return r;`,
  pal: `if(id < .5) return vec3(.82,.7,.58)*(.92 + .08*sin(p.x*4.+p.z*6.)); vec3 n = normalize(p - vec3(round(p.x/.33)*.33, .16, p.z)); return vec3(.95,.92,.88) + .08*vec3(sin(n.x*6.+id), sin(n.y*6.+id*2.), sin(n.z*6.+1.));`,
  bg: `return vec3(.86,.76,.62);`,
  ro: `vec3(-.3, 1.05, -.2)`, ta: `vec3(1.6, 0., 1.7)`, fov: '1.45', sx: '.25', L: 'vec3(-.5,.7,.4)', key: '1.05', amb: '.4', spec: '1.1', shin: '90.', fog: '.0'
});
// 多肉
rmStyle({ key: 'SUCCULENT', cn: '多肉莲座', en: 'Succulent rosette', cat: 'nature', desc: '一株多肉按黄金角一片片长出叶子，莲座从中心向外打开，粉绿的叶尖带着一点胭脂红。' }, {
  map: `vec3 q = p - vec3(1.,0.,1.); vec2 r = vec2(p.y + .25, 0.); r = U(r, vec2(sdCyl(q - vec3(0.,-.1,0.), .15, .9)*.9, 2.));
    float grow = smoothstep(0., 5., T); float bd = length(q - vec3(0.,.3,0.)) - 1.2; if(bd > .3) return U(r, vec2(bd, 1.));
    for(int i=0;i<30;i++){ float fi = float(i); if(fi > 6. + grow*24.) break; float a = fi*2.39996; float k = fi/30.; float L = .25 + .7*sqrt(k); float tilt = .25 + 1.15*k;
      vec3 lq = q; lq.xz *= rot(a); lq.y -= .05; lq.xy *= rot(-tilt); lq.y -= L*.5; vec3 rad = vec3(.07 + .08*k, L*.55, .11 + .12*k); float leaf = (length(lq/rad) - 1.)*min(rad.x, min(rad.y, rad.z));
      r = U(r, vec2(leaf*.8, 1.)); }
    return r;`,
  pal: `if(id < .5) return vec3(.9,.84,.78); if(id > 1.5) return vec3(.78,.5,.38); float h = length(p.xz - vec2(1.)); return mix(vec3(.55,.72,.62), vec3(.85,.42,.48), smoothstep(.5,1.,h)*smoothstep(.0,.3,p.y));`,
  bg: `return mix(vec3(.93,.88,.83), vec3(.86,.84,.88), uv.y);`,
  ro: `vec3(-.4, 2.2, -1.2)`, ta: `vec3(1.05, .3, 1.)`, fov: '1.55', sx: '.3', key: '1.05', amb: '.4', spec: '.3', fog: '.0'
});
// 骰子
rmStyle({ key: 'DICE', cn: '骰子', en: 'Rolling dice', cat: 'product', desc: '几颗圆角骰子在毛毡桌面上翻滚，象牙白配一颗樱桃红，点数朝上的那一刻停住。' }, {
  map: `vec2 r = vec2(p.y, 0.);
    for(int i=0;i<4;i++){ float fi = float(i); float k = smoothstep(fi*.3, 2.5 + fi*.3, T); vec3 c = vec3(-.4 + fi*.95, .32 + .5*abs(sin(k*9.42))*(1.-k), .8 + fi*.55 + (1.-k)*1.5); vec3 q = p - c; q.xy *= rot((1.-k)*6. + fi); q.yz *= rot((1.-k)*4. + fi*.7); r = U(r, vec2(sdRBox(q, vec3(.32), .07), 1. + fi)); }
    return r;`,
  pal: `if(id < .5) return mix(vec3(.08,.32,.22), vec3(.1,.38,.26), fbm(p*20.));
    float fi = id - 1.; float k = smoothstep(fi*.3, 2.5 + fi*.3, T); vec3 c = vec3(-.4 + fi*.95, .32 + .5*abs(sin(k*9.42))*(1.-k), .8 + fi*.55 + (1.-k)*1.5); vec3 q = p - c; q.xy *= rot((1.-k)*6. + fi); q.yz *= rot((1.-k)*4. + fi*.7);
    vec3 a = abs(q); vec2 f = a.x > a.y && a.x > a.z ? q.yz : a.y > a.z ? q.xz : q.xy; float face = a.x > a.y && a.x > a.z ? (q.x>0.?3.:4.) : a.y > a.z ? (q.y>0.?1.:6.) : (q.z>0.?2.:5.);
    float pip = 9.; vec2 P1 = vec2(0.), P2 = vec2(.17); if(mod(face,2.) == 1.) pip = min(pip, length(f)); if(face > 1.5) { pip = min(pip, length(f - P2)); pip = min(pip, length(f + P2)); } if(face > 3.5){ pip = min(pip, length(f - vec2(.17,-.17))); pip = min(pip, length(f + vec2(.17,-.17))); } if(face > 5.5){ pip = min(pip, length(f - vec2(.17,0.))); pip = min(pip, length(f + vec2(.17,0.))); }
    vec3 body = fi > 2.5 ? vec3(.75,.08,.12) : vec3(.95,.93,.88); vec3 pc = fi > 2.5 ? vec3(.98) : (face == 1. ? vec3(.8,.1,.1) : vec3(.05)); return mix(body, pc, smoothstep(.065,.055,pip));`,
  bg: `return vec3(.06,.25,.17);`,
  ro: `vec3(-1.5, 2.1, -1.9)`, ta: `vec3(1.2, .2, 1.6)`, fov: '1.5', sx: '.28', L: 'vec3(-.5,.8,.3)', key: '1.0', amb: '.35', spec: '.6', shin: '70.', fog: '.0'
});
// 浮空岛
rmStyle({ key: 'ISLANDS', cn: '浮空岛', en: 'Floating isles', cat: 'nature', desc: '几座长着草和小树的岛浮在粉橙色的天空里，底部是倒锥形的岩层，轻轻上下漂浮。' }, {
  map: `vec2 r = vec2(1e3, 0.);
    for(int i=0;i<4;i++){ float fi = float(i); vec3 c = vec3(-.3 + fi*1.25 + mod(fi,2.)*.9, .25*sin(T*.8 + fi*1.7) + .35*sin(fi*2.4) - .2, 1. + fi*1.5); float s = 1.15 - fi*.12; vec3 q = (p - c)/s;
      float top = sdCyl(q, .08, .8 + .05*sin(atan(q.z,q.x)*5.)); float rock = max(length(q.xz) - .8*clamp(1. + q.y*.9, 0., 1.) + .06*sin(q.y*14.+atan(q.z,q.x)*6.), max(q.y - .02, -q.y - 1.1));
      float tr = sdCap(q, vec3(.15,.05,.1), vec3(.15,.35,.1), .035); float crown = length(q - vec3(.15,.48,.1)) - .2; crown = min(crown, length(q - vec3(-.3,.25,-.25)) - .13);
      r = U(r, vec2(rock*s*.8, 1.)); r = U(r, vec2(top*s, 2.)); r = U(r, vec2(tr*s, 3.)); r = U(r, vec2(crown*s, 4.)); }
    return r;`,
  pal: `if(id < 1.5) return mix(vec3(.62,.46,.38), vec3(.45,.32,.3), smoothstep(-.6,.0,sin(p.y*20.))); if(id < 2.5) return vec3(.45,.7,.35); if(id < 3.5) return vec3(.45,.3,.2); return vec3(.3,.58,.32);`,
  bg: `return mix(vec3(.99,.72,.55), vec3(.68,.72,.92), smoothstep(.0,1.,uv.y));`,
  ro: `vec3(-2.2, .7, -2.6)`, ta: `vec3(1.7, .2, 2.4)`, fov: '1.45', sx: '.3', L: 'vec3(-.6,.6,.3)', key: '1.0', amb: '.45', spec: '.1', fog: '.03'
});
// 玻璃弹珠
shaderStyle({ key: 'MARBLES', cn: '玻璃弹珠', en: 'Glass marbles', cat: 'material', desc: '几颗玻璃弹珠在桌面上滚过，透明的球体里封着彩色的旋带，地上落着被球聚焦出来的焦散光斑。' }, `in vec2 uv; out vec4 o;
  vec4 sph(int i){ float fi = float(i); float x = -1.1 + fi*.72 + .3*sin(T*.3+fi); return vec4(x, .38 + .05*sin(fi*3.), 1.2 + fi*.7 + .2*sin(fi*2.), .38 + .05*sin(fi*3.)); }
  vec3 core(vec3 q, float fi){ q.xz *= rot(T*.5 + fi*1.3); float tw = q.y*2.6 + fi; float band = smoothstep(.16,.02, abs(q.z*cos(tw) - q.x*sin(tw)))*smoothstep(.8,.6,length(q))*smoothstep(.35,.0,abs(q.z*sin(tw)+q.x*cos(tw))-.25); vec3 c = fi < 1. ? vec3(1.,.35,.2) : fi < 2. ? vec3(.2,.55,1.) : fi < 3. ? vec3(1.,.8,.2) : vec3(.2,.9,.6); return c*band; }
  vec3 floorc(vec3 p){ vec3 c = mix(vec3(.9,.88,.84), vec3(.8,.78,.74), smoothstep(.0,.06,fract(p.x)) * smoothstep(.0,.06,fract(p.z))*0.); c *= .94 + .06*fbm(vec3(p.xz*6.,0.)); vec3 L = normalize(vec3(-.5,.8,.4));
    for(int i=0;i<4;i++){ vec4 s = sph(i); vec3 sp = s.xyz - L*(s.y/L.y); vec2 d = p.xz - sp.xz; float dd = length(d*vec2(1.,.7)); c *= 1. - .45*smoothstep(s.w*1.15, s.w*.6, dd); c += core(vec3(0.,0.,0.), float(i))*.0 + (i==0? vec3(1.,.5,.3) : i==1? vec3(.3,.6,1.) : i==2? vec3(1.,.85,.3) : vec3(.3,1.,.7))*.6*smoothstep(s.w*.45, 0., length(p.xz - sp.xz - vec2(-.05,.12)*s.w*2.)); } return c; }
  void main(){ vec2 sp = (uv*R - .5*R)/R.y; sp.x -= .28; vec3 ro = vec3(-1.4,1.6,-.9), ta = vec3(.2,.1,2.); vec3 f = normalize(ta-ro), r = normalize(cross(f,vec3(0.,1.,0.))), u = cross(r,f); vec3 rd = normalize(sp.x*r + sp.y*u + 1.5*f);
    float tf = -ro.y/rd.y; vec3 col = tf > 0. ? floorc(ro + rd*tf) : vec3(.9); col = mix(col, vec3(.92,.9,.88), 1. - exp(-tf*.05)); float best = 1e9;
    for(int i=0;i<4;i++){ vec4 s = sph(i); vec3 oc = ro - s.xyz; float b = dot(oc,rd), c = dot(oc,oc) - s.w*s.w; float h = b*b - c; if(h < 0.) continue; float t = -b - sqrt(h); if(t < 0. || t > best) continue; best = t;
      vec3 p = ro + rd*t, n = normalize(p - s.xyz); vec3 rr = refract(rd, n, 1./1.5); vec3 acc = vec3(0.); float ab = 0.; for(int k=0;k<64;k++){ vec3 q = p + rr*(float(k)/64.)*s.w*2. - s.xyz; if(length(q) > s.w) break; vec3 cc = core(q/s.w, float(i)); float m = max(cc.r,max(cc.g,cc.b)); if(m > ab){ ab = m; acc = cc; } }
      vec3 o2 = p - s.xyz; float b2 = dot(o2, rr); float t2 = -b2 + sqrt(max(b2*b2 - dot(o2,o2) + s.w*s.w, 0.)); vec3 pe = p + rr*t2; vec3 re = refract(rr, -normalize(pe - s.xyz), 1.5); if(dot(re,re) < .01) re = reflect(rr, -normalize(pe-s.xyz)); float tf2 = -pe.y/re.y; vec3 behind = (tf2 > 0. ? floorc(pe + re*tf2) : mix(vec3(.92,.9,.88), vec3(.75,.8,.9), re.y));
      float fr = .04 + .96*pow(1. - max(dot(-rd,n),0.), 5.); vec3 refl = mix(vec3(.95,.93,.9), vec3(.6,.7,.85), clamp(reflect(rd,n).y,0.,1.)); col = mix(mix(behind*vec3(.92,.97,.95), acc*1.1, ab*.9), refl, fr); col += pow(max(dot(reflect(rd,n), normalize(vec3(-.5,.8,.4))),0.), 120.)*1.5; }
    o = vec4(pow(col, vec3(.95)),1.); }`, () => grain(X, .04, 'multiply'));
