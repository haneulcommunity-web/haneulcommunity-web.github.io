# The Steps of Haneul (하늘의 걸음)

**아바타 생성, 조회 및 응원 메시지 시스템**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://haneulcommunity-web.github.io)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-Educational-blue)](LICENSE)

## 📖 프로젝트 개요

"하늘의 걸음과 섬김" - 팀원들의 아바타를 생성하고 관리하며, 서로에게 응원 메시지를 남길 수 있는 웹 기반 시스템입니다. 

### ✨ 핵심 특징
- 🎨 **커스터마이징 가능한 아바타**: 100+ 옵션으로 개성있는 아바타 생성
- 📜 **성경 말씀 자동 배정**: 100개의 암송 구절 중 중복 최소화하여 배정
- 💬 **실시간 응원 메시지**: Firebase 실시간 데이터베이스 기반 즉시 반영
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- 🔒 **관리자 기능**: 아바타 및 메시지 관리 시스템

## 🚀 주요 기능

### 🎨 아바타 생성 및 관리
- **커스터마이징 가능한 아바타**: Dicebear API (Avataaars 스타일) 활용
  - 48가지 헤어스타일
  - 24가지 눈 스타일
  - 13가지 눈썹 스타일
  - 6가지 코 스타일
  - 27가지 입 스타일
  - 5가지 안경 스타일
  - 다양한 색상 및 옵션
- **실시간 저장**: Firebase Realtime Database를 통한 데이터 관리
- **고해상도 이미지 내보내기**: 2160x3840 PNG 이미지로 프로필 카드 저장
- **성경 말씀 자동 배정**: 100개의 암송 구절 중 중복 최소화하여 배정

### 🔍 조회 및 검색
- **다중 검색**: 이름 또는 팀명으로 검색
- **상세보기**: 아바타 및 성경 구절이 담긴 카드 확인
- **메시지 보기**: 전용 페이지에서 응원 메시지 확인

### 💬 응원 메시지 시스템
- **무제한 댓글**: 각 아바타에 무제한 응원 메시지 작성
- **실시간 업데이트**: Firebase 실시간 리스너로 즉시 반영
- **수정/삭제 기능**: 작성한 메시지 편집 및 삭제 가능
- **전용 메시지 페이지**: 독립적인 UI로 메시지 관리

### 🔒 관리자 기능
- **아바타 관리 탭**
  - 전체 아바타 목록 조회
  - 검색 기능
  - 정보 수정 (이름, 팀명)
  - 아바타 삭제 (관련 댓글 자동 삭제)
- **댓글 관리 탭**
  - 전체 댓글 목록 조회
  - 작성자/내용 검색
  - 댓글 통계 (총 댓글 수, 참여자 수)
  - 개별 댓글 삭제

## 📁 프로젝트 구조

```
haneulcommunity-web.github.io/
├── index.html              # 메인 진입점 (SPA 구조)
├── admin.html              # 관리자 페이지 (독립 페이지)
├── README.md              # 프로젝트 문서
│
├── assets/                # 리소스 파일
│   ├── images/            # 이미지 파일
│   │   ├── back.jpg       # 배경 이미지
│   │   ├── card_back.png  # 카드 뒷면 이미지
│   │   └── HaneulLogo.png # 로고 이미지
│   └── fonts/             # 폰트 파일
│       └── OTF/           # 국립박물관문화재단 클래식 폰트
│
├── css/                   # 스타일시트
│   └── styles.css         # 메인 스타일 (4600+ 줄)
│
├── js/                    # JavaScript 파일
│   ├── app.js             # Firebase 및 메인 로직 (2100+ 줄)
│   ├── avatar-builder.js  # 아바타 빌더 로직
│   ├── assets.js          # Dicebear 설정 및 옵션
│   ├── data.js            # 성경 구절 데이터 (100개)
│   └── view-loader.js     # 동적 뷰 로딩 시스템
│
├── views/                 # HTML 뷰 파일 (동적 로딩)
│   ├── main.html          # 메인 페이지
│   ├── avatar.html        # 아바타 생성 페이지
│   ├── search.html        # 조회 페이지
│   ├── result.html        # 상세보기 페이지
│   ├── messages.html      # 메시지 전용 페이지
│   ├── edit-modal.html    # 편집 모달
│   └── README.md          # 뷰 설명
│
└── examples/              # 독립형 예제
    ├── avatar-builder-standalone.html  # 단일 HTML 아바타 빌더
    └── avatar-builder/                 # 독립형 아바타 빌더 앱
        ├── index.html
        ├── main.js
        ├── styles.css
        └── README.md
```

