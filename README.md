# Circle Lab

Circle Lab 是一个圆几何学习站点，课程项目来自 QMUL 的 EBU5315。

这个仓库现在主要负责首页（Vue 3 + Vite）和一套给队友复用的前端公共模块。`game` 和 `quiz` 页面已经有占位页，后续由队友继续填内容。

## 现在有什么

- 首页（Vue）：Hero、定理轮播、功能卡片、广告位、聊天机器人、页脚
- 主题切换：深色「霓虹几何」+ 浅色「蓝图风格」
- 中英切换：轻量 i18n
- 公共导航：普通页面也能直接接入
- 可访问性：字体大小控制、键盘可达、减少动效支持
- 隐私模块：隐私弹窗与同意逻辑

## 本地运行

```bash
npm install
npm run dev
```

默认会启动 Vite 开发服务器。常用入口：

- 首页：`http://localhost:5173/#/`
- Game 占位页：`http://localhost:5173/game.html`
- Quiz 占位页：`http://localhost:5173/quiz.html`

## 打包与预览

```bash
npm run build
npm run preview
```

`build` 产物在 `dist/`。

## 目录速览

```text
circle-lab/
├── src/
│   ├── components/          # Vue 组件（首页模块）
│   ├── views/HomePage.vue   # 首页聚合
│   ├── router/              # Vue Router（Hash 模式）
│   └── main.js
├── public/
│   ├── game.html            # 队友页面入口（占位）
│   ├── quiz.html            # 队友页面入口（占位）
│   ├── shared/              # 公共 JS/CSS 模块
│   └── lang/                # 文案资源（EN / ZH）
├── docs/                    # 设计与流程文档
└── index.html
```

## 给队友的接入方式

如果你在写纯 HTML 页面，可以直接复用公共模块：

```html
<link rel="stylesheet" href="shared/theme.css" />
<link rel="stylesheet" href="shared/navbar.css" />

<script src="shared/theme.js"></script>
<script src="shared/navbar.js"></script>
<script src="shared/i18n.js"></script>
<script src="shared/accessibility.js"></script>
<script src="shared/privacy.js"></script>
```

页面里预留一个容器给导航：

```html
<div id="navbar-container"></div>
```

然后在 `DOMContentLoaded` 里初始化：

```js
window.CircleLab.theme.init()
window.CircleLab.navbar.init({ activePage: 'game' })
window.CircleLab.i18n.init('game')
window.CircleLab.accessibility.init()
window.CircleLab.privacy.init()
```

## 开发备注

- Node 版本建议用当前稳定版（LTS）
- 字体来自 Google Fonts，离线环境下会回退到系统字体
- 首页路由使用 `createWebHashHistory()`，部署静态站点更省心

