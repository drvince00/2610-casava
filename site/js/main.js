/* ===== 설정 ===== */
// 문의 링크(카카오톡 · 메신저)는 data/links.json 에서 읽는다
// 판매처(Stores)와 푸터 연락처(Contact)는 구글시트에서 읽는다: data/sheet.json 의 게시 주소 + data/<탭>.csv 사본

// 시트 탭마다 꼭 있어야 하는 제목 줄. 하나라도 없으면 그 시트는 무시하고 사본을 유지한다 (scripts/sheet-snapshot.mjs 와 같게)
const SHEET_HEADERS = {
  stores: ['area', 'name', 'address', 'open', 'close', 'closed', 'mapUrl', 'show'],
  contact: ['field', 'value'],
};

/* ===== 다국어 문구 ===== */
const T = {
  ko: {
    slideTitle: '세부 여행의 바삭한 쉼표',
    slideLead: '해변에서 즐기는 바삭한 카사바칩.',
    aboutTitle: '카사바가 뭐예요?',
    aboutIntro: '카사바는 남미 원산의 탄수화물 풍부한 구근작물로, 가뭄에 강한 구황식물이자 타피오카 펄의 원료입니다.',
    benefitsTitle: '주요 효능',
    b1t: '혈당 관리', b1: 'GI 지수가 낮아 혈당 급상승을 막고 오랫동안 포만감을 줍니다.',
    b2t: '소화 개선', b2: '글루텐이 없어 속이 편하고 밀가루 대체재로 좋습니다.',
    b3t: '장 건강', b3: '저항성 전분이 유익균을 늘려 변비를 예방합니다.',
    b4t: '면역·부기 완화', b4: '비타민 C와 칼륨이 면역력을 높이고 나트륨을 배출합니다.',
    storeTitle: '세부 판매처', storeLead: '숙소 근처에서 Cassava를 만나보세요.',
    hoursLabel: '영업시간', mapLabel: '지도 보기',
    closedTpl: '{day} 휴무',
    days: { Mon: '월요일', Tue: '화요일', Wed: '수요일', Thu: '목요일', Fri: '금요일', Sat: '토요일', Sun: '일요일' },
    chatLabel: '문의 및 견적',
    footerTag: '세부에서 온 바삭한 카사바칩', contactLabel: '연락처', addressLabel: '주소', inquiryLabel: '문의시간',
  },
  ja: {
    slideTitle: 'セブ旅行のサクサクおやつ',
    slideLead: 'ビーチで楽しむ、サクサクのキャッサバチップス。',
    aboutTitle: 'キャッサバってなに？',
    aboutIntro: 'キャッサバは南米原産の炭水化物が豊富なイモ類で、干ばつに強い救荒作物であり、タピオカパールの原料でもあります。',
    benefitsTitle: '主な効能',
    b1t: '血糖値ケア', b1: 'GI値が低く、血糖値の急上昇を抑え、腹持ちが長く続きます。',
    b2t: '消化にやさしい', b2: 'グルテンを含まないのでお腹にやさしく、小麦粉の代わりにもぴったりです。',
    b3t: '腸の健康', b3: 'レジスタントスターチが善玉菌を増やし、便秘を防ぎます。',
    b4t: '免疫・むくみケア', b4: 'ビタミンCとカリウムが免疫力を高め、ナトリウムの排出を助けます。',
    storeTitle: 'セブの販売店', storeLead: 'ホテルの近くでCassavaを見つけよう。',
    hoursLabel: '営業時間', mapLabel: '地図を見る',
    closedTpl: '{day}定休',
    days: { Mon: '月曜', Tue: '火曜', Wed: '水曜', Thu: '木曜', Fri: '金曜', Sat: '土曜', Sun: '日曜' },
    chatLabel: 'お問い合わせ・お見積もり',
    footerTag: 'セブ生まれのサクサクキャッサバチップス', contactLabel: '連絡先', addressLabel: '住所', inquiryLabel: 'お問い合わせ時間',
  },
  en: {
    slideTitle: 'Your crunchy Cebu break',
    slideLead: 'Crispy cassava chips, made for beach days.',
    aboutTitle: 'What is cassava?',
    aboutIntro: 'Cassava is a carb-rich root crop native to South America — a drought-hardy famine-reserve staple and the raw material for tapioca pearls.',
    benefitsTitle: 'Key benefits',
    b1t: 'Blood sugar balance', b1: 'Its low GI helps prevent blood sugar spikes and keeps you full longer.',
    b2t: 'Easy digestion', b2: 'Gluten-free, gentle on the stomach and a great wheat-flour alternative.',
    b3t: 'Gut health', b3: 'Resistant starch feeds good bacteria and helps prevent constipation.',
    b4t: 'Immunity & less puffiness', b4: 'Vitamin C and potassium support immunity and help flush out sodium.',
    storeTitle: 'Where to buy in Cebu', storeLead: 'Find Cassava near your hotel.',
    hoursLabel: 'Hours', mapLabel: 'Open map',
    closedTpl: 'Closed {day}',
    days: { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri', Sat: 'Sat', Sun: 'Sun' },
    chatLabel: 'Inquiries & Quotes',
    footerTag: 'Crunchy cassava chips from Cebu', contactLabel: 'Contact', addressLabel: 'Address', inquiryLabel: 'Inquiry hours',
  },
};

const LANGS = ['ko', 'ja', 'en'];

function detectLang() {
  try {
    const saved = localStorage.getItem('casava-lang');
    if (LANGS.includes(saved)) return saved;
  } catch (e) { /* storage 막힌 환경 */ }
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : 'en';
}

/* ===== 구글시트 데이터 ===== */
const sheet = { stores: [], contact: {} };
let currentLang = 'en';

// RFC 4180 CSV → 행 배열 (따옴표 안의 쉼표 · 줄바꿈 · "" 처리)
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// CSV 텍스트 → [{제목: 값}] . 필요한 제목 줄이 없으면 null
function toRecords(text, required) {
  const [header = [], ...rows] = parseCSV(text);
  const keys = header.map((h) => h.trim());
  if (!required.every((k) => keys.includes(k))) return null;
  return rows
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));
}

