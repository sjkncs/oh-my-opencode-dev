# Oh My OpenCode — Desktop App

> Cross-platform Electron desktop application for Oh My OpenCode

See the [main README](../../README.md) for the full project overview.

## Quick Start

```bash
cd desktop
npm install
npm start
```

## Build

| Platform | Command | Output |
|---|---|---|
| Windows | `npm run build:win` | NSIS installer + Portable exe |
| macOS | `npm run build:mac` | DMG + ZIP |
| Linux | `npm run build:linux` | AppImage + DEB |
| Quick Test | `npm run build:dir` | Unpacked folder |

## Architecture

```
desktop/
├── main.js          # Electron main process
├── preload.js       # IPC bridge (contextBridge)
├── package.json     # Dependencies + build config
├── renderer/
│   ├── index.html   # Main window UI
│   ├── styles.css   # Theming + layout
│   ├── app.js       # Application logic
│   └── bubble.html  # Floating bubble + mini panel
└── assets/
    ├── icon.png     # App icon (auto-converted per platform)
    └── tray-icon.png
```

## Features

See the main README for the complete feature list.
