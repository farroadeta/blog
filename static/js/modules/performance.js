// 性能监控模块 - 优化加载指示器停止逻辑

// 监控所有资源加载状态
function monitorResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    const pendingResources = [];
    
    resources.forEach(resource => {
        // 检查资源是否加载完成
        if (resource.responseEnd === 0) {
            pendingResources.push({
                name: resource.name,
                type: resource.initiatorType,
                duration: resource.duration
            });
        }
    });
    
    if (pendingResources.length > 0) {
        console.log('Pending resources:', pendingResources);
    }
    
    return pendingResources.length;
}

// 强制停止加载指示器
function forceStopLoadingIndicator() {
    console.log('Forcing loading indicator to stop');
    
    // 方法1：触发load事件（如果尚未触发）
    if (document.readyState !== 'complete') {
        window.dispatchEvent(new Event('load'));
    }
    
    // 方法2：标记页面状态
    document.body.classList.add('force-loaded');
    document.documentElement.classList.add('force-loaded');
    
    // 方法3：停止所有视频/音频加载
    document.querySelectorAll('video, audio').forEach(media => {
        if (!media.readyState >= 2) { // HAVE_CURRENT_DATA
            media.pause();
            media.removeAttribute('src');
            media.load();
        }
    });
    
    // 方法4：停止所有图片加载
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
    });
}

// 初始化性能监控
export function initPerformanceMonitoring() {
    console.log('Performance monitoring initialized');
    
    // 监控页面加载时间
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
            
            // 检查是否有资源仍在加载
            const pendingCount = monitorResourceLoading();
            if (pendingCount > 0) {
                console.warn(`${pendingCount} resources still pending`);
                
                // 如果页面加载超过5秒还有未完成的资源，强制停止
                setTimeout(() => {
                    const stillPending = monitorResourceLoading();
                    if (stillPending > 0) {
                        console.warn(`Force stopping ${stillPending} pending resources`);
                        forceStopLoadingIndicator();
                    }
                }, 5000);
            }
        }, 0);
    });
    
    // 监控长任务（可能导致加载指示器持续显示）
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) { // 超过50ms的任务
                        console.warn('Long task detected:', entry.duration + 'ms', entry);
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            console.log('Long task monitoring not supported');
        }
    }
    
    // 监控资源加载错误
    window.addEventListener('error', (e) => {
        if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
            console.error('Resource failed to load:', e.target.src || e.target.href);
            
            // 标记资源加载失败，不阻止页面完成
            e.target.classList.add('resource-load-failed');
        }
    }, true);
    
    // 监控网络请求（使用Fetch API拦截）
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args)
            .then(response => {
                if (!response.ok) {
                    console.warn('Fetch request failed:', args[0], response.status);
                }
                return response;
            })
            .catch(error => {
                console.error('Fetch request error:', args[0], error);
                throw error;
            });
    };
    
    // 提供手动停止加载指示器的全局函数
    window.stopLoadingIndicator = forceStopLoadingIndicator;
}

// 导出其他性能工具
export function measurePerformance(label, callback) {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(2)}ms`);
    return result;
}

export function debounce(func, wait) {
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

export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
