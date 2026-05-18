# Portfolio-Website-YiqiLike 项目交接上下文

## 项目目标

本项目是在本地复刻 YIQI Yan 风格的个人作品集网站。核心目标是：

- 视觉上尽量接近 YIQI 原站：黑色固定左侧栏、右侧作品网格、详情页大面积媒体展示、字体和动效接近原站。
- 内容可替换成用户自己的个人作品集。
- 本地提供一个类似简化版 Framer / Wix 的 Admin 控制台，方便用户不写代码也能调整内容、排版、媒体和视觉参数。
- 最终发布时只发布公开作品集页面，不发布 Admin 控制台。

## 技术栈

- 路径：`D:\Desktop\Py_workspace\Portfolio-Website-YiqiLike`
- 前端目录：`frontend`
- 框架：Next.js App Router + React + TypeScript
- 动效：Framer Motion
- 图标：lucide-react
- 字体：本地字体，位于 `frontend/public/fonts`
- 数据配置：`frontend/data/site-config.json`
- 配置读写：`frontend/data/site-config.ts`
- 类型定义：`frontend/data/site-types.ts`

## 主要路由

- `/`：公开首页
- `/willow_desktop`：公开作品详情页
- `/willow_ios`：公开作品详情页
- `/tiktok_product_infra`：公开作品详情页
- `/admin`：本地 Admin 首页编辑模式
- `/admin/[slug]`：本地 Admin 作品详情页编辑模式
- `/api/site-config`：读取/保存站点配置
- `/api/media`：上传/删除本地媒体文件

## 当前重要文件

- `frontend/components/AdminEditor.tsx`
  - 右侧抽屉式 Admin 控制台。
  - 支持全站文本、侧边栏、首页画布、详情页 Block、媒体库。
  - Admin 是覆盖在真实全屏网站上的，不是 iframe 预览。

- `frontend/components/AdminEditor.module.css`
  - Admin 抽屉、Block 列表、媒体上传、布局选择 UI 样式。

- `frontend/components/PortfolioShell.tsx`
  - 应用全局设计变量。
  - 接收 `config` 和 `adminMode`。

- `frontend/components/Sidebar.tsx`
  - 固定左侧黑色导航。
  - Admin 模式下链接会跳转到 `/admin/...`，避免编辑时离开控制台。

- `frontend/components/ScrambleName.tsx`
  - 左上角名字乱码动画。
  - 已取消 hover 触发。
  - 现在只在页面跳转或点击 Home 名字时触发。

- `frontend/components/CaseStudyPage.tsx`
  - 作品详情页渲染模板。
  - 详情页由多个 Section/Block 自上而下组成。
  - 支持单图、两列、三列、主图+双列、左媒右文、全宽纵向、纯文本、YouTube/Vimeo 嵌入等。

- `frontend/components/MediaBlock.tsx`
  - 图片、本地视频、外部 embed 视频渲染。
  - YouTube/Vimeo 链接会转成 iframe embed。

- `frontend/components/VideoHover.tsx`
  - 名字还叫 VideoHover，但实际已改成本地视频自动播放。
  - 视频使用 `muted loop autoPlay playsInline`。

- `frontend/data/site-config.json`
  - 当前站点所有内容和视觉参数的主要保存点。

- `frontend/data/site-config.history.jsonl`
  - 每次保存配置时追加一条历史记录。

- `frontend/public/uploads`
  - Admin 上传的媒体保存位置。
  - 在 Admin 删除上传媒体时，本地文件也会删除。

- `scripts/open-portfolio-admin.ps1`
  - 一键启动脚本。
  - 会启动 Next 本地服务，并打开 `/admin`。

- 桌面快捷方式：
  - `D:\Desktop\作品集控制台.lnk`
  - 双击会运行 `scripts/open-portfolio-admin.ps1`。

## Admin 控制台设计逻辑

Admin 控制台不是独立后台页面，而是覆盖在真实全屏网站右侧的抽屉。

