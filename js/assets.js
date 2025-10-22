// ===== Dicebear HTTP API 기반 아바타 에셋 =====
// lorelei 스타일로 고정

// 헤어스타일 레이블 (숫자로 단순화)
const HAIR_LABELS = {
  'variant01': '1',
  'variant02': '2',
  'variant03': '3',
  'variant04': '4',
  'variant05': '5',
  'variant06': '6',
  'variant07': '7',
  'variant08': '8',
  'variant09': '9',
  'variant10': '10',
  'variant11': '11',
  'variant12': '12',
  'variant13': '13',
  'variant14': '14',
  'variant15': '15',
  'variant16': '16',
  'variant17': '17',
  'variant18': '18',
  'variant19': '19',
  'variant20': '20',
  'variant21': '21',
  'variant22': '22',
  'variant23': '23',
  'variant24': '24',
  'variant25': '25',
  'variant26': '26',
  'variant27': '27',
  'variant28': '28',
  'variant29': '29',
  'variant30': '30',
  'variant31': '31',
  'variant32': '32',
  'variant33': '33',
  'variant34': '34',
  'variant35': '35',
  'variant36': '36',
  'variant37': '37',
  'variant38': '38',
  'variant39': '39',
  'variant40': '40',
  'variant41': '41',
  'variant42': '42',
  'variant43': '43',
  'variant44': '44',
  'variant45': '45',
  'variant46': '46',
  'variant47': '47',
  'variant48': '48'
};

// lorelei 스타일 옵션
const LORELEI_OPTIONS = {
  hair: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40', 'variant41', 'variant42', 'variant43', 'variant44', 'variant45', 'variant46', 'variant47', 'variant48'],
  eyes: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24'],
  eyebrows: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13'],
  mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy09', 'happy10', 'happy11', 'happy12', 'happy13', 'happy14', 'happy15', 'happy16', 'happy17', 'happy18', 'sad01', 'sad02', 'sad03', 'sad04', 'sad05', 'sad06', 'sad07', 'sad08', 'sad09'],
  nose: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06'],
  glasses: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05']
};

// Dicebear HTTP API를 사용한 아바타 생성 함수 (더 간단하고 안정적)
function createDicebearAvatar(options = {}) {
  const style = options.style || 'lorelei';
  const seed = options.seed || Date.now().toString();
  const dicebearOptions = options.dicebearOptions || {};
  
  try {
    // API URL 생성
    let apiUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
    
    // scale 옵션 추가 (기본값: 100)
    const scale = dicebearOptions.scale || 100;
    apiUrl += `&scale=${scale}`;
    
    // 옵션 추가
    if (dicebearOptions.hair && dicebearOptions.hair.length > 0) {
      apiUrl += `&hair=${encodeURIComponent(dicebearOptions.hair.join(','))}`;
    }
    if (dicebearOptions.eyes && dicebearOptions.eyes.length > 0) {
      apiUrl += `&eyes=${encodeURIComponent(dicebearOptions.eyes.join(','))}`;
    }
    if (dicebearOptions.eyebrows && dicebearOptions.eyebrows.length > 0) {
      apiUrl += `&eyebrows=${encodeURIComponent(dicebearOptions.eyebrows.join(','))}`;
    }
    if (dicebearOptions.mouth && dicebearOptions.mouth.length > 0) {
      apiUrl += `&mouth=${encodeURIComponent(dicebearOptions.mouth.join(','))}`;
    }
    if (dicebearOptions.nose && dicebearOptions.nose.length > 0) {
      apiUrl += `&nose=${encodeURIComponent(dicebearOptions.nose.join(','))}`;
    }
    if (dicebearOptions.glasses && dicebearOptions.glasses.length > 0) {
      apiUrl += `&glassesProbability=100&glasses=${encodeURIComponent(dicebearOptions.glasses.join(','))}`;
    } else {
      // 안경이 없을 때는 명시적으로 probability를 0으로 설정
      apiUrl += `&glassesProbability=0`;
    }
    if (dicebearOptions.earrings && dicebearOptions.earrings.length > 0) {
      apiUrl += `&earrings=${encodeURIComponent(dicebearOptions.earrings.join(','))}`;
    }
    if (dicebearOptions.freckles && dicebearOptions.freckles.length > 0) {
      apiUrl += `&freckles=${encodeURIComponent(dicebearOptions.freckles.join(','))}`;
    }
    if (dicebearOptions.hairAccessories && dicebearOptions.hairAccessories.length > 0) {
      apiUrl += `&hairAccessories=${encodeURIComponent(dicebearOptions.hairAccessories.join(','))}`;
    }
    
    // SVG를 img 태그로 반환 (object-fit: contain으로 비율 유지)
    const imgHtml = `<img src="${apiUrl}" alt="Avatar" style="width: 100%; height: 100%; display: block; object-fit: contain;" crossorigin="anonymous" />`;
    return imgHtml;
  } catch (error) {
    console.error('Error creating Dicebear avatar:', error);
    return '<div style="padding: 20px; text-align: center; color: red;">아바타 생성 오류</div>';
  }
}

