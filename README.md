<div align="center">

# Tab Manager Pro

> *把满屏乱飞的标签页，收进一块新标签页仪表板*

[![Chrome](https://img.shields.io/badge/Chrome-Extension%20MV3-4285F4)](#快速开始)
[![Version](https://img.shields.io/badge/版本-1.0.0-4CAF50)](#功能特性)
[![License](https://img.shields.io/badge/License-MIT-FF8C00)](#许可证)

<br>

**替换你的 Chrome 新标签页，打开的标签、最近去过的网站、常用入口，一屏全在。**

按域名自动分组，关标签的时候有音效和彩色纸屑。四套主题随手切，
所有数据存在本地，不经过任何服务器。

[看效果](#效果示例) · [快速开始](#快速开始) · [功能特性](#功能特性) · [项目结构](#项目结构) · [许可证](#许可证)

[English](README.en.md)

</div>

---

## 效果示例

> 按下 Ctrl/Cmd + T 打开一个新标签页，看到的就是这样。

```
早上好                                    [⚙ 设置]
2026年10月19日 星期日

浏览历史                                  [清除]
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│github.com│ │react.dev │ │掘金      │ │知乎      │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

常用网站
[Google] [GitHub] [YouTube] [Gmail] [+]    [🔍 搜索 Google __________]

稍后处理                          待处理 2 / 已完成 1
┌─ 待处理 ─────────────┐  ┌─ 已完成 ─────────────┐
│ React 文档 - Hooks   │  │ 工具站收藏整理        │
│ 周末想读的文章        │  └──────────────────────┘
└──────────────────────┘

当前标签页 12                             [清除所有]

┌ github.com (4) ─────────────────────────────┐
│ · Tab Manager Pro   · PR #128   · Issues    │
└─────────────────────────────────────────────┘
┌ youtube.com (3) ────────────────────────────┐
│ · lo-fi mix         · React 教程            │
└─────────────────────────────────────────────┘

打开的标签页 12                     Design by liangfei
```

关掉一组标签时，右下角会炸出一片彩色纸屑，同时配一声合成音效，不依赖任何音频文件。

---

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/liangfeiiiii/tab-manager-pro.git
```

然后在 Chrome 里加载它：

1. 地址栏输入 `chrome://extensions` 回车
2. 打开右上角的**开发者模式**
3. 点**加载已解压的扩展程序**，选中仓库里的 `extension/` 文件夹
4. 开一个新标签页，就是它了

改了代码也一样，回扩展页点刷新按钮，再开个新标签页看效果。

---

## 功能特性

### 标签页按域名收拢

| 你会看到 | 它解决什么 |
|---------|-----------|
| 每个域名一张分组卡片 | 一眼看清哪堆标签是同一个站 |
| 卡片内页面平铺成小条目 | 不用来回切窗口找某个页面 |
| 点条目直接跳过去 | 等于给开了的标签做了个目录 |
| 整组关闭 / 一键清除所有 | 收拾残局不用一个个点叉 |

### 稍后处理

看到想读但当下没空的页面，收进「稍后处理」。
左边待处理，右边已完成，处理完的往右边一挪，随时能翻回来。

### 其余的

- **浏览历史**：最近访问的网站自动记录，可以单条删，也可以一键清空
- **常用网站**：默认给了 Google、GitHub、YouTube、Gmail，自己加自己删，图标 URL 可换
- **Google 搜索**：搜索框就在页面中间偏下，输入即搜
- **四套主题**：浅色、深色、森林、海洋，选完存在本地，下次打开还在
- **音效和纸屑**：关标签的反馈是 Web Audio 现场合成的，仓库里没有一个音频文件
- **数据只在本地**：全部走 `chrome.storage.local`，没有后端，不上传

---

## 技术栈

- **清单**：Chrome Manifest V3（`chrome_url_overrides` 劫持新标签页）
- **代码**：原生 JavaScript，没有框架，没有构建步骤，改完刷新就能看
- **样式**：CSS 变量做主题，四套配色就是四组变量
- **音效**：Web Audio API 振荡器合成
- **纸屑**：JS 粒子动画 + CSS transition
- **存储**：`chrome.storage.local`（主题、书签、历史、稍后处理）

---

## 项目结构

```
tab-manager-pro/
├── extension/
│   ├── manifest.json      # MV3 清单（新标签页覆盖、权限声明）
│   ├── index.html         # 新标签页结构（历史 / 书签 / 搜索 / 稍后处理 / 标签分组）
│   ├── app.js             # 全部业务逻辑（分组、主题、纸屑、音效、存储）
│   ├── style.css          # 样式与四套主题变量
│   ├── background.js      # 服务工作线程（首次安装写入默认主题和默认书签）
│   └── icons/             # 扩展图标 16 / 48 / 128
├── README.md
├── README.en.md
└── LICENSE
```

---

## 能改什么

- **主题配色**：`extension/app.js` 里的 `themes` 对象定义主题名单，`extension/style.css` 里搜 `-theme` 改各主题的 CSS 变量
- **默认书签**：`extension/background.js` 顶部的 `DEFAULT_BOOKMARKS`
- **关标签的音效**：`extension/app.js` 里的 `playCloseSound()`，改频率和包络就是另一个声音
- **纸屑样式**：`extension/app.js` 里的 `shootConfetti()`，颜色、数量、重力都在这
- **分组渲染**：`extension/app.js` 里的 `renderDomainCard()`
- **页面文案**：`extension/index.html`，包括问候语和日期位置

---

## 许可证

MIT License

---

*个人项目，非官方应用。Design by liangfei.*
