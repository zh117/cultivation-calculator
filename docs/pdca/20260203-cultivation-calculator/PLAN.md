# Plan: 修仙世界观量化计算器

**日期**: 2026-02-03

---

## 背景与目标

### 要解决的问题
1. **数值崩坏检测困难**：修仙小说作者难以判断其数值体系是否自洽，后期是否存在数值失控
2. **缺乏参考基准**：没有一套经典的、自洽的凡人流数值作为设计起点
3. **参数调整繁琐**：修改一个参数需要重新计算所有关联数值，手工计算效率低
4. **无法方案对比**：难以同时对比多套方案的差异

### 预期成果
- 提供经典的"凡人流"预设数值作为基准
- 实时计算境界消耗、修炼时长、资源需求
- 自动检测寿命匹配度和资源断档问题
- 支持方案保存和对比功能

---

## 实施方案

### 1. 数据层设计

#### 1.1 核心数据模型
```typescript
// 境界配置
interface RealmConfig {
  name: string;           // 境界名称
  subLevels: SubLevel[];  // 小境界列表
  lifespan: number;       // 寿命上限（年）
}

interface SubLevel {
  name: string;  // 小境界名称（如"前期"、"中期"等）
  index: number; // 层级索引
}

// 数值参数
interface CalculationParams {
  baseCost: number;           // 基数（灵石）
  smallRealmMultiplier: number; // 小境界系数
  largeRealmMultiplier: number; // 大境界系数

  // 速度系数
  techniqueQuality: number;  // 功法品质
  environmentFactor: number; // 修炼环境
  physiqueFactor: number;   // 体质血脉
  retreatFactor: number;    // 闭关状态
  epiphanyFactor: number;   // 顿悟系数
}

// 资源配置
interface ResourceConfig {
  mineType: 'mine' | 'plant';
  mineGrade: 'inferior' | 'medium' | 'superior' | 'extreme';
  mineLevel: number; // 1-9
}

// 计算结果
interface CalculationResult {
  realms: RealmResult[];
  alerts: Alert[];
  resourceSelfSufficiency: number;
}

interface RealmResult {
  realmName: string;
  subLevelName: string;
  cost: number;           // 资源消耗
  duration: number;       // 修炼时长（年）
  cumulativeDuration: number; // 累计时长
  lifespanRemaining: number;  // 剩余寿命
}

interface Alert {
  type: 'lifespan' | 'resource' | 'exponential';
  realm: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
}
```

#### 1.2 核心计算函数
```typescript
// 纯函数：计算小境界消耗
function calculateSubLevelCost(
  baseCost: number,
  smallMultiplier: number,
  largeMultiplier: number,
  realmIndex: number,
  subLevelIndex: number,
  isFirstRealm: boolean
): number;

// 纯函数：计算修炼时长
function calculateDuration(
  cost: number,
  baseAbsorptionRate: number,
  efficiencyFactors: EfficiencyFactors
): number;

// 纯函数：崩坏检测
function checkCollapse(
  results: RealmResult[],
  maxResourceOutput: number
): Alert[];
```

### 2. 组件层设计

#### 2.1 组件结构
| 组件 | 职责 |
|------|------|
| CalculatorLayout | 主布局容器 |
| ParameterPanel | 参数设置面板（可折叠分组） |
| ResultPanel | 计算结果展示面板 |
| RealmTable | 境界耗时表格 |
| AlertList | 崩坏警报列表 |
| PresetSelector | 预设方案选择器 |
| SchemeManager | 方案保存/加载管理器 |
| SchemeComparison | 方案对比视图 |

#### 2.2 交互流程
```
用户选择预设 → 加载参数 → 自动计算 → 展示结果
     ↓
用户修改参数 → 触发重算 → 更新结果
     ↓
用户保存方案 → 存储到 localStorage → 添加到方案列表
     ↓
用户选择对比方案 → 并排展示多套方案数据
```

### 3. 数据流

```
用户输入 → ParameterPanel → 计算纯函数 → CalculationResult
                                              ↓
                                          ResultPanel
                                              ↓
                                    ┌─────────┴─────────┐
                            RealmTable    AlertList    图表
```

### 4. 预设方案配置

```typescript
const PRESETS: Record<string, PresetConfig> = {
  mortal: {
    name: "凡人流",
    params: {
      baseCost: 12,
      smallRealmMultiplier: 2,
      largeRealmMultiplier: 10,
      techniqueQuality: 1.0,
      environmentFactor: 1.0,
      physiqueFactor: 1.0,
      retreatFactor: 1.0,
      epiphanyFactor: 1.0,
    },
    resource: {
      mineType: 'mine',
      mineGrade: 'inferior',
      mineLevel: 3,
    }
  },
  // 可扩展其他预设
};
```

---

## 实施步骤

1. **类型定义**：建立完整的 TypeScript 类型系统
2. **计算核心**：实现纯函数计算逻辑
3. **UI 组件**：构建参数面板和结果展示组件
4. **状态管理**：实现参数状态和计算结果管理
5. **方案管理**：实现保存/加载/对比功能
6. **测试验证**：验证计算正确性和崩坏检测准确性

---

## 技术约束

- **Next.js 15** + **React 19** + **TypeScript**
- **Tailwind CSS** 用于样式
- 计算逻辑必须是纯函数，便于测试
- 使用 localStorage 持久化方案配置
- 不依赖外部图表库（初期使用表格/进度条）

---

## 风险与对策

| 风险 | 对策 |
|-----|------|
| 计算公式复杂，易出错 | 编写单元测试覆盖核心计算函数 |
| 用户不理解参数含义 | 添加参数说明tooltip和预设方案 |
| 数值过大导致显示问题 | 使用数值格式化（如"1.2万"） |
| 方案数据结构变更导致旧数据失效 | 版本化存储结构，支持迁移 |

---

## 预期成果（定量）

- 功能完整性：100%（所有需求规格功能实现）
- 核心计算测试覆盖率：≥90%
- 支持预设方案：≥3套（凡人流、高武流、速成流）
- 崩坏检测准确率：100%（规则1、2无误报漏报）

---

## 附录：凡人流预设数值

| 参数 | 值 |
|------|-----|
| 基数 | 12 下品灵石 |
| 小境界系数 | 2 |
| 大境界系数 | 10 |
| 炼气层数 | 12层 |
| 其他境界 | 前/中/后/大圆满（4级） |

### 境界寿命

| 境界 | 寿命 |
|------|------|
| 炼气 | 100岁 |
| 筑基 | 200岁 |
| 金丹 | 500岁 |
| 元婴 | 1000岁 |
| 化神 | 2000岁 |
| 炼虚 | 4000岁 |
| 合体 | 8000岁 |
| 大乘 | 15000岁 |
| 渡劫 | 30000岁 |
