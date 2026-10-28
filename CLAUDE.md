# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

세부(필리핀) 관광객(한·일·영)을 대상으로 한 카사바칩 `CASAVA CHIP` 한 장짜리 랜딩페이지. **빌드 없는 정적 사이트**(HTML/CSS/vanilla JS). 테스트·린트 도구는 없음.

요구사항, 확정된 결정 사항, 디자인 토큰, 남은 TODO는 모두 [PRD.md](PRD.md)에 있으니 작업 전에 먼저 읽을 것. 결정 사항이 바뀌면 PRD.md의 "3. 확정된 결정 사항" / "7. 남은 일"도 함께 갱신한다.

## 명령어

```bash
npm run dev       # serve site -l 3000  → http://localhost:3000
npm run render    # ads/*.html → site/images/*.png 재생성 (Playwright Chromium 필요: npx playwright install chromium)
```

`render`는 Google Fonts를 불러오므로 인터넷 연결이 필요하다.

## 배포

- GitHub `drvince00/2610-casava` (public) ↔ Cloudflare Pages Git 연동. **`main`에 push하면 자동 배포** (빌드 명령 없음, 출력 디렉터리 `site`).
- 프로덕션: https://2610-casava.pages.dev — `<hash>.2610-casava.pages.dev`는 개별 배포 고정 URL이라 확인용으로 쓰지 말 것.
- 공개 저장소이므로 라이선스 없는 이미지(Adobe Stock 미리보기 `images/1000_F_*` 등)는 커밋하지 않는다 (`.gitignore` 처리됨).

## 구조

- `site/` — 배포 대상 그 자체 (빌드 산출물이 아니라 원본). 배포 시 이 폴더를 그대로 업로드.
  - `css/style.css` — 색·폰트·글자 크기 토큰이 전부 `:root`에 있음. 폰트 세트와 크기는 `<html data-font-set="pop|friendly|comic">`, `<html data-scale="s|m|l">` 속성으로 전환. 일본어는 `html[lang="ja"]` 셀렉터가 폰트 스택을 바꿈.
  - `js/main.js` — 설정(`KAKAO_URL`, `STORES`)과 다국어 문구 `T = { ko, ja, en }`가 맨 위에 있음.
- `ads/` — 광고 4장(1080×1080) 단독 HTML 원본 + `render.mjs`. **`site/images/`의 PNG는 여기서 생성된 산출물**이므로 광고를 고칠 땐 HTML을 수정하고 `npm run render`로 재생성한다. (01·04는 각각 Hero/섹션4 이미지와 슬라이드에 동시에 쓰임 — 매핑은 `render.mjs`의 `ads` 배열)
- `design-source/` — Claude 디자인 캔버스 원본(`.dc.html`, `canvas.json`). 실행용이 아닌 참고 자료이며 수정하지 않는다.
- `images/` — 원본 스톡/시안 이미지 보관용. 사이트에서 직접 참조하지 않음.

## 다국어 동작 (main.js)

- 정적 문구는 HTML의 `data-i18n="키"`(textContent) / `data-i18n-aria="키"`(aria-label + title)로 `T`에 연결된다. 문구를 추가하면 **ko·ja·en 세 언어 모두**에 키를 넣을 것.
- 판매처 카드는 HTML에 없고 `renderStores()`가 `STORES`로 언어 전환 시마다 다시 그린다 (textContent로 넣어 XSS 방지 — innerHTML에 데이터 넣지 말 것).
- 언어 결정: localStorage `casava-lang` → 브라우저 언어 → `en`. `setLang()`이 `<html lang>`도 바꿔서 폰트가 따라 바뀐다.
- 슬라이드 무한 루프는 `setupMarquee()`가 `.marquee-track` 자식을 한 번 복제하고 CSS 애니메이션이 -50%까지 이동하는 방식. 슬라이드 추가는 `index.html`에 `<img class="slide">`만 넣으면 된다.

## 지켜야 할 결정 사항

- 배경에 **방사형 줄무늬(햇살 무늬) 사용 금지** (욱일기 연상 우려). 배경 무늬는 해변/바다/수평선/모래사장.
- 표현은 "두툼한" 대신 "바삭한"(サクサク / Crispy).
- 카카오톡 버튼은 아이콘만 표시, 문구는 aria-label에만.
- 카사바 설명 영역과 슬라이드 리드 문구는 굵은 고딕(Noto Sans KR/JP 700·900).
- 스타일: 레트로 미국 스낵 광고/만화풍 — 굵은 검정 테두리 + 오프셋 그림자 + 둥근 모서리.
- 효능 문구는 광고 규제(필리핀 FDA·식약처) 소지가 있어 배포 전 재검토 대상 (PRD.md 8절).
