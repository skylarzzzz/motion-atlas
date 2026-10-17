(() => {
// ================= 12–14 =================
// ---- 12 R 等轴微缩 ----
(() => {
  const S = 42, OX = 650, OY = 120;
  const iso = (x, y, z) => [OX + (x - y) * S * .866, OY + (x + y) * S * .5 - z * S];
  function box(c, x, y, z, w, d, h, top, left, right) { if (h <= 0.001) return;
    const p = (a, b, cc) => iso(a, b, cc); const A = p(x, y, z + h), B = p(x + w, y, z + h), Cc = p(x + w, y + d, z + h), D = p(x, y + d, z + h), E = p(x + w, y + d, z), Fp = p(x, y + d, z), G = p(x + w, y, z);
    c.beginPath(); c.moveTo(...D); c.lineTo(...Cc); c.lineTo(...E); c.lineTo(...Fp); c.closePath(); c.fillStyle = left; c.fill();
    c.beginPath(); c.moveTo(...B); c.lineTo(...Cc); c.lineTo(...E); c.lineTo(...G); c.closePath(); c.fillStyle = right; c.fill();
    c.beginPath(); c.moveTo(...A); c.lineTo(...B); c.lineTo(...Cc); c.lineTo(...D); c.closePath(); c.fillStyle = top; c.fill();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = .8; c.beginPath(); c.moveTo(...D); c.lineTo(...A); c.lineTo(...B); c.stroke(); }
  function cyl(c, x, y, z, r, h, top, side) { if (h <= .01) return; const [cx, cy] = iso(x, y, z), [tx, ty] = iso(x, y, z + h); const rx = r * S * 1.22, ry = r * S * .7;
    const g = c.createLinearGradient(cx - rx, 0, cx + rx, 0); g.addColorStop(0, side[0]); g.addColorStop(1, side[1]); c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI); c.lineTo(tx - rx, ty); c.ellipse(tx, ty, rx, ry, 0, Math.PI, 0, true); c.closePath(); c.fill();
    c.fillStyle = top; c.beginPath(); c.ellipse(tx, ty, rx, ry, 0, 0, 7); c.fill(); }
  function shadow(c, x, y, w, d, a = .18) { const [sx, sy] = iso(x + w / 2 + .25, y + d / 2 + .25, 0); const g = c.createRadialGradient(sx, sy, 0, sx, sy, (w + d) * S * .5); g.addColorStop(0, `rgba(60,50,120,${a})`); g.addColorStop(1, 'rgba(60,50,120,0)'); c.fillStyle = g; c.save(); c.translate(sx, sy); c.scale(1, .52); c.translate(-sx, -sy); c.beginPath(); c.arc(sx, sy, (w + d) * S * .5, 0, 7); c.fill(); c.restore(); }
  SCENES.push({ key: 'R', no: 12, cn: '等轴微缩', en: 'Micro fab', tagline: 'ISOMETRIC MINIATURE', side: 'L', theme: 'light', accent: '107,95,211', hudline: 'GRID 12 × 12   ISO 30°   DIE 5 NM',
    desc: '一座桌面大小的芯片工厂，地砖一块块弹起铺满，厂房从地面升起，传送带开始运转。', tags: ['地砖从一角依次弹起铺满', '厂房和筒仓从地面升起', '传送带运转，芯片亮起紫光'], pal: ['#F3F1FA', '#D8D2EE', '#9A8BDB', '#7FD8B5', '#FFC66B'],
    render(lt) { const bg = X.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#F3F1FA'); bg.addColorStop(1, '#D8D2EE'); X.fillStyle = bg; X.fillRect(0, 0, W, H); const t = lt;
      legacy2D(250, 30, () => { const N = 12; const sb = easeO(t / .5);
        box(X, 0, 0, -1.1 - (1 - sb) * 2, N, N, .8, '#E9E5F6', '#B9AEE6', '#9A8BDB');
        for (let s = 0; s < N + N; s++) for (let x = 0; x < N; x++) { const y = s - x; if (y < 0 || y >= N) continue; const ta = .2 + (x + y) * .05; const b = easeO((t - ta) / .35); if (b <= 0) continue; const hole = (x >= 5 && x <= 6 && y >= 5 && y <= 6); const lift = hole ? -.35 * easeO((t - 2) / .5) : 0;
          box(X, x + .06, y + .06, -.3 + lift + (1 - b) * 1.6, .88, .88, .3, hole ? '#2B2A6B' : '#F7F6FC', hole ? '#1D1C50' : '#DCD6F2', hole ? '#16153D' : '#C9C1EC'); }
        const rise = k => easeO((t - 1.6 - k * .15) / .6); const run = Math.max(0, t - 3);
        for (let k = 0; k < 9; k++) { box(X, 1 + k, 9.2, 0, 1, .7, .18 * rise(0), '#3C3A73', '#2C2A5E', '#24224F'); if (k % 2 === 0 && t > 3) box(X, 1.2 + k + (run * .8 % 1), 9.35, .18, .4, .4, .3, '#FFC66B', '#E8A84B', '#D6923A'); }
        for (let k = 0; k < 7; k++) { box(X, 9.2, 2 + k, 0, .7, 1, .18 * rise(0), '#3C3A73', '#2C2A5E', '#24224F'); if (k % 2 && t > 3) box(X, 9.35, 2.2 + k + (run * .8 % 1), .18, .4, .4, .3, '#7FD8B5', '#5FBF99', '#4CA884'); }
        [[2, 2], [3.3, 2], [2, 3.3]].forEach(([x, y], i) => { shadow(X, x - .5, y - .5, 1, 1); cyl(X, x, y, 0, .5, 1.8 * rise(i + 1), '#FFFFFF', ['#F2F0FA', '#C8C0EA']); });
        shadow(X, 6.5, 1.5, 2.5, 2.2, .25); box(X, 6.5, 1.5, 0, 2.5, 2.2, 1.4 * rise(2), '#FFFFFF', '#E2DCF5', '#CEC5EE');
        if (rise(2) > .95) for (let k = 0; k < 4; k++) { const [wx, wy] = iso(6.6 + k * .55, 3.7, .6); X.fillStyle = `rgba(107,95,211,${.35 + .3 * (Math.sin(t * 4 + k) > 0)})`; X.fillRect(wx - 6, wy - 10, 10, 14); }
        box(X, 7, 2, 1.4 * rise(2), .9, .9, .5 * rise(3), '#7FD8B5', '#5FBF99', '#4CA884');
        const ch = easeO((t - 3.4) / .6); const [cx, cy] = iso(6, 6, -.05);
        if (ch > 0) { X.save(); X.translate(cx, cy - (1 - ch) * 40); X.scale(1, .577); X.rotate(Math.PI / 4); const cg = X.createLinearGradient(-40, -40, 40, 40); cg.addColorStop(0, '#8E7BFF'); cg.addColorStop(1, '#4C3FD0'); X.fillStyle = cg; X.fillRect(-34, -34, 68, 68); X.fillStyle = '#E8C46B'; for (let k = 0; k < 8; k++) { X.fillRect(-30 + k * 8, -42, 3, 8); X.fillRect(-30 + k * 8, 34, 3, 8); X.fillRect(-42, -30 + k * 8, 8, 3); X.fillRect(34, -30 + k * 8, 8, 3); } X.restore();
          const ga = .3 + .25 * Math.sin(t * 5); const glow = X.createRadialGradient(cx, cy, 5, cx, cy, 110); glow.addColorStop(0, `rgba(142,123,255,${ga})`); glow.addColorStop(1, 'rgba(142,123,255,0)'); X.fillStyle = glow; X.fillRect(cx - 110, cy - 110, 220, 220); }
        [[4.4, 7.2], [7.4, 7.6]].forEach(([x, y], i) => { const rr = rise(4 + i); shadow(X, x - .3, y - .3, .6, .6); cyl(X, x, y, 0, .3, .4 * rr, '#FFFFFF', ['#EDEAF8', '#BDB3E6']); if (rr < .9) return; const a = Math.max(0, t - 2.8) * 2 + i * 2; box(X, x - .1, y - .1, .4, .2, .2, 1.1, '#FFFFFF', '#E3DDF6', '#CFC6EE'); box(X, x - .1 + Math.cos(a) * .2, y - .1 + Math.sin(a) * .2, 1.5, .9 * Math.abs(Math.cos(a)) + .2, .2, .18, '#FFC66B', '#E8A84B', '#D6923A'); });
        [[1, 6], [1.5, 7.2], [10.6, .8], [11, 2], [3, 11], [10.8, 10.8]].forEach(([x, y], i) => { const tb = easeO((t - 2.4 - i * .1) / .4); if (tb <= 0) return; const [tx, ty] = iso(x, y, .6); X.fillStyle = 'rgba(60,50,120,.15)'; X.beginPath(); X.ellipse(tx + 8, ty + 22, 16, 7, 0, 0, 7); X.fill(); const g = X.createRadialGradient(tx - 5, ty - 6, 2, tx, ty, 16 * tb); g.addColorStop(0, '#B6F0D6'); g.addColorStop(1, '#5FBF99'); X.fillStyle = g; X.beginPath(); X.arc(tx, ty, 14 * tb, 0, 7); X.fill(); });
        if (ch > .9) callout(X, cx, cy, 980, 560, ['DIE 5 nm', `YIELD ${(Math.min(99.3, 90 + (t - 4) * 4)).toFixed(1)} %`], 'rgba(60,52,120,.8)');
      });
      grain(X, .03, 'multiply'); } });
})();

// ---- 13 纸屑爆破 ----
(() => {
  SCENES.push({ key: 'BURST', no: 13, cn: '纸屑爆破', en: 'Confetti burst', tagline: 'PERSPECTIVE PARTICLES', side: 'R', theme: 'light', accent: '30,59,255', hudline: 'PIECES 1,100   v₀ 2–11 M/S   g 0.6',
    desc: '一声鼓点，五色纸屑从左下角朝镜头炸开，每一片都在翻转，拖着一道速度线。', tags: ['鼓点一落，纸屑从一点炸开', '纸片翻转着飞过镜头', '慢慢减速，像雪一样飘落'], pal: ['#F3EFE6', '#FF3B1F', '#1E3BFF', '#FF8FB1', '#FFC21E', '#111111'],
    render(lt) { X.fillStyle = '#F3EFE6'; X.fillRect(0, 0, W, H); const r = rng(77); const P = cam3([0, 0, 0], [0, 0, 1], 70, 0, [-120, 0]);
      const cols = ['#FF3B1F', '#1E3BFF', '#FF8FB1', '#111111', '#FFC21E']; const src = [-3.4, -2.2, 9]; const items = []; const tb = Math.max(0, lt - .35);
      const T = s => 1 - Math.exp(-s * 1.6); // decelerating flight
      for (let i = 0; i < 1100; i++) { const dir = V3.norm([r() * 1.7 - .25, r() * 1.5 - .1, -(.2 + r() * .95)]); const sp = 3 + Math.pow(r(), .6) * 11; const a = r() * 6, sw = r(), sz = .09 + r() * .07; if (tb <= 0) continue;
        const d = T(tb) * sp, d0 = T(Math.max(0, tb - .05)) * sp; const fall = Math.max(0, tb - .6) ** 2 * .25 * (.5 + sw); const p = V3.add(src, V3.mul(dir, d)); p[1] -= fall; const q = V3.add(src, V3.mul(dir, d0)); q[1] -= Math.max(0, tb - .65) ** 2 * .25 * (.5 + sw);
        items.push({ p, q, c: cols[i % cols.length], a, sw, s: sz }); }
      items.sort((a, b) => b.p[2] - a.p[2]);
      for (const it of items) { const s = P(it.p); if (s[2] < .3) continue; const s0 = P(it.q); const sz = it.s * P.k / s[2]; X.strokeStyle = it.c + '55'; X.lineWidth = Math.max(.6, sz * .12); X.beginPath(); X.moveTo(s0[0], s0[1]); X.lineTo(s[0], s[1]); X.stroke();
        X.save(); X.translate(s[0], s[1]); X.rotate(it.a + lt * 3 * (it.sw - .5)); X.scale(1, Math.abs(Math.cos(it.a * 3 + lt * 4 * it.sw)) * .9 + .1); X.fillStyle = it.c; X.fillRect(-sz / 2, -sz * .32, sz, sz * .64); X.restore(); }
      X.fillStyle = 'rgba(243,239,230,.88)'; X.fillRect(1150, 280, 690, 690);
      const fl = 1 - seg(lt, .35, .6); if (lt > .35 && fl > 0) { X.fillStyle = `rgba(255,255,255,${fl * .7})`; X.fillRect(0, 0, W, H); }
      grain(X, .07, 'multiply'); } });
})();

// ---- 14 钛金折纸（香槟 · 重做） ----
(() => {
  const backO = x => { x = clamp01(x); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  SCENES.push({ key: 'FOLD', no: 14, cn: '钛金折纸', en: 'Champagne fold', tagline: 'MIURA-ORI METAL', side: 'L', theme: 'light', accent: '160,120,60', hudline: 'GRADE 5 TITANIUM   FACETS 2,560   ANISO 0.42',
    desc: '', tags: [], pal: ['#EFE6D8', '#D9CBB4', '#B79B6E', '#FFF6E6', '#3A3128'],
    render(lt) { const g0 = X.createLinearGradient(0, 0, 0, H); g0.addColorStop(0, '#F3ECE0'); g0.addColorStop(1, '#D6C6AA'); X.fillStyle = g0; X.fillRect(0, 0, W, H);
      const c1 = easeIO((lt - 2.6) / 3.2), c2 = easeIO((lt - 5.6) / 2.2);
      const eye = [lerp3(-1.2, .2, c1) + c2 * .8, lerp3(.55, 3.6, c1) - c2 * 1.4, lerp3(-2.6, -1.6, c1) + c2 * 1.2]; const tgt = [lerp3(4, 4.6, c1), lerp3(-.2, -1.4, c1) + c2 * .9, lerp3(7, 6.5, c1)];
      const P = cam3(eye, tgt, 66, -.14 + c1 * .1 - c2 * .12, [160, 40]); const a = .62, b = .5, sk = .22, HG = .46;
      const fAt = (i, j) => { const front = backO((lt - .3 - j * .055 - Math.abs(i - 8) * .012) / .7); const breathe = 1 - .28 * sstep(2.6, 3.6, lt) * (.5 + .5 * Math.sin(i * .42 - lt * 3.2 + j * .15)); return front * breathe; };
      const pt = (i, j) => { const f = fAt(i, j); const z = j * b * (1 - f * .3); let y = (i % 2 ? HG * f : 0); const crest = sstep(5.6, 7.6, lt); y += crest * 1.9 * Math.exp(-Math.pow((z - (12 - (lt - 5.6) * 4.2)) / 2.2, 2)) * (1 + .2 * Math.sin(i * .5)); return [i * a + (j % 2 ? sk : 0), y, z]; };
      const items = []; const Ld = V3.norm([.55 * Math.cos(lt * .5), .6, -.3 + .4 * Math.sin(lt * .5)]); const glint = 2 + (lt - 1) * 2.6;
      for (let i = -6; i < 26; i++) for (let j = 0; j < 40; j++) { const A = pt(i, j), Bp = pt(i + 1, j), C = pt(i, j + 1), D = pt(i + 1, j + 1); for (const tr of [[A, Bp, D], [A, D, C]]) { const n0 = V3.norm(V3.cross(V3.sub(tr[1], tr[0]), V3.sub(tr[2], tr[0]))); const n = n0[1] < 0 ? V3.mul(n0, -1) : n0; const c = V3.mul(V3.add(V3.add(tr[0], tr[1]), tr[2]), 1 / 3); items.push({ tr, n, c, d: V3.len(V3.sub(c, P.eye)) }); } }
      items.sort((p, q) => q.d - p.d);
      for (const it of items) { const s = it.tr.map(P); if (s.some(v => v[2] < .1)) continue; const v = V3.norm(V3.sub(P.eye, it.c)); const rf = V3.sub(V3.mul(it.n, 2 * V3.dot(it.n, Ld)), Ld); const spec = Math.pow(clamp01(V3.dot(rf, v)), 14); const dif = clamp01(V3.dot(it.n, Ld));
        const band = Math.exp(-Math.pow((it.c[2] - glint) / .9, 2)) * sstep(1, 1.6, lt) * (1 - sstep(6, 7, lt));
        const base = lerpC([140, 116, 86], [240, 226, 202], dif); let c = lerpC(base, [255, 250, 238], clamp01(spec + band * .8 * dif)); const fog = clamp01((it.d - 7) / 15); c = lerpC(c, [222, 208, 186], fog);
        const gr = X.createLinearGradient(s[0][0], s[0][1], s[2][0], s[2][1]); gr.addColorStop(0, rgb(c)); gr.addColorStop(1, rgb(lerpC(c, [110, 90, 66], .28))); X.fillStyle = gr; X.strokeStyle = gr; X.lineWidth = .7;
        X.beginPath(); X.moveTo(s[0][0], s[0][1]); X.lineTo(s[1][0], s[1][1]); X.lineTo(s[2][0], s[2][1]); X.closePath(); X.fill(); X.stroke(); const hl = Math.max(spec, band * dif); if (hl > .25) { X.strokeStyle = `rgba(255,253,244,${Math.min(1, hl * .9)})`; X.lineWidth = 1; X.stroke(); } }
      const sg = X.createLinearGradient(0, 0, 900, 0); sg.addColorStop(0, 'rgba(243,236,224,.78)'); sg.addColorStop(1, 'rgba(243,236,224,0)'); X.fillStyle = sg; X.fillRect(0, 0, 900, H);
      grain(X, .05, 'multiply'); } });
  function lerp3(a, b, t) { return a + (b - a) * t; }
})();

})();
