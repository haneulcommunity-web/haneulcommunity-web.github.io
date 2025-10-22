// ===== 에셋 정의 =====
// SVG 기반 아바타 파트들의 정의
const ASSETS = {
  faceShape: {
    oval: `<ellipse cx="256" cy="280" rx="140" ry="160" fill="var(--skin-color)"/>`,
    round: `<circle cx="256" cy="280" r="150" fill="var(--skin-color)"/>`,
    square: `<rect x="116" y="130" width="280" height="300" rx="40" fill="var(--skin-color)"/>`,
    heart: `<path d="M 256 130 Q 180 130 140 200 Q 140 280 256 400 Q 372 280 372 200 Q 332 130 256 130 Z" fill="var(--skin-color)"/>`,
    long: `<ellipse cx="256" cy="280" rx="120" ry="180" fill="var(--skin-color)"/>`
  },
  
  ears: {
    normal: `<ellipse cx="120" cy="280" rx="25" ry="35" fill="var(--skin-color)"/>
            <ellipse cx="392" cy="280" rx="25" ry="35" fill="var(--skin-color)"/>`,
    small: `<ellipse cx="120" cy="280" rx="18" ry="28" fill="var(--skin-color)"/>
           <ellipse cx="392" cy="280" rx="18" ry="28" fill="var(--skin-color)"/>`,
    large: `<ellipse cx="120" cy="280" rx="30" ry="42" fill="var(--skin-color)"/>
           <ellipse cx="392" cy="280" rx="30" ry="42" fill="var(--skin-color)"/>`,
    elf: `<path d="M 120 250 Q 100 260 110 290 Q 115 280 120 280 Z" fill="var(--skin-color)"/>
         <path d="M 392 250 Q 412 260 402 290 Q 397 280 392 280 Z" fill="var(--skin-color)"/>`
  },

  hair: {
    short_01: `<path d="M 256 140 Q 160 140 120 200 L 120 160 Q 120 100 256 100 Q 392 100 392 160 L 392 200 Q 352 140 256 140 Z" fill="var(--hair-color)"/>`,
    short_02: `<path d="M 256 120 Q 140 120 110 180 Q 110 140 256 110 Q 402 140 402 180 Q 372 120 256 120 Z" fill="var(--hair-color)"/>`,
    medium_01: `<path d="M 256 100 Q 120 100 100 200 L 100 220 Q 110 200 120 200 Q 120 140 256 130 Q 392 140 392 200 Q 402 200 412 220 L 412 200 Q 392 100 256 100 Z" fill="var(--hair-color)"/>`,
    long_01: `<path d="M 256 100 Q 100 100 90 250 L 90 300 Q 95 280 110 260 Q 120 200 256 140 Q 392 200 402 260 Q 417 280 422 300 L 422 250 Q 412 100 256 100 Z" fill="var(--hair-color)"/>`,
    bun: `<path d="M 256 140 Q 160 140 120 200 L 120 160 Q 120 100 256 100 Q 392 100 392 160 L 392 200 Q 352 140 256 140 Z" fill="var(--hair-color)"/>
         <circle cx="256" cy="80" r="40" fill="var(--hair-color)"/>`
  },

  hairBack: {
    short_01: ``,
    short_02: ``,
    medium_01: `<path d="M 110 240 Q 100 300 120 350 M 402 240 Q 412 300 392 350" stroke="var(--hair-color)" stroke-width="20" fill="none"/>`,
    long_01: `<path d="M 100 280 Q 90 350 100 420 M 412 280 Q 422 350 412 420" stroke="var(--hair-color)" stroke-width="25" fill="none"/>`,
    bun: ``
  },

  eyes: {
    normal: `<ellipse cx="210" cy="260" rx="20" ry="25" fill="var(--eyes-color)"/>
            <ellipse cx="302" cy="260" rx="20" ry="25" fill="var(--eyes-color)"/>
            <circle cx="215" cy="258" r="8" fill="white"/>
            <circle cx="307" cy="258" r="8" fill="white"/>`,
    happy: `<path d="M 190 260 Q 210 270 230 260" stroke="var(--eyes-color)" stroke-width="4" fill="none"/>
           <path d="M 282 260 Q 302 270 322 260" stroke="var(--eyes-color)" stroke-width="4" fill="none"/>`,
    sleepy: `<line x1="190" y1="265" x2="230" y2="265" stroke="var(--eyes-color)" stroke-width="4"/>
            <line x1="282" y1="265" x2="322" y2="265" stroke="var(--eyes-color)" stroke-width="4"/>`,
    wide: `<circle cx="210" cy="260" r="25" fill="var(--eyes-color)"/>
          <circle cx="302" cy="260" r="25" fill="var(--eyes-color)"/>
          <circle cx="215" cy="255" r="10" fill="white"/>
          <circle cx="307" cy="255" r="10" fill="white"/>`,
    wink: `<ellipse cx="210" cy="260" rx="20" ry="25" fill="var(--eyes-color)"/>
          <circle cx="215" cy="258" r="8" fill="white"/>
          <path d="M 282 260 Q 302 270 322 260" stroke="var(--eyes-color)" stroke-width="4" fill="none"/>`
  },

  eyebrows: {
    normal: `<path d="M 180 230 Q 210 225 240 230" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M 272 230 Q 302 225 332 230" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    angry: `<path d="M 180 235 Q 210 220 240 225" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>
           <path d="M 272 225 Q 302 220 332 235" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    raised: `<path d="M 180 225 Q 210 215 240 220" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M 272 220 Q 302 215 332 225" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    sad: `<path d="M 180 230 Q 210 235 240 230" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>
         <path d="M 272 230 Q 302 235 332 230" stroke="var(--eyebrows-color)" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    thin: `<path d="M 180 230 Q 210 228 240 230" stroke="var(--eyebrows-color)" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M 272 230 Q 302 228 332 230" stroke="var(--eyebrows-color)" stroke-width="3" fill="none" stroke-linecap="round"/>`
  },

  nose: {
    small: `<ellipse cx="256" cy="300" rx="8" ry="12" fill="rgba(0,0,0,0.1)"/>`,
    normal: `<path d="M 256 280 L 250 305 L 256 308 L 262 305 Z" fill="rgba(0,0,0,0.15)"/>`,
    large: `<path d="M 256 270 Q 245 290 248 310 L 264 310 Q 267 290 256 270 Z" fill="rgba(0,0,0,0.15)"/>`,
    button: `<circle cx="256" cy="300" r="10" fill="rgba(0,0,0,0.1)"/>`,
    pointed: `<path d="M 256 280 L 252 305 L 256 310 L 260 305 Z" fill="rgba(0,0,0,0.15)"/>`
  },

  mouth: {
    smile: `<path d="M 220 330 Q 256 350 292 330" stroke="var(--mouth-color)" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    laugh: `<path d="M 220 330 Q 256 360 292 330" stroke="var(--mouth-color)" stroke-width="5" fill="none" stroke-linecap="round"/>
           <path d="M 230 335 Q 256 350 282 335" fill="var(--mouth-color)" opacity="0.3"/>`,
    neutral: `<line x1="230" y1="340" x2="282" y2="340" stroke="var(--mouth-color)" stroke-width="4" stroke-linecap="round"/>`,
    sad: `<path d="M 220 345 Q 256 330 292 345" stroke="var(--mouth-color)" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    open: `<ellipse cx="256" cy="340" rx="30" ry="20" fill="var(--mouth-color)"/>
          <ellipse cx="256" cy="335" rx="25" ry="15" fill="rgba(0,0,0,0.3)"/>`
  },

  top: {
    tshirt: `<path d="M 140 400 L 160 380 Q 200 360 256 360 Q 312 360 352 380 L 372 400 L 372 512 L 140 512 Z" fill="var(--top-color)"/>
            <path d="M 240 360 Q 256 370 272 360" stroke="white" stroke-width="2" fill="none"/>`,
    hoodie: `<path d="M 130 390 L 150 370 Q 200 350 256 350 Q 312 350 362 370 L 382 390 L 382 512 L 130 512 Z" fill="var(--top-color)"/>
            <path d="M 200 355 Q 256 340 312 355" stroke="rgba(0,0,0,0.2)" stroke-width="3" fill="none"/>
            <circle cx="200" cy="380" r="8" fill="rgba(0,0,0,0.3)"/>
            <circle cx="312" cy="380" r="8" fill="rgba(0,0,0,0.3)"/>`,
    vneck: `<path d="M 140 400 L 160 380 Q 200 360 256 360 Q 312 360 352 380 L 372 400 L 372 512 L 140 512 Z" fill="var(--top-color)"/>
           <path d="M 230 360 L 256 390 L 282 360" stroke="white" stroke-width="3" fill="none"/>`,
    collar: `<path d="M 140 400 L 160 380 Q 200 360 256 360 Q 312 360 352 380 L 372 400 L 372 512 L 140 512 Z" fill="var(--top-color)"/>
            <path d="M 220 360 L 220 385 L 256 375 L 292 385 L 292 360" fill="white"/>`,
    tank: `<path d="M 160 380 L 180 400 L 180 512 L 140 512 L 140 420 Z" fill="var(--top-color)"/>
          <path d="M 352 380 L 332 400 L 332 512 L 372 512 L 372 420 Z" fill="var(--top-color)"/>
          <rect x="180" y="380" width="152" height="132" fill="var(--top-color)"/>`
  }
};

