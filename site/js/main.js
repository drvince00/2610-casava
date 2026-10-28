/* ===== 설정 (실제 정보로 교체) ===== */
// 문의 링크(카카오톡 · 메신저)는 data/links.json 에서 읽는다

// 판매처 목록. name/address/hours/mapUrl 은 실제 정보로 교체
const STORES = [
  { area: 'Mactan',    name: '[STORE NAME]', address: '[ADDRESS]', hours: '[HOURS]', mapUrl: '#' },
  { area: 'Cebu City', name: '[STORE NAME]', address: '[ADDRESS]', hours: '[HOURS]', mapUrl: '#' },
  { area: 'Moalboal',  name: '[STORE NAME]', address: '[ADDRESS]', hours: '[HOURS]', mapUrl: '#' },
  { area: '[AREA]',    name: '[STORE NAME]', address: '[ADDRESS]', hours: '[HOURS]', mapUrl: '#' },
];

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
    storeTitle: '세부 판매처', storeLead: '숙소 근처에서 Casava를 만나보세요.',
    hoursLabel: '영업시간', mapLabel: '지도 보기',
    kakao: '카카오톡으로 문의하기', messenger: '메신저로 문의하기',
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
    storeTitle: 'セブの販売店', storeLead: 'ホテルの近くでCasavaを見つけよう。',
    hoursLabel: '営業時間', mapLabel: '地図を見る',
    kakao: 'カカオトークで問い合わせ', messenger: 'Messengerで問い合わせ',
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
    storeTitle: 'Where to buy in Cebu', storeLead: 'Find Casava near your hotel.',
    hoursLabel: 'Hours', mapLabel: 'Open map',
    kakao: 'Chat with us on KakaoTalk', messenger: 'Chat with us on Messenger',
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

function renderStores(t) {
  const el = document.getElementById('stores');
  el.innerHTML = '';
  for (const s of STORES) {
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
    card.querySelector('.store-hours').textContent = `${t.hoursLabel} · ${s.hours}`;
    const map = card.querySelector('.store-map');
    map.href = s.mapUrl;
    map.querySelector('span').textContent = t.mapLabel;
    el.appendChild(card);
  }
}

function setLang(lang) {
  const t = T[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t[el.dataset.i18n] ?? ''; });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const v = t[el.dataset.i18nAria] ?? '';
    el.setAttribute('aria-label', v);
    el.title = v;
  });
  document.querySelectorAll('.lang-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  renderStores(t);
  try { localStorage.setItem('casava-lang', lang); } catch (e) { /* ignore */ }
}

// 슬라이드 무한 루프: 트랙 내용을 한 번 복제 (CSS가 -50% 까지 이동)
function setupMarquee() {
  const track = document.querySelector('.marquee-track');
  [...track.children].forEach((node) => {
    const clone = node.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
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
