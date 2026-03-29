const fs = require('fs');
const path = require('path');

// 要合并的JS文件列表
const jsFiles = [
    'static/js/modules/utils.js',
    'static/js/modules/theme.js',
    'static/js/modules/ui.js',
    'static/js/modules/keyboard.js',
    'static/js/modules/performance.js',
    'static/js/main.js'
];

let combinedJS = '';

// 读取并合并所有JS文件
jsFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        combinedJS += content + '\n';
    } catch (error) {
        console.warn(`Error reading ${file}:`, error.message);
    }
});

// 简单压缩
combinedJS = combinedJS
    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
    .replace(/\s+/g, ' ') // 合并空白
    .replace(/;\s*}/g, '}') // 移除分号前的空格
    .replace(/{\s+/g, '{') // 移除大括号后的空格
    .replace(/}\s+/g, '}') // 移除大括号前的空格
    .trim();

// 写入合并后的文件
fs.writeFileSync('static/js/bundle.js', combinedJS);
console.log('JS bundled successfully!');
