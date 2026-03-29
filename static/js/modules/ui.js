// UI 交互模块
import { ICONS, throttle } from './utils.js';

// 平滑滚动功能 - 移动端禁用
export function initSmoothScroll() {
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
export function initPostCardHover() {
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
export function initNavbarScroll() {
    // 不再动态修改 header 样式，保持 CSS 中定义的固定样式
    return;
}

// 图片懒加载和响应式处理
export function initLazyLoad() {
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
export function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // 更新汉堡菜单图标
        const icon = mobileMenuToggle.querySelector('svg');
        if (mobileMenu.classList.contains('active')) {
            icon.innerHTML = ICONS.close;
        } else {
            icon.innerHTML = ICONS.menu;
        }
    });

    // 点击菜单外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('svg');
            icon.innerHTML = ICONS.menu;
        }
    });

    // 点击菜单链接后关闭菜单
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('svg');
            icon.innerHTML = ICONS.menu;
        });
    });
}

// 悬浮菜单功能
export function initFloatingMenu() {
    const floatingMenu = document.querySelector('.floating-menu');
    const floatingMenuToggle = document.querySelector('.floating-menu-toggle');
    const menuItems = floatingMenu?.querySelectorAll('.floating-menu-item');
    
    if (!floatingMenu || !floatingMenuToggle) {
        console.log('Floating menu elements not found');
        return;
    }
    
    console.log('Floating menu initialized');
    
    let isAnimating = false;
    
    // 检测是否是移动端
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // 打开菜单
    function openMenu() {
        if (isAnimating || floatingMenu.classList.contains('active')) return;
        isAnimating = true;
        
        console.log('Opening menu');
        floatingMenu.classList.add('active');
        floatingMenuToggle.setAttribute('aria-expanded', 'true');
        floatingMenuToggle.setAttribute('aria-label', '收起菜单');
        
        // 根据设备类型调整动画锁时间
        const animationDuration = isMobile() ? 320 : 400;
        setTimeout(() => {
            isAnimating = false;
            if (menuItems && menuItems.length > 0) {
                menuItems[0].focus();
            }
        }, animationDuration);
    }
    
    // 关闭菜单
    function closeMenu() {
        if (isAnimating || !floatingMenu.classList.contains('active')) return;
        isAnimating = true;
        
        console.log('Closing menu');
        floatingMenu.classList.remove('active');
        floatingMenuToggle.setAttribute('aria-expanded', 'false');
        floatingMenuToggle.setAttribute('aria-label', '展开菜单');
        
        // 根据设备类型调整动画锁时间
        const animationDuration = isMobile() ? 320 : 400;
        setTimeout(() => {
            isAnimating = false;
            floatingMenuToggle.focus();
        }, animationDuration);
    }
    
    // 切换菜单状态
    function toggleMenu() {
        console.log('Toggling menu');
        if (floatingMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // 点击切换按钮
    floatingMenuToggle.addEventListener('click', (e) => {
        console.log('Toggle button clicked');
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // 点击菜单外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!floatingMenu.contains(e.target) && floatingMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // 点击菜单项后关闭菜单
    floatingMenu.addEventListener('click', (e) => {
        if (e.target.closest('.floating-menu-item')) {
            closeMenu();
        }
    });
    
    // 键盘导航
    floatingMenuToggle.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowUp':
            case 'ArrowDown':
                e.preventDefault();
                if (!floatingMenu.classList.contains('active')) {
                    openMenu();
                }
                break;
            case 'Escape':
                if (floatingMenu.classList.contains('active')) {
                    e.preventDefault();
                    closeMenu();
                }
                break;
        }
    });
    
    // 菜单项键盘导航
    if (menuItems && menuItems.length > 0) {
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                const currentIndex = index;
                const nextIndex = (index + 1) % menuItems.length;
                const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        menuItems[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        menuItems[prevIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        menuItems[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        menuItems[menuItems.length - 1].focus();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        closeMenu();
                        break;
                    case 'Tab':
                        if (e.shiftKey) {
                            if (currentIndex === 0) {
                                e.preventDefault();
                                closeMenu();
                            }
                        } else {
                            if (currentIndex === menuItems.length - 1) {
                                e.preventDefault();
                                closeMenu();
                            }
                        }
                        break;
                }
            });
        });
    }
}

