# Do: 数据存储模式重构

**日期**: 2026-02-04

---

## 实施日志

### 2026-02-04 12:55 实施记录

**操作**: 重构数据存储模式，实现细粒度 localStorage 配置存储

| 文件 | 修改内容 |
|------|---------|
| `lib/types/index.ts` | 新增 UserOverrides 和 CurrentPresetInfo 类型 |
| `lib/storage/user-config.ts` | 新建用户配置存储模块，支持细粒度覆盖 |
| `components/CultivationCalculator.tsx` | 移除 SchemeManager 引用，使用新存储 API |
| `components/ParameterPanel.tsx` | 移除 CoefficientOverrides 逻辑，添加细粒度更新回调 |
| `components/SchemeManager.tsx` | 删除方案管理组件 |
| `lib/storage/schemes.ts` | 删除方案存储功能 |

**关键变更**:

```typescript
// 新的细粒度存储接口
export function setUserOverride<K extends keyof UserOverrides>(
  key: K,
  value: UserOverrides[K]
): void;

// 配置构建：预设 + 覆盖值
export function buildParams(preset: PresetConfig): CalculationParams;
```

**无错误**

---

## 关键代码片段

### UserOverrides 类型定义

```typescript
export interface UserOverrides {
  // 基础参数（大类）
  baseCost?: number;
  smallRealmMultiplier?: number;
  largeRealmMultiplier?: number;
  foundationBuildingMultiplier?: number;
  qiCondensationLayers?: number;
  baseAbsorptionRate?: number;
  mediumGradeMultiplier?: number;

  // 小类互斥选项（存储选中值）
  techniqueQuality?: number;
  spiritualRootType?: SpiritualRootType;

  // 吸收效率（大类）
  comprehension?: number;
  physiqueFactor?: number;
  environmentFactor?: number;
  retreatFactor?: number;
  epiphanyFactor?: number;

  // 灵脉资源（大类）
  mineGrade?: ResourceGrade;
  mineLevel?: number;
  plantGrade?: ResourceGrade;
  plantLevel?: number;
}
```

### 数据迁移逻辑

```typescript
// 从旧的 auto-config 迁移数据
export function migrateFromAutoConfig(): boolean {
  // 提取所有非默认值作为覆盖值
  // 只有存在覆盖值时才保存
  if (Object.keys(overrides).length > 0) {
    setUserOverrides(overrides);
  }
  setCurrentPreset('custom');
  localStorage.removeItem(OLD_KEY);
  return true;
}
```

---

## 实施时间统计

| 阶段 | 预计 | 实际 | 状态 |
|------|------|------|------|
| 类型定义 | - | 10min | ✅ |
| 存储模块 | - | 20min | ✅ |
| 组件重构 | - | 30min | ✅ |
| 构建验证 | - | 10min | ✅ |
| **总计** | - | ~70min | ✅ |

---

## 技术决策记录

### 1. 预设方案降级为初始化模板
**原因**:
- 用户配置应全部存储在 localStorage
- 预设仅用于新项目初始化或切换预设时

### 2. 细粒度存储替代完整配置存储
**原因**:
- 用户修改单个参数时只需存储该参数
- 减少 localStorage 数据大小
- 支持用户自定义小类选项

### 3. 保留 CoefficientOverrides 类型定义
**原因**:
- 计算核心 (`lib/calculator/core.ts`) 仍使用该类型
- 保持向后兼容性

---

## 待优化事项

1. [ ] 考虑添加"恢复默认值"按钮（清除单个覆盖值）
2. [ ] 考虑添加"导出配置"功能（JSON 格式）

---

### 2026-02-04 14:30 实施记录

**操作**: 实现功法品质选项级别的直接编辑功能

| 文件 | 修改内容 |
|------|---------|
| `lib/types/index.ts` | UserOverrides 新增 techniqueOptionValues 字段 |
| `lib/data/presets.ts` | TECHNIQUE_OPTIONS 新增 id 字段 |
| `components/ParameterPanel.tsx` | 重写功法品质区域，添加编辑图标、内联编辑、蓝点指示器 |
| `components/CultivationCalculator.tsx` | 新增 userOverrides 状态和 handleSetUserOverride 回调 |

**关键代码**:

```typescript
// UserOverrides 新增选项值覆盖
techniqueOptionValues?: Record<string, number>; // { 'yellow-inferior': 1.1, ... }

// 获取自定义值
const getTechniqueOptionValue = (id: string, defaultValue: number): number => {
  return userOverrides.techniqueOptionValues?.[id] ?? defaultValue;
};

// 保存自定义值
const saveTechniqueOptionValue = (id: string, value: number) => {
  const techniqueOptionValues = {
    ...userOverrides.techniqueOptionValues,
    [id]: value,
  };
  onSetUserOverride('techniqueOptionValues' as any, techniqueOptionValues);
};
```

**UI 变更**:
- 每个功法品质选项按钮右上角添加编辑图标（悬浮显示）
- 点击编辑图标进入编辑模式，显示数字输入框
- 编辑模式下显示保存/取消按钮
- 自定义过的选项显示蓝点指示器
- 添加提示文本："💡 点击编辑图标可修改该项数值 • 蓝点表示已自定义"

**无错误**

---

### 2026-02-04 15:00 实施记录

**操作**: 转换率和吸收效率区域显示动态计算公式

| 文件 | 修改内容 |
|------|---------|
| `components/ParameterPanel.tsx` | 新增 conversionRateFormula 和 absorptionRateFormula 计算 |

**关键代码**:

```typescript
// 转换率公式动态显示
description={`功法 × 灵根 = ${conversionRateFormula.technique} × ${conversionRateFormula.root} = ${conversionRateFormula.result}`}

// 吸收效率公式动态显示
description={`悟性 × 体质 × 环境 × 闭关 × 顿悟 = ${absorptionRateFormula.values} = ${absorptionRateFormula.result}`}
```

**效果**: SectionTitle 的 description 现在显示当前选中选项的实际数值和计算结果，而非静态文字

**无错误**
