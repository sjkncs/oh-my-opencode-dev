// ═══════════════════════════════════════════════════════════════════
//  Oh My OpenCode Desktop – Renderer Application
// ═══════════════════════════════════════════════════════════════════

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ─── State ───────────────────────────────────────────────────────
let state = {
  conversations: [],
  activeId: null,
  pendingFiles: [],         // files attached to current input
  settings: { model: 'GPT-4o', theme: 'light', alwaysOnTop: false },
  sidebarOpen: true,
  activeTools: new Set(),
  ocConnected: false,       // OpenCode server connected
  ocSessionID: null,        // current OpenCode session
  sending: false,           // prevent double-sends
};

// ─── Init ────────────────────────────────────────────────────────
(async function init() {
  const history = await window.electronAPI.loadHistory();
  state.conversations = history.conversations || [];
  state.activeId = history.activeId;
  const settings = await window.electronAPI.loadSettings();
  Object.assign(state.settings, settings);

  applyTheme();
  I18N.init(state.settings.language || 'zh');
  if ($('#settingLanguage')) $('#settingLanguage').value = I18N.lang;
  $('#currentModel').textContent = state.settings.model;
  renderConversationList();
  if (state.activeId) loadConversation(state.activeId);

  // Auto-connect to OpenCode server
  connectToOpenCode();
})();

async function connectToOpenCode() {
  try {
    const res = await window.electronAPI.opencodeConnect();
    state.ocConnected = !!res?.connected;
    if (state.ocConnected) {
      console.log('[OpenCode] Connected to server');
      // Create a session
      const sRes = await window.electronAPI.opencodeNewSession();
      state.ocSessionID = sRes?.sessionID || null;
    }
  } catch (e) {
    console.warn('[OpenCode] Connection failed, using fallback mode:', e);
    state.ocConnected = false;
  }
}