// 滚动到顶部按钮
export function initScrollToTop() {
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

// 网格背景视差效果
export function initGridParallax() {
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

// 骨架屏加载
export function initSkeletonLoading() {
    // 显示骨架屏
    function showSkeleton() {
        const skeletons = document.querySelectorAll('.skeleton-container');
        skeletons.forEach(skeleton => {
            skeleton.style.display = 'block';
        });
    }
    
    // 隐藏骨架屏
    function hideSkeleton() {
        const skeletons = document.querySelectorAll('.skeleton-container');
        skeletons.forEach(skeleton => {
            skeleton.classList.add('skeleton-fade-out');
            setTimeout(() => {
                skeleton.style.display = 'none';
            }, 500);
        });
        
        // 显示真实内容
        const contents = document.querySelectorAll('.content-container');
        contents.forEach(content => {
            content.classList.add('content-fade-in');
        });
    }
    
    // 页面加载完成后隐藏骨架屏
    window.addEventListener('load', () => {
        setTimeout(hideSkeleton, 300); // 延迟300ms，让内容完全加载
    });
    
    // 如果页面已经加载完成，立即隐藏骨架屏
    if (document.readyState === 'complete') {
        hideSkeleton();
    }
}

// 画廊瀑布流布局
export function initGalleryMasonry() {
    const gallery = document.querySelector('.gallery-masonry');
    if (!gallery) return;
    
    const items = gallery.querySelectorAll('.gallery-item');
    if (items.length === 0) return;
    
    let columnCount = 4;
    let isLayouting = false;
    let pendingLayout = false;
    
    // 根据屏幕宽度计算列数
    function getColumnCount() {
        const width = window.innerWidth;
        if (width > 1400) return 5;
        if (width > 1100) return 4;
        if (width > 768) return 3;
        if (width > 480) return 2;
        return 2;
    }
    
    // 获取图片实际高度（考虑懒加载）
    function getItemHeight(item) {
        const img = item.querySelector('.gallery-image');
        if (!img) return 200;
        
        // 如果图片已加载，返回实际高度
        if (img.complete && img.naturalHeight > 0) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const width = item.offsetWidth || (gallery.offsetWidth - 16 * (columnCount - 1)) / columnCount;
            return width * aspectRatio;
        }
        
        // 未加载时，返回预估高度
        return 200;
    }
    
    // 执行瀑布流布局
    function layoutMasonry() {
        if (isLayouting) {
            pendingLayout = true;
            return;
        }
        
        isLayouting = true;
        
        const newColumnCount = getColumnCount();
        const containerWidth = gallery.offsetWidth;
        
        // 计算边距和间距
        let sidePadding, gap;
        if (window.innerWidth > 1400) {
            sidePadding = 120; // 超宽屏大边距
            gap = 24;
        } else if (window.innerWidth > 1100) {
            sidePadding = 100; // 桌面边距
            gap = 20;
        } else if (window.innerWidth > 768) {
            sidePadding = 60; // 平板边距
            gap = 16;
        } else if (window.innerWidth > 480) {
            sidePadding = 32; // 大屏手机边距
            gap = 12;
        } else {
            sidePadding = 16; // 小屏手机边距
            gap = 8;
        }
        
        // 可用宽度 = 总宽度 - 左右边距
        const usableWidth = containerWidth - sidePadding * 2;
        const columnWidth = (usableWidth - gap * (newColumnCount - 1)) / newColumnCount;
        
        // 如果列数变化，需要重新布局
        const needsFullRelayout = newColumnCount !== columnCount;
        columnCount = newColumnCount;
        
        // 创建列数组，存储每列当前高度
        const columnHeights = new Array(columnCount).fill(0);
        
        // 设置容器样式
        gallery.style.position = 'relative';
        
        // 遍历所有图片项
        items.forEach((item, index) => {
            // 找到最短的列
            const minHeight = Math.min(...columnHeights);
            const columnIndex = columnHeights.indexOf(minHeight);
            
            // 设置图片项位置 - 加上左边距
            item.style.position = 'absolute';
            item.style.width = `${columnWidth}px`;
            item.style.left = `${sidePadding + columnIndex * (columnWidth + gap)}px`;
            item.style.top = `${minHeight}px`;
            
            // 获取图片高度并更新列高度
            const height = getItemHeight(item);
            columnHeights[columnIndex] += height + gap;
        });
        
        // 设置容器高度
        const maxHeight = Math.max(...columnHeights);
        gallery.style.height = `${maxHeight}px`;
        
        isLayouting = false;
        
        // 如果有待处理的布局请求
        if (pendingLayout) {
            pendingLayout = false;
            requestAnimationFrame(layoutMasonry);
        }
    }
    
    // 图片加载处理
    function handleImageLoad(img, item) {
        img.classList.add('loaded');
        item.classList.add('loaded');
        
        // 图片加载后重新布局
        requestAnimationFrame(() => {
            layoutMasonry();
        });
    }
    
    // 图片加载错误处理
    function handleImageError(img, item) {
        img.classList.add('error');
        item.classList.add('loaded');
    }
    
    // 初始化图片加载状态
    function initImageLoading() {
        items.forEach(item => {
            const img = item.querySelector('.gallery-image');
            if (!img) return;
            
            if (img.complete) {
                if (img.naturalHeight > 0) {
                    handleImageLoad(img, item);
                } else {
                    handleImageError(img, item);
                }
            } else {
                img.addEventListener('load', () => handleImageLoad(img, item), { once: true });
                img.addEventListener('error', () => handleImageError(img, item), { once: true });
            }
        });
    }
    
    // 使用 IntersectionObserver 优化懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });
        
        items.forEach(item => {
            const img = item.querySelector('.gallery-image');
            if (img && !img.complete) {
                imageObserver.observe(img);
            }
        });
    }
    
    // 初始布局
    layoutMasonry();
    initImageLoading();
    
    // 窗口大小改变时重新布局（使用防抖）
    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            layoutMasonry();
        }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // 页面完全加载后再次布局
    window.addEventListener('load', () => {
        setTimeout(layoutMasonry, 100);
    });
}