## 🛠️ 기술 스택

### Frontend
- **HTML5 / CSS3**: 시맨틱 마크업 및 반응형 디자인
- **Vanilla JavaScript (ES6+)**: 모듈 시스템 및 async/await
- **Dicebear API**: HTTP API를 통한 SVG 아바타 생성
- **동적 뷰 로딩**: SPA (Single Page Application) 구조

### Backend & Database
- **Firebase Realtime Database**: NoSQL 실시간 데이터베이스
  - 실시간 리스너 (`onValue`)
  - 트랜잭션 처리 (`runTransaction`)
  - 계층적 데이터 구조
- **Firebase Hosting**: 정적 웹 호스팅

### Libraries & APIs
- **html2canvas**: HTML을 캔버스로 변환하여 이미지 저장
- **Google Fonts**: Noto Serif KR
- **Adobe Fonts**: 국립박물관문화재단 클래식 폰트
- **Google Analytics**: 사용자 분석 및 추적

## 🗄️ 데이터베이스 구조

### 1. `employees` (아바타 정보)

**경로**: `/employees/{employeeId}`

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `employeeId` | String | 고유 식별자 | `"emp_1729765432123"` |
| `name` | String | 이름 | `"김하늘"` |
| `team` | String | 팀명 | `"예배팀"` |
| `avatarData` | String (JSON) | 아바타 스타일 정보 | `'{"seed":"user123",...}'` |
| `verseContent` | String | 성경 구절 내용 | `"여호와는 나의 목자시니..."` |
| `verseReference` | String | 성경 구절 출처 | `"시편 23:1"` |
| `createdAt` | String (ISO 8601) | 생성 일시 | `"2025-10-24T12:34:56.789Z"` |

### 2. `comments` (응원 메시지)

**경로**: `/comments/{employeeId}/{commentId}`

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `author` | String | 작성자 이름 (최대 20자) | `"이하늘"` |
| `message` | String | 메시지 내용 (최대 200자) | `"힘내세요!"` |
| `createdAt` | String (ISO 8601) | 작성 일시 | `"2025-10-24T12:35:00.000Z"` |
| `edited` | Boolean | 수정 여부 (선택) | `true` |

**특징**:
- 무제한 댓글 추가 가능
- `employeeId`를 기준으로 계층 구조
- 아바타 삭제 시 관련 댓글 자동 삭제 (Cascade Delete)
- 실시간 리스너로 즉시 업데이트

### 3. `usedVerses` (사용된 성경 구절 추적)

**경로**: `/usedVerses`

| 타입 | 설명 | 예시 |
|------|------|------|
| Array\<Number\> | 사용된 성경 구절의 인덱스 배열 | `[0, 5, 12, 23]` |

**특징**:
- 중복 방지를 위한 인덱스 추적
- 모든 구절 사용 시 자동 초기화
- Transaction 사용으로 동시성 보장

## 🔗 관계도

```
┌──────────────────┐
│    employees     │  1:N
│  (아바타 정보)    │◄────────┐
└──────────────────┘         │
                             │ employeeId
                             │
                    ┌────────┴─────────┐
                    │    comments      │
                    │  (응원 메시지)    │
                    └──────────────────┘

┌──────────────────┐
│   usedVerses     │  (독립적)
│ (구절 중복 방지)  │
└──────────────────┘
```

## 🚀 설치 및 실행

### 로컬 실행

1. 저장소 클론
```bash
git clone https://github.com/haneulcommunity-web/haneulcommunity-web.github.io.git
cd haneulcommunity-web.github.io
```

2. 웹 서버 실행
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

3. 브라우저에서 열기
- `http://localhost:8000`

### 🌐 GitHub Pages 배포

