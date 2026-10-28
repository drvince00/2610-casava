// 광고 4장을 1080×1080 PNG로 렌더링해서 site/images 에 넣는다.
// 사용: (casava-handoff 폴더에서)  npm i -D playwright && npx playwright install chromium && node ads/render.mjs
// Google Fonts를 불러오므로 인터넷 연결이 필요하다.
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const imgDir = join(here, '..', 'site', 'images');
mkdirSync(join(imgDir, 'slides'), { recursive: true });

const ads = [
  { file: '01-crunch-time.html', outs: ['01-crunch-time.png', 'slides/slide-01.png'] },
  { file: '02-move-over-potato.html', outs: ['slides/slide-02.png'] },
  { file: '03-snack-attack.html', outs: ['slides/slide-03.png'] },
  { file: '04-born-in-the-tropics.html', outs: ['04-born-in-the-tropics.png', 'slides/slide-04.png'] },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
for (const ad of ads) {
  await page.goto(pathToFileURL(join(here, ad.file)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const out of ad.outs) {
    await page.screenshot({ path: join(imgDir, out), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    console.log('saved', out);
  }
}
await browser.close();