// Listen for streaming AI text from OpenCode
window.electronAPI.onOpencodeStream((data) => {
  // Update the typing bubble in real-time with streaming text
  const typingBubble = document.querySelector('#typing-msg .msg-bubble');
  if (typingBubble && data.partial) {
    typingBubble.innerHTML = formatAIResponse(data.partial);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

window.electronAPI.onOpencodeTool((data) => {
  // Show tool execution info in the typing bubble
  const typingBubble = document.querySelector('#typing-msg .msg-bubble');
  if (typingBubble) {
    const toolInfo = `<div style="color:var(--accent);font-size:12px;margin:4px 0;">⚙ ${data.name || 'tool'}</div>`;
    typingBubble.innerHTML = typingBubble.innerHTML + toolInfo;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

// ─── Persistence helpers ─────────────────────────────────────────
function saveState() {
  window.electronAPI.saveHistory({ conversations: state.conversations, activeId: state.activeId });
}
function saveSettings() {
  window.electronAPI.saveSettings(state.settings);
}

// ═══ Window Controls ═════════════════════════════════════════════
$('#minimizeBtn').addEventListener('click', () => window.electronAPI.minimizeWindow());
$('#maximizeBtn').addEventListener('click', () => window.electronAPI.maximizeWindow());
$('#closeBtn').addEventListener('click', () => window.electronAPI.closeWindow());

const pinBtn = $('#pinBtn');
pinBtn.addEventListener('click', () => window.electronAPI.toggleAlwaysOnTop());
window.electronAPI.onAlwaysOnTopChanged((v) => {
  state.settings.alwaysOnTop = v;
  pinBtn.classList.toggle('active', v);
  saveSettings();
});

// ═══ Theme & Appearance ══════════════════════════════════════════
$('#themeBtn').addEventListener('click', () => {
  const modes = ['light', 'dark', 'system'];
  const cur = modes.indexOf(state.settings.theme);
  const next = modes[(cur + 1) % modes.length];
  state.settings.theme = next;
  applyTheme();
  saveSettings();
  if ($('#settingThemeMode')) $('#settingThemeMode').value = next;
});

function resolveTheme() {
  if (state.settings.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return state.settings.theme || 'light';
}

function applyTheme() {
  const effective = resolveTheme();
  document.body.classList.toggle('dark', effective === 'dark');
  applyAccentColor(state.settings.accentColor || 'indigo');
  applySidebarColor(state.settings.sidebarColor || 'default');
}

function applyAccentColor(accent) {
  document.body.className = document.body.className.replace(/\baccent-\S+/g, '');
  document.body.classList.add(`accent-${accent}`);
}

function applySidebarColor(sidebar) {
  document.body.className = document.body.className.replace(/\bsidebar-\S+/g, '');
  document.body.classList.add(`sidebar-${sidebar}`);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.settings.theme === 'system') applyTheme();
});

// ═══ Model Selector ══════════════════════════════════════════════
const modelBtn = $('#modelSelectorBtn');
const modelDropdown = $('#modelDropdown');

modelBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  modelDropdown.classList.toggle('show');
});

document.addEventListener('click', () => modelDropdown.classList.remove('show'));

$$('.model-option').forEach(opt => {
  opt.addEventListener('click', () => {
    const model = opt.dataset.model;
    state.settings.model = model;
    $('#currentModel').textContent = model;
    $$('.model-option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    modelDropdown.classList.remove('show');
    saveSettings();
  });
});

// ═══ Sidebar ═════════════════════════════════════════════════════
$('#sidebarToggle').addEventListener('click', () => {
  state.sidebarOpen = !state.sidebarOpen;
  $('#sidebar').classList.toggle('collapsed', !state.sidebarOpen);
});

$('#searchHistoryBtn').addEventListener('click', () => {
  const search = $('#sidebarSearch');
  search.classList.toggle('hidden');
  if (!search.classList.contains('hidden')) $('#historySearchInput').focus();
});

$('#historySearchInput').addEventListener('input', (e) => {
  renderConversationList(e.target.value);
});

// ─── New Chat ────────────────────────────────────────────────────
$('#newChatBtn').addEventListener('click', createNewConversation);

async function createNewConversation() {
  const conv = {
    id: Date.now().toString(),
    title: '新对话',
    messages: [],
    createdAt: new Date().toISOString(),
    ocSessionID: null,
  };
  // Create a new OpenCode session for this conversation
  try {
    const res = await window.electronAPI.opencodeNewSession();
    if (res?.sessionID) {
      conv.ocSessionID = res.sessionID;
      state.ocSessionID = res.sessionID;
    }
  } catch {}
  state.conversations.unshift(conv);
  state.activeId = conv.id;
  saveState();
  renderConversationList();
  renderChat();
}

// ─── Render conversation list ────────────────────────────────────
function renderConversationList(filter = '') {
  const list = $('#conversationList');
  list.innerHTML = '';
  const filterLower = filter.toLowerCase();

  state.conversations
    .filter(c => !filter || c.title.toLowerCase().includes(filterLower))
    .forEach(conv => {
      const item = document.createElement('div');
      item.className = `conv-item${conv.id === state.activeId ? ' active' : ''}`;

      const title = document.createElement('span');
      title.className = 'conv-title';
      title.textContent = conv.title;

      const time = document.createElement('span');
      time.className = 'conv-time';
      const d = new Date(conv.createdAt);
      time.textContent = `${d.getMonth()+1}/${d.getDate()}`;

      const del = document.createElement('button');
      del.className = 'conv-delete';
      del.title = '删除';
      del.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteConversation(conv.id);
      });

      item.appendChild(title);
      item.appendChild(time);
      item.appendChild(del);
      item.addEventListener('click', () => loadConversation(conv.id));
      list.appendChild(item);
    });
}

function deleteConversation(id) {
  state.conversations = state.conversations.filter(c => c.id !== id);
  if (state.activeId === id) {
    state.activeId = state.conversations[0]?.id || null;
  }
  saveState();
  renderConversationList();
  if (state.activeId) loadConversation(state.activeId);
  else renderChat();
}

function loadConversation(id) {
  state.activeId = id;
  // Restore the OpenCode session for this conversation
  const conv = state.conversations.find(c => c.id === id);
  if (conv?.ocSessionID) state.ocSessionID = conv.ocSessionID;
  saveState();
  renderConversationList();
  renderChat();
}

// ═══ Chat Rendering ══════════════════════════════════════════════
const chatMessages = $('#chatMessages');
const chatInput = $('#chatInput');

function renderChat() {
  chatMessages.innerHTML = '';
  const conv = state.conversations.find(c => c.id === state.activeId);
  if (!conv || conv.messages.length === 0) {
    chatMessages.innerHTML = getWelcomeHTML();
    bindFeatureCards();
    return;
  }
  conv.messages.forEach(msg => appendMessageDOM(msg));
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getWelcomeHTML() {
  return `
    <div class="welcome-screen" id="welcomeScreen">
      <div class="welcome-hero">
        <h1>你好，我是 <span class="gradient-text">OpenCode</span></h1>
        <p class="welcome-sub">AI 编程助手 · 多模型编排 · 代码分析 · 智能对话</p>
      </div>
      <div class="feature-cards">
        <div class="feature-card" data-action="upload-code"><div class="feature-icon code-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div><span>代码分析</span></div>
        <div class="feature-card" data-action="upload-image"><div class="feature-icon image-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><span>图像识别</span></div>
        <div class="feature-card" data-action="upload-doc"><div class="feature-icon doc-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div><span>文档解读</span></div>
        <div class="feature-card" data-action="deep-think"><div class="feature-icon think-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></div><span>深度思考</span></div>
        <div class="feature-card" data-action="discover"><div class="feature-icon discover-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div><span>发现</span></div>
      </div>
    </div>`;
}

function bindFeatureCards() {
  $$('.feature-card').forEach(card => {
    card.addEventListener('click', () => handleFeatureAction(card.dataset.action));
  });
}

function handleFeatureAction(action) {
  const typeMap = { 'upload-code': 'code', 'upload-image': 'image', 'upload-doc': 'document' };
  if (typeMap[action]) {
    uploadFiles(typeMap[action]);
  } else if (action === 'deep-think') {
    toggleTool('toolDeepThinkBtn');
    chatInput.focus();
  } else if (action === 'discover') {
    chatInput.value = '';
    chatInput.placeholder = '探索更多功能，试试问我任何编程问题...';
    chatInput.focus();
  }
}

function appendMessageDOM(msg) {
  const div = document.createElement('div');
  div.className = `message message-${msg.role}`;

  const content = document.createElement('div');
  content.className = 'msg-content';

  // Attachments
  if (msg.attachments && msg.attachments.length > 0) {
    const attachDiv = document.createElement('div');
    attachDiv.className = 'msg-attachments';
    msg.attachments.forEach(f => {
      const att = document.createElement('div');
      att.className = 'msg-attachment';
      if (f.isImage && f.base64) {
        att.innerHTML = `<img src="${f.base64}" alt="${f.name}"><span>${f.name}</span>`;
      } else {
        att.innerHTML = `<div class="msg-attachment-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><span>${f.name}</span>`;
      }
      attachDiv.appendChild(att);
    });
    content.appendChild(attachDiv);
  }

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (msg.role === 'ai') {
    bubble.innerHTML = formatAIResponse(msg.text);
  } else {
    bubble.textContent = msg.text;
  }

  content.appendChild(bubble);
  div.appendChild(content);
  chatMessages.appendChild(div);
}

function formatAIResponse(text) {
  // Simple markdown-like formatting
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ═══ Send Message ════════════════════════════════════════════════
$('#sendBtn').addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text && state.pendingFiles.length === 0) return;
  if (state.sending) return;

  // Ensure a conversation exists
  if (!state.activeId) createNewConversation();
  const conv = state.conversations.find(c => c.id === state.activeId);
  if (!conv) return;

  // Build user message
  const userMsg = {
    role: 'user',
    text: text,
    attachments: [...state.pendingFiles],
    timestamp: new Date().toISOString(),
    tools: [...state.activeTools],
  };

  // Auto-title from first message
  if (conv.messages.length === 0 && text) {
    conv.title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    renderConversationList();
  }

  conv.messages.push(userMsg);
  appendMessageDOM(userMsg);

  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  clearPendingFiles();

  // Remove welcome screen
  const ws = $('#welcomeScreen');
  if (ws) ws.remove();

  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveState();

  // Send to OpenCode or fallback
  await getAIResponse(conv, userMsg);
}

async function getAIResponse(conv, userMsg) {
  state.sending = true;

  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message message-ai';
  typingDiv.id = 'typing-msg';
  typingDiv.innerHTML = '<div class="msg-content"><div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const text = userMsg.text;

  // Try real OpenCode first
  if (state.ocConnected || !state.ocConnected) {
    try {
      const result = await window.electronAPI.opencodeSend({
        message: text,
        sessionID: state.ocSessionID,
      });

      if (result && !result.error && result.text) {
        // Success — real AI response
        const t = document.getElementById('typing-msg');
        if (t) t.remove();

        if (result.sessionID) state.ocSessionID = result.sessionID;
        state.ocConnected = true;

        const aiMsg = { role: 'ai', text: result.text, timestamp: new Date().toISOString() };
        conv.messages.push(aiMsg);
        appendMessageDOM(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        saveState();
        state.sending = false;
        // Auto-TTS if enabled
        if (state.settings.autoTts) playTTS(result.text);
        return;
      }

      // If error, log it and fall through to simulation
      if (result?.error) {
        console.warn('[OpenCode] Response error:', result.error);
      }
    } catch (e) {
      console.warn('[OpenCode] Send failed:', e);
    }
  }

  // Fallback: simulated response
  simulateFallbackResponse(conv, userMsg);
}

function simulateFallbackResponse(conv, userMsg) {
  const text = userMsg.text;
  const hasFiles = userMsg.attachments && userMsg.attachments.length > 0;
  const hasCode = userMsg.attachments?.some(f => f.isCode);
  const hasImage = userMsg.attachments?.some(f => f.isImage);

  let response = '';
  const notConnected = !state.ocConnected
    ? '\n\n⚠️ **OpenCode 服务未连接** — 请先在终端运行 `opencode` 启动服务，然后重新发送消息即可获得真实 AI 回复。'
    : '';

  if (hasImage) {
    const imgName = userMsg.attachments.find(f => f.isImage)?.name || '图片';
    response = `已收到图片 **${imgName}**。连接 OpenCode 服务后即可进行图像分析。${notConnected}`;
  } else if (hasCode) {
    const codeName = userMsg.attachments.find(f => f.isCode)?.name || '代码';
    response = `已收到代码文件 **${codeName}**。连接 OpenCode 服务后即可分析代码。${notConnected}`;
  } else if (hasFiles) {
    const fileName = userMsg.attachments[0]?.name || '文件';
    response = `已收到文档 **${fileName}**。连接 OpenCode 服务后即可解读文档内容。${notConnected}`;
  } else {
    response = `关于「${text}」— 当前为离线模式，无法生成真实回复。${notConnected}\n\n**连接方法：**\n1. 打开终端（更多 → 终端）\n2. 运行 \`opencode\` 启动 AI 服务\n3. 重新发送消息\n\n或者使用 \`oh-my-opencode run "${text}"\` 直接在终端获取回复。`;
  }

  setTimeout(() => {
    const t = document.getElementById('typing-msg');
    if (t) t.remove();

    const aiMsg = { role: 'ai', text: response, timestamp: new Date().toISOString() };
    conv.messages.push(aiMsg);
    appendMessageDOM(aiMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveState();
    state.sending = false;
  }, 600);
}

// ═══ File Upload ═════════════════════════════════════════════════
async function uploadFiles(type) {
  const files = await window.electronAPI.openFileDialog({ type });
  if (!files || files.length === 0) return;
  files.forEach(f => state.pendingFiles.push(f));
  renderFilePreview();
}

function renderFilePreview() {
  const bar = $('#filePreviewBar');
  const list = $('#filePreviewList');
  if (state.pendingFiles.length === 0) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  list.innerHTML = '';
  state.pendingFiles.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'file-preview-item';
    if (f.isImage && f.base64) {
      item.innerHTML = `<img src="${f.base64}" alt="${f.name}"><span>${f.name}</span>`;
    } else {
      item.innerHTML = `<span>${f.name}</span>`;
    }
    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-preview-remove';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', () => {
      state.pendingFiles.splice(i, 1);
      renderFilePreview();
    });
    item.appendChild(removeBtn);
    list.appendChild(item);
  });
}

function clearPendingFiles() {
  state.pendingFiles = [];
  renderFilePreview();
}

// Upload button (paperclip)
$('#toolUploadBtn').addEventListener('click', () => uploadFiles('all'));

// ═══ Panel System ════════════════════════════════════════════════
// Maps toolbar button IDs to panel IDs
const TOOL_PANEL_MAP = {
  toolImageBtn:     'panelImage',
  toolCodeBtn:      'panelCode',
  toolDeepThinkBtn: 'panelDeepThink',
  toolResearchBtn:  'panelResearch',
  toolTaskBtn:      'panelTask',
};

let activePanel = null;

function openPanel(panelId) {
  // Close any open panel first
  closeAllPanels();
  const panel = $(`#${panelId}`);
  if (!panel) return;
  panel.classList.add('active');
  activePanel = panelId;
  // Mark corresponding toolbar button active
  Object.entries(TOOL_PANEL_MAP).forEach(([btnId, pId]) => {
    $(`#${btnId}`).classList.toggle('active', pId === panelId);
  });
  // Add tool to active set
  const toolName = panelId.replace('panel', '').toLowerCase();
  state.activeTools.add(toolName);
}

function closePanel(panelId) {
  const panel = $(`#${panelId}`);
  if (panel) panel.classList.remove('active');
  if (activePanel === panelId) activePanel = null;
  // Remove active from toolbar buttons
  Object.entries(TOOL_PANEL_MAP).forEach(([btnId, pId]) => {
    if (pId === panelId) $(`#${btnId}`).classList.remove('active');
  });
  // Remove tool from active set
  const toolName = panelId.replace('panel', '').toLowerCase();
  state.activeTools.delete(toolName);
}

function closeAllPanels() {
  $$('.tool-panel').forEach(p => p.classList.remove('active'));
  Object.keys(TOOL_PANEL_MAP).forEach(btnId => $(`#${btnId}`).classList.remove('active'));
  activePanel = null;
  state.activeTools.clear();
}

function togglePanel(panelId) {
  if (activePanel === panelId) closePanel(panelId);
  else openPanel(panelId);
}

// Toolbar button → toggle corresponding panel
Object.entries(TOOL_PANEL_MAP).forEach(([btnId, panelId]) => {
  $(`#${btnId}`).addEventListener('click', () => togglePanel(panelId));
});

// Panel close buttons (X icon)
$$('.panel-close').forEach(btn => {
  btn.addEventListener('click', () => closePanel(btn.dataset.panel));
});

// Panel close via tag × button
$$('.panel-close-tag').forEach(btn => {
  btn.addEventListener('click', (e) => { e.stopPropagation(); closePanel(btn.dataset.panel); });
});

// ═══ Panel Dropdowns (generic, position: fixed) ═════════════════
function positionDropdown(trigger, dropdown) {
  const rect = trigger.getBoundingClientRect();
  // Open upward: bottom of dropdown aligns to top of trigger
  dropdown.style.left = rect.left + 'px';
  dropdown.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
  dropdown.style.top = 'auto';
}

function setupDropdown(triggerSel, dropdownSel, optionSel, labelSel, dataAttr) {
  const trigger = $(triggerSel);
  const dropdown = $(dropdownSel);
  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other open dropdowns
    $$('.panel-dropdown.show').forEach(d => { if (d !== dropdown) d.classList.remove('show'); });
    const isOpen = dropdown.classList.contains('show');
    if (!isOpen) {
      positionDropdown(trigger, dropdown);
      dropdown.classList.add('show');
    } else {
      dropdown.classList.remove('show');
    }
  });

  $$(optionSel).forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.dataset[dataAttr];
      if (labelSel) $(labelSel).textContent = val;
      $$(optionSel).forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      dropdown.classList.remove('show');
    });
  });
}

