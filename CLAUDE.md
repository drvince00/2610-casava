# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

세부(필리핀) 관광객(한·일·영)을 대상으로 한 카사바칩 `CASSAVA CHIP` 한 장짜리 랜딩페이지. **빌드 없는 정적 사이트**(HTML/CSS/vanilla JS). 테스트·린트 도구는 없음.

요구사항, 확정된 결정 사항, 디자인 토큰, 남은 TODO는 모두 [PRD.md](PRD.md)에 있으니 작업 전에 먼저 읽을 것. 결정 사항이 바뀌면 PRD.md의 "3. 확정된 결정 사항" / "7. 남은 일"도 함께 갱신한다.

## 명령어

```bash
npm run dev       # serve site -l 3000  → http://localhost:3000
npm run render    # ads/*.html → PNG 재생성 (01·04 → site/images, 02·03 → images/slides-src, og → site/og.png). 일부만: npm run render -- og 02. Playwright Chromium 필요
npm run slides    # images/slides-src → site/images/slides/*.webp (800px 정사각 크롭) + site/data/slides.json. Python Pillow 필요
npm run sheet     # 구글시트(웹에 게시된 CSV) → site/data/stores.csv · contact.csv 사본 갱신. 제목 줄이 깨졌으면 저장 안 함
```

`render`는 Google Fonts를 불러오므로 인터넷 연결이 필요하다.

## 배포

- GitHub `drvince00/2610-casava` (public) ↔ Cloudflare Pages Git 연동. **`main`에 push하면 자동 배포** (빌드 명령 없음, 출력 디렉터리 `site`).
- 프로덕션: https://2610-casava.pages.dev — `<hash>.2610-casava.pages.dev`는 개별 배포 고정 URL이라 확인용으로 쓰지 말 것.
- 공개 저장소이므로 라이선스 없는 이미지(Adobe Stock 미리보기 `images/1000_F_*` 등)는 커밋하지 않는다 (`.gitignore` 처리됨).

## 구조

- `site/` — 배포 대상 그 자체 (빌드 산출물이 아니라 원본). 배포 시 이 폴더를 그대로 업로드.
  - `css/style.css` — 색·폰트·글자 크기 토큰이 전부 `:root`에 있음. 폰트 세트와 크기는 `<html data-font-set="pop|friendly|comic">`, `<html data-scale="s|m|l">` 속성으로 전환. 일본어는 `html[lang="ja"]` 셀렉터가 폰트 스택을 바꿈.
  - `js/main.js` — 시트 제목 줄 정의(`SHEET_HEADERS`)와 다국어 문구 `T = { ko, ja, en }`가 맨 위에 있음.
  - `data/sheet.json`, `data/stores.csv`, `data/contact.csv` — 판매처 · 푸터 연락처는 **구글시트 "CASSAVA CHIP 사이트 정보"**(개발자 drvince00 소유, 고객이 편집)의 Stores · Contact 탭에서 온다. `sheet.json`은 게시된 CSV 주소, `*.csv`는 `npm run sheet`로 받은 사본. 페이지는 사본으로 즉시 그린 뒤 게시된 시트를 읽어 내용이 다르면 다시 그린다 (구글 응답 ~2초, 장애 시 사본 유지, 필수 제목 줄이 없으면 무시). 시트 입력은 영어만 — 휴무일 · 시간 문구는 `T.days` / `T.closedTpl`로 언어별 생성.
  - `data/links.json` — 문의 링크(카카오톡 · 메신저). 소스에 하드코딩하지 않는다. 키가 `data-link="키"` 버튼과 매칭되고, 값이 비었거나 http(s)가 아니면 버튼이 숨겨진다. `fetch`로 읽으므로 `index.html`을 파일로 직접 열면 버튼이 안 보인다 — 반드시 `npm run dev`로 확인.
  - `images/slides/*.webp`, `data/slides.json` — **`npm run slides`의 산출물. 직접 고치지 말 것.**
- `ads/` — 광고 4장(1080×1080) 단독 HTML 원본 + `render.mjs`. **광고 PNG는 여기서 생성된 산출물**이므로 광고를 고칠 땐 HTML을 수정하고 `npm run render`로 재생성한다 (02·03을 고쳤으면 이어서 `npm run slides`). 매핑은 `render.mjs`의 `ads` 배열.
- `design-source/` — Claude 디자인 캔버스 원본(`.dc.html`, `canvas.json`). 실행용이 아닌 참고 자료이며 수정하지 않는다.
- `images/` — 배포되지 않는 원본 보관용. `images/slides-src/`는 슬라이드 원본(무료 상업 이용 사진: Unsplash · Pexels · Pixabay + 광고 02·03). 슬라이드 추가/교체는 여기에 파일을 넣거나 빼고 `npm run slides`.

## 다국어 동작 (main.js)

- 정적 문구는 HTML의 `data-i18n="키"`(textContent) / `data-i18n-aria="키"`(aria-label + title)로 `T`에 연결된다. 문구를 추가하면 **ko·ja·en 세 언어 모두**에 키를 넣을 것.
- 판매처 카드와 푸터 연락처는 HTML에 없고 `renderStores()` / `renderContact()`가 시트 데이터로 언어 전환 시마다 다시 그린다. 시트는 외부 입력이므로 **textContent로만 넣는다** (innerHTML에 데이터 넣지 말 것). 지도 · 전화 · 메일 링크도 형식을 확인한 뒤에만 href에 넣는다.
- 언어 결정: localStorage `casava-lang` → 브라우저 언어 → `en`. `setLang()`이 `<html lang>`도 바꿔서 폰트가 따라 바뀐다.
- 슬라이드: `setupMarquee()`가 `data/slides.json`을 읽어 **페이지를 열 때마다 순서를 섞고**, 같은 목록을 한 번 더 붙여(aria-hidden) CSS 애니메이션이 -50%까지 이동하는 무한 루프를 만든다. 애니메이션 시간은 `--slides`(장수) × 9초라 장수가 바뀌어도 속도는 일정.

## 지켜야 할 결정 사항

- 배경에 **방사형 줄무늬(햇살 무늬) 사용 금지** (욱일기 연상 우려). 배경 무늬는 해변/바다/수평선/모래사장.
- 표현은 "두툼한" 대신 "바삭한"(サクサク / Crispy).
- 카카오톡 버튼은 아이콘만 표시, 문구는 aria-label에만.
- 카사바 설명 영역과 슬라이드 리드 문구는 굵은 고딕(Noto Sans KR/JP 700·900).
- 스타일: 레트로 미국 스낵 광고/만화풍 — 굵은 검정 테두리 + 오프셋 그림자 + 둥근 모서리.
- 효능 문구는 광고 규제(필리핀 FDA·식약처) 소지가 있어 배포 전 재검토 대상 (PRD.md 8절).
