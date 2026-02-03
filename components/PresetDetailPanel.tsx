'use client';

import { PRESETS, PRESET_OPTIONS } from '@/lib/data/presets';
import type { PresetConfig } from '@/lib/types';

interface PresetDetailPanelProps {
  presetId: string;
  onClose: () => void;
}

const GradeLabels: Record<string, string> = {
  inferior: '下品',
  medium: '中品',
  superior: '上品',
  extreme: '极品',
};

const TypeLabels: Record<string, string> = {
  mine: '灵石矿',
  plant: '灵植物',
};

const SPIRITUAL_ROOT_LABELS: Record<string, string> = {
  waste: '废灵根（五灵根）',
  mixed: '杂灵根（四灵根）',
  triple: '三灵根',
  dual: '双灵根',
  heavenly: '天灵根（单灵根）',
};

export function PresetDetailPanel({ presetId, onClose }: PresetDetailPanelProps) {
  const preset = PRESETS[presetId];

  if (!preset) return null;

  // 计算转换率（影响灵石消耗）= 功法品质 × 灵根系数
  const SPIRITUAL_ROOT_COEFFICIENTS: Record<string, number> = {
    waste: 1.0,      // 废灵根（五灵根）
    mixed: 0.9,      // 杂灵根（四灵根）
    triple: 0.8,     // 三灵根
    dual: 0.6,       // 双灵根
    heavenly: 0.3,   // 天灵根（单灵根）
  };
  const spiritualRootCoeff = SPIRITUAL_ROOT_COEFFICIENTS[preset.params.spiritualRootType ?? 'waste'] ?? 1.0;
  const conversionRate = preset.params.techniqueQuality * spiritualRootCoeff;

  // 计算吸收效率（影响修炼时长）
  const absorptionRate =
    preset.params.comprehension *
    preset.params.physiqueFactor *
    preset.params.environmentFactor *
    preset.params.retreatFactor *
    preset.params.epiphanyFactor;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {preset.name} - 系数详情
            </h3>
            {preset.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {preset.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区 - 可滚动 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 基础参数 */}
          <section>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              基础参数
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ParamRow label="基数消耗" value={preset.params.baseCost} suffix="灵石" />
              <ParamRow label="小境界系数" value={preset.params.smallRealmMultiplier} description="每层小境界的倍数增长" />
              <ParamRow label="大境界系数" value={preset.params.largeRealmMultiplier} description="每个大境界的倍数增长" />
              <ParamRow label="炼气层数" value={preset.params.qiCondensationLayers} suffix="层" />
            </div>
          </section>

          {/* 转换率参数（影响灵石消耗）*/}
          <section>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              转换率（影响灵石消耗）
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              值越低，突破需要的灵石越少（功法品质和灵根系数都是越小越好）
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ParamRow label="功法品质" value={preset.params.techniqueQuality} description="修炼功法的品质加成" />
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">灵根类型</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {SPIRITUAL_ROOT_LABELS[preset.params.spiritualRootType ?? 'waste'] || '未知'}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  系数 {spiritualRootCoeff.toFixed(2)}
                </div>
              </div>
            </div>

            {/* 转换率总览 */}
            <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">总转换率</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {conversionRate.toFixed(2)}x
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                功法品质 × 灵根系数
              </div>
            </div>
          </section>

          {/* 吸收效率参数（影响修炼时长）*/}
          <section>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              吸收效率（影响修炼时长）
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              值越高，吸收灵石的速度越快
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ParamRow label="悟性" value={preset.params.comprehension} description="理解功法的能力" />
              <ParamRow label="体质血脉" value={preset.params.physiqueFactor} description="主角体质的优势" />
              <ParamRow label="修炼环境" value={preset.params.environmentFactor} description="修炼环境的影响" />
              <ParamRow label="闭关加成" value={preset.params.retreatFactor} description="闭关修炼的效率提升" />
              <ParamRow label="顿悟加成" value={preset.params.epiphanyFactor} description="顿悟突破时的效率提升" />
            </div>

            {/* 吸收效率总览 */}
            <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">总吸收效率</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {absorptionRate.toFixed(2)}x
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                {preset.params.comprehension.toFixed(1)} × {preset.params.physiqueFactor.toFixed(1)} × {preset.params.environmentFactor.toFixed(1)} × {preset.params.retreatFactor.toFixed(1)} × {preset.params.epiphanyFactor.toFixed(1)}
              </div>
            </div>
          </section>

          {/* 资源配置 */}
          <section>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
              资源配置
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">灵石矿类型</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {TypeLabels[preset.resource.mineType] || preset.resource.mineType}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">灵石矿品级</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {GradeLabels[preset.resource.mineGrade] || preset.resource.mineGrade}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">灵石矿等级</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {preset.resource.mineLevel} 级
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">灵植物品级</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {GradeLabels[preset.resource.plantGrade] || preset.resource.plantGrade}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">灵植物等级</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {preset.resource.plantLevel} 级
                </div>
              </div>
            </div>
          </section>

          {/* 预设对比 */}
          <section>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
              与其他预设对比
            </h4>
            <PresetComparison currentPresetId={presetId} />
          </section>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function ParamRow({
  label,
  value,
  suffix,
  description,
}: {
  label: string;
  value: number;
  suffix?: string;
  description?: string;
}) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {value}
        {suffix && <span className="text-gray-500 ml-1">{suffix}</span>}
      </div>
      {description && (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{description}</div>
      )}
    </div>
  );
}

