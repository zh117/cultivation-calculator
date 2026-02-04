# Plan: 数据存储模式重构

## 背景与目标

### 要解决的问题
1. **预设方案与用户配置混淆**：当前预设方案包含完整配置，用户修改后无法区分哪些是预设值、哪些是自定义值
2. **方案管理功能冗余**：`SchemeManager` 提供的保存/加载功能实际上用不到
3. **配置项存储粒度不足**：用户修改某个系数时，无法精确记录哪个小类项被修改

### 预期成果
- 预设方案仅用于初始化，不再作为完整配置源
- 用户配置全部存储在 localStorage，支持细粒度覆盖
- 移除 SchemeManager 组件及其相关代码
- 系统读取配置时优先使用 localStorage 中的覆盖值

## 大类与小类定义

### 大类（一对一配置项）
- 基础参数：`baseCost`, `smallRealmMultiplier`, `largeRealmMultiplier`, `qiCondensationLayers`, `baseAbsorptionRate`
- 吸收效率：`comprehension`, `physiqueFactor`, `environmentFactor`, `retreatFactor`, `epiphanyFactor`
- 灵脉资源：`mineType`, `mineGrade`, `mineLevel`, `plantGrade`, `plantLevel`
- 可选倍率：`foundationBuildingMultiplier`, `mediumGradeMultiplier`

### 小类（互斥选项）
- **功法品质**：12 个选项互斥，用户选中一个生效
- **灵根类型**：5 个选项互斥，用户选中一个生效
- **吸收速度**：8 个选项互斥
- **悟性**：6 个选项互斥
- **体质**：5 个选项互斥
- **环境**：8 个选项互斥
- **闭关**：4 个选项互斥
- **顿悟**：5 个选项互斥
- **资源档位**：4 个选项互斥

## 实施方案

### 1. 数据层设计

#### 新的 localStorage 结构

```typescript
// 用户自定义配置存储（新增）
interface UserOverrides {
  // 基础参数（大类）
  baseCost?: number;
  smallRealmMultiplier?: number;
  largeRealmMultiplier?: number;
  foundationBuildingMultiplier?: number;
  qiCondensationLayers?: number;
  baseAbsorptionRate?: number;
  mediumGradeMultiplier?: number;

  // 小类互斥选项（存储选中值）
  selectedTechniqueQuality?: number;      // 功法品质选中值
  selectedSpiritualRootType?: string;     // 灵根类型选中值

  // 吸收效率（大类）
  comprehension?: number;
  physiqueFactor?: number;
  environmentFactor?: number;
  retreatFactor?: number;
  epiphanyFactor?: number;

  // 灵脉资源（大类）
  mineGrade?: string;
  mineLevel?: number;
  plantGrade?: string;
  plantLevel?: number;
}

// 当前选择的预设 ID
interface CurrentPreset {
  presetId: string;
  updatedAt: number;
}
```

#### 存储 Key 设计
- `cultivation-current-preset`：当前选择的预设 ID
- `cultivation-user-overrides`：用户自定义的覆盖值

### 2. 组件层设计

#### 移除组件
- `components/SchemeManager.tsx` - 删除
- `lib/storage/schemes.ts` - 删除方案存储功能

#### 修改组件
- `components/CultivationCalculator.tsx`：
  - 移除 `SchemeManager` 引用
  - 移除 `handleLoadScheme` 函数
  - 修改初始化逻辑：先检查 localStorage，完备则使用，否则用预设初始化
  - 修改参数更新逻辑：直接写入 localStorage

- `components/ParameterPanel.tsx`：
  - 移除 `coefficientOverrides` 相关逻辑
  - 小类选项点击时直接更新 params

### 3. 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                      应用启动                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 读取 localStorage      │
                │ - currentPreset       │
                │ - userOverrides       │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ userOverrides 完备?   │
                └───────────────────────┘
                     │            │
                    是            否
                     │            │
                     ▼            ▼
        ┌────────────────┐  ┌─────────────────┐
        │ 使用覆盖值构建  │  │ 用预设初始化    │
        │ CalculationParams│ │ (写入默认值)   │
        └────────────────┘  └─────────────────┘
                     │            │
                     └──────┬─────┘
                            ▼
                ┌───────────────────────┐
                │  渲染界面             │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 用户修改参数           │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 写入 localStorage      │
                │ (细粒度更新对应项)     │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 重新计算 + 渲染        │
                └───────────────────────┘
```

### 4. 新的存储 API 设计

```typescript
// lib/storage/user-config.ts (新文件)

/**
 * 获取当前预设 ID
 */
export function getCurrentPreset(): string

/**
 * 设置当前预设 ID
 */
export function setCurrentPreset(presetId: string): void

/**
 * 获取用户覆盖值
 */
export function getUserOverrides(): UserOverrides

/**
 * 更新单个覆盖值（细粒度）
 */
export function setUserOverride<K extends keyof UserOverrides>(
  key: K,
  value: UserOverrides[K]
): void

/**
 * 清除单个覆盖值（恢复预设默认值）
 */
export function clearUserOverride<K extends keyof UserOverrides>(
  key: K
): void

/**
 * 清除所有覆盖值
 */
export function clearAllUserOverrides(): void

/**
 * 构建完整的 CalculationParams
 * 优先级：userOverrides > preset
 */
export function buildParams(
  preset: PresetConfig
): CalculationParams
```

## 技术约束
- 必须保持 `CoefficientOverrides` 类型的向后兼容（用于计算逻辑）
- 纯函数计算核心 (`lib/calculator/core.ts`) 不受影响
- 现有的 `loadAutoConfig` 需要迁移到新的存储结构

## 风险与对策

| 风险 | 对策 |
|-----|------|
| 用户已有保存的方案可能失效 | 提供一次性迁移逻辑，将已存方案转为 userOverrides |
| localStorage 数据损坏 | 添加 try-catch 和数据校验，损坏时回退到预设 |
| 删除 SchemeManager 后 UI 空白 | 确保菜单布局调整正确 |

## 预期成果（定量）
- 删除代码行数：约 350 行（SchemeManager + schemes.ts）
- 新增代码行数：约 200 行（user-config.ts）
- 用户可自定义配置项：从 7 个系数覆盖 → 所有配置项
- localStorage 数据大小：减少约 60%（不再存储完整方案）