// ===== 색상 팔레트 =====
const COLORS = {
  skin: ['#FFDFC4', '#F0D5BE', '#EECEB3', '#E1B899', '#C68642', '#8D5524'],
  hair: ['#2C1B18', '#4E3B31', '#724133', '#A55728', '#B89778', '#F2D6B3', '#F59797', '#6A39D7'],
  eyes: ['#2C1B18', '#3D2817', '#5C4033', '#8B4513', '#1E90FF', '#228B22', '#9370DB'],
  eyebrows: ['#2C1B18', '#4E3B31', '#724133', '#A55728', '#B89778'],
  mouth: ['#D4686B', '#E87C7C', '#C25B5D', '#F4A7B9', '#DC6B9E'],
  top: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
};

// ===== 상태 관리 =====
let avatarState = {
  faceShape: { id: 'oval' },
  skinTone: { id: 'tone1', color: COLORS.skin[0] },
  hair: { id: 'short_01', color: COLORS.hair[0] },
  eyes: { id: 'normal', color: COLORS.eyes[0] },
  eyebrows: { id: 'normal', color: COLORS.eyebrows[0] },
  nose: { id: 'normal' },
  mouth: { id: 'smile', color: COLORS.mouth[0] },
  ears: { id: 'normal' },
  top: { id: 'tshirt', color: COLORS.top[0] }
};