function PresetComparison({ currentPresetId }: { currentPresetId: string }) {
  const currentPreset = PRESETS[currentPresetId];

  if (!currentPreset) return null;

  const comparisonData = [
    {
      label: '基数消耗',
      key: 'baseCost',
      format: (v: number) => v.toString(),
      needsPreset: false,
    },
    {
      label: '小境界系数',
      key: 'smallRealmMultiplier',
      format: (v: number) => v.toFixed(1),
      needsPreset: false,
    },
    {
      label: '大境界系数',
      key: 'largeRealmMultiplier',
      format: (v: number) => v.toFixed(1),
      needsPreset: false,
    },
    {
      label: '转换率',
      key: 'conversionRate',
      format: (_v: number, preset: PresetConfig) => {
        const SPIRITUAL_ROOT_COEFFICIENTS: Record<string, number> = {
          waste: 1.0, mixed: 0.9, triple: 0.8, dual: 0.6, heavenly: 0.3,
        };
        const spiritualRootCoeff = SPIRITUAL_ROOT_COEFFICIENTS[preset.params.spiritualRootType ?? 'waste'] ?? 1.0;
        const total = preset.params.techniqueQuality * spiritualRootCoeff;
        return total.toFixed(2);
      },
      needsPreset: true,
    },
    {
      label: '吸收效率',
      key: 'absorptionRate',
      format: (_v: number, preset: PresetConfig) => {
        const total =
          preset.params.comprehension *
          preset.params.physiqueFactor *
          preset.params.environmentFactor *
          preset.params.retreatFactor *
          preset.params.epiphanyFactor;
        return total.toFixed(2);
      },
      needsPreset: true,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">
              参数
            </th>
            {PRESET_OPTIONS.map((option) => (
              <th
                key={option.value}
                className={`py-2 px-3 text-center font-medium ${
                  option.value === currentPresetId
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {option.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonData.map((row) => (
            <tr key={row.label} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{row.label}</td>
              {PRESET_OPTIONS.map((option) => {
                const preset = PRESETS[option.value];
                const value = row.needsPreset
                  ? parseFloat(row.format(0, preset))
                  : (preset.params[row.key as keyof typeof preset.params] as number);
                const currentValue = row.needsPreset
                  ? parseFloat(row.format(0, currentPreset))
                  : (currentPreset.params[row.key as keyof typeof currentPreset.params] as number);
                const isCurrent = option.value === currentPresetId;
                const isHigher = value > currentValue;
                const isLower = value < currentValue;

                return (
                  <td
                    key={option.value}
                    className={`py-2 px-3 text-center ${
                      isCurrent
                        ? 'bg-blue-100 dark:bg-blue-900/30 font-semibold text-gray-900 dark:text-gray-100'
                        : isHigher
                        ? 'text-green-600 dark:text-green-400'
                        : isLower
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {row.needsPreset ? (row.format as (v: number, p: PresetConfig) => string)(0, preset) : (row.format as (v: number) => string)(value)}
                    {!isCurrent && isHigher && ' ↑'}
                    {!isCurrent && isLower && ' ↓'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
