# worker: render a list of 3-second chunks of the film to out/chunks/cNNN.mp4
import sys, os, subprocess, time
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
CH, FPS = 90, 30; only = [int(x) for x in sys.argv[1:]]; od = os.path.join(ROOT, 'out', 'chunks'); os.makedirs(od, exist_ok=True)
with sync_playwright() as p:
    b, pg, errs = open_page(p); nf = int(round(pg.evaluate('window.TOTAL') * FPS)); t0 = time.time()
    for ci in only:
        a, z = ci * CH, min(nf, ci * CH + CH)
        ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', str(FPS), os.path.join(od, f'c{ci:03d}.mp4')], stdin=subprocess.PIPE)
        for f in range(a, z): pg.evaluate(f'render({f / FPS})'); ff.stdin.write(pg.screenshot(type='jpeg', quality=94))
        ff.stdin.close(); ff.wait(); print('chunk', ci, 'done', round(time.time() - t0), 's', flush=True)
    print('worker done', errs[:3]); b.close()
