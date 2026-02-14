const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top'),
  showMainFromBubble: () => ipcRenderer.send('show-main-from-bubble'),

  // Chat history persistence
  loadHistory: () => ipcRenderer.invoke('load-history'),
  saveHistory: (data) => ipcRenderer.invoke('save-history', data),

  // Settings persistence
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (data) => ipcRenderer.invoke('save-settings', data),

  // File upload
  openFileDialog: (opts) => ipcRenderer.invoke('open-file-dialog', opts),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

  // Terminal
  startTerminal: () => ipcRenderer.send('start-terminal'),
  sendTerminalInput: (data) => ipcRenderer.send('terminal-input', data),
  onTerminalOutput: (cb) => ipcRenderer.on('terminal-output', (_, d) => cb(d)),
  onTerminalExit: (cb) => ipcRenderer.on('terminal-exit', (_, c) => cb(c)),

  // OpenCode AI
  opencodeConnect: () => ipcRenderer.invoke('opencode-connect'),
  opencodeNewSession: () => ipcRenderer.invoke('opencode-new-session'),
  opencodeSend: (opts) => ipcRenderer.invoke('opencode-send', opts),
  onOpencodeStream: (cb) => ipcRenderer.on('opencode-stream', (_, d) => cb(d)),
  onOpencodeTool: (cb) => ipcRenderer.on('opencode-tool', (_, d) => cb(d)),

  // Voice (ASR / TTS)
  speechToText: (audioBuffer) => ipcRenderer.invoke('speech-to-text', audioBuffer),
  textToSpeech: (text) => ipcRenderer.invoke('text-to-speech', text),

  // Bubble resize & drag
  bubbleExpandMenu: () => ipcRenderer.send('bubble-expand-menu'),
  bubbleExpandPanel: () => ipcRenderer.send('bubble-expand-panel'),
  bubbleExpandSettings: () => ipcRenderer.send('bubble-expand-settings'),
  bubbleShrink: () => ipcRenderer.send('bubble-shrink'),
  bubbleDrag: (dx, dy) => ipcRenderer.send('bubble-drag', dx, dy),
  bubbleQuickChat: (msg) => ipcRenderer.invoke('bubble-quick-chat', msg),

  // Events
  onAlwaysOnTopChanged: (cb) => ipcRenderer.on('always-on-top-changed', (_, v) => cb(v)),
  onWindowMaximized: (cb) => ipcRenderer.on('window-maximized', (_, v) => cb(v)),
  onTogglePanel: (cb) => ipcRenderer.on('toggle-panel', () => cb()),
});