let history = [];
let historyIndex = -1;
const MAX_HISTORY = 10;

// ===== 초기화 =====
function init() {
  loadFromLocalStorage();
  setupUI();
  renderAvatar(avatarState);
  saveToHistory();
}

// ===== UI 설정 =====
function setupUI() {
  // 얼굴형
  createOptions('faceShapeOptions', Object.keys(ASSETS.faceShape), 'faceShape', (id) => {
    applyOption('faceShape', { id });
  });

  // 피부색
  createColorOptions('skinToneOptions', COLORS.skin, (color, index) => {
    applyOption('skinTone', { id: `tone${index + 1}`, color });
  });

  // 머리
  createOptions('hairOptions', Object.keys(ASSETS.hair), 'hair', (id) => {
    applyOption('hair', { ...avatarState.hair, id });
  });
  createColorOptions('hairColorOptions', COLORS.hair, (color) => {
    applyColor('hair', color);
  });

  // 눈
  createOptions('eyesOptions', Object.keys(ASSETS.eyes), 'eyes', (id) => {
    applyOption('eyes', { ...avatarState.eyes, id });
  });
  createColorOptions('eyesColorOptions', COLORS.eyes, (color) => {
    applyColor('eyes', color);
  });

  // 눈썹
  createOptions('eyebrowsOptions', Object.keys(ASSETS.eyebrows), 'eyebrows', (id) => {
    applyOption('eyebrows', { ...avatarState.eyebrows, id });
  });
  createColorOptions('eyebrowsColorOptions', COLORS.eyebrows, (color) => {
    applyColor('eyebrows', color);
  });

  // 코
  createOptions('noseOptions', Object.keys(ASSETS.nose), 'nose', (id) => {
    applyOption('nose', { id });
  });

  // 입
  createOptions('mouthOptions', Object.keys(ASSETS.mouth), 'mouth', (id) => {
    applyOption('mouth', { ...avatarState.mouth, id });
  });
  createColorOptions('mouthColorOptions', COLORS.mouth, (color) => {
    applyColor('mouth', color);
  });

  // 귀
  createOptions('earsOptions', Object.keys(ASSETS.ears), 'ears', (id) => {
    applyOption('ears', { id });
  });

  // 상의
  createOptions('topOptions', Object.keys(ASSETS.top), 'top', (id) => {
    applyOption('top', { ...avatarState.top, id });
  });
  createColorOptions('topColorOptions', COLORS.top, (color) => {
    applyColor('top', color);
  });
}

