# 아바타 빌더 - 메모지 스타일

아이폰 메모지와 유사한 스타일의 웹 기반 아바타 에디터입니다. 바닐라 JavaScript와 SVG 레이어 기반으로 구현되어 프레임워크 없이 빠르고 가볍게 동작합니다.

## 특징

✨ **풍부한 커스터마이징 옵션**
- 얼굴형 (5가지)
- 피부색 (6가지)
- 머리스타일 (5가지) + 색상 (8가지)
- 눈 (5가지) + 색상 (7가지)
- 눈썹 (5가지) + 색상 (5가지)
- 코 (5가지)
- 입 (5가지) + 색상 (5가지)
- 귀 (4가지)
- 상의 (5가지) + 색상 (8가지)

🎯 **핵심 기능**
- 실시간 미리보기
- Undo/Redo (최대 10단계)
- 로컬 스토리지 자동 저장/복원
- 무작위 생성 (전체/부분)
- PNG/SVG 내보내기
- 프리셋 저장/불러오기
- JSON 공유 기능

♿ **접근성**
- 키보드 내비게이션 완전 지원
- ARIA 속성으로 스크린리더 호환
- WCAG 색상 대비 가이드라인 준수

📱 **반응형 디자인**
- 모바일/태블릿/데스크탑 자동 대응
- 1열(모바일) → 2열(태블릿) → 2열(데스크탑) 레이아웃

## 설치 및 실행

### 방법 1: 로컬 실행

1. 저장소 클론 또는 파일 다운로드
```bash
git clone [repository-url]
cd avatar-builder
```

2. 웹 브라우저에서 `index.html` 파일을 직접 열기
   - 파일 탐색기에서 `index.html`을 더블클릭
   - 또는 브라우저의 "파일 열기" 메뉴 사용

### 방법 2: 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (npx http-server 필요)
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속

### 방법 3: 단일 파일 버전

`avatar-builder-standalone.html` 파일을 브라우저에서 열면 즉시 사용 가능합니다.

## 프로젝트 구조

```
/avatar-builder
  ├── index.html      # HTML 구조
  ├── styles.css      # 스타일시트
  ├── main.js         # 메인 로직 (상태관리, 렌더링, 상호작용)
  ├── assets/         # (향후 확장용)
  │   └── parts.svg   # SVG 심볼 모음
  └── README.md       # 이 문서
```

## 사용 방법

### 기본 조작

1. **옵션 선택**: 각 파트별 섹션에서 원하는 스타일 클릭
2. **색상 변경**: 색상 팔레트에서 원하는 색상 클릭
3. **무작위 생성**: 
   - "전체 무작위" 버튼: 모든 파트를 한 번에 랜덤화
   - 각 파트의 "무작위" 버튼: 해당 파트만 랜덤화

### 히스토리 관리

- **실행취소**: 헤더의 "↶ 실행취소" 버튼 또는 `Ctrl+Z` (Mac: `Cmd+Z`)
- **다시실행**: 헤더의 "↷ 다시실행" 버튼 또는 `Ctrl+Shift+Z` (Mac: `Cmd+Shift+Z`)
- 최대 10단계까지 실행취소/재실행 가능

### 저장 및 내보내기

**자동 저장**
- 모든 변경사항은 자동으로 브라우저의 로컬 스토리지에 저장됩니다
- 페이지를 새로고침해도 마지막 상태가 복원됩니다

**프리셋**
- "저장" 버튼: 현재 아바타를 프리셋으로 저장
- "불러오기" 버튼: 저장된 프리셋 목록에서 선택
- "JSON 복사" 버튼: 현재 설정을 JSON으로 복사 (공유용)

**내보내기**
- "PNG 다운로드": 512x512 PNG 이미지로 내보내기
  - "투명 배경" 체크박스로 배경 투명/흰색 선택 가능
- "SVG 다운로드": 벡터 SVG 파일로 내보내기

### 키보드 단축키

- `Tab`: 다음 요소로 이동
- `Shift+Tab`: 이전 요소로 이동
- `Enter/Space`: 선택된 버튼 클릭
- `Ctrl+Z` / `Cmd+Z`: 실행취소
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: 다시실행

## 기술 스펙

### 렌더링

- **SVG 레이어 기반**: 각 파트는 독립적인 `<g>` 그룹으로 관리
- **CSS 변수 활용**: 색상 변경 시 CSS 커스텀 속성으로 동적 적용
- **레이어 순서**: 
  1. faceShape (얼굴형)
  2. ears (귀)
  3. skinTone (피부톤)
  4. hairBack (뒷머리)
  5. eyebrows (눈썹)
  6. eyes (눈)
  7. nose (코)
  8. mouth (입)
  9. top (상의)
  10. hair (앞머리)

### 상태 관리

```javascript
const avatarState = {
  faceShape: { id: 'oval' },
  skinTone: { id: 'tone1', color: '#FFDFC4' },
  hair: { id: 'short_01', color: '#2C1B18' },
  eyes: { id: 'normal', color: '#2C1B18' },
  eyebrows: { id: 'normal', color: '#2C1B18' },
  nose: { id: 'normal' },
  mouth: { id: 'smile', color: '#D4686B' },
  ears: { id: 'normal' },
  top: { id: 'tshirt', color: '#FF6B6B' }
};
```

- 모든 UI 변경은 `avatarState` 객체 수정 → `renderAvatar(state)` 호출
- 불변성을 유지하며 히스토리 스택 관리

### 성능 최적화

- SVG 인라인 렌더링으로 HTTP 요청 최소화
- CSS 변수로 스타일 재계산 최소화
- 히스토리는 최대 10단계로 메모리 관리

