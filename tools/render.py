"""Render the whole film:  python3 tools/render.py [workers=2] [only chunk ids...]
1) thumbs  2) music  3) chunks in parallel  4) concat + mux  5) a <30MB share copy.
Output: out/film_master.mp4 (high quality) and out/film_share.mp4 (~2.4 Mbps, fits chat/upload limits).
Slow raymarched scenes take ~5-15 s per frame on CPU; a 90 s film can take 1-2 h with 2 workers."""
import sys, os, subprocess, math, json
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
T = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(ROOT, 'out'); os.makedirs(O, exist_ok=True)
nw = int(sys.argv[1]) if len(sys.argv) > 1 else 2; only = [int(x) for x in sys.argv[2:]]
subprocess.run([sys.executable, os.path.join(T, 'thumbs.py')], check=True)
subprocess.run([sys.executable, os.path.join(T, 'music.py')], check=True)
with sync_playwright() as p: b, pg, e = open_page(p); total = pg.evaluate('window.TOTAL'); b.close()
n = math.ceil(total * 30 / 90); ids = only or list(range(n)); print('total', total, 's ·', n, 'chunks')
procs = [subprocess.Popen([sys.executable, os.path.join(T, '_chunk.py')] + [str(c) for c in ids[w::nw]]) for w in range(nw)]
for pr in procs: pr.wait()
cd = os.path.join(O, 'chunks'); lst = os.path.join(cd, 'list.txt'); open(lst, 'w').write(''.join(f"file 'c{i:03d}.mp4'\n" for i in range(n)))
run = lambda *a: subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)
run('-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', os.path.join(O, 'silent.mp4'))
run('-i', os.path.join(O, 'silent.mp4'), '-i', os.path.join(O, 'music.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', os.path.join(O, 'film_master.mp4'))
os.chdir(O); run('-i', 'film_master.mp4', '-c:v', 'libx264', '-b:v', '2400k', '-pass', '1', '-preset', 'slow', '-an', '-f', 'null', '/dev/null')
run('-i', 'film_master.mp4', '-c:v', 'libx264', '-b:v', '2400k', '-pass', '2', '-preset', 'slow', '-c:a', 'aac', '-b:a', '160k', 'film_share.mp4'); print('done ->', os.path.join(O, 'film_share.mp4'))
