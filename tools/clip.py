"""Export ONE style as a standalone clip, to drop into your own edit (Premiere / Final Cut / 剪映 / CapCut).

  python3 tools/clip.py COLORINK                      # 6 s, 1920x1080, no text panel, no HUD
  python3 tools/clip.py SATURNX --dur 4               # compress the full animation into 4 s
  python3 tools/clip.py SPLITFLAP --vertical          # 1080x1920 for 抖音 / 小红书 / Reels (crops around the subject)
  python3 tools/clip.py DOMINO --loop                 # plays the animation twice back to back (8 s → 2 loops)
  python3 tools/clip.py GLASS --png                   # also keep the PNG frame sequence

Output: out/clips/<KEY>[_v].mp4  (H.264, 30 fps, yuv420p, no audio — add your own music in the editor)"""
import os, sys, subprocess, tempfile, argparse, shutil
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
ap = argparse.ArgumentParser(); ap.add_argument('key'); ap.add_argument('--dur', type=float, default=6); ap.add_argument('--vertical', action='store_true')
ap.add_argument('--loop', action='store_true'); ap.add_argument('--png', action='store_true'); ap.add_argument('--cx', type=int, default=1250, help='vertical crop centre x (subject is usually right of centre)')
a = ap.parse_args(); FPS = 30; n = int(round(a.dur * FPS)); od = os.path.join(ROOT, 'out', 'clips'); os.makedirs(od, exist_ok=True)
d = tempfile.mkdtemp()
with sync_playwright() as p:
    b, pg, errs = open_page(p)
    if pg.evaluate(f"ST.findIndex(s=>s.key=='{a.key}')") < 0: sys.exit(f'unknown key {a.key} — see STYLES.md')
    for f in range(n):
        lt = 8 * ((f / n) * (2 if a.loop else 1) % 1)
        pg.evaluate(f"renderST(ST.findIndex(s=>s.key=='{a.key}'),{lt})"); pg.screenshot(path=f'{d}/f{f:04d}.png')
        if f % 30 == 0: print(a.key, f, '/', n, flush=True)
    b.close()
vf = f'crop=608:1080:{max(0, min(1920 - 608, a.cx - 304))}:0,scale=1080:1920:flags=lanczos' if a.vertical else 'null'
outp = os.path.join(od, a.key + ('_v' if a.vertical else '') + '.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', f'{d}/f%04d.png', '-vf', vf, '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', outp], check=True)
if a.png: shutil.copytree(d, os.path.join(od, a.key + '_png'), dirs_exist_ok=True)
print('done ->', outp)