function applySheet(name, records) {
  if (name === 'stores') sheet.stores = records.filter((s) => s.show.toUpperCase() === 'Y' && s.name);
  if (name === 'contact') sheet.contact = Object.fromEntries(records.map((r) => [r.field, r.value]));
}

const isHttpUrl = (url) => /^https?:\/\//.test(url);

// "09:00–21:00 · 월요일 휴무" 처럼 언어에 맞게
function hoursText(open, close, closed, t) {
  const parts = [];
  if (open && close) parts.push(`${open}–${close}`);
  if (t.days[closed]) parts.push(t.closedTpl.replace('{day}', t.days[closed]));
  return parts.join(' · ');
}

function renderStores(t) {
  const el = document.getElementById('stores');
  el.innerHTML = '';
  for (const s of sheet.stores) {
    const card = document.createElement('div');
    card.className = 'store';
    card.innerHTML = `
      <div class="store-area"></div>
      <div class="store-name"></div>
      <div class="store-meta store-address"></div>
      <div class="store-meta store-hours"></div>
      <a class="store-map" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg><span></span>
      </a>`;
    card.querySelector('.store-area').textContent = s.area;
    card.querySelector('.store-name').textContent = s.name;
    card.querySelector('.store-address').textContent = s.address;
    const hours = hoursText(s.open, s.close, s.closed, t);
    card.querySelector('.store-hours').textContent = hours ? `${t.hoursLabel} · ${hours}` : '';
    const map = card.querySelector('.store-map');
    if (isHttpUrl(s.mapUrl)) {
      map.href = s.mapUrl;
      map.querySelector('span').textContent = t.mapLabel;
    } else {
      map.remove();
    }
    el.appendChild(card);
  }
}

// 푸터: data-contact="키" 요소에 Contact 탭 값을 넣는다. 값이 없으면 그 줄을 숨긴다
function renderContact(t) {
  const c = sheet.contact;
  const values = {
    phone: c.phone,
    email: c.email,
    address: c.address,
    inquiry: hoursText(c.inquiryOpen, c.inquiryClose, c.inquiryClosed, t),
  };
  document.querySelectorAll('[data-contact]').forEach((el) => {
    const key = el.dataset.contact;
    const v = values[key] || '';
    el.textContent = v;
    el.hidden = !v;
    if (key === 'phone' && v) el.href = `tel:${v.replace(/[^\d+]/g, '')}`;
    if (key === 'email' && v) el.href = `mailto:${v}`;
  });
  document.querySelectorAll('[data-contact-label]').forEach((el) => {
    el.hidden = !el.dataset.contactLabel.split(' ').some((k) => values[k]);
  });
}

