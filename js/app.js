import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, push, get, child, remove, set, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXaqnaoQYWZGywi_PPRohGaAJj_dBVDK0",
  authDomain: "haneulcard.firebaseapp.com",
  databaseURL: "https://haneulcard-default-rtdb.firebaseio.com",
  projectId: "haneulcard",
  storageBucket: "haneulcard.appspot.com",
  messagingSenderId: "814685525921",
  appId: "1:814685525921:web:eacd7b62ca15e983875de0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase 기반 중복 최소화 시스템
// Firebase에서 사용된 말씀 인덱스 가져오기
async function getUsedVersesFromFirebase() {
  try {
    const snapshot = await get(ref(db, "usedVerses"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data) ? data : [];
    }
    return [];
  } catch (e) {
    console.error('Failed to load used verses from Firebase:', e);
    return [];
  }
}

// Firebase에 사용된 말씀 인덱스 저장
async function saveUsedVersesToFirebase(usedIndexes) {
  try {
    await set(ref(db, "usedVerses"), usedIndexes);
  } catch (e) {
    console.error('Failed to save used verses to Firebase:', e);
  }
}

// 중복을 최소화하며 말씀 선택 (Firebase 기반)
async function getUniqueVerse() {
  if (!window.verses || window.verses.length === 0) {
    return null;
  }

  try {
    // Transaction을 사용하여 동시성 문제 해결
    const verseRef = ref(db, "usedVerses");
    const result = await runTransaction(verseRef, (currentData) => {
      let usedIndexes = Array.isArray(currentData) ? currentData : [];
      
      // 모든 말씀을 다 사용했으면 초기화
      if (usedIndexes.length >= window.verses.length) {
        console.log('모든 말씀을 사용했습니다. 초기화합니다.');
        usedIndexes = [];
      }
      
      // 사용되지 않은 인덱스 찾기
      const availableIndexes = [];
      for (let i = 0; i < window.verses.length; i++) {
        if (!usedIndexes.includes(i)) {
          availableIndexes.push(i);
        }
      }
      
      // 사용 가능한 인덱스 중 랜덤 선택
      const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      
      // 사용된 인덱스에 추가
      usedIndexes.push(randomIndex);
      
      // 선택된 인덱스를 임시 저장 (transaction 외부에서 사용)
      window._selectedVerseIndex = randomIndex;
      
      return usedIndexes;
    });

    if (result.committed && typeof window._selectedVerseIndex !== 'undefined') {
      const selectedIndex = window._selectedVerseIndex;
      const selectedVerse = window.verses[selectedIndex];
      const usedCount = result.snapshot.val().length;
      
      console.log(`말씀 선택 (${usedCount}/${window.verses.length}):`, selectedVerse.reference);
      
      // 임시 변수 정리
      delete window._selectedVerseIndex;
      
      return selectedVerse;
    }
    
    // Transaction 실패 시 폴백
    throw new Error('Transaction failed');
    
  } catch (e) {
    console.error('Failed to get unique verse from Firebase:', e);
    // 폴백: 랜덤 선택
    const randomVerse = window.verses[Math.floor(Math.random() * window.verses.length)];
    console.log('폴백으로 랜덤 말씀 선택:', randomVerse.reference);
    return randomVerse;
  }
}

// 사용 통계 확인 (개발자 도구에서 확인용)
async function getVerseStats() {
  const usedIndexes = await getUsedVersesFromFirebase();
  return {
    total: window.verses.length,
    used: usedIndexes.length,
    remaining: window.verses.length - usedIndexes.length,
    percentage: ((usedIndexes.length / window.verses.length) * 100).toFixed(1) + '%'
  };
}

// 사용 기록 초기화 (필요시 - 관리자 전용)
async function resetUsedVerses() {
  try {
    await set(ref(db, "usedVerses"), []);
    console.log('사용된 말씀 기록을 초기화했습니다.');
  } catch (e) {
    console.error('Failed to reset used verses:', e);
  }
}

// 전역으로 노출
window.getUniqueVerse = getUniqueVerse;
window.getVerseStats = getVerseStats;
window.resetUsedVerses = resetUsedVerses;

// 페이지 전환 함수 (HTML에서 호출)
window.showPage = function(pageId) {
  const targetPage = document.getElementById(pageId);
  if (!targetPage) {
    console.error(`Page with id '${pageId}' not found`);
    return;
  }
  
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  targetPage.classList.add('active');
  
  // URL 해시 업데이트 (페이지 ID에서 'Page' 제거)
  const pageName = pageId.replace('Page', '');
  if (pageName !== 'main') {
    window.location.hash = pageName;
  } else {
    window.location.hash = '';
  }
  
  // 아바타 페이지가 활성화될 때 아바타 빌더 초기화
  if (pageId === 'avatarPage') {
    setTimeout(() => {
      if (typeof initAvatarBuilder === 'function') {
        initAvatarBuilder();
      }
    }, 100);
  }
  
  // 검색 페이지가 활성화될 때 저장된 검색 결과 복원
  if (pageId === 'searchPage') {
    setTimeout(() => {
      if (typeof window.restoreSearchResults === 'function') {
        window.restoreSearchResults();
      }
    }, 100);
  }
};

