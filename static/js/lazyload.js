// 自动图片懒加载功能 - 无需手动修改图片标签
(function() {
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyLoad);
    } else {
        initLazyLoad();
    }
    
    function initLazyLoad() {
        // 检查浏览器是否支持 Intersection Observer
        if ('IntersectionObserver' in window) {
            // 配置选项
            const options = {
                root: null, // 使用视口作为根
                rootMargin: '50px 0px', // 提前50px开始加载
                threshold: 0.01 // 当元素1%可见时触发
            };

            // 创建观察者
            const observer = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 元素进入视口，添加加载完成类
                        const img = entry.target;
                        img.classList.add('lazy-loaded');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, options);

            // 观察所有文章内容中的图片
            const imgSelectors = [
                'article img',
                '.post-content img',
                '.post-single-content img',
                '.hitokoto-content img',
                '.hero-image img'
            ];
            
            imgSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(img => {
                    // 为图片添加懒加载类和过渡效果
                    img.classList.add('lazy-image');
                    observer.observe(img);
                });
            });
        } else {
            // 降级方案：使用滚动事件
            const imgSelectors = [
                'article img',
                '.post-content img',
                '.post-single-content img',
                '.hitokoto-content img',
                '.hero-image img'
            ];
            
            let lazyImages = [];
            imgSelectors.forEach(selector => {
                const imgs = [].slice.call(document.querySelectorAll(selector));
                lazyImages = lazyImages.concat(imgs);
            });
            
            if ('requestAnimationFrame' in window) {
                window.addEventListener('scroll', function() {
                    requestAnimationFrame(lazyLoad);
                });
            } else {
                window.addEventListener('scroll', lazyLoad);
            }
            
            function lazyLoad() {
                lazyImages.forEach(img => {
                    if (isElementInViewport(img)) {
                        img.classList.add('lazy-loaded');
                        img.classList.add('loaded');
                        lazyImages = lazyImages.filter(function(image) {
                            return image !== img;
                        });
                    }
                });
                
                if (lazyImages.length === 0) {
                    window.removeEventListener('scroll', lazyLoad);
                }
            }
            
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            }
            
            // 初始检查
            lazyLoad();
        }
    }
})();