자동 배포:
- **Live URL**: https://haneulcommunity-web.github.io
- **관리자 페이지**: https://haneulcommunity-web.github.io/admin.html

## 📖 사용 방법

### 1. 🎨 아바타 생성
1. 메인 페이지에서 "아바타 생성" 버튼 클릭
2. 아바타 빌더에서 다양한 옵션 커스터마이징
3. "랜덤 생성" 버튼으로 즉시 랜덤 아바타 생성 가능
4. 이름과 팀명 입력 후 "저장" 클릭
5. 성경 구절이 자동으로 배정되어 저장

### 2. 🔍 조회 및 상세보기
1. 메인 페이지에서 "조회" 버튼 클릭
2. 이름 또는 팀명으로 검색
3. 검색 결과에서:
   - **상세보기**: 아바타 카드 확인 및 이미지 저장
   - **메시지**: 응원 메시지 페이지로 이동
   - **삭제**: 아바타 삭제

### 3. 💬 응원 메시지 작성
1. 검색 결과에서 "메시지" 버튼 클릭
2. 메시지 페이지에서 이름과 메시지 입력
3. "메시지 남기기" 버튼 클릭
4. 실시간으로 메시지 목록에 추가됨
5. 수정/삭제 버튼으로 관리 가능

### 4. 🔒 관리자 기능
1. 메인 페이지에서 "관리자" 버튼 클릭
2. **아바타 관리 탭**:
   - 전체 아바타 목록 확인
   - 검색 및 편집
   - 아바타 삭제
3. **댓글 관리 탭**:
   - 전체 댓글 목록 확인
   - 작성자/내용으로 검색
   - 댓글 삭제

## ⚙️ Firebase 설정

자체 Firebase 프로젝트를 사용하려면 `js/app.js` 파일의 `firebaseConfig` 업데이트:

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

### Firebase 보안 규칙 권장사항

