/**
 * i18n — Internationalization module for Oh My OpenCode Desktop
 * Supports: English (en), 简体中文 (zh), 한국어 (ko)
 */
const I18N = {
  _lang: 'zh',
  _listeners: [],

  translations: {
    // ── Titlebar ──
    selectModel:    { zh: '选择模型', en: 'Select Model', ko: '모델 선택' },
    pinWindow:      { zh: '置顶窗口', en: 'Pin Window', ko: '창 고정' },
    toggleTheme:    { zh: '切换主题', en: 'Toggle Theme', ko: '테마 전환' },
    minimize:       { zh: '最小化', en: 'Minimize', ko: '최소화' },
    maximize:       { zh: '最大化', en: 'Maximize', ko: '최대화' },
    closeToBubble:  { zh: '关闭到气泡', en: 'Close to Bubble', ko: '버블로 닫기' },

    // ── Sidebar ──
    newChat:        { zh: '新对话', en: 'New Chat', ko: '새 대화' },
    searchHistory:  { zh: '搜索历史', en: 'Search History', ko: '기록 검색' },
    searchPlaceholder: { zh: '搜索对话历史...', en: 'Search conversations...', ko: '대화 기록 검색...' },
    chatGroups:     { zh: '对话分组', en: 'Chat Groups', ko: '대화 그룹' },
    newGroup:       { zh: '新建分组', en: 'New Group', ko: '새 그룹' },
    recentChats:    { zh: '最近对话', en: 'Recent Chats', ko: '최근 대화' },
    mySpace:        { zh: '我的空间', en: 'My Space', ko: '내 공간' },
    collapseSidebar:{ zh: '收起侧栏', en: 'Collapse Sidebar', ko: '사이드바 접기' },

    // ── Welcome Screen ──
    welcomeTitle:   { zh: '你好，我是', en: "Hi, I'm", ko: '안녕하세요, 저는' },
    welcomeSub:     { zh: 'AI 编程助手 · 多模型编排 · 代码分析 · 智能对话', en: 'AI Coding Assistant · Multi-model · Code Analysis · Smart Chat', ko: 'AI 코딩 어시스턴트 · 멀티모델 · 코드 분석 · 스마트 대화' },
    codeAnalysis:   { zh: '代码分析', en: 'Code Analysis', ko: '코드 분석' },
    imageRecog:     { zh: '图像识别', en: 'Image Recognition', ko: '이미지 인식' },
    docParse:       { zh: '文档解读', en: 'Doc Parsing', ko: '문서 분석' },
    deepThink:      { zh: '深度思考', en: 'Deep Think', ko: '심층 사고' },
    discover:       { zh: '发现', en: 'Discover', ko: '발견' },
    uploadCode:     { zh: '上传代码文件进行分析', en: 'Upload code files for analysis', ko: '분석할 코드 파일 업로드' },
    uploadImage:    { zh: '上传图片进行识别分析', en: 'Upload images for recognition', ko: '인식을 위한 이미지 업로드' },
    uploadDoc:      { zh: '上传文档进行解读', en: 'Upload documents for parsing', ko: '분석할 문서 업로드' },
    enableDeepThink:{ zh: '启用深度思考模式', en: 'Enable deep thinking mode', ko: '심층 사고 모드 활성화' },
    discoverMore:   { zh: '探索更多功能', en: 'Explore more features', ko: '더 많은 기능 탐색' },

    // ── Image Panel ──
    imagePanel:     { zh: '创意生图 · 智能修图', en: 'Creative Image · Smart Edit', ko: '크리에이티브 이미지 · 스마트 편집' },
    close:          { zh: '关闭', en: 'Close', ko: '닫기' },
    imagePlaceholder:{ zh: '支持图像生成与编辑，快速实现创意设计', en: 'Image generation & editing for creative design', ko: '이미지 생성 및 편집으로 창의적 디자인' },
    image:          { zh: '图像', en: 'Image', ko: '이미지' },
    refImage:       { zh: '参考图', en: 'Reference', ko: '참조 이미지' },
    uploadRef:      { zh: '上传参考图', en: 'Upload reference', ko: '참조 이미지 업로드' },
    ratio:          { zh: '比例', en: 'Ratio', ko: '비율' },
    selectRatio:    { zh: '选择比例', en: 'Select ratio', ko: '비율 선택' },
    generateImage:  { zh: '生成图像', en: 'Generate Image', ko: '이미지 생성' },
    featured:       { zh: '精选', en: 'Featured', ko: '추천' },
    poster:         { zh: '海报', en: 'Poster', ko: '포스터' },
    ecommerce:      { zh: '电商', en: 'E-commerce', ko: '이커머스' },
    portrait:       { zh: '人像', en: 'Portrait', ko: '인물' },
    ratioSquare:    { zh: '1:1 正方形', en: '1:1 Square', ko: '1:1 정사각형' },
    ratioVertical:  { zh: '3:4 竖版', en: '3:4 Vertical', ko: '3:4 세로' },
    ratioHorizontal:{ zh: '4:3 横版', en: '4:3 Horizontal', ko: '4:3 가로' },
    ratioPhone:     { zh: '9:16 手机', en: '9:16 Phone', ko: '9:16 폰' },
    ratioWide:      { zh: '16:9 宽屏', en: '16:9 Wide', ko: '16:9 와이드' },

    // ── Code Panel ──
    codeAssistant:  { zh: '代码助手', en: 'Code Assistant', ko: '코드 어시스턴트' },
    codeMode:       { zh: '代码模式', en: 'Code Mode', ko: '코드 모드' },
    selectLang:     { zh: '选择语言', en: 'Select Language', ko: '언어 선택' },
    langLabel:      { zh: '语言', en: 'Language', ko: '언어' },
    autoDetect:     { zh: '自动检测', en: 'Auto Detect', ko: '자동 감지' },
    uploadCodeFile: { zh: '上传代码文件', en: 'Upload Code File', ko: '코드 파일 업로드' },
    uploadCodeBtn:  { zh: '上传代码', en: 'Upload Code', ko: '코드 업로드' },
    codeReview:     { zh: '代码审查', en: 'Code Review', ko: '코드 리뷰' },
    codeReviewDesc: { zh: '分析代码质量和潜在问题', en: 'Analyze code quality and issues', ko: '코드 품질 및 문제 분석' },
    codeExplain:    { zh: '代码解释', en: 'Code Explain', ko: '코드 설명' },
    codeExplainDesc:{ zh: '逐行解读代码逻辑', en: 'Line-by-line code logic', ko: '코드 로직 라인별 설명' },
    codeRefactor:   { zh: '代码重构', en: 'Refactor', ko: '리팩토링' },
    codeRefactorDesc:{ zh: '优化代码结构与性能', en: 'Optimize structure & performance', ko: '구조 및 성능 최적화' },
    genTest:        { zh: '生成测试', en: 'Generate Tests', ko: '테스트 생성' },
    genTestDesc:    { zh: '自动生成单元测试用例', en: 'Auto-generate unit tests', ko: '유닛 테스트 자동 생성' },
    fixBug:         { zh: '修复 Bug', en: 'Fix Bug', ko: '버그 수정' },
    fixBugDesc:     { zh: '定位并修复代码问题', en: 'Locate and fix code issues', ko: '코드 문제 찾기 및 수정' },
    genDoc:         { zh: '生成文档', en: 'Generate Docs', ko: '문서 생성' },
    genDocDesc:     { zh: '自动生成代码注释与文档', en: 'Auto-generate comments & docs', ko: '주석 및 문서 자동 생성' },

    // ── Deep Think Panel ──
    deepThinkMode:  { zh: '深度思考模式', en: 'Deep Think Mode', ko: '심층 사고 모드' },
    deepThinkEnabled:{ zh: '深度思考已启用', en: 'Deep Think Enabled', ko: '심층 사고 활성화됨' },
    deepThinkDesc:  { zh: 'AI 将使用更长的推理链进行分析，适合复杂问题、数学推理、逻辑分析等场景。响应时间可能较长。', en: 'AI uses longer reasoning chains for complex problems, math, and logic analysis. Response time may be longer.', ko: 'AI가 더 긴 추론 체인을 사용하여 복잡한 문제, 수학, 논리 분석을 수행합니다. 응답 시간이 길어질 수 있습니다.' },
    depthLabel:     { zh: '深度', en: 'Depth', ko: '깊이' },
    thinkDepth:     { zh: '思考深度', en: 'Think Depth', ko: '사고 깊이' },
    depthFast:      { zh: '快速 — 简要推理', en: 'Fast — Brief reasoning', ko: '빠름 — 간단한 추론' },
    depthStandard:  { zh: '标准 — 平衡深度与速度', en: 'Standard — Balanced', ko: '표준 — 균형' },
    depthDeep:      { zh: '深入 — 完整推理链', en: 'Deep — Full reasoning chain', ko: '심층 — 전체 추론 체인' },
    fast:           { zh: '快速', en: 'Fast', ko: '빠름' },
    standard:       { zh: '标准', en: 'Standard', ko: '표준' },
    deep:           { zh: '深入', en: 'Deep', ko: '심층' },
    rootCause:      { zh: '根因分析', en: 'Root Cause', ko: '근본 원인' },
    comparison:     { zh: '方案对比', en: 'Comparison', ko: '비교 분석' },
    mathReason:     { zh: '数学推理', en: 'Math Reasoning', ko: '수학 추론' },
    complexity:     { zh: '复杂度分析', en: 'Complexity', ko: '복잡도 분석' },
    archEval:       { zh: '架构评估', en: 'Architecture', ko: '아키텍처 평가' },
    sysDebug:       { zh: '系统调试', en: 'System Debug', ko: '시스템 디버그' },

    // ── Research Panel ──
    deepResearch:   { zh: '深度研究', en: 'Deep Research', ko: '심층 연구' },
    researchEnabled:{ zh: '深度研究已启用', en: 'Deep Research Enabled', ko: '심층 연구 활성화됨' },
    researchDesc:   { zh: 'AI 将进行多轮搜索和分析，综合多种信息源，生成深度研究报告。适合技术调研、方案对比等场景。', en: 'AI performs multi-round search and analysis, synthesizing multiple sources into a deep research report.', ko: 'AI가 여러 라운드의 검색과 분석을 수행하여 심층 연구 보고서를 생성합니다.' },
    scopeLabel:     { zh: '范围', en: 'Scope', ko: '범위' },
    researchScope:  { zh: '研究范围', en: 'Research Scope', ko: '연구 범위' },
    scopeAll:       { zh: '全网搜索', en: 'Web Search', ko: '웹 검색' },
    scopeTech:      { zh: '技术文档', en: 'Tech Docs', ko: '기술 문서' },
    scopeAcademic:  { zh: '学术论文', en: 'Academic', ko: '학술 논문' },
    allWeb:         { zh: '全网', en: 'Web', ko: '웹' },
    tech:           { zh: '技术', en: 'Tech', ko: '기술' },
    academic:       { zh: '学术', en: 'Academic', ko: '학술' },
    frameworkCompare:{ zh: '框架对比', en: 'Framework Compare', ko: '프레임워크 비교' },
    bestPractice:   { zh: '最佳实践', en: 'Best Practices', ko: '모범 사례' },
    projectAnalysis:{ zh: '项目分析', en: 'Project Analysis', ko: '프로젝트 분석' },
    errorSearch:    { zh: '错误排查', en: 'Error Search', ko: '오류 검색' },
    trendResearch:  { zh: '趋势调研', en: 'Trend Research', ko: '트렌드 연구' },
    toolCompare:    { zh: '工具对比', en: 'Tool Compare', ko: '도구 비교' },

    // ── Task Panel ──
    taskAssistant:  { zh: '任务助理', en: 'Task Assistant', ko: '작업 어시스턴트' },
    taskMode:       { zh: '任务模式', en: 'Task Mode', ko: '작업 모드' },
    selectAgent:    { zh: '选择智能体', en: 'Select Agent', ko: '에이전트 선택' },
    agentLabel:     { zh: '智能体', en: 'Agent', ko: '에이전트' },
    implement:      { zh: '实现功能', en: 'Implement', ko: '기능 구현' },
    implementDesc:  { zh: '描述需求，AI 自动编码实现', en: 'Describe requirements, AI codes it', ko: '요구사항 설명, AI가 코딩' },
    refactorCode:   { zh: '重构代码', en: 'Refactor Code', ko: '코드 리팩토링' },
    refactorDesc:   { zh: '优化现有代码结构和质量', en: 'Optimize existing code structure', ko: '기존 코드 구조 최적화' },
    fixIssue:       { zh: '修复问题', en: 'Fix Issues', ko: '문제 수정' },
    fixIssueDesc:   { zh: '定位并自动修复 Bug', en: 'Locate and auto-fix bugs', ko: '버그 찾기 및 자동 수정' },
    writeTest:      { zh: '编写测试', en: 'Write Tests', ko: '테스트 작성' },
    writeTestDesc:  { zh: '自动生成测试用例和覆盖率', en: 'Auto-generate test cases', ko: '테스트 케이스 자동 생성' },

    // ── Input Area ──
    chatPlaceholder:{ zh: '向 OpenCode 提问...', en: 'Ask OpenCode...', ko: 'OpenCode에 질문...' },
    sendMessage:    { zh: '发送消息', en: 'Send Message', ko: '메시지 보내기' },
    uploadFile:     { zh: '上传文件', en: 'Upload File', ko: '파일 업로드' },
    webSearch:      { zh: '联网搜索', en: 'Web Search', ko: '웹 검색' },
    voiceInput:     { zh: '语音输入', en: 'Voice Input', ko: '음성 입력' },
    more:           { zh: '更多', en: 'More', ko: '더보기' },
    code:           { zh: '代码', en: 'Code', ko: '코드' },

    // ── More Menu ──
    terminal:       { zh: '终端', en: 'Terminal', ko: '터미널' },
    openTerminal:   { zh: '打开终端', en: 'Open Terminal', ko: '터미널 열기' },
    clearChat:      { zh: '清除对话', en: 'Clear Chat', ko: '대화 지우기' },
    settings:       { zh: '设置', en: 'Settings', ko: '설정' },

    // ── Settings Modal ──
    apiSettings:    { zh: 'API 接口设置', en: 'API Settings', ko: 'API 설정' },
    defaultModel:   { zh: '默认模型', en: 'Default Model', ko: '기본 모델' },
    themeAppearance:{ zh: '主题与外观', en: 'Theme & Appearance', ko: '테마 및 외관' },
    darkLightMode:  { zh: '深色/浅色模式', en: 'Dark/Light Mode', ko: '다크/라이트 모드' },
    light:          { zh: '浅色', en: 'Light', ko: '라이트' },
    dark:           { zh: '深色', en: 'Dark', ko: '다크' },
    followSystem:   { zh: '跟随系统', en: 'System', ko: '시스템' },
    accentColor:    { zh: '强调色', en: 'Accent Color', ko: '강조색' },
    sidebarColor:   { zh: '侧边栏颜色', en: 'Sidebar Color', ko: '사이드바 색상' },
    windowSettings: { zh: '窗口设置', en: 'Window Settings', ko: '창 설정' },
    alwaysOnTop:    { zh: '窗口始终置顶', en: 'Always on Top', ko: '항상 위에' },
    showBubble:     { zh: '关闭时显示悬浮气泡', en: 'Show bubble on close', ko: '닫을 때 버블 표시' },
    voiceSettings:  { zh: '语音设置（ASR / TTS）', en: 'Voice Settings (ASR / TTS)', ko: '음성 설정 (ASR / TTS)' },
    asrModel:       { zh: 'ASR 模型', en: 'ASR Model', ko: 'ASR 모델' },
    ttsModel:       { zh: 'TTS 模型', en: 'TTS Model', ko: 'TTS 모델' },
    ttsVoice:       { zh: 'TTS 语音', en: 'TTS Voice', ko: 'TTS 음성' },
    autoRead:       { zh: 'AI 回复自动朗读', en: 'Auto-read AI replies', ko: 'AI 응답 자동 읽기' },
    language:       { zh: '界面语言', en: 'Interface Language', ko: '인터페이스 언어' },
    about:          { zh: '关于', en: 'About', ko: '소개' },
    aboutText:      { zh: 'Oh My OpenCode Desktop v1.0.0<br>最强 AI 编程助手 — 多模型编排 · 并行后台代理 · LSP/AST 工具', en: 'Oh My OpenCode Desktop v1.0.0<br>The Best AI Coding Assistant — Multi-model · Parallel Agents · LSP/AST Tools', ko: 'Oh My OpenCode Desktop v1.0.0<br>최고의 AI 코딩 어시스턴트 — 멀티모델 · 병렬 에이전트 · LSP/AST 도구' },
    closeSettings:  { zh: '关闭设置', en: 'Close Settings', ko: '설정 닫기' },

    // ── Terminal Modal ──
    terminalTitle:  { zh: '终端', en: 'Terminal', ko: '터미널' },
    closeTerminal:  { zh: '关闭终端', en: 'Close Terminal', ko: '터미널 닫기' },
    terminalPlaceholder: { zh: '输入命令...', en: 'Enter command...', ko: '명령어 입력...' },

    // ── Bubble ──
    quickPanel:     { zh: '快捷面板', en: 'Quick Panel', ko: '빠른 패널' },
    openMainWindow: { zh: '打开主窗口', en: 'Open Main Window', ko: '메인 창 열기' },
    quit:           { zh: '退出', en: 'Quit', ko: '종료' },
    askAnything:    { zh: '问点什么...', en: 'Ask anything...', ko: '무엇이든 물어보세요...' },
    translate:      { zh: '翻译', en: 'Translate', ko: '번역' },
    summarize:      { zh: '总结', en: 'Summarize', ko: '요약' },
    explainCode:    { zh: '解释代码', en: 'Explain Code', ko: '코드 설명' },
    fix:            { zh: '修复', en: 'Fix', ko: '수정' },
    voice:          { zh: '语音', en: 'Voice', ko: '음성' },
    thinking:       { zh: '思考中...', en: 'Thinking...', ko: '생각 중...' },

    // ── Bubble Settings Panel ──
    bThemeMode:     { zh: '主题', en: 'Theme', ko: '테마' },
    bAccentColor:   { zh: '强调色', en: 'Accent', ko: '강조색' },

    // ── Agent descriptions ──
    sisyphusDesc:   { zh: '通用任务执行', en: 'General task execution', ko: '일반 작업 실행' },
    hephaestusDesc: { zh: '代码锻造', en: 'Code forging', ko: '코드 포징' },
    prometheusDesc: { zh: '创新探索', en: 'Innovation exploration', ko: '혁신 탐구' },
    atlasDesc:      { zh: '大规模重构', en: 'Large-scale refactoring', ko: '대규모 리팩토링' },
  },

  /** Get translation for key */
  t(key) {
    const entry = this.translations[key];
    if (!entry) return key;
    return entry[this._lang] || entry.en || key;
  },

  /** Get current language */
  get lang() { return this._lang; },

  /** Set language and apply to DOM */
  set lang(code) {
    if (!['zh', 'en', 'ko'].includes(code)) return;
    this._lang = code;
    this.applyToDOM();
    this._listeners.forEach(fn => fn(code));
  },

  /** Register language change listener */
  onChange(fn) { this._listeners.push(fn); },

  /** Apply translations to all elements with data-i18n attributes */
  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const text = this.t(key);
      if (text !== key) el.textContent = text;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const text = this.t(key);
      if (text !== key) el.innerHTML = text;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const text = this.t(key);
      if (text !== key) el.placeholder = text;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      const text = this.t(key);
      if (text !== key) el.title = text;
    });
  },

  /** Initialize from saved settings */
  init(savedLang) {
    if (savedLang && ['zh', 'en', 'ko'].includes(savedLang)) {
      this._lang = savedLang;
    }
    this.applyToDOM();
  }
};

if (typeof module !== 'undefined') module.exports = I18N;
