# CASSAVA CHIP 랜딩페이지 — PRD / Handoff

> Claude 디자인 캔버스에서 시안을 확정하고 Claude Code로 넘기는 문서입니다.
> 이 문서와 `site/` 폴더만 있으면 바로 이어서 작업할 수 있습니다.

## 0. 폴더 구성

```
casava-handoff/
├─ PRD.md                ← 이 문서 (요구사항 + 결정 사항 + 남은 일)
├─ site/                 ← 바로 열리는 정적 사이트 초안 (HTML/CSS/JS, 빌드 없음)
│  ├─ index.html
│  ├─ css/style.css      ← 색·폰트·크기 토큰 전부 여기 :root 에 있음
│  ├─ js/main.js         ← 다국어 문구, 판매처 목록, 카카오 링크 설정
│  └─ images/            ← 01·04 고정 이미지 + slides/ 슬라이드 WebP (npm run slides 산출물)
├─ ads/                  ← 광고 4장 원본 (1080×1080, 단독 HTML) + render.mjs (PNG 재생성)
└─ design-source/        ← 디자인 캔버스 원본 (.dc.html, canvas.json) — 참고용, 실행 X
```

로컬 확인: `site/index.html` 을 브라우저로 열거나 `npx serve site`.

## 1. 개요

- **제품:** 카사바칩 (브랜드 표기: 헤더 `CASSAVA CHIP`, 그 외 `Cassava`)
- **판매처:** 필리핀 세부
- **타깃:** 세부에 휴가 온 관광객 (한국인 · 일본인 · 영어권)
- **목적:** 제품 홍보 + 판매처 안내 + 카카오톡 문의 유도
- **형태:** 한 장짜리 스크롤 랜딩페이지, 반응형 (모바일 우선으로 자연스럽게)

## 2. 화면 구성 (위 → 아래)

| # | 구간 | 내용 |
|---|---|---|
| 공통 | 헤더 (sticky) | 좌측 상단 `CASSAVA CHIP` = 홈(맨 위로) / 우측 상단 국기 3개 = 언어 토글 (🇰🇷 한국어 · 🇯🇵 일본어 · 🇺🇸 영어) |
| 1 | Hero | `images/01-crunch-time.png` 고정 이미지 (최대 760px, 굵은 테두리 + 그림자) |
| 2 | 슬라이드 + 카사바 설명 | 제목/리드 문구 → 이미지가 **우→좌로 끊김 없이 천천히 흐름** (장당 9초 속도, 페이지 열 때마다 순서 랜덤, 마우스 올리면 일시정지) → 카사바 설명 카드: 소개 1줄 + "주요 효능" 카드 4장 |
| 3 | 판매처 | 판매처 카드 그리드 (지역 태그 · 매장명 · 주소 · 영업시간 · 지도 링크) + **카카오톡 · 메신저 아이콘 버튼 2개** + 그 아래 공통 문구 "문의 및 견적" 하나 |
| 4 | Tropics | `images/04-born-in-the-tropics.png` 고정 이미지 |
| 공통 | Footer | 로고, 연락처(전화 · 이메일), 주소, **문의시간**, 저작권 |
| 공통 | 플로팅 | 우측 하단 빨간 원형 `TOP` 버튼 (스크롤 60% 이상 내려가면 나타남) |

## 3. 확정된 결정 사항 (변경 이력)

