# 部署指南

## 推荐方案：GitHub Pages + Cloudflare CDN（国内访问最快）

### 1. GitHub 仓库设置

1. 在 GitHub 创建新仓库（例如：`blog`）
2. 将本地代码推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/blog.git
   git push -u origin main
   ```

3. 在 GitHub 仓库设置中：
   - 进入 Settings -> Pages
   - Source 选择 "GitHub Actions"
   - 进入 Settings -> Secrets and variables -> Variables
   - 添加变量 `BASE_URL`，值为你的域名（如 `https://blog.qiwaqua.com`）

### 2. Cloudflare 配置（国内加速关键）

1. 登录 Cloudflare，添加你的域名
2. 在 DNS 设置中添加记录：
   - 类型：CNAME
   - 名称：blog（或你的子域名）
   - 目标：你的用户名.github.io
   - 代理状态：已代理（橙色云朵）

3. 在 SSL/TLS 设置中：
   - 加密模式：完全（严格）
   - 始终使用 HTTPS：开启

4. 在速度设置中：
   - 自动压缩：开启
   - Brotli：开启
   - 早期提示：开启

5. 在缓存设置中：
   - 缓存级别：标准
   - 浏览器缓存 TTL：4小时
   - 始终在线：开启

### 3. Gitee 镜像（可选，备用方案）

1. 在 Gitee 创建同名仓库
2. 导入 GitHub 仓库
3. 开启 Gitee Pages 服务
4. 配置自动同步（需要设置 webhook 或手动同步）

### 4. 部署流程

每次推送代码到 main 分支，GitHub Actions 会自动：
1. 构建 Hugo 站点
2. 部署到 GitHub Pages
3. Cloudflare 会自动缓存并加速访问

### 5. 国内访问优化

- **主要访问**：通过 Cloudflare CDN（已优化国内线路）
- **备用访问**：Gitee Pages（国内服务器）
- **自定义域名**：通过 Cloudflare 管理，支持 HTTPS

### 6. 验证部署

部署完成后，访问以下地址验证：
- https://blog.qiwaqua.com（主站点）
- https://你的用户名.github.io（GitHub Pages 原始地址）

## 注意事项

1. 首次部署可能需要几分钟生效
2. Cloudflare 缓存更新可能需要几分钟
3. 确保 CNAME 文件中的域名与你的实际域名一致
4. 如果更换域名，记得更新 GitHub 仓库变量和 CNAME 文件
