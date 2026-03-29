// 主入口文件 - 整合所有模块（性能优化版本）
import { initThemeToggle } from './modules/theme.js';
import { 
    initSmoothScroll, 
    initPostCardHover, 
    initNavbarScroll, 
    initLazyLoad, 
    initMobileMenu, 
    initFloatingMenu, 
    initScrollToTop, 
    initGridParallax, 
    initSkeletonLoading, 
    initGalleryMasonry 
} from './modules/ui.js';
import { initKeyboardNavigation } from './modules/keyboard.js';
import { initPerformanceMonitoring } from './modules/performance.js';

// 性能优化：使用 requestIdleCallback 延迟非关键任务
function scheduleIdleTask(callback, timeout = 2000) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout });
    } else {
        setTimeout(callback, 100);
    }
}

// 性能优化：使用 requestAnimationFrame 确保流畅渲染
function scheduleVisualTask(callback) {
    requestAnimationFrame(() => {
        requestAnimationFrame(callback);
    });
}

// 统一的 DOMContentLoaded 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // ===== 关键任务：立即执行（阻塞渲染）=====
    
    // 主题相关 - 必须在首屏渲染前完成
    initThemeToggle();
    
    // 懒加载 - 立即初始化以优化图片加载
    initLazyLoad();
    
    // ===== 视觉任务：下一帧执行（确保流畅）=====
    scheduleVisualTask(() => {
        // 浮动菜单 - 用户交互关键
        initFloatingMenu();
        
        // 骨架屏加载
        initSkeletonLoading();
    });
    
    // ===== 空闲任务：延迟执行（非关键）=====
    scheduleIdleTask(() => {
        // UI 交互 - 可以延迟
        initSmoothScroll();
        initPostCardHover();
        initNavbarScroll();
        initMobileMenu();
        initScrollToTop();
        initGridParallax();
        initGalleryMasonry();
        
        // 键盘导航
        initKeyboardNavigation();
        
        // 性能监控
        initPerformanceMonitoring();
        
        console.log('Non-critical tasks initialized');
    });
    
    // 移除页面加载动画（可能导致加载指示器持续显示）
    // 原代码会导致页面闪烁，已移除
    document.body.style.opacity = '1';
    document.body.style.transition = '';
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
}, { passive: true });

// 性能优化：监听页面加载完成事件
window.addEventListener('load', () => {
    console.log('All resources loaded');
    
    // 标记页面加载完成
    document.body.classList.add('page-fully-loaded');
    
    // 停止所有可能的加载指示器
    if (document.readyState === 'complete') {
        console.log('Loading indicator should stop now');
    }
});

// 性能优化：处理资源加载错误
window.addEventListener('error', (e) => {
    console.warn('Resource loading error:', e.target.src || e.target.href);
    // 不阻止加载指示器，但记录错误
}, true);

// 性能优化：处理资源加载超时
setTimeout(() => {
    if (document.readyState !== 'complete') {
        console.warn('Page load timeout - forcing completion');
        document.body.classList.add('page-load-timeout');
    }
}, 10000); // 10秒超时保护
