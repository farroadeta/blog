#!/usr/bin/env node

/**
 * 图片优化工具
 * 功能：
 * 1. 将图片转换为WebP格式
 * 2. 生成不同尺寸的响应式图片
 * 3. 压缩图片质量
 * 
 * 使用方法：
 * node optimize-images.js
 * 
 * 依赖：
 * npm install sharp glob
 */

const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// 配置
const config = {
    // 输入目录
    inputDir: 'static/images',
    // 输出目录
    outputDir: 'static/images/optimized',
    // 图片质量
    quality: 80,
    // 响应式图片尺寸
    sizes: [
        { name: 'small', width: 400 },
        { name: 'medium', width: 800 },
        { name: 'large', width: 1200 }
    ],
    // 支持的图片格式
    extensions: ['jpg', 'jpeg', 'png', 'webp']
};

// 创建输出目录
function createOutputDir() {
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
        console.log(`✓ 创建输出目录: ${config.outputDir}`);
    }
}

// 优化单张图片
async function optimizeImage(inputPath, outputPath, width = null) {
    try {
        let image = sharp(inputPath);
        
        // 获取图片信息
        const metadata = await image.metadata();
        
        // 如果指定了宽度且原图宽度大于指定宽度，则缩放
        if (width && metadata.width > width) {
            image = image.resize(width, null, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }
        
        // 转换为WebP格式
        await image
            .webp({ quality: config.quality })
            .toFile(outputPath);
        
        // 获取优化后的文件大小
        const stats = fs.statSync(outputPath);
        const originalSize = fs.statSync(inputPath).size;
        const savedSize = originalSize - stats.size;
        const savedPercent = ((savedSize / originalSize) * 100).toFixed(1);
        
        console.log(`✓ 优化: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`  原始大小: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`  优化后: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`  节省: ${savedPercent}%`);
        
        return true;
    } catch (error) {
        console.error(`✗ 优化失败: ${inputPath}`, error.message);
        return false;
    }
}

// 批量优化图片
async function optimizeAllImages() {
    console.log('开始优化图片...\n');
    
    createOutputDir();
    
    // 查找所有图片
    const patterns = config.extensions.map(ext => 
        path.join(config.inputDir, '**', `*.${ext}`).replace(/\\/g, '/')
    );
    
    let totalImages = 0;
    let optimizedImages = 0;
    
    for (const pattern of patterns) {
        const files = glob.sync(pattern);
        
        for (const file of files) {
            totalImages++;
            
            // 跳过已经优化的图片
            if (file.includes('/optimized/')) {
                continue;
            }
            
            const filename = path.basename(file, path.extname(file));
            const relativeDir = path.dirname(file).replace(config.inputDir, '');
            
            // 为每个尺寸生成优化后的图片
            for (const size of config.sizes) {
                const outputDir = path.join(config.outputDir, relativeDir);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                
                const outputPath = path.join(outputDir, `${filename}-${size.name}.webp`);
                
                const success = await optimizeImage(file, outputPath, size.width);
                if (success) {
                    optimizedImages++;
                }
            }
            
            // 生成原始尺寸的WebP版本
            const outputDir = path.join(config.outputDir, relativeDir);
            const outputPath = path.join(outputDir, `${filename}.webp`);
            const success = await optimizeImage(file, outputPath);
            if (success) {
                optimizedImages++;
            }
        }
    }
    
    console.log(`\n优化完成！`);
    console.log(`总共处理: ${totalImages} 张图片`);
    console.log(`成功优化: ${optimizedImages} 张图片`);
}

// 生成响应式图片HTML
function generateResponsiveImageHTML(filename, alt = '', className = '') {
    return `
<picture class="${className}">
    <source media="(max-width: 400px)" srcset="/images/optimized/${filename}-small.webp" type="image/webp">
    <source media="(max-width: 800px)" srcset="/images/optimized/${filename}-medium.webp" type="image/webp">
    <source media="(max-width: 1200px)" srcset="/images/optimized/${filename}-large.webp" type="image/webp">
    <img src="/images/optimized/${filename}.webp" alt="${alt}" loading="lazy" decoding="async">
</picture>
    `.trim();
}

// 运行优化
if (require.main === module) {
    optimizeAllImages().catch(console.error);
}

module.exports = {
    optimizeImage,
    optimizeAllImages,
    generateResponsiveImageHTML
};
