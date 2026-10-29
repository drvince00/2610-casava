// 광고 4장을 1080×1080 PNG로 렌더링한다.
// 01·04 는 site/images (Hero · 섹션4), 02·03 은 슬라이드 원본 폴더 images/slides-src 로 간다.
// 02·03 을 고쳤으면 이어서 npm run slides 로 슬라이드용 WebP 를 다시 만든다.
// 사용: npm run render   (Playwright Chromium 필요: npx playwright install chromium)
// Google Fonts를 불러오므로 인터넷 연결이 필요하다.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const imgDir = join(here, '..', 'site', 'images');
const slideSrcDir = join(here, '..', 'images', 'slides-src');
mkdirSync(slideSrcDir, { recursive: true });

const ads = [
  { file: '01-crunch-time.html', outs: [join(imgDir, '01-crunch-time.png')] },
  { file: '02-move-over-potato.html', outs: [join(slideSrcDir, '02-move-over-potato.png')] },
  { file: '03-snack-attack.html', outs: [join(slideSrcDir, '03-snack-attack.png')] },
  { file: '04-born-in-the-tropics.html', outs: [join(imgDir, '04-born-in-the-tropics.png')] },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
for (const ad of ads) {
  await page.goto(pathToFileURL(join(here, ad.file)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const out of ad.outs) {
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    console.log('saved', out);
  }
}
await browser.close();
