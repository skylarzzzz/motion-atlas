"""Snapshot frames for review.
  python3 tools/preview.py film 5 12.5 30        # full film frames at global seconds
  python3 tools/preview.py style SATURNX 0 4 8   # one library style at local times lt (0..8)
  python3 tools/preview.py scenes                # every scene at 15% / 55% / 95% of its duration
Writes JPGs to out/preview/ and a contact sheet out/preview/sheet.jpg"""
import sys, os, time
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
from PIL import Image
out = os.path.join(ROOT, 'out', 'preview'); os.makedirs(out, exist_ok=True); mode = sys.argv[1]; files = []
with sync_playwright() as p:
    b, pg, errs = open_page(p)
    if mode == 'film': jobs = [(f'render({t})', f'{float(t):06.2f}') for t in sys.argv[2:]]
    elif mode == 'style': key = sys.argv[2]; jobs = [(f"renderST(ST.findIndex(s=>s.key=='{key}'),{t})", f'{key}_{float(t):05.2f}') for t in sys.argv[3:]]
    else:
        st = pg.evaluate('SCENE_TIMES()'); jobs = [(f"render({s['start'] + s['dur'] * f})", f"{s['start'] + s['dur'] * f:06.2f}_{s['key']}") for s in st['scenes'] for f in (.15, .55, .95)]
    for js, name in jobs:
        t0 = time.time(); pg.evaluate(js); f = os.path.join(out, name + '.jpg'); pg.screenshot(path=f, type='jpeg', quality=85); files.append(f); print(name, round(time.time() - t0, 2), 's', flush=True)
    print('errors:', errs[:3]); b.close()
cols = 3 if len(files) % 3 == 0 else 4; w = 480; ims = [Image.open(f).resize((w, w * 9 // 16)) for f in files]; rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * w * 9 // 16)); [sheet.paste(im, ((i % cols) * w, (i // cols) * w * 9 // 16)) for i, im in enumerate(ims)]; sheet.save(os.path.join(out, 'sheet.jpg'), quality=85); print('sheet ->', os.path.join(out, 'sheet.jpg'))
