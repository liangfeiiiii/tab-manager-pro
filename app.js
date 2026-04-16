'use strict';

// 全局变量
let openTabs = [];
let domainGroups = [];
let bookmarks = [];
let currentTheme = 'light';
let browseHistory = [];

// DOM 元素
const elements = {
  greeting: document.getElementById('greeting'),
  dateDisplay: document.getElementById('dateDisplay'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsModal: document.getElementById('settingsModal'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  themesGrid: document.getElementById('themesGrid'),
  addBookmarkBtn: document.getElementById('addBookmarkBtn'),
  bookmarkModal: document.getElementById('bookmarkModal'),
  closeBookmarkBtn: document.getElementById('closeBookmarkBtn'),
  bookmarkForm: document.getElementById('bookmarkForm'),
  bookmarkId: document.getElementById('bookmarkId'),
  bookmarkName: document.getElementById('bookmarkName'),
  bookmarkUrl: document.getElementById('bookmarkUrl'),
  bookmarkIcon: document.getElementById('bookmarkIcon'),
  bookmarkModalTitle: document.getElementById('bookmarkModalTitle'),
  bookmarksGrid: document.getElementById('bookmarksGrid'),
  bookmarksList: document.getElementById('bookmarksList'),
  historyGrid: document.getElementById('historyGrid'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  clearAllTabsBtn: document.getElementById('clearAllTabsBtn'),
  tabsCount: document.getElementById('tabsCount'),
  tabsMissions: document.getElementById('tabsMissions'),
  statTabs: document.getElementById('statTabs'),
  toast: document.getElementById('toast'),
  toastText: document.getElementById('toastText')
};

// 主题定义
const themes = {
  light: {
    name: 'light',
    class: 'light-theme'
  },
  dark: {
    name: 'dark',
    class: 'dark-theme'
  },
  forest: {
    name: 'forest',
    class: 'forest-theme'
  },
  ocean: {
    name: 'ocean',
    class: 'ocean-theme'
  }
};

// 初始化
async function init() {
  await loadTheme();
  await loadBookmarks();
  await loadHistory();
  await renderDashboard();
  setupEventListeners();
}

// 加载主题
async function loadTheme() {
  try {
    const { theme } = await chrome.storage.local.get('theme');
    if (theme && themes[theme.name]) {
      currentTheme = theme.name;
    }
    applyTheme(currentTheme);
  } catch (err) {
    console.error('加载主题失败:', err);
  }
}

// 应用主题
function applyTheme(themeName) {
  document.body.className = '';
  if (themeName && themes[themeName]) {
    document.body.classList.add(themes[themeName].class);
  }
  
  // 更新主题选择UI
  document.querySelectorAll('.theme-card').forEach(card => {
    if (card.dataset.theme === themeName) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// 保存主题
async function saveTheme(themeName) {
  try {
    await chrome.storage.local.set({ theme: { name: themeName } });
    currentTheme = themeName;
    applyTheme(themeName);
    showToast('主题已更新');
  } catch (err) {
    console.error('保存主题失败:', err);
  }
}

// 加载常用网站
async function loadBookmarks() {
  try {
    const { bookmarks: savedBookmarks } = await chrome.storage.local.get('bookmarks');
    if (savedBookmarks && Array.isArray(savedBookmarks)) {
      bookmarks = savedBookmarks;
    } else {
      // 默认常用网站
      bookmarks = [
        { id: '1', name: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/s2/favicons?domain=google.com' },
        { id: '2', name: 'GitHub', url: 'https://github.com', icon: 'https://www.github.com/favicon.ico' },
        { id: '3', name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
        { id: '4', name: 'Gmail', url: 'https://mail.google.com', icon: 'https://mail.google.com/favicon.ico' }
      ];
      await saveBookmarks();
    }
    renderBookmarks();
  } catch (err) {
    console.error('加载常用网站失败:', err);
  }
}

// 保存常用网站
async function saveBookmarks() {
  try {
    await chrome.storage.local.set({ bookmarks });
  } catch (err) {
    console.error('保存常用网站失败:', err);
  }
}

// 渲染常用网站
function renderBookmarks() {
  if (!elements.bookmarksGrid) return;
  
  elements.bookmarksGrid.innerHTML = bookmarks.map(bookmark => `
    <div class="bookmark-item" data-url="${bookmark.url}">
      <div class="bookmark-icon">
        <img src="${bookmark.icon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`}" alt="${bookmark.name}">
      </div>
      <span class="bookmark-name">${bookmark.name}</span>
    </div>
  `).join('');
  
  // 渲染设置页面中的常用网站列表
  if (elements.bookmarksList) {
    elements.bookmarksList.innerHTML = bookmarks.map(bookmark => `
      <div class="bookmark-item-list">
        <div class="bookmark-icon">
          <img src="${bookmark.icon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`}" alt="${bookmark.name}">
        </div>
        <div class="bookmark-info">
          <div class="bookmark-name">${bookmark.name}</div>
          <div class="bookmark-url">${bookmark.url}</div>
        </div>
        <div class="bookmark-item-actions">
          <button onclick="editBookmark('${bookmark.id}')">编辑</button>
          <button onclick="deleteBookmark('${bookmark.id}')">删除</button>
        </div>
      </div>
    `).join('');
  }
}

// 添加常用网站
function addBookmark() {
  elements.bookmarkId.value = '';
  elements.bookmarkName.value = '';
  elements.bookmarkUrl.value = '';
  elements.bookmarkIcon.value = '';
  elements.bookmarkModalTitle.textContent = '添加常用网站';
  elements.bookmarkModal.style.display = 'flex';
}

// 编辑常用网站
function editBookmark(id) {
  const bookmark = bookmarks.find(b => b.id === id);
  if (bookmark) {
    elements.bookmarkId.value = bookmark.id;
    elements.bookmarkName.value = bookmark.name;
    elements.bookmarkUrl.value = bookmark.url;
    elements.bookmarkIcon.value = bookmark.icon || '';
    elements.bookmarkModalTitle.textContent = '编辑常用网站';
    elements.bookmarkModal.style.display = 'flex';
  }
}

// 删除常用网站
async function deleteBookmark(id) {
  if (confirm('确定要删除这个常用网站吗？')) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    await saveBookmarks();
    renderBookmarks();
    showToast('常用网站已删除');
  }
}

// 保存常用网站表单
async function saveBookmarkForm(e) {
  e.preventDefault();
  
  const id = elements.bookmarkId.value;
  const name = elements.bookmarkName.value.trim();
  const url = elements.bookmarkUrl.value.trim();
  const icon = elements.bookmarkIcon.value.trim();
  
  if (!name || !url) {
    alert('请填写网站名称和URL');
    return;
  }
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert('请输入有效的URL，以http://或https://开头');
    return;
  }
  
  if (id) {
    // 编辑现有网站
    const index = bookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      bookmarks[index] = {
        ...bookmarks[index],
        name,
        url,
        icon: icon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`
      };
    }
  } else {
    // 添加新网站
    bookmarks.push({
      id: Date.now().toString(),
      name,
      url,
      icon: icon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`
    });
  }
  
  await saveBookmarks();
  renderBookmarks();
  elements.bookmarkModal.style.display = 'none';
  showToast('常用网站已保存');
}

// 加载浏览历史
async function loadHistory() {
  try {
    const { browseHistory: savedHistory } = await chrome.storage.local.get('browseHistory');
    if (savedHistory && Array.isArray(savedHistory)) {
      browseHistory = savedHistory;
    } else {
      browseHistory = [];
    }
    renderHistory();
  } catch (err) {
    console.error('加载浏览历史失败:', err);
  }
}

// 保存浏览历史
async function saveHistory() {
  try {
    await chrome.storage.local.set({ browseHistory });
  } catch (err) {
    console.error('保存浏览历史失败:', err);
  }
}

// 添加到浏览历史
async function addToHistory(tab) {
  try {
    // 过滤掉内部页面
    const url = tab.url || '';
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || 
        url.startsWith('about:') || url.startsWith('edge://') || 
        url.startsWith('brave://')) {
      return;
    }
    
    // 检查是否已存在相同URL
    const existingIndex = browseHistory.findIndex(h => h.url === url);
    if (existingIndex !== -1) {
      // 已存在，更新时间并移到前面
      browseHistory.splice(existingIndex, 1);
    }
    
    // 添加到历史记录
    browseHistory.unshift({
      id: Date.now().toString(),
      url: tab.url,
      title: tab.title || new URL(tab.url).hostname,
      visitedAt: new Date().toISOString()
    });
    
    // 限制历史记录数量
    if (browseHistory.length > 20) {
      browseHistory = browseHistory.slice(0, 20);
    }
    
    await saveHistory();
    renderHistory();
  } catch (err) {
    console.error('添加到浏览历史失败:', err);
  }
}

// 渲染浏览历史
function renderHistory() {
  if (!elements.historyGrid) return;
  
  if (browseHistory.length === 0) {
    elements.historyGrid.innerHTML = `
      <div class="history-empty">暂无浏览历史</div>
    `;
    return;
  }
  
  elements.historyGrid.innerHTML = browseHistory.map(item => `
    <div class="history-item" data-url="${item.url}">
      <div class="history-icon">
        <img src="https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}" alt="">
      </div>
      <div class="history-info">
        <div class="history-title">${item.title}</div>
        <div class="history-url">${new URL(item.url).hostname}</div>
      </div>
      <button class="history-remove" data-id="${item.id}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `).join('');
}

// 从历史记录中删除
async function removeFromHistory(id) {
  browseHistory = browseHistory.filter(h => h.id !== id);
  await saveHistory();
  renderHistory();
}

// 清空历史记录
async function clearHistory() {
  if (confirm('确定要清空浏览历史吗？')) {
    browseHistory = [];
    await saveHistory();
    renderHistory();
    showToast('历史记录已清空');
  }
}

// 清除所有标签页
async function clearAllTabs() {
  if (confirm('确定要关闭所有标签页吗？')) {
    const realTabs = getRealTabs();
    if (realTabs.length > 0) {
      const tabIds = realTabs.map(tab => tab.id);
      await chrome.tabs.remove(tabIds);
      playCloseSound();
      await renderDashboard();
      showToast(`已关闭所有 ${realTabs.length} 个标签页`);
    }
  }
}

// 播放关闭声音
function playCloseSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime;

    const duration = 0.25;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const pos = i / data.length;
      const env = pos < 0.1 ? pos / 0.1 : Math.pow(1 - (pos - 0.1) / 0.9, 1.5);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.0;
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(t);

    setTimeout(() => ctx.close(), 500);
  } catch {
    // Audio not supported — fail silently
  }
}

// 发射彩色纸屑
function shootConfetti(x, y) {
  const colors = [
    '#c8713a', // amber
    '#e8a070', // amber light
    '#5a7a62', // sage
    '#8aaa92', // sage light
    '#5a6b7a', // slate
    '#8a9baa', // slate light
    '#d4b896', // warm paper
    '#b35a5a', // rose
  ];

  const particleCount = 17;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');

    const isCircle = Math.random() > 0.5;
    const size = 5 + Math.random() * 6; // 5–11px
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${isCircle ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 1;
    `;
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 120;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 80; // bias upward
    const gravity = 200;

    const startTime = performance.now();
    const duration = 700 + Math.random() * 200; // 700–900ms

    function frame(now) {
      const elapsed = (now - startTime) / 1000;
      const progress = elapsed / (duration / 1000);

      if (progress >= 1) { el.remove(); return; }

      const px = vx * elapsed;
      const py = vy * elapsed + 0.5 * gravity * elapsed * elapsed;
      const opacity = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 2;
      const rotate = elapsed * 200 * (isCircle ? 0 : 1);

      el.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) rotate(${rotate}deg)`;
      el.style.opacity = opacity;

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}

// 动画移除卡片
function animateCardOut(card) {
  if (!card) return;

  const rect = card.getBoundingClientRect();
  shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

  card.classList.add('closing');
  setTimeout(() => {
    card.remove();
    checkAndShowEmptyState();
  }, 300);
}

// 检查并显示空状态
function checkAndShowEmptyState() {
  const missionsEl = document.getElementById('tabsMissions');
  if (!missionsEl) return;

  const remaining = missionsEl.querySelectorAll('.mission-card:not(.closing)').length;
  if (remaining > 0) return;

  missionsEl.innerHTML = `
    <div class="missions-empty-state">
      <div class="empty-checkmark">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div class="empty-title">没有打开的标签页</div>
      <div class="empty-subtitle">开始浏览吧</div>
    </div>
  `;

  const countEl = document.getElementById('tabsCount');
  if (countEl) countEl.textContent = '';
}

// 获取打开的标签页
async function fetchOpenTabs() {
  try {
    const extensionId = chrome.runtime.id;
    const newtabUrl = `chrome-extension://${extensionId}/index.html`;

    const tabs = await chrome.tabs.query({});
    openTabs = tabs.map(t => ({
      id: t.id,
      url: t.url,
      title: t.title,
      windowId: t.windowId,
      active: t.active,
      isTabOut: t.url === newtabUrl || t.url === 'chrome://newtab/'
    }));
  } catch (err) {
    console.error('获取标签页失败:', err);
    openTabs = [];
  }
}

// 按URL关闭标签页
async function closeTabsByUrls(urls) {
  if (!urls || urls.length === 0) return;

  const targetHostnames = [];
  const exactUrls = new Set();

  for (const u of urls) {
    if (u.startsWith('file://')) {
      exactUrls.add(u);
    } else {
      try { targetHostnames.push(new URL(u).hostname); } catch {}
    }
  }

  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs
    .filter(tab => {
      const tabUrl = tab.url || '';
      if (tabUrl.startsWith('file://') && exactUrls.has(tabUrl)) return true;
      try {
        const tabHostname = new URL(tabUrl).hostname;
        return tabHostname && targetHostnames.includes(tabHostname);
      } catch { return false; }
    })
    .map(tab => tab.id);

  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

// 按精确URL关闭标签页
async function closeTabsExact(urls) {
  if (!urls || urls.length === 0) return;
  const urlSet = new Set(urls);
  const allTabs = await chrome.tabs.query({});
  const toClose = allTabs.filter(t => urlSet.has(t.url)).map(t => t.id);
  if (toClose.length > 0) await chrome.tabs.remove(toClose);
  await fetchOpenTabs();
}

// 聚焦标签页
async function focusTab(url) {
  if (!url) return;
  const allTabs = await chrome.tabs.query({});
  const currentWindow = await chrome.windows.getCurrent();

  let matches = allTabs.filter(t => t.url === url);

  if (matches.length === 0) {
    try {
      const targetHost = new URL(url).hostname;
      matches = allTabs.filter(t => {
        try { return new URL(t.url).hostname === targetHost; } catch { return false; }
      });
    } catch {}
  }

  if (matches.length === 0) return;

  const match = matches.find(t => t.windowId !== currentWindow.id) || matches[0];
  await chrome.tabs.update(match.id, { active: true });
  await chrome.windows.update(match.windowId, { focused: true });
}

// 保存标签页到收藏
async function saveTabForLater(tab) {
  try {
    const { deferred = [] } = await chrome.storage.local.get('deferred');
    deferred.push({
      id: Date.now().toString(),
      url: tab.url,
      title: tab.title,
      savedAt: new Date().toISOString(),
      completed: false,
      dismissed: false
    });
    await chrome.storage.local.set({ deferred });
    showToast('标签页已保存');
  } catch (err) {
    console.error('保存标签页失败:', err);
  }
}

// 获取保存的标签页
async function getSavedTabs() {
  try {
    const { deferred = [] } = await chrome.storage.local.get('deferred');
    const visible = deferred.filter(t => !t.dismissed);
    return {
      active: visible.filter(t => !t.completed),
      archived: visible.filter(t => t.completed)
    };
  } catch (err) {
    console.error('获取保存的标签页失败:', err);
    return { active: [], archived: [] };
  }
}

// 辅助函数：获取真实标签页（排除浏览器内部页面）
function getRealTabs() {
  return openTabs.filter(t => {
    const url = t.url || '';
    return (
      !url.startsWith('chrome://') &&
      !url.startsWith('chrome-extension://') &&
      !url.startsWith('about:') &&
      !url.startsWith('edge://') &&
      !url.startsWith('brave://')
    );
  });
}

// 辅助函数：友好的域名显示
function friendlyDomain(hostname) {
  if (!hostname) return '';
  
  const FRIENDLY_DOMAINS = {
    'github.com': 'GitHub',
    'www.github.com': 'GitHub',
    'youtube.com': 'YouTube',
    'www.youtube.com': 'YouTube',
    'x.com': 'X',
    'www.x.com': 'X',
    'twitter.com': 'X',
    'www.twitter.com': 'X',
    'reddit.com': 'Reddit',
    'www.reddit.com': 'Reddit',
    'google.com': 'Google',
    'www.google.com': 'Google',
    'mail.google.com': 'Gmail',
    'docs.google.com': 'Google Docs',
    'drive.google.com': 'Google Drive',
    'local-files': '本地文件'
  };
  
  if (FRIENDLY_DOMAINS[hostname]) return FRIENDLY_DOMAINS[hostname];
  
  let clean = hostname
    .replace(/^www\./, '')
    .replace(/\.(com|org|net|io|co|ai|dev|app|so|me|xyz|info|us|uk|co\.uk|co\.jp)$/, '');
  
  return clean.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

// 辅助函数：清理标题
function cleanTitle(title, hostname) {
  if (!title || !hostname) return title || '';

  const friendly = friendlyDomain(hostname);
  const domain = hostname.replace(/^www\./, '');
  const seps = [' - ', ' | ', ' — ', ' · ', ' – '];

  for (const sep of seps) {
    const idx = title.lastIndexOf(sep);
    if (idx === -1) continue;
    const suffix = title.slice(idx + sep.length).trim();
    const suffixLow = suffix.toLowerCase();
    if (
      suffixLow === domain.toLowerCase() ||
      suffixLow === friendly.toLowerCase() ||
      suffixLow === domain.replace(/\.\w+$/, '').toLowerCase() ||
      domain.toLowerCase().includes(suffixLow) ||
      friendly.toLowerCase().includes(suffixLow)
    ) {
      const cleaned = title.slice(0, idx).trim();
      if (cleaned.length >= 5) return cleaned;
    }
  }
  return title;
}

// 渲染标签页卡片
function renderDomainCard(group) {
  const tabs = group.tabs || [];
  const tabCount = tabs.length;
  const isLanding = group.domain === '__landing-pages__';
  const stableId = 'domain-' + group.domain.replace(/[^a-z0-9]/g, '-');

  const urlCounts = {};
  for (const tab of tabs) urlCounts[tab.url] = (urlCounts[tab.url] || 0) + 1;
  const dupeUrls = Object.entries(urlCounts).filter(([, c]) => c > 1);
  const hasDupes = dupeUrls.length > 0;
  const totalExtras = dupeUrls.reduce((s, [, c]) => s + c - 1, 0);

  const tabBadge = `<span class="open-tabs-badge">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18" /></svg>
    ${tabCount} 标签${tabCount !== 1 ? 's' : ''}
  </span>`;

  const seen = new Set();
  const uniqueTabs = [];
  for (const tab of tabs) {
    if (!seen.has(tab.url)) { seen.add(tab.url); uniqueTabs.push(tab); }
  }

  const visibleTabs = uniqueTabs.slice(0, 8);
  const extraCount = uniqueTabs.length - visibleTabs.length;

  const pageChips = visibleTabs.map(tab => {
    let label = cleanTitle(tab.title || '', group.domain);
    try {
      const parsed = new URL(tab.url);
      if (parsed.hostname === 'localhost' && parsed.port) label = `${parsed.port} ${label}`;
    } catch {}
    const count = urlCounts[tab.url];
    const dupeTag = count > 1 ? ` <span class="chip-dupe-badge">(${count}x)</span>` : '';
    const chipClass = count > 1 ? ' chip-has-dupes' : '';
    const safeUrl = (tab.url || '').replace(/"/g, '&quot;');
    const safeTitle = label.replace(/"/g, '&quot;');
    let domain = '';
    try { domain = new URL(tab.url).hostname; } catch {}
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=16` : '';
    return `<div class="page-chip clickable${chipClass}" data-action="focus-tab" data-tab-url="${safeUrl}" title="${safeTitle}">
      ${faviconUrl ? `<img class="chip-favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : ''}
      <span class="chip-text">${label}</span>${dupeTag}
      <div class="chip-actions">
        <button class="chip-action chip-save" data-action="defer-single-tab" data-tab-url="${safeUrl}" data-tab-title="${safeTitle}" title="保存">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
        </button>
        <button class="chip-action chip-close" data-action="close-single-tab" data-tab-url="${safeUrl}" title="关闭">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>`;
  }).join('') + (extraCount > 0 ? `
    <div class="page-chip page-chip-overflow">
      <span class="chip-text">+${extraCount} 更多</span>
    </div>` : '');

  let actionsHtml = `
    <button class="action-btn close-tabs" data-action="close-domain-tabs" data-domain-id="${stableId}">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
      关闭所有 ${tabCount} 标签
    </button>`;

  return `
    <div class="mission-card domain-card ${hasDupes ? 'has-amber-bar' : 'has-neutral-bar'}" data-domain-id="${stableId}">
      <div class="status-bar"></div>
      <div class="mission-content">
        <div class="mission-top">
          <span class="mission-name">${isLanding ? '首页' : (group.label || friendlyDomain(group.domain))}</span>
          ${tabBadge}
        </div>
        <div class="mission-pages">${pageChips}</div>
        <div class="actions">${actionsHtml}</div>
      </div>
    </div>`;
}

// 渲染仪表板
async function renderDashboard() {
  // 头部信息
  if (elements.greeting) elements.greeting.textContent = getGreeting();
  if (elements.dateDisplay) elements.dateDisplay.textContent = getDateDisplay();

  // 获取标签页
  await fetchOpenTabs();
  const realTabs = getRealTabs();

  // 添加到历史记录
  realTabs.forEach(tab => addToHistory(tab));

  // 按域名分组
  domainGroups = [];
  const groupMap = {};
  const landingTabs = [];

  for (const tab of realTabs) {
    try {
      let hostname;
      if (tab.url && tab.url.startsWith('file://')) {
        hostname = 'local-files';
      } else {
        hostname = new URL(tab.url).hostname;
      }
      if (!hostname) continue;

      if (!groupMap[hostname]) groupMap[hostname] = { domain: hostname, tabs: [] };
      groupMap[hostname].tabs.push(tab);
    } catch {
      // 跳过无效URL
    }
  }

  // 排序：按标签页数量
  domainGroups = Object.values(groupMap).sort((a, b) => b.tabs.length - a.tabs.length);

  // 渲染标签页卡片
  if (elements.tabsMissions) {
    if (domainGroups.length > 0) {
      elements.tabsMissions.innerHTML = domainGroups.map(g => renderDomainCard(g)).join('');
      if (elements.tabsCount) elements.tabsCount.textContent = `${domainGroups.length} 个域名`;
    } else {
        elements.tabsMissions.innerHTML = `
          <div class="missions-empty-state">
            <div class="empty-message">没有打开的标签页，开始浏览吧</div>
          </div>
        `;
        if (elements.tabsCount) elements.tabsCount.textContent = '0 个域名';
    }
  }

  // 页脚统计
  if (elements.statTabs) elements.statTabs.textContent = openTabs.length;
}

// 获取问候语
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

// 获取日期显示
function getDateDisplay() {
  return new Date().toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 显示提示
function showToast(message) {
  if (!elements.toast || !elements.toastText) return;
  elements.toastText.textContent = message;
  elements.toast.classList.add('visible');
  setTimeout(() => elements.toast.classList.remove('visible'), 2500);
}

// 设置事件监听器
function setupEventListeners() {
  // 设置按钮
  if (elements.settingsBtn) {
    elements.settingsBtn.addEventListener('click', () => {
      elements.settingsModal.style.display = 'flex';
    });
  }

  // 关闭设置
  if (elements.closeSettingsBtn) {
    elements.closeSettingsBtn.addEventListener('click', () => {
      elements.settingsModal.style.display = 'none';
    });
  }

  // 主题选择
  if (elements.themesGrid) {
    elements.themesGrid.addEventListener('click', (e) => {
      const themeCard = e.target.closest('.theme-card');
      if (themeCard) {
        const themeName = themeCard.dataset.theme;
        if (themeName) {
          saveTheme(themeName);
        }
      }
    });
  }

  // 添加常用网站
  if (elements.addBookmarkBtn) {
    elements.addBookmarkBtn.addEventListener('click', addBookmark);
  }

  // 关闭常用网站模态框
  if (elements.closeBookmarkBtn) {
    elements.closeBookmarkBtn.addEventListener('click', () => {
      elements.bookmarkModal.style.display = 'none';
    });
  }

  // 保存常用网站表单
  if (elements.bookmarkForm) {
    elements.bookmarkForm.addEventListener('submit', saveBookmarkForm);
  }

  // 清空历史记录
  if (elements.clearHistoryBtn) {
    elements.clearHistoryBtn.addEventListener('click', clearHistory);
  }

  // 清除所有标签页
  if (elements.clearAllTabsBtn) {
    elements.clearAllTabsBtn.addEventListener('click', clearAllTabs);
  }

  // 关闭模态框（点击背景）
  if (elements.settingsModal) {
    elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === elements.settingsModal) {
        elements.settingsModal.style.display = 'none';
      }
    });
  }

  if (elements.bookmarkModal) {
    elements.bookmarkModal.addEventListener('click', (e) => {
      if (e.target === elements.bookmarkModal) {
        elements.bookmarkModal.style.display = 'none';
      }
    });
  }

  // 标签页操作
  document.addEventListener('click', async (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;

    // 聚焦标签页
    if (action === 'focus-tab') {
      const tabUrl = actionEl.dataset.tabUrl;
      if (tabUrl) await focusTab(tabUrl);
      return;
    }

    // 关闭单个标签页
    if (action === 'close-single-tab') {
      e.stopPropagation();
      const tabUrl = actionEl.dataset.tabUrl;
      if (!tabUrl) return;

      const allTabs = await chrome.tabs.query({});
      const match = allTabs.find(t => t.url === tabUrl);
      if (match) await chrome.tabs.remove(match.id);
      await fetchOpenTabs();

      playCloseSound();

      const chip = actionEl.closest('.page-chip');
      if (chip) {
        const rect = chip.getBoundingClientRect();
        shootConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        chip.style.transition = 'opacity 0.2s, transform 0.2s';
        chip.style.opacity = '0';
        chip.style.transform = 'scale(0.8)';
        setTimeout(() => {
          chip.remove();
          const parentCard = document.querySelector('.mission-card:has(.mission-pages:empty)');
          if (parentCard) animateCardOut(parentCard);
          document.querySelectorAll('.mission-card').forEach(c => {
            if (c.querySelectorAll('.page-chip[data-action="focus-tab"]').length === 0) {
              animateCardOut(c);
            }
          });
        }, 200);
      }

      await renderDashboard();
      showToast('标签页已关闭');
      return;
    }

    // 保存单个标签页
    if (action === 'defer-single-tab') {
      e.stopPropagation();
      const tabUrl = actionEl.dataset.tabUrl;
      const tabTitle = actionEl.dataset.tabTitle || tabUrl;
      if (!tabUrl) return;

      await saveTabForLater({ url: tabUrl, title: tabTitle });

      const allTabs = await chrome.tabs.query({});
      const match = allTabs.find(t => t.url === tabUrl);
      if (match) await chrome.tabs.remove(match.id);
      await fetchOpenTabs();

      const chip = actionEl.closest('.page-chip');
      if (chip) {
        chip.style.transition = 'opacity 0.2s, transform 0.2s';
        chip.style.opacity = '0';
        chip.style.transform = 'scale(0.8)';
        setTimeout(() => chip.remove(), 200);
      }

      await renderDashboard();
      return;
    }

    // 关闭域名下所有标签页
    if (action === 'close-domain-tabs') {
      const domainId = actionEl.dataset.domainId;
      const group = domainGroups.find(g => {
        return 'domain-' + g.domain.replace(/[^a-z0-9]/g, '-') === domainId;
      });
      if (!group) return;

      const urls = group.tabs.map(t => t.url);
      await closeTabsByUrls(urls);

      playCloseSound();

      const card = actionEl.closest('.mission-card');
      if (card) {
        animateCardOut(card);
      }

      await renderDashboard();
      const groupLabel = group.domain === '__landing-pages__' ? '首页' : (group.label || friendlyDomain(group.domain));
      showToast(`已关闭 ${urls.length} 个来自 ${groupLabel} 的标签页`);
      return;
    }
  });

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.settingsModal.style.display === 'flex') {
        elements.settingsModal.style.display = 'none';
      }
      if (elements.bookmarkModal.style.display === 'flex') {
        elements.bookmarkModal.style.display = 'none';
      }
    }
  });
}

// 初始化应用
init();

// 暴露全局函数
window.editBookmark = editBookmark;
window.deleteBookmark = deleteBookmark;
window.removeFromHistory = removeFromHistory;

// 确保历史记录和常用网站可以点击
  document.addEventListener('DOMContentLoaded', function() {
    // 为历史记录项添加点击事件
    document.addEventListener('click', function(e) {
      const historyItem = e.target.closest('.history-item');
      if (historyItem) {
        // 检查是否点击了删除按钮
        const historyRemove = e.target.closest('.history-remove');
        if (!historyRemove) {
          const url = historyItem.getAttribute('data-url') || historyItem.dataset.url;
          if (url) {
            window.open(url, '_top');
          }
        }
      }
    });
    
    // 为历史记录删除按钮添加点击事件
    document.addEventListener('click', function(e) {
      const historyRemove = e.target.closest('.history-remove');
      if (historyRemove) {
        e.stopPropagation();
        const id = historyRemove.getAttribute('data-id') || historyRemove.dataset.id;
        if (id) {
          removeFromHistory(id);
        }
      }
    });
    
    // 为常用网站项添加点击事件
    document.addEventListener('click', function(e) {
      const bookmarkItem = e.target.closest('.bookmark-item');
      if (bookmarkItem) {
        const url = bookmarkItem.getAttribute('data-url') || bookmarkItem.dataset.url;
        if (url) {
          window.open(url, '_top');
        }
      }
    });
  });