# Plan: 选项级可编辑功能扩展

**日期**: 2026-02-04

---

## 背景与目标

### 要解决的问题
1. 功法品质选项已支持独立编辑，但灵根类型和吸收效率各小项仍为固定值
2. 用户需要调整预设选项的值（如将"聪慧"从 1.5 改为 1.8），而非添加额外自定义值
3. 当前公式显示过长，UI 拥挤

### 预期成果
- 灵根类型的每个 coefficient 可编辑
- 吸收效率5个小项（悟性/体质/环境/闭关/顿悟）的每个选项值可编辑
- 编辑交互简化：移除确认按钮，保留取消按钮，回车确认
- 公式显示优化：标题栏只显示结果，小分类标题后显示当前值

---

## 实施方案

### 1. 数据层设计

#### 1.1 类型扩展（lib/types/index.ts）

```typescript
// UserOverrides 新增字段
export interface UserOverrides {
  // ... 现有字段

  // 灵根类型各选项的自定义值
  spiritualRootOptionValues?: Record<string, number>; // { 'waste': 1.0, 'dual': 1.8, ... }

  // 吸收效率各小项的选项自定义值
  comprehensionOptionValues?: Record<string, number>;    // { '0.5': 0.6, '1.5': 1.8, ... }
  physiqueOptionValues?: Record<string, number>;         // { '0.8': 0.9, '1.5': 1.7, ... }
  environmentOptionValues?: Record<string, number>;      // { '0.5': 0.8, '3.0': 4.0, ... }
  retreatOptionValues?: Record<string, number>;          // { '0.8': 0.9, '2.0': 2.5, ... }
  epiphanyOptionValues?: Record<string, number>;         // { '1.0': 1.2, '3.0': 4.0, ... }
}
```

#### 1.2 预设选项迁移（lib/data/presets.ts）

将组件内定义的选项数组迁移到 `presets.ts`，添加 `id` 字段：

```typescript
// 灵根选项（已存在，需添加 id）
export const SPIRITUAL_ROOT_OPTIONS = [
  { id: 'waste', value: 'waste' as const, label: '废灵根', sublabel: '五灵根', coefficient: 1.0, color: 'text-red-600' },
  { id: 'mixed', value: 'mixed' as const, label: '杂灵根', sublabel: '四灵根', coefficient: 1.11, color: 'text-orange-600' },
  // ...
];

// 吸收效率选项（新增）
export const COMPREHENSION_OPTIONS = [
  { id: 'comprehension-0.5', value: 0.5, label: '愚笨', color: 'text-red-600' },
  { id: 'comprehension-0.8', value: 0.8, label: '迟钝', color: 'text-orange-600' },
  { id: 'comprehension-1.0', value: 1.0, label: '普通', color: 'text-gray-600' },
  { id: 'comprehension-1.5', value: 1.5, label: '聪慧', color: 'text-green-600' },
  { id: 'comprehension-2.0', value: 2.0, label: '悟性高', color: 'text-blue-600' },
  { id: 'comprehension-3.0', value: 3.0, label: '顿悟', color: 'text-purple-600' },
];

// 其他选项类似...
```

### 2. 组件层设计

#### 2.1 通用可编辑选项组件

抽象可编辑选项的逻辑，支持：
- 悬浮显示值
- 右上角编辑/取消按钮
- 内联编辑输入框
- 回车确认、ESC 取消
- 自定义标记（蓝点）

#### 2.2 公式显示优化

| 位置 | 当前 | 优化后 |
|------|------|--------|
| 转换率标题栏 | `功法×灵根 = 1.30 × 1.00 = 1.30` | `功法×灵根 = 1.30` |
| 小分类标题 | `功法品质` | `功法品质 1.30` |
| 吸收效率标题栏 | `悟性×...×顿悟 = 0.5 × 1.0 × ... = 2.5` | `悟性×...×顿悟 = 2.5` |

### 3. 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                    用户点击编辑按钮                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ 进入编辑模式           │
                │ - 显示输入框           │
                │ - 显示取消按钮         │
                └───────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │ 回车确认       │       │ 点击取消/ESC   │
        └───────────────┘       └───────────────┘
                │                       │
                ▼                       ▼
        ┌───────────────┐       ┌───────────────┐
        │ saveOptionValue│     │ 退出编辑模式   │
        │ 更新 localStorage│    │ 恢复原值       │
        │ + 更新当前 params │  │               │
        └───────────────┘       └───────────────┘
```

---

## 实施步骤

1. **类型定义**：扩展 UserOverrides，添加各选项的值存储字段
2. **预设数据迁移**：将组件内选项数组迁移到 presets.ts，添加 id 字段
3. **组件重构**：
   - 抽取通用可编辑选项逻辑
   - 简化编辑按钮（移除确认，保留取消）
   - 优化公式显示
4. **同步功法部分**：应用相同的编辑交互简化
5. **测试验证**：确认各选项编辑功能正常

---

## 技术约束

- 保持 localStorage 存储结构兼容性
- 现有预设配置不受影响
- 编辑模式不影响选中状态切换

---

## 风险与对策

| 风险 | 对策 |
|-----|------|
| 选项数组迁移后引用路径变化 | 统一从 `@/lib/data/presets` 导入 |
| 存储字段过多影响性能 | 只存储修改过的值（稀疏存储） |
| 编辑模式与选中切换冲突 | 编辑时禁用点击切换功能 |

---

## 预期成果（定量）

- 可编辑选项数量：从 12 个（功法）增加到 48 个（功法+灵根+吸收效率5小项）
- UI 简化：每个选项减少 1 个按钮（确认）
- 标题栏字符数：减少约 40%
