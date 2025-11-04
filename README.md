# LexiLoop（词回环）

取自 Lexis (词汇) + Loop (循环)，寓意为一个循环记忆的文字练习伴侣。

技术栈：Electron + React + TypeScript + Vite

主要功能目标：极简、专注文本轮播记忆工具，可记忆单词、句子、短语或语料。

## 功能特性

- ✅ 文字轮播展示，支持自定义字体大小、颜色、行间距
- ✅ 可配置背景颜色和轮播间隔
- ✅ 语料管理：添加、编辑、删除语料
- ✅ 支持批量添加语料（每行一条）
- ✅ 自动保存到本地存储（localStorage）
- ✅ 暂停/继续播放功能
- ✅ 进度显示（当前/总数）
- ✅ 快捷键支持
  - 空格键：暂停/继续
  - 左方向键：上一个
  - 右方向键：下一个
  - ESC：关闭设置页面

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

这会自动启动 Vite 开发服务器和 Electron 窗口。

### 构建

```bash
npm run build
```

构建产物将输出到 `release` 目录。

## 项目结构

```
lexiloop/
├── main/                    # Electron 主进程
│   ├── main.ts
│   └── preload.ts
├── renderer/                # React 前端
│   ├── App.tsx
│   ├── components/
│   │   ├── DisplayView.tsx  # 主显示界面
│   │   ├── SettingsView.tsx # 设置页面
│   │   ├── AddCorpusModal.tsx # 添加语料弹窗
│   │   └── Toolbar.tsx      # 顶部工具栏
│   ├── store/
│   │   └── useAppStore.ts   # Zustand 状态管理
│   └── styles/
│       └── index.css
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 使用说明

1. **添加语料**：点击顶部 "➕ 添加语料" 按钮，在弹出框中输入语料（每行一条），点击"添加"。

2. **开始轮播**：添加语料后，点击 "▶️ 继续" 按钮开始自动轮播。

3. **设置**：点击 "⚙️ 设置" 按钮可以：

   - 调整字体大小、颜色、行间距
   - 设置背景颜色
   - 配置轮播间隔时间
   - 管理语料（编辑、删除）

4. **快捷键**：
   - 空格：暂停/继续轮播
   - 左方向键：上一个语料
   - 右方向键：下一个语料
   - ESC：关闭设置页面

## 技术栈

- **Electron**: 桌面应用框架
- **React**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Zustand**: 轻量级状态管理

## 许可证

MIT
