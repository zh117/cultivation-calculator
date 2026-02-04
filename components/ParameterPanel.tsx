'use client';

import { useMemo, useState } from 'react';
import type { CalculationParams, ResourceConfig, SpiritualRootType, UserOverrides } from '@/lib/types';
import {
  TECHNIQUE_OPTIONS,
  SPIRITUAL_ROOT_OPTIONS,
  COMPREHENSION_OPTIONS,
  PHYSIQUE_OPTIONS,
  ENVIRONMENT_OPTIONS,
  RETREAT_OPTIONS,
  EPIPHANY_OPTIONS,
} from '@/lib/data/presets';
import { getCalculationDisplay } from '@/lib/calculator/core';
import { SectionTitle } from './SectionTitle';

interface ParameterPanelProps {
  params: CalculationParams;
  resource: ResourceConfig;
  userOverrides?: UserOverrides;
  onParamsChange: (params: CalculationParams) => void;
  onResourceChange: (resource: ResourceConfig) => void;
  onUpdateParam?: <K extends keyof CalculationParams>(key: K, value: CalculationParams[K]) => void;
  onUpdateResource?: <K extends keyof ResourceConfig>(key: K, value: ResourceConfig[K]) => void;
  onSetUserOverride?: <K extends keyof UserOverrides>(key: K, value: UserOverrides[K]) => void;
}

