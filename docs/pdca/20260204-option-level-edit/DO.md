# Do: 选项级可编辑功能扩展

**日期**: 2026-02-04

---

## 实施日志

### 2026-02-04 实施记录

**操作**: 扩展选项级可编辑功能到灵根类型和吸收效率各小项，简化编辑交互，优化公式显示

| 文件 | 修改内容 |
|------|---------|
| `lib/types/index.ts` | 扩展 UserOverrides，添加灵根和吸收效率各小项的选项值存储字段 |
| `lib/data/presets.ts` | 添加吸收效率各小项的选项数组（COMPREHENSION_OPTIONS/PHYSIQUE_OPTIONS/ENVIRONMENT_OPTIONS/RETREAT_OPTIONS/EPIPHANY_OPTIONS），为 SPIRITUAL_ROOT_OPTIONS 添加 id 字段 |
| `components/ParameterPanel.tsx` | 重构组件：抽取通用可编辑选项按钮组件 EditableOptionButton，简化编辑交互（移除确认按钮，保留取消），优化公式显示（标题栏只显示结果，小分类标题后显示当前值） |

**关键代码**:
```typescript
// UserOverrides 新增字段
spiritualRootOptionValues?: Record<string, number>;
comprehensionOptionValues?: Record<string, number>;
physiqueOptionValues?: Record<string, number>;
environmentOptionValues?: Record<string, number>;
retreatOptionValues?: Record<string, number>;
epiphanyOptionValues?: Record<string, number>;

// 通用可编辑选项按钮组件
interface EditableOptionButtonProps {
  option: EditableOptionConfig;
  currentValue?: string | number;
  customValue?: string | number;
  isSelected?: boolean;  // 支持外部指定选中状态（用于灵根类型）
  // ...
}
```

**学习点**:
- 灵根类型有双重值（value 字符串用于选中判断，coefficient 数字用于计算），需要特殊处理
- 抽取通用组件时，考虑边界情况（如灵根类型的 isSelected 判断）

**错误修复**:
- 类型错误：EditiableOptionConfig 使用泛型导致灵根选项类型不兼容 → 改用联合类型 `string | number`
- 运行时错误：`toFixed is not a function` → 灵根类型使用 coefficient 而非 value 作为实际值
- 类型错误：灵根类型的选中逻辑不兼容 → 添加 `isSelected` prop 支持外部指定选中状态

---

## 关键代码片段

### 通用可编辑选项按钮组件
```typescript
function EditableOptionButton({
  option,
  currentValue,
  customValue,
  isSelected: propIsSelected,
  isEditing,
  editingValue,
  // ...
}: EditableOptionButtonProps) {
  // 对于灵根类型，使用 coefficient 作为实际值；其他使用 value
  const defaultValue = option.coefficient !== undefined ? option.coefficient : (option.value as number);
  const actualValue = (customValue ?? defaultValue) as number;
  const isSelected = propIsSelected ?? (actualValue === currentValue);
  // ...
}
```

### 简化的编辑交互
```typescript
// 只保留取消按钮，回车确认
{isEditing && (
  <button onClick={onEditCancel} className="... bg-red-500 hover:bg-red-600 rounded">
    <XIcon />
  </button>
)}
```

---

## 实施时间统计

| 阶段 | 预计 | 实际 | 状态 |
|------|------|------|------|
| 类型定义扩展 | - | 5min | ✅ |
| 预设数据迁移 | - | 5min | ✅ |
| 组件重构 | - | 20min | ✅ |
| 测试验证 | - | 10min | ✅ |
| **总计** | - | 40min | ✅ |

---

## 技术决策记录

### 1. 灵根类型的特殊处理
**原因**:
- 灵根类型有两个值字段：`value` (字符串，用于 params.spiritualRootType) 和 `coefficient` (数字，用于计算)
- 普通选项只用 `value` 判断选中，灵根类型需要用 `value` 判断选中但用 `coefficient` 显示和计算

### 2. 添加 isSelected prop
**原因**:
- 灵根类型的选中判断逻辑与普通选项不同（基于字符串值而非数字值）
- 添加可选 prop 让调用方控制选中状态，保持组件通用性

---

## 待优化事项

1. [ ] 考虑添加"恢复单个参数默认值"功能
2. [ ] 考虑添加"导出配置"功能（JSON 格式）
