# shared: open the film page in headless Chromium
import os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def url(page='index.html'): return 'file://' + os.path.join(ROOT, 'app', page)
def open_page(p, page='index.html'):
    b = p.chromium.launch(args=['--allow-file-access-from-files', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1920, 'height': 1080}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:600])); pg.goto(url(page)); pg.evaluate('window.ready'); return b, pg, errs