// 아바타 저장 함수 (새로운 아바타 빌더 시스템 사용)
window.saveAvatar = async function() {
  const name = document.getElementById('avatarName').value.trim();
  const team = document.getElementById('avatarTeam').value.trim();
  const status = document.getElementById('avatarStatus');

  if (!name || !team) {
    status.textContent = "이름과 팀명을 입력해주세요!";
    status.style.color = "#e74c3c";
    
    // 상단 입력 필드로 스크롤 이동
    const avatarSaveForm = document.querySelector('.avatar-save-form');
    if (avatarSaveForm) {
      avatarSaveForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // 첫 번째 빈 입력 필드에 포커스
    if (!name) {
      document.getElementById('avatarName').focus();
    } else if (!team) {
      document.getElementById('avatarTeam').focus();
    }
    
    return;
  }

  // 현재 아바타 상태 가져오기
  const currentAvatarState = getCurrentAvatarState();
  
  // 기본 캐릭터인지 확인
  const isDefaultAvatar = 
    currentAvatarState.seed === 'default-avatar' &&
    currentAvatarState.hair === 'variant01' &&
    currentAvatarState.eyes === 'variant01' &&
    currentAvatarState.eyebrows === 'variant01' &&
    currentAvatarState.mouth === 'happy01' &&
    currentAvatarState.nose === 'variant01' &&
    (!currentAvatarState.glasses || currentAvatarState.glasses === '');

  // 기본 캐릭터라면 확인 창 표시
  if (isDefaultAvatar) {
    const confirmed = confirm('기본 캐릭터로 저장하시겠습니까?');
    if (!confirmed) {
      status.textContent = "";
      return; // 사용자가 취소하면 저장하지 않음
    }
  }

  status.textContent = "아바타 저장 중...";
  status.style.color = "#3498db";

  try {
    
    // 고유 ID 생성
    const employeeId = String(Date.now()).slice(-6);

    // 중복을 최소화하며 말씀 선택 (저장 시 고정)
    let verseContent = '';
    let verseReference = '';
    if (typeof window.getUniqueVerse === 'function') {
      const v = await window.getUniqueVerse();
      if (v) {
        verseContent = v.content;
        verseReference = v.reference;
      }
    } else if (Array.isArray(window.verses) && window.verses.length > 0) {
      // 폴백: getUniqueVerse가 없으면 랜덤 선택
      const v = window.verses[Math.floor(Math.random() * window.verses.length)];
      verseContent = v.content;
      verseReference = v.reference;
    }

    // Firebase에 저장 (이미지 자체는 저장하지 않음)
    await push(ref(db, "employees"), {
      name,
      team,
      avatarData: JSON.stringify(currentAvatarState),
      verseContent,
      verseReference,
      employeeId: employeeId,
      createdAt: new Date().toISOString()
    });

    status.innerHTML = `아바타 저장 완료!`;
    status.style.color = "#27ae60";
    
    // 입력 필드 초기화
    document.getElementById('avatarName').value = '';
    document.getElementById('avatarTeam').value = '';
      
    // 결과 페이지로 이동
    setTimeout(() => {
      showEmployeeResult({
        name: name,
        team: team,
        avatarData: currentAvatarState,
        verseContent,
        verseReference,
        employeeId: employeeId
      });
      
      // 디폴트 아바타로 초기화 (initAvatarBuilder가 정의되어 있을 때만)
      if (typeof window.initAvatarBuilder === 'function') {
        window.initAvatarBuilder();
      }
    }, 1500);
  } catch (error) {
    status.textContent = "저장 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 현재 아바타 상태 가져오기
function getCurrentAvatarState() {
  if (typeof window.builderState !== 'undefined') {
    return window.builderState;
  }
  // 기본 상태 반환 (lorelei 스타일 고정)
  return {
    style: 'lorelei',
    seed: 'default-avatar', // 고정된 seed로 항상 동일한 기본 이미지
    hair: 'variant01',
    eyes: 'variant01',
    eyebrows: 'variant01',
    mouth: 'happy01',
    nose: 'variant01',
    glasses: '',
    earrings: '',
    freckles: '',
    hairAccessories: ''
  };
}

// 아바타 SVG 생성 함수 (Dicebear API 사용)
function generateAvatarSVG(avatarData) {
  if (!avatarData) {
    avatarData = getCurrentAvatarState();
  }
  
  // Dicebear API로 아바타 생성
  if (typeof window.createDicebearAvatar === 'function') {
    try {
      const style = avatarData.style || 'lorelei';
      const seed = avatarData.seed || Date.now().toString();
      
      // Dicebear 옵션 구성
      const dicebearOptions = {
        seed: seed,
        scale: 100
      };

      // lorelei 스타일 옵션 (빈 문자열은 제외)
      if (avatarData.hair) dicebearOptions.hair = [avatarData.hair];
      if (avatarData.eyes) dicebearOptions.eyes = [avatarData.eyes];
      if (avatarData.eyebrows) dicebearOptions.eyebrows = [avatarData.eyebrows];
      if (avatarData.mouth) dicebearOptions.mouth = [avatarData.mouth];
      if (avatarData.nose) dicebearOptions.nose = [avatarData.nose];
      if (avatarData.glasses && avatarData.glasses !== '') dicebearOptions.glasses = [avatarData.glasses];
      if (avatarData.earrings && avatarData.earrings !== '') dicebearOptions.earrings = [avatarData.earrings];
      if (avatarData.freckles && avatarData.freckles !== '') dicebearOptions.freckles = [avatarData.freckles];
      if (avatarData.hairAccessories && avatarData.hairAccessories !== '') dicebearOptions.hairAccessories = [avatarData.hairAccessories];

      const svg = window.createDicebearAvatar({
        style: style,
        seed: seed,
        dicebearOptions: dicebearOptions
      });

      if (svg) return svg;
    } catch (error) {
      console.error('Error generating Dicebear avatar:', error);
    }
  }
  
  // 폴백: 기본 SVG 생성
  return createBasicAvatarSVG(avatarData);
}

// 아바타 PNG 생성 함수 (이미지 저장용)
function generateAvatarPNG(avatarData) {
  if (!avatarData) {
    avatarData = getCurrentAvatarState();
  }
  
  // Dicebear API로 PNG 아바타 생성
  if (typeof window.createDicebearAvatarPNG === 'function') {
    try {
      const style = avatarData.style || 'lorelei';
      const seed = avatarData.seed || Date.now().toString();
      
      // Dicebear 옵션 구성 - 고해상도 설정
      const dicebearOptions = {
        seed: seed,
        scale: 100,
        size: 1024 // 1024px 고해상도 PNG
      };

      // lorelei 스타일 옵션 (빈 문자열은 제외)
      if (avatarData.hair) dicebearOptions.hair = [avatarData.hair];
      if (avatarData.eyes) dicebearOptions.eyes = [avatarData.eyes];
      if (avatarData.eyebrows) dicebearOptions.eyebrows = [avatarData.eyebrows];
      if (avatarData.mouth) dicebearOptions.mouth = [avatarData.mouth];
      if (avatarData.nose) dicebearOptions.nose = [avatarData.nose];
      if (avatarData.glasses && avatarData.glasses !== '') dicebearOptions.glasses = [avatarData.glasses];
      if (avatarData.earrings && avatarData.earrings !== '') dicebearOptions.earrings = [avatarData.earrings];
      if (avatarData.freckles && avatarData.freckles !== '') dicebearOptions.freckles = [avatarData.freckles];
      if (avatarData.hairAccessories && avatarData.hairAccessories !== '') dicebearOptions.hairAccessories = [avatarData.hairAccessories];

      const png = window.createDicebearAvatarPNG({
        style: style,
        seed: seed,
        dicebearOptions: dicebearOptions
      });

      if (png) return png;
    } catch (error) {
      console.error('Error generating Dicebear avatar PNG:', error);
    }
  }
  
  // 폴백: SVG 생성
  return generateAvatarSVG(avatarData);
}

// 기본 아바타 SVG 생성 (폴백용)
function createBasicAvatarSVG(avatarData) {
  return `
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 배경 -->
      <rect width="512" height="512" fill="transparent"/>
      
      <!-- 기본 얼굴 -->
      <circle cx="256" cy="256" r="180" fill="#FFE0D4"/>
      
      <!-- 머리 -->
      <circle cx="256" cy="180" r="150" fill="#2C1B18"/>
      
      <!-- 눈 -->
      <circle cx="216" cy="240" r="20" fill="#1C1C1C"/>
      <circle cx="296" cy="240" r="20" fill="#1C1C1C"/>
      
      <!-- 입 -->
      <path d="M 226 300 Q 256 320 286 300" stroke="#C45B5D" stroke-width="6" fill="none" stroke-linecap="round"/>
      
      <!-- 텍스트 (로딩 실패 표시) -->
      <text x="256" y="450" text-anchor="middle" font-size="24" fill="#666">Avatar Loading...</text>
    </svg>
  `;
}

// 검색 함수 (HTML에서 호출)
window.searchEmployee = async function() {
  const name = document.getElementById('searchName').value.trim();
  const team = document.getElementById('searchTeam').value.trim();
  const status = document.getElementById('searchStatus');

  if (!name && !team) {
    status.textContent = "이름 또는 팀명을 입력해주세요!";
    status.style.color = "#e74c3c";
    return;
  }

  status.textContent = "검색 중...";
  status.style.color = "#3498db";

  try {
    const snapshot = await get(ref(db, "employees"));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const employees = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));

      // 필터링
      const filteredEmployees = employees.filter(emp => {
        if (name && team) {
          return emp.name === name && emp.team === team;
        } else if (name) {
          return emp.name === name;
        } else if (team) {
          return emp.team === team;
        }
        return false;
      });

      if (filteredEmployees.length > 0) {
        // 검색 결과를 세션 스토리지에 저장
        sessionStorage.setItem('searchResults', JSON.stringify(filteredEmployees));
        sessionStorage.setItem('searchName', name);
        sessionStorage.setItem('searchTeam', team);
        
        await displaySearchResults(filteredEmployees);
        status.textContent = `${filteredEmployees.length}명을 찾았습니다!`;
        status.style.color = "#27ae60";
      } else {
        // 검색 결과가 없을 때는 저장된 데이터 삭제
        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchName');
        sessionStorage.removeItem('searchTeam');
        
        status.textContent = "해당 조건에 맞는 사람이 없습니다.";
        status.style.color = "#e74c3c";
      }
    } else {
      status.textContent = "저장된 데이터가 없습니다.";
      status.style.color = "#e74c3c";
    }
  } catch (error) {
    status.textContent = "검색 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 검색 결과 표시
async function displaySearchResults(employees) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  // 각 employee의 댓글 개수를 가져오기
  for (const employee of employees) {
    const employeeCard = document.createElement('div');
    employeeCard.className = 'employee-card';
    
    // 썸네일 생성: avatarData로 SVG 생성
    let avatarHTML = '';
    if (employee.avatarData) {
      try {
        const avatarData = typeof employee.avatarData === 'string' ? JSON.parse(employee.avatarData) : employee.avatarData;
        avatarHTML = generateAvatarSVG(avatarData);
      } catch (e) {
        avatarHTML = '<div class="no-avatar">아바타 없음</div>';
      }
    } else {
      avatarHTML = '<div class="no-avatar">아바타 없음</div>';
    }
    
    // 말씀 텍스트 구성 (저장값 우선, 없으면 랜덤)
    let verseHTML = '';
    if (employee.verseContent && employee.verseReference) {
      verseHTML = `${employee.verseContent} <span style="display:block;opacity:.75;margin-top:4px;">${employee.verseReference}</span>`;
    } else if (Array.isArray(window.verses) && window.verses.length > 0) {
      const v = window.verses[Math.floor(Math.random() * window.verses.length)];
      verseHTML = `${v.content} <span style=\"display:block;opacity:.75;margin-top:4px;\">${v.reference}</span>`;
    }
    
    // 댓글 개수 가져오기
    const commentCount = await getCommentCount(employee.id);
    const badgeHTML = commentCount > 0 ? `<span class="message-badge">${commentCount}</span>` : '';

    employeeCard.innerHTML = `
      <div class="employee-avatar">
        ${avatarHTML}
      </div>
      <div class="employee-info">
        <h3>${employee.name}</h3>
        <p>팀: ${employee.team}</p>
      </div>
      <div class="employee-actions">
        <button onclick="showEmployeeResult(${JSON.stringify(employee).replace(/"/g, '&quot;')})" class="btn-primary">상세보기</button>
        <button onclick="showEmployeeMessages(${JSON.stringify(employee).replace(/"/g, '&quot;')})" class="btn-secondary message-btn">
          메시지
          ${badgeHTML}
        </button>
        <button onclick="deleteEmployee('${employee.id}')" class="btn-danger">삭제</button>
      </div>
    `;
    resultsContainer.appendChild(employeeCard);
  }

  // searchPage에 그대로 유지 (resultPage로 이동하지 않음)
}

// 검색 페이지 로드 시 저장된 검색 결과 복원
window.restoreSearchResults = async function() {
  const searchResults = sessionStorage.getItem('searchResults');
  const searchName = sessionStorage.getItem('searchName');
  const searchTeam = sessionStorage.getItem('searchTeam');
  
  if (searchResults && searchName !== null && searchTeam !== null) {
    try {
      const employees = JSON.parse(searchResults);
      
      // 입력 필드에 검색 조건 복원
      if (document.getElementById('searchName')) {
        document.getElementById('searchName').value = searchName || '';
      }
      if (document.getElementById('searchTeam')) {
        document.getElementById('searchTeam').value = searchTeam || '';
      }
      
      // 검색 결과 표시
      await displaySearchResults(employees);
      
      // 상태 메시지 업데이트
      const status = document.getElementById('searchStatus');
      if (status) {
        status.textContent = `${employees.length}명을 찾았습니다! (복원됨)`;
        status.style.color = "#27ae60";
      }
    } catch (error) {
      console.error('Failed to restore search results:', error);
      // 복원 실패 시 저장된 데이터 삭제
      sessionStorage.removeItem('searchResults');
      sessionStorage.removeItem('searchName');
      sessionStorage.removeItem('searchTeam');
    }
  }
};

// 검색 초기화 함수
window.clearSearch = function() {
  // 입력 필드 초기화
  if (document.getElementById('searchName')) {
    document.getElementById('searchName').value = '';
  }
  if (document.getElementById('searchTeam')) {
    document.getElementById('searchTeam').value = '';
  }
  
  // 검색 결과 초기화
  const resultsContainer = document.getElementById('searchResults');
  if (resultsContainer) {
    resultsContainer.innerHTML = '';
  }
  
  // 상태 메시지 초기화
  const status = document.getElementById('searchStatus');
  if (status) {
    status.textContent = '';
  }
  
  // 세션 스토리지에서 검색 데이터 삭제
  sessionStorage.removeItem('searchResults');
  sessionStorage.removeItem('searchName');
  sessionStorage.removeItem('searchTeam');
};

// 상세 결과 표시 (HTML에서 호출)
window.showEmployeeResult = function(employee) {
  // 현재 정보를 전역 변수에 저장 (다운로드 및 댓글용)
  window.currentEmployee = employee;
  
  // 카드 내용 생성
  const resultCard = document.getElementById('resultCard');
  
  // 아바타 SVG 생성 (화면 표시용)
  let avatarData;
  if (employee.avatarData) {
    try {
      avatarData = typeof employee.avatarData === 'string' ? JSON.parse(employee.avatarData) : employee.avatarData;
    } catch (e) {
      console.error('Failed to parse avatar data:', e);
    }
  }
  
  const avatarSVG = generateAvatarSVG(avatarData);
  
  // 말씀 구절 (저장된 값 또는 랜덤)
  let verseContent = employee.verseContent || '';
  let verseReference = employee.verseReference || '';
  
  if (!verseContent && Array.isArray(window.verses) && window.verses.length > 0) {
    const v = window.verses[Math.floor(Math.random() * window.verses.length)];
    verseContent = v.content;
    verseReference = v.reference;
  }
  
  // 카드 플립 구조로 HTML 구성
  resultCard.innerHTML = `
    <div class="card-flip-container" id="cardFlipContainer">
      <!-- 카드 뒷면 -->
      <div class="card-face card-back"></div>
      
      <!-- 카드 앞면 -->
      <div class="card-face card-front">
        <div class="line-card">
          <div class="line-logo">HANEUL</div>
          <div class="line-info">
            <h2>${employee.name || ''}</h2>
            <p class="line-team">${employee.team || ''}</p>
            <p class="line-bible-verse">
              ${verseContent}
              <span class="line-bible-reference">${verseReference}</span>
            </p>
          </div>
          <div class="line-character">
            ${avatarSVG}
          </div>
        </div>
      </div>
    </div>
  `;
  
  showPage('resultPage');
  
  // 페이지 전환 후 카드 뒤집기 애니메이션 실행
  setTimeout(() => {
    const cardContainer = document.getElementById('cardFlipContainer');
    if (cardContainer) {
      cardContainer.classList.add('flipped');
      
      // 말씀 길이에 따라 아바타 크기 조정
      const lineCard = cardContainer.querySelector('.line-card');
      const verseElement = cardContainer.querySelector('.line-bible-verse');
      
      if (lineCard && verseElement) {
        // 실제 렌더링된 높이로 줄 수 계산
        const lineHeight = parseFloat(window.getComputedStyle(verseElement).lineHeight);
        const verseHeight = verseElement.scrollHeight;
        const lineCount = Math.round(verseHeight / lineHeight);
        
        // 말씀 길이에 따라 클래스 추가
        if (lineCount <= 4) {
          lineCard.classList.add('verse-short');
        } else if (lineCount <= 6) {
          lineCard.classList.add('verse-medium');
        } else if (lineCount <= 8) {
          lineCard.classList.add('verse-long');
        } else {
          lineCard.classList.add('verse-extra-long');
        }
      }
      
      // 간단하고 안정적인 스와이프 구현
      let touchStartX = 0;
      let touchStartY = 0;
      let isFlipping = false;
      let lastClickTime = 0;
      
      const flipCard = function() {
        if (isFlipping) return;
        isFlipping = true;
        cardContainer.classList.toggle('flipped');
        setTimeout(() => {
          isFlipping = false;
        }, 600);
      };
      
      // 터치 시작
      cardContainer.addEventListener('touchstart', function(e) {
        if (isFlipping) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      
      // 터치 종료 - 스와이프 또는 더블탭 감지
      cardContainer.addEventListener('touchend', function(e) {
        if (isFlipping) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // 좌우 스와이프인지 확인 (상하 이동보다 좌우 이동이 큰 경우)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          flipCard();
          lastClickTime = 0; // 스와이프 후 더블탭 카운트 리셋
        } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          // 움직임이 거의 없으면 탭으로 간주 - 더블탭 감지
          const currentTime = new Date().getTime();
          const tapInterval = currentTime - lastClickTime;
          
          if (tapInterval < 300 && tapInterval > 0) {
            // 더블탭!
            flipCard();
            lastClickTime = 0; // 리셋
          } else {
            // 첫 번째 탭
            lastClickTime = currentTime;
          }
        }
      }, { passive: true });
      
      // PC - 클릭 이벤트로 더블클릭 감지
      cardContainer.addEventListener('click', function(e) {
        if (isFlipping) return;
        
        const currentTime = new Date().getTime();
        const clickInterval = currentTime - lastClickTime;
        
        if (clickInterval < 300 && clickInterval > 0) {
          // 더블클릭!
          flipCard();
          lastClickTime = 0; // 리셋
        } else {
          // 첫 번째 클릭
          lastClickTime = currentTime;
        }
      });
    }
  }, 100);
};

// 삭제 함수 (HTML에서 호출)
window.deleteEmployee = async function(employeeId) {
  if (!confirm('정말로 이 데이터를 삭제하시겠습니까?\n\n관련된 모든 댓글도 함께 삭제됩니다.')) {
    return;
  }

  try {
    // Firebase에서 employee 삭제
    await remove(ref(db, `employees/${employeeId}`));
    
    // 관련된 댓글도 모두 삭제
    await remove(ref(db, `comments/${employeeId}`));
    
    // 화면에서 해당 카드 찾기
    const resultsContainer = document.getElementById('searchResults');
    const cards = resultsContainer.querySelectorAll('.employee-card');
    
    // 삭제할 카드 찾기
    let cardToRemove = null;
    cards.forEach(card => {
      const deleteButton = card.querySelector(`button[onclick*="deleteEmployee('${employeeId}')"]`);
      if (deleteButton) {
        cardToRemove = card;
      }
    });
    
    if (cardToRemove) {
      // 페이드아웃 애니메이션 추가
      cardToRemove.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      cardToRemove.style.opacity = '0';
      cardToRemove.style.transform = 'scale(0.9)';
      
      // 애니메이션 후 DOM에서 제거
      setTimeout(() => {
        cardToRemove.remove();
        
        // 남은 카드 수 확인
        const remainingCards = resultsContainer.querySelectorAll('.employee-card').length;
        
        // 검색 상태 업데이트
        const status = document.getElementById('searchStatus');
        if (remainingCards === 0) {
          status.textContent = "데이터가 삭제되었습니다.";
          status.style.color = "#27ae60";
        } else {
          status.textContent = `삭제 완료! (${remainingCards}명 남음)`;
          status.style.color = "#27ae60";
        }
      }, 300);
    }
  } catch (error) {
    alert('삭제 실패: ' + error.message);
  }
};

// 아바타 다운로드 함수 (HTML에서 호출)
window.downloadAvatar = function(name, employeeId) {
  // 현재 아바타 상태 가져오기
  const currentAvatarState = getCurrentAvatarState();
  const svg = generateAvatarSVG(currentAvatarState);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  canvas.width = 400;
  canvas.height = 400;
  
  img.onload = function() {
    ctx.drawImage(img, 0, 0, 400, 400);
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}_${employeeId || 'avatar'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(svg);
};

// 이미지로 저장 함수
window.saveAsImage = async function() {
  const resultContainer = document.querySelector('.result-container');
  const resultCard = document.getElementById('resultCard');
  
  if (!resultContainer || !resultCard) {
    alert('결과 화면을 찾을 수 없습니다.');
    return;
  }
  
  try {
    // 저장 전에 말씀 길이에 따른 클래스가 제대로 적용되어 있는지 확인
    const cardFlipContainer = resultCard.querySelector('.card-flip-container');
    const lineCard = cardFlipContainer ? cardFlipContainer.querySelector('.line-card') : null;
    const verseElement = lineCard ? lineCard.querySelector('.line-bible-verse') : null;
    
    // 말씀 길이에 따른 클래스가 없으면 추가
    if (lineCard && verseElement) {
      // 기존 클래스 제거
      lineCard.classList.remove('verse-short', 'verse-medium', 'verse-long', 'verse-extra-long');
      
      // 실제 렌더링된 높이로 줄 수 계산
      const lineHeight = parseFloat(window.getComputedStyle(verseElement).lineHeight);
      const verseHeight = verseElement.scrollHeight;
      const lineCount = Math.round(verseHeight / lineHeight);
      
      console.log('이미지 저장 시 말씀 줄 수:', lineCount);
      
      // 말씀 길이에 따라 클래스 추가
      if (lineCount <= 4) {
        lineCard.classList.add('verse-short');
        console.log('적용된 클래스: verse-short');
      } else if (lineCount <= 6) {
        lineCard.classList.add('verse-medium');
        console.log('적용된 클래스: verse-medium');
      } else if (lineCount <= 8) {
        lineCard.classList.add('verse-long');
        console.log('적용된 클래스: verse-long');
      } else {
        lineCard.classList.add('verse-extra-long');
        console.log('적용된 클래스: verse-extra-long');
      }
    }
    
    // 저장 모드 활성화 (배경 + 로고 포함)
    resultContainer.classList.add('saving-mode');
    
    // 아바타를 SVG에서 PNG로 임시 교체
    const characterDiv = resultCard.querySelector('.line-character');
    const originalHTML = characterDiv ? characterDiv.innerHTML : '';
    
    // 현재 아바타 데이터로 고해상도 PNG 생성
    if (characterDiv && window.currentEmployee && window.currentEmployee.avatarData) {
      try {
        const avatarData = typeof window.currentEmployee.avatarData === 'string' 
          ? JSON.parse(window.currentEmployee.avatarData) 
          : window.currentEmployee.avatarData;
        
        // 고해상도 PNG 생성 (1024px)
        const avatarPNG = generateAvatarPNG(avatarData);
        characterDiv.innerHTML = avatarPNG;
        
        // PNG 이미지 요소 찾기
        const imgElement = characterDiv.querySelector('img');
        if (imgElement) {
          // 이미지 완전 로딩 대기
          await new Promise((resolve) => {
            if (imgElement.complete) {
              resolve();
            } else {
              imgElement.onload = resolve;
              imgElement.onerror = resolve;
            }
          });
          // 추가 안정화 시간
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (e) {
        console.error('Failed to convert to PNG:', e);
      }
    }
    
    // html2canvas 로드
    const html2canvas = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');
    
    // 전체 컨테이너 캡처 (배경 + 로고 포함)
    // 아바타는 이미 1024px PNG로 고해상도이므로 scale 2면 충분
    const canvas = await html2canvas.default(resultContainer, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      logging: false,
      scale: 2,
      width: 540,
      height: 960,
      windowWidth: 540,
      windowHeight: 960,
      imageTimeout: 0, // 이미지 로딩 타임아웃 제거
      removeContainer: false
    });
    
    // 아바타를 원래 SVG로 복원
    if (characterDiv && originalHTML) {
      characterDiv.innerHTML = originalHTML;
    }
    
    // 저장 모드 비활성화
    resultContainer.classList.remove('saving-mode');
    
    // 다운로드 - 최고 품질 PNG
    const dataURL = canvas.toDataURL('image/png'); // PNG는 무손실이므로 품질 파라미터 불필요
    const link = document.createElement('a');
    const employeeName = window.currentEmployee ? window.currentEmployee.name : 'HANEUL';
    link.download = `${employeeName}_카드.png`;
    link.href = dataURL;
    link.click();
  } catch (error) {
    console.error('캡처 오류:', error);
    alert('이미지 저장 중 오류가 발생했습니다: ' + error.message);
    
    // 오류 시 저장 모드 비활성화
    resultContainer.classList.remove('saving-mode');
    
    // 아바타 복원
    const characterDiv = resultCard.querySelector('.line-character');
    if (characterDiv) {
      characterDiv.innerHTML = '';
    }
  }
};

// 카드 이미지 데이터URL 생성 유틸 (DB 저장용)
async function generateCardImageDataURL(name, team, verseContent, verseReference, avatarData) {
  // 캡처를 위해 임시 DOM 구성: resultCard 구조와 동일
  const html2canvas = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm');

  const wrapper = document.createElement('div');
  wrapper.style.cssText = "position:fixed;left:-99999px;top:0;width:2160px;height:3840px;background:url('assets/images/back.jpg') center/cover no-repeat;display:flex;align-items:center;justify-content:center;padding:0;margin:0;box-sizing:border-box;";

  const card = document.createElement('div');
  card.style.cssText = "background:#f8f8f8;border-radius:64px;padding:0;width:1840px;height:3200px;box-shadow:0 24px 96px rgba(0,0,0,0.12);overflow:hidden;display:flex;flex-direction:column;box-sizing:border-box;";

  const photo = document.createElement('div');
  photo.className = 'employee-photo';
  photo.style.cssText = "width:1750px;height:1400px;margin:36px;border-radius:40px 40px 0 0;box-shadow:0 16px 48px rgba(0,0,0,0.12);overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;";

  // 아바타 이미지 생성 및 Data URL로 변환
  const avatarImgHtml = generateAvatarSVG(avatarData);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = avatarImgHtml;
  const tempImg = tempDiv.querySelector('img');
  const avatarUrl = tempImg.src;
  
  // Dicebear API에서 SVG 다운로드
  const svgResponse = await fetch(avatarUrl);
  const svgText = await svgResponse.text();
  
  // SVG를 Data URL로 변환
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const reader = new FileReader();
  const svgDataUrl = await new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(svgBlob);
  });
  
  // Data URL을 사용한 img 요소 생성
  const avatarImg = document.createElement('img');
  avatarImg.src = svgDataUrl;
  avatarImg.style.cssText = "width:100%;height:100%;object-fit:contain;";
  
  // 이미지 로드 대기
  await new Promise((resolve) => {
    avatarImg.onload = resolve;
    avatarImg.onerror = resolve;
  });
  
  photo.appendChild(avatarImg);

  const nameEl = document.createElement('div');
  nameEl.className = 'employee-name';
  nameEl.textContent = name;
  nameEl.style.cssText = "font-size:104px;padding:160px 96px 16px 96px;margin:-120px 0 0 0;border-radius:72px 72px 0 0;background:#fff;text-align:left;";

  const teamEl = document.createElement('div');
  teamEl.className = 'employee-team';
  teamEl.textContent = team;
  teamEl.style.cssText = "font-size:48px;padding:0 96px 28px 96px;background:#fff;text-align:left;";

  const verseEl = document.createElement('div');
  verseEl.className = 'employee-id';
  verseEl.innerHTML = verseContent ? `${verseContent}<br><span class=\"verse-reference\" style=\"display:block;margin-top:6px;opacity:0.75;\">${verseReference || ''}</span>` : '';
  verseEl.style.cssText = "font-size:36px;line-height:1.8;padding:0 96px 96px 96px;background:#fff;border-radius:0 0 36px 36px;text-align:left;flex:1 1 auto;overflow:hidden;";

  card.appendChild(photo);
  card.appendChild(nameEl);
  card.appendChild(teamEl);
  card.appendChild(verseEl);
  wrapper.appendChild(card);
  document.body.appendChild(wrapper);

  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  const canvas = await html2canvas.default(wrapper, {
    width: 2160,
    height: 3840,
    windowWidth: 2160,
    windowHeight: 3840,
    backgroundColor: null,
    useCORS: true,
    allowTaint: true,
    logging: false,
    removeContainer: false
  });

  const dataURL = canvas.toDataURL('image/png', 0.9);
  
  // 정리
  wrapper.remove();
  return dataURL;
}

// ============================================
// 관리자 페이지 함수들
// ============================================

// 전체 데이터 로드
window.adminLoadAll = async function() {
  const status = document.getElementById('adminStatus');
  status.textContent = "🔄 데이터 로딩 중...";
  status.style.color = "#3498db";

  try {
    const snapshot = await get(ref(db, "employees"));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const employees = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));

      // 정렬 옵션 적용
      const sortBy = document.getElementById('adminSortBy')?.value || 'createdAt';
      const sortOrder = document.getElementById('adminSortOrder')?.value || 'desc';
      
      employees.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'createdAt') {
          aVal = new Date(aVal || 0);
          bVal = new Date(bVal || 0);
        } else {
          aVal = String(aVal || '').toLowerCase();
          bVal = String(bVal || '').toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // 전역 변수에 저장 (admin.html의 JavaScript에서 사용)
      if (typeof currentData !== 'undefined') {
        currentData = employees;
      }

      displayAdminTable(employees, employees.length);
      
      // 선택 상태 초기화
      if (typeof selectedItems !== 'undefined') {
        selectedItems.clear();
        if (typeof updateSelectedCount === 'function') {
          updateSelectedCount();
        }
        if (typeof updateBulkActions === 'function') {
          updateBulkActions();
        }
        if (typeof updateSelectAllCheckbox === 'function') {
          updateSelectAllCheckbox();
        }
      }
      
      status.textContent = `전체 ${employees.length}개의 데이터를 불러왔습니다.`;
      status.style.color = "#27ae60";
    } else {
      displayAdminTable([], 0);
      status.textContent = "저장된 데이터가 없습니다.";
      status.style.color = "#e74c3c";
    }
  } catch (error) {
    status.textContent = "데이터 로딩 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 관리자 검색 (고급 필터링 포함)
window.adminSearch = async function() {
  const name = document.getElementById('adminSearchName').value.trim();
  const team = document.getElementById('adminSearchTeam').value.trim();
  const dateFrom = document.getElementById('adminSearchDateFrom').value;
  const dateTo = document.getElementById('adminSearchDateTo').value;
  const sortBy = document.getElementById('adminSortBy')?.value || 'createdAt';
  const sortOrder = document.getElementById('adminSortOrder')?.value || 'desc';
  const status = document.getElementById('adminStatus');

  // 모든 필터가 비어있으면 전체 로드
  if (!name && !team && !dateFrom && !dateTo) {
    adminLoadAll();
    return;
  }

  status.textContent = "검색 중...";
  status.style.color = "#3498db";

  try {
    const snapshot = await get(ref(db, "employees"));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      let employees = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));

      const totalCount = employees.length;

      // 고급 필터링
      employees = employees.filter(emp => {
        const nameMatch = !name || emp.name.toLowerCase().includes(name.toLowerCase());
        const teamMatch = !team || emp.team.toLowerCase().includes(team.toLowerCase());
        
        // 날짜 필터링
        let dateMatch = true;
        if (dateFrom || dateTo) {
          const empDate = new Date(emp.createdAt || 0);
          if (dateFrom) {
            const fromDate = new Date(dateFrom);
            dateMatch = dateMatch && empDate >= fromDate;
          }
          if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // 하루 끝까지
            dateMatch = dateMatch && empDate <= toDate;
          }
        }
        
        return nameMatch && teamMatch && dateMatch;
      });

      // 정렬 적용
      employees.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'createdAt') {
          aVal = new Date(aVal || 0);
          bVal = new Date(bVal || 0);
        } else {
          aVal = String(aVal || '').toLowerCase();
          bVal = String(bVal || '').toLowerCase();
        }
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // 전역 변수에 저장
      if (typeof currentData !== 'undefined') {
        currentData = employees;
      }

      displayAdminTable(employees, totalCount);
      
      // 선택 상태 초기화
      if (typeof selectedItems !== 'undefined') {
        selectedItems.clear();
        if (typeof updateSelectedCount === 'function') {
          updateSelectedCount();
        }
        if (typeof updateBulkActions === 'function') {
          updateBulkActions();
        }
        if (typeof updateSelectAllCheckbox === 'function') {
          updateSelectAllCheckbox();
        }
      }
      
      if (employees.length > 0) {
        status.textContent = `${employees.length}개의 데이터를 찾았습니다!`;
        status.style.color = "#27ae60";
      } else {
        status.textContent = "해당 조건에 맞는 데이터가 없습니다.";
        status.style.color = "#e74c3c";
      }
    } else {
      displayAdminTable([], 0);
      status.textContent = "저장된 데이터가 없습니다.";
      status.style.color = "#e74c3c";
    }
  } catch (error) {
    status.textContent = "검색 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 관리자 테이블 표시
function displayAdminTable(employees, totalCount) {
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';

  // 통계 업데이트
  document.getElementById('totalCount').textContent = totalCount;
  document.getElementById('filteredCount').textContent = employees.length;

  if (employees.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#999;">데이터가 없습니다.</td></tr>';
    return;
  }

  employees.forEach(employee => {
    const tr = document.createElement('tr');
    tr.dataset.employeeId = employee.id;

    // 체크박스
    const checkboxTd = document.createElement('td');
    checkboxTd.className = 'checkbox-column';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.id = employee.id;
    checkbox.onchange = () => toggleItemSelection(checkbox);
    checkboxTd.appendChild(checkbox);
    tr.appendChild(checkboxTd);

    // 아바타
    const avatarTd = document.createElement('td');
    let avatarHTML = '';
    if (employee.avatarData) {
      try {
        const avatarData = typeof employee.avatarData === 'string' ? JSON.parse(employee.avatarData) : employee.avatarData;
        avatarHTML = generateAvatarSVG(avatarData);
      } catch (e) {
        avatarHTML = '<div style="width:50px;height:50px;background:#ddd;border-radius:50%;"></div>';
      }
    } else {
      avatarHTML = '<div style="width:50px;height:50px;background:#ddd;border-radius:50%;"></div>';
    }
    avatarTd.innerHTML = `<div style="width:50px;height:50px;">${avatarHTML}</div>`;
    tr.appendChild(avatarTd);

    // 이름
    const nameTd = document.createElement('td');
    nameTd.textContent = employee.name || '-';
    tr.appendChild(nameTd);

    // 팀명
    const teamTd = document.createElement('td');
    teamTd.textContent = employee.team || '-';
    tr.appendChild(teamTd);

    // 말씀
    const verseTd = document.createElement('td');
    const verseText = employee.verseReference ? `${employee.verseReference}` : '-';
    verseTd.textContent = verseText;
    verseTd.style.fontSize = '0.9em';
    verseTd.style.color = '#666';
    tr.appendChild(verseTd);

    // 생성일
    const dateTd = document.createElement('td');
    if (employee.createdAt) {
      const date = new Date(employee.createdAt);
      dateTd.textContent = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      dateTd.textContent = '-';
    }
    dateTd.style.fontSize = '0.85em';
    tr.appendChild(dateTd);

    // 관리 버튼
    const actionTd = document.createElement('td');
    actionTd.innerHTML = `
      <button class="admin-btn admin-btn-view" onclick='showEmployeeResult(${JSON.stringify(employee).replace(/'/g, "\\'")})'>보기</button>
      <button class="admin-btn admin-btn-edit" onclick="openEditModal('${employee.id}')">수정</button>
      <button class="admin-btn admin-btn-delete" onclick="adminDeleteEmployee('${employee.id}')">삭제</button>
    `;
    tr.appendChild(actionTd);

    tbody.appendChild(tr);
  });
}

// 수정 모달 열기
window.openEditModal = async function(employeeId) {
  try {
    const snapshot = await get(ref(db, `employees/${employeeId}`));
    
    if (snapshot.exists()) {
      const employee = snapshot.val();
      
      document.getElementById('editName').value = employee.name || '';
      document.getElementById('editTeam').value = employee.team || '';
      document.getElementById('editVerse').value = employee.verseContent || '';
      document.getElementById('editReference').value = employee.verseReference || '';
      document.getElementById('editEmployeeId').value = employeeId;
      
      document.getElementById('editModal').style.display = 'flex';
    }
  } catch (error) {
    alert('데이터 로딩 실패: ' + error.message);
  }
};

// 수정 모달 닫기
window.closeEditModal = function() {
  document.getElementById('editModal').style.display = 'none';
};

// 수정 저장
window.saveEdit = async function() {
  const employeeId = document.getElementById('editEmployeeId').value;
  const name = document.getElementById('editName').value.trim();
  const team = document.getElementById('editTeam').value.trim();
  const verseContent = document.getElementById('editVerse').value.trim();
  const verseReference = document.getElementById('editReference').value.trim();

  if (!name || !team) {
    alert('이름과 팀명은 필수입니다!');
    return;
  }

  try {
    // 기존 데이터 가져오기
    const snapshot = await get(ref(db, `employees/${employeeId}`));
    if (!snapshot.exists()) {
      alert('데이터를 찾을 수 없습니다.');
      return;
    }

    const existingData = snapshot.val();

    // 업데이트할 데이터
    const updateData = {
      ...existingData,
      name,
      team,
      verseContent,
      verseReference,
      updatedAt: new Date().toISOString()
    };

    await set(ref(db, `employees/${employeeId}`), updateData);
    
    closeEditModal();
    alert('수정되었습니다!');
    
    // 테이블 새로고침
    const nameFilter = document.getElementById('adminSearchName').value.trim();
    const teamFilter = document.getElementById('adminSearchTeam').value.trim();
    if (nameFilter || teamFilter) {
      adminSearch();
    } else {
      adminLoadAll();
    }
  } catch (error) {
    alert('수정 실패: ' + error.message);
  }
};

// 관리자 페이지에서 삭제
window.adminDeleteEmployee = async function(employeeId) {
  if (!confirm('정말로 이 데이터를 삭제하시겠습니까?\n\n관련된 모든 댓글도 함께 삭제됩니다.')) {
    return;
  }

  try {
    // Firebase에서 employee 삭제
    await remove(ref(db, `employees/${employeeId}`));
    
    // 관련된 댓글도 모두 삭제
    await remove(ref(db, `comments/${employeeId}`));
    
    // 테이블에서 해당 행 찾기
    const row = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
    
    if (row) {
      // 페이드아웃 애니메이션
      row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      row.style.opacity = '0';
      row.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        row.remove();
        
        // 통계 업데이트
        const currentTotal = parseInt(document.getElementById('totalCount').textContent);
        const currentFiltered = parseInt(document.getElementById('filteredCount').textContent);
        document.getElementById('totalCount').textContent = currentTotal - 1;
        document.getElementById('filteredCount').textContent = currentFiltered - 1;
        
        // 남은 행 확인
        const tbody = document.getElementById('adminTableBody');
        if (tbody.children.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#999;">데이터가 없습니다.</td></tr>';
        }
        
        const status = document.getElementById('adminStatus');
        status.textContent = "삭제 완료!";
        status.style.color = "#27ae60";
      }, 300);
    }
  } catch (error) {
    alert('삭제 실패: ' + error.message);
  }
};

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
  const modal = document.getElementById('editModal');
  if (event.target === modal) {
    closeEditModal();
  }
});

