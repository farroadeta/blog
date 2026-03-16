# 组件文档

## 目录

1. [头部组件](#头部组件)
2. [卡片组件](#卡片组件)
3. [按钮组件](#按钮组件)
4. [表单组件](#表单组件)
5. [导航组件](#导航组件)

---

## 头部组件

### 基础头部

网站顶部导航栏，包含logo、导航链接和主题切换按钮。

#### HTML结构

```html
<header class="header" role="banner">
    <div class="header-container">
        <div class="header-left">
            <a href="/character" class="header-icon" aria-label="查看人物列表">
                <svg><!-- SVG图标 --></svg>
            </a>
        </div>
        <div class="header-center">
            <a href="/" class="header-logo-link" aria-label="返回首页">
                <span class="header-logo-text">Qjournal</span>
            </a>
        </div>
        <div class="header-right-new">
            <button class="theme-toggle header-icon" aria-label="切换主题">
                <svg><!-- SVG图标 --></svg>
            </button>
        </div>
    </div>
</header>
```

#### CSS类

- `.header` - 头部容器
- `.header-container` - 内容容器
- `.header-left` - 左侧区域
- `.header-center` - 中间区域
- `.header-right-new` - 右侧区域
- `.header-icon` - 图标按钮
- `.header-logo-link` - Logo链接

#### 响应式

- **桌面端**: sticky定位，高度56px
- **移动端**: 固定高度60px，简化布局

---

## 卡片组件

### iCity卡片

瀑布流风格的卡片组件，用于展示文章和内容。

#### HTML结构

```html
<div class="icity-card-list">
    <article class="icity-card" role="article">
        <header class="icity-card-header">
            <a href="/character/xxx" class="icity-card-avatar-link">
                <div class="icity-card-avatar">
                    <img src="avatar.jpg" alt="头像" loading="lazy">
                </div>
            </a>
            <div class="icity-card-user">
                <span class="icity-card-username">用户名</span>
                <time class="icity-card-time">2024-01-01</time>
            </div>
        </header>
        <main class="icity-card-body">
            <h2 class="icity-card-title">
                <a href="/posts/xxx">文章标题</a>
            </h2>
            <p class="icity-card-content">文章内容...</p>
        </main>
        <footer class="icity-card-footer">
            <time class="icity-card-date">2024-01-01</time>
            <span class="icity-card-path">分类</span>
        </footer>
    </article>
</div>
```

#### CSS类

- `.icity-card-list` - 卡片列表容器（瀑布流）
- `.icity-card` - 卡片容器
- `.icity-card-header` - 卡片头部
- `.icity-card-avatar` - 头像容器
- `.icity-card-body` - 卡片主体
- `.icity-card-title` - 卡片标题
- `.icity-card-content` - 卡片内容
- `.icity-card-footer` - 卡片底部

#### 特性

- 瀑布流布局（column-count: 2）
- 悬停动画效果
- 支持封面图片
- 响应式适配

### 归档卡片

线性列表风格的卡片组件，用于归档页面。

#### HTML结构

```html
<div class="archive-card-list">
    <article class="archive-card">
        <header class="archive-card-header">
            <div class="archive-card-avatar">
                <img src="avatar.jpg" alt="头像" loading="lazy">
            </div>
            <div class="archive-card-user">
                <span class="archive-card-username">用户名</span>
                <time class="archive-card-time">2024-01-01</time>
            </div>
        </header>
        <main class="archive-card-body">
            <h2 class="archive-card-title">
                <a href="/posts/xxx">文章标题</a>
            </h2>
            <p class="archive-card-content">文章内容...</p>
        </main>
    </article>
</div>
```

---

## 按钮组件

### 主题切换按钮

用于切换亮色/暗色主题的按钮。

#### HTML结构

```html
<button class="theme-toggle header-icon" aria-label="切换主题" title="切换亮色/暗色主题">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
</button>
```

#### JavaScript API

```javascript
// 切换主题
document.querySelector('.theme-toggle').click();

// 获取当前主题
const currentTheme = document.documentElement.getAttribute('data-theme');

// 设置主题
document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');
```

### 回到顶部按钮

滚动到页面顶部的按钮。

#### HTML结构

```html
<button id="back-to-top" class="back-to-top" aria-label="回到顶部" title="回到页面顶部">
    <svg><!-- SVG图标 --></svg>
</button>
```

#### CSS类

- `.back-to-top` - 按钮容器
- `.back-to-top.visible` - 可见状态（滚动超过300px时显示）

---

## 表单组件

### 搜索框

搜索页面使用的搜索输入框。

#### HTML结构

```html
<div class="search-box-wrapper">
    <div class="search-box">
        <svg class="search-icon"><!-- 搜索图标 --></svg>
        <input type="text" id="search-input" placeholder="搜索文章..." aria-label="搜索文章">
        <div class="search-actions">
            <button class="search-action-btn search-clear-btn" aria-label="清除搜索">
                <svg><!-- 清除图标 --></svg>
            </button>
        </div>
    </div>
</div>
```

#### CSS类

- `.search-box-wrapper` - 搜索框容器
- `.search-box` - 搜索框主体
- `.search-icon` - 搜索图标
- `#search-input` - 搜索输入框
- `.search-actions` - 操作按钮区域

---

## 导航组件

### 文章导航

文章页面底部的上一篇/下一篇导航。

#### HTML结构

```html
<nav class="post-nav" aria-label="文章导航">
    <div class="post-nav-prev">
        <a href="/posts/prev">
            <div class="post-nav-icon">
                <svg><!-- 左箭头图标 --></svg>
            </div>
            <div class="post-nav-text">
                <span class="post-nav-label">上一篇</span>
                <span class="post-nav-title">上一篇文章标题</span>
            </div>
        </a>
    </div>
    <div class="post-nav-next">
        <a href="/posts/next">
            <div class="post-nav-text">
                <span class="post-nav-label">下一篇</span>
                <span class="post-nav-title">下一篇文章标题</span>
            </div>
            <div class="post-nav-icon">
                <svg><!-- 右箭头图标 --></svg>
            </div>
        </a>
    </div>
</nav>
```

### 面包屑导航

归档页面使用的面包屑导航。

#### HTML结构

```html
<nav class="archive-breadcrumb" aria-label="面包屑导航">
    <div class="archive-breadcrumb-path-container">
        <a href="/posts" class="archive-breadcrumb-link">归档</a>
        <span class="archive-breadcrumb-separator">/</span>
        <span class="archive-breadcrumb-current">当前文件夹</span>
    </div>
</nav>
```

---

## 使用指南

### 引入CSS文件

```html
<!-- 按照以下顺序引入CSS文件 -->
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/themes.css">
<link rel="stylesheet" href="css/pages.css">
<link rel="stylesheet" href="css/animations.css">
```

### 使用CSS变量

```css
.my-component {
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    transition: var(--transition-normal);
}
```

### 暗色模式支持

```css
/* 自动支持暗色模式 */
.my-component {
    background-color: var(--color-surface);
}

/* 在themes.css中已经定义了暗色模式下的变量覆盖 */
```

### 响应式设计

```css
/* 移动优先 */
.my-component {
    width: 100%;
}

/* 平板及以上 */
@media (min-width: 769px) {
    .my-component {
        width: 50%;
    }
}

/* 桌面端 */
@media (min-width: 1024px) {
    .my-component {
        width: 33.333%;
    }
}
```

---

## 可访问性

所有组件都遵循WCAG 2.1 AA级标准：

- ✅ 提供aria-label属性
- ✅ 支持键盘导航
- ✅ 焦点样式可见
- ✅ 颜色对比度符合标准
- ✅ 支持屏幕阅读器

---

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## 更新日志

### v1.0.0 (2024-01-01)
- ✅ CSS重构完成
- ✅ 添加可访问性支持
- ✅ 优化移动端体验
- ✅ 添加暗色模式
