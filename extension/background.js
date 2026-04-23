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
