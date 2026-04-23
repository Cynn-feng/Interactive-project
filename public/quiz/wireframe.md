# CircleLab · Quiz 页面线框图设计

**Wireframe Design · feature/quiz-luogen · 2026-04-21**

---

## 目录

- [0. 图例](#0-图例--legend)
- [1. 用户流程](#1-用户流程--user-flow)
- [2. 页面整体结构](#2-页面整体结构--page-structure)
- [3. 组件详细说明](#3-组件详细说明--component-specs)
- [4. 交互状态](#4-交互状态--interaction-states)
- [5. 响应式布局](#5-响应式布局--responsive-layout)
- [6. 无障碍 & 国际化](#6-无障碍--国际化--a11y--i18n)

---

## 0. 图例 / Legend

| 符号 | 含义 |
|------|------|
| `[ ]` | 矩形占位块（文字/图片内容区） |
| `---` | 分隔线 |
| `(●)` | 圆形元素 |
| `[▓▓▓░░]` | 进度条 |
| `< >` | 动态注入内容（JS 渲染） |
| `· · ·` | 虚线边框（隐藏/占位状态） |
| **粗体** | 组件名称 |
| `monospace` | CSS 属性值 |

**颜色语义：**

- 主色调 Primary：`#4F46E5`（Indigo）
- 正确 Correct：`#22C55E`（Green）
- 错误 Wrong：`#EF4444`（Red）
- 背景 Background：`#EEF2FF`
- 文字 Text：`#312E81`

---

## 1. 用户流程 / User Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│ 页面加载  │────▶│  随机排题    │────▶│  渲染题目+图片 │────▶│  用户点击选项  │
│ Page Load│     │ Fisher-Yates│     │ Render Q+Img │     │ Click Option │
└──────────┘     └─────────────┘     └──────────────┘     └──────┬───────┘
                                                                   │
                                          ┌────────────────────────┤
                                          ▼                        ▼
                                   ┌─────────────┐         ┌─────────────┐
                                   │  答错 Wrong  │         │  答对 Correct│
                                   │ 显示错误反馈  │         │ 显示正确反馈  │
                                   │ 允许重试     │         │ Next 按钮出现 │
                                   └──────┬──────┘         └──────┬──────┘
                                          │ 重试                    │
                                          └────────────────────────┘
                                                                    │
                                          ┌─────────────────────────┤
                                          ▼                         ▼
                                   ┌─────────────┐         ┌─────────────┐
                                   │  非最后一题  │         │   最后一题   │
                                   │ 点击 Next   │         │ Next→Restart│
                                   │ 渲染下一题   │         └──────┬──────┘
                                   └─────────────┘                 │
                                                                    ▼
                                                           ┌─────────────┐
                                                           │  完成画面    │
                                                           │ 显示 done   │
                                                           │ 反馈文字     │
                                                           │ Restart按钮 │
                                                           └─────────────┘
```

> **注意：** 答错不扣分，其余选项仍可点击重试；答对后所有选项锁定（`opacity: 0.45`）。

---

## 2. 页面整体结构 / Page Structure

### 2.1 桌面端（Desktop · 1280px）

```
┌─────────────────────────────────────────────────────────────────┐
│  [●][●][●]  localhost:3000/quiz                                 │  ← 浏览器栏
├─────────────────────────────────────────────────────────────────┤
│  [CIRCLE LAB]   Home  Theorems  [Quiz]  About    [EN/中] [☀]   │  ← Navbar
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ HERO ──────────────────────────────────────────────────┐    │
│  │  Circle Geometry Quiz                                    │    │
│  │  Test your understanding with theorem-based questions.   │    │
│  └──────────────────────────────────────── · · · · · · · ──┘    │
│                                                                   │
│  ┌─ QUIZ SHELL ────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │  ┌─ TOPBAR ─────────────────────────────────────────┐  │    │
│  │  │  [Progress: 3/10 ▓▓▓░░░░░░░] [Level: 2] [Q: 3/10]│  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌─ QUESTION CARD ──────────────────────────────────┐  │    │
│  │  │                                                    │  │    │
│  │  │  < 题目文字 · 由 quiz.js 动态注入 >                │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌─ IMAGE AREA ─────────────────────────────┐    │  │    │
│  │  │  │                                           │    │  │    │
│  │  │  │         [ Circle Theorem Diagram ]        │    │  │    │
│  │  │  │           img · object-fit:contain        │    │  │    │
│  │  │  │              min-height: 360px            │    │  │    │
│  │  │  │                                           │    │  │    │
│  │  │  └───────────────────────────────────────────┘    │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌─ OPTIONS (2-col grid) ───────────────────┐    │  │    │
│  │  │  │  [A] < 选项文字 >    [B] < 选项文字 >    │    │  │    │
│  │  │  │  [C] < 选项文字 >    [D] < 选项文字 >    │    │  │    │
│  │  │  └───────────────────────────────────────────┘    │  │    │
│  │  │                                                    │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  · · · [FEEDBACK BAR — hidden until answered] · · ·     │    │
│  │                                                          │    │
│  │                        [Restart · · ·]  [Next Question →]│    │
│  │                         (hidden)         (hidden)        │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 结构层级

```
<main.quiz-page>
  ├── <section.quiz-hero>
  │     ├── <h1>  Circle Geometry Quiz
  │     └── <p>   subtitle
  │
  └── <section.quiz-shell>  aria-live="polite"
        ├── <header.quiz-topbar>
        │     ├── .quiz-chip  #quiz-progress
        │     ├── .quiz-chip  #quiz-level
        │     └── .quiz-chip  #quiz-question-counter
        │
        ├── <article.quiz-question-card>
        │     ├── <h2 #quiz-question-text>
        │     ├── <div.quiz-image-wrap>
        │     │     └── <img #quiz-image>
        │     └── <div #quiz-options role="group">
        │           └── <button.quiz-option> × N
        │
        ├── <p #quiz-feedback>  aria-live="assertive"
        │
        └── <div.quiz-actions>
              ├── <button #quiz-next>    Next Question
              └── <button #quiz-restart> Restart Quiz
```

---

## 3. 组件详细说明 / Component Specs

### 3.1 Navbar 导航栏

```
┌────────────────────────────────────────────────────────────────┐
│  [CIRCLE LAB]    Home    Theorems    [■ Quiz]    About         │
│                                              [EN/中]  [☀ Theme]│
└────────────────────────────────────────────────────────────────┘
```

| 属性 | 值 |
|------|----|
| 高度 | `auto` · padding `12px 24px` |
| Logo | `width: 100px` · bg-fill-md |
| 激活项 | `background: --color-accent` · `color: #fff` |
| 右侧按钮 | 语言切换 + 主题切换 |

---

### 3.2 Hero 区域

```
┌────────────────────────────────────────────────────────────────┐
│  Circle Geometry Quiz                                          │
│  ← Exo 800 · clamp(2rem, 3.5vw, 3rem)                        │
│                                                                │
│  Test your understanding with theorem-based questions.         │
│  ← Roboto Mono · 0.9rem · color: --text-muted                 │
└ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ─┘
  ↑ border-bottom: 1px solid --border-color · margin-bottom: 2rem
```

---

### 3.3 Topbar Chips（状态信息栏）

```
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│  PROGRESS         │ │  LEVEL            │ │  QUESTION         │
│  3 / 10           │ │  2                │ │  3 / 10           │
│  [▓▓▓░░░░░░░░░░]  │ │                   │ │                   │
└───────────────────┘ └───────────────────┘ └───────────────────┘
  ↑ 含进度条（仅 Progress chip）
```

| 属性 | 值 |
|------|----|
| 布局 | `display: grid` · `grid-template-columns: repeat(3, 1fr)` · `gap: 0.8rem` |
| Padding | `0.7rem 1rem` |
| 标签字体 | `Roboto Mono · 0.8rem · uppercase` |
| 数值颜色 | `--color-accent · font-weight: 700` |
| 进度条 | `height: 4px · background: --color-accent` |
| Hover | `border-color-hover + bg-card-hover · transition: 150ms` |

---

### 3.4 Question Card（题目卡片）

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  < 题目文字 — quiz.js 动态注入，中英双语 >                      │
│  ← Exo · 600 · 1.25rem · line-height: 1.5 · min-height: 56px │
│                                                                │
│  ┌ · · · · · · · · · · · · · · · · · · · · · · · · · · · ┐   │
│  ·                                                         ·   │
│  ·              [ Circle Theorem Diagram ]                 ·   │
│  ·                                                         ·   │
│  ·         img · object-fit: contain · min-h: 360px        ·   │
│  ·                                                         ·   │
│  └ · · · · · · · · · · · · · · · · · · · · · · · · · · · ┘   │
│    ↑ border: 2px dashed · inset shadow · border-radius: lg    │
│                                                                │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │ (A)  < 选项文字 >    │  │ (B)  < 选项文字 >    │          │
│  └──────────────────────┘  └──────────────────────┘          │
│  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │ (C)  < 选项文字 >    │  │ (D)  < 选项文字 >    │          │
│  └──────────────────────┘  └──────────────────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Options 选项按钮规格：**

| 属性 | 值 |
|------|----|
| 布局 | `grid · 2-col · gap: 10px` |
| Padding | `12px 16px` |
| Key 圆圈 | `22×22px · border-radius: 50%` |
| 最小触控 | `44×44px`（无障碍要求） |
| Cursor | `pointer` |
| Transition | `150ms ease` |

---

### 3.5 Feedback Bar（反馈栏）

```
答对时：
┌──────────────────────────────────────────────────────────────┐
│  (✓)  ✅ 正确！< 解释文字 >                                   │  ← green border + bg
└──────────────────────────────────────────────────────────────┘

答错时：
┌──────────────────────────────────────────────────────────────┐
│  (✗)  ❌ 再试一次                                             │  ← red border + bg
└──────────────────────────────────────────────────────────────┘

完成时：
┌──────────────────────────────────────────────────────────────┐
│  (★)  全部完成！点击重新开始                                   │  ← accent border + bg
└──────────────────────────────────────────────────────────────┘

初始：（隐藏，不占位）
```

| 状态 | CSS 类 | 背景色 | 边框色 |
|------|--------|--------|--------|
| 正确 | `.quiz-feedback--ok` | `rgba(34,197,94,0.1)` | `#22C55E` |
| 错误 | `.quiz-feedback--err` | `rgba(244,63,94,0.08)` | `#EF4444` |
| 完成 | `.quiz-feedback--done` | `#eef2ff` | `#4F46E5` |

> `aria-live="assertive"` — 屏幕阅读器即时播报

---

### 3.6 Action Buttons（操作按钮）

```
                                    [Restart Quiz · · ·]  [Next Question →]
                                     ↑ 虚线/隐藏状态        ↑ 答对后显示
```

| 按钮 | 显示条件 | 样式 |
|------|----------|------|
| **Next Question** | 答对当前题后显示 | Primary · `bg: --color-accent` |
| **Restart Quiz** | 全部完成后替代 Next | Secondary · 默认边框 |

- 隐藏时：`display: none`（JS 控制，非 `visibility`）
- 最后一题答对：Next 文字变为 Restart，功能变为重置

---

## 4. 交互状态 / Interaction States

### 4.1 选项按钮四态

#### ① 默认 Default
```
┌──────────────────────────────┐
│  (A)  ████████████████████   │  border: --border-dk · bg: --surface
└──────────────────────────────┘  cursor: pointer
```

#### ② 悬停 Hover
```
┌══════════════════════════════╗
║  (A)  ████████████████████   ║  border: --accent · bg: accent/8
╚══════════════════════════════╝  key: bg-accent · transform: translateY(-1px)
```

#### ③ 答对 Correct
```
┌──────────────────────────────┐
│  (✓)  ████████████████████   │  border: --green · bg: green/5
└──────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ (✓)  ✅ 正确！解释文字...                                 │  feedback: ok
└──────────────────────────────────────────────────────────┘
  其余选项 opacity: 0.45 · pointer-events: none
  Next 按钮出现
```

#### ④ 答错 Wrong
```
┌══════════════════════════════╗
║  (✗)  ████████████████████   ║  border: --red · bg: red/5
╚══════════════════════════════╝
┌──────────────────────────────────────────────────────────┐
│ (✗)  ❌ 再试一次                                          │  feedback: err
└──────────────────────────────────────────────────────────┘
  其余选项仍可点击 · 无扣分
```

#### ⑤ 完成 Completion
```
┌──────────────────────────────────────────────────────────┐
│ (★)  全部完成！点击重新开始                               │  feedback: done
└──────────────────────────────────────────────────────────┘
                                          [Restart Quiz →]
```

#### ⑥ 加载中 Loading
```
┌──────────────────────────────────────────────────────────┐
│  Loading question...                                      │  i18n: "loading"
└──────────────────────────────────────────────────────────┘
┌ · · · · · · · · · · · · · · · · · · · · · · · · · · · · ┐
·                    [ ◌ spinner ]                          ·  skeleton placeholder
└ · · · · · · · · · · · · · · · · · · · · · · · · · · · · ┘
  选项按钮 disabled · opacity: 0.45
```

---

## 5. 响应式布局 / Responsive Layout

### 5.1 移动端（Mobile · 375px）

```
┌─────────────────────────────┐
│  ████  (notch pill)  ████   │  ← 手机顶部
├─────────────────────────────┤
│  [CIRCLE LAB]    [EN] [☰]  │  ← 汉堡菜单
├─────────────────────────────┤
│  < 标题 >                   │
│  < 副标题 >                  │
├─────────────────────────────┤
│  [Progress: 3/10] [Level:2] │  ← 2-col（原3-col）
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ < 题目文字 >         │    │
│  │                     │    │
│  │  [ Diagram Image ]  │    │  ← min-height: 260px
│  │                     │    │
│  │  [A] < 选项 >       │    │
│  │  [B] < 选项 >       │    │  ← 1-col（原2-col）
│  │  [C] < 选项 >       │    │
│  └─────────────────────┘    │
│                   [Next →]  │
└─────────────────────────────┘
```

### 5.2 断点规则

| 属性 | Desktop (≥ 641px) | Mobile (≤ 640px) |
|------|-------------------|------------------|
| Topbar | 3-col grid | 2-col grid |
| Options | 2-col grid | 1-col grid |
| Image min-height | `360px` | `260px` |
| Card padding | `2rem` | `1.25rem` |
| Shell padding | `2rem` | `1.25rem` |
| Hero font | `clamp(2rem, 3.5vw, 3rem)` | `clamp(2rem, 3.5vw, 3rem)` |
| Navbar | 完整链接 | 汉堡菜单 collapse |
| 触控目标 | `44×44px` min | `44×44px` min |

### 5.3 间距系统

| 属性 | 值 |
|------|----|
| Page max-width | `min(980px, calc(100% - 2.5rem))` |
| Page padding | `40px 0 80px` |
| Shell padding | `2rem` |
| Topbar chip gap | `0.8rem` |
| Options gap | `10px` |
| Question card padding | `2rem` |

---

## 6. 无障碍 & 国际化 / A11y & i18n

### 6.1 无障碍合规清单

| 项目 | 实现方式 |
|------|----------|
| 动态内容播报 | `aria-live="polite"` on `.quiz-shell` |
| 反馈即时播报 | `aria-live="assertive"` on `#quiz-feedback` |
| 选项分组 | `role="group"` on `#quiz-options` |
| 图片描述 | `alt="Circle theorem diagram"` on `<img>` |
| 焦点可见 | `outline: 2px solid --color-accent · offset: 2px` |
| 键盘导航 | Tab 顺序与视觉顺序一致 |
| 触控目标 | 选项按钮最小 `44×44px` |
| 文字对比度 | 最低 `4.5:1`（WCAG AA） |
| 可点击光标 | `cursor: pointer` on 所有交互元素 |
| 禁用状态 | `opacity: 0.45 · cursor: not-allowed` |
| 动效偏好 | `prefers-reduced-motion` 下关闭 transition |

### 6.2 i18n 键值表

| Key | 用途 |
|-----|------|
| `title` | 页面标题 H1 |
| `subtitle` | 副标题 |
| `progressLabel` | "Progress" 标签 |
| `levelLabel` | "Level" 标签 |
| `questionLabel` | "Question" 标签 |
| `next` | "Next Question" 按钮 |
| `restart` | "Restart Quiz" 按钮 |
| `loading` | 加载状态文字 |
| `incorrect` | 答错提示 |
| `finished` | 完成提示 |
| `doneHint` | 完成后重启提示 |

> **注意：** 题目文字由 `quiz.js` 直接注入，**不使用** `data-i18n` 属性，防止 i18n 模块异步覆盖已渲染的题目。语言切换时保持当前题目状态不重置。

---

## 附录：设计系统速查

### 颜色 Token

| Token | 值 | 用途 |
|-------|----|------|
| `--color-accent` | `#4F46E5` | 主色、激活态 |
| `--color-green` | `#22C55E` | 正确反馈 |
| `--color-red` | `#EF4444` | 错误反馈 |
| `--bg-card` | — | 卡片背景 |
| `--bg-secondary` | — | 次级背景 |
| `--border-color` | — | 默认边框 |
| `--text-primary` | — | 主文字 |
| `--text-muted` | — | 辅助文字 |

### 字体

| 用途 | 字体 | 规格 |
|------|------|------|
| 标题 H1 | Exo | 800 · clamp(2rem→3rem) |
| 题目文字 | Exo | 600 · 1.25rem |
| 数据/标签 | Roboto Mono | 0.8rem |
| 副标题 | Roboto Mono | 0.9rem |

### 圆角 Token

| Token | 值 |
|-------|----|
| `--radius-xl` | quiz-shell |
| `--radius-lg` | question-card · image-wrap |
| `--radius-md` | chips |
| `--radius-sm` | options · buttons · feedback |

---

*CircleLab · Quiz Wireframe v1.0 · feature/quiz-luogen · 2026-04-21*
*Designed for: Desktop 1280px · Tablet 768px · Mobile 375px*
