// 工具函数模块
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// SVG图标常量
const ICONS = {
    sun: `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`,
    moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`,
    menu: `<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>`,
    close: `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`
};

// 主题切换模块
function initThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    if (!themeToggles.length) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    function updateAllThemeIcons(theme) {
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('svg');
            if (!icon) return;
            icon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
        });
    }

    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateAllThemeIcons(currentTheme);

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateAllThemeIcons(newTheme);
        });
    });
}

// 悬浮菜单功能
function initFloatingMenu() {
    const floatingMenu = document.querySelector('.floating-menu');
    const floatingMenuToggle = document.querySelector('.floating-menu-toggle');
    const menuItems = floatingMenu?.querySelectorAll('.floating-menu-item');
    
    if (!floatingMenu || !floatingMenuToggle) {
        console.log('Floating menu elements not found');
        return;
    }
    
    console.log('Floating menu initialized');
    
    let isAnimating = false;
    
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function openMenu() {
        console.log('Opening menu');
        if (isAnimating) return;
        isAnimating = true;
        
        floatingMenu.classList.add('active');
        floatingMenuToggle.setAttribute('aria-expanded', 'true');
        
        if (menuItems) {
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.05}s`;
            });
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }
    
    function closeMenu() {
        console.log('Closing menu');
        if (isAnimating) return;
        isAnimating = true;
        
        floatingMenu.classList.remove('active');
        floatingMenuToggle.setAttribute('aria-expanded', 'false');
        
        if (menuItems) {
            menuItems.forEach(item => {
                item.style.transitionDelay = '0s';
            });
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }
    
    function toggleMenu() {
        console.log('Toggling menu');
        if (floatingMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    floatingMenuToggle.addEventListener('click', (e) => {
        console.log('Toggle button clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    document.addEventListener('click', (e) => {
        if (!floatingMenu.contains(e.target) && floatingMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && floatingMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// 键盘快捷键模块
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'k':
                    e.preventDefault();
                    const searchInput = document.querySelector('.search-input, input[type="search"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;
            }
        }
    });
}

// 性能监控模块
function initPerformanceMonitor() {
    console.log('Performance monitor initialized');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }, 0);
    });
}

// 主初始化函数
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    
    initThemeToggle();
    initFloatingMenu();
    initKeyboardShortcuts();
    initPerformanceMonitor();
    
    console.log('Initialization complete');
});
