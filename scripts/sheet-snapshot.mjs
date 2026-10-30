// 구글시트(웹에 게시된 CSV)를 내려받아 site/data/<탭>.csv 사본으로 저장한다.
// 페이지는 이 사본으로 먼저 그리고, 최신 시트를 읽어 바뀐 게 있으면 다시 그린다 (구글이 느리거나 멈춰도 사본이 보임).
// 사용: npm run sheet
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'site', 'data');
const sources = JSON.parse(readFileSync(join(dataDir, 'sheet.json'), 'utf8'));

// main.js 의 SHEET_HEADERS 와 같게 유지
const required = {
  stores: ['area', 'name', 'address', 'open', 'close', 'closed', 'mapUrl', 'show'],
  contact: ['field', 'value'],
};

let failed = false;
for (const [name, url] of Object.entries(sources)) {
  const res = await fetch(url);
  const text = await res.text();
  const header = text.split(/\r?\n/, 1)[0].split(',').map((h) => h.trim());
  const missing = (required[name] ?? []).filter((h) => !header.includes(h));
  if (!res.ok || missing.length) {
    console.error(`${name}: 저장 안 함 (HTTP ${res.status}${missing.length ? `, 없는 열: ${missing.join(', ')}` : ''})`);
    failed = true;
    continue;
  }
  writeFileSync(join(dataDir, `${name}.csv`), text.endsWith('\n') ? text : `${text}\n`);
  console.log(`${name}: ${text.trim().split(/\r?\n/).length - 1} rows -> site/data/${name}.csv`);
}
process.exit(failed ? 1 : 0);
