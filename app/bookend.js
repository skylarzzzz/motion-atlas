// ---------- intro / outro ----------
const ICUT = .19, INCUT = 2.85; let IC2 = null;
function intro(t) { // t in seconds 0..4 : rapid montage of all styles, then title over a live mosaic
  const ink = '242,239,232'; const N = SCENES.length;
  if (t < INCUT) { const k = Math.min(N - 1, Math.floor(t / ICUT)); const lc = t - k * ICUT; const S = SCENES[k];
    S.render(2.6 + lc * 9); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
    if (!IC2) { IC2 = document.createElement('canvas'); IC2.width = W; IC2.height = H; } const c2 = IC2.getContext('2d'); c2.drawImage(X.canvas, 0, 0);
    const z = 1.12 - .12 * easeO(lc / ICUT); X.drawImage(IC2, (W - W * z) * .62, (H - H * z) / 2, W * z, H * z);
    const fl = Math.max(0, 1 - lc / .07); if (fl > 0) { X.fillStyle = `rgba(255,255,255,${fl * .35})`; X.fillRect(0, 0, W, H); }
    const g = X.createLinearGradient(0, 0, 1100, 0); g.addColorStop(0, 'rgba(5,5,6,.78)'); g.addColorStop(1, 'rgba(5,5,6,0)'); X.fillStyle = g; X.fillRect(0, 0, 1100, H);
    font(X, '500', 16, F.mono); X.letterSpacing = '4px'; X.fillStyle = 'rgba(255,92,64,1)'; X.fillText(String(k + 1).padStart(2, '0'), 128, 300); X.fillStyle = `rgba(${ink},.55)`; X.fillText(`/ ${N}   ${S.tagline}`, 168, 300); X.letterSpacing = '0px';
    for (let i = 0; i < N; i++) { X.fillStyle = i <= k ? 'rgba(255,92,64,.95)' : `rgba(${ink},.25)`; X.fillRect(128 + i * 44, 318, 36, 3); }
  } else { const u = t - INCUT; X.fillStyle = '#050506'; X.fillRect(0, 0, W, H); const cols = 5, gap = 10, cw = (W - gap * (cols + 1)) / cols, chh = cw * 9 / 16, gy = (H - (chh * 3 + gap * 2)) / 2;
    const zoom = 1.25 - .25 * easeO(u / .5);
    X.save(); X.translate(W / 2, H / 2); X.scale(zoom, zoom); X.translate(-W / 2, -H / 2);
    SCENES.forEach((S, i) => { const c = i % cols, r = Math.floor(i / cols); const im = THUMBS[i]; const a = easeO((u - (c + r) * .035) / .25); if (!im || !im.width || a <= 0) return; const x = gap + c * (cw + gap), y = gy + r * (chh + gap);
      X.globalAlpha = a * .5; X.drawImage(im, x, y + (1 - a) * 20, cw, chh); }); X.restore(); X.globalAlpha = 1;
    const g = X.createLinearGradient(0, 0, 1300, 0); g.addColorStop(0, 'rgba(5,5,6,.9)'); g.addColorStop(1, 'rgba(5,5,6,.15)'); X.fillStyle = g; X.fillRect(0, 0, W, H); }
  // persistent title block
  const k = i => easeO((t - .15 - i * .12) / .55); const x0 = 128;
  X.globalAlpha = k(0); font(X, '500', 16, F.mono); X.letterSpacing = '4px'; X.fillStyle = 'rgba(255,92,64,1)'; X.fillText('CLAUDE', x0, 380); X.fillStyle = `rgba(${ink},.6)`; X.fillText('MOTION STUDY · VOL.2', x0 + 120, 380); X.letterSpacing = '0px';
  X.save(); X.beginPath(); X.rect(x0 - 10, 400, 1100, 230); X.clip(); X.globalAlpha = 1; font(X, '200', 220, F.disp); X.letterSpacing = '-8px'; const word = 'Opus 5.5'; let cx = x0 - 8;
  for (let i = 0; i < word.length; i++) { const ch = word[i]; const kk = easeO((t - .2 - i * .05) / .55); X.fillStyle = ch === '.' ? 'rgb(255,92,64)' : `rgb(${ink})`; X.fillText(ch, cx, 598 + (1 - kk) * 220); cx += X.measureText(ch).width - 8; } X.restore(); X.letterSpacing = '0px';
  X.globalAlpha = k(3); font(X, '900', 64, F.serif); X.fillStyle = `rgb(${ink})`; X.fillText('能做到的商用级动效 · 第二弹', x0, 720 + (1 - k(3)) * 20);
  X.globalAlpha = k(4); font(X, '500', 15, F.mono); X.letterSpacing = '3px'; X.fillStyle = `rgba(${ink},.6)`; X.fillText(`VOL.2 · ${SCENES.length} MORE MOTION STYLES · ALL CODE-GENERATED`, x0, 770); X.letterSpacing = '0px'; X.globalAlpha = 1;
  const out = easeIO((t - 3.75) / .25); if (out > 0) { X.fillStyle = `rgba(5,5,6,${out})`; X.fillRect(0, 0, W, H); }
  grain(X, .05); }
