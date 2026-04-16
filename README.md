# Tab Manager Pro

**管理您的标签页，提升浏览效率。**

Tab Manager Pro 是一个 Chrome 扩展，它将您的新标签页替换为一个功能强大的仪表板，帮助您更好地管理所有打开的标签页。

## 语言选择 | Language

- [中文](README.zh.md) | [English](README.en.md)

---

## 功能特点 | Features

- **标签页分组** - 按域名自动分组标签页，清晰管理
- **主题切换** - 支持多种主题（浅色、深色、森林、海洋），适应不同使用场景
- **爆炸特效** - 关闭标签页时的视觉和听觉反馈（音效 + 彩色纸屑）
- **浏览历史** - 自动记录和显示最近访问的网站
- **常用网站** - 自定义和快速访问常用网站
- **Google 搜索** - 集成 Google 搜索框，快速搜索
- **本地存储** - 所有数据存储在本地，保护隐私
- **响应式设计** - 适配不同屏幕尺寸

---

## 安装方法 | Installation

### 手动安装

1. **克隆仓库**

```bash
git clone https://github.com/liangfeiiiii/tab-manager-pro.git
```

2. **加载 Chrome 扩展**

1. 打开 Chrome 浏览器，访问 `chrome://extensions`
2. 启用 **开发者模式**（右上角开关）
3. 点击 **加载已解压的扩展程序**
4. 导航到克隆仓库中的 `extension/` 文件夹并选择它

3. **打开新标签页**

您将看到 Tab Manager Pro 的界面。

---

## 技术栈 | Tech Stack

| 技术 | 说明 |
|------|------|
| 扩展类型 | Chrome Manifest V3 |
| 存储 | chrome.storage.local |
| 音效 | Web Audio API（合成音效，无文件） |
| 动画 | CSS 过渡 + JS 彩色纸屑粒子 |
| 主题 | CSS 变量实现多主题 |

---

## 许可证 | License

MIT

---

## 贡献 | Contributing

欢迎提交 Issue 和 Pull Request！