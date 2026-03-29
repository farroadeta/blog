const fs = require('fs');
const path = require('path');

// 要合并的CSS文件列表
const cssFiles = [
    'static/css/animations.css',
    'static/css/base.css',
    'static/css/components.css',
    'static/css/gallery.css',
    'static/css/image-optimization.css',
    'static/css/pages.css',
    'static/css/papermod.css',
    'static/css/skeleton.css',
    'static/css/style-enhanced.css',
    'static/css/style.css',
    'static/css/themes.css',
    'static/css/variables.css'
];

let combinedCSS = '';

// 读取并合并所有CSS文件
cssFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        combinedCSS += content + '\n';
    } catch (error) {
        console.warn(`Error reading ${file}:`, error.message);
    }
});

// 简单压缩
combinedCSS = combinedCSS
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
    .replace(/\s+/g, ' ') // 合并空白
    .replace(/;\s*}/g, '}') // 移除分号前的空格
    .replace(/{\s+/g, '{') // 移除大括号后的空格
    .replace(/}\s+/g, '}') // 移除大括号前的空格
    .trim();

// 写入合并后的文件
fs.writeFileSync('static/css/bundle.css', combinedCSS);
console.log('CSS bundled successfully!');
