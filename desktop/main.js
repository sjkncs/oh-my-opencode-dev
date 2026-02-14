const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage, dialog, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow = null;
let bubbleWindow = null;
let tray = null;
let isQuitting = false;

// Data directory for persistent storage
const DATA_DIR = path.join(app.getPath('userData'), 'oh-my-opencode-data');
const HISTORY_FILE = path.join(DATA_DIR, 'chat-history.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function ensureDataDirs() {
  [DATA_DIR, UPLOADS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

// Window size configurations
const MAIN_WINDOW_CONFIG = {
  width: 1100,
  height: 750,
  minWidth: 800,
  minHeight: 550,
};

const BUBBLE_CONFIG = {
  width: 60,
  height: 60,
};

function createMainWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  mainWindow = new BrowserWindow({
    width: MAIN_WINDOW_CONFIG.width,
    height: MAIN_WINDOW_CONFIG.height,
    minWidth: MAIN_WINDOW_CONFIG.minWidth,
    minHeight: MAIN_WINDOW_CONFIG.minHeight,
    x: Math.round(workArea.x + (workArea.width - MAIN_WINDOW_CONFIG.width) / 2),
    y: Math.round(workArea.y + (workArea.height - MAIN_WINDOW_CONFIG.height) / 2),
    frame: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    show: false,
    backgroundColor: '#f7f8fa',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      if (!bubbleWindow || bubbleWindow.isDestroyed()) {
        createBubbleWindow();
      }
      bubbleWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Maximize / unmaximize events
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximized', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximized', false);
  });
}

function createBubbleWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  bubbleWindow = new BrowserWindow({
    width: BUBBLE_CONFIG.width,
    height: BUBBLE_CONFIG.height,
    x: workArea.x + workArea.width - BUBBLE_CONFIG.width - 20,
    y: workArea.y + workArea.height / 2 - BUBBLE_CONFIG.height / 2,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  bubbleWindow.loadFile(path.join(__dirname, 'renderer', 'bubble.html'));
  bubbleWindow.setIgnoreMouseEvents(false);

  bubbleWindow.on('closed', () => {
    bubbleWindow = null;
  });
}

// Bubble window resize for context menu / settings
let bubbleOriginalBounds = null;

ipcMain.on('bubble-expand-menu', () => {
  if (!bubbleWindow || bubbleWindow.isDestroyed()) return;
  if (!bubbleOriginalBounds) bubbleOriginalBounds = bubbleWindow.getBounds();
  const b = bubbleOriginalBounds;
  bubbleWindow.focus();
  bubbleWindow.setBounds({ x: b.x - 140, y: b.y - 10, width: 220, height: 220 }, true);
});

ipcMain.on('bubble-expand-panel', () => {
  if (!bubbleWindow || bubbleWindow.isDestroyed()) return;
  if (!bubbleOriginalBounds) bubbleOriginalBounds = bubbleWindow.getBounds();
  const b = bubbleOriginalBounds;
  bubbleWindow.focus();
  bubbleWindow.setBounds({ x: b.x - 340, y: b.y - 340, width: 400, height: 420 }, true);
});

ipcMain.on('bubble-expand-settings', () => {
  if (!bubbleWindow || bubbleWindow.isDestroyed()) return;
  if (!bubbleOriginalBounds) bubbleOriginalBounds = bubbleWindow.getBounds();
  const b = bubbleOriginalBounds;
  bubbleWindow.focus();
  bubbleWindow.setBounds({ x: b.x - 390, y: b.y - 260, width: 460, height: 580 }, true);
});

ipcMain.on('bubble-shrink', () => {
  if (!bubbleWindow || bubbleWindow.isDestroyed()) return;
  if (bubbleOriginalBounds) {
    bubbleWindow.setBounds(bubbleOriginalBounds, true);
    bubbleOriginalBounds = null;
  }
});

// Bubble quick-chat — lightweight AI query from bubble
ipcMain.handle('bubble-quick-chat', async (_, message) => {
  try {
    const client = await ensureOpenCodeConnection();
    if (!client) return { error: '未连接到 OpenCode 服务器，请先启动 opencode' };
    const sessionId = await getOrCreateSession();
    if (!sessionId) return { error: '无法创建会话' };
    const res = await client.session.chat({
      path: { id: sessionId },
      body: { parts: [{ type: 'text', text: message }] },
    });
    if (res?.data?.parts) {
      const text = res.data.parts.filter(p => p.type === 'text').map(p => p.text).join('\n');
      return { text: text || '(无回复)' };
    }
    return { text: '(无回复)' };
  } catch (e) {
    return { error: e.message || '请求失败' };
  }
});

// Bubble drag — renderer sends delta to move window
ipcMain.on('bubble-drag', (_, deltaX, deltaY) => {
  if (!bubbleWindow || bubbleWindow.isDestroyed()) return;
  const pos = bubbleWindow.getPosition();
  bubbleWindow.setPosition(pos[0] + deltaX, pos[1] + deltaY);
});

function createTray() {
  const trayIconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  try {
    tray = new Tray(trayIconPath);
  } catch {
    const img = nativeImage.createFromBuffer(Buffer.alloc(64), { width: 16, height: 16 });
    tray = new Tray(img);
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示主窗口', click: () => showMainWindow() },
    { label: '显示悬浮气泡', click: () => { if (!bubbleWindow || bubbleWindow.isDestroyed()) createBubbleWindow(); bubbleWindow.show(); } },
    { type: 'separator' },
    { label: '退出', click: () => { isQuitting = true; app.quit(); } },
  ]);

  tray.setToolTip('Oh My OpenCode');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => showMainWindow());
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
  if (bubbleWindow && !bubbleWindow.isDestroyed()) bubbleWindow.hide();
}

