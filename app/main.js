const REAL = 6, SPEED = SDUR / REAL, IN = 4, OUT = 3;
const DURS = SCENES.map(S => S.dur || REAL); const STS = []; { let a = 0; DURS.forEach(d => { STS.push(a); a += d; }); } const BODY = DURS.reduce((a, b) => a + b, 0);
window.TOTAL = IN + BODY + OUT; window.SCENE_TIMES = () => ({ intro: IN, outro: OUT, total: IN + BODY + OUT, cut: typeof ICUT !== 'undefined' ? ICUT : .19, scenes: SCENES.map((S, i) => ({ key: S.key, start: IN + STS[i], dur: DURS[i], sfx: S.sfx || [] })) });
window.render = function (gt) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; X.letterSpacing = '0px'; gl.viewport(0, 0, W, H);
  if (gt < IN) { intro(gt); return 'INTRO'; }
  const st = gt - IN; if (st >= BODY) { outro(st - BODY); return 'OUTRO'; }
  let i = 0; while (i < SCENES.length - 1 && st >= STS[i + 1]) i++; const S = SCENES[i]; const lt = (st - STS[i]) * SDUR / DURS[i];
  S.render(lt); panel(S, lt); chrome(S, st, lt); gl.finish(); return S.key; };
window.renderArt = function (i, lt) { X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; gl.viewport(0, 0, W, H); SCENES[i].render(lt); gl.finish(); return SCENES[i].key; };
window.renderFast = function (i, st, real) { X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; X.letterSpacing = '0px'; gl.viewport(0, 0, W, H);
  const S = SCENES[i]; const lt = st * SDUR / real; S.render(lt); panel(S, lt); chrome(S, IN + i * REAL + st, lt); gl.finish(); return S.key; };
