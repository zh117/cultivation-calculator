'use client';

import type { CalculationParams, ResourceConfig, SpiritualRootType } from '@/lib/types';

interface ParameterPanelProps {
  params: CalculationParams;
  resource: ResourceConfig;
  onParamsChange: (params: CalculationParams) => void;
  onResourceChange: (resource: ResourceConfig) => void;
}

export function ParameterPanel({
  params,
  resource,
  onParamsChange,
  onResourceChange,
}: ParameterPanelProps) {
  const updateParam = <K extends keyof CalculationParams>(
    key: K,
    value: CalculationParams[K]
  ) => {
    onParamsChange({ ...params, [key]: value });
  };

  const updateResource = <K extends keyof ResourceConfig>(
    key: K,
    value: ResourceConfig[K]
  ) => {
    onResourceChange({ ...resource, [key]: value });
  };

  // 基础吸收速度选项（吸收一颗灵石需要的时辰数）
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

  // 获取吸收速度标签
  const getAbsorptionSpeedLabel = (value: number | undefined): string => {
    const safeValue = value ?? 12;
    return `${safeValue}时辰/灵石`;
  };

  // 功法品质选项（天地玄黄各三阶，系数越小消耗越少）
  const techniqueOptions = [
    { value: 0.99, label: '黄阶下', color: 'text-gray-500' },
    { value: 0.97, label: '黄阶中', color: 'text-gray-500' },
    { value: 0.94, label: '黄阶上', color: 'text-gray-400' },
    { value: 0.90, label: '玄阶下', color: 'text-green-600' },
    { value: 0.85, label: '玄阶中', color: 'text-green-500' },
    { value: 0.79, label: '玄阶上', color: 'text-green-400' },
    { value: 0.72, label: '地阶下', color: 'text-blue-600' },
    { value: 0.64, label: '地阶中', color: 'text-blue-500' },
    { value: 0.55, label: '地阶上', color: 'text-blue-400' },
    { value: 0.45, label: '天阶下', color: 'text-purple-600' },
    { value: 0.34, label: '天阶中', color: 'text-purple-500' },
    { value: 0.22, label: '天阶上', color: 'text-purple-400' },
  ];

  // 灵根选项（影响灵石消耗）
  const spiritualRootOptions = [
    { value: 'waste' as SpiritualRootType, label: '废灵根', sublabel: '五灵根', coefficient: 1.0, color: 'text-red-600' },
    { value: 'mixed' as SpiritualRootType, label: '杂灵根', sublabel: '四灵根', coefficient: 0.9, color: 'text-orange-600' },
    { value: 'triple' as SpiritualRootType, label: '三灵根', sublabel: '三灵根', coefficient: 0.8, color: 'text-yellow-600' },
    { value: 'dual' as SpiritualRootType, label: '双灵根', sublabel: '双灵根', coefficient: 0.6, color: 'text-green-600' },
    { value: 'heavenly' as SpiritualRootType, label: '天灵根', sublabel: '单灵根', coefficient: 0.3, color: 'text-purple-600' },
  ];

  // 吸收效率参数选项（影响修炼时长）
  const comprehensionOptions = [
    { value: 0.5, label: '愚笨', color: 'text-red-600' },
    { value: 0.8, label: '迟钝', color: 'text-orange-600' },
    { value: 1.0, label: '普通', color: 'text-gray-600' },
    { value: 1.5, label: '聪慧', color: 'text-green-600' },
    { value: 2.0, label: '悟性高', color: 'text-blue-600' },
    { value: 3.0, label: '顿悟', color: 'text-purple-600' },
  ];

  const physiqueOptions = [
    { value: 0.8, label: '废体', color: 'text-red-600' },
    { value: 1.0, label: '凡体', color: 'text-gray-600' },
    { value: 1.2, label: '灵体', color: 'text-green-600' },
    { value: 1.5, label: '特殊灵体', color: 'text-blue-600' },
    { value: 2.0, label: '天灵根', color: 'text-purple-600' },
  ];

  const environmentOptions = [
    { value: 0.5, label: '荒芜之地', color: 'text-red-600' },
    { value: 0.8, label: '普通洞府', color: 'text-orange-600' },
    { value: 1.0, label: '标准洞府', color: 'text-gray-600' },
    { value: 1.2, label: '灵脉节点', color: 'text-green-600' },
    { value: 1.5, label: '小型灵脉', color: 'text-green-600' },
    { value: 2.0, label: '中型灵脉', color: 'text-blue-600' },
    { value: 3.0, label: '大型灵脉', color: 'text-blue-600' },
    { value: 5.0, label: '极品灵脉', color: 'text-purple-600' },
  ];

  const retreatOptions = [
    { value: 0.8, label: '游历历练', color: 'text-orange-600' },
    { value: 1.0, label: '正常修炼', color: 'text-gray-600' },
    { value: 1.5, label: '闭关修炼', color: 'text-green-600' },
    { value: 2.0, label: '深度闭关', color: 'text-blue-600' },
  ];

  const epiphanyOptions = [
    { value: 1.0, label: '无顿悟', color: 'text-gray-600' },
    { value: 1.5, label: '偶有顿悟', color: 'text-green-600' },
    { value: 2.0, label: '常有顿悟', color: 'text-green-600' },
    { value: 3.0, label: '顿悟频繁', color: 'text-blue-600' },
    { value: 5.0, label: '顿悟连连', color: 'text-purple-600' },
  ];

  const gradeOptions = [
    { value: 'inferior', label: '下品', color: 'text-gray-600', multiplier: '×1' },
    { value: 'medium', label: '中品', color: 'text-green-600', multiplier: '×100' },
    { value: 'superior', label: '上品', color: 'text-blue-600', multiplier: '×10K' },
    { value: 'extreme', label: '极品', color: 'text-purple-600', multiplier: '×1M' },
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
                {getAbsorptionSpeedLabel(params.baseAbsorptionRate)}
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
            <p className="text-[10px] text-gray-500 dark:text-gray-300 mt-1.5 px-1">
              吸收一颗下品灵石所需时辰，当前年吸收约 {Math.round(4380 / (params.baseAbsorptionRate ?? 12))} 颗
            </p>
          </div>
        </div>
      </div>

      {/* 转换率参数区（影响灵石消耗）*/}
      <div>
        <h3 className="text-xs font-semibold text-indigo-500 dark:text-indigo-300 uppercase tracking-wider mb-3">
          转换率（影响灵石消耗）
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">
          系数越小，突破需要的灵石越少
        </p>
        <div className="space-y-3">
          {/* 功法品质 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              功法品质
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {techniqueOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('techniqueQuality', option.value)}
                  className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.techniqueQuality === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <span className={`relative z-10 ${params.techniqueQuality === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                    {option.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 灵根类型 - 新增 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              灵根类型
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {spiritualRootOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('spiritualRootType', option.value)}
                  className="group relative px-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.spiritualRootType === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <div className={`relative z-10 flex flex-col items-center gap-0.5 ${params.spiritualRootType === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-[10px] opacity-70">{option.sublabel}</span>
                  </div>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    系数{option.coefficient}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-300 mt-1.5 px-1">
              灵根越少，修炼效率越高（系数越小，灵石消耗越少）
            </p>
          </div>
        </div>
      </div>

      {/* 吸收效率区（影响修炼时长）*/}
      <div>
        <h3 className="text-xs font-semibold text-emerald-500 dark:text-emerald-300 uppercase tracking-wider mb-3">
          吸收效率（影响修炼时长）
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">
          值越高，吸收灵石的速度越快
        </p>
        <div className="space-y-3">
          {/* 悟性 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              悟性
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {comprehensionOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('comprehension', option.value)}
                  className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.comprehension === option.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <span className={`relative z-10 ${params.comprehension === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                    ×{option.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 体质血脉 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              体质血脉
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {physiqueOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('physiqueFactor', option.value)}
                  className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.physiqueFactor === option.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <span className={`relative z-10 ${params.physiqueFactor === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                    ×{option.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 修炼环境 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              修炼环境
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {environmentOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('environmentFactor', option.value)}
                  className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.environmentFactor === option.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <span className={`relative z-10 ${params.environmentFactor === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                    ×{option.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 闭关状态 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              闭关状态
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {retreatOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('retreatFactor', option.value)}
                  className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.retreatFactor === option.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <span className={`relative z-10 ${params.retreatFactor === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                    ×{option.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 顿悟加成 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              顿悟加成
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {epiphanyOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('epiphanyFactor', option.value)}
                  className="group relative px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                >
                  <span className={`${
                    params.epiphanyFactor === option.value
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-100 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  } absolute inset-0 rounded-lg transition-all`}></span>
                  <span className={`relative z-10 ${params.epiphanyFactor === option.value ? 'text-white' : 'text-gray-600 dark:text-white'}`}>{option.label}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700 dark:border-gray-600">
                    ×{option.value}
                  </span>
                </button>
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

          {/* 资源说明 */}
          <div className="text-xs text-gray-500 dark:text-gray-300 px-1">
            <span className="font-medium">档位倍率：</span>
            下品×1 · 中品×100 · 上品×10K · 极品×1M
          </div>
        </div>
      </div>
    </div>
  );
}
