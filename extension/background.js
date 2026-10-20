'use strict';

const DEFAULT_THEME = { name: 'light' };

const DEFAULT_BOOKMARKS = [
  { id: '1', name: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/s2/favicons?domain=google.com' },
  { id: '2', name: 'GitHub', url: 'https://github.com', icon: 'https://www.github.com/favicon.ico' },
  { id: '3', name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
  { id: '4', name: 'Gmail', url: 'https://mail.google.com', icon: 'https://mail.google.com/favicon.ico' }
];

async function ensureDefaults() {
  const { theme, bookmarks } = await chrome.storage.local.get(['theme', 'bookmarks']);
  const updates = {};

  if (!theme) {
    updates.theme = DEFAULT_THEME;
  }

  if (!Array.isArray(bookmarks)) {
    updates.bookmarks = DEFAULT_BOOKMARKS;
  }

  if (Object.keys(updates).length > 0) {
    await chrome.storage.local.set(updates);
  }
}

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log(`Tab Manager Pro ${reason === 'install' ? 'installed' : 'updated'}.`);

  try {
    await ensureDefaults();
  } catch (error) {
    console.error('Failed to initialize extension defaults:', error);
  }
});

// 点击工具栏图标时打开侧边栏（与新标签页同一套界面）
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(error => console.error('Failed to set side panel behavior:', error));

// 标签页有变动时通知新标签页刷新
function notifyTabsChanged() {
  // 没有新标签页开着时没有接收方，静默失败即可
  chrome.runtime.sendMessage({ type: 'TABS_CHANGED' }).catch(() => {});
}

chrome.tabs.onRemoved.addListener(notifyTabsChanged);
chrome.tabs.onCreated.addListener(notifyTabsChanged);
chrome.tabs.onActivated.addListener(notifyTabsChanged);
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === 'complete' || changeInfo.url || changeInfo.title) {
    notifyTabsChanged();
  }
});
