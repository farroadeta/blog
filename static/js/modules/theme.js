// 主题切换模块
import { ICONS } from './utils.js';

export function initThemeToggle() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    if (!themeToggles.length) return;

    // 检查本地存储中的主题偏好，否则跟随系统
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = savedTheme || systemTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);

    // 更新所有主题图标
    function updateAllThemeIcons(theme) {
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('svg');
            if (!icon) return;
            
            if (theme === 'dark') {
                icon.innerHTML = ICONS.sun;
            } else {
                icon.innerHTML = ICONS.moon;
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
    updateAllThemeIcons(activeTheme);
}