// Image panel: ratio dropdown
setupDropdown('#imageRatioBtn', '#ratioDropdown', '.ratio-option', '#currentRatio', 'ratio');
// Code panel: language dropdown
setupDropdown('#codeLangBtn', '#langDropdown', '.lang-option', '#currentLang', 'lang');
// DeepThink panel: depth dropdown
setupDropdown('#thinkDepthBtn', '#depthDropdown', '.depth-option', '#currentDepth', 'depth');
// Research panel: scope dropdown
setupDropdown('#researchScopeBtn', '#scopeDropdown', '.scope-option', '#currentScope', 'scope');
// Task panel: agent dropdown
setupDropdown('#taskAgentBtn', '#agentDropdown', '.agent-option', '#currentAgent', 'agent');

// Close all panel dropdowns on outside click
document.addEventListener('click', () => {
  $$('.panel-dropdown.show').forEach(d => d.classList.remove('show'));
});

// ═══ Image Panel interactions ════════════════════════════════════
// Gallery card click → fill prompt
$$('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    const prompt = card.dataset.prompt;
    const input = $('#imagePromptInput');
    if (input) input.value = prompt;
  });
});

// Image gallery tabs — filter cards by category
function filterGallery(category) {
  $$('#imageGallery .gallery-card').forEach(card => {
    card.classList.toggle('hidden', card.dataset.category !== category);
  });
}
// Initialize: show only featured
filterGallery('featured');