// PNG 형식으로 아바타 생성 (이미지 저장용)
function createDicebearAvatarPNG(options = {}) {
  const style = options.style || 'lorelei';
  const seed = options.seed || Date.now().toString();
  const dicebearOptions = options.dicebearOptions || {};
  
  try {
    // API URL 생성 (PNG 형식) - 고해상도로 요청
    let apiUrl = `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}`;
    
    // size 파라미터 추가 (픽셀 단위, 고해상도)
    const size = dicebearOptions.size || 1024; // 기본값을 1024로 증가
    apiUrl += `&size=${size}`;
    
    // scale 옵션 추가 (기본값: 100)
    const scale = dicebearOptions.scale || 100;
    apiUrl += `&scale=${scale}`;
    
    // 옵션 추가
    if (dicebearOptions.hair && dicebearOptions.hair.length > 0) {
      apiUrl += `&hair=${encodeURIComponent(dicebearOptions.hair.join(','))}`;
    }
    if (dicebearOptions.eyes && dicebearOptions.eyes.length > 0) {
      apiUrl += `&eyes=${encodeURIComponent(dicebearOptions.eyes.join(','))}`;
    }
    if (dicebearOptions.eyebrows && dicebearOptions.eyebrows.length > 0) {
      apiUrl += `&eyebrows=${encodeURIComponent(dicebearOptions.eyebrows.join(','))}`;
    }
    if (dicebearOptions.mouth && dicebearOptions.mouth.length > 0) {
      apiUrl += `&mouth=${encodeURIComponent(dicebearOptions.mouth.join(','))}`;
    }
    if (dicebearOptions.nose && dicebearOptions.nose.length > 0) {
      apiUrl += `&nose=${encodeURIComponent(dicebearOptions.nose.join(','))}`;
    }
    if (dicebearOptions.glasses && dicebearOptions.glasses.length > 0) {
      apiUrl += `&glassesProbability=100&glasses=${encodeURIComponent(dicebearOptions.glasses.join(','))}`;
    } else {
      // 안경이 없을 때는 명시적으로 probability를 0으로 설정
      apiUrl += `&glassesProbability=0`;
    }
    if (dicebearOptions.earrings && dicebearOptions.earrings.length > 0) {
      apiUrl += `&earrings=${encodeURIComponent(dicebearOptions.earrings.join(','))}`;
    }
    if (dicebearOptions.freckles && dicebearOptions.freckles.length > 0) {
      apiUrl += `&freckles=${encodeURIComponent(dicebearOptions.freckles.join(','))}`;
    }
    if (dicebearOptions.hairAccessories && dicebearOptions.hairAccessories.length > 0) {
      apiUrl += `&hairAccessories=${encodeURIComponent(dicebearOptions.hairAccessories.join(','))}`;
    }
    
    // PNG를 img 태그로 반환
    const imgHtml = `<img src="${apiUrl}" alt="Avatar" style="width: 100%; height: 100%; display: block; object-fit: contain;" crossorigin="anonymous" />`;
    return imgHtml;
  } catch (error) {
    console.error('Error creating Dicebear avatar PNG:', error);
    return '<div style="padding: 20px; text-align: center; color: red;">아바타 생성 오류</div>';
  }
}

// 색상 팔레트 (배경색은 파스텔톤으로 변경)
const AVATAR_COLORS = {
  skin: [
    '#FFD6E8', // 파스텔 핑크
    '#FFDAB9', // 파스텔 피치
    '#FFE4B5', // 파스텔 옐로우
    '#E6F3FF', // 파스텔 블루
    '#E0F2F7', // 파스텔 스카이
    '#D4F1F4', // 파스텔 민트
    '#E8F5E9', // 파스텔 그린
    '#F3E5F5', // 파스텔 라벤더
    '#FCE4EC', // 파스텔 로즈
    '#FFF9C4', // 파스텔 레몬
    '#F0F4C3', // 파스텔 라임
    '#FFECB3', // 파스텔 앰버
    '#FFE0B2', // 파스텔 오렌지
    '#FFCCBC', // 파스텔 코랄
    '#D7CCC8', // 파스텔 베이지
    '#F5F5F5', // 파스텔 화이트
    '#E1BEE7', // 파스텔 퍼플
    '#C5CAE9'  // 파스텔 인디고
  ],
  hair: ['#090806', '#2C1B18', '#4E3329', '#6F4C3E', '#8B5A3C', '#A0634F', '#B89778', '#D4B896', '#E8D4BA', '#F5E8D6'],
  eyes: ['#1C1C1C', '#3E2723', '#5D4037', '#6D4C41', '#795548', '#1976D2', '#2196F3', '#4FC3F7', '#4CAF50', '#8BC34A', '#9C27B0', '#AB47BC', '#78909C', '#90A4AE'],
  eyebrows: ['#090806', '#2C1B18', '#4E3329', '#6F4C3E', '#8B5A3C', '#A0634F'],
  mouth: ['#C45B5D', '#D36769', '#E07B7D', '#E88B8D', '#F4A7A9', '#F5B9BB', '#8B5A5C', '#A5696B'],
  nose: ['#D4A791', '#C89A7F', '#BC8D6D', '#B0805B', '#A47349'],
  top: ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'],
  glasses: ['#000000', '#333333', '#666666', '#8B4513', '#D2691E', '#CD853F', '#DEB887', '#1976D2', '#E91E63', '#9C27B0']
};

// 전역 변수로 노출
window.HAIR_LABELS = HAIR_LABELS;
window.LORELEI_OPTIONS = LORELEI_OPTIONS;
window.AVATAR_COLORS = AVATAR_COLORS;
window.createDicebearAvatar = createDicebearAvatar;
window.createDicebearAvatarPNG = createDicebearAvatarPNG;