// ─── Persistent Storage ──────────────────────────────────────────────
function loadJSON(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {}
  return fallback;
}

function saveJSON(filePath, data) {
  try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8'); } catch {}
}

// ─── IPC: Window Controls ────────────────────────────────────────────
ipcMain.on('minimize-window', () => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize(); });
ipcMain.on('maximize-window', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  }
});
ipcMain.on('close-window', () => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close(); });
ipcMain.on('toggle-always-on-top', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const v = !mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(v);
    mainWindow.webContents.send('always-on-top-changed', v);
  }
});
ipcMain.on('show-main-from-bubble', () => showMainWindow());

// ─── IPC: Chat History ───────────────────────────────────────────────
ipcMain.handle('load-history', () => loadJSON(HISTORY_FILE, { conversations: [], activeId: null }));
ipcMain.handle('save-history', (_, data) => { saveJSON(HISTORY_FILE, data); return true; });

// ─── IPC: Settings ───────────────────────────────────────────────────
ipcMain.handle('load-settings', () => loadJSON(SETTINGS_FILE, { model: 'GPT-4o', theme: 'light', alwaysOnTop: false }));
ipcMain.handle('save-settings', (_, data) => { saveJSON(SETTINGS_FILE, data); return true; });

// ─── IPC: File Upload ────────────────────────────────────────────────
ipcMain.handle('open-file-dialog', async (_, opts) => {
  const filters = [];
  const type = opts?.type || 'all';
  if (type === 'image') filters.push({ name: '图片', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'] });
  else if (type === 'document') filters.push({ name: '文档', extensions: ['txt', 'pdf', 'doc', 'docx', 'md', 'csv', 'json', 'xml', 'yaml', 'yml'] });
  else if (type === 'code') filters.push({ name: '代码', extensions: ['js', 'ts', 'py', 'java', 'c', 'cpp', 'go', 'rs', 'rb', 'php', 'html', 'css', 'sql', 'sh'] });
  else filters.push({ name: '所有文件', extensions: ['*'] });

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters,
  });

  if (result.canceled) return [];

  const files = [];
  for (const filePath of result.filePaths) {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'].includes(ext);
    const isCode = ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.go', '.rs', '.rb', '.php', '.html', '.css', '.sql', '.sh', '.json', '.yaml', '.yml', '.xml', '.md'].includes(ext);

    let content = null;
    let base64 = null;
    if (isImage) {
      const buf = fs.readFileSync(filePath);
      base64 = `data:image/${ext.slice(1)};base64,${buf.toString('base64')}`;
    } else if (stat.size < 5 * 1024 * 1024) {
      content = fs.readFileSync(filePath, 'utf-8');
    }

    // Copy file to uploads dir
    const destName = `${Date.now()}-${path.basename(filePath)}`;
    const destPath = path.join(UPLOADS_DIR, destName);
    fs.copyFileSync(filePath, destPath);

    files.push({
      name: path.basename(filePath),
      path: destPath,
      ext,
      size: stat.size,
      isImage,
      isCode,
      content,
      base64,
    });
  }
  return files;
});