使用方式：

1. 打开 `/admin` 或 `/admin/[slug]`。
2. 右下角点击 `控制台`。
3. 右侧抽屉展开。
4. 修改参数、文字、媒体、Block。
5. 点击 `保存并应用`。
6. 收起抽屉即可看到完整全屏预览。

## 详情页 Block 模型

用户明确要求：不是一个 layout 应用于整个详情页，而是每个内容块独立组织。

当前实现逻辑：

- 一个 `CaseStudySection` 就是一个可独立排版的 Block。
- 每个 Block 有自己的 `layout`、`media[]`、`kicker`、`title`、`body`。
- 控制台里可以：
  - 添加新 Block
  - 选择 Block
  - 上移 / 下移 / 删除 Block
  - 修改当前 Block 类型
  - 给当前 Block 上传媒体或填写外部视频链接

当前 Block 类型：

- `singleMedia`：单图 / 单视频，最多 1 个本地媒体。
- `mediaGridTwo`：两列平分，最多 2 个本地媒体。
- `mediaGridThree`：三列平分，最多 3 个本地媒体。
- `mediaGrid`：主图 + 双列，最多 3 个本地媒体。
- `mediaTextSplit`：左媒右文，最多 1 个本地媒体，并显示文字编辑。
- `embedMedia`：YouTube / Vimeo，只允许 1 个外部视频链接。
- `fullBleedMedia`：全宽纵向，可放多个本地媒体。
- `twoColumnText`：纯文本，不允许插入媒体。

## 媒体规则

- 本地上传支持图片和视频。
- 上传后保存到 `frontend/public/uploads`。
- 删除上传媒体时，如果路径以 `/uploads/` 开头，会同时删除本地文件。
- YouTube / Vimeo 不下载，只保存链接。
- YouTube / Vimeo 会在前台转成 iframe embed。
- 本地视频自动循环播放，不需要 hover。
- 图片/视频不再 hover 上浮。

## `cover` / `contain` 说明

- `cover`：媒体铺满容器，可能被裁切，适合封面和统一网格。
- `contain`：完整显示媒体，不裁切，但可能出现留白，适合 UI 截图和不能被裁掉的图。

## 运行命令

在 `frontend` 目录：

```powershell
npm run dev
npm run lint
npm run build
```

当前 `package.json` 中 dev 命令使用：

```json
"dev": "next dev --webpack --hostname 127.0.0.1"
```

这是为了避免此前出现过 HMR WebSocket 连接问题。

## 验证记录

多次已验证：

- `npm run lint` 通过。
- `npm run build` 通过。
- Playwright 检查过 `/admin` 和 `/admin/[slug]`。
- 最近一次验证包括：
  - Admin 控制台能展开。
  - `收起` 按钮能关闭抽屉。
  - Block 编辑 UI 能出现。
  - 无浏览器控制台错误。

## 近期用户明确要求过的行为

- 始终用中文回复。
- Admin 控制台必须中文。
- 控制台应该像侧边栏抽屉，而不是 iframe 后台页。
- 预览应该是真实全屏网站。
- 详情页排版需要按 Block 自由组织。
- 每个 Block 独立选择样式和媒体。
- YouTube / Vimeo Block 只填写链接，并以单张全宽样式展示。
- 发布时只发布公开网站，不发布 Admin。
- 推荐工作流是：本地 Admin 编辑 -> 保存配置和媒体 -> 构建 public-only 静态站 -> 部署公开网页。

## 推荐给下一个 Codex 的第一步

如果继续开发，请先读：

1. `PROJECT_CONTEXT.md`
2. `frontend/data/site-types.ts`
3. `frontend/components/AdminEditor.tsx`
4. `frontend/components/CaseStudyPage.tsx`
5. `frontend/data/site-config.json`

然后运行：

```powershell
cd frontend
npm run lint
npm run build
```

确认当前基线通过后再改。
