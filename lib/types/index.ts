// ============================================================================
// 修仙世界观量化计算器 - 类型定义
// ============================================================================

/**
 * 资源档位
 */
export type ResourceGrade = 'inferior' | 'medium' | 'superior' | 'extreme';

/**
 * 灵根类型
 */
export type SpiritualRootType = 'waste' | 'mixed' | 'triple' | 'dual' | 'heavenly';

/**
 * 灵根配置
 */
export interface SpiritualRoot {
  type: SpiritualRootType;
  coefficient: number;
}

/**
 * 资源类型
 */
export type ResourceType = 'mine' | 'plant';

/**
 * 小境界名称
 */
export type SubLevelName = '前期' | '中期' | '后期' | '大圆满' | string;

/**
 * 警报类型
 */
export type AlertType = 'lifespan' | 'resource' | 'exponential' | 'bottleneck';

/**
 * 警报严重程度
 */
export type AlertSeverity = 'notice' | 'warning' | 'error' | 'critical';

/**
 * 小境界配置
 */
export interface SubLevelConfig {
  name: SubLevelName;
  index: number;
}

/**
 * 境界配置
 */
export interface RealmConfig {
  name: string;
  subLevels: SubLevelConfig[];
  lifespan: number;
}

/**
 * 修炼参数（转换率维度 - 影响灵石消耗）
 * 值越大，消耗越少（公式已反转：cost = rawCost / conversionRate）
 */
export interface CultivationParams {
  // 基础参数
  baseCost: number;
  smallRealmMultiplier: number;
  largeRealmMultiplier: number;
  qiCondensationLayers: number;
  baseAbsorptionRate: number; // 吸收一颗下品灵石需要的时辰数

  // 转换率系数（影响 cost）
  techniqueQuality: number; // 功法品质（新体系：值越大越好）
  spiritualRootType: SpiritualRootType; // 灵根类型

  // 新增：筑基独立倍率
  foundationBuildingMultiplier?: number; // 筑基跨境界倍率（独立于 largeRealmMultiplier）

  // 灵脉进位倍率（统一参数，影响所有品阶进位）
  mediumGradeMultiplier?: number; // 进位倍率（默认100）：中品=下品×N，上品=中品×N，极品=上品×N
}

/**
 * 吸收参数（吸收效率维度 - 影响修炼时长）
 * 值越高，吸收越快
 */
export interface AbsorptionParams {
  comprehension: number;  // 悟性（影响吸收速度）
  physiqueFactor: number;   // 体质（影响吸收速度）
  environmentFactor: number;// 环境（灵气浓度）
  retreatFactor: number;    // 闭关（专注度）
  epiphanyFactor: number;   // 顿悟（临时爆发）
}

/**
 * 完整计算参数（组合两个维度）
 */
export interface CalculationParams extends CultivationParams, AbsorptionParams {}

/**
 * 时长计算结果（包含两种时长）
 */
export interface DurationResult {
  theoreticalDuration: number;    // 理论时长（年）- 纯吸收能力
  resourceLimitedDuration: number; // 资源限制时长（年）- 受灵脉产量限制
  bottleneckRatio: number;         // 瓶颈比例（资源限制/理论）
}

/**
 * 资源配置
 */
export interface ResourceConfig {
  mineType: ResourceType;
  mineGrade: ResourceGrade;
  mineLevel: number;
  plantGrade: ResourceGrade;
  plantLevel: number;
}

/**
 * 小境界计算结果
 */
export interface SubLevelResult {
  realmName: string;
  subLevelName: string;
  subLevelIndex: number;
  cost: number;
  cumulativeCost: number;
  duration: number;                 // 保留兼容性（使用理论时长）
  cumulativeDuration: number;       // 保留兼容性（使用理论时长）
  theoreticalDuration: number;      // 理论时长（年）
  cumulativeTheoreticalDuration: number; // 累计理论时长
  resourceLimitedDuration: number;  // 资源限制时长（年）
  cumulativeResourceDuration: number; // 累计资源限制时长
  bottleneckRatio: number;          // 瓶颈比例
  lifespanRemaining: number;        // 剩余寿命（基于理论时长）
  isLifespanExceeded: boolean;
}

/**
 * 境界汇总结果
 */
export interface RealmSummary {
  realmName: string;
  totalCost: number;
  totalDuration: number;
  subLevels: SubLevelResult[];
}