$$('#imageGalleryTabs .panel-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('#imageGalleryTabs .panel-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterGallery(tab.dataset.tab);
  });
});

// Reference image upload
$('#imageRefBtn').addEventListener('click', () => uploadFiles('image'));

// Image tag close → close image panel
$('#imageTagClose').addEventListener('click', () => closePanel('panelImage'));

// Image send button → send prompt through OpenCode
$('#imageSendBtn').addEventListener('click', () => {
  const prompt = $('#imagePromptInput').value.trim();
  const ratio = $('#currentRatio').textContent;
  if (!prompt) return;
  // Set main input and send
  chatInput.value = `[图像生成] 比例:${ratio} — ${prompt}`;
  closePanel('panelImage');
  sendMessage();
});

// ═══ Code Panel interactions ═════════════════════════════════════
$('#codeUploadBtn').addEventListener('click', () => uploadFiles('code'));

// Code quick action cards
$$('#panelCode .quick-action-card').forEach(card => {
  card.addEventListener('click', () => {
    const action = card.dataset.action;
    const lang = $('#currentLang').textContent;
    const prompts = {
      'code-review':  `请对我的代码进行审查，分析代码质量和潜在问题。语言: ${lang}`,
      'code-explain': `请逐行解释这段代码的逻辑和作用。语言: ${lang}`,
      'code-refactor':`请帮我重构这段代码，优化结构和性能。语言: ${lang}`,
      'code-test':    `请为这段代码生成完整的单元测试用例。语言: ${lang}`,
      'code-fix':     `请帮我找出并修复这段代码中的 Bug。语言: ${lang}`,
      'code-doc':     `请为这段代码生成注释和文档。语言: ${lang}`,
    };
    chatInput.value = prompts[action] || '';
    chatInput.focus();
  });
});

