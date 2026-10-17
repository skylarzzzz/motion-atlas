// ---------- film chrome: split text panel + global HUD ----------
const SCENES = [];
const SDUR = 8;
const easeO = x => 1 - Math.pow(1 - clamp01(x), 3), easeIO = x => { x = clamp01(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
function wrapCJK(c, text, maxW) { const NO = '，。、；：！？」）》,.;:!?'; const lines = []; let cur = ''; for (const ch of text) { if (c.measureText(cur + ch).width > maxW && cur && !NO.includes(ch)) { lines.push(cur); cur = ch; } else cur += ch; } if (cur) lines.push(cur); return lines; }
function panel(S, lt) {
  const c = X, dark = S.theme !== 'light'; const ink = dark ? '242,239,232' : '20,20,20'; const acc = S.accent || (dark ? '255,92,64' : '228,52,30');
  const x0 = S.side === 'L' ? 128 : W - 128 - 600, yTop = S.panelY || 330; const out = 1 - easeIO((lt - ((S.pout || SDUR) - .45)) / .4);
  const k = (i) => easeO((lt - .25 - i * .09) / .7) * out;
  if (S.scrim) { const g = X.createLinearGradient(0, 0, 1000, 0); g.addColorStop(0, `rgba(${S.scrim},.82)`); g.addColorStop(.62, `rgba(${S.scrim},.55)`); g.addColorStop(1, `rgba(${S.scrim},0)`); X.save(); X.globalAlpha = 1; X.fillStyle = g; X.fillRect(0, 0, 1000, H); X.restore(); }
  c.save(); c.textBaseline = 'alphabetic';
  // index line
  let a = k(0); c.globalAlpha = a; c.fillStyle = `rgb(${acc})`; font(c, '500', 15, F.mono); c.letterSpacing = '3px'; c.fillText(`${String(S.no).padStart(2, '0')} / ${SCENES.length}`, x0, yTop + (1 - a) * 20); c.fillStyle = `rgba(${ink},.55)`; c.fillText(S.tagline, x0 + 104, yTop + (1 - a) * 20); c.letterSpacing = '0px';
  // CN title with mask reveal
  a = k(1); c.save(); c.beginPath(); c.rect(x0 - 10, yTop + 18, 700, 140); c.clip(); c.globalAlpha = Math.min(1, a * 1.4); c.fillStyle = `rgb(${ink})`; font(c, '900', 116, F.serif); c.fillText(S.cn, x0 - 4, yTop + 150 + (1 - a) * 130); c.restore();
  a = k(2); c.globalAlpha = a; c.fillStyle = `rgba(${ink},.9)`; font(c, 'italic 400', 44, F.lora); c.fillText(S.en, x0, yTop + 214 + (1 - a) * 16);
  a = k(3); c.globalAlpha = 1 * out; c.fillStyle = `rgba(${ink},.35)`; c.fillRect(x0, yTop + 246, 520 * a, 1.5);
  a = k(4); c.globalAlpha = a; c.fillStyle = `rgba(${ink},.85)`; font(c, '400', 25, F.sans); const dl = wrapCJK(c, S.desc, 530); dl.forEach((l, i) => c.fillText(l, x0, yTop + 300 + i * 40 + (1 - a) * 14));
  let y = yTop + 300 + dl.length * 40 + 22; let px = x0; font(c, '500', 18, F.sans);
  (S.techs || []).forEach((tg, i) => { const b = k(5 + i * .6); const w = c.measureText(tg).width + 36; c.globalAlpha = b; c.strokeStyle = `rgba(${ink},.45)`; c.lineWidth = 1.4; c.beginPath(); c.roundRect(px, y + (1 - b) * 10, w, 40, 20); c.stroke(); c.fillStyle = `rgba(${ink},.88)`; c.fillText(tg, px + 18, y + 27 + (1 - b) * 10); px += w + 12; });
  y += 78; a = k(7); c.globalAlpha = out; c.fillStyle = `rgba(${ink},.18)`; c.fillRect(x0, y, 560 * a, 1);
  c.globalAlpha = k(7.5); font(c, '400', 18, F.sans); c.fillStyle = `rgba(${ink},.5)`; c.fillText('作品', x0, y + 46); font(c, '500', 22, F.inter); c.fillStyle = `rgba(${ink},.95)`; const wn = S.work || ''; c.fillText(wn, x0 + 56, y + 46); const ww = c.measureText(wn).width; font(c, '500', 21, F.sans); c.fillText(`「${S.workCn || ''}」`, x0 + 62 + ww, y + 46);
  S.pal.forEach((h, i) => { const b = k(8 + i * .3); c.globalAlpha = b; const x = x0 + i * 34; c.fillStyle = h; c.fillRect(x, y + 74, 24, 24); c.strokeStyle = `rgba(${ink},.2)`; c.lineWidth = 1; c.strokeRect(x + .5, y + 74.5, 23, 23); });
  c.restore(); }
function chrome(S, gt, lt) { const dark = S.theme !== 'light'; const ink = dark ? '242,239,232' : '20,20,20'; const c = X; c.save(); const m = 44, L = 26; c.strokeStyle = `rgba(${ink},.55)`; c.lineWidth = 1.6;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, a, b]) => { c.beginPath(); c.moveTo(x, y + b * L); c.lineTo(x, y); c.lineTo(x + a * L, y); c.stroke(); });
  font(c, '500', 15, F.mono); c.fillStyle = `rgba(${ink},.8)`; c.letterSpacing = '2px'; c.fillText('STYLE ATLAS II — DATA · SPACE · MATTER · COSMOS', 72, 84); c.fillStyle = `rgba(${ink},.45)`; font(c, '500', 13, F.mono); c.fillText(S.hudline || '', 72, 110);
  const f = Math.floor(gt * 30); c.textAlign = 'right'; font(c, '500', 15, F.mono); c.fillStyle = `rgba(${ink},.8)`; c.fillText(`TC 00:${String(Math.floor(gt / 60)).padStart(2, '0')}:${String(Math.floor(gt % 60)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`, W - 72, 84);
  c.fillText('1920×1080 · 30 FPS', W - 72, H - 84); c.textAlign = 'left'; c.letterSpacing = '0px';
  // 15-segment progress
  const NS = SCENES.length, x0 = 72, x1 = W - 340, sw = (x1 - x0) / NS; for (let i = 0; i < NS; i++) { const on = i + 1 === S.no; c.fillStyle = on ? `rgba(${ink},.95)` : `rgba(${ink},${i + 1 < S.no ? .45 : .16})`; const w = on ? (sw - 6) * clamp01(lt / SDUR) : sw - 6; c.fillRect(x0 + i * sw, H - 92, on ? sw - 6 : w, on ? 3 : 1.5); if (on) { c.fillStyle = `rgba(${ink},.3)`; } }
  c.restore(); }
