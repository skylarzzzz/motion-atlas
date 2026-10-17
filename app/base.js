const ST = [];
const PCG = `uint pcg(uint v){ uint s=v*747796405u+2891336453u; uint w=((s>>((s>>28u)+4u))^s)*277803737u; return (w>>22u)^w; }
  float h(float n){ return float(pcg(floatBitsToUint(n)+pcg(floatBitsToUint(n*.731))))/4294967295.; }`;
function shaderStyle(meta, fs, post) { let Pg = null; ST.push(Object.assign(meta, { render(lt) { if (!Pg) Pg = prog(QVS, COMMON + fs); glClear(); drawQuad(Pg, { R: [W, H], T: lt }); X.drawImage(glc, 0, 0); if (post) post(lt); } })); }
window.renderST = function (i, lt) { X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none'; X.letterSpacing = '0px'; gl.viewport(0, 0, W, H); ST[i].render(lt); gl.finish(); return ST[i].key; };
window.listST = () => ST.map(s => [s.key, s.cn, s.en, s.cat, s.desc]);
