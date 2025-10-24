// 뷰 로더 시스템
// 각 페이지를 동적으로 로드하여 DOM에 추가

const VIEW_LOADER = {
  loadedViews: new Set(),
  viewContainer: null,

  // 초기화
  async init() {
    this.viewContainer = document.getElementById('viewContainer');
    if (!this.viewContainer) {
      console.error('viewContainer not found');
      return;
    }

    // 모든 뷰를 미리 로드
    await this.loadAllViews();
  },

  // 모든 뷰 로드
  async loadAllViews() {
    const views = [
      'main',
      'avatar',
      'search',
      'result',
      'admin',
      'edit-modal'
    ];

    try {
      const loadPromises = views.map(view => this.loadView(view));
      await Promise.all(loadPromises);
      console.log('All views loaded successfully');
    } catch (error) {
      console.error('Error loading views:', error);
    }
  },

  // 개별 뷰 로드
  async loadView(viewName) {
    if (this.loadedViews.has(viewName)) {
      return; // 이미 로드됨
    }

    try {
      const response = await fetch(`views/${viewName}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load view: ${viewName}`);
      }

      const html = await response.text();
      
      // viewContainer에 추가
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // tempDiv의 첫 번째 자식 요소를 추가
      while (tempDiv.firstChild) {
        this.viewContainer.appendChild(tempDiv.firstChild);
      }

      this.loadedViews.add(viewName);
      console.log(`View loaded: ${viewName}`);
    } catch (error) {
      console.error(`Error loading view ${viewName}:`, error);
      throw error;
    }
  }
};

// DOM이 준비되면 뷰 로더 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    VIEW_LOADER.init();
  });
} else {
  VIEW_LOADER.init();
}