function createOptions(containerId, options, part, callback) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option.replace(/_/g, ' ');
    btn.setAttribute('aria-pressed', avatarState[part].id === option);
    btn.setAttribute('aria-label', `${part} ${option}`);
    btn.onclick = () => {
      container.querySelectorAll('.option-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      callback(option);
    };
    container.appendChild(btn);
  });
}

function createColorOptions(containerId, colors, callback) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  colors.forEach((color, index) => {
    const btn = document.createElement('button');
    btn.className = 'color-btn';
    btn.style.background = color;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', `색상 ${index + 1}`);
    btn.onclick = () => {
      container.querySelectorAll('.color-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      callback(color, index);
    };
    container.appendChild(btn);
  });
}

// ===== 상태 변경 =====
function applyOption(part, option) {
  avatarState[part] = option;
  renderAvatar(avatarState);
  saveToHistory();
  saveToLocalStorage();
}

function applyColor(part, color) {
  avatarState[part].color = color;
  renderAvatar(avatarState);
  saveToHistory();
  saveToLocalStorage();
}

// ===== 렌더링 =====
function renderAvatar(state) {
  const svg = document.getElementById('avatarPreview');
  
  // CSS 변수 설정
  svg.style.setProperty('--skin-color', state.skinTone.color);
  svg.style.setProperty('--hair-color', state.hair.color || COLORS.hair[0]);
  svg.style.setProperty('--eyes-color', state.eyes.color || COLORS.eyes[0]);
  svg.style.setProperty('--eyebrows-color', state.eyebrows.color || COLORS.eyebrows[0]);
  svg.style.setProperty('--mouth-color', state.mouth.color || COLORS.mouth[0]);
  svg.style.setProperty('--top-color', state.top.color || COLORS.top[0]);

  // 각 파트 렌더링
  renderPart('faceShape', ASSETS.faceShape[state.faceShape.id]);
  renderPart('ears', ASSETS.ears[state.ears.id]);
  renderPart('hairBack', ASSETS.hairBack[state.hair.id] || '');
  renderPart('hair', ASSETS.hair[state.hair.id]);
  renderPart('eyes', ASSETS.eyes[state.eyes.id]);
  renderPart('eyebrows', ASSETS.eyebrows[state.eyebrows.id]);
  renderPart('nose', ASSETS.nose[state.nose.id]);
  renderPart('mouth', ASSETS.mouth[state.mouth.id]);
  renderPart('top', ASSETS.top[state.top.id]);
}

function renderPart(partName, svgContent) {
  const group = document.querySelector(`[data-part="${partName}"]`);
  if (group) {
    group.innerHTML = svgContent || '';
  }
}

// ===== 히스토리 관리 =====
function saveToHistory() {
  // 현재 위치 이후의 히스토리 제거
  history = history.slice(0, historyIndex + 1);
  
  // 새 상태 추가
  history.push(JSON.parse(JSON.stringify(avatarState)));
  
  // 최대 개수 유지
  if (history.length > MAX_HISTORY) {
    history.shift();
  } else {
    historyIndex++;
  }
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    avatarState = JSON.parse(JSON.stringify(history[historyIndex]));
    renderAvatar(avatarState);
    setupUI();
    saveToLocalStorage();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    avatarState = JSON.parse(JSON.stringify(history[historyIndex]));
    renderAvatar(avatarState);
    setupUI();
    saveToLocalStorage();
  }
}

