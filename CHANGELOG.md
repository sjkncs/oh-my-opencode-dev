# Changelog

All notable changes to this project will be documented in this file.

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
