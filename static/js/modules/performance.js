// 性能监控模块

// 监控所有资源加载状态
function monitorResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    let pendingCount = 0;

    resources.forEach(resource => {
        if (resource.responseEnd === 0) {
            pendingCount++;
        }
    });

    return pendingCount;
}

// 强制停止加载指示器
function forceStopLoadingIndicator() {
    // 方法1：触发load事件（如果尚未触发）
    if (document.readyState !== 'complete') {
        window.dispatchEvent(new Event('load'));
    }

    // 方法2：标记页面状态
    document.body.classList.add('force-loaded');
    document.documentElement.classList.add('force-loaded');

    // 方法3：停止所有视频/音频加载
    document.querySelectorAll('video, audio').forEach(media => {
        if (media.readyState < 2) { // HAVE_CURRENT_DATA
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
    // 页面加载后检查是否有未完成资源，超时则强制停止
    window.addEventListener('load', () => {
        setTimeout(() => {
            const pendingCount = monitorResourceLoading();
            if (pendingCount > 0) {
                setTimeout(() => {
                    const stillPending = monitorResourceLoading();
                    if (stillPending > 0) {
                        forceStopLoadingIndicator();
                    }
                }, 5000);
            }
        }, 0);
    });

    // 静默注册性能观察器
    if ('PerformanceObserver' in window) {
        try { new PerformanceObserver(() => {}).observe({ entryTypes: ['longtask'] }); } catch (e) {}
    }

    // 资源加载错误标记
    window.addEventListener('error', (e) => {
        if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
            e.target.classList.add('resource-load-failed');
        }
    }, true);

    // Fetch 错误静默处理
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args)
            .then(response => response)
            .catch(error => {
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