## 새 파트 추가 방법

### 1. ASSETS에 SVG 정의 추가

`main.js`의 `ASSETS` 객체에 새 파트 추가:

```javascript
const ASSETS = {
  // ... 기존 파트들 ...
  
  glasses: {  // 새 파트: 안경
    none: ``,  // 안경 없음
    round: `<circle cx="210" cy="260" r="20" fill="none" stroke="black" stroke-width="2"/>
            <circle cx="302" cy="260" r="20" fill="none" stroke="black" stroke-width="2"/>
            <line x1="230" y1="260" x2="282" y2="260" stroke="black" stroke-width="2"/>`,
    square: `<rect x="190" y="240" width="40" height="40" fill="none" stroke="black" stroke-width="2"/>
             <rect x="282" y="240" width="40" height="40" fill="none" stroke="black" stroke-width="2"/>
             <line x1="230" y1="260" x2="282" y2="260" stroke="black" stroke-width="2"/>`
  }
};
```

### 2. 색상 팔레트 추가 (필요시)

```javascript
const COLORS = {
  // ... 기존 색상들 ...
  glasses: ['#000000', '#4A4A4A', '#8B4513', '#FFD700']
};
```

### 3. 초기 상태 추가

```javascript
let avatarState = {
  // ... 기존 파트들 ...
  glasses: { id: 'none', color: '#000000' }
};
```

### 4. HTML에 UI 섹션 추가

`index.html`의 편집 패널에 추가:

```html
<div class="part-section">
  <div class="part-title">👓 안경</div>
  <div class="options-grid" id="glassesOptions"></div>
  <div class="color-palette" id="glassesColorOptions"></div>
</div>
```

### 5. SVG 레이어 추가

`index.html`의 `<svg>` 내부에 레이어 추가 (순서 고려):

```html
<svg id="avatarPreview" viewBox="0 0 512 512">
  <!-- ... 기존 레이어들 ... -->
  <g data-part="glasses"></g>  <!-- 적절한 위치에 추가 -->
</svg>
```

### 6. setupUI() 함수에 초기화 로직 추가

`main.js`의 `setupUI()` 함수에 추가:

```javascript
function setupUI() {
  // ... 기존 초기화 ...
  
  // 안경
  createOptions('glassesOptions', Object.keys(ASSETS.glasses), 'glasses', (id) => {
    applyOption('glasses', { ...avatarState.glasses, id });
  });
  createColorOptions('glassesColorOptions', COLORS.glasses, (color) => {
    applyColor('glasses', color);
  });
}
```

### 7. renderAvatar() 함수에 렌더링 로직 추가

```javascript
function renderAvatar(state) {
  // ... 기존 렌더링 ...
  
  svg.style.setProperty('--glasses-color', state.glasses.color);
  renderPart('glasses', ASSETS.glasses[state.glasses.id]);
}
```

### 8. 무작위 생성 함수 업데이트

```javascript
function randomizeAll() {
  const glassesStyles = Object.keys(ASSETS.glasses);
  
  avatarState = {
    // ... 기존 파트들 ...
    glasses: { 
      id: glassesStyles[Math.floor(Math.random() * glassesStyles.length)],
      color: COLORS.glasses[Math.floor(Math.random() * COLORS.glasses.length)]
    }
  };
  
  // ...
}
```

## 브라우저 호환성

- ✅ Chrome/Edge (최신 2버전)
- ✅ Firefox (최신 2버전)
- ✅ Safari (최신 2버전)
- ✅ 모바일 Safari (iOS 13+)
- ✅ Chrome Mobile (Android)

## 라이선스

이 프로젝트는 교육 및 개인 사용 목적으로 제공됩니다.

### 샘플 에셋 라이선스

- 모든 SVG 에셋은 간단한 기하학적 도형으로 구성되어 있습니다
- 저작권 문제 없는 기본 도형 예시로 제공됩니다
- 상업적 사용을 원하신다면 고유한 에셋으로 교체하시기 바랍니다

## 확장 가능성

### 현재 구조의 장점

- ✅ 프레임워크 독립적 (바닐라 JS)
- ✅ 모듈화된 파트 시스템
- ✅ 확장 가능한 색상 시스템
- ✅ 플러그인 방식의 에셋 추가

### 향후 개선 가능 사항

- [ ] React/Vue 버전 구현
- [ ] 애니메이션 효과 추가
- [ ] 배경 커스터마이징
- [ ] 더 많은 파트와 스타일
- [ ] AI 기반 자동 생성
- [ ] 소셜 공유 기능
- [ ] WebGL 3D 렌더링
- [ ] 실시간 협업 편집

## 트러블슈팅

### PNG 내보내기가 작동하지 않아요

- 일부 브라우저에서는 보안 정책으로 인해 로컬 파일에서 canvas를 사용할 수 없습니다
- 로컬 서버를 통해 실행하시면 해결됩니다

### 프리셋이 저장되지 않아요

- 브라우저의 시크릿 모드에서는 로컬 스토리지가 작동하지 않습니다
- 일반 브라우징 모드를 사용해주세요
- 브라우저 데이터를 지우면 저장된 프리셋도 함께 삭제됩니다

### 일부 SVG가 표시되지 않아요

- 브라우저 콘솔(F12)에서 오류 메시지를 확인해주세요
- SVG 문법 오류가 있을 수 있습니다
- `ASSETS` 객체의 해당 파트 정의를 확인해주세요

## 기여

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

## 문의

질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

Made with ❤️ using Vanilla JavaScript and SVG

