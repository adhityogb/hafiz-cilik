from pathlib import Path
import sys
from PIL import Image, ImageDraw

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site') / 'icons'
root.mkdir(parents=True, exist_ok=True)

SKY = '#38BDF8'
SKY_DARK = '#0284C7'
YELLOW = '#FDE047'
GOLD = '#F59E0B'
INK = '#243A63'
WHITE = '#FFFFFF'


def rounded_box(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_icon(size):
    # Full-bleed RGB artwork. iOS/Android apply their own rounded mask, so avoid
    # transparent corners and nested outer frames that can look like a tiny icon.
    img = Image.new('RGB', (size, size), SKY)
    d = ImageDraw.Draw(img)

    # Very subtle lower accent keeps the icon playful without clutter.
    d.ellipse(
        (int(size * -0.10), int(size * 0.68), int(size * 0.55), int(size * 1.28)),
        fill='#7DD3FC'
    )

    # Central yellow tile stays inside the maskable safe zone.
    x0, y0, x1, y1 = int(size * 0.19), int(size * 0.18), int(size * 0.81), int(size * 0.82)
    rounded_box(
        d, (x0, y0, x1, y1), int(size * 0.16),
        YELLOW, GOLD, max(4, int(size * 0.025))
    )

    # Open-book mark: bold, simple strokes remain readable at home-screen size.
    cx = size * 0.50
    top = size * 0.34
    bottom = size * 0.67
    left = size * 0.31
    right = size * 0.69
    mid_gap = size * 0.018
    stroke = max(4, int(size * 0.032))

    # Left and right page outlines.
    d.line(
        [(cx - mid_gap, top + size * 0.025),
         (cx - size * 0.075, top),
         (left, top + size * 0.035),
         (left, bottom - size * 0.025),
         (cx - mid_gap, bottom)],
        fill=INK, width=stroke, joint='curve'
    )
    d.line(
        [(cx + mid_gap, top + size * 0.025),
         (cx + size * 0.075, top),
         (right, top + size * 0.035),
         (right, bottom - size * 0.025),
         (cx + mid_gap, bottom)],
        fill=INK, width=stroke, joint='curve'
    )
    d.line((cx, top + size * 0.03, cx, bottom), fill=INK, width=max(3, int(size * 0.022)))

    # Small white star accent, separated from the book so it stays legible.
    sx, sy = int(size * 0.70), int(size * 0.27)
    r = max(3, int(size * 0.035))
    d.polygon(
        [(sx, sy-r), (sx+int(r*.45), sy-int(r*.45)), (sx+r, sy),
         (sx+int(r*.45), sy+int(r*.45)), (sx, sy+r),
         (sx-int(r*.45), sy+int(r*.45)), (sx-r, sy),
         (sx-int(r*.45), sy-int(r*.45))],
        fill=WHITE
    )
    return img


for size, name in [
    (192, 'icon-192.png'),
    (512, 'icon-512.png'),
    (512, 'icon-maskable-512.png'),
    (180, 'apple-touch-icon.png'),
]:
    draw_icon(size).save(root / name, optimize=True)

(root / 'favicon.svg').write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#38BDF8"/>
  <rect x="12" y="11" width="40" height="42" rx="11" fill="#FDE047" stroke="#F59E0B" stroke-width="3"/>
  <path d="M31 23c-4-3-8-3-13-1v20c5-2 9-2 13 1M33 23c4-3 8-3 13-1v20c-5-2-9-2-13 1M32 24v19" fill="none" stroke="#243A63" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M45 16l1.3 2.7L49 20l-2.7 1.3L45 24l-1.3-2.7L41 20l2.7-1.3z" fill="#fff"/>
</svg>''')

print('Hafizku clean PWA icons generated')