// ============================================
// 메시지(댓글) 페이지 표시
// ============================================

// 메시지 페이지 표시
window.showEmployeeMessages = function(employee) {
  // 현재 정보를 전역 변수에 저장
  window.currentEmployee = employee;
  
  // 아바타 정보 표시
  document.getElementById('messagesTitle').textContent = `${employee.name}님의 응원 메시지`;
  document.getElementById('messageName').textContent = employee.name;
  document.getElementById('messageTeam').textContent = employee.team;
  
  // 아바타 이미지 표시
  const avatarContainer = document.getElementById('messageAvatar');
  let avatarHTML = '';
  if (employee.avatarData) {
    try {
      const avatarData = typeof employee.avatarData === 'string' ? JSON.parse(employee.avatarData) : employee.avatarData;
      avatarHTML = generateAvatarSVG(avatarData);
    } catch (e) {
      avatarHTML = '<div class="no-avatar">아바타 없음</div>';
    }
  } else {
    avatarHTML = '<div class="no-avatar">아바타 없음</div>';
  }
  avatarContainer.innerHTML = avatarHTML;
  
  // 댓글 로드
  if (employee.id) {
    loadMessagesComments(employee.id);
  }
  
  showPage('messagesPage');
};

// ============================================
// 댓글 기능
// ============================================

