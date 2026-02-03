# Act: 修仙世界观量化计算器

**日期**: 2026-02-03

---

## 一句话概述

修仙小说世界观数值自洽性验证工具，检测寿命匹配与资源断档两类崩坏风险。

---

## 涉及文件

| 文件 | 职责 |
|------|------|
| `lib/types/index.ts` | 完整 TypeScript 类型定义 |
| `lib/calculator/core.ts` | 纯函数计算核心（境界消耗、时长、崩坏检测、转换率/吸收效率） |
| `lib/data/presets.ts` | 4套预设方案配置（凡人流/高武流/速成流/困难模式） |
| `lib/data/realms.ts` | 九大境界配置数据 |
| `lib/storage/schemes.ts` | localStorage 方案存储管理 |
| `components/CultivationCalculator.tsx` | 主计算器（状态管理、预设切换） |
| `components/ParameterPanel.tsx` | 参数设置面板（基础/转换率/吸收效率/资源配置分组） |
| `components/PresetDetailPanel.tsx` | 预设详情弹窗（参数对比表格） |
| `components/AlertList.tsx` | 崩坏警报展示（动画效果） |
| `components/RealmTable.tsx` | 境界耗时表格（资源自给率百分比） |
| `components/SchemeManager.tsx` | 方案保存/加载/删除/导入导出 |
| `components/CollapsibleSection.tsx` | 可折叠面板复用组件 |
| `app/page.tsx` | 主页面入口 |
| `app/layout.tsx` | 根布局（中文 metadata） |

---

## 架构决策

### 1. 纯函数计算核心
**原因**:
- 计算逻辑无副作用，结果可预测
- 便于单元测试覆盖
- 可轻松迁移到后端计算场景

**权衡**: 替代方案是类方法，但纯函数更适合数学计算场景

### 2. localStorage 持久化
**原因**:
- 无需后端支持，降低部署复杂度
- 单用户场景足够使用
- 数据格式简单（JSON）

**权衡**: 如需多用户同步，后续可升级为 IndexedDB 或后端存储

### 3. Tailwind CSS v4 原生语法
**原因**:
- Next.js 15 原生支持
- `@import "tailwindcss"` 语法更简洁
- 无需 PostCSS 配置文件

**权衡**: 移除了 `postcss.config.mjs`

---

## 核心算法

### 境界消耗公式

```typescript
// 首境第1层
cost = baseCost

// 首境后续
cost = baseCost × smallMultiplier^(n-1)

// 跨大境界
cost = 前境最后小境界消耗 × largeMultiplier

// 新大境小境界
cost = 跨大境界消耗 × smallMultiplier^n
```

### 崩坏检测规则

**规则1：寿命匹配**
```typescript
if (累计时长 > 境界寿命) {
  alert("[寿命不足] 需X年，但只有Y年");
}
```

**规则2：资源断档**
```typescript
if (单次突破需求 > 灵脉最大年产出) {
  alert("[资源断档] 需X灵石，但灵脉最年产Y");
}
```

### 辅助计算

**转换率**（影响灵石消耗）：
```typescript
转换率 = 天赋 × 悟性 × 功法品质
实际消耗 = 基础消耗 / 转换率
```

**吸收效率**（影响修炼时长）：
```typescript
吸收效率 = 体质 × 环境 × 闭关 × 顿悟
修炼时长 = 资源消耗 / (基础吸收率 × 吸收效率)
```

**资源自给率**：
```typescript
自给率 = 灵脉年产出 / 单次突破需求 × 100%
```

---

## 数据流

```
用户输入参数
    ↓
ParameterPanel (状态更新)
    ↓
calculateAll() (纯函数计算)
    ↓
CalculationResult
    ↓
┌───┴────────────────────┐
↓                       ↓
RealmTable            AlertList
(境界详情)           (崩坏警报)
```

---

## 设计模式

### 纯函数模式
**适用场景**: 数学计算、数据转换

**示例**:
```typescript
export function calculateSubLevelCost(
  baseCost: number,
  smallMultiplier: number,
  largeMultiplier: number,
  realmIndex: number,
  subLevelIndex: number,
  qiCondensationLayers: number
): number {
  // 纯计算，无副作用
}
```

### 受控组件模式
**适用场景**: 表单输入、参数配置

**示例**:
```typescript
<ParameterPanel
  params={params}
  onParamsChange={setParams}
/>
```

### Collapsible 复用组件
**适用场景**: 需要折叠展开的内容区域

**实现**: `CollapsibleSection.tsx` 接收 title、children、defaultOpen 参数

---

## 预设方案配置

| 预设 | 基数 | 小系数 | 大系数 | 转换率 | 吸收效率 | 特点 |
|------|------|--------|--------|--------|----------|------|
| 凡人流 | 12 | 2 | 10 | 1.00 | 1.00 | 经典数值体系 |
| 高武流 | 10 | 1.5 | 5 | 1.50 | 1.25 | 升级较快 |
| 速成流 | 8 | 1.2 | 3 | 2.00 | 1.50 | 极速突破 |
| 困难模式 | 20 | 2.5 | 15 | 0.80 | 0.90 | 资源匮乏 |

---

## 凡人流预设数值

### 境界配置

| 境界 | 小境界 | 寿命 |
|------|--------|------|
| 炼气 | 12层 | 100岁 |
| 筑基 | 4级 | 200岁 |
| 金丹 | 4级 | 500岁 |
| 元婴 | 4级 | 1000岁 |
| 化神 | 4级 | 2000岁 |
| 炼虚 | 4级 | 4000岁 |
| 合体 | 4级 | 8000岁 |
| 大乘 | 4级 | 15000岁 |
| 渡劫 | 4级 | 30000岁 |

### 资源换算

- 档位倍率：下品×1、中品×100、上品×10000、极品×1000000
- 灵矿产出 = 100 × 等级 × 档位倍率
- 灵植物产出 = 灵矿产出 × 0.8

---

## 后续待办

- [x] 添加方案对比功能（已实现：PresetDetailPanel.tsx）
- [x] 支持导出方案为 JSON（已实现：SchemeManager.tsx）
- [x] 添加更多预设方案（已实现：凡人流/高武流/速成流/困难模式）
- [ ] 添加数据可视化图表（消耗曲线图、时间分布图）
- [ ] 支持自定义境界配置（用户可编辑九大境界）
- [ ] 编写单元测试（核心计算函数）
- [ ] 添加方案分享功能（生成分享链接）

---

## 相关文档

- [PLAN.md](./PLAN.md) - 设计意图与实施方案
- [DO.md](./DO.md) - 施工日志与技术决策
- [CHECK.md](./CHECK.md) - 验收清单
