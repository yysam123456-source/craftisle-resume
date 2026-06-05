# Local Mode vs Server Mode

## Current State: Local Mode (main branch)

简历数据存储在浏览器 localStorage，无需后端服务器。

- 简历 CRUD: `apps/web/src/libs/local-resume.ts`
- 构建命令: `pnpm --filter web build`
- 部署: 只部署 `apps/web`，见 `vercel.json`

## Switch to Server Mode (with-backend branch)

```bash
git checkout with-backend
pnpm install   # 安装全部 workspace 依赖（含数据库）
pnpm --filter web build
```

`with-backend` 分支保留了完整的后端代码：
- `apps/server` - 后端 API 服务（orpc）
- `packages/api` - orpc 路由定义
- `packages/auth` - better-auth 认证
- `packages/db` - 数据库 schema（drizzle-orm + PostgreSQL）

## 在 main 分支恢复后端（手动步骤）

如果需要基于当前 main 分支加回后端：

### Step 1: 恢复 package.json 依赖

把 `apps/web/package.json` 中的这些包从 `devDependencies` 移回 `dependencies`：

```
@reactive-resume/api        workspace:*
@reactive-resume/auth       workspace:*
better-auth                 1.6.13
@better-auth/api-key        ^1.6.13
@better-auth/infra          ^0.2.11
@better-auth/oauth-provider ^1.6.13
@better-auth/passkey        ^1.6.13
drizzle-orm                1.0.0-rc.3
pg                          ^8.21.0
```

### Step 2: 恢复 draft.ts

把 `apps/web/src/features/resume/builder/draft.ts` 中的 localStorage 调用改回 orpc 调用：

- `getResume()` / `saveResume()` → `orpc.resume.update.call()`
- 恢复 `useResumeUpdateSubscription` 和 `useBuilderResumeUpdateSubscription` 的实际实现
- 恢复 `bindRuntimeQueryClient` 和 `setRuntimeBaseline`

### Step 3: 恢复对话框

`apps/web/src/dialogs/resume/index.tsx`：
- `createResume()` → `orpc.resume.create.mutationOptions()`
- `updateResumeMetadata()` → `orpc.resume.update.mutationOptions()`
- `deleteResume()` → `orpc.resume.delete.mutationOptions()`

### Step 4: 更新 vercel.json

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": ".vercel/output"
}
```

### Step 5: 配置数据库

```bash
# 需要 PostgreSQL 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# 运行迁移
pnpm --filter db run migrate
```

## 快速切换建议

| 场景 | 推荐方式 |
|------|----------|
| 只改前端，不用后端 | main 分支（当前） |
| 需要用户登录/多设备同步 | `git checkout with-backend` |
| 逐步迁移回后端 | 在 main 基础上按 Step 1-5 手动恢复 |

## 文件对照表

| 文件 | Local Mode | Server Mode |
|------|-----------|------------|
| `libs/local-resume.ts` | ✅ 使用 | ❌ 不存在 |
| `features/resume/builder/draft.ts` | localStorage | orpc API |
| `routes/dashboard/resumes/index.tsx` | localStorage | orpc query |
| `dialogs/resume/index.tsx` | local-resume | orpc mutation |
| `libs/orpc/client.ts` | 保留（no-op） | 实际使用 |
