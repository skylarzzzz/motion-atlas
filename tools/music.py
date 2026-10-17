import numpy as np, scipy.io.wavfile as wf
from scipy.signal import fftconvolve, butter, sosfilt
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
with sync_playwright() as _p:
    _b, _pg, _e = open_page(_p); TM = _pg.evaluate('SCENE_TIMES()'); _b.close()
SR = 44100; D = float(TM['total']); n = int(SR * D); t = np.arange(n) / SR; rng = np.random.default_rng(11)
out = np.zeros((n, 2)); beat = .5
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def add(sig, at, pan=0., g=1.):
    i = int(at * SR)
    if i >= n or i < 0: return
    s = sig[: n - i] * g; out[i:i + len(s), 0] += s * np.sqrt(1 - pan * .5); out[i:i + len(s), 1] += s * np.sqrt(1 + pan * .5)
def kick(g=1.):
    x = np.arange(int(.42 * SR)) / SR; f = 44 + 120 * np.exp(-x * 30); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7.5) * g
HAT = hp(rng.standard_normal(int(.05 * SR)), 7000) * np.exp(-np.arange(int(.05 * SR)) / SR * 90)
def clap():
    x = np.arange(int(.25 * SR)) / SR; return hp(lp(rng.standard_normal(len(x)), 5000), 900) * (np.exp(-x * 22) + .5 * np.exp(-np.maximum(0, x - .012) * 30) * (x > .012))
def saw(f, dur):
    x = np.arange(int(dur * SR)) / SR; s = np.zeros_like(x)
    for k in range(1, 24):
        if f * k > 14000: break
        s += np.sin(2 * np.pi * f * k * x) / k
    return s
mt = lambda m: 440 * 2 ** ((m - 69) / 12)
prog = [[45, 57, 60, 64, 67], [41, 53, 57, 60, 64], [48, 55, 60, 64, 67], [43, 55, 59, 62, 67]]  # Am7 Fmaj7 C G
pads = {}
def pad(ch):
    k = tuple(ch)
    if k not in pads:
        p = sum(lp(saw(mt(m), 2.1), 2200) for m in ch[1:]) * .028; e = np.minimum(1, np.arange(len(p)) / SR / .05) * np.exp(-np.arange(len(p)) / SR * .5); pads[k] = p * e
    return pads[k]
START, END = float(TM['intro']), float(TM['total'] - TM['outro'])
# intro riser
IN_ = TM['intro']; r = np.arange(int(IN_ * SR)) / SR; add(hp(rng.standard_normal(len(r)), 1200) * (r / IN_) ** 3 * .3, 0)
NSC = len(TM['scenes'])
for k in range(NSC): add(clap(), k * TM['cut'], g=.18 + .02 * k, pan=(-.4 if k % 2 else .4)); add(kick(.5), k * TM['cut'])
add(kick(1.), NSC * TM['cut']); add(clap(), NSC * TM['cut'], g=.4)

# groove
bar = 0; tt = START
while tt < END - .01:
    ch = prog[bar % 4]; add(pad(ch), tt, pan=(-.3 if bar % 2 else .3))
    bassn = mt(ch[0] - 12)
    for k in range(4):
        at = tt + k * beat; add(kick(.95), at)
        bl = np.arange(int(.45 * SR)) / SR; add(lp(saw(bassn, .45), 600) * np.exp(-bl * 5) * .16, at + beat / 2)
        if k % 2 == 1: add(clap(), at, g=.32)
        add(HAT, at + beat / 2, pan=.4, g=.18); add(HAT, at, pan=-.4, g=.08)
    # arp
    for k in range(8):
        m = ch[1 + (k * 3) % 4] + 12; L = int(.22 * SR); x = np.arange(L) / SR; add(np.sin(2 * np.pi * mt(m) * x) * np.exp(-x * 14) * .05, tt + k * .25, pan=(-.6 if k % 2 else .6))
    tt += 2.0; bar += 1
