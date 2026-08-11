from pathlib import Path
import sys
from PIL import Image, ImageDraw

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site') / 'icons'
root.mkdir(parents=True, exist_ok=True)

BG = '#F6F9FF'
OUTER = '#8C77DC'
OUTER2 = '#5EB7E8'
GOLD = '#FFD567'
INK = '#243A63'
WHITE = '#FFFFFF'


def rounded_box(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_icon(size):
    img = Image.new('RGBA', (size, size), BG)
    d = ImageDraw.Draw(img)
    pad = int(size * 0.08)
    rounded_box(d, (pad, pad, size-pad, size-pad), int(size*0.22), '#FFFFFF', OUTER, max(4, size//64))
    rounded_box(d, (int(size*0.16), int(size*0.14), int(size*0.84), int(size*0.86)), int(size*0.18), '#E9F4FF', OUTER2, max(3, size//96))

    bx0, by0, bx1, by1 = int(size*0.26), int(size*0.26), int(size*0.74), int(size*0.74)
    rounded_box(d, (bx0, by0, bx1, by1), int(size*0.09), GOLD, INK, max(4, size//80))
    d.line((size*0.5, by0+size*0.05, size*0.5, by1-size*0.05), fill=INK, width=max(4, size//80))
    d.arc((bx0+size*0.05, by0+size*0.12, size*0.5, by1-size*0.1), start=255, end=80, fill=INK, width=max(4, size//80))
    d.arc((size*0.5, by0+size*0.12, bx1-size*0.05, by1-size*0.1), start=100, end=285, fill=INK, width=max(4, size//80))

    mx, my = int(size*0.67), int(size*0.34)
    r = int(size*0.06)
    d.ellipse((mx-r, my-r, mx+r, my+r), fill=WHITE)
    d.ellipse((mx-r+int(r*0.45), my-r, mx+r+int(r*0.45), my+r), fill=GOLD)
    sx, sy = int(size*0.58), int(size*0.31)
    sr = max(2, size//48)
    d.polygon([(sx, sy-sr), (sx+sr, sy), (sx, sy+sr), (sx-sr, sy)], fill=WHITE)
    return img

for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png'), (512, 'icon-maskable-512.png'), (180, 'apple-touch-icon.png')]:
    draw_icon(size).save(root / name)

(root / 'favicon.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="16" fill="#F6F9FF" stroke="#8C77DC" stroke-width="3"/><rect x="14" y="14" width="36" height="36" rx="10" fill="#FFD567" stroke="#243A63" stroke-width="3"/><path d="M32 20v24" stroke="#243A63" stroke-width="3" fill="none"/><path d="M20 26c5-3 8-3 12 0v14c-4-3-7-3-12 0z" fill="none" stroke="#243A63" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 26c-5-3-8-3-12 0v14c4-3 7-3 12 0z" fill="none" stroke="#243A63" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>''')

print('Hafizku PWA icons generated')