// ===== 로컬 스토리지 =====
function saveToLocalStorage() {
  localStorage.setItem('avatarState', JSON.stringify(avatarState));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('avatarState');
  if (saved) {
    try {
      avatarState = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
  }
}

// ===== 무작위 생성 =====
function randomizeAll() {
  const faceShapes = Object.keys(ASSETS.faceShape);
  const hairStyles = Object.keys(ASSETS.hair);
  const eyeStyles = Object.keys(ASSETS.eyes);
  const eyebrowStyles = Object.keys(ASSETS.eyebrows);
  const noseStyles = Object.keys(ASSETS.nose);
  const mouthStyles = Object.keys(ASSETS.mouth);
  const earStyles = Object.keys(ASSETS.ears);
  const topStyles = Object.keys(ASSETS.top);

  avatarState = {
    faceShape: { id: faceShapes[Math.floor(Math.random() * faceShapes.length)] },
    skinTone: { id: `tone${Math.floor(Math.random() * COLORS.skin.length) + 1}`, color: COLORS.skin[Math.floor(Math.random() * COLORS.skin.length)] },
    hair: { id: hairStyles[Math.floor(Math.random() * hairStyles.length)], color: COLORS.hair[Math.floor(Math.random() * COLORS.hair.length)] },
    eyes: { id: eyeStyles[Math.floor(Math.random() * eyeStyles.length)], color: COLORS.eyes[Math.floor(Math.random() * COLORS.eyes.length)] },
    eyebrows: { id: eyebrowStyles[Math.floor(Math.random() * eyebrowStyles.length)], color: COLORS.eyebrows[Math.floor(Math.random() * COLORS.eyebrows.length)] },
    nose: { id: noseStyles[Math.floor(Math.random() * noseStyles.length)] },
    mouth: { id: mouthStyles[Math.floor(Math.random() * mouthStyles.length)], color: COLORS.mouth[Math.floor(Math.random() * COLORS.mouth.length)] },
    ears: { id: earStyles[Math.floor(Math.random() * earStyles.length)] },
    top: { id: topStyles[Math.floor(Math.random() * topStyles.length)], color: COLORS.top[Math.floor(Math.random() * COLORS.top.length)] }
  };

  renderAvatar(avatarState);
  setupUI();
  saveToHistory();
  saveToLocalStorage();
}

function randomizePart(part) {
  const styles = Object.keys(ASSETS[part]);
  const randomId = styles[Math.floor(Math.random() * styles.length)];
  const colorKey = part === 'hair' ? 'hair' : part;
  const randomColor = COLORS[colorKey] ? COLORS[colorKey][Math.floor(Math.random() * COLORS[colorKey].length)] : null;

  if (randomColor) {
    avatarState[part] = { id: randomId, color: randomColor };
  } else {
    avatarState[part] = { id: randomId };
  }

  renderAvatar(avatarState);
  setupUI();
  saveToHistory();
  saveToLocalStorage();
}

// ===== 초기화 =====
function resetAvatar() {
  if (confirm('아바타를 초기화하시겠습니까?')) {
    avatarState = {
      faceShape: { id: 'oval' },
      skinTone: { id: 'tone1', color: COLORS.skin[0] },
      hair: { id: 'short_01', color: COLORS.hair[0] },
      eyes: { id: 'normal', color: COLORS.eyes[0] },
      eyebrows: { id: 'normal', color: COLORS.eyebrows[0] },
      nose: { id: 'normal' },
      mouth: { id: 'smile', color: COLORS.mouth[0] },
      ears: { id: 'normal' },
      top: { id: 'tshirt', color: COLORS.top[0] }
    };
    renderAvatar(avatarState);
    setupUI();
    saveToHistory();
    saveToLocalStorage();
  }
}

// ===== 내보내기 =====
function exportSVG() {
  const svg = document.getElementById('avatarPreview');
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'avatar.svg';
  a.click();
  
  URL.revokeObjectURL(url);
}

function exportPNG() {
  const svg = document.getElementById('avatarPreview');
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  canvas.width = 512;
  canvas.height = 512;

  img.onload = function() {
    const transparent = document.getElementById('transparentBg').checked;
    
    if (!transparent) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.drawImage(img, 0, 0);
    
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'avatar.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

// ===== 프리셋 관리 =====
function savePreset() {
  const presets = JSON.parse(localStorage.getItem('avatarPresets') || '[]');
  const name = prompt('프리셋 이름을 입력하세요:');
  
  if (name) {
    presets.push({ name, state: avatarState });
    localStorage.setItem('avatarPresets', JSON.stringify(presets));
    alert('프리셋이 저장되었습니다!');
  }
}

function loadPreset() {
  const presets = JSON.parse(localStorage.getItem('avatarPresets') || '[]');
  
  if (presets.length === 0) {
    alert('저장된 프리셋이 없습니다.');
    return;
  }

  const names = presets.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
  const index = prompt(`불러올 프리셋 번호를 입력하세요:\n${names}`);
  
  if (index && presets[parseInt(index) - 1]) {
    avatarState = presets[parseInt(index) - 1].state;
    renderAvatar(avatarState);
    setupUI();
    saveToHistory();
    saveToLocalStorage();
  }
}

function copyJSON() {
  const json = JSON.stringify(avatarState, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    alert('JSON이 클립보드에 복사되었습니다!');
  });
}

function toggleJSONViewer() {
  const viewer = document.getElementById('jsonViewer');
  viewer.classList.toggle('show');
  
  if (viewer.classList.contains('show')) {
    viewer.textContent = JSON.stringify(avatarState, null, 2);
  }
}

// ===== 키보드 접근성 =====
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  }
});

// ===== 앱 시작 =====
window.addEventListener('DOMContentLoaded', init);