// ═══ DeepThink Panel interactions ════════════════════════════════
$$('#panelDeepThink .quick-action-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.dataset.prompt;
    chatInput.focus();
  });
});

// ═══ Research Panel interactions ═════════════════════════════════
$$('#panelResearch .quick-action-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.dataset.prompt;
    chatInput.focus();
  });
});

// ═══ Task Panel interactions ═════════════════════════════════════
$$('#panelTask .quick-action-card').forEach(card => {
  card.addEventListener('click', () => {
    const action = card.dataset.action;
    const agent = $('#currentAgent').textContent;
    const prompts = {
      'task-implement': `[任务:${agent}] 请帮我实现以下功能：`,
      'task-refactor':  `[任务:${agent}] 请帮我重构以下代码：`,
      'task-fix':       `[任务:${agent}] 请帮我修复以下问题：`,
      'task-test':      `[任务:${agent}] 请帮我编写以下测试：`,
    };
    chatInput.value = prompts[action] || '';
    chatInput.focus();
  });
});

// ═══ More Menu ═══════════════════════════════════════════════════
const moreMenu = $('#moreMenu');
$('#toolMoreBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const rect = e.currentTarget.getBoundingClientRect();
  moreMenu.style.left = rect.left + 'px';
  moreMenu.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
  moreMenu.classList.toggle('hidden');
});
document.addEventListener('click', () => { moreMenu.classList.add('hidden'); });

