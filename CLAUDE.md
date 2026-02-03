# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

修仙世界观量化计算器 - 一个用于检测修仙小说世界观数值自洽性和崩坏风险的 Web 应用。基于"凡人流"数值体系设计，帮助作者/读者验证修仙设定中的数值是否合理。

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

## 技术栈

- **框架**: Next.js 15 (App Router)
- **React**: 19
- **样式**: Tailwind CSS 4 (使用 @tailwindcss/postcss)
- **语言**: TypeScript
- **状态管理**: React useState (客户端组件)

## 项目架构

### 目录结构

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局（中文 metadata）
│   ├── page.tsx           # 首页（仅渲染 CultivationCalculator）
│   └── globals.css        # 全局样式（Tailwind + SVG 修复）
├── components/            # React 组件（全部为客户端组件）
│   ├── CultivationCalculator.tsx  # 主应用容器
│   ├── ParameterPanel.tsx         # 参数输入面板
│   ├── RealmTable.tsx             # 境界计算结果表格
│   ├── AlertList.tsx              # 崩坏警报列表
│   ├── CollapsibleSection.tsx     # 可折叠区块
│   └── SchemeManager.tsx          # 方案保存/加载管理
├── lib/
│   ├── types/index.ts     # 所有类型定义
│   ├── calculator/core.ts # 核心计算逻辑（纯函数）
│   ├── data/
│   │   ├── realms.ts      # 九大境界配置
│   │   └── presets.ts     # 预设方案（凡人流/高武流/速成流/困难模式）
│   └── storage/
│       └── schemes.ts     # localStorage 方案持久化
└── next.config.ts         # Next.js 配置
```

### 架构设计原则

1. **纯函数计算核心** (`lib/calculator/core.ts`)
   - 所有计算函数均为纯函数，无副作用
   - 核心公式：境界资源消耗呈指数增长（小境界系数^小境界数 × 大境界系数^大境界数）
   - 检测规则：寿命不足、资源断档、指数爆炸

2. **组件分离**
   - 主容器 `CultivationCalculator` 管理所有状态和业务逻辑
   - 展示组件接收 props 并通过回调更新状态
   - 所有组件标记为 `'use client'`（使用 useState、localStorage）

3. **路径别名**
   - `@/*` 映射到项目根目录
   - 导入示例：`import { X } from '@/lib/types'`

### 关键类型定义

- `CalculationParams`: 计算参数（基数、系数、炼气层数等）
- `ResourceConfig`: 资源配置（灵矿/灵植物类型、档位、等级）
- `CalculationResult`: 完整计算结果（境界详情、警报、资源自给率）
- `SavedScheme`: 用户保存的方案

### 境界体系

标准九大境界：炼气 → 筑基 → 金丹 → 元婴 → 化神 → 炼虚 → 合体 → 大乘 → 渡劫

- 炼气期：12层（可配置，3-20）
- 其他境界：前期/中期/后期/大圆满（4小境界）

## 开发注意事项

1. **添加新组件时**：确保添加 `'use client'` 指令（如果使用 hooks 或 localStorage）

2. **修改计算逻辑时**：`lib/calculator/core.ts` 中的函数应保持纯函数特性

3. **新增预设方案时**：在 `lib/data/presets.ts` 中添加 `PresetConfig`，并同步更新 `PRESETS` 和 `PRESET_OPTIONS`

4. **SVG 图标**：项目使用内联 SVG 组件，在 `globals.css` 中有尺寸修复样式

5. **样式约定**：
   - 使用 Tailwind CSS 类名
   - 响应式断点：`sm:` (640px), `xl:` (1280px)
   - 暗色模式：`dark:` 前缀类名

## 数据持久化

- 使用浏览器 localStorage 存储用户方案
- 存储 key: `cultivation-calculator-schemes`
- 导入/导出功能支持 JSON 格式的方案配置

## Git提交规范

```
<type>: <subject>

[可选的详细描述]
```

**类型**: feat | fix | improve | docs | refactor

**要求**: 概要简洁明了（10秒内可读完），不添加footer，不自动提交（需用户确认）。

**示例**:
```
feat: 添加实体时间线功能

实现时间轴可视化，支持按章节查看实体出现轨迹
```

## 文档管理原则

- 优先迭代现有文档，避免创建新文档
- 不主动写使用说明类文档（除非用户明确要求）
- 代码结构优先查看 PROJECT_INDEX.md
- 开发任务使用 PDCA 规范: `docs/pdca/**yyyymmdd-name**/[PLAN\DO\CHECK\ACT].md`
   - **PLAN.md**: 设计意图（粗略 PRD）
   - **DO.md**: 施工日志（实施过程）
   - **CHECK.md**: 用户态验收（UI/UX）+ AI 态质量复查（项目定制 + 置信度评估）
   - **ACT.md**: 模块知识库（**AI 理解模块的核心入口**）

---

**Language Preference**: 请始终使用简体中文回复用户的所有问题。