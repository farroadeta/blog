// 键盘导航模块
import { ICONS } from './utils.js';

export function initKeyboardNavigation() {
    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        // ESC 键关闭移动端菜单
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = document.querySelector('.mobile-menu-toggle svg');
                if (icon) {
                    icon.innerHTML = ICONS.menu;
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
export function showKeyboardHelp() {
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
