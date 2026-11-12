"""Turn club logos into die-cut stickers: remove the edge-connected background, add a white outline.

Requires Pillow (pip install pillow). Writes PNG; convert to WebP for the site.

Usage: python scripts/make-club-stickers.py scripts/club-logos public/clubs/stickers stm=stm.png old-gabs=oldgabs.jpeg
"""
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

TARGET = 640          # working size (longest side)
TOLERANCE = 48        # colour distance to treat a pixel as background
OUTLINE = 14          # sticker border (px at TARGET size)
PADDING = 6


def bg_color(img):
    w, h = img.size
    px = img.load()
    samples = [px[x, y] for x, y in [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3), (w // 2, 2), (2, h // 2)]]
    samples.sort(key=lambda p: sum(p[:3]))
    return samples[len(samples) // 2][:3]


def remove_background(img):
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    bg = bg_color(img)
    close = lambda p: p[3] < 20 or sum((a - b) ** 2 for a, b in zip(p[:3], bg)) <= TOLERANCE ** 2
    seen = bytearray(w * h)
    queue = deque()
    for x in range(w):
        queue.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        queue.extend([(0, y), (w - 1, y)])
    mask = Image.new("L", (w, h), 255)
    mpx = mask.load()
    while queue:
        x, y = queue.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not close(px[x, y]):
            continue
        mpx[x, y] = 0
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                queue.append((nx, ny))
    # soften the cut edge a little
    mask = mask.filter(ImageFilter.GaussianBlur(0.8))
    alpha = Image.eval(Image.composite(img.getchannel("A"), Image.new("L", (w, h), 0), mask), lambda a: a)
    out = img.copy()
    out.putalpha(alpha)
    return out


def sticker(img):
    w, h = img.size
    pad = OUTLINE + PADDING
    canvas = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad), img)
    alpha = canvas.getchannel("A").point(lambda a: 255 if a > 40 else 0)
    outline = alpha.filter(ImageFilter.MaxFilter(OUTLINE * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2))
    white = Image.new("RGBA", canvas.size, (255, 255, 255, 255))
    base = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    base.paste(white, (0, 0), outline)
    base.alpha_composite(canvas)
    return base.crop(base.getbbox())


def main():
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for pair in sys.argv[3:]:
        name, file = pair.split("=", 1)
        img = Image.open(src / file).convert("RGBA")
        scale = TARGET / max(img.size)
        img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
        result = sticker(remove_background(img))
        result.thumbnail((512, 512), Image.LANCZOS)
        result.save(out / f"{name}.png", optimize=True)
        print(name, result.size)


if __name__ == "__main__":
    main()
