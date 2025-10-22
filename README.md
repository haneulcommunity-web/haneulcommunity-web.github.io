# The Steps of Haneul (하늘의 걸음)

**아바타 생성 및 조회 시스템**

## 프로젝트 개요

"하늘의 걸음과 섬김" - 팀원들의 아바타를 생성하고 관리하는 웹 기반 시스템입니다. 
각 사용자는 고유한 아바타와 성경 말씀을 담은 프로필 카드를 생성할 수 있습니다.

## 주요 기능

- 🎨 **아바타 생성**: Dicebear API (Lorelei 스타일)를 활용한 커스터마이징 가능한 아바타
  - 48가지 헤어스타일
  - 24가지 눈 스타일
  - 13가지 눈썹 스타일
  - 6가지 코 스타일
  - 27가지 입 스타일
  - 5가지 안경 스타일
  - 다양한 배경색 선택

- 💾 **정보 관리**: Firebase Realtime Database를 통한 실시간 데이터 저장
- 🔍 **조회**: 이름 또는 팀명으로 검색
- 📖 **성경 말씀**: 각 카드에 100개의 암송 구절 중 하나가 랜덤으로 배정
- 🖼️ **이미지 내보내기**: 2160x3840 고해상도 PNG 이미지로 프로필 카드 저장

## 프로젝트 구조

```
Kimajun0919.github.io/
├── index.html              # 메인 페이지
├── README.md              # 프로젝트 문서
│
├── assets/                # 리소스 파일
│   ├── images/            # 이미지 파일
│   │   ├── back.jpg       # 배경 이미지
│   │   └── HaneulLogo.png # 로고 이미지
│   └── fonts/             # 폰트 파일
│       └── OTF/           # 국립박물관문화재단 클래식 폰트
│
├── css/                   # 스타일시트
│   └── styles.css         # 메인 스타일
│
├── js/                    # JavaScript 파일
│   ├── app.js             # Firebase 및 메인 로직
│   ├── avatar-builder.js  # 아바타 빌더 로직
│   ├── assets.js          # Dicebear 설정 및 옵션
│   └── data.js            # 성경 구절 데이터
│
└── examples/              # 독립형 예제
    ├── avatar-builder-standalone.html  # 단일 HTML 아바타 빌더
    └── avatar-builder/                 # 독립형 아바타 빌더 앱
        ├── index.html
        ├── main.js
        ├── styles.css
        └── README.md
```

## 기술 스택

### Frontend
- **HTML5 / CSS3**: 시맨틱 마크업 및 반응형 디자인
- **Vanilla JavaScript (ES6+)**: 모듈 시스템 활용
- **Dicebear API**: HTTP API를 통한 아바타 생성

### Backend & Database
- **Firebase Realtime Database**: NoSQL 실시간 데이터베이스
- **Firebase Hosting**: GitHub Pages 배포

### Libraries
- **html2canvas**: HTML을 캔버스로 변환하여 이미지 저장
- **Google Fonts**: Noto Serif KR
- **Adobe Fonts**: 커스텀 한글 폰트

## 설치 및 실행

### 로컬 실행

1. 저장소 클론
```bash
git clone https://github.com/Kimajun0919/Kimajun0919.github.io.git
cd Kimajun0919.github.io
```

2. 웹 서버 실행 (선택사항)
```bash
# Python 3
python -m http.server 8000

# Python 2  
python -m SimpleHTTPServer 8000

# Node.js
npx http-server -p 8000
```

3. 브라우저에서 열기
- 웹 서버 사용 시: `http://localhost:8000`
- 직접 열기: `index.html` 파일을 브라우저에서 열기

### GitHub Pages 배포

이 프로젝트는 GitHub Pages를 통해 자동으로 배포됩니다:
- URL: `https://kimajun0919.github.io`

## 사용 방법

### 1. 아바타 생성
1. 메인 페이지에서 "아바타 생성" 버튼 클릭
2. 헤어스타일, 눈, 눈썹, 코, 입, 안경 등 커스터마이징
3. 배경색 선택
4. "🎲 랜덤 아바타 생성" 버튼으로 즉시 랜덤 생성 가능

### 2. 정보 저장
1. 이름과 팀명 입력
2. "저장" 버튼 클릭
3. 성경 구절이 자동으로 배정되어 저장됨

### 3. 조회
1. 메인 페이지에서 "조회" 버튼 클릭
2. 이름 또는 팀명으로 검색
3. 검색 결과에서 "상세보기" 클릭

### 4. 이미지 저장
1. 상세 페이지에서 "이미지로 저장" 버튼 클릭
2. 2160x3840 해상도의 PNG 파일 다운로드

## Firebase 설정

Firebase 프로젝트를 사용하려면 `js/app.js` 파일의 `firebaseConfig` 객체를 업데이트하세요:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 독립형 아바타 빌더

`examples/` 폴더에는 독립적으로 사용 가능한 아바타 빌더가 포함되어 있습니다:

- **avatar-builder-standalone.html**: 단일 HTML 파일로 모든 기능 포함
- **avatar-builder/**: 모듈화된 아바타 빌더 앱
  - SVG 기반 커스터마이징
  - 실시간 미리보기
  - PNG/SVG 내보내기

자세한 내용은 [examples/avatar-builder/README.md](examples/avatar-builder/README.md)를 참조하세요.

## 브라우저 호환성

- ✅ Chrome/Edge (최신 2버전)
- ✅ Firefox (최신 2버전)
- ✅ Safari (최신 2버전)
- ✅ Mobile Safari (iOS 13+)
- ✅ Chrome Mobile (Android)

## 라이선스

이 프로젝트는 교육 및 비상업적 용도로 제공됩니다.

## 기여

버그 리포트 및 기능 제안은 GitHub Issues를 통해 제출해 주세요.

---

**Made with ❤️ for The Steps of Haneul**

*"선한 사람의 걸음을 여호와께서 정하시니 그분은 그 길을 기뻐하십니다" - 시편 37:23*