# scene hits + whooshes
x = np.arange(int(1.6 * SR)) / SR; boom = np.sin(2 * np.pi * np.cumsum(38 + 100 * np.exp(-x * 14)) / SR) * np.exp(-x * 3)
SS = [s['start'] for s in TM['scenes']]; SD = [s['dur'] for s in TM['scenes']]
STARTS = SS + [END]
for i, at in enumerate(STARTS):
    pass
    at = at
    add(boom, at, g=.55 if i else .9); add(clap(), at, g=.35)
    w = rng.standard_normal(int(.7 * SR)); add(hp(lp(w, 6000), 500) * np.linspace(0, 1, len(w)) ** 3 * .3, at - .7, pan=(-.5 if i % 2 else .5))
# outro: tail chord
add(pad([45, 57, 60, 64, 71]) * 1.4, END); add(boom, END, g=.6)

# --- per-scene sound accents (declared in scenes.js -> SFX) ---
RT = lambda idx, lt: SS[idx] + lt * SD[idx] / 8
def click(g=1.):
    L = int(.05 * SR); x = np.arange(L) / SR; return (hp(rng.standard_normal(L), 1800) * np.exp(-x * 160) * .6 + np.sin(2 * np.pi * 1900 * x) * np.exp(-x * 120) * .4) * g
def thud(g=1.):
    L = int(.25 * SR); x = np.arange(L) / SR; return (np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-x * 40)) / SR) * np.exp(-x * 18) + lp(rng.standard_normal(L), 1500) * np.exp(-x * 40) * .5) * g
def flap(g=1.):
    L = int(.03 * SR); x = np.arange(L) / SR; return hp(rng.standard_normal(L), 2500) * np.exp(-x * 220) * g
def pop(g=1.):
    f = mt(72 + [0, 4, 7, 12, 9, 5][rng.integers(0, 6)]); L = int(.18 * SR); x = np.arange(L) / SR; return np.sin(2 * np.pi * np.cumsum(f * (1 + .6 * np.exp(-x * 30))) / SR) * np.exp(-x * 20) * g
def whoosh(g=1.):
    w = rng.standard_normal(int(.6 * SR)); return hp(lp(w, 4000), 300) * np.hanning(len(w)) * .7 * g
x2 = np.arange(int(2.5 * SR)) / SR; BIG = np.sin(2 * np.pi * np.cumsum(34 + 90 * np.exp(-x2 * 9)) / SR) * np.exp(-x2 * 1.6)
def shimmer(g=1.):
    sh = np.zeros(int(2.5 * SR))
    for k in range(40):
        i0 = int(rng.random() * len(sh) * .8); f = mt(84 + rng.integers(0, 10)); Ls = int(.4 * SR); s_ = np.sin(2 * np.pi * f * np.arange(Ls) / SR) * np.exp(-np.arange(Ls) / SR * 8); sh[i0:i0 + Ls] += s_[: len(sh) - i0] * .035
    return sh * g
ONE = {'click': lambda: click(.3), 'thud': lambda: thud(.55), 'flap': lambda: flap(.18), 'pop': lambda: pop(.09), 'whoosh': lambda: whoosh(.3), 'shimmer': lambda: shimmer(1.), 'boom': lambda: BIG * .9}
for idx, sc in enumerate(TM['scenes']):
    for e in sc['sfx']:
        if e[0] == 'run':
            _, typ, a, b, cnt = e
            for k in range(int(cnt)): add(ONE[typ](), RT(idx, a + (b - a) * k / max(1, cnt - 1) + (rng.random() - .5) * .02), pan=float(rng.uniform(-.6, .6)))
        else:
            lt, typ = e; add(ONE[typ](), RT(idx, lt) - (1.0 if typ == 'boom' else 0) * 0, pan=.2)
            if typ == 'boom': w = rng.standard_normal(int(1.2 * SR)); add(hp(lp(w, 7000), 600) * np.linspace(0, 1, len(w)) ** 4 * .35, RT(idx, lt) - 1.2); add(clap(), RT(idx, lt), g=.5)
ir = rng.standard_normal(int(1.5 * SR)) * np.exp(-np.arange(int(1.5 * SR)) / SR * 3.3) * .02
wet = np.stack([fftconvolve(out[:, c], ir)[:n] for c in range(2)], 1); mix = out + wet * .45
mix *= np.clip((D - t) / 1.5, 0, 1)[:, None]; mix /= np.abs(mix).max() * 1.1
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True); wf.write(os.path.join(ROOT, 'out', 'music.wav'), SR, (mix * 32767).astype(np.int16)); print('ok')