// 图标组件
const EditIcon = () => (
  <svg className="w-3 h-3" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732a2.5 2.5 0 013.536 3.536z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3 h-3" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// 可编辑选项配置类型
interface EditableOptionConfig {
  id: string;
  value: string | number;
  label: string;
  color: string;
  sublabel?: string;
  coefficient?: number;
}

// 通用可编辑选项按钮组件
interface EditableOptionButtonProps {
  option: EditableOptionConfig;
  currentValue?: string | number;
  customValue?: string | number;
  isSelected?: boolean;
  isEditing: boolean;
  editingValue: string;
  onEditStart: (id: string, value: string | number) => void;
  onEditChange: (value: string) => void;
  onEditConfirm: (value: number) => void;
  onEditCancel: () => void;
  onSelect: () => void;
  gridClassName?: string;
}

function EditableOptionButton({
  option,
  currentValue,
  customValue,
  isSelected: propIsSelected,
  isEditing,
  editingValue,
  onEditStart,
  onEditChange,
  onEditConfirm,
  onEditCancel,
  onSelect,
  gridClassName,
}: EditableOptionButtonProps) {
  // 对于灵根类型，使用 coefficient 作为实际值；其他使用 value
  const defaultValue = option.coefficient !== undefined ? option.coefficient : (option.value as number);
  const actualValue = (customValue ?? defaultValue) as number;
  const isSelected = propIsSelected ?? (actualValue === currentValue);
  const isCustomized = customValue !== undefined;

  return (
    <div
      key={option.id}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!isEditing) {
          onSelect();
        }
      }}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !isEditing) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${gridClassName || ''}`}
    >
      <span className={`${
        isSelected
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
      } absolute inset-0 rounded-lg transition-all`}></span>
      <div className={`relative z-10 flex items-center justify-center gap-0.5 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-white'}`}>
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            min="0.1"
            max="999"
            value={editingValue}
            onChange={e => onEditChange(e.target.value)}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const numVal = parseFloat(editingValue);
                if (!isNaN(numVal) && numVal >= 0.1 && numVal <= 999) {
                  onEditConfirm(numVal);
                }
              } else if (e.key === 'Escape') {
                onEditCancel();
              }
            }}
            className="w-12 px-1 py-0.5 text-xs text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-indigo-300 dark:border-indigo-600 rounded"
            autoFocus
          />
        ) : (
          <>
            <span>{option.label}</span>
            {isCustomized && (
              <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            )}
          </>
        )}
      </div>
      {/* 悬浮提示显示值 */}
      <span className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg`}>
        {actualValue.toFixed(2)}
      </span>
      {/* 编辑按钮 */}
      {!isEditing && (
        <button
          onClick={e => {
            e.stopPropagation();
            onEditStart(option.id, actualValue);
          }}
          className="absolute -top-1 -right-1 p-0.5 bg-gray-200 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <EditIcon />
        </button>
      )}
      {/* 编辑模式下的取消按钮 */}
      {isEditing && (
        <button
          onClick={e => {
            e.stopPropagation();
            onEditCancel();
          }}
          className="absolute -top-1 -right-1 p-0.5 bg-red-500 hover:bg-red-600 rounded"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}

export function ParameterPanel({
  params,
  resource,
  userOverrides = {},
  onParamsChange,
  onResourceChange,
  onUpdateParam,
  onUpdateResource,
  onSetUserOverride,
}: ParameterPanelProps) {
  // 编辑状态
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const updateParam = <K extends keyof CalculationParams>(
    key: K,
    value: CalculationParams[K]
  ) => {
    if (onUpdateParam) {
      onUpdateParam(key, value);
    } else {
      onParamsChange({ ...params, [key]: value });
    }
  };

  const updateResource = <K extends keyof ResourceConfig>(
    key: K,
    value: ResourceConfig[K]
  ) => {
    if (onUpdateResource) {
      onUpdateResource(key, value);
    } else {
      onResourceChange({ ...resource, [key]: value });
    }
  };

  // 通用保存选项值函数
  const saveOptionValue = (
    overrideKey: keyof UserOverrides,
    optionId: string,
    value: number
  ) => {
    const currentValues = (userOverrides[overrideKey] as Record<string, number>) || {};
    const newValues = { ...currentValues, [optionId]: value };
    if (onSetUserOverride) {
      onSetUserOverride(overrideKey, newValues as any);
    }
  };

  // 通用获取选项值函数
  const getOptionValue = (
    overrideKey: keyof UserOverrides,
    optionId: string,
    defaultValue: number
  ): number => {
    return (userOverrides[overrideKey] as Record<string, number>)?.[optionId] ?? defaultValue;
  };

  // 计算最终结果用于显示
  const calculationDisplay = useMemo(() => {
    return getCalculationDisplay(params);
  }, [params]);

  // 构建转换率详细公式显示
  const conversionRateFormula = useMemo(() => {
    // 获取当前选中的功法品质信息
    const selectedTechnique = TECHNIQUE_OPTIONS.find(o => {
      const actualValue = userOverrides.techniqueOptionValues?.[o.id] ?? o.value;
      return actualValue === params.techniqueQuality;
    });
    const techniqueValue = selectedTechnique
      ? (userOverrides.techniqueOptionValues?.[selectedTechnique.id] ?? selectedTechnique.value)
      : params.techniqueQuality ?? 1.0;

    // 获取当前选中的灵根信息
    const selectedRoot = SPIRITUAL_ROOT_OPTIONS.find(o => o.value === params.spiritualRootType);
    const rootValue = selectedRoot
      ? (userOverrides.spiritualRootOptionValues?.[selectedRoot.id] ?? selectedRoot.coefficient)
      : 1.0;

    return {
      technique: techniqueValue.toFixed(2),
      root: rootValue.toFixed(2),
      result: (techniqueValue * rootValue).toFixed(2),
      techniqueValue,
      rootValue,
    };
  }, [params.techniqueQuality, params.spiritualRootType, userOverrides.techniqueOptionValues, userOverrides.spiritualRootOptionValues]);

  // 构建吸收效率详细公式显示
  const absorptionRateFormula = useMemo(() => {
    const comp = params.comprehension ?? 1.0;
    const phy = params.physiqueFactor ?? 1.0;
    const env = params.environmentFactor ?? 1.0;
    const ret = params.retreatFactor ?? 1.0;
    const epi = params.epiphanyFactor ?? 1.0;

    return {
      result: (comp * phy * env * ret * epi).toFixed(2),
    };
  }, [params.comprehension, params.physiqueFactor, params.environmentFactor, params.retreatFactor, params.epiphanyFactor]);

  // 基础吸收速度选项
  const absorptionSpeedOptions = [
    { value: 1, label: '极快', color: 'text-blue-600' },
    { value: 4, label: '很快', color: 'text-green-600' },
    { value: 6, label: '较快', color: 'text-green-600' },
    { value: 8, label: '稍快', color: 'text-emerald-600' },
    { value: 12, label: '正常', color: 'text-gray-600' },
    { value: 16, label: '较慢', color: 'text-orange-600' },
    { value: 20, label: '很慢', color: 'text-red-600' },
    { value: 24, label: '极慢', color: 'text-red-600' },
  ];

  // 计算各品阶倍率
  const gradeMultiplier = params.mediumGradeMultiplier ?? 100;
  const gradeOptions = [
    { value: 'inferior', label: '下品', color: 'text-gray-600', multiplier: '×1' },
    { value: 'medium', label: '中品', color: 'text-green-600', multiplier: `×${gradeMultiplier.toLocaleString()}` },
    { value: 'superior', label: '上品', color: 'text-blue-600', multiplier: `×${(gradeMultiplier * gradeMultiplier).toLocaleString()}` },
    { value: 'extreme', label: '极品', color: 'text-purple-600', multiplier: `×${(gradeMultiplier * gradeMultiplier * gradeMultiplier).toLocaleString()}` },
  ];

  return (
    <div className="space-y-5">
      {/* 基础参数区 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider mb-3">
          基础参数
        </h3>
        <div className="space-y-3">
          {/* 基数 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                基数（下品灵石）
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                {params.baseCost}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={params.baseCost}
              onChange={e => updateParam('baseCost', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 小境界系数 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                小境界系数
              </label>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {params.smallRealmMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={params.smallRealmMultiplier}
              onChange={e =>
                updateParam('smallRealmMultiplier', Number(e.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 大境界系数 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                大境界系数
              </label>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {params.largeRealmMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="0.5"
              value={params.largeRealmMultiplier}
              onChange={e =>
                updateParam('largeRealmMultiplier', Number(e.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 筑基倍率 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                筑基倍率
                <span className="text-xs text-gray-400 normal-case ml-1">（炼气→筑基）</span>
              </label>
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {params.foundationBuildingMultiplier || params.largeRealmMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="0.5"
              value={params.foundationBuildingMultiplier ?? params.largeRealmMultiplier}
              onChange={e => {
                const val = Number(e.target.value);
                updateParam('foundationBuildingMultiplier', val === params.largeRealmMultiplier ? undefined : val);
              }}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              炼气→筑基使用独立倍率，避免指数爆炸。留空则使用大境界系数
            </p>
          </div>

          {/* 炼气层数 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                炼气层数
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                {params.qiCondensationLayers}层
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={params.qiCondensationLayers}
              onChange={e =>
                updateParam('qiCondensationLayers', Number(e.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 基础吸收速度 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-white">
                吸收速度（时辰/灵石）
              </label>
              <span className={`text-xs font-medium ${
                absorptionSpeedOptions.find(o => o.value === (params.baseAbsorptionRate ?? 12))?.color || 'text-gray-600'
              }`}>
                {params.baseAbsorptionRate ?? 12}时辰/灵石
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={params.baseAbsorptionRate ?? 12}
              onChange={e =>
                updateParam('baseAbsorptionRate', Number(e.target.value))
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-1 px-0.5">
              <span className="text-[10px] text-gray-400">1时辰（快）</span>
              <span className="text-[10px] text-gray-400">12时辰</span>
              <span className="text-[10px] text-gray-400">24时辰（慢）</span>
            </div>
          </div>
        </div>
      </div>

      {/* 转换率参数区（影响灵石消耗）*/}
      <div>
        <SectionTitle
          title="转换率"
          description="系数越大，突破需要的灵石越少"
          color="indigo"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            = <span className="font-bold text-indigo-600 dark:text-indigo-400">{conversionRateFormula.result}</span>
          </span>
        </SectionTitle>
        <div className="space-y-3">
          {/* 功法品质 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              功法品质 <span className="text-xs text-gray-400">({conversionRateFormula.techniqueValue.toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TECHNIQUE_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  currentValue={params.techniqueQuality}
                  customValue={getOptionValue('techniqueOptionValues', option.id, option.value)}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('techniqueOptionValues', option.id, value);
                    setEditingOptionId(null);
                    updateParam('techniqueQuality', value as any);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => updateParam('techniqueQuality', getOptionValue('techniqueOptionValues', option.id, option.value) as any)}
                />
              ))}
            </div>
          </div>

          {/* 灵根类型 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              灵根类型 <span className="text-xs text-gray-400">({conversionRateFormula.rootValue.toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {SPIRITUAL_ROOT_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  customValue={userOverrides.spiritualRootOptionValues?.[option.id]}
                  isSelected={params.spiritualRootType === option.value}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('spiritualRootOptionValues', option.id, value);
                    setEditingOptionId(null);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => {
                    updateParam('spiritualRootType', option.value as SpiritualRootType);
                  }}
                  gridClassName="px-2 py-2"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 吸收效率区（影响修炼时长）*/}
      <div>
        <SectionTitle
          title="吸收效率"
          description="值越高，吸收灵石的速度越快"
          color="emerald"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400">
            = <span className="font-bold text-emerald-600 dark:text-emerald-400">{absorptionRateFormula.result}</span>
          </span>
        </SectionTitle>
        <div className="space-y-3">
          {/* 悟性 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              悟性 <span className="text-xs text-gray-400">({(params.comprehension ?? 1.0).toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {COMPREHENSION_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  currentValue={params.comprehension ?? 1.0}
                  customValue={getOptionValue('comprehensionOptionValues', option.id, option.value)}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('comprehensionOptionValues', option.id, value);
                    setEditingOptionId(null);
                    updateParam('comprehension', value as any);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => updateParam('comprehension', getOptionValue('comprehensionOptionValues', option.id, option.value) as any)}
                />
              ))}
            </div>
          </div>

          {/* 体质血脉 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              体质血脉 <span className="text-xs text-gray-400">({(params.physiqueFactor ?? 1.0).toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PHYSIQUE_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  currentValue={params.physiqueFactor ?? 1.0}
                  customValue={getOptionValue('physiqueOptionValues', option.id, option.value)}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('physiqueOptionValues', option.id, value);
                    setEditingOptionId(null);
                    updateParam('physiqueFactor', value as any);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => updateParam('physiqueFactor', getOptionValue('physiqueOptionValues', option.id, option.value) as any)}
                />
              ))}
            </div>
          </div>

          {/* 修炼环境 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              修炼环境 <span className="text-xs text-gray-400">({(params.environmentFactor ?? 1.0).toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {ENVIRONMENT_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  currentValue={params.environmentFactor ?? 1.0}
                  customValue={getOptionValue('environmentOptionValues', option.id, option.value)}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('environmentOptionValues', option.id, value);
                    setEditingOptionId(null);
                    updateParam('environmentFactor', value as any);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => updateParam('environmentFactor', getOptionValue('environmentOptionValues', option.id, option.value) as any)}
                />
              ))}
            </div>
          </div>

          {/* 闭关状态 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              闭关状态 <span className="text-xs text-gray-400">({(params.retreatFactor ?? 1.0).toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {RETREAT_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  currentValue={params.retreatFactor ?? 1.0}
                  customValue={getOptionValue('retreatOptionValues', option.id, option.value)}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('retreatOptionValues', option.id, value);
                    setEditingOptionId(null);
                    updateParam('retreatFactor', value as any);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => updateParam('retreatFactor', getOptionValue('retreatOptionValues', option.id, option.value) as any)}
                />
              ))}
            </div>
          </div>

          {/* 顿悟加成 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              顿悟加成 <span className="text-xs text-gray-400">({(params.epiphanyFactor ?? 1.0).toFixed(2)})</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {EPIPHANY_OPTIONS.map((option) => (
                <EditableOptionButton
                  key={option.id}
                  option={option}
                  currentValue={params.epiphanyFactor ?? 1.0}
                  customValue={getOptionValue('epiphanyOptionValues', option.id, option.value)}
                  isEditing={editingOptionId === option.id}
                  editingValue={editingValue}
                  onEditStart={(id, value) => {
                    setEditingOptionId(id);
                    setEditingValue(value.toString());
                  }}
                  onEditChange={setEditingValue}
                  onEditConfirm={(value) => {
                    saveOptionValue('epiphanyOptionValues', option.id, value);
                    setEditingOptionId(null);
                    updateParam('epiphanyFactor', value as any);
                  }}
                  onEditCancel={() => setEditingOptionId(null)}
                  onSelect={() => updateParam('epiphanyFactor', getOptionValue('epiphanyOptionValues', option.id, option.value) as any)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 灵脉资源配置 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider mb-3">
          灵脉资源
        </h3>
        <div className="space-y-3">
          {/* 灵脉进位倍率配置 */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-white">
                灵脉进位倍率
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                {gradeMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="999"
              step="1"
              value={gradeMultiplier}
              onChange={e => updateParam('mediumGradeMultiplier', Number(e.target.value))}
              className="w-full h-2 bg-purple-200 dark:bg-purple-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between mt-1 px-0.5 text-[10px] text-gray-500">
              <span>1x</span>
              <span>中品×{gradeMultiplier}</span>
              <span>上品×{(gradeMultiplier * gradeMultiplier).toLocaleString()}</span>
              <span>极品×{(gradeMultiplier ** 3).toLocaleString()}</span>
            </div>
          </div>

          {/* 灵矿配置 */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-transparent dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-white">
                灵矿
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-300">
                100 × 等级 × 档位倍率/年
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1">
                {gradeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateResource('mineGrade', option.value as any)}
                    className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                  >
                    <span className={`${
                      resource.mineGrade === option.value
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700/70 text-gray-600 dark:text-white group-hover:bg-gray-100 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    } absolute inset-0 rounded-lg transition-all`}></span>
                    <span className={`relative z-10 ${resource.mineGrade === option.value || resource.plantGrade === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {option.multiplier}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="9"
                value={resource.mineLevel}
                onChange={e =>
                  updateResource('mineLevel', Math.min(9, Math.max(1, Number(e.target.value))))
                }
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* 灵植物配置 */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-transparent dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-white">
                灵植物
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-300">
                灵矿产出 × 0.8/年
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1">
                {gradeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateResource('plantGrade', option.value as any)}
                    className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                  >
                    <span className={`${
                      resource.plantGrade === option.value
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700/70 text-gray-600 dark:text-white group-hover:bg-gray-100 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    } absolute inset-0 rounded-lg transition-all`}></span>
                    <span className={`relative z-10 ${resource.mineGrade === option.value || resource.plantGrade === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {option.multiplier}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="9"
                value={resource.plantLevel}
                onChange={e =>
                  updateResource('plantLevel', Math.min(9, Math.max(1, Number(e.target.value))))
                }
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