$$('.more-menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const action = item.dataset.action;
    moreMenu.classList.add('hidden');
    if (action === 'upload-all') uploadFiles('all');
    else if (action === 'terminal') openTerminalModal();
    else if (action === 'clear-chat') clearCurrentChat();
    else if (action === 'settings') openSettingsModal();
  });
});

function clearCurrentChat() {
  const conv = state.conversations.find(c => c.id === state.activeId);
  if (conv) { conv.messages = []; saveState(); renderChat(); }
}

// ═══ Settings Modal ══════════════════════════════════════════════
function openSettingsModal() {
  loadAllSettingsUI();
  $('#settingsModal').classList.remove('hidden');
}
$('#closeSettingsBtn').addEventListener('click', () => { $('#settingsModal').classList.add('hidden'); });
$('#settingsModal').addEventListener('click', (e) => {
  if (e.target === $('#settingsModal')) $('#settingsModal').classList.add('hidden');
});

$('#settingOnTop').addEventListener('change', () => window.electronAPI.toggleAlwaysOnTop());

// ── Language selector ──
$('#settingLanguage').addEventListener('change', (e) => {
  const lang = e.target.value;
  I18N.lang = lang;
  state.settings.language = lang;
  saveSettings();
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'ko' ? 'ko' : 'en';
});

