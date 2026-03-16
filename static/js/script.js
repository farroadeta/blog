// PaperMod 主题脚本

// ==================== 工具函数 ====================

// 防抖函数
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

// 节流函数
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

// ==================== 主题切换功能 ====================
function initThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    if (!themeToggles.length) return;

    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // 更新所有主题图标
    function updateAllThemeIcons(theme) {
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('svg');
            if (!icon) return;
            
            if (theme === 'dark') {
                // 更换为太阳图标
                icon.innerHTML = `
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                `;
            } else {
                // 更换为月亮图标
                icon.innerHTML = `
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                `;
            }
        });
    }

    // 给所有主题切换按钮添加点击事件
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // 更新所有主题切换图标
            updateAllThemeIcons(newTheme);
        });
    });

    // 初始化图标
    const currentTheme = document.documentElement.getAttribute('data-theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    updateAllThemeIcons(currentTheme);
}

// 平滑滚动功能 - 移动端禁用
function initSmoothScroll() {
    if (window.innerWidth <= 768) return; // 移动端禁用
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 文章卡片悬停效果
function initPostCardHover() {
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 导航栏滚动效果 - 已禁用，保持固定样式
function initNavbarScroll() {
    // 不再动态修改 header 样式，保持 CSS 中定义的固定样式
    return;
}

// 图片懒加载和响应式处理
function initLazyLoad() {
    const images = document.querySelectorAll('article img, .post-content img, .post-single-content img, .icity-card-images img, .archive-card-images img, .hero-image img, .character-avatar img, .character-profile-avatar img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 添加加载开始类
                    img.classList.add('loading');
                    
                    // 图片加载完成处理
                    const handleLoad = () => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                        img.classList.add('lazy-loaded');
                    };
                    
                    // 图片加载错误处理
                    const handleError = () => {
                        img.classList.remove('loading');
                        img.classList.add('error');
                        console.warn('图片加载失败:', img.src);
                    };
                    
                    // 检查图片是否已经加载
                    if (img.complete) {
                        handleLoad();
                    } else {
                        img.addEventListener('load', handleLoad, { once: true });
                        img.addEventListener('error', handleError, { once: true });
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '150px 0px', // 提前150px开始加载，提升用户体验
            threshold: 0.01
        });

        images.forEach(img => {
            // 为所有图片添加懒加载类
            img.classList.add('lazy-image');
            // 确保图片有正确的属性
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            // 添加解码属性以优化性能
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            imageObserver.observe(img);
        });
    } else {
        // 降级方案
        images.forEach(img => {
            img.classList.add('loaded');
            img.classList.add('lazy-loaded');
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }
}

// 移动端菜单功能
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // 更新汉堡菜单图标
        const icon = mobileMenuToggle.querySelector('svg');
        if (mobileMenu.classList.contains('active')) {
            // 更换为关闭图标
            icon.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            `;
        } else {
            // 更换为菜单图标
            icon.innerHTML = `
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            `;
        }
    });

    // 点击菜单外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('svg');
            icon.innerHTML = `
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            `;
        }
    });

    // 点击菜单链接后关闭菜单
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('svg');
            icon.innerHTML = `
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            `;
        });
    });
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initSmoothScroll();
    initPostCardHover();
    initNavbarScroll();
    initLazyLoad();
    initMobileMenu();

    // 页面加载动画 - 移动端禁用
    if (window.innerWidth > 768) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
});

// 窗口 resize 事件处理 - 使用防抖
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // 响应式调整
        const headerNav = document.querySelector('.header-nav');
        if (headerNav) {
            if (window.innerWidth <= 768) {
                headerNav.classList.add('mobile');
            } else {
                headerNav.classList.remove('mobile');
            }
        }
    }, 250);
});

// 滚动到顶部按钮
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('back-to-top');
    if (!scrollToTopBtn) return;

    // 滚动显示/隐藏 - 使用节流优化
    const handleScroll = throttle(() => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 点击滚动到顶部
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 初始化滚动到顶部按钮
document.addEventListener('DOMContentLoaded', initScrollToTop);

// 网格背景视差效果
function initGridParallax() {
    const body = document.body;
    let lastScrollY = 0;
    
    // 使用节流优化滚动性能
    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;
        
        // 添加滚动类以触发CSS动画
        if (scrollY > 50) {
            body.classList.add('scrolling');
        } else {
            body.classList.remove('scrolling');
        }
        
        // 根据滚动方向调整视差效果
        if (window.innerWidth > 768) {
            const gridOffset = Math.min(scrollY * 0.05, 10);
            const glowOffset = Math.min(scrollY * 0.08, 15);
            
            body.style.setProperty('--grid-offset', `${gridOffset}px`);
            body.style.setProperty('--glow-offset', `${glowOffset}px`);
        }
        
        lastScrollY = scrollY;
    }, 16); // 约60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// 初始化网格视差
document.addEventListener('DOMContentLoaded', initGridParallax);

// ==================== 键盘导航支持 ====================

function initKeyboardNavigation() {
    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        // ESC 键关闭移动端菜单
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = document.querySelector('.mobile-menu-toggle svg');
                if (icon) {
                    icon.innerHTML = `
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    `;
                }
            }
        }
        
        // 快捷键导航
        if (e.altKey || e.ctrlKey || e.metaKey) {
            return; // 忽略组合键
        }
        
        // 按 ? 键显示快捷键帮助
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            showKeyboardHelp();
        }
        
        // 按 t 键切换主题
        if (e.key === 't' || e.key === 'T') {
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }
        
        // 按 s 键聚焦搜索框
        if (e.key === 's' || e.key === 'S') {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
        
        // 按 Home 键回到顶部
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // 按 End 键滚动到底部
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
}

// 显示键盘快捷键帮助
function showKeyboardHelp() {
    // 检查是否已经存在帮助面板
    let helpPanel = document.getElementById('keyboard-help');
    if (helpPanel) {
        helpPanel.remove();
        return;
    }
    
    // 创建帮助面板
    helpPanel = document.createElement('div');
    helpPanel.id = 'keyboard-help';
    helpPanel.innerHTML = `
        <div class="keyboard-help-content">
            <h3>键盘快捷键</h3>
            <ul>
                <li><kbd>T</kbd> 切换主题</li>
                <li><kbd>S</kbd> 聚焦搜索框</li>
                <li><kbd>Home</kbd> 回到顶部</li>
                <li><kbd>End</kbd> 滚动到底部</li>
                <li><kbd>Esc</kbd> 关闭菜单</li>
                <li><kbd>?</kbd> 显示/隐藏此帮助</li>
            </ul>
            <p class="keyboard-help-close">按 <kbd>Esc</kbd> 或点击外部关闭</p>
        </div>
    `;
    
    // 添加样式
    helpPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        width: 90%;
    `;
    
    document.body.appendChild(helpPanel);
    
    // 点击外部关闭
    helpPanel.addEventListener('click', (e) => {
        if (e.target === helpPanel) {
            helpPanel.remove();
        }
    });
    
    // ESC 键关闭
    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            helpPanel.remove();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

// 初始化键盘导航
document.addEventListener('DOMContentLoaded', initKeyboardNavigation);

// ==================== 性能监控 ====================

function initPerformanceMonitoring() {
    // 只在生产环境启用
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
    }
    
    // 页面加载性能
    if ('PerformanceObserver' in window) {
        // 监控长任务
        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('长任务检测:', {
                        name: entry.name,
                        duration: `${entry.duration.toFixed(2)}ms`,
                        startTime: `${entry.startTime.toFixed(2)}ms`
                    });
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // 浏览器不支持
        }
        
        // 监控布局偏移
        try {
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.hadRecentInput) continue;
                    
                    console.log('布局偏移:', {
                        value: entry.value.toFixed(4),
                        sources: entry.sources.map(s => s.node?.nodeName || 'unknown')
                    });
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // 浏览器不支持
        }
        
        // 监控首次输入延迟
        try {
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log('首次输入延迟:', {
                        duration: `${entry.duration.toFixed(2)}ms`,
                        name: entry.name
                    });
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // 浏览器不支持
        }
    }
    
    // 页面加载完成后报告性能指标
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('页面性能指标:', {
                    'DNS查询': `${(perfData.domainLookupEnd - perfData.domainLookupStart).toFixed(2)}ms`,
                    'TCP连接': `${(perfData.connectEnd - perfData.connectStart).toFixed(2)}ms`,
                    'DOM解析': `${(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(2)}ms`,
                    '页面加载': `${(perfData.loadEventEnd - perfData.loadEventStart).toFixed(2)}ms`,
                    '总耗时': `${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`
                });
            }
            
            // Web Vitals
            if ('PerformanceObserver' in window) {
                // LCP (Largest Contentful Paint)
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('LCP (最大内容绘制):', `${lastEntry.startTime.toFixed(2)}ms`);
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    // 浏览器不支持
                }
            }
        }, 1000);
    });
    
    // 资源加载错误监控
    window.addEventListener('error', (event) => {
        if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
            console.error('资源加载失败:', {
                tag: event.target.tagName,
                src: event.target.src || event.target.href,
                message: event.message
            });
        }
    }, true);
    
    // JavaScript错误监控
    window.addEventListener('error', (event) => {
        if (!event.target) {
            console.error('JavaScript错误:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        }
    });
    
    // Promise未捕获错误
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promise未捕获错误:', {
            reason: event.reason
        });
    });
}

// 初始化性能监控
document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
