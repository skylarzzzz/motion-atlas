// Live gallery: browse every style in the library. ←/→ to switch, or ?k=KEY in the URL.
(() => { const ui = document.createElement('div'); ui.style.cssText = 'position:fixed;left:16px;bottom:16px;font:14px/1.4 monospace;color:#fff;background:rgba(0,0,0,.6);padding:8px 12px;border-radius:6px';
  document.body.appendChild(ui); const cv = document.getElementById('out'); cv.style.width = '100vw'; cv.style.height = 'auto';
  let i = Math.max(0, ST.findIndex(s => s.key === new URLSearchParams(location.search).get('k'))); let t0 = performance.now();
  const show = () => { ui.textContent = `${i + 1}/${ST.length}  ${ST[i].key}  ${ST[i].cn} · ${ST[i].en}   (←/→)`; };
  addEventListener('keydown', e => { if (e.key === 'ArrowRight') i = (i + 1) % ST.length; if (e.key === 'ArrowLeft') i = (i - 1 + ST.length) % ST.length; t0 = performance.now(); show(); });
  cv.addEventListener('click', () => { i = (i + 1) % ST.length; t0 = performance.now(); show(); });
  window.ready.then(() => { show(); const loop = () => { renderST(i, ((performance.now() - t0) / 1000) % 8); requestAnimationFrame(loop); }; loop(); }); })();
