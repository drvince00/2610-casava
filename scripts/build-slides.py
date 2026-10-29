# images/slides-src 의 원본 사진을 슬라이드용 정사각 WebP(800px)로 만들어 site/images/slides 에 넣고,
# 목록을 site/data/slides.json 에 쓴다. 페이지는 이 목록을 읽어 매번 순서를 섞어 보여준다.
# 사용: npm run slides   (Pillow 필요: pip install pillow)
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'images' / 'slides-src'
OUT = ROOT / 'site' / 'images' / 'slides'
LIST = ROOT / 'site' / 'data' / 'slides.json'
SIZE = 800  # 화면 표시 최대 400px × 2 (레티나)
EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


OUT.mkdir(parents=True, exist_ok=True)
made = []
for src in sorted(p for p in SRC.iterdir() if p.suffix.lower() in EXTS):
    out = OUT / f'{slug(src.stem)}.webp'
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        im = ImageOps.fit(im, (SIZE, SIZE), Image.LANCZOS)  # 가운데 기준 정사각 크롭
        im.save(out, 'WEBP', quality=80, method=6)
    made.append(out.name)
    print(f'{src.name} -> {out.name} ({out.stat().st_size // 1024} KB)')

# 원본이 사라진 슬라이드는 지운다
for old in OUT.iterdir():
    if old.name not in made:
        old.unlink()
        print(f'removed {old.name}')

LIST.write_text(json.dumps([f'images/slides/{n}' for n in made], indent=2) + '\n', encoding='utf-8')
print(f'{len(made)} slides -> {LIST.relative_to(ROOT)}')