const THUMBS = []; const TCX = Array(15).fill(.66);
window.ready = window.ready.then(() => Promise.all(Array.from({ length: SCENES.length }, (_, i) => new Promise(res => { const im = new Image(); im.onload = res; im.onerror = res; im.src = `thumbs/t${String(i).padStart(2, '0')}.jpg`; THUMBS[i] = im; }))));
function outro(t) {
  X.fillStyle = '#0A0A0B'; X.fillRect(0, 0, W, H); const ink = '242,239,232'; const gx = 128, gy = 168, gap = 16, cw = (1664 - gap * 4) / 5, chh = cw * 9 / 16, rowH = chh + 50;
  SCENES.forEach((S, i) => { const c = i % 5, r = Math.floor(i / 5); const a = easeO((t - .05 - (c + r) * .07) / .45); if (a <= 0) return; const x = gx + c * (cw + gap), y = gy + r * rowH; const im = THUMBS[i];
    X.save(); X.globalAlpha = a; X.beginPath(); X.rect(x, y + (1 - a) * 24, cw, chh); X.clip();
    if (im && im.width) { const z = .72 / (1 + .06 * (1 - a) + .03 * t / 3); const sw = im.width * z, sh = im.height * z; const sx = Math.min(im.width - sw, Math.max(0, im.width * TCX[i] - sw / 2)), sy = (im.height - sh) / 2; X.drawImage(im, sx, sy, sw, sh, x, y + (1 - a) * 24, cw, chh); }
    X.restore(); X.save(); X.globalAlpha = a; font(X, '500', 13, F.mono); X.fillStyle = 'rgba(255,92,64,1)'; X.fillText(String(i + 1).padStart(2, '0'), x, y + chh + 30); font(X, '500', 19, F.sans); X.fillStyle = `rgba(${ink},.9)`; X.fillText(S.cn, x + 32, y + chh + 31); X.restore(); });
  const k = easeO((t - 1.0) / .6); X.globalAlpha = k; const ty = gy + rowH * 3 + 70; font(X, '200', 76, F.disp); X.letterSpacing = '-2px'; X.fillStyle = `rgb(${ink})`; X.fillText('Made with Claude Opus 5.5', gx - 3, ty + (1 - k) * 16); X.letterSpacing = '0px';
  font(X, '400', 22, F.sans); X.fillStyle = `rgba(${ink},.6)`; X.textAlign = 'right'; X.fillText('15 种风格 · 全部由代码实时生成，没有一帧素材', gx + 1664, ty - 4); X.textAlign = 'left'; X.globalAlpha = 1;
  grain(X, .05); }
