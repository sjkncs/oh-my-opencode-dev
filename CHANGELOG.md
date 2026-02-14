# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-02-14

### Added — Multi-Language Support (i18n)

- **i18n module** (`desktop/renderer/i18n.js`) — complete translation system with 150+ keys
- **3 languages** — 简体中文 (default), English, 한국어
- **Real-time switching** — language selector in Settings → Interface Language → instant apply
- **Full coverage** — titlebar, sidebar, welcome screen, feature cards, input toolbar, bubble panel, context menus, settings modal, terminal modal
- **`data-i18n` attributes** — all translatable elements in `index.html` and `bubble.html` tagged for dynamic DOM replacement
- **Persistent preference** — language choice saved to settings and restored on app launch

### Added — CI/CD Pipeline

- **GitHub Actions workflow** (`.github/workflows/build.yml`) — auto-build for all 3 platforms
- **Triggers** — push tags (`v*`) or manual `workflow_dispatch`
- **Parallel matrix** — Windows (NSIS + Portable), macOS (DMG + ZIP), Linux (AppImage + DEB)
- **Artifact upload** — downloadable per-platform from Actions page
- **`fail-fast: false`** — all platforms build independently even if one fails

### Fixed — Security Vulnerabilities

- **Electron** upgraded to **40.4.1** — fixes ASAR Integrity Bypass (GHSA-vmqv-hx8q-j7mg, Moderate)
- **electron-builder** upgraded to **26.7.0** — fixes node-tar vulnerabilities:
  - Path Traversal via insufficient path sanitization (GHSA-8qq5-rm4j-mr97, High)
  - Race Condition via Unicode Ligature Collisions on macOS APFS (GHSA-r6q2-hw4h-h46w, High)
  - Arbitrary File Creation via Hardlink Path Traversal (GHSA-34x7-hfp2-rc4v, High)
- `npm audit` → **0 vulnerabilities**

### Changed — Documentation & Structure

- **README.md / README.zh-cn.md / README.ko.md** — added Downloads, i18n, CI/CD, Security sections
- **Docs reorganized** — moved `AGENTS.md`, `CLA.md`, `CONTRIBUTING.md`, `README.original.md`, `README.ja.md`, `issue-1501-analysis.md`, `sisyphus-prompt.md` into `docs/` folder
- **Icon resized** to 512×512 for macOS build compatibility
- **`package.json`** — added `author.email`, `homepage` for Linux DEB package metadata

---

## [1.0.0] - 2025-02-14

### Added — Desktop Application (Electron)

- **Cross-platform desktop app** — Windows, macOS, Linux support via Electron
- **Floating AI Bubble** — always-on-top draggable bubble with JS-based drag (no CSS app-region)
- **Mini Quick-Action Panel** — single-click bubble to expand chat input + quick actions (translate, summarize, explain code, fix code)
- **Voice Input/Output** — ASR via Whisper API (MediaRecorder + IPC), TTS with configurable voice
- **Global Shortcuts** — `Ctrl+Shift+O` (main window), `Ctrl+Shift+B` (bubble), `Ctrl+Shift+Space` (mini panel), `Ctrl+Shift+Q` (quit)
- **Theme System** — light/dark/system mode, 8 accent colors, 5 sidebar color schemes
- **Main Window UI** — full chat interface with sidebar, conversation management, file upload, code/image panels
- **OpenCode SDK Integration** — direct connection to local OpenCode server with event-driven streaming
- **System Tray** — minimize to tray, context menu with quick actions
- **Built-in Terminal** — cross-platform shell (PowerShell on Windows, bash on Linux/macOS)
- **Persistent Storage** — chat history, settings, uploads stored in `userData`
- **Multi-format Build** — NSIS installer, Portable exe, DMG, ZIP, AppImage, DEB

### Added — Documentation

- **README.md** — English with GitHub badges, capsule-render header, shields.io badges
- **README.zh-cn.md** — Chinese translation
- **README.ko.md** — Korean translation
- **desktop/README.md** — Desktop app specific documentation
- **CHANGELOG.md** — This file
- **Acknowledgments** — Credits to original author [@code-yeongyu](https://github.com/code-yeongyu) and [@sst](https://github.com/sst)

### Improved

- **Accessibility** — added `title` attributes to form elements, ARIA support
- **CSS Architecture** — `.hidden` utility class replacing inline `style="display:none"`, `-webkit-backdrop-filter` Safari prefix
- **IPC Security** — contextBridge with contextIsolation, no nodeIntegration
- **Settings Sync** — shared settings between main window and bubble via persistent JSON

### Inherited from Original

- All original Oh My OpenCode plugin features (agents, LSP, MCPs, hooks, etc.)
- See [original README](README.original.md) for the full upstream feature set