// 메시지 페이지에서 댓글 추가
window.addMessageComment = async function() {
  const author = document.getElementById('messageCommentAuthor').value.trim();
  const message = document.getElementById('messageCommentMessage').value.trim();
  const status = document.getElementById('messageCommentStatus');
  
  if (!author || !message) {
    status.textContent = "이름과 메시지를 모두 입력해주세요!";
    status.style.color = "#e74c3c";
    return;
  }
  
  if (!window.currentEmployee || !window.currentEmployee.id) {
    status.textContent = "사용자 정보를 찾을 수 없습니다.";
    status.style.color = "#e74c3c";
    return;
  }
  
  status.textContent = "메시지 등록 중...";
  status.style.color = "#3498db";
  
  try {
    const employeeId = window.currentEmployee.id;
    const commentData = {
      author: author,
      message: message,
      createdAt: new Date().toISOString()
    };
    
    // Firebase에 댓글 저장
    await push(ref(db, `comments/${employeeId}`), commentData);
    
    // 입력 필드 초기화
    document.getElementById('messageCommentAuthor').value = '';
    document.getElementById('messageCommentMessage').value = '';
    
    status.textContent = "메시지가 등록되었습니다!";
    status.style.color = "#27ae60";
    
    // 상태 메시지 초기화
    setTimeout(() => {
      status.textContent = "";
    }, 1500);
    
  } catch (error) {
    status.textContent = "메시지 등록 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 메시지 페이지 댓글 목록 불러오기 (실시간 리스너)
function loadMessagesComments(employeeId) {
  const commentsList = document.getElementById('messagesCommentsList');
  
  if (!commentsList || !employeeId) return;
  
  // 기존 리스너 정리
  if (window.messagesCommentsListener) {
    window.messagesCommentsListener();
  }
  
  try {
    // 실시간 리스너 설정
    const commentsRef = ref(db, `comments/${employeeId}`);
    window.messagesCommentsListener = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const comments = [];
        snapshot.forEach(childSnapshot => {
          comments.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        // 최신순 정렬
        comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        displayComments(comments, employeeId);
      } else {
        commentsList.innerHTML = '<div class="no-comments">아직 응원 메시지가 없습니다. 첫 번째 메시지를 남겨주세요!</div>';
      }
    }, (error) => {
      console.error('Failed to load comments:', error);
      commentsList.innerHTML = '<div class="no-comments">댓글을 불러오는데 실패했습니다.</div>';
    });
  } catch (error) {
    console.error('Failed to setup comments listener:', error);
    commentsList.innerHTML = '<div class="no-comments">댓글을 불러오는데 실패했습니다.</div>';
  }
}

// 댓글 표시
function displayComments(comments, employeeId) {
  const commentsList = document.getElementById('messagesCommentsList');
  
  if (!commentsList) return;
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<div class="no-comments">아직 응원 메시지가 없습니다. 첫 번째 메시지를 남겨주세요!</div>';
    return;
  }
  
  commentsList.innerHTML = comments.map(comment => {
    const date = new Date(comment.createdAt);
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
      return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          <span class="comment-date">${formattedDate}</span>
        </div>
        <div class="comment-message">${comment.message}</div>
        <div class="comment-actions">
          <button class="comment-edit-btn" onclick="editComment('${employeeId}', '${comment.id}', '${comment.author.replace(/'/g, "\\'")}', '${comment.message.replace(/'/g, "\\'")}')">수정</button>
          <button class="comment-delete-btn" onclick="deleteComment('${employeeId}', '${comment.id}')">삭제</button>
        </div>
      </div>
    `;
  }).join('');
}

// 댓글 수정 (내용만 수정 가능)
window.editComment = async function(employeeId, commentId, currentAuthor, currentMessage) {
  const newMessage = prompt('메시지 수정:', currentMessage);
  if (newMessage === null) return; // 취소
  
  if (!newMessage.trim()) {
    alert('메시지를 입력해주세요!');
    return;
  }
  
  try {
    // 기존 댓글 데이터 가져오기
    const snapshot = await get(ref(db, `comments/${employeeId}/${commentId}`));
    if (!snapshot.exists()) {
      alert('댓글을 찾을 수 없습니다.');
      return;
    }
    
    const originalData = snapshot.val();
    
    // 작성자와 작성 시간은 유지, 메시지만 업데이트
    await set(ref(db, `comments/${employeeId}/${commentId}`), {
      author: originalData.author,
      message: newMessage.trim(),
      createdAt: originalData.createdAt,
      edited: true
    });
    
    alert('메시지가 수정되었습니다!');
  } catch (error) {
    alert('수정 실패: ' + error.message);
  }
};

// 댓글 삭제
window.deleteComment = async function(employeeId, commentId) {
  if (!confirm('이 메시지를 삭제하시겠습니까?')) {
    return;
  }
  
  try {
    await remove(ref(db, `comments/${employeeId}/${commentId}`));
  } catch (error) {
    alert('삭제 실패: ' + error.message);
  }
};

// 댓글 개수 가져오기
async function getCommentCount(employeeId) {
  try {
    const snapshot = await get(ref(db, `comments/${employeeId}`));
    return snapshot.exists() ? snapshot.size : 0;
  } catch (error) {
    console.error('Failed to get comment count:', error);
    return 0;
  }
}

// ============================================
// 관리자 페이지 - 댓글 관리
// ============================================

// 관리자 탭 전환
window.switchAdminTab = function(tab) {
  // 탭 버튼 활성화
  document.querySelectorAll('.admin-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // 탭 컨텐츠 전환
  document.querySelectorAll('.admin-tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  if (tab === 'employees') {
    document.getElementById('employeesTab').classList.add('active');
  } else if (tab === 'comments') {
    document.getElementById('commentsTab').classList.add('active');
    // 댓글 관리 탭을 열면 자동으로 전체 댓글 로드
    adminLoadAllComments();
  }
};

// 전체 댓글 로드
window.adminLoadAllComments = async function() {
  const status = document.getElementById('commentAdminStatus');
  status.textContent = "댓글 로딩 중...";
  status.style.color = "#3498db";
  
  try {
    // 모든 employees 가져오기
    const employeesSnapshot = await get(ref(db, "employees"));
    
    if (!employeesSnapshot.exists()) {
      displayAdminComments([], 0);
      status.textContent = "저장된 데이터가 없습니다.";
      status.style.color = "#e74c3c";
      return;
    }
    
    const employeesData = employeesSnapshot.val();
    const allComments = [];
    
    // 각 employee의 댓글 가져오기
    for (const employeeId in employeesData) {
      const employee = employeesData[employeeId];
      const commentsSnapshot = await get(ref(db, `comments/${employeeId}`));
      
      if (commentsSnapshot.exists()) {
        const comments = commentsSnapshot.val();
        for (const commentId in comments) {
          allComments.push({
            id: commentId,
            commentId: commentId,
            employeeId: employeeId,
            avatarName: employee.name,
            employeeName: employee.name,
            employeeTeam: employee.team,
            ...comments[commentId]
          });
        }
      }
    }
    
    // 정렬 옵션 적용
    const sortBy = document.getElementById('commentSortBy')?.value || 'createdAt';
    const sortOrder = document.getElementById('commentSortOrder')?.value || 'desc';
    
    allComments.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // 전역 변수에 저장
    if (typeof currentComments !== 'undefined') {
      currentComments = allComments;
    }
    
    displayAdminComments(allComments, allComments.length);
    
    // 선택 상태 초기화
    if (typeof selectedComments !== 'undefined') {
      selectedComments.clear();
      if (typeof updateSelectedCommentCount === 'function') {
        updateSelectedCommentCount();
      }
      if (typeof updateCommentBulkActions === 'function') {
        updateCommentBulkActions();
      }
      if (typeof updateSelectAllCommentCheckbox === 'function') {
        updateSelectAllCommentCheckbox();
      }
    }
    
    status.textContent = `전체 ${allComments.length}개의 댓글을 불러왔습니다.`;
    status.style.color = "#27ae60";
    
  } catch (error) {
    status.textContent = "댓글 로딩 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 댓글 검색
window.adminSearchComments = async function() {
  const searchName = document.getElementById('commentSearchName').value.trim();
  const searchAuthor = document.getElementById('commentSearchAuthor').value.trim();
  const status = document.getElementById('commentAdminStatus');
  
  if (!searchName && !searchAuthor) {
    status.textContent = "아바타 이름 또는 작성자를 입력해주세요!";
    status.style.color = "#e74c3c";
    return;
  }
  
  status.textContent = "검색 중...";
  status.style.color = "#3498db";
  
  try {
    // 모든 employees 가져오기
    const employeesSnapshot = await get(ref(db, "employees"));
    
    if (!employeesSnapshot.exists()) {
      displayAdminComments([], 0);
      status.textContent = "저장된 데이터가 없습니다.";
      status.style.color = "#e74c3c";
      return;
    }
    
    const employeesData = employeesSnapshot.val();
    const allComments = [];
    
    // 각 employee의 댓글 가져오기
    for (const employeeId in employeesData) {
      const employee = employeesData[employeeId];
      
      // 아바타 이름으로 필터링
      if (searchName && !employee.name.includes(searchName)) {
        continue;
      }
      
      const commentsSnapshot = await get(ref(db, `comments/${employeeId}`));
      
      if (commentsSnapshot.exists()) {
        const comments = commentsSnapshot.val();
        for (const commentId in comments) {
          const comment = comments[commentId];
          
          // 작성자로 필터링
          if (searchAuthor && !comment.author.includes(searchAuthor)) {
            continue;
          }
          
          allComments.push({
            commentId: commentId,
            employeeId: employeeId,
            employeeName: employee.name,
            employeeTeam: employee.team,
            ...comment
          });
        }
      }
    }
    
    // 최신순 정렬
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    displayAdminComments(allComments, allComments.length);
    
    if (allComments.length > 0) {
      status.textContent = `${allComments.length}개의 댓글을 찾았습니다!`;
      status.style.color = "#27ae60";
    } else {
      status.textContent = "해당 조건에 맞는 댓글이 없습니다.";
      status.style.color = "#e74c3c";
    }
    
  } catch (error) {
    status.textContent = "검색 실패: " + error.message;
    status.style.color = "#e74c3c";
  }
};

// 관리자 댓글 표시
function displayAdminComments(comments, totalCount) {
  const tbody = document.getElementById('adminCommentTableBody');
  tbody.innerHTML = '';
  
  // 통계 업데이트
  document.getElementById('totalCommentCount').textContent = totalCount;
  document.getElementById('filteredCommentCount').textContent = comments.length;
  
  if (comments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#999;">댓글이 없습니다.</td></tr>';
    return;
  }
  
  comments.forEach(comment => {
    const tr = document.createElement('tr');
    tr.dataset.commentId = comment.commentId;
    tr.dataset.employeeId = comment.employeeId;
    
    // 체크박스
    const checkboxTd = document.createElement('td');
    checkboxTd.className = 'checkbox-column';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.id = comment.id;
    checkbox.onchange = () => toggleCommentSelection(checkbox);
    checkboxTd.appendChild(checkbox);
    tr.appendChild(checkboxTd);
    
    // 아바타 이름
    const nameTd = document.createElement('td');
    nameTd.innerHTML = `<strong>${comment.employeeName}</strong><br><small style="color:#999;">${comment.employeeTeam}</small>`;
    tr.appendChild(nameTd);
    
    // 작성자
    const authorTd = document.createElement('td');
    authorTd.textContent = comment.author || '-';
    tr.appendChild(authorTd);
    
    // 메시지
    const messageTd = document.createElement('td');
    messageTd.textContent = comment.message.length > 50 ? comment.message.substring(0, 50) + '...' : comment.message;
    messageTd.style.fontSize = '0.9em';
    tr.appendChild(messageTd);
    
    // 작성일
    const dateTd = document.createElement('td');
    if (comment.createdAt) {
      const date = new Date(comment.createdAt);
      dateTd.textContent = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      dateTd.textContent = '-';
    }
    dateTd.style.fontSize = '0.85em';
    tr.appendChild(dateTd);
    
    // 관리 버튼
    const actionTd = document.createElement('td');
    actionTd.innerHTML = `
      <button class="admin-btn admin-btn-delete" onclick="adminDeleteComment('${comment.employeeId}', '${comment.commentId}')">삭제</button>
    `;
    tr.appendChild(actionTd);
    
    tbody.appendChild(tr);
  });
}

// 관리자 댓글 삭제
window.adminDeleteComment = async function(employeeId, commentId) {
  if (!confirm('이 댓글을 삭제하시겠습니까?')) {
    return;
  }
  
  try {
    await remove(ref(db, `comments/${employeeId}/${commentId}`));
    
    // 테이블에서 해당 행 찾기
    const row = document.querySelector(`tr[data-comment-id="${commentId}"][data-employee-id="${employeeId}"]`);
    
    if (row) {
      // 페이드아웃 애니메이션
      row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      row.style.opacity = '0';
      row.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        row.remove();
        
        // 통계 업데이트
        const currentTotal = parseInt(document.getElementById('totalCommentCount').textContent);
        const currentFiltered = parseInt(document.getElementById('filteredCommentCount').textContent);
        document.getElementById('totalCommentCount').textContent = currentTotal - 1;
        document.getElementById('filteredCommentCount').textContent = currentFiltered - 1;
        
        // 남은 행 확인
        const tbody = document.getElementById('adminCommentTableBody');
        if (tbody.children.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:#999;">댓글이 없습니다.</td></tr>';
        }
        
        const status = document.getElementById('commentAdminStatus');
        status.textContent = "댓글 삭제 완료!";
        status.style.color = "#27ae60";
      }, 300);
    }
  } catch (error) {
    alert('삭제 실패: ' + error.message);
  }
};

// 페이지 로드 시 초기화
// 모든 뷰가 로드된 후에 현재 URL에 따라 적절한 페이지 표시
window.addEventListener('viewsLoaded', function() {
  // URL 해시에 따라 페이지 결정
  const hash = window.location.hash.substring(1);
  if (hash && document.getElementById(hash + 'Page')) {
    showPage(hash + 'Page');
  } else {
    showPage('mainPage');
  }
  
  // 브라우저 뒤로가기/앞으로가기 처리
  window.addEventListener('popstate', function(event) {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash + 'Page')) {
      // URL 해시만 업데이트하고 페이지 전환은 하지 않음 (무한 루프 방지)
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(hash + 'Page').classList.add('active');
      
      // 검색 페이지인 경우 검색 결과 복원
      if (hash === 'search' && typeof window.restoreSearchResults === 'function') {
        setTimeout(() => {
          window.restoreSearchResults();
        }, 100);
      }
    } else {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('mainPage').classList.add('active');
    }
  });
});

// ============================================
// 관리자 일괄 삭제 함수들
// ============================================

// 관리자용 직원 삭제 (일괄 삭제용)
window.deleteEmployee = async function(employeeId) {
  try {
    // 직원 데이터 삭제
    await remove(ref(db, `employees/${employeeId}`));
    
    // 관련 댓글도 삭제
    await remove(ref(db, `comments/${employeeId}`));
    
    console.log(`Employee ${employeeId} deleted successfully`);
  } catch (error) {
    console.error('Delete employee failed:', error);
    throw error;
  }
};

// 관리자용 댓글 삭제 (일괄 삭제용) - 기존 함수와 구분
window.deleteCommentById = async function(commentId) {
  try {
    // 모든 직원의 댓글에서 해당 댓글 찾기
    const employeesSnapshot = await get(ref(db, "employees"));
    if (employeesSnapshot.exists()) {
      const employeesData = employeesSnapshot.val();
      
      for (const employeeId in employeesData) {
        const commentsSnapshot = await get(ref(db, `comments/${employeeId}`));
        if (commentsSnapshot.exists()) {
          const comments = commentsSnapshot.val();
          if (comments[commentId]) {
            await remove(ref(db, `comments/${employeeId}/${commentId}`));
            console.log(`Comment ${commentId} deleted successfully`);
            return;
          }
        }
      }
    }
    
    throw new Error('Comment not found');
  } catch (error) {
    console.error('Delete comment failed:', error);
    throw error;
  }
};