/**
 * 崩坏警报
 */
export interface Alert {
  type: AlertType;
  realm: string;
  message: string;
  severity: AlertSeverity;
  actualValue?: number;
  threshold?: number;
  isTheoreticalBreakdown?: boolean; // 是否为理论崩塌（true=设定确实崩塌，false=可通过剧情解决）
}

/**
 * 完整计算结果
 */
export interface CalculationResult {
  realms: RealmSummary[];
  subLevels: SubLevelResult[];
  alerts: Alert[];
  totalDuration: number;
  maxRealmReached: string;
  resourceSelfSufficiency: {
    mineOutput: number;
    plantOutput: number;
    maxSingleCost: number;
    isSufficient: boolean;
  };
}

/**
 * 预设配置
 */
export interface PresetConfig {
  id: string;
  name: string;
  description?: string;
  params: CalculationParams;
  resource: ResourceConfig;
}

/**
 * 保存的方案
 */
export interface SavedScheme {
  id: string;
  name: string;
  createdAt: number;
  params: CalculationParams;
  resource: ResourceConfig;
  coefficientOverrides?: CoefficientOverrides;  // 系数覆盖值
  result?: CalculationResult;
}

/**
 * 方案对比项
 */
export interface ComparisonItem {
  label: string;
  values: (string | number)[];
}

/**
 * 颜色主题（用于图表/进度条）
 */
export interface ColorTheme {
  primary: string;
  success: string;
  warning: string;
  error: string;
  critical: string;
}

/**
 * 系数覆盖配置（允许用户自定义单个系数值）
 * 输入范围：0.1-999，大于1为正面意义，小于1为负面意义
 */
export interface CoefficientOverrides {
  // 转化率维度
  techniqueQuality?: number;      // 功法品质系数覆盖
  spiritualRootCoeff?: number;    // 灵根系数覆盖（优先级高于 spiritualRootType）
  // 吸收效率维度
  comprehension?: number;         // 悟性系数覆盖
  physiqueFactor?: number;        // 体质系数覆盖
  environmentFactor?: number;     // 环境系数覆盖
  retreatFactor?: number;         // 闭关系数覆盖
  epiphanyFactor?: number;        // 顿悟系数覆盖
}

/**
 * 扩展计算参数（包含系数覆盖）
 */
export interface ExtendedCalculationParams extends CalculationParams {
  coefficientOverrides?: CoefficientOverrides;
}

/**
 * 自动保存的配置
 */
export interface AutoSavedConfig {
  params: CalculationParams;
  resource: ResourceConfig;
  coefficientOverrides?: CoefficientOverrides;
  savedAt: number;
}

/**
 * 用户自定义配置覆盖（细粒度）
 * 所有配置项均可独立覆盖，支持大类和小类
 */
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
  techniqueQuality?: number;           // 功法品质选中值
  techniqueQualityLabel?: string;      // 功法品质标签（用户自定义时使用）
  spiritualRootType?: SpiritualRootType; // 灵根类型选中值

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

  // 功法品质各选项的自定义值
  techniqueOptionValues?: Record<string, number>; // { 'yellow-inferior': 1.1, ... }

  // 灵根类型各选项的自定义值
  spiritualRootOptionValues?: Record<string, number>; // { 'waste': 1.0, 'dual': 1.8, ... }

  // 吸收效率各小项的选项自定义值
  comprehensionOptionValues?: Record<string, number>;    // { '0.5': 0.6, '1.5': 1.8, ... }
  physiqueOptionValues?: Record<string, number>;         // { '0.8': 0.9, '1.5': 1.7, ... }
  environmentOptionValues?: Record<string, number>;      // { '0.5': 0.8, '3.0': 4.0, ... }
  retreatOptionValues?: Record<string, number>;          // { '0.8': 0.9, '2.0': 2.5, ... }
  epiphanyOptionValues?: Record<string, number>;         // { '1.0': 1.2, '3.0': 4.0, ... }
}

/**
 * 当前预设信息
 */
export interface CurrentPresetInfo {
  presetId: string;
  updatedAt: number;
}

/**
 * 计算结果显示（用于标题展示）
 */
export interface CalculationDisplay {
  conversionRate: number;    // 转化率最终结果
  absorptionRate: number;    // 吸收效率最终结果
}