- 광고 01 · 03 배경의 방사형 햇살 무늬 → **욱일기 연상** 우려로 제거. 물방울 무늬도 날아가는 칩과 헷갈려 제거 → **해변 / 바다 / 수평선 / 모래사장** 무늬로 확정. *앞으로도 방사형 줄무늬 사용 금지.*
- 상단 로고 `Casava` → `CASAVA CHIP` → (2026-10-29) 브랜드 철자를 작물명과 같은 **`Cassava`(s 2개)** 로 확정: 헤더 `CASSAVA CHIP`, 그 외 `Cassava`. 광고 봉지의 `CASSAVA CHIPS` 와도 일치. (내부 키 `casava-lang`, 저장소·도메인 `2610-casava` 는 유지)
- "두툼한/두툼하게" 표현 → "바삭한/바삭하게" (일: サクサク, 영: Crispy)
- 카카오톡 버튼: "카카오톡으로 문의하기" 글자 제거, 말풍선 아이콘만. 아래 "재고 확인 · 판매처 문의" 문구도 제거.
- 문의 버튼(2026-10-28): 카카오톡 + 페이스북 메신저 2개만 (페이스북 페이지 버튼은 넣지 않음). 버튼별 문구 없이 버튼 아래 **공통 문구 "문의 및 견적"**(일: お問い合わせ・お見積もり, 영: Inquiries & Quotes) 하나. aria-label 은 브랜드명만(KakaoTalk / Messenger).
- 문의 링크는 실수로 눌러도 대화가 시작되지 않게: 카카오는 채팅방이 아닌 **채널 홈**, 메신저는 `m.me` (대화창만 열림, 미리 채운 문구 없음).
- 카사바 설명: 사용자가 준 요약문 + 효능 4개로 교체, **설명 영역과 슬라이드 리드 문구는 굵은 고딕(Noto Sans KR/JP 700·900)** — 명조 느낌 X
- 푸터: 카카오톡 줄 제거, "영업시간" → "문의시간" (판매처 카드의 "영업시간"은 매장 운영시간이라 유지)

## 4. 디자인 토큰

### 4-1. 색
| 이름 | 값 | 용도 |
|---|---|---|
| ink | `#1B1B1B` | 테두리, 글자, 그림자 |
| cream | `#FFF4D6` | 기본 배경 |
| yellow | `#FFD23F` | Hero 배경, 강조 |
| red | `#E63323` | 로고, 제목, TOP 버튼 |
| teal | `#22A9B8` | 판매처 섹션 배경 |
| sand | `#FFE9B0` | 04 섹션 배경 |
| kakao | `#FEE500` | 카카오 버튼 |

스타일 키워드: 레트로 미국 스낵 광고 · 만화 · **굵은 검정 테두리 + 오프셋 그림자(4~10px)** · 둥근 모서리.

### 4-2. 폰트 (Google Fonts)
라틴 폰트를 먼저 쓰고, 한글/일본어 글자는 다음 폰트로 넘어가게 스택을 구성 (`style.css` 참고).

| 세트 | 제목 (EN / KO / JA) | 본문 (EN / KO / JA) |
|---|---|---|
| **A · Retro Pop (현재 적용)** | Luckiest Guy / Black Han Sans / Dela Gothic One | Fredoka / Gowun Dodum / M PLUS Rounded 1c |
| B · Friendly | Lilita One / Jua / Mochiy Pop One | Nunito / Gowun Dodum / Kosugi Maru |
| C · Comic | Bangers / Do Hyeon / Rampart One | Fredoka / Nanum Gothic / M PLUS Rounded 1c |
| 설명 영역 고정 | — | Noto Sans KR · Noto Sans JP (700 / 900) |

세트 변경: `<html data-font-set="friendly|comic">` + index.html 폰트 링크에 해당 패밀리 추가.

### 4-3. 글자 크기 (`<html data-scale="s|m|l">`, 기본 m)
| 요소 | S ×0.9 | **M ×1.0** | L ×1.12 |
|---|---|---|---|
| 섹션 제목 (PC / 모바일) | 54 / 31px | 60 / 34px | 67 / 38px |
| 소제목 | 27px | 30px | 34px |
| 본문 | 15px | 17px | 19px |
| 작은 글씨 | 14px | 15px | 17px |

## 5. 다국어

- 모든 문구는 `site/js/main.js` 의 `T = { ko, ja, en }` 에 있음. HTML은 `data-i18n="키"` 로 연결.
- 첫 방문 시 브라우저 언어로 자동 선택 (ko/ja 외에는 en), 이후 선택은 localStorage `casava-lang` 에 저장.
  - ※ 디자인 시안은 기본 한국어였음. 한국어 고정 시작을 원하면 `detectLang()` 수정.
