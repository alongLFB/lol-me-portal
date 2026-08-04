# LOL 中东服玩家社区门户 (LOL ME Server Community Portal)

汇聚中东服华人群友，一站式开黑工具与数据看板。

---

## 🌟 简介 (Introduction)

本项目是一个专门为《英雄联盟》中东服华人玩家设计的社区门户网站。它集合了新手指南、常用工具链接、语音开黑频道（Discord）以及群友排位数据排行榜等实用功能，并集成了 **Cloudflare D1 数据库** 与 **可视化后台管理系统 (`/admin`)**，支持管理员实时在线增删改查前端显示的板块分类、导航工具与全站公告。

---

## 🚀 核心功能 (Features)

*   **新手起航与客户端**: 提供中东服官方客户端下载链接及注册/转服教程。
*   **社群开黑语音**: 提供专属的 Discord 语音交流频道链接及语音优化辅助工具。
*   **游戏上分神器**: 推荐各种实用工具，如选人避坑神器 (League Akari, Lobby Reveal) 及排队小游戏等。
*   **群友数据与排行榜**: 提供资料录入入口，以及中东服华人排行榜数据统计表格。
*   **可视化后台管理 (`/admin`)**: 
    *   **全站设置**: 动态修改 Header 标题、副标题以及群友行动指引提示框。
    *   **板块分类管理**: 增加、修改、删除导航分类，设置全宽展示与排序。
    *   **导航卡片管理**: 动态增删工具卡片，关联 Lucide 图标、主题高亮与排序。
*   **高可用优雅降级**: 若未连接 D1 数据库，系统将自动降级使用内置默认导航数据，保证前台 100% 稳定运行。

---

## 🛠️ 技术栈 (Tech Stack)

| 层级 | 技术选型 |
|---|---|
| **核心框架** | Next.js 16.3 (App Router / Turbopack) + React 19 |
| **数据库** | Cloudflare D1 (SQLite) + Drizzle ORM (`d1-http` adapter) |
| **鉴权认证** | JWT (`jose`) + Standard HttpOnly Cookie |
| **样式与图标** | Tailwind CSS v4 + Lucide React |
| **动效** | Framer Motion v12 |
| **部署与 PM2** | GitHub Actions + PM2 Zero-downtime Reload |

---

## ⚙️ 环境变量配置 (Environment Variables)

复制根目录的 `.env.example` 为 `.env.local` 并配置相应的凭证：

```bash
cp .env.example .env.local
```

### 必需与可选配置项：

```env
# 1. 应用运行端口
PORT=3007

# 2. 后台管理员鉴权 (必填)
ADMIN_PASSWORD=设置为你的后台登录密码
JWT_SECRET=设置至少32位的随机字符串

# 3. Cloudflare D1 数据库配置 (选填，不填则使用内置默认数据)
CLOUDFLARE_ACCOUNT_ID=你的Cloudflare账号ID
CLOUDFLARE_D1_DATABASE_ID=你的D1数据库UUID
CLOUDFLARE_API_TOKEN=具有D1编辑权限的CloudflareAPIToken
```

---

## 🗄️ 数据库初始化 (Cloudflare D1)

如需使用 Cloudflare D1 存储数据，可在终端初始化或部署建表：

```bash
# 1. 安装 Wrangler CLI 并登录 (如未安装)
npm install -g wrangler
wrangler login

# 2. 创建 D1 数据库
wrangler d1 create lol-me-portal-db

# 3. 部署建表 SQL 到远程 D1 数据库
wrangler d1 execute lol-me-portal-db --remote --file=drizzle/0000_init.sql
```

---

## ⚡ 本地开发与构建 (Development & Build)

```bash
# 1. 安装依赖
npm install

# 2. 运行本地开发服务
npm run dev

# 3. 本地编译与类型检查
npm run build
```

访问地址：
- **前台门户首页**：`http://localhost:3000`
- **后台管理系统**：`http://localhost:3000/admin` （登录密码默认为 `ADMIN_PASSWORD`）

---

## 🚀 生产部署 (Deployment)

推荐使用 GitHub Actions 结合 VPS 服务器自动部署（零停机热重载）：

1. 在 GitHub 仓库设置中添加 Secrets：
   - `SERVER_HOST`: 服务器 IP
   - `SERVER_USER`: 服务器用户名
   - `SERVER_SSH_KEY`: 服务器 SSH 私钥
   - `ENV_FILE`: 服务器使用的全量 `.env.local` 环境变量文件内容

2. 推送代码至 `master` 分支，GitHub Actions 将自动执行构建并通过 `pm2 reload` 实现零停机上线。
