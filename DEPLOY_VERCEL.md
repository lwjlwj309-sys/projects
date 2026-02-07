# Vercel 零成本部署指南

## 🎯 部署方案概述

本方案将 Expo + Express 项目改造为 **Vercel Serverless** 架构，实现：
- ✅ **完全免费**：使用 Vercel 免费额度
- ✅ **自动 HTTPS**：无需配置证书
- ✅ **全球 CDN**：自动加速访问
- ✅ **自动扩容**：无需手动运维

---

## 📋 部署前准备

### 1. 账号准备

1. 访问 [Vercel 官网](https://vercel.com)
2. 注册账号（推荐使用 GitHub 账号登录）
3. 安装 Vercel CLI：
```bash
npm install -g vercel
```

### 2. 代码仓库准备

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 确保仓库是公开的（免费账号需要公开仓库）

---

## 🚀 部署步骤

### 方式一：通过 Vercel CLI 部署（推荐）

#### 1. 安装依赖

```bash
cd /workspace/projects
pnpm install
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署项目

```bash
# 在项目根目录执行
vercel
```

按照提示操作：
- **Set up and deploy?** → `Y`
- **Which scope do you want to deploy to?** → 选择你的账号
- **Link to existing project?** → `N`
- **What's your project's name?** → 输入项目名称（如：blessings-app）
- **In which directory is your code located?** → `./`（当前目录）

等待部署完成，Vercel 会返回一个 URL，如：
```
https://blessings-app.vercel.app
```

#### 4. 配置生产环境

```bash
# 部署到生产环境
vercel --prod
```

---

### 方式二：通过 Vercel 网站部署

#### 1. 登录 Vercel

访问 https://vercel.com 并登录

#### 2. 创建新项目

1. 点击 `Add New` → `Project`
2. 导入你的 GitHub 仓库
3. 配置项目设置：
   - **Framework Preset**：选择 `Other`
   - **Build Command**：`pnpm run build:vercel`
   - **Output Directory**：`client/dist`
   - **Install Command**：`pnpm install`

#### 3. 配置环境变量（如果需要）

如果项目需要环境变量，在 `Environment Variables` 中添加：
- `EXPO_PUBLIC_BACKEND_BASE_URL`：留空（Vercel 自动处理）

#### 4. 点击部署

点击 `Deploy` 按钮，等待部署完成。

---

## 🔧 部署后配置

### 1. 验证部署

访问你的 Vercel 域名，如：
```
https://blessings-app.vercel.app
```

检查功能是否正常：
- ✅ 首页生成祝福语
- ✅ 藏头诗功能
- ✅ AI定制功能

### 2. 配置自定义域名（可选）

1. 在 Vercel 项目设置中，点击 `Domains`
2. 添加你的自定义域名（如：blessings.yourdomain.com）
3. 按照提示配置 DNS 记录

---

## 📱 部署微信小程序

### 步骤一：获取 Vercel 域名

部署成功后，记下你的 Vercel 域名，如：
```
https://blessings-app.vercel.app
```

### 步骤二：配置小程序服务器域名

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入「开发」→「开发管理」→「开发设置」
3. 在「服务器域名」中配置：
   - **request 合法域名**：添加你的 Vercel 域名
   - **socket 合法域名**：添加你的 Vercel 域名

### 步骤三：创建微信小程序项目

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 创建新项目
3. 创建 `pages/index/index.wxml`：
```xml
<web-view src="https://blessings-app.vercel.app"></web-view>
```

4. 创建 `pages/index/index.js`：
```javascript
Page({
  data: {
    url: 'https://blessings-app.vercel.app'
  }
});
```

5. 配置 `app.json`：
```json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "祝福语拜年啦"
  }
}
```

6. 预览并提交审核

---

## 🔄 自动部署

每次代码推送到 GitHub 后，Vercel 会自动部署新版本。

### 查看部署状态

1. 访问 Vercel 项目页面
2. 查看 `Deployments` 标签
3. 每次部署都会有详细信息

---

## 💡 常见问题

### Q1: 部署后 API 报错怎么办？

**A**: 检查以下几点：
1. Vercel Functions 是否正常部署（查看部署日志）
2. API 路径是否正确（`/api/v1/blessings/...`）
3. CORS 配置是否正确（已包含在 `vercel.json` 中）

### Q2: 免费额度够用吗？

**A**: Vercel 免费额度：
- 100GB 带宽/月
- 6000 分钟函数执行时间/月
- 对于个人项目和小型应用完全够用

### Q3: 如何查看部署日志？

**A**: 在 Vercel 项目页面：
1. 点击 `Deployments`
2. 选择具体的部署
3. 点击 `Function Logs` 查看 API 日志
4. 点击 `Build Logs` 查看构建日志

### Q4: 如何回滚到之前的版本？

**A**: 在 Vercel 项目页面：
1. 点击 `Deployments`
2. 找到之前的版本
3. 点击右上角的 `...` → `Promote to Production`

### Q5: 如何更新代码？

**A**: 只需将代码推送到 GitHub，Vercel 会自动部署：
```bash
git add .
git commit -m "更新功能"
git push origin main
```

---

## 📊 成本分析

| 项目 | 成本 | 说明 |
|------|------|------|
| Vercel 托管 | 免费 | 免费额度足够使用 |
| 域名 | 可选 | Vercel 提供免费子域名 |
| 证书 | 免费 | Vercel 自动配置 |
| **总成本** | **0 元** | 完全免费 |

---

## 🎉 部署完成

恭喜！你的应用已经成功部署到 Vercel，现在可以：

1. ✅ 通过 Vercel 域名访问 Web 版本
2. ✅ 创建微信小程序 WebView 版本
3. ✅ 享受自动 HTTPS 和全球 CDN 加速
4. ✅ 自动部署新版本代码

---

## 📞 技术支持

如遇到问题，可以：
1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 查看 Vercel 部署日志
3. 检查代码仓库 Issues

---

**部署成功后，你会获得一个类似这样的域名：**
```
https://blessings-app.vercel.app
```

**祝部署顺利！🎉**
