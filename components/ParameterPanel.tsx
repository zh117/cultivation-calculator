'use client';

import type { CalculationParams, ResourceConfig } from '@/lib/types';

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

  const techniqueOptions = [
    { value: 0.5, label: '残缺功法', color: 'text-red-600' },
    { value: 0.8, label: '凡品下阶', color: 'text-orange-600' },
    { value: 1.0, label: '凡品', color: 'text-gray-600' },
    { value: 1.2, label: '凡品上阶', color: 'text-green-600' },
    { value: 1.5, label: '灵品', color: 'text-green-600' },
    { value: 2.0, label: '灵品上阶', color: 'text-blue-600' },
    { value: 3.0, label: '玄品', color: 'text-blue-600' },
    { value: 5.0, label: '地品', color: 'text-purple-600' },
    { value: 10.0, label: '天品', color: 'text-purple-600' },
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

  const physiqueOptions = [
    { value: 0.8, label: '废体', color: 'text-red-600' },
    { value: 1.0, label: '凡体', color: 'text-gray-600' },
    { value: 1.2, label: '灵体', color: 'text-green-600' },
    { value: 1.5, label: '特殊灵体', color: 'text-blue-600' },
    { value: 2.0, label: '天灵根', color: 'text-purple-600' },
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
    { value: 'inferior', label: '下品', color: 'text-gray-600' },
    { value: 'medium', label: '中品', color: 'text-green-600' },
    { value: 'superior', label: '上品', color: 'text-blue-600' },
    { value: 'extreme', label: '极品', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-5">
      {/* 基础参数区 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          基础参数
        </h3>
        <div className="space-y-3">
          {/* 基数 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                基数（下品灵石）
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                炼气层数
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
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
        </div>
      </div>

      {/* 修炼速度区 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          修炼速度
        </h3>
        <div className="space-y-3">
          {/* 功法品质 - 按钮组 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              功法品质
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {techniqueOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('techniqueQuality', option.value)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    params.techniqueQuality === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 修炼环境 - 按钮组 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              修炼环境
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {environmentOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('environmentFactor', option.value)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    params.environmentFactor === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 体质血脉 - 按钮组 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              体质血脉
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {physiqueOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('physiqueFactor', option.value)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    params.physiqueFactor === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 闭关状态 - 按钮组 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              闭关状态
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {retreatOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('retreatFactor', option.value)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    params.retreatFactor === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 顿悟加成 - 按钮组 */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              顿悟加成
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {epiphanyOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => updateParam('epiphanyFactor', option.value)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    params.epiphanyFactor === option.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 灵脉资源配置 */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          灵脉资源
        </h3>
        <div className="space-y-3">
          {/* 灵矿配置 */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                灵矿
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                100 × 等级 × 档位倍率/年
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1">
                {gradeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateResource('mineGrade', option.value as any)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      resource.mineGrade === option.value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {option.label}
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
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* 灵植物配置 */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                灵植物
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                灵矿产出 × 0.8/年
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1">
                {gradeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateResource('plantGrade', option.value as any)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      resource.plantGrade === option.value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {option.label}
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
                className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* 资源说明 */}
          <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
            <span className="font-medium">档位倍率：</span>
            下品×1 · 中品×100 · 上品×10K · 极品×1M
          </div>
        </div>
      </div>
    </div>
  );
}
