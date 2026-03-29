const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 安装sharp：npm install sharp

const imageDirs = [
    'static/images',
    'static/images/author'
];

async function convertToWebP() {
    console.log('开始转换图片到WebP格式...');
    
    for (const dir of imageDirs) {
        try {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                
                if (stats.isFile() && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
                    const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                    
                    try {
                        await sharp(filePath)
                            .webp({ quality: 80 })
                            .toFile(webpPath);
                        console.log(`转换成功: ${file} -> ${path.basename(webpPath)}`);
                    } catch (error) {
                        console.error(`转换失败: ${file}`, error.message);
                    }
                }
            }
        } catch (error) {
            console.error(`读取目录失败: ${dir}`, error.message);
        }
    }
    
    console.log('WebP转换完成！');
}

// 检查sharp是否安装
if (!require.main.require('sharp')) {
    console.log('请先安装sharp库: npm install sharp');
    process.exit(1);
}

convertToWebP();
