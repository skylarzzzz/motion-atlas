"""Render one still per scene into app/thumbs/ (used by the intro mosaic and the outro grid). Run after changing scenes.js."""
import os
from playwright.sync_api import sync_playwright
from _page import open_page, ROOT
d = os.path.join(ROOT, 'app', 'thumbs'); os.makedirs(d, exist_ok=True)
with sync_playwright() as p:
    b, pg, errs = open_page(p); n = pg.evaluate('SCENES.length')
    for i in range(n): k = pg.evaluate(f'renderArt({i},6)'); pg.screenshot(path=os.path.join(d, f't{i:02d}.jpg'), type='jpeg', quality=90); print(i, k, flush=True)
    b.close()