// ── Load all settings into modal fields ──
function loadAllSettingsUI() {
  const s = state.settings;
  // API
  $('#settingLlmBase').value = s.llmBase || '';
  $('#settingLlmKey').value = s.llmKey || '';
  $('#settingVlmBase').value = s.vlmBase || '';
  $('#settingVlmKey').value = s.vlmKey || '';
  $('#settingVlmModel').value = s.vlmModel || '';
  // Theme
  $('#settingThemeMode').value = s.theme || 'light';
  // Accent swatches
  $$('#accentSwatches .color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.accent === (s.accentColor || 'indigo'));
  });
  // Sidebar swatches
  $$('#sidebarSwatches .color-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.sidebar === (s.sidebarColor || 'default'));
  });
  // Language
  if ($('#settingLanguage')) $('#settingLanguage').value = s.language || 'zh';
}

// ── API fields auto-save ──
['settingLlmBase', 'settingLlmKey', 'settingVlmBase', 'settingVlmKey', 'settingVlmModel'].forEach(id => {
  const el = $(`#${id}`);
  if (!el) return;
  const save = () => {
    const keyMap = { settingLlmBase: 'llmBase', settingLlmKey: 'llmKey', settingVlmBase: 'vlmBase', settingVlmKey: 'vlmKey', settingVlmModel: 'vlmModel' };
    state.settings[keyMap[id]] = el.value.trim();
    saveSettings();
  };
  el.addEventListener('change', save);
  el.addEventListener('blur', save);
});

// ── Theme mode select ──
$('#settingThemeMode').addEventListener('change', () => {
  state.settings.theme = $('#settingThemeMode').value;
  applyTheme();
  saveSettings();
});

// ── Accent color swatches ──
$$('#accentSwatches .color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    $$('#accentSwatches .color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    state.settings.accentColor = sw.dataset.accent;
    applyAccentColor(sw.dataset.accent);
    saveSettings();
  });
});

// ── Sidebar color swatches ──
$$('#sidebarSwatches .color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    $$('#sidebarSwatches .color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    state.settings.sidebarColor = sw.dataset.sidebar;
    applySidebarColor(sw.dataset.sidebar);
    saveSettings();
  });
});

// ═══ Terminal Modal ══════════════════════════════════════════════
let terminalStarted = false;
function openTerminalModal() { $('#terminalModal').classList.remove('hidden'); }
$('#closeTerminalBtn').addEventListener('click', () => { $('#terminalModal').classList.add('hidden'); });
$('#terminalModal').addEventListener('click', (e) => {
  if (e.target === $('#terminalModal')) $('#terminalModal').classList.add('hidden');
});

function appendTerminalOutput(text) {
  const out = $('#terminalOutput');
  const line = document.createElement('div');
  line.textContent = text;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

$('#terminalInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = e.target.value;
    appendTerminalOutput(`$ ${cmd}`);
    e.target.value = '';
    if (!terminalStarted) {
      window.electronAPI.startTerminal();
      terminalStarted = true;
      setTimeout(() => window.electronAPI.sendTerminalInput(cmd + '\n'), 500);
    } else {
      window.electronAPI.sendTerminalInput(cmd + '\n');
    }
  }
});

window.electronAPI.onTerminalOutput((data) => appendTerminalOutput(data));
window.electronAPI.onTerminalExit((code) => {
  appendTerminalOutput(`\n[进程已退出，代码: ${code}]`);
  terminalStarted = false;
});

appendTerminalOutput('Oh My OpenCode Terminal');
appendTerminalOutput('输入命令开始使用...\n');

// ═══ Web Search ══════════════════════════════════════════════════
$('#toolWebBtn').addEventListener('click', () => {
  const btn = $('#toolWebBtn');
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    state.activeTools.add('web');
    chatInput.placeholder = '联网搜索已启用，输入问题获取实时信息...';
  } else {
    state.activeTools.delete('web');
    chatInput.placeholder = '向 OpenCode 提问...';
  }
});

// ═══ Voice: ASR (Mic → Text) + TTS (Text → Audio) ═══════════════
let micRecorder = null;
let micStream = null;
let micChunks = [];
let isRecording = false;
let ttsAudio = null;

const micBtn = $('#toolMicBtn');

micBtn.addEventListener('click', async () => {
  if (micBtn.classList.contains('mic-processing')) return;

  if (isRecording) {
    // Stop recording → send to ASR
    stopRecording();
  } else {
    // Start recording
    await startRecording();
  }
});

