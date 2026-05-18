# Codex 换账号迁移清单

这份文档用于把当前 Windows 电脑上的 Codex 工作环境迁移到另一个账号。它不只覆盖当前作品集项目，也覆盖 Codex 常用配置、skills、项目上下文、快捷方式和注意事项。

## 迁移原则

优先迁移“工作资料”和“可复用配置”，不要直接迁移账号登录凭据。

应该迁移：

- 项目文件夹
- 项目上下文 Markdown
- 自定义 skills
- AGENTS.md / Cursor rules / 个人工作流说明
- 本地脚本和快捷方式
- 非敏感环境配置模板

不要直接迁移：

- Codex / OpenAI 登录 token
- GitHub / Google / Slack 等 connector 登录凭据
- `.env` 里的真实 API Key
- 浏览器 cookies
- 密码、访问令牌、私钥

换账号后，这些敏感信息应该重新登录或重新创建。

## 1. 当前项目必须迁移

当前项目路径：

```text
D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike
```

建议完整复制整个文件夹到新账号仍能访问的位置。

必须保留的关键内容：

```text
Portfolio-Website-YiqiLike/
├─ frontend/
│  ├─ app/
│  ├─ components/
│  ├─ data/
│  │  ├─ site-config.json
│  │  ├─ site-config.history.jsonl
│  │  ├─ site-config.ts
│  │  └─ site-types.ts
│  ├─ public/
│  │  ├─ assets/
│  │  ├─ fonts/
│  │  └─ uploads/
│  ├─ package.json
│  └─ package-lock.json
├─ html_reference/
├─ screentshot_reference/
├─ scripts/
│  └─ open-portfolio-admin.ps1
├─ PROJECT_CONTEXT.md
├─ CODEX_ACCOUNT_MIGRATION_GUIDE.md
└─ AGENTS.md
```

尤其不能漏：

- `frontend/data/site-config.json`：网站内容和视觉参数。
- `frontend/public/uploads`：你通过 Admin 上传的图片和视频。
- `frontend/public/fonts`：本地字体。
- `PROJECT_CONTEXT.md`：给新账号 Codex 的项目交接上下文。
- `scripts/open-portfolio-admin.ps1`：一键启动脚本。

## 2. 新账号接手当前项目的步骤

在新账号的 Codex 里打开项目后，先让它读：

```text
PROJECT_CONTEXT.md
```

可以直接对新账号 Codex 说：

```text
请先阅读项目根目录的 PROJECT_CONTEXT.md 和 CODEX_ACCOUNT_MIGRATION_GUIDE.md，
然后熟悉 frontend/data/site-types.ts、frontend/components/AdminEditor.tsx、
frontend/components/CaseStudyPage.tsx、frontend/data/site-config.json。
继续开发前请运行 npm run lint 和 npm run build 确认当前基线。
```

然后在终端运行：

```powershell
cd D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike\frontend
npm install
npm run lint
npm run build
npm run dev
```

如果 `node_modules` 已经随项目一起复制，`npm install` 可能不是必须，但建议新账号环境首次运行一次。

## 3. 桌面快捷方式迁移

当前桌面快捷方式：

```text
D:\Desktop\作品集控制台.lnk
```

它指向：

```text
D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike\scripts\open-portfolio-admin.ps1
```

如果新账号仍然使用同一个项目路径，这个快捷方式可以继续用。

如果项目路径变了，需要重新创建快捷方式。

PowerShell 创建快捷方式命令：