// ─── IPC: Read file content ──────────────────────────────────────────
ipcMain.handle('read-file', async (_, filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'].includes(ext);
    if (isImage) {
      const buf = fs.readFileSync(filePath);
      return { base64: `data:image/${ext.slice(1)};base64,${buf.toString('base64')}` };
    }
    return { content: fs.readFileSync(filePath, 'utf-8') };
  } catch (e) {
    return { error: e.message };
  }
});

// ─── IPC: OpenCode AI ────────────────────────────────────────────────
let ocClient = null;
let ocServer = null;
let ocSessionID = null;
let ocAbort = null;
let ocConnecting = false;

async function ensureOpenCodeConnection() {
  if (ocClient) return ocClient;
  if (ocConnecting) {
    while (ocConnecting) await new Promise(r => setTimeout(r, 100));
    return ocClient;
  }
  ocConnecting = true;
  try {
    const sdk = await import('@opencode-ai/sdk');
    const createOpencodeClient = sdk.createOpencodeClient || sdk.default?.createOpencodeClient;
    if (!createOpencodeClient) {
      console.error('[OpenCode] SDK missing createOpencodeClient');
      return null;
    }

    // Scan common ports for a running OpenCode server
    const ports = [4096, 4097, 4098, 4099, 4100];
    for (const port of ports) {
      try {
        const testClient = createOpencodeClient({ baseUrl: `http://127.0.0.1:${port}` });
        const res = await Promise.race([
          testClient.session.list(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2000)),
        ]);
        if (!res.error) {
          ocClient = testClient;
          console.log('[OpenCode] Connected to server on port', port);
          return ocClient;
        }
      } catch { /* not on this port */ }
    }
    console.log('[OpenCode] No running server found. Please start opencode first.');
    return null;
  } catch (e) {
    console.error('[OpenCode] SDK load error:', e.message);
    return null;
  } finally {
    ocConnecting = false;
  }
}

async function getOrCreateSession() {
  if (!ocClient) return null;
  if (ocSessionID) return ocSessionID;

  try {
    const res = await ocClient.session.create({
      body: { title: 'Oh My OpenCode Desktop' },
    });
    if (res.data?.id) {
      ocSessionID = res.data.id;
      console.log('[OpenCode] Session created:', ocSessionID);
      return ocSessionID;
    }
  } catch (e) {
    console.error('[OpenCode] Session create error:', e.message);
  }
  return null;
}

ipcMain.handle('opencode-connect', async () => {
  const client = await ensureOpenCodeConnection();
  return { connected: !!client };
});

ipcMain.handle('opencode-new-session', async () => {
  ocSessionID = null; // force new session
  const sid = await getOrCreateSession();
  return { sessionID: sid };
});

