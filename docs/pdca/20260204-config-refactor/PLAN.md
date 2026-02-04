# Plan: 配置参数重构

**日期**: 2026-02-04

---

## 背景与目标

### 要解决的问题
1. **数值不直观**：当前转化率体系数值越小越好（0.22-0.99），显示为 0.0001 非常不直观
2. **系数不可调**：所有转化率、吸收率系数只能选择预设值，无法自定义
3. **配置不持久**：刷新页面后用户配置丢失
4. **灵脉倍率固定**：中品=100倍、上品=10K倍硬编码，无法调整
5. **筑基指数爆炸**：炼气→筑基使用统一大境界系数容易导致数值失控
6. **标题不够显眼**：转化率/吸收率区域标题样式平淡，不易区分
7. **结果位置不佳**：最终计算结果显示在尾部，不够醒目

### 预期成果
- 转化率公式反转，数值越大越直观（×3.33 而非 0.3）
- 所有系数支持自定义输入（0.1-999范围）
- 配置自动保存，刷新自动恢复
- 灵脉进位倍率可配置
- 筑基境界使用独立倍率系数
- 区域标题更醒目（字号+背景装饰）
- 最终计算结果显示在标题后方

---

## 实施方案

### 1. 数据层设计

#### 1.1 类型定义扩展

```typescript
// lib/types/index.ts 新增

/**
 * 系数配置（覆盖预设值）
 */
export interface CoefficientOverrides {
  // 转化率维度
  techniqueQuality?: number;      // 功法品质系数
  spiritualRootCoeff?: number;    // 灵根系数
  // 吸收效率维度
  comprehension?: number;         // 悟性系数
  physiqueFactor?: number;        // 体系数
  environmentFactor?: number;     // 环境系数
  retreatFactor?: number;         // 闭关系数
  epiphanyFactor?: number;        // 顿悟系数
}

/**
 * 扩展计算参数
 */
export interface ExtendedCalculationParams extends CalculationParams {
  // 新增系数
  foundationBuildingMultiplier?: number;  // 筑基倍率（独立于大境界系数）
  mediumGradeMultiplier?: number;         // 灵脉中品进位倍率（默认100）
  // 系数覆盖
  coefficientOverrides?: CoefficientOverrides;
}

/**
 * 自动保存的配置
 */
export interface AutoSavedConfig {
  params: CalculationParams;
  resource: ResourceConfig;
  savedAt: number;
}
```

#### 1.2 存储 API

```typescript
// lib/storage/auto-config.ts

const STORAGE_KEY = 'cultivation-calculator-current-config';

export function saveAutoConfig(config: AutoSavedConfig): void;
export function loadAutoConfig(): AutoSavedConfig | null;
export function clearAutoConfig(): void;
```

---

### 2. 组件层设计

#### 2.1 组件结构

| 组件 | 职责 |
|------|------|
| `ParameterPanel` | 主容器，管理状态和事件 |
| `ConfigInput` | 新增：通用系数输入框组件 |
| `SectionTitle` | 新增：带背景装饰的区域标题组件 |

#### 2.2 交互流程

```
用户输入 → ConfigInput 更新 → coefficientOverrides 设置 → 计算时优先使用覆盖值
                                              ↓
                                    自动保存到 localStorage
                                              ↓
                                  标题显示最终计算结果
```

---

### 3. 核心计算逻辑调整

#### 3.1 公式反转

```typescript
// 旧公式
conversionRate = techniqueQuality × spiritualRootCoeff
cost = rawCost × conversionRate

// 新公式
conversionRate = techniqueQuality × spiritualRootCoeff
cost = rawCost / conversionRate  // 除法而非乘法
```

#### 3.2 预设值映射

| 旧值 | 新值（反转后） | 说明 |
|------|----------------|------|
| 0.22 | 4.55 | 天阶上 |
| 0.34 | 2.94 | 天阶中 |
| 0.45 | 2.22 | 地阶上 |
| 0.64 | 1.56 | 地阶中 |
| 0.72 | 1.39 | 地阶下 |
| 0.79 | 1.27 | 玄阶上 |
| 0.85 | 1.18 | 玄阶中 |
| 0.90 | 1.11 | 玄阶下 |
| 0.94 | 1.06 | 黄阶上 |
| 0.97 | 1.03 | 黄阶中 |
| 0.99 | 1.01 | 黄阶下 |

| 灵根 | 旧系数 | 新系数 |
|------|--------|--------|
| 废灵根 | 1.0 | 1.00 |
| 杂灵根 | 0.9 | 1.11 |
| 三灵根 | 0.8 | 1.25 |
| 双灵根 | 0.6 | 1.67 |
| 天灵根 | 0.3 | 3.33 |

#### 3.3 筑基独立倍率

```typescript
// 计算跨境界消耗时
if (realmName === '筑基' && foundationBuildingMultiplier) {
  realmBaseCost = firstRealmLastCost * foundationBuildingMultiplier;
} else {
  realmBaseCost = firstRealmLastCost * Math.pow(largeRealmMultiplier, realmIndex - 1);
}
```

---

## 实施步骤

1. **类型定义**：扩展 `CalculationParams`，新增 `CoefficientOverrides`、`AutoSavedConfig`
2. **存储层**：实现 `lib/storage/auto-config.ts`
3. **计算核心**：
   - 反转 `calculateConversionRate` 公式（乘法→除法）
   - 添加筑基独立倍率逻辑
   - 支持系数覆盖优先级
4. **预设更新**：更新 `presets.ts` 中所有预设值为新体系
5. **组件开发**：
   - 创建 `ConfigInput` 组件
   - 创建 `SectionTitle` 组件
   - 重构 `ParameterPanel` 集成新组件
6. **持久化集成**：在 `CultivationCalculator` 中加载/保存自动配置

---

## 技术约束

- 必须保持向后兼容：旧 localStorage 数据需要迁移
- 系数覆盖值优先级高于预设按钮
- 输入范围限制：0.1-999，超过范围自动修正
- 公式反转后需要保证计算精度

---

## 风险与对策

| 风险 | 对策 |
|-----|------|
| 旧数据兼容性问题 | 在 `getAllSchemes()` 中添加旧值转换逻辑 |
| 公式反转导致数值溢出 | 添加数值检查，超过上限时显示"∞" |
| 用户输入非法值 | 输入框 `min="0.1" max="999"` + onChange 校验 |
| 自动配置与预设冲突 | 选择预设时提示"将覆盖当前配置" |
| 筑基倍率未设置时 | 默认使用 `largeRealmMultiplier` |

---

## 预期成果（定量）

- 功能完整性：100%（7个需求点全覆盖）
- 数值直观性：提升 100%（从 0.0001 变为 ×10000）
- 配置灵活度：从固定6-12个选项 → 0.1-999连续可调
- 用户体验：刷新不丢配置，减少重复输入
