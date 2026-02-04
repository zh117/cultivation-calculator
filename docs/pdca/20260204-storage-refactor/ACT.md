# Act: 数据存储模式重构

## 一句话概述

重构配置存储模式：预设仅作初始化模板，用户配置细粒度存储在 localStorage，支持选项级别自定义。

---

## 涉及文件

| 文件 | 职责 |
|------|------|
| `lib/types/index.ts` | 新增 UserOverrides 类型，支持细粒度配置覆盖 |
| `lib/storage/user-config.ts` | 用户配置存储模块，预设+覆盖值合并逻辑，数据迁移 |
| `lib/storage/auto-config.ts` | 旧版配置存储（保留用于迁移） |
| `lib/data/presets.ts` | TECHNIQUE_OPTIONS 新增 id 字段，支持选项级别自定义 |
| `components/CultivationCalculator.tsx` | 移除 SchemeManager，使用新存储 API |
| `components/ParameterPanel.tsx` | 功法品质选项内联编辑，动态公式显示 |
| `components/SchemeManager.tsx` | **已删除** - 方案保存/加载功能 |
| `lib/storage/schemes.ts` | **已删除** - 方案存储功能 |

---

## 架构决策

### 1. 预设降级为初始化模板
**原因**: 用户配置应全部持久化，预设只用于初始化和切换基准

### 2. 细粒度存储替代完整配置存储
**原因**:
- 减少 localStorage 数据大小约 60%
- 用户修改单个参数时只存储该参数
- 支持选项级别的自定义（如单独修改"黄阶下"的系数）

### 3. 功法品质选项级自定义
**原因**: 用户需要编辑预设选项的值（如将"黄阶下"从 1.01 改为 1.1），而非添加额外自定义值

### 4. 嵌套按钮修复
**原因**: HTML 不允许 `<button>` 嵌套，将外层改为 `<div role="button">` 并添加键盘支持

---

## 设计模式

### 策略模式 - 预设 + 覆盖值合并
**适用场景**: 需要提供默认值同时支持用户自定义覆盖

```typescript
export function buildParams(preset: PresetConfig): CalculationParams {
  const overrides = getUserOverrides();
  return {
    ...preset.params,
    ...overrides, // 覆盖值优先
    // 小类选项处理
    techniqueQuality: overrides.techniqueQuality ?? preset.params.techniqueQuality,
    spiritualRootType: overrides.spiritualRootType ?? preset.params.spiritualRootType,
  };
}
```

### 选项级自定义模式
**适用场景**: 预设选项本身需要可编辑

```typescript
// UserOverrides 支持
techniqueOptionValues?: Record<string, number>; // { 'yellow-inferior': 1.1, ... }

// 获取时优先使用自定义值
const getTechniqueOptionValue = (id: string, defaultValue: number): number => {
  return userOverrides.techniqueOptionValues?.[id] ?? defaultValue;
};
```

---

## 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                      应用启动                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 尝试数据迁移          │
                │ - auto-config        │
                │ - schemes            │
                └───────────────────────┘
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
                │ buildParams()         │
                │ 预设 + 覆盖值合并      │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │  渲染界面              │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 用户修改参数           │
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ setUserOverride()     │
                │ 细粒度更新 localStorage│
                └───────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 重新计算 + 渲染        │
                └───────────────────────┘
```

---

## localStorage 结构

| Key | 类型 | 说明 |
|-----|------|------|
| `cultivation-current-preset` | string | 当前选择的预设 ID |
| `cultivation-user-overrides` | UserOverrides | 用户自定义的覆盖值（只存修改过的项） |
| `cultivation-auto-config` *(已废弃)* | AutoSavedConfig | 旧版自动保存（迁移后可删除） |
| `cultivation-calculator-schemes` *(已废弃)* | SavedScheme[] | 旧版方案列表（迁移后可删除） |

---

## Bug 修复记录

| Bug | 原因 | 解决 |
|-----|------|------|
| 预设切换后用户修改丢失 | loadPreset 直接使用 preset.params，未合并覆盖值 | 改用 buildParams/buildResource |
| React Hook useMemo 依赖警告 | 依赖数组使用对象解构 | 直接使用 params.xxx 形式 |
| HTML 嵌套按钮错误 | `<button>` 内嵌套编辑按钮 | 外层改为 `<div role="button">` |

---

## 后续待办

- [ ] 添加"恢复单个参数默认值"功能
- [ ] 添加"导出配置"功能（JSON 格式）
- [ ] 用户测试：验证数据持久化功能
- [ ] 考虑清理已迁移的旧版 localStorage 数据

---

## 相关文档

- [PLAN.md](./PLAN.md) - 设计意图与数据流
- [DO.md](./DO.md) - 施工日志与技术决策
- [CHECK.md](./CHECK.md) - 验收清单与 Bug 修复记录