ipcMain.handle('opencode-send', async (_, { message, sessionID, agent }) => {
  try {
    const client = await ensureOpenCodeConnection();
    if (!client) {
      return { error: 'OpenCode server not connected. Run `opencode` in terminal first, or check your installation.' };
    }

    const sid = sessionID || await getOrCreateSession();
    if (!sid) {
      return { error: 'Failed to create session' };
    }

    // Subscribe to events BEFORE sending prompt
    const directory = process.cwd();
    let events;
    try {
      events = await client.event.subscribe({ query: { directory } });
    } catch (e) {
      console.error('[OpenCode] Event subscribe error:', e.message);
    }

    // Send prompt
    await client.session.promptAsync({
      path: { id: sid },
      body: {
        agent: agent || undefined,
        parts: [{ type: 'text', text: message }],
      },
      query: { directory },
    });

    // Process event stream - collect full response
    let fullText = '';
    let done = false;
    const streamAbort = new AbortController();

    if (events && events.stream) {
      const timeout = setTimeout(() => { streamAbort.abort(); }, 120000); // 2min timeout

      try {
        for await (const event of events.stream) {
          if (streamAbort.signal.aborted) break;
          const payload = event;
          if (!payload?.type) continue;

          if (payload.type === 'message.part.updated') {
            const props = payload.properties;
            if (props?.info?.sessionID !== sid) continue;
            if (props?.info?.role !== 'assistant') continue;
            const part = props.part;
            if (part?.type === 'text' && part.text) {
              const newText = part.text.slice(fullText.length);
              if (newText && mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('opencode-stream', { text: newText, partial: part.text });
              }
              fullText = part.text;
            }
          }

          if (payload.type === 'session.idle') {
            const props = payload.properties;
            if (props?.sessionID === sid) { done = true; break; }
          }

          if (payload.type === 'session.status') {
            const props = payload.properties;
            if (props?.sessionID === sid && props?.status?.type === 'idle') {
              done = true; break;
            }
          }

          if (payload.type === 'session.error') {
            const props = payload.properties;
            if (props?.sessionID === sid) {
              return { error: `AI error: ${JSON.stringify(props.error)}`, sessionID: sid };
            }
          }

          if (payload.type === 'tool.execute') {
            const props = payload.properties;
            if (props?.sessionID === sid && mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('opencode-tool', { name: props.name, input: props.input });
            }
          }
        }
      } catch (e) {
        if (e.name !== 'AbortError') console.error('[OpenCode] Stream error:', e.message);
      }
      clearTimeout(timeout);
    }

    // If no event stream, fallback: poll for messages
    if (!fullText && !events) {
      await new Promise(r => setTimeout(r, 3000));
      try {
        const msgs = await client.session.messages({ path: { id: sid } });
        if (msgs.data) {
          const assistantMsgs = msgs.data.filter(m => m.role === 'assistant');
          const last = assistantMsgs[assistantMsgs.length - 1];
          if (last?.parts) {
            fullText = last.parts.filter(p => p.type === 'text').map(p => p.text).join('\n');
          }
        }
      } catch {}
    }

    return { text: fullText || '(No response received)', sessionID: sid };
  } catch (e) {
    console.error('[OpenCode] Send error:', e.message);
    return { error: e.message };
  }
});

// ─── IPC: Terminal ───────────────────────────────────────────────────
let terminalProcess = null;

ipcMain.on('terminal-input', (_, data) => {
  if (terminalProcess && !terminalProcess.killed) terminalProcess.stdin.write(data);
});

ipcMain.on('start-terminal', () => {
  if (terminalProcess && !terminalProcess.killed) terminalProcess.kill();

  const shell = process.platform === 'win32' ? 'powershell.exe' : '/bin/bash';
  const args = process.platform === 'win32' ? ['-NoLogo', '-NoProfile'] : [];

  terminalProcess = spawn(shell, args, {
    env: { ...process.env, TERM: 'xterm-256color' },
    cwd: process.env.HOME || process.env.USERPROFILE,
  });

  terminalProcess.stdout.on('data', (d) => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('terminal-output', d.toString()); });
  terminalProcess.stderr.on('data', (d) => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('terminal-output', d.toString()); });
  terminalProcess.on('close', (code) => { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('terminal-exit', code); });
});

