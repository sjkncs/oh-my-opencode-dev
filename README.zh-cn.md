<div align="center">

<!-- Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=250&section=header&text=Oh%20My%20OpenCode%20Dev&fontSize=48&fontColor=fff&animation=twinkling&fontAlignY=38&desc=AI%20%E7%BC%96%E7%A8%8B%E5%8A%A9%E6%89%8B%20%E2%80%94%20%E6%A1%8C%E9%9D%A2%E7%AB%AF%20%2B%20%E6%8F%92%E4%BB%B6%20%7C%20%E8%B7%A8%E5%B9%B3%E5%8F%B0&descSize=18&descAlignY=55" width="100%" />

<!-- Badges -->
[![GitHub Stars](https://img.shields.io/github/stars/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=ffcb47)](https://github.com/sjkncs/oh-my-opencode-dev/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=8ae8ff)](https://github.com/sjkncs/oh-my-opencode-dev/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=ff80eb)](https://github.com/sjkncs/oh-my-opencode-dev/issues)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?style=for-the-badge&labelColor=0d1117)](LICENSE.md)

[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenCode](https://img.shields.io/badge/OpenCode-Plugin-6c5ce7?style=flat-square)](https://github.com/sst/opencode)

**[English](README.md)** | **[简体中文](README.zh-cn.md)** | **[한국어](README.ko.md)**

</div>

---

> **基于 [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) 的 Fork 与扩展，原作者 [@code-yeongyu](https://github.com/code-yeongyu)**
>
> 本项目在原有基础上新增了 **跨平台 Electron 桌面应用**，包含悬浮 AI 气泡、快捷操作面板、全局快捷键、语音输入、主题系统等功能。

---

## 本 Fork 的新增内容

<table>
<tr>
<td width="50%">

### 桌面应用（全新）

- **跨平台** — Windows / macOS / Linux
- **悬浮 AI 气泡** — 始终置顶的快捷入口
- **迷你快捷面板** — 翻译、总结、解释代码、修复代码
- **语音输入（ASR/TTS）** — Whisper API 集成
- **全局快捷键** — `Ctrl+Shift+Space` 切换面板
- **主题系统** — 浅色/深色/跟随系统，8种强调色，5种侧边栏配色
- **系统托盘** — 最小化到托盘，右键菜单
- **内置终端** — 跨平台 Shell
- **聊天记录** — 持久化对话历史，支持搜索

</td>
<td width="50%">

### 扩展与优化

- **i18n 多语言** — 简体中文 / English / 한국어 实时切换
- **Electron 桌面封装** — 原生应用体验
- **IPC 架构** — 安全的 contextBridge 通信
- **OpenCode SDK 集成** — 直连 API，流式传输
- **事件驱动流** — 实时 AI 响应显示
- **设置同步** — 主窗口与气泡共享设置
- **无障碍支持** — ARIA 属性、键盘导航
- **CSS 架构** — 工具类、Safari 兼容
- **CI/CD 流水线** — GitHub Actions 自动构建全平台
- **安全修复** — Electron 40.4.1，node-tar 漏洞已修复

</td>
</tr>
</table>

---

## 快速开始

### 桌面应用

```bash
cd desktop
npm install
npm start            # 开发模式
npm run build:win    # 构建 Windows 版
npm run build:mac    # 构建 macOS 版
npm run build:linux  # 构建 Linux 版
```

### 原始插件

```bash
# 让你的 AI 代理来安装：
# "按照以下说明安装 oh-my-opencode：https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md"
```

---

## 下载

预构建二进制文件可从 [GitHub Actions](https://github.com/sjkncs/oh-my-opencode-dev/actions) 产物中下载，或本地构建：

| 平台 | 格式 | 本地构建 | CI 构建 |
|---|---|---|---|
| **Windows** | NSIS 安装包 + Portable exe | `npm run build:win` | ✅ GitHub Actions |
| **macOS** | DMG + ZIP | `npm run build:mac` | ✅ GitHub Actions |
| **Linux** | AppImage + DEB | `npm run build:linux` | ✅ GitHub Actions |
| **快速测试** | 免安装文件夹 | `npm run build:dir` | — |

> **提示**：前往 [Actions → Build & Release](https://github.com/sjkncs/oh-my-opencode-dev/actions/workflows/build.yml) → 最新运行 → **Artifacts** 区域下载。

---

## 多语言支持 (i18n)

整个桌面应用 UI 支持 **3 种语言** 实时切换：

| 语言 | 代码 | 状态 |
|---|---|---|
| **简体中文** | `zh` | ✅ 默认 |
| **English** | `en` | ✅ 完整 |
| **한국어** | `ko` | ✅ 完整 |

**切换方法：** 设置 → 界面语言 → 选择语言 → 即时生效。

所有 UI 元素均已翻译：标题栏、侧边栏、欢迎页、各功能面板、输入区、气泡、右键菜单、设置模态框、终端。

---

## 桌面应用功能

### 悬浮 AI 气泡

| 操作 | 功能 |
|---|---|
| **单击** | 展开迷你快捷面板 |
| **拖拽** | 自由移动气泡（5px 阈值） |
| **右键** | 上下文菜单（面板 / 主窗口 / 设置 / 退出） |
| **Esc** | 关闭当前弹出层 |

### 全局快捷键

| 快捷键 | 功能 |
|---|---|
| `Ctrl+Shift+O` | 切换主窗口 |
| `Ctrl+Shift+B` | 切换气泡显示 |
| `Ctrl+Shift+Space` | 切换迷你快捷面板 |
| `Ctrl+Shift+Q` | 退出应用 |

### 快捷操作

| 按钮 | 功能 |
|---|---|
| **翻译** | 翻译选中文本 |
| **总结** | 总结内容 |
| **解释代码** | 解释代码片段 |
| **修复** | 修复代码问题 |
| **语音** | 通过 Whisper ASR 语音输入 |

### CI/CD — GitHub Actions 自动构建

所有平台通过 GitHub Actions 自动构建：

```yaml
# 触发方式：推送标签 (v*) 或手动 workflow_dispatch
# 构建：Windows (NSIS+Portable) / macOS (DMG+ZIP) / Linux (AppImage+DEB)
# 产物按平台上传供下载
```

发布新版本：

```bash
git tag v1.0.1
git push --tags   # 自动触发 Win/Mac/Linux 全平台构建
```

或手动触发：**Actions → Build & Release → Run workflow**

---

## 项目结构

```text
oh-my-opencode-dev/
├── src/                    # 原始插件源码 (TypeScript)
├── desktop/                # 新增：Electron 桌面应用
│   ├── main.js             # 主进程（IPC、快捷键、OpenCode SDK）
│   ├── preload.js          # 安全 IPC 桥接
│   ├── package.json        # 桌面端依赖 + 构建配置
│   └── renderer/
│       ├── index.html      # 主窗口 UI
│       ├── styles.css      # 主题系统
│       ├── app.js          # 应用逻辑
│       ├── i18n.js         # 国际化 (zh/en/ko)
│       └── bubble.html     # 悬浮气泡 + 迷你面板
├── .github/workflows/      # CI/CD (GitHub Actions)
├── docs/                   # 文档
├── packages/               # 平台二进制文件
├── bin/                    # CLI 入口
└── README.md               # 英文文档
```

---

## 原始插件功能

> 来自 [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) 的所有原始功能均已保留。

<details>
<summary><b>点击展开完整功能列表</b></summary>

- **代理**: Sisyphus (主代理), Prometheus (规划器), Oracle (调试), Librarian (文档), Explore (搜索), Hephaestus (深度工作者)
- **后台代理**: 并行运行多个代理
- **LSP & AST 工具**: 重构、重命名、诊断
- **上下文注入**: 自动注入 AGENTS.md、README.md
- **Claude Code 兼容**: 完整的 Hook 系统、命令、技能、MCP
- **内置 MCP**: websearch (Exa), context7 (文档), grep_app (GitHub 搜索)
- **会话工具**: 历史、搜索、分析
- **生产力**: Ralph Loop, Todo Enforcer, Comment Checker, Think Mode

详见原始 [功能文档](docs/features.md) 和 [配置文档](docs/configurations.md)。

</details>

---

## 致谢

<table>
<tr>
<td align="center" width="50%">

### 原始项目

<a href="https://github.com/code-yeongyu/oh-my-opencode">
<img src="https://img.shields.io/badge/Oh_My_OpenCode-原始项目-6c5ce7?style=for-the-badge&logo=github&logoColor=white" />
</a>

**[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)** — **[@code-yeongyu](https://github.com/code-yeongyu)**

最强 AI 代理工具 — 电池全配的 OpenCode 插件，多模型编排、并行后台代理、精心打造的 LSP/AST 工具。

*没有原作者构建的出色基础，就不会有这个 Fork。*

</td>
<td align="center" width="50%">

### OpenCode

<a href="https://github.com/sst/opencode">
<img src="https://img.shields.io/badge/OpenCode-核心平台-369eff?style=for-the-badge&logo=github&logoColor=white" />
</a>

**[OpenCode](https://github.com/sst/opencode)** — **[@sst](https://github.com/sst)**

让这一切成为可能的开源 AI 编程平台。

</td>
</tr>
</table>

### 特别感谢

- **[@code-yeongyu](https://github.com/code-yeongyu)** — Oh My OpenCode 原创作者，革命性的代理工具设计
- **[@junhoyeo](https://github.com/junhoyeo)** — 原项目精美的 Hero 图片
- **[@sst](https://github.com/sst)** — 构建和维护 OpenCode
- **开源社区** — 持续的反馈和贡献

---

## 安全

所有已知安全漏洞均已修复：

| 包名 | 问题 | 修复 |
|---|---|---|
| `electron` | ASAR 完整性绕过 (中等) | 升级到 **40.4.1** |
| `node-tar` | 路径穿越、符号链接注入、竞态条件 (3× 高危) | 通过 `electron-builder@26.7.0` 升级 |

`npm audit` → **0 漏洞**

---

## 贡献

欢迎贡献！请随时提交 Issue 和 Pull Request。

1. Fork 此仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

---

## 许可证

本项目继承原 Oh My OpenCode 项目的 [SUL-1.0 许可证](LICENSE.md)。

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%" />

**由 [@sjkncs](https://github.com/sjkncs) 用热情构建**

*站在巨人的肩膀上*

[![GitHub](https://img.shields.io/badge/GitHub-sjkncs-181717?style=for-the-badge&logo=github)](https://github.com/sjkncs)

</div>
