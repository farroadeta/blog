# CSS 编码规范

## 文件结构

项目采用模块化的CSS文件结构，每个文件职责明确：

```
static/css/
├── variables.css    # CSS变量定义
├── base.css         # 基础样式和重置
├── components.css   # 组件样式
├── themes.css       # 主题样式（暗色模式）
├── pages.css        # 页面特定样式
└── animations.css   # 动画效果
```

## CSS变量命名规范

### 颜色系统

```css
/* 主色调 */
--color-primary: #2c3e50;
--color-secondary: #7f8c8d;
--color-accent: #3498db;

/* 文本颜色 */
--color-text-primary: #1a202c;
--color-text-secondary: #4a5568;
--color-text-muted: #999;

/* 背景颜色 */
--color-background: #f8f9fa;
--color-surface: rgba(255, 255, 255, 0.85);
```

### 间距系统

```css
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;
```

### 字体系统

```css
--font-sans: 'Source Han Sans CN', "Microsoft YaHei", sans-serif;
--font-serif: "SimSun", "Songti SC", serif;
--font-mono: 'SFMono-Regular', Consolas, monospace;
```

## 编码规范

### 1. 选择器命名

- 使用小写字母和连字符
- 避免使用ID选择器（除特殊情况）
- 使用语义化的类名

```css
/* 推荐 */
.post-card { }
.post-card-title { }
.post-card-meta { }

/* 不推荐 */
.PostCard { }
#post-card { }
.card1 { }
```

### 2. 属性顺序

按照以下顺序组织CSS属性：

1. 定位相关（position, top, right, bottom, left, z-index）
2. 盒模型（display, flex, width, height, margin, padding）
3. 边框和背景（border, border-radius, background）
4. 文本相关（font, color, text-align, line-height）
5. 其他（transition, animation, transform）

```css
.post-card {
    /* 定位 */
    position: relative;
    z-index: 1;
    
    /* 盒模型 */
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1.5rem;
    
    /* 边框和背景 */
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background-color: var(--color-surface);
    
    /* 文本 */
    color: var(--color-text-primary);
    line-height: 1.6;
    
    /* 其他 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
```

### 3. 响应式设计

- 移动优先原则
- 使用CSS变量管理断点
- 避免固定宽度

```css
/* 移动优先 */
.post-card {
    width: 100%;
    padding: 1rem;
}

/* 平板及以上 */
@media (min-width: 769px) {
    .post-card {
        width: calc(50% - 1rem);
        padding: 1.5rem;
    }
}

/* 桌面端 */
@media (min-width: 1024px) {
    .post-card {
        width: calc(33.333% - 1rem);
    }
}
```

### 4. 暗色模式

使用CSS变量和选择器组合实现暗色模式：

```css
/* 同时支持系统暗色主题和手动切换 */
@media (prefers-color-scheme: dark),
[data-theme="dark"] {
    :root {
        --color-primary: #e0e0e0;
        --color-background: #121212;
    }
}
```

### 5. 性能优化

- 避免使用`!important`
- 减少嵌套层级（最多3层）
- 使用`will-change`优化动画性能
- 使用CSS变量减少重复代码

```css
/* 推荐 */
.card {
    will-change: transform;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
}

/* 不推荐 */
.card {
    transition: all 0.3s ease !important;
}
```

## 注释规范

### 文件头部注释

```css
/* ==================== 组件样式 ==================== */
```

### 区块注释

```css
/* ==================== 头部组件 ==================== */

/* ==================== 卡片组件 ==================== */
```

### 单行注释

```css
/* 移动端优化 */
```

## 可访问性

### 焦点样式

```css
*:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

*:focus:not(:focus-visible) {
    outline: none;
}

*:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}
```

### Skip Link

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-accent);
    color: white;
    padding: 8px 16px;
    z-index: 1000;
}

.skip-link:focus {
    top: 0;
}
```

## 浏览器兼容性

- 支持现代浏览器（Chrome, Firefox, Safari, Edge）
- 使用Autoprefixer自动添加前缀
- 提供降级方案

```css
/* 现代浏览器 */
.card {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

/* 降级方案 */
@supports not (backdrop-filter: blur(10px)) {
    .card {
        background-color: rgba(255, 255, 255, 0.95);
    }
}
```

## 维护指南

### 添加新组件

1. 确定组件所属文件（components.css 或 pages.css）
2. 使用语义化的类名
3. 遵循命名规范和属性顺序
4. 添加必要的响应式样式
5. 考虑暗色模式支持
6. 添加注释说明

### 修改现有样式

1. 先查找CSS变量，优先使用变量
2. 避免覆盖现有样式，使用更具体的选择器
3. 测试响应式布局
4. 测试暗色模式
5. 更新相关文档

### 删除样式

1. 确认样式未被使用（全局搜索）
2. 检查是否有依赖的JavaScript
3. 测试删除后的影响
4. 更新文档

## 工具推荐

- **CSS验证**: W3C CSS Validator
- **性能分析**: Chrome DevTools Coverage
- **浏览器测试**: BrowserStack
- **代码格式化**: Prettier
- **自动前缀**: Autoprefixer

## 参考资料

- [MDN CSS文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [CSS Tricks](https://css-tricks.com/)
- [Smashing Magazine](https://www.smashingmagazine.com/)
- [Web.dev](https://web.dev/learn/css/)