```json
{
  "rules": {
    "employees": {
      ".read": true,
      ".write": true,
      "$employeeId": {
        ".validate": "newData.hasChildren(['name', 'team', 'avatarData', 'verseContent', 'verseReference', 'createdAt'])"
      }
    },
    "comments": {
      ".read": true,
      "$employeeId": {
        ".write": true,
        "$commentId": {
          ".validate": "newData.hasChildren(['author', 'message', 'createdAt'])"
        }
      }
    },
    "usedVerses": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 📊 용량 및 성능

### 예상 사용량 (170명 기준)
- 아바타 1개: 약 1-2KB
- 댓글 1개: 약 0.2KB
- 전체 아바타: 170 × 2KB = 340KB
- 댓글 (평균 10개/인): 1,700 × 0.2KB = 340KB
- **총 예상 용량**: 약 1MB 이하

### Firebase Spark(무료) 플랜
- 저장 용량: 1GB (충분)
- 동시 연결: 100개 (일반적 사용 시 충분)
- 다운로드: 10GB/월 (충분)

## 🌐 브라우저 호환성

- Chrome/Edge (최신 2버전)
- Firefox (최신 2버전)
- Safari (최신 2버전)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android)

## 🎨 독립형 아바타 빌더

`examples/` 폴더에는 독립적으로 사용 가능한 아바타 빌더가 포함:

- **avatar-builder-standalone.html**: 단일 HTML 파일
- **avatar-builder/**: 모듈화된 앱
  - SVG 기반 커스터마이징
  - 실시간 미리보기
  - PNG/SVG 내보내기

자세한 내용: [examples/avatar-builder/README.md](examples/avatar-builder/README.md)

## 👨‍💻 개발 가이드

### 코드 구조
- `view-loader.js`: 동적 뷰 로딩 시스템
- `app.js`: Firebase 연동 및 비즈니스 로직
- `avatar-builder.js`: 아바타 생성 및 커스터마이징
- `data.js`: 정적 데이터 (성경 구절)
- `assets.js`: Dicebear 옵션 설정

### 주요 함수
- `saveAvatar()`: 아바타 저장
- `searchEmployee()`: 아바타 검색
- `showEmployeeMessages()`: 메시지 페이지 표시
- `addMessageComment()`: 댓글 추가
- `loadMessagesComments()`: 실시간 댓글 로드
- `deleteEmployee()`: 아바타 및 관련 댓글 삭제

## 🎯 주요 특징 및 혁신

### 🚀 성능 최적화
- **모듈형 구조**: ES6 모듈 시스템으로 코드 분리 및 최적화
- **동적 뷰 로딩**: 필요한 페이지만 로드하여 초기 로딩 시간 단축
- **실시간 데이터 동기화**: Firebase 실시간 리스너로 즉시 반영
- **이미지 최적화**: SVG 기반 아바타로 확장성 보장

### 🎨 사용자 경험
- **직관적인 UI/UX**: 간단하고 명확한 인터페이스
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **실시간 피드백**: 모든 작업에 대한 즉시적인 시각적 피드백
- **접근성 고려**: 키보드 네비게이션 및 스크린 리더 지원

### 🔒 데이터 관리
- **중복 최소화**: 성경 구절 자동 배정 시스템
- **트랜잭션 처리**: 동시성 문제 해결을 위한 Firebase 트랜잭션 활용
- **계층적 데이터 구조**: 효율적인 데이터 관리 및 검색
- **자동 정리**: 삭제 시 관련 데이터 자동 정리

## 🛡️ 보안 및 개인정보 보호

### 데이터 보호
- **Firebase 보안 규칙**: 데이터베이스 접근 권한 관리
- **입력 검증**: 사용자 입력에 대한 클라이언트 사이드 검증
- **익명 사용**: 개인정보 수집 없이 서비스 이용 가능

### 권장 보안 설정
```json
{
  "rules": {
    "employees": {
      ".read": true,
      ".write": true,
      "$employeeId": {
        ".validate": "newData.hasChildren(['name', 'team', 'avatarData', 'verseContent', 'verseReference', 'createdAt'])"
      }
    }
  }
}
```

## 📈 사용 통계 및 분석

### Google Analytics 연동
- 사용자 행동 분석
- 페이지 뷰 추적
- 기능별 사용률 측정

### 예상 사용량 (170명 기준)
- **아바타 데이터**: 170 × 2KB = 340KB
- **댓글 데이터**: 1,700 × 0.2KB = 340KB
- **총 예상 용량**: 약 1MB 이하

## 🔄 업데이트 및 버전 관리

### 최신 기능
- ✅ 아바타 커스터마이징 시스템
- ✅ 실시간 메시지 시스템
- ✅ 관리자 대시보드
- ✅ 반응형 디자인
- ✅ 이미지 내보내기 기능

### 향후 계획
- 🔄 다국어 지원
- 🔄 테마 시스템
- 🔄 고급 검색 필터
- 🔄 대량 데이터 내보내기

## 🤝 기여 방법

### 버그 리포트
GitHub Issues를 통해 버그를 신고해 주세요:
1. 버그 설명
2. 재현 단계
3. 예상 결과 vs 실제 결과
4. 환경 정보 (브라우저, OS 등)

### 기능 제안
새로운 기능이나 개선 사항을 제안해 주세요:
1. 기능 설명
2. 사용 사례
3. 예상 효과

### 개발 참여
1. Fork 프로젝트
2. Feature 브랜치 생성
3. 변경사항 커밋
4. Pull Request 생성

## 📞 지원 및 문의

### 기술 지원
- GitHub Issues: 버그 리포트 및 기능 제안
- 이메일: 프로젝트 관리자에게 직접 문의

### 문서 및 가이드
- [사용자 가이드](#사용-방법)
- [개발자 가이드](#개발-가이드)
- [Firebase 설정](#firebase-설정)

## 📄 라이선스

이 프로젝트는 교육 및 비상업적 용도로 제공됩니다.

## 🙏 감사 인사

- **Dicebear**: 아바타 생성 API 제공
- **Firebase**: 실시간 데이터베이스 및 호스팅
- **Google Fonts**: 웹폰트 제공
- **Adobe Fonts**: 고품질 한국어 폰트 제공

---

**Made with love for The Steps of Haneul**

*"선한 사람의 걸음을 여호와께서 정하시니 그분은 그 길을 기뻐하십니다" - 시편 37:23*