- `<html lang>` 도 같이 바뀜 → 일본어일 때 일본어 폰트로 자동 전환.

## 6. 이미지 자산

| 파일 | 위치 | 비고 |
|---|---|---|
| `images/01-crunch-time.png` | Hero | 1080×1080 |
| `images/04-born-in-the-tropics.png` | 섹션 4 | 1080×1080 |
| `images/slides/*.webp` | 슬라이드 | 원본은 `images/slides-src/` (무료 사진 7장 + 광고 02·03). `npm run slides` 로 800px 정사각 WebP + `data/slides.json` 생성 |

- 슬라이드는 가운데 기준 정사각 크롭 (CSS `object-fit: cover` 로 280px / 768px 이상 400px 표시). 추가·교체는 `images/slides-src/` 에 파일을 넣거나 빼고 `npm run slides`.
- 광고를 고친 뒤 PNG 재생성: `npm i -D playwright && npx playwright install chromium && node ads/render.mjs`
- 배포 전 WebP 변환 + `srcset` (540/1080) 권장 — 현재 PNG 1장당 약 220~280KB.

## 7. 남은 일 (TODO)

- [x] **카카오톡 채널 URL** → `site/data/links.json` 의 `kakao` (2026-10-28 연결 — 채팅방 직행 대신 채널 홈으로 링크)
- [x] **페이스북 메신저 URL** → `site/data/links.json` 의 `messenger` (2026-10-28 연결, 페이지 ID `61568543280425`)
- [ ] **판매처 실제 정보** (매장명 · 주소 · 영업시간 · 구글맵 링크) → `main.js` 의 `STORES`
  - 지역 태그 Mactan / Cebu City / Moalboal 는 예시. 실제 지역으로 교체
- [ ] 푸터: `[PHONE]` `[EMAIL]` `[ADDRESS]` `[HOURS]`(문의시간) 교체
- [ ] 04 광고 안의 `AVAILABLE AT [YOUR STORE]` 문구 확정 후 `ads/04-born-in-the-tropics.html` 수정 → PNG 재생성
- [x] 슬라이드 실제 이미지 교체 (2026-10-29, 9장 랜덤 순서)
- [x] 브랜드 철자 확정: `Cassava` (2026-10-29)
- [ ] 푸터 로고를 `CASSAVA CHIP` 으로 맞출지 결정 (현재 `Cassava`)
- [x] 파비콘 (2026-10-29, 광고 02 선글라스 카사바칩 얼굴: `favicon.svg` · `favicon.ico` · `apple-touch-icon.png`)
- [ ] OG 이미지(공유 썸네일), `<title>`/description 언어별 대응
- [ ] 배포 (예: Cloudflare Pages — 빌드 없이 `site/` 폴더 그대로 업로드 가능)

## 8. ⚠️ 주의: 효능 문구

현재 효능 문구(혈당 관리, 변비 예방, 면역력 향상 등)는 **사용자 요청대로 그대로 반영**했지만, 다음 이유로 배포 전에 재검토를 권장합니다.

- 대부분 **생 카사바 뿌리** 기준의 이야기라 **튀긴 칩**에는 거의 해당되지 않음 (튀기면 GI 상승, 비타민 C 대부분 파괴)
- "혈당 급상승을 막는다 / 변비를 예방한다 / 면역력을 높인다"는 질병 예방·치료 효능처럼 읽혀 **필리핀 FDA·한국 식약처 광고 기준**에 걸릴 소지가 있음
- 대안: "카사바는 ~한 특징을 가진 작물입니다"처럼 **원재료 소개 톤**으로 완화

## 9. 디자인 원본

- Claude 디자인 캔버스: https://claude.ai/code/artifact/3bbf33a4-daeb-4593-98d5-d2d23b5cbe4c
- `design-source/` 의 `.dc.html` 은 캔버스 전용 포맷(실행용 아님). 레이아웃·문구 확인용 참고 자료.
  - `Landing.dc.html` = PC/모바일 공통 랜딩 시안, `TypeOptions.dc.html` = 폰트·크기 비교표
