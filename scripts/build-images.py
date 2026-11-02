# 사이트용 이미지를 WebP 로 만든다. 원본은 배포되지 않는 images/ 아래에 둔다.
#   images/ads-src/*.png    (광고 01 · 04, npm run render 산출물) -> site/images/<이름>-540.webp, -1080.webp
#   images/slides-src/*     (슬라이드 원본)                       -> site/images/slides/<이름>-400.webp, -800.webp (정사각 크롭)
#                                                                    + site/data/slides.json
# 페이지는 srcset 으로 화면 크기에 맞는 파일을 고른다. 이미지를 바꾸면 이 스크립트를 다시 실행한다.
# 사용: npm run images   (Pillow 필요: pip install pillow)
import json
import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
EXTS = {'.jpg', '.jpeg', '.png', '.webp'}

ADS_SRC = ROOT / 'images' / 'ads-src'
ADS_OUT = ROOT / 'site' / 'images'
ADS_SIZES = (540, 1080)    # 화면 표시 최대 760px

SLIDE_SRC = ROOT / 'images' / 'slides-src'
SLIDE_OUT = ROOT / 'site' / 'images' / 'slides'
SLIDE_LIST = ROOT / 'site' / 'data' / 'slides.json'
SLIDE_SIZES = (400, 800)   # 화면 표시 280px(모바일) / 400px(768px 이상) × 레티나


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def sources(folder):
    return sorted(p for p in folder.iterdir() if p.suffix.lower() in EXTS)


def save(im, out):
    im.save(out, 'WEBP', quality=82, method=6)
    return f'{out.name} ({out.stat().st_size // 1024} KB)'


# 광고 01 · 04: 비율 그대로 크기만 줄인다
for src in sources(ADS_SRC):
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        made = [save(im.resize((w, round(im.height * w / im.width)), Image.LANCZOS), ADS_OUT / f'{slug(src.stem)}-{w}.webp')
                for w in ADS_SIZES]
    print(src.name, '->', ', '.join(made))

# 슬라이드: 가운데 기준 정사각 크롭
SLIDE_OUT.mkdir(parents=True, exist_ok=True)
names, keep = [], set()
for src in sources(SLIDE_SRC):
    name = slug(src.stem)
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert('RGB')
        made = []
        for w in SLIDE_SIZES:
            out = SLIDE_OUT / f'{name}-{w}.webp'
            made.append(save(ImageOps.fit(im, (w, w), Image.LANCZOS), out))
            keep.add(out.name)
    names.append(name)
    print(src.name, '->', ', '.join(made))

# 원본이 사라진 슬라이드는 지운다
for old in SLIDE_OUT.iterdir():
    if old.name not in keep:
        old.unlink()
        print(f'removed {old.name}')

# 목록에는 확장자 · 크기 없이 이름만 둔다. 파일 경로는 main.js 가 <이름>-<크기>.webp 로 만든다
SLIDE_LIST.write_text(json.dumps(names, indent=2) + '\n', encoding='utf-8')
print(f'{len(names)} slides -> {SLIDE_LIST.relative_to(ROOT)}')
