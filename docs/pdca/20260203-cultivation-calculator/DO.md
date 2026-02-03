# Do: 修仙世界观量化计算器

**日期**: 2026-02-03

---

## 实施日志

### 2026-02-03 核心功能实现完成

**操作**: 完成完整的修仙世界观量化计算器实现

| 文件 | 修改内容 |
|------|---------|
| `lib/types/index.ts` | 建立完整的 TypeScript 类型系统 |
| `lib/data/presets.ts` | 实现 4 套预设方案（凡人流、高武流、速成流、困难模式） |
| `lib/data/realms.ts` | 九大境界配置数据 |
| `lib/calculator/core.ts` | 核心计算函数（纯函数） |
| `lib/storage/schemes.ts` | 方案存储管理（localStorage） |
| `components/CollapsibleSection.tsx` | 可折叠面板组件 |
| `components/ParameterPanel.tsx` | 参数设置面板 |
| `components/AlertList.tsx` | 崩坏警报列表 |
| `components/RealmTable.tsx` | 境界耗时表格 |
| `components/SchemeManager.tsx` | 方案保存/加载管理 |
| `components/CultivationCalculator.tsx` | 主计算器组件（状态管理） |
| `app/page.tsx` | 主页面 |
| `app/layout.tsx` | 布局更新 |
| `postcss.config.mjs` | 移除（适配 Tailwind CSS v4） |

**关键功能**:
- 境界消耗指数计算（小境界系数、大境界系数）
- 寿命匹配检测（规则1）
- 资源断档检测（规则2）
- 预设方案一键切换
- 方案保存/加载/删除

**无错误**: 编译成功，开发服务器运行于 http://localhost:3001

---

## 项目结构

```
Cultivation-Calculator/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css         # Tailwind CSS v4
├── components/
│   ├── CultivationCalculator.tsx  # 主计算器
│   ├── ParameterPanel.tsx         # 参数面板
│   ├── AlertList.tsx              # 警报列表
│   ├── RealmTable.tsx             # 境界表格
│   ├── SchemeManager.tsx          # 方案管理
│   └── CollapsibleSection.tsx     # 折叠面板
├── lib/
│   ├── types/index.ts      # 类型定义
│   ├── calculator/core.ts  # 核心计算
│   ├── data/presets.ts     # 预设方案
│   ├── data/realms.ts      # 境界配置
│   └── storage/schemes.ts  # 方案存储
└── docs/pdca/
    └── 20260203-cultivation-calculator/  # PDCA 文档
```

---

## 核心算法说明

### 境界消耗计算

```
首境第1层 = baseCost
首境后续 = baseCost × smallMultiplier^(n-1)

跨大境界 = 前境最后小境界 × largeMultiplier
新大境小境界 = 跨大境界消耗 × smallMultiplier^n
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

---

## 技术决策记录

### 1. 使用纯函数计算
**原因**:
- 便于单元测试
- 无副作用，结果可预测
- 便于后续扩展（如后端计算）

### 2. localStorage 持久化
**原因**:
- 无需后端支持
- 简单易用
- 满足单用户场景

### 3. Tailwind CSS v4
**原因**:
- Next.js 15 默认支持
- 新的 `@import "tailwindcss"` 语法更简洁
- 无需 PostCSS 配置

---

## 待优化事项

1. [ ] 添加方案对比功能
2. [ ] 添加数据可视化图表
3. [ ] 支持导出方案为 JSON/图片
4. [ ] 添加更多预设方案
5. [ ] 支持自定义境界配置