// 사본(data/<탭>.csv)으로 먼저 그리고, 게시된 최신 시트를 읽어 내용이 다르면 다시 그린다
async function setupSheet() {
  const local = {};
  await Promise.all(Object.keys(SHEET_HEADERS).map(async (name) => {
    try {
      local[name] = await (await fetch(`data/${name}.csv`, { cache: 'no-cache' })).text();
      const records = toRecords(local[name], SHEET_HEADERS[name]);
      if (records) applySheet(name, records);
    } catch (e) { /* 사본이 없으면 빈 상태 */ }
  }));
  renderStores(T[currentLang]);
  renderContact(T[currentLang]);

  let sources = {};
  try { sources = await (await fetch('data/sheet.json', { cache: 'no-cache' })).json(); } catch (e) { return; }
  await Promise.all(Object.keys(SHEET_HEADERS).map(async (name) => {
    if (!isHttpUrl(sources[name] || '')) return;
    try {
      const res = await fetch(sources[name]);
      if (!res.ok) return;
      const text = await res.text();
      const same = (a) => a.replace(/\r\n/g, '\n').trim();
      if (same(text) === same(local[name] || '')) return;
      const records = toRecords(text, SHEET_HEADERS[name]);
      if (!records) return; // 제목 줄이 깨진 시트는 무시
      applySheet(name, records);
      if (name === 'stores') renderStores(T[currentLang]);
      if (name === 'contact') renderContact(T[currentLang]);
    } catch (e) { /* 구글이 느리거나 막혀도 사본 그대로 */ }
  }));
}

function setLang(lang) {
  const t = T[lang];
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t[el.dataset.i18n] ?? ''; });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const v = t[el.dataset.i18nAria] ?? '';
    el.setAttribute('aria-label', v);
    el.title = v;
  });
  document.querySelectorAll('.lang-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderStores(t);
  renderContact(t);
  try { localStorage.setItem('casava-lang', lang); } catch (e) { /* ignore */ }
}

// 슬라이드: data/slides.json 목록을 섞어서 채우고, 무한 루프를 위해 한 번 복제 (CSS가 -50% 까지 이동)
async function setupMarquee() {
  const track = document.querySelector('.marquee-track');
  let srcs = [];
  try {
    srcs = await (await fetch('data/slides.json', { cache: 'no-cache' })).json();
  } catch (e) { return; }
  for (let i = srcs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [srcs[i], srcs[j]] = [srcs[j], srcs[i]];
  }
  for (const pass of [0, 1]) {
    for (const src of srcs) {
      const img = document.createElement('img');
      img.className = 'slide';
      img.src = src;
      img.width = 800;
      img.height = 800;
      img.alt = '';
      img.loading = 'lazy';
      if (pass) img.setAttribute('aria-hidden', 'true');
      track.appendChild(img);
    }
  }
  track.style.setProperty('--slides', srcs.length); // 장수가 늘어도 흐르는 속도는 일정하게
}

// TOP 버튼: 한 화면 이상 내려가면 표시
function setupToTop() {
  const btn = document.querySelector('.to-top');
  const onScroll = () => btn.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 문의 버튼: links.json 의 키와 data-link 가 같은 버튼에 링크를 넣고 보이게 한다. 값이 없으면 숨긴 채로 둔다
async function setupLinks() {
  try {
    const res = await fetch('data/links.json', { cache: 'no-cache' });
    const links = await res.json();
    document.querySelectorAll('[data-link]').forEach((el) => {
      const url = links[el.dataset.link];
      if (typeof url === 'string' && /^https?:\/\//.test(url)) {
        el.href = url;
        el.hidden = false;
      }
    });
  } catch (e) { /* 파일을 못 읽으면 버튼은 숨긴 채로 둔다 */ }
}

setupLinks();
document.querySelectorAll('.lang-btn').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
setupMarquee();
setupToTop();
setLang(detectLang());
setupSheet();