// ─── IPC: ASR / TTS (Voice) ──────────────────────────────────────────
function loadVoiceSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const s = JSON.parse(raw);
    return {
      apiBase: s.voiceApiBase || 'https://api.openai.com/v1',
      apiKey: s.voiceApiKey || '',
      asrModel: s.asrModel || 'whisper-1',
      ttsModel: s.ttsModel || 'tts-1',
      ttsVoice: s.ttsVoice || 'alloy',
    };
  } catch { return { apiBase: 'https://api.openai.com/v1', apiKey: '', asrModel: 'whisper-1', ttsModel: 'tts-1', ttsVoice: 'alloy' }; }
}

// ASR: audio buffer → text
ipcMain.handle('speech-to-text', async (_, audioBuffer) => {
  const vs = loadVoiceSettings();
  if (!vs.apiKey) return { error: '请在设置中配置语音 API Key' };
  try {
    const boundary = '----FormBoundary' + Date.now().toString(36);
    const buf = Buffer.from(audioBuffer);
    const parts = [];
    // file part
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="audio.webm"\r\nContent-Type: audio/webm\r\n\r\n`));
    parts.push(buf);
    parts.push(Buffer.from('\r\n'));
    // model part
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${vs.asrModel}\r\n`));
    // language part (optional, helps accuracy)
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\nzh\r\n`));
    parts.push(Buffer.from(`--${boundary}--\r\n`));
    const body = Buffer.concat(parts);

    const url = `${vs.apiBase.replace(/\/$/, '')}/audio/transcriptions`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vs.apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[ASR] API error:', resp.status, errText);
      return { error: `ASR API 错误 (${resp.status}): ${errText.slice(0, 200)}` };
    }
    const data = await resp.json();
    return { text: data.text || '' };
  } catch (e) {
    console.error('[ASR] Error:', e.message);
    return { error: `ASR 请求失败: ${e.message}` };
  }
});

// TTS: text → audio buffer
ipcMain.handle('text-to-speech', async (_, text) => {
  const vs = loadVoiceSettings();
  if (!vs.apiKey) return { error: '请在设置中配置语音 API Key' };
  try {
    const url = `${vs.apiBase.replace(/\/$/, '')}/audio/speech`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vs.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: vs.ttsModel,
        input: text.slice(0, 4096),
        voice: vs.ttsVoice,
        response_format: 'mp3',
      }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error('[TTS] API error:', resp.status, errText);
      return { error: `TTS API 错误 (${resp.status}): ${errText.slice(0, 200)}` };
    }
    const arrayBuf = await resp.arrayBuffer();
    return { audio: Buffer.from(arrayBuf).toString('base64'), format: 'mp3' };
  } catch (e) {
    console.error('[TTS] Error:', e.message);
    return { error: `TTS 请求失败: ${e.message}` };
  }
});

// ─── App Lifecycle ───────────────────────────────────────────────────
app.whenReady().then(() => {
  ensureDataDirs();
  createTray();
  createMainWindow();

  // ── Global Shortcuts ──
  globalShortcut.register('CommandOrControl+Shift+O', () => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) {
      mainWindow.hide();
      if (!bubbleWindow || bubbleWindow.isDestroyed()) createBubbleWindow();
      bubbleWindow.show();
    } else {
      showMainWindow();
    }
  });

  globalShortcut.register('CommandOrControl+Shift+B', () => {
    if (bubbleWindow && !bubbleWindow.isDestroyed() && bubbleWindow.isVisible()) {
      bubbleWindow.hide();
    } else {
      if (!bubbleWindow || bubbleWindow.isDestroyed()) createBubbleWindow();
      bubbleWindow.show();
    }
  });

  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (!bubbleWindow || bubbleWindow.isDestroyed()) createBubbleWindow();
    if (!bubbleWindow.isVisible()) bubbleWindow.show();
    bubbleWindow.webContents.send('toggle-panel');
  });

  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    isQuitting = true;
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {});

app.on('before-quit', () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
  if (terminalProcess && !terminalProcess.killed) terminalProcess.kill();
  if (ocAbort) ocAbort.abort();
  if (ocServer) { try { ocServer.close(); } catch {} }
});