async function startRecording() {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micRecorder = new MediaRecorder(micStream, { mimeType: 'audio/webm;codecs=opus' });
    micChunks = [];

    micRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) micChunks.push(e.data);
    };

    micRecorder.onstop = async () => {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;

      if (micChunks.length === 0) return;

      // Show processing state
      micBtn.classList.remove('recording');
      micBtn.classList.add('mic-processing');
      chatInput.placeholder = '语音识别中...';

      try {
        const blob = new Blob(micChunks, { type: 'audio/webm' });
        const arrayBuf = await blob.arrayBuffer();
        const result = await window.electronAPI.speechToText(arrayBuf);

        if (result.error) {
          chatInput.placeholder = result.error;
          setTimeout(() => { chatInput.placeholder = '向 OpenCode 提问...'; }, 3000);
        } else if (result.text) {
          // Insert transcribed text into input
          const existing = chatInput.value;
          chatInput.value = existing ? existing + ' ' + result.text : result.text;
          chatInput.focus();
          chatInput.dispatchEvent(new Event('input'));
          chatInput.placeholder = '向 OpenCode 提问...';
        }
      } catch (e) {
        console.error('[ASR] Error:', e);
        chatInput.placeholder = '语音识别失败';
        setTimeout(() => { chatInput.placeholder = '向 OpenCode 提问...'; }, 2000);
      } finally {
        micBtn.classList.remove('mic-processing');
      }
    };

    micRecorder.start();
    isRecording = true;
    micBtn.classList.add('recording');
    chatInput.placeholder = '正在录音... 点击麦克风停止';
  } catch (e) {
    console.error('[Mic] Permission denied or error:', e);
    chatInput.placeholder = '麦克风权限被拒绝，请在系统设置中允许';
    setTimeout(() => { chatInput.placeholder = '向 OpenCode 提问...'; }, 3000);
  }
}

function stopRecording() {
  if (micRecorder && micRecorder.state !== 'inactive') {
    micRecorder.stop();
  }
  isRecording = false;
}

// TTS: play AI response aloud
async function playTTS(text) {
  if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; }
  if (!text) return;
  // Strip markdown for cleaner speech
  const clean = text.replace(/[#*`_~\[\]()>|]/g, '').replace(/\n+/g, '。').slice(0, 4096);
  try {
    const result = await window.electronAPI.textToSpeech(clean);
    if (result.error) {
      console.warn('[TTS]', result.error);
      return;
    }
    if (result.audio) {
      ttsAudio = new Audio(`data:audio/${result.format || 'mp3'};base64,${result.audio}`);
      ttsAudio.play();
    }
  } catch (e) {
    console.warn('[TTS] Playback error:', e);
  }
}

function stopTTS() {
  if (ttsAudio) { ttsAudio.pause(); ttsAudio = null; }
}

// ═══ Voice Settings Save/Load ═══════════════════════════════════
// Load voice settings into settings modal fields
function loadVoiceSettingsUI() {
  const s = state.settings;
  $('#settingVoiceApiBase').value = s.voiceApiBase || '';
  $('#settingVoiceApiKey').value = s.voiceApiKey || '';
  $('#settingAsrModel').value = s.asrModel || '';
  $('#settingTtsModel').value = s.ttsModel || '';
  if (s.ttsVoice) $('#settingTtsVoice').value = s.ttsVoice;
  $('#settingAutoTts').checked = !!s.autoTts;
}

// Save voice settings from modal fields
function saveVoiceSettings() {
  state.settings.voiceApiBase = $('#settingVoiceApiBase').value.trim();
  state.settings.voiceApiKey = $('#settingVoiceApiKey').value.trim();
  state.settings.asrModel = $('#settingAsrModel').value.trim();
  state.settings.ttsModel = $('#settingTtsModel').value.trim();
  state.settings.ttsVoice = $('#settingTtsVoice').value;
  state.settings.autoTts = $('#settingAutoTts').checked;
  window.electronAPI.saveSettings(state.settings);
}

// Auto-save voice settings on change
['settingVoiceApiBase', 'settingVoiceApiKey', 'settingAsrModel', 'settingTtsModel', 'settingTtsVoice', 'settingAutoTts'].forEach(id => {
  const el = $(`#${id}`);
  if (el) el.addEventListener('change', saveVoiceSettings);
  if (el && el.tagName === 'INPUT' && el.type !== 'checkbox') {
    el.addEventListener('blur', saveVoiceSettings);
  }
});

// Load on init
loadVoiceSettingsUI();

// ═══ Drag & Drop file upload ═════════════════════════════════════
document.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  chatInput.placeholder = '请使用工具栏的上传按钮添加文件';
  setTimeout(() => { chatInput.placeholder = '向 OpenCode 提问...'; }, 2000);
});
