'use client';

import { useState, useEffect, useRef } from 'react';
import { ParameterPanel } from './ParameterPanel';
import { RealmTable, RealmSummaryTable } from './RealmTable';
import { AlertList } from './AlertList';
import { CollapsibleSection } from './CollapsibleSection';
import { PresetDetailPanel } from './PresetDetailPanel';
import type { CalculationParams, ResourceConfig, CalculationResult, UserOverrides } from '@/lib/types';
import { MORTAL_PRESET, PRESET_OPTIONS, PRESETS } from '@/lib/data/presets';
import { calculateAll, validateParams, formatDuration } from '@/lib/calculator/core';
import {
  getCurrentPreset,
  setCurrentPreset,
  buildParams,
  buildResource,
  getUserOverrides,
  setUserOverride,
  clearAllUserOverrides,
  migrateFromAutoConfig,
  migrateFromSchemes,
} from '@/lib/storage/user-config';

// SVG 图标组件 - 添加明确的尺寸约束
const RefreshIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MoreIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function CultivationCalculator() {
  // 状态管理
  const [params, setParams] = useState<CalculationParams>(MORTAL_PRESET.params);
  const [resource, setResource] = useState<ResourceConfig>(MORTAL_PRESET.resource);
  const [userOverrides, setUserOverrides] = useState<UserOverrides>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('mortal');
  const [paramErrors, setParamErrors] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPresetDetail, setShowPresetDetail] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化：尝试迁移旧数据，然后加载用户配置
  useEffect(() => {
    // 尝试从旧的 auto-config 迁移
    const migratedFromAuto = migrateFromAutoConfig();

    // 如果 auto-config 没数据，尝试从 schemes 迁移
    if (!migratedFromAuto) {
      migrateFromSchemes();
    }

    // 获取当前预设 ID
    const currentPresetId = getCurrentPreset();
    setSelectedPreset(currentPresetId);

    // 获取用户覆盖值
    const overrides = getUserOverrides();
    setUserOverrides(overrides);

    // 构建配置（预设 + 用户覆盖值）
    const preset = PRESETS[currentPresetId] || MORTAL_PRESET;
    const builtParams = buildParams(preset);
    const builtResource = buildResource(preset);

    setParams(builtParams);
    setResource(builtResource);
    setIsInitialized(true);
  }, []);

  // 菜单容器 ref - 用于检测点击外部
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuOpen]);

  // 计算结果
  useEffect(() => {
    if (!isInitialized) return;

    const errors = validateParams(params);
    setParamErrors(errors);

    if (errors.length === 0) {
      const calculationResult = calculateAll(params, resource);
      setResult(calculationResult);
    } else {
      setResult(null);
    }
  }, [params, resource, isInitialized]);

  // 加载预设（保留用户覆盖值）
  const loadPreset = (presetId: string) => {
    const preset = PRESETS[presetId];
    if (preset) {
      setSelectedPreset(presetId);
      setCurrentPreset(presetId);
      // 使用 buildParams/buildResource 合并用户覆盖值
      setParams(buildParams(preset));
      setResource(buildResource(preset));
    }
  };

  // 参数更新处理（直接写入 localStorage）
  const updateParam = <K extends keyof CalculationParams>(
    key: K,
    value: CalculationParams[K]
  ) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);

    // 写入 localStorage
    setUserOverride(key as any, value as any);

    // 标记为自定义
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
  };

  // 资源更新处理（直接写入 localStorage）
  const updateResource = <K extends keyof ResourceConfig>(
    key: K,
    value: ResourceConfig[K]
  ) => {
    const newResource = { ...resource, [key]: value };
    setResource(newResource);

    // 写入 localStorage
    setUserOverride(key as any, value as any);

    // 标记为自定义
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
  };

  // 批量参数更新（用于预设加载等场景）
  const handleParamsChange = (newParams: CalculationParams) => {
    setParams(newParams);
  };

  // 批量资源更新
  const handleResourceChange = (newResource: ResourceConfig) => {
    setResource(newResource);
  };

  // 设置用户覆盖值（更新 localStorage 和状态）
  const handleSetUserOverride = <K extends keyof UserOverrides>(
    key: K,
    value: UserOverrides[K]
  ) => {
    setUserOverride(key, value);
    setUserOverrides(prev => ({ ...prev, [key]: value }));
  };

  // 重置为默认（清除所有用户覆盖值）
  const handleReset = () => {
    clearAllUserOverrides();
    setUserOverrides({});
    const preset = PRESETS['mortal'];
    if (preset) {
      setSelectedPreset('mortal');
      setCurrentPreset('mortal');
      setParams(preset.params);
      setResource(preset.resource);
    }
  };

  // 获取预设显示名称
  const presetLabel = selectedPreset === 'custom'
    ? '自定义'
    : PRESET_OPTIONS.find(o => o.value === selectedPreset)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">

      {/* 头部 - 精简版 */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-11 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
              修仙世界观量化计算器
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              {presetLabel}
            </span>
          </div>

          {/* 操作下拉菜单 */}
          <div ref={menuRef} className="relative z-50">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              title="更多操作"
            >
              <MoreIcon />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {/* 预设选择 */}
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs text-gray-500 dark:text-gray-400">预设方案</div>
                      <button
                        onClick={() => { setShowPresetDetail(true); setMenuOpen(false); }}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors cursor-pointer"
                        title="查看当前预设的详细系数"
                      >
                        <InfoIcon />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          onClick={() => { loadPreset(option.value); setMenuOpen(false); }}
                          className={`px-2 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                            selectedPreset === option.value
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <button
                    onClick={() => { handleReset(); setMenuOpen(false); }}
                    className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshIcon />
                    重置为默认
                  </button>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：参数面板 */}
          <div className="lg:col-span-4">
            <div className="sticky top-16 h-[calc(100vh-8rem)]">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-full flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    参数设置
                  </h2>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                <ParameterPanel
                  params={params}
                  resource={resource}
                  userOverrides={userOverrides}
                  onParamsChange={handleParamsChange}
                  onResourceChange={handleResourceChange}
                  onUpdateParam={updateParam}
                  onUpdateResource={updateResource}
                  onSetUserOverride={handleSetUserOverride}
                />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：结果面板 */}
          <div className="lg:col-span-8 space-y-5">
            {/* 参数错误提示 */}
            {paramErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 dark:text-red-400 mt-0.5">
                    <WarningIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                      参数错误
                    </h3>
                    <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                      {paramErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 计算结果 */}
            {result && (
              <>
                {/* 概览统计卡片 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      最高可达境界
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {result.maxRealmReached || '无'}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      总修炼时长
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatDuration(result.totalDuration)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      灵脉年产出
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {Math.round(result.resourceSelfSufficiency.mineOutput / 100)}K
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      警报数量
                    </div>
                    <div className={`text-lg font-bold flex items-center gap-2 ${
                      result.alerts.length === 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {result.alerts.length}
                      {result.alerts.length === 0 ? (
                        <CheckIcon />
                      ) : (
                        <XIcon />
                      )}
                    </div>
                  </div>
                </div>

                {/* 崩坏警报 */}
                <CollapsibleSection
                  title="崩坏检测"
                  badge={result.alerts.length}
                  defaultOpen={result.alerts.length > 0}
                >
                  <AlertList alerts={result.alerts} />
                </CollapsibleSection>

                {/* 境界耗时表 */}
                <CollapsibleSection title="境界修炼详情" defaultOpen={true}>
                  <RealmTable realms={result.realms} subLevels={result.subLevels} />
                  <RealmSummaryTable realms={result.realms} />
                </CollapsibleSection>

                {/* 资源自给率 */}
                <CollapsibleSection title="资源供给分析" defaultOpen={true}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          灵矿年产出
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {result.resourceSelfSufficiency.mineOutput.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            下品灵石/年
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          灵植物年产出
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {result.resourceSelfSufficiency.plantOutput.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            下品灵石/年
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        最大单次突破需求
                      </div>
                      <div className={`text-lg font-bold flex items-center gap-2 ${
                        result.resourceSelfSufficiency.isSufficient
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.resourceSelfSufficiency.maxSingleCost.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500">
                          下品灵石
                        </span>
                        {result.resourceSelfSufficiency.isSufficient ? (
                          <CheckIcon />
                        ) : (
                          <XIcon />
                        )}
                      </div>
                      <div className={`text-xs mt-2 flex items-center gap-1.5 ${
                        result.resourceSelfSufficiency.isSufficient
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.resourceSelfSufficiency.isSufficient ? (
                          <>
                            <CheckIcon />
                            灵脉产出足够支持突破
                          </>
                        ) : (
                          <>
                            <XIcon />
                            灵脉产出不足，存在断档风险
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            )}
          </div>
        </div>
      </main>

      {/* 预设详情面板 */}
      {showPresetDetail && (
        <PresetDetailPanel
          presetId={selectedPreset}
          onClose={() => setShowPresetDetail(false)}
        />
      )}
    </div>
  );
}
