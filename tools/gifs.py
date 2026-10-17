"""Make README media: docs/media/<KEY>.gif (art only, 15 fps, 3 s loop of the 8-unit timeline)"""
import os, sys, subprocess, tempfile
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
OFF = float(os.environ.get("GIF_OFFSET", ".45")); keys = sys.argv[1:] or ['SATURNX', 'COLORINK', 'SPLITFLAP', 'DOMINO', 'GLASS', 'MEMPHIS']
md = os.path.join(ROOT, 'docs', 'media'); os.makedirs(md, exist_ok=True)
with sync_playwright() as p:
    b, pg, errs = open_page(p)
    for k in keys:
        d = tempfile.mkdtemp(); n = 45
        for f in range(n):
            pg.evaluate(f"renderST(ST.findIndex(s=>s.key=='{k}'),{8 * ((f / n + OFF) % 1)})"); pg.screenshot(path=f'{d}/f{f:03d}.png')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '15', '-i', f'{d}/f%03d.png', '-vf', 'crop=1300:900:620:90,scale=520:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4', os.path.join(md, f'{k}.gif')], check=True)
        print(k, os.path.getsize(os.path.join(md, f'{k}.gif')) // 1024, 'KB', flush=True)
    b.close()
