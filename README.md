# 英文划词收集器 (Word Collector Extension)

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.4-blue.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

一个轻量级、高效的 Chrome 浏览器扩展，帮助你在阅读英文网站时快速收集和整理重要的词句。

[功能特性](#-功能特性) • [安装指南](#-安装指南) • [使用方法](#-使用方法) • [常见问题](#-常见问题)

</div>

---

## ✨ 功能特性

### 核心功能
- 🖱️ **智能划词收集** - 鼠标选择文本即可自动收集，无需额外操作
- 🎨 **即时高亮显示** - 选中的文本自动高亮（黄色背景），视觉反馈清晰
- 💾 **本地持久化存储** - 所有收集内容保存在本地，浏览器重启不丢失
- 🚀 **浮窗实时展示** - 优雅的可拖动浮窗，实时显示收集列表
- 📋 **一键复制导出** - 支持复制到剪贴板或导出为 TXT 文件
- 🎛️ **开关控制** - 可随时启用/禁用收集功能，避免误操作

### 用户体验
- ⚡ **零依赖** - 纯原生 JavaScript 实现，加载速度快
- 🎯 **精准定位** - 自动记录来源页面和收集时间
- 🗑️ **灵活管理** - 支持单条删除、批量清空
- 🖼️ **界面美观** - 现代化 UI 设计，支持最小化和拖拽
- 🔒 **隐私安全** - 所有数据仅存储在本地浏览器，不上传任何服务器

---

## 📦 安装指南

### 方法一：开发者模式加载（推荐）

1. **下载扩展**
   ```bash
   git clone https://github.com/your-username/word-collector-extension.git
   # 或直接下载 ZIP 并解压
   ```

2. **打开扩展管理页面**
   - 在 Chrome 地址栏输入：`chrome://extensions/`
   - 或通过菜单：`更多工具` → `扩展程序`

3. **启用开发者模式**
   - 点击右上角的 **"开发者模式"** 开关

4. **加载扩展**
   - 点击 **"加载已解压的扩展程序"**
   - 选择项目文件夹 `word-collector-extension`
   - 看到扩展图标出现在工具栏，安装成功！

### 方法二：打包为 CRX 文件

1. 在 `chrome://extensions/` 页面点击 **"打包扩展程序"**
2. 选择插件根目录
3. 生成 `.crx` 文件后可分享给他人

> ⚠️ **重要提示**：安装或更新插件后，必须**刷新页面**才能使用！

---

## 🎯 使用方法

### 快速开始

1. **启用插件**
   - 点击浏览器工具栏的插件图标
   - 打开开关（默认是关闭状态）
   - 看到 "已启用" 提示

2. **划词收集**
   - 在任意网页上用鼠标选中文本
   - 文本自动高亮显示（黄色背景）
   - 内容添加到收集列表
   - 浮窗自动显示在右上角

3. **查看收集**
   - 浮窗实时显示所有收集内容
   - 或点击插件图标查看统计

### 浮窗操作

| 按钮 | 功能 | 说明 |
|------|------|------|
| 📋 | 复制 | 复制所有收集内容到剪贴板 |
| 📥 | 导出 | 下载为 TXT 文件 |
| 🗑️ | 清空 | 删除所有收集并清除页面高亮 |
| ➖ | 最小化 | 折叠浮窗但保持显示 |
| ✖️ | 关闭 | 隐藏浮窗（数据不会丢失） |
| 🚚 | 拖动 | 点击顶部区域可拖动浮窗位置 |

### 导出格式

**复制到剪贴板**（适合粘贴到备忘录、笔记软件）：
```
1. 第一条收集的文本
来源: https://example.com/page1
时间: 2025/11/16 14:30

---

2. 第二条收集的文本
来源: https://example.com/page2
时间: 2025/11/16 14:32
```

**导出 TXT 文件**：
- 文件名：`collected_phrases_YYYYMMDD_HHMMSS.txt`
- 格式与剪贴板相同
- 自动下载到浏览器默认下载目录

---

## 💡 使用场景

| 场景 | 示例 |
|------|------|
| 📚 **学术研究** | 阅读英文文献时收集专业术语和关键定义 |
| 📰 **新闻阅读** | 保存重要引用和数据，方便写作引用 |
| 📖 **在线学习** | 学习教程时记录关键知识点和代码片段 |
| ✍️ **内容创作** | 写作时收集灵感、金句和素材 |
| 🎓 **语言学习** | 积累生词、短语和地道表达 |
| 🔍 **资料整理** | 多网页浏览时统一收集信息到一处 |

---

## 📁 项目结构

```
word-collector-extension/
├── manifest.json          # 扩展配置文件（Manifest V3）
├── content.js            # 内容脚本（核心收集逻辑）
├── content.css           # 内容脚本样式
├── popup.html            # 插件弹出窗口页面
├── popup.js              # 弹出窗口交互逻辑
├── icon16.png            # 16x16 图标
├── icon48.png            # 48x48 图标
├── icon128.png           # 128x128 图标
├── test.html             # 本地测试页面
├── README.md             # 项目说明文档
├── INSTALL.md            # 详细安装指南
├── CHANGELOG.md          # 版本更新日志
└── TROUBLESHOOTING.md    # 故障排查指南
```

---

## 🛠️ 技术栈

- **Manifest V3** - Chrome 最新扩展 API 标准
- **Vanilla JavaScript** - 零依赖，纯原生实现
- **Chrome Storage API** - 本地数据持久化
- **Chrome Downloads API** - 文件导出功能
- **Clipboard API** - 剪贴板复制功能
- **CSS3** - 现代化 UI 设计

---

## ⚙️ 自定义配置

### 修改高亮颜色

编辑 `content.css` 文件：

```css
.word-collector-highlight {
  background-color: #ffeb3b;  /* 黄色 */
  /* 可选其他颜色：
     #90EE90 浅绿色
     #87CEEB 天蓝色
     #FFB6C1 粉红色
  */
}
```

### 修改浮窗初始位置

编辑 `content.css` 文件：

```css
.word-collector-float {
  top: 60px;     /* 距离顶部距离 */
  right: 20px;   /* 距离右侧距离 */
  /* 也可以改为左侧显示：
     left: 20px;
  */
}
```

### 修改列触发阈值

编辑 `content.js`，找到：

```javascript
if (selectedText.length > 0) {
  // 修改最小字符数限制
}
```

---

## 🐛 常见问题

<details>
<summary><strong>Q: 为什么有些网站无法使用？</strong></summary>

**A:** 出于安全限制，以下页面无法注入内容脚本：
- `chrome://` 开头的浏览器内部页面
- `chrome-extension://` 扩展商店页面
- `edge://` 等浏览器特殊页面

✅ 普通网站（如 Wikipedia、BBC、Medium 等）都可以正常使用。
</details>

<details>
<summary><strong>Q: 点击按钮没反应怎么办？</strong></summary>

**A:** 请按以下步骤排查：
1. 确认插件是否已启用（点击插件图标查看开关状态）
2. 刷新当前页面（按 F5）
3. 按 F12 打开开发者工具查看控制台是否有错误
4. 查看详细的 [故障排查指南](TROUBLESHOOTING.md)
</details>

<details>
<summary><strong>Q: 数据存储在哪里？会上传到服务器吗？</strong></summary>

**A:**
- 所有数据使用 Chrome Storage API 存储在**本地浏览器**中
- **不会上传到任何服务器**，完全离线工作
- 数据存储路径：Chrome 用户数据目录的 Local Storage 中
</details>

<details>
<summary><strong>Q: 如何备份我的收集数据？</strong></summary>

**A:** 两种备份方式：
1. **定期导出**：使用导出功能将数据保存为 TXT 文件
2. **浏览器同步**：启用 Chrome 同步功能（需登录 Google 账号）
</details>

<details>
<summary><strong>Q: 高亮在刷新后消失了？</strong></summary>

**A:**
- 高亮是临时的 DOM 标记，页面刷新后会消失（这是正常行为）
- 但收集的**文本内容已保存**，不会丢失
- 刷新后可通过浮窗或导出功能查看所有收集
</details>

<details>
<summary><strong>Q: 清空后页面高亮还在？</strong></summary>

**A:**
- 确保使用最新版本（v1.0.4+）
- 使用浮窗中的清空按钮（而非 popup 中的）
- 或者刷新页面即可清除所有高亮
</details>

<details>
<summary><strong>Q: 如何完全卸载插件？</strong></summary>

**A:**
1. 打开 `chrome://extensions/`
2. 找到"英文划词收集器"
3. 点击"移除"按钮
4. 确认删除（本地数据也会被清除）
</details>

---

## 📝 更新日志

### v1.0.4 (2025-11-15)
- ✨ 新增插件开关功能，可随时启用/禁用
- 🎨 优化浮窗 UI，改进交互体验
- 📋 增强复制到剪贴板功能
- 🐛 修复部分网站兼容性问题

### v1.0.3 (2025-11-15)
- 📋 添加复制到剪贴板功能
- 🐛 修复浮窗显示逻辑
- 📝 改进调试日志

### v1.0.2 (2025-11-15)
- 🐛 修复高亮功能的错误处理
- 🔧 优化浮窗创建时序

### v1.0.1 (2025-11-15)
- 🐛 修复 titleSpan null 引用错误
- 🔧 改进错误处理机制

### v1.0.0 (2025-11-15)
- 🎉 初始版本发布
- 🎨 划词高亮功能
- 💾 本地存储功能
- 🎪 浮窗展示和管理
- 📥 导出功能

查看完整更新日志：[CHANGELOG.md](CHANGELOG.md)

---

## 🤝 贡献指南

欢迎贡献代码、提出建议或报告问题！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 报告问题

提交 Issue 时，请提供：
- Chrome 版本（访问 `chrome://version/`）
- 操作系统版本
- 复现步骤
- 控制台错误信息（按 F12 查看）

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

这意味着你可以自由地：
- ✅ 使用本插件
- ✅ 修改源代码
- ✅ 分发给他人
- ✅ 用于商业用途

---

## 📧 联系方式

- **GitHub Issues**: [提交问题或建议](../../issues)
- **Pull Requests**: [贡献代码](../../pulls)
- **Email**: your-email@example.com

---

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

---

<div align="center">

**享受高效的阅读和收集体验！📚✨**

如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！

</div>
