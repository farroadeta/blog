const fs = require('fs');
const path = require('path');

// 按依赖顺序排列的文件列表（被依赖的放前面）
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
        let content = fs.readFileSync(file, 'utf8');

        // 移除 import 语句（支持多行 import）
        content = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]*['"];?\s*/g, '');

        // 将 export function / export const / export let / export var 转为普通声明
        content = content.replace(/^export\s+(function|const|let|var)\s+/gm, '$1 ');

        combinedJS += content + '\n';
    } catch (error) {
        console.warn(`Error reading ${file}:`, error.message);
    }
});

// 简单压缩
combinedJS = combinedJS
    .replace(/\/\*[\s\S]*?\*\//g, '')     // 移除块注释
    .replace(/\/\/[^\n]*/g, '')           // 移除行注释
    .replace(/\s+/g, ' ')                 // 合并空白
    .replace(/;\s*}/g, '}')               // 移除分号前的空格
    .replace(/{\s+/g, '{')                // 移除大括号后的空格
    .replace(/}\s+/g, '}')                // 移除大括号前的空格
    .trim();

// 写入合并后的文件
fs.writeFileSync('static/js/bundle.js', combinedJS);
console.log('JS bundled successfully!');
