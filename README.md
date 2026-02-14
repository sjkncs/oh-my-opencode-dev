<div align="center">

<!-- Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=250&section=header&text=Oh%20My%20OpenCode%20Dev&fontSize=48&fontColor=fff&animation=twinkling&fontAlignY=38&desc=AI%20Coding%20Assistant%20%E2%80%94%20Desktop%20%2B%20Plugin%20%7C%20Cross-Platform&descSize=18&descAlignY=55" width="100%" />

<!-- Badges -->
[![GitHub Stars](https://img.shields.io/github/stars/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=ffcb47)](https://github.com/sjkncs/oh-my-opencode-dev/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=8ae8ff)](https://github.com/sjkncs/oh-my-opencode-dev/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/sjkncs/oh-my-opencode-dev?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117&color=ff80eb)](https://github.com/sjkncs/oh-my-opencode-dev/issues)
[![License](https://img.shields.io/badge/license-SUL--1.0-white?style=for-the-badge&labelColor=0d1117)](LICENSE.md)

<!-- Tech Stack Badges -->
[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenCode](https://img.shields.io/badge/OpenCode-Plugin-6c5ce7?style=flat-square)](https://github.com/sst/opencode)

<!-- Language Switcher -->
**[English](README.md)** | **[简体中文](README.zh-cn.md)** | **[한국어](README.ko.md)**

</div>

---

> **Fork & Extension of [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) by [@code-yeongyu](https://github.com/code-yeongyu)**
>
> This project extends the original with a **cross-platform Electron desktop application**, featuring a floating AI bubble, quick-action panel, global hotkeys, voice input, theming system, and more.

---

## What's New in This Fork

<table>
<tr>
<td width="50%">

### Desktop Application (NEW)
- **Cross-platform** — Windows / macOS / Linux
- **Floating AI Bubble** — always-on-top quick access
- **Mini Quick-Action Panel** — translate, summarize, explain code, fix code
- **Voice Input (ASR/TTS)** — Whisper API integration
- **Global Hotkeys** — `Ctrl+Shift+Space` toggle panel
- **Theme System** — light/dark/system, 8 accent colors, 5 sidebar colors
- **System Tray** — minimize to tray, context menu
- **Built-in Terminal** — cross-platform shell
- **Chat History** — persistent conversations with search

</td>
<td width="50%">

### Extensions & Optimizations
- **Electron Desktop Wrapper** — native app experience
- **IPC Architecture** — secure contextBridge communication
- **OpenCode SDK Integration** — direct API connection with streaming
- **Event-driven Streaming** — real-time AI response display
- **Settings Sync** — shared between main window and bubble
- **Accessibility** — proper ARIA attributes, keyboard navigation
- **CSS Architecture** — utility classes, Safari compatibility
- **Multi-format Build** — NSIS, Portable, DMG, AppImage, DEB

</td>
</tr>
</table>

---

## Quick Start

### Desktop App

```bash
cd desktop
npm install
npm start          # Development
npm run build:win  # Build for Windows
npm run build:mac  # Build for macOS
npm run build:linux # Build for Linux
```

### Original Plugin

```bash
# Let your AI agent install it:
# "Install oh-my-opencode following: https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md"
```

---

## Desktop App Features

### Floating AI Bubble

| Action | Function |
|---|---|
| **Single Click** | Expand mini quick-action panel |
| **Drag** | Move bubble freely (5px threshold) |
| **Right Click** | Context menu (panel / main window / settings / quit) |
| **Esc** | Close current overlay |

### Global Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+O` | Toggle main window |
| `Ctrl+Shift+B` | Toggle bubble visibility |
| `Ctrl+Shift+Space` | Toggle mini quick-action panel |
| `Ctrl+Shift+Q` | Quit application |

### Quick Actions

| Button | Function |
|---|---|
| **Translate** | Translate selected text |
| **Summarize** | Summarize content |
| **Explain Code** | Explain code snippets |
| **Fix Code** | Fix code issues |
| **Voice** | Voice input via Whisper ASR |

### Build Targets

| Platform | Format | Command |
|---|---|---|
| **Windows** | NSIS + Portable exe | `npm run build:win` |
| **macOS** | DMG + ZIP | `npm run build:mac` |
| **Linux** | AppImage + DEB | `npm run build:linux` |
| **Quick Test** | Unpacked folder | `npm run build:dir` |

---

## Project Structure

```
oh-my-opencode-dev/
├── src/                    # Original plugin source (TypeScript)
├── desktop/                # NEW: Electron desktop application
│   ├── main.js             # Main process (IPC, shortcuts, OpenCode SDK)
│   ├── preload.js          # Secure IPC bridge
│   ├── package.json        # Desktop dependencies + build config
│   └── renderer/
│       ├── index.html      # Main window UI
│       ├── styles.css      # Theming system
│       ├── app.js          # Application logic
│       └── bubble.html     # Floating bubble + mini panel
├── docs/                   # Documentation
├── packages/               # Platform binaries
├── bin/                    # CLI entry point
└── README.md               # This file
```

---

## Original Plugin Features

> All original features from [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode) are preserved.

<details>
<summary><b>Click to expand full feature list</b></summary>

- **Agents**: Sisyphus (main), Prometheus (planner), Oracle (debugging), Librarian (docs), Explore (grep), Hephaestus (deep worker)
- **Background Agents**: Run multiple agents in parallel
- **LSP & AST Tools**: Refactoring, rename, diagnostics
- **Context Injection**: Auto-inject AGENTS.md, README.md
- **Claude Code Compatibility**: Full hook system, commands, skills, MCPs
- **Built-in MCPs**: websearch (Exa), context7 (docs), grep_app (GitHub search)
- **Session Tools**: History, search, analysis
- **Productivity**: Ralph Loop, Todo Enforcer, Comment Checker, Think Mode
- **Configuration**: JSONC support, per-agent overrides, categories, hooks

See the original [Features Documentation](docs/features.md) and [Configuration Documentation](docs/configurations.md).

</details>

---

## Acknowledgments

<table>
<tr>
<td align="center" width="50%">

### Original Project

<a href="https://github.com/code-yeongyu/oh-my-opencode">
<img src="https://img.shields.io/badge/Oh_My_OpenCode-Original-6c5ce7?style=for-the-badge&logo=github&logoColor=white" />
</a>

**[Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode)** by **[@code-yeongyu](https://github.com/code-yeongyu)**

The best AI agent harness — batteries-included OpenCode plugin with multi-model orchestration, parallel background agents, and crafted LSP/AST tools.

*This fork would not exist without the incredible foundation built by the original author.*

</td>
<td align="center" width="50%">

### OpenCode

<a href="https://github.com/sst/opencode">
<img src="https://img.shields.io/badge/OpenCode-Core_Platform-369eff?style=for-the-badge&logo=github&logoColor=white" />
</a>

**[OpenCode](https://github.com/sst/opencode)** by **[@sst](https://github.com/sst)**

The open-source AI coding platform that makes all of this possible.

</td>
</tr>
</table>

### Special Thanks

- **[@code-yeongyu](https://github.com/code-yeongyu)** — Original oh-my-opencode creator, for the revolutionary agent harness design
- **[@junhoyeo](https://github.com/junhoyeo)** — For the amazing hero image in the original project
- **[@sst](https://github.com/sst)** — For building and maintaining OpenCode
- **The open-source community** — For continuous feedback and contributions

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project inherits the [SUL-1.0 License](LICENSE.md) from the original Oh My OpenCode project.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%" />

**Built with passion by [@sjkncs](https://github.com/sjkncs)**

*Standing on the shoulders of giants*

[![GitHub](https://img.shields.io/badge/GitHub-sjkncs-181717?style=for-the-badge&logo=github)](https://github.com/sjkncs)

</div>
