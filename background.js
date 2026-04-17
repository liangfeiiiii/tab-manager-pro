'use strict';

// 后台脚本
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Manager Pro 已安装');
  
  // 初始化默认设置
  chrome.storage.local.get('theme', (result) => {
    if (!result.theme) {
      chrome.storage.local.set({ theme: { name: 'light' } });
    }
  });
  
  chrome.storage.local.get('bookmarks', (result) => {
    if (!result.bookmarks) {
      const defaultBookmarks = [
        { id: '1', name: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/s2/favicons?domain=google.com' },
        { id: '2', name: 'GitHub', url: 'https://github.com', icon: 'https://www.github.com/favicon.ico' },
        { id: '3', name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
        { id: '4', name: 'Gmail', url: 'https://mail.google.com', icon: 'https://mail.google.com/favicon.ico' }
      ];
      chrome.storage.local.set({ bookmarks: defaultBookmarks });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'refreshTabs') {
    // 可以在这里添加刷新标签页的逻辑
    sendResponse({ status: 'success' });
  }
  return true; // 保持 sendResponse 通道开放，支持未来异步操作
});