```powershell
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop '作品集控制台.lnk'
$scriptPath = 'D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike\scripts\open-portfolio-admin.ps1'
$workDir = 'D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike'
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = 'powershell.exe'
$shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$scriptPath`""
$shortcut.WorkingDirectory = $workDir
$shortcut.WindowStyle = 7
$shortcut.Description = '启动 Portfolio Website 本地服务并打开 Admin 控制台'
$shortcut.IconLocation = 'powershell.exe,0'
$shortcut.Save()
```

## 4. Codex / Agents 配置迁移

当前用户目录里可能有这些配置位置：

```text
C:\Users\17530\.codex
C:\Users\17530\.agents
```

其中当前会话已知有：

```text
C:\Users\17530\.codex\skills
C:\Users\17530\.agents\skills
C:\Users\17530\.codex\plugins\cache
```

建议迁移：

- 自己创建或安装的 custom skills
- 自己写的 AGENTS.md 模板
- 自己写的命令、工作流说明、prompt 模板

谨慎迁移：

- `.codex` 下的全量配置
- `.codex/plugins/cache`

不要迁移：

- auth / token / session / credentials 相关文件
- connector 登录状态

推荐做法：

1. 在新账号先正常登录 Codex。
2. 让 Codex 自动创建新的 `.codex` 和 `.agents` 目录。
3. 只把自定义 skills 复制过去。
4. 插件和 connectors 尽量在新账号里重新安装和重新登录。

## 5. Skills 迁移

当前会话中 skills 路径主要来自：

```text
C:\Users\17530\.codex\skills
C:\Users\17530\.agents\skills
C:\Users\17530\.codex\skills\.system
C:\Users\17530\.codex\plugins\cache
```

自定义 skills 通常在：

```text
C:\Users\17530\.codex\skills
C:\Users\17530\.agents\skills
```

迁移步骤：

1. 打开旧账号目录：

```powershell
explorer C:\Users\17530\.codex\skills
explorer C:\Users\17530\.agents\skills
```

2. 把你自己创建或额外安装的 skill 文件夹复制到新账号对应目录：

```text
C:\Users\新账号用户名\.codex\skills
C:\Users\新账号用户名\.agents\skills
```

3. 不建议手动复制 `.system` 里的系统 skills，它们通常由 Codex 自带。

4. 不建议手动复制 plugin cache，插件最好在新账号里重新安装。

## 6. AGENTS.md / 项目规则迁移

当前项目里有 AGENTS.md 指令。它要求：

- 始终用中文回答。
- 修改后必须本地验证。
- Python 项目使用 Ruff、pytest、类型注解等规则。

当前项目的 AGENTS.md 应随项目一起迁移。

如果你有全局 AGENTS.md 或 Cursor rules，也建议复制。

可能的位置：

```text
C:\Users\17530\.codex\AGENTS.md
C:\Users\17530\.agents\AGENTS.md
D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike\AGENTS.md
```

实际是否存在，以本机文件为准。

## 7. 环境变量和 API Key

如果其他项目有 `.env`，请按这个原则处理：

- 可以迁移 `.env.example`
- 不要把真实 `.env` 发给别人或直接给新账号 Codex
- 如果新账号还是你本人使用，可以手动复制 `.env`，但要知道里面是敏感信息
- 更推荐重新创建新的 API Key，并更新 `.env`

查找项目里的环境文件：

```powershell
Get-ChildItem -Path D:\Desktop\Py_workspace -Recurse -Force -Include ".env",".env.local",".env.*"
```

迁移时建议为每个项目保留：

```text
.env.example
README.md
部署说明
```

## 8. Git / GitHub 相关

如果项目在 GitHub：

1. 新账号需要重新登录 GitHub。
2. 如果用 GitHub connector，需要在 Codex 新账号重新连接。
3. 本地 Git 用户名和邮箱可能需要更新：

```powershell
git config --global user.name "你的新名字"
git config --global user.email "你的新邮箱"
```

检查当前配置：

```powershell
git config --global --list
```

不要直接迁移：

```text
GitHub token
SSH private key
credential manager 里的密码
```

如果你使用 SSH，需要在新账号中重新配置 SSH key，或明确复制私钥并承担安全风险。

## 9. 插件 / Connectors

当前可用插件包括 Browser、GitHub、Google Calendar、Documents、Presentations、Spreadsheets 等。

换账号后：

- Browser 类本地能力通常可以继续使用。
- GitHub / Google Calendar 等账号型 connector 需要重新登录。
- 插件本身建议在新账号中重新安装或启用。

不要试图复制 connector 的登录 session。

## 10. Node / Python / 系统依赖

当前项目需要 Node.js 和 npm。

新账号环境需要确认：

```powershell
node -v
npm -v
```

如果命令不可用，需要安装 Node.js LTS。

当前项目首次运行：

```powershell
cd D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike\frontend
npm install
npm run dev
```

## 11. 推荐打包迁移方式

最稳的迁移包内容：

```text
Portfolio-Website-YiqiLike/
自定义 skills 文件夹/
个人 AGENTS.md 或规则文件/
非敏感 .env.example/
项目 README / 上下文 Markdown/
```

不要放入迁移包：

```text
.env 真实密钥
Codex 登录 token
GitHub token
浏览器 cookies
SSH 私钥
connector session
```

## 12. 给新账号 Codex 的启动提示词

可以直接复制下面这段给新账号 Codex：

```text
请先阅读当前项目根目录的 PROJECT_CONTEXT.md 和 CODEX_ACCOUNT_MIGRATION_GUIDE.md。
这是一个 Next.js + React + TypeScript 的 YIQI 风格作品集项目。
本地 Admin 控制台用于编辑内容、媒体和详情页 Block 编排。
继续开发前，请先检查 AGENTS.md，然后运行：

cd frontend
npm run lint
npm run build

确认基线通过后，再根据我的新需求继续修改。回答请始终使用中文。
```

