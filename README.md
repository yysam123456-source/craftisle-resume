# Craftisle Resume

基于 [Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume) 二次开发的开源简历生成器，完全浏览器本地运行，无需后端服务器。

在线体验：https://resume.craftisle.com

---

## 目录

- [项目概述](#项目概述)
- [设计理念](#设计理念)
- [原项目功能（Reactive Resume）](#原项目功能)
- [Craftisle 改造内容](#craftisle-改造内容)
- [已实现功能清单](#已实现功能清单)
- [技术架构](#技术架构)
- [项目结构](#项目结构)
- [本地开发指南](#本地开发指南)
- [部署指南](#部署指南)
- [后期扩展思路](#后期扩展思路)
- [如何切换回服务端模式](#如何切换回服务端模式)

---

## 项目概述

Craftisle Resume 是一个纯前端的简历生成与管理工具。用户在浏览器中创建、编辑、预览和导出简历，所有数据存储在本地 localStorage 中，无需注册登录，无需数据库，打开即用。

本项目是 [Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume) 的二次开发版本，由原版的全栈架构（Next.js + PostgreSQL + Better Auth）改造为纯浏览器本地存储模式，适用于：

- 对个人隐私敏感的用户（数据完全不离本地）
- 需要快速部署静态站点的场景
- 作为 Craftisle 工具站（i-tools）的组成部分
- 二次开发和学习参考

---

## 设计理念

### 核心理念：本地优先（Local First）

1. **隐私第一** — 简历数据是最敏感的个人信息之一，不应上传到任何服务器
2. **零摩擦启动** — 无需注册、登录、验证邮箱，打开就能用
3. **纯静态部署** — 一个 `dist/` 目录可以部署到任何静态托管服务（Vercel / Netlify / GitHub Pages）
4. **可恢复架构** — 保留完整的后端代码分支，需要时随时切回全栈模式

### 改造决策

| 决策 | 理由 |
|------|------|
| 移除后端 API | 简历工具的核心场景是「编辑→预览→导出」，不需要服务端存储 |
| localStorage 持久化 | 浏览器原生 API，无需额外依赖，5MB 容量对简历数据完全够用 |
| 保留 orpc 类型定义 | 未来恢复后端时只需改几行代码，不丢类型安全 |
| `with-backend` 分支 | 完整的原版后端代码保留在独立分支，扩展时无需重写 |

---

## 原项目功能（Reactive Resume）

原版 Reactive Resume 是一个功能完整的全栈简历 SaaS 平台，主要功能包括：

### 简历编辑器
- **实时预览** — 左侧编辑、右侧实时预览，所见即所得
- **多章节支持** — 基本信息、工作经历、教育背景、技能、项目、证书、出版物等 15+ 章节类型
- **拖拽排序** — 通过 `@dnd-kit` 实现章节和条目的拖拽排序
- **Rich Text 编辑** — 基于 Tiptap 的富文本编辑器，支持加粗、高亮、表格等
- **多模板** — 内置多套专业简历模板，一键切换

### 导入导出
- **PDF 导出** — 基于 `@react-pdf/renderer` 的高质量 PDF 生成
- **DOCX 导出** — 基于 `@reactive-resume/docx` 的 Word 格式导出
- **JSON 导入** — 从 JSON 文件导入简历数据
- **示例数据** — 一键生成带示例内容的简历

### 用户系统
- **注册/登录** — 基于 Better Auth 的完整用户系统
- **多设备同步** — 数据存储在 PostgreSQL，任意设备登录即可访问
- **公开简历分享** — 生成公开 URL，无需登录即可查看简历
- **密码保护** — 可设置密码保护公开简历

### AI 辅助
- **AI 写作助手** — 通过对话式 Agent 优化简历内容
- **智能建议** — AI 分析简历内容并给出改进建议

### 其他功能
- **多语言支持** — i18n 支持 15+ 种语言
- **主题定制** — 深色/浅色模式
- **快捷键** — 全面的键盘快捷键支持
- **统计面板** — 简历查看次数、公开链接访问统计

---

## Craftisle 改造内容

### 改造范围

| 文件 | 改造内容 |
|------|----------|
| `apps/web/src/libs/local-resume.ts` | **新增** — localStorage 服务层，替代所有 orpc API 调用 |
| `apps/web/src/features/resume/builder/draft.ts` | **重写** — `flushResumeSave` 改为 localStorage 读写，移除 orpc 依赖 |
| `apps/web/src/routes/dashboard/resumes/index.tsx` | **重写** — 简历列表改为从 `localStorage` 读取 |
| `apps/web/src/dialogs/resume/index.tsx` | **重写** — 创建/编辑/复制对话框改为调用 `local-resume.ts` |
| `apps/web/package.json` | **调整依赖** — 将 `@reactive-resume/api`、`@reactive-resume/auth`、`better-auth`、`drizzle-orm`、`pg` 等服务端包从 `dependencies` 移至 `devDependencies` |
| `vercel.json` | **部署配置** — 指定 `buildCommand`、`outputDirectory` |
| `.vercelignore` | **部署排除** — 排除 `apps/server`、`packages/db` 等服务端目录 |

### 改造原则

1. **最小改动** — 只改存储层，不改动编辑器和 UI 组件
2. **类型安全** — 保留所有 TypeScript 类型定义，编译时不丢失类型检查
3. **可恢复** — 原版 orpc 调用方式完整保留在 `with-backend` 分支，切回全栈模式只需合并分支
4. **无破坏性** — 不影响其他功能模块（PDF 导出、DOCX 导出、模板切换等）

---

## 已实现功能清单

### ✅ 完全可用的功能

| 功能 | 说明 |
|------|------|
| 创建简历 | 填写名称即可创建，支持从示例数据创建 |
| 编辑简历 | 完整的富文本编辑器，支持所有章节类型 |
| 本地持久化 | 所有修改自动保存到 localStorage |
| 删除简历 | 从 localStorage 中删除 |
| 复制简历 | 基于 `structuredClone` 的深拷贝 |
| 重命名/修改 slug | 更新简历元数据 |
| PDF 导出 | 基于 `@react-pdf/renderer` 的高质量 PDF |
| DOCX 导出 | Word 格式导出（基于 `@reactive-resume/docx`） |
| 模板切换 | 内置多套模板，一键切换预览 |
| 实时预览 | 编辑时右侧实时渲染 |
| 多语言界面 | i18n 支持（中文/英文/等） |
| 深色/浅色模式 | 主题切换 |
| 拖拽排序 | 章节和条目拖拽排序 |
| 快捷键 | 全面的键盘快捷键 |
| 简历缩略图 | 预览卡片中的 PDF 缩略图 |

### ⚠️ 当前不可用的功能（需后端支持）

| 功能 | 原因 | 未来恢复方式 |
|------|------|----------------|
| 用户注册/登录 | 需要 Better Auth + PostgreSQL | 切回 `with-backend` 分支 |
| 多设备同步 | 需要服务端存储 | 同上 |
| 公开简历分享 | 需要服务端托管公开页面 | 同上 |
| AI 写作助手 | 需要对接 LLM API（服务端代理） | 保留 `apps/server` 中的 AI 路由 |
| 查看统计 | 需要服务端记录访问数据 | 同上 |
| 密码保护 | 需要服务端验证密码 | 同上 |

> **注意**：不可用的功能在界面上可能仍然可见，但点击后会 404 或静默失败（不影响核心简历编辑功能）。

---

## 技术架构

### 整体架构

```
┌─────────────────────────────────────────────┐
│              Browser (Client)              │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │     React + Vite + TanStack Router  │  │
│  │                                     │  │
│  │  State: Zustand + Immer           │  │
│  │  UI: Tailwind CSS + @reactive-resume/ui │  │
│  │  Forms: TanStack Form              │  │
│  │  Editor: Tiptap                   │  │
│  └──────────────┬────────────────────┘  │
│                 │                       │
│                 ▼                       │
│  ┌─────────────────────────────────────┐  │
│  │      localStorage Service Layer      │  │
│  │  (apps/web/src/libs/local-resume.ts) │  │
│  │                                     │  │
│  │  - getResumes()                   │  │
│  │  - saveResume()                   │  │
│  │  - deleteResume()                │  │
│  │  - createResume()                │  │
│  └─────────────────────────────────────┘  │
│                 │                       │
│                 ▼                       │
│  ┌─────────────────────────────────────┐  │
│  │        Browser localStorage          │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 与原版架构对比

| 层级 | 原版（全栈） | Craftisle（本地） |
|------|----------------|-------------------|
| 状态管理 | Zustand + TanStack Query | Zustand（无 Query） |
| 数据持久化 | orpc → Next.js API → PostgreSQL | `local-resume.ts` → localStorage |
| 实时同步 | orpc subscription | 无（纯本地） |
| 认证 | Better Auth | 无（不需要） |
| 部署产物 | `apps/web/dist` + `apps/server`（Serverless） | `apps/web/dist`（纯静态） |

### 核心依赖

| 依赖 | 用途 |
|------|------|
| `react` + `react-dom` | UI 框架（v19） |
| `vite` | 构建工具 |
| `@tanstack/react-router` | 路由管理 |
| `zustand` + `immer` | 状态管理（draft.ts 中的 resume store） |
| `tanstack-form` | 表单处理 |
| `tiptap` | 富文本编辑器 |
| `@react-pdf/renderer` | PDF 生成 |
| `@reactive-resume/schema` | 简历数据结构定义 |
| `@reactive-resume/ui` | UI 组件库 |
| `@phosphor-icons/react` | 图标 |

---

## 项目结构

```
craftisle-resume/
├── apps/
│   ├── web/                          # 前端应用（当前活跃）
│   │   ├── src/
│   │   │   ├── libs/
│   │   │   │   ├── local-resume.ts    # ⭐ localStorage 服务层（新增）
│   │   │   │   └── orpc/client.ts    # orpc 客户端（保留，未来恢复用）
│   │   │   ├── features/
│   │   │   │   ├── resume/
│   │   │   │   │   ├── builder/      # 简历编辑器（draft.ts 已改造）
│   │   │   │   │   ├── export/       # PDF/DOCX 导出
│   │   │   │   │   └── preview/      # 简历预览
│   │   │   │   ├── settings/         # 用户设置
│   │   │   │   └── command-palette/ # 命令面板
│   │   │   ├── routes/
│   │   │   │   ├── dashboard/        # 简历仪表盘
│   │   │   │   ├── builder/          # 编辑器页面
│   │   │   │   ├── auth/             # 认证页面（不可用）
│   │   │   │   └── agent/            # AI 助手页面（不可用）
│   │   │   └── dialogs/
│   │   │       └── resume/            # 简历对话框（已改造）
│   │   └── index.html
│   │   └── package.json              # ⭐ 服务端依赖已移至 devDependencies
│   └── server/                       # 后端 API（当前未使用，保留代码）
│
├── packages/
│   ├── api/                          # orpc 路由定义（保留）
│   ├── auth/                         # Better Auth 配置（保留）
│   ├── db/                           # 数据库 schema（保留，当前不构建）
│   ├── schema/                       # 简历数据结构定义（活跃）
│   ├── ui/                           # UI 组件库（活跃）
│   └── utils/                        # 工具函数（活跃）
│
├── vercel.json                       # ⭐ Vercel 部署配置
├── LOCAL_MODE.md                    # ⭐ 本地模式 vs 服务端模式切换指南
└── README.md                       # 本文档
```

---

## 本地开发指南

### 环境要求

- Node.js ≥ 22（推荐用 nvm 管理）
- pnpm ≥ 10

### 安装依赖

```bash
git clone https://github.com/yysam123456-source/craftisle-resume.git
cd craftisle-resume
pnpm install
```

### 启动开发服务器

```bash
pnpm --filter web dev
```

访问 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
pnpm --filter web build
```

构建产物在 `apps/web/dist/`。

### 运行单个模块测试

```bash
pnpm --filter web test
```

---

## 部署指南

### Vercel 部署（推荐）

项目已配置好 `vercel.json`，直接连接 GitHub 仓库即可自动部署：

1. 登录 [Vercel](https://vercel.com) → New Project
2. 导入 `yysam123456-source/craftisle-resume` 仓库
3. Vercel 会自动识别 `vercel.json` 中的配置
4. 点击 Deploy，约 1 分钟完成

**关键配置**（已写入 `vercel.json`）：

```json
{
  "buildCommand": "pnpm --filter web build",
  "outputDirectory": "apps/web/dist",
  "installCommand": "pnpm install"
}
```

### 其他静态托管

构建后的 `apps/web/dist/` 目录可以部署到任何静态托管服务：

- **Netlify**：直接拖拽 `dist/` 目录，或连接 GitHub 自动构建
- **GitHub Pages**：将 `dist/` 推送到 `gh-pages` 分支
- **Cloudflare Pages**：连接 GitHub，构建命令填 `pnpm --filter web build`，输出目录填 `apps/web/dist`

---

## 后期扩展思路

### 阶段一：增强本地功能（无需后端）

| 功能 | 技术思路 |
|------|----------|
| 从 localStorage 导出/导入 JSON | 利用已有的 `getResume` / `saveResume` API |
| 多简历模板市场 | 扩展 `packages/schema/templates` |
| 本地图片上传（头像等） | `FileReader` + base64 存 localStorage |
| 快捷键自定义 | 扩展 `command-palette` 功能 |
| PWA 支持（离线使用） | 添加 `vite-plugin-pwa` |

### 阶段二：选择性后端功能（混合模式）

不需要完整后端，只加需要的功能：

| 功能 | 实现方式 |
|------|----------|
| 公开简历分享 | 轻量后端，只提供公开简历读取 API（无需用户系统） |
| 访问统计 | 公开简历页面 + 简单的 PV 计数器 |
| AI 写作助手 | 前端直接调 OpenAI API（用户自带 API Key） |

### 阶段三：完整后端恢复

当需要多设备同步时，切回全栈模式：

```bash
git checkout with-backend
pnpm install   # 安装完整依赖（含 PostgreSQL）
```

需要准备：
- PostgreSQL 数据库（Vercel Postgres / Supabase / 自建）
- 配置 `DATABASE_URL` 环境变量
- 运行数据库迁移 `pnpm --filter db run migrate`

---

## 如何切换回服务端模式

项目保留了完整的后端代码在 `with-backend` 分支，恢复全栈模式只需 3 步：

### Step 1：切换分支

```bash
git checkout with-backend
```

### Step 2：恢复依赖

`apps/web/package.json` 中的服务端包已经在 `with-backend` 分支中正确声明在 `dependencies` 中，无需手动修改。

### Step 3：配置数据库并部署

```bash
# 安装所有依赖（含服务端）
pnpm install

# 运行数据库迁移
pnpm --filter db run migrate

# 本地开发（同时启动 web + server）
pnpm dev
```

### 两个分支的分工

| 分支 | 用途 | 部署目标 |
|------|------|----------|
| `main` | 纯本地版，无需后端 | Vercel 静态部署 |
| `with-backend` | 完整全栈版 | Vercel Serverless Functions |

未来开发新功能时，建议在 `main` 分支开发纯前端功能，需要后端时再合并 `with-backend`。

---

## 开源协议

本项目基于 [Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume) 二次开发，遵循原项目的 MIT 协议。

---

## 相关链接

- 原项目：https://github.com/AmruthPillai/Reactive-Resume
- 在线体验：https://resume.craftisle.com
- 问题反馈：https://github.com/yysam123456-source/craftisle-resume/issues
