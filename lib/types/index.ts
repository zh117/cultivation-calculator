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
 * 值越高，消耗越少（天赋越高，需要的灵石越少）
 */
export interface CultivationParams {
  // 基础参数
  baseCost: number;
  smallRealmMultiplier: number;
  largeRealmMultiplier: number;
  qiCondensationLayers: number;

  // 转换率系数（影响 cost）
  talent: number;           // 天赋（1.0=标准，2.0=天才消耗减半）
  comprehension: number;    // 悟性（影响功法发挥）
  techniqueQuality: number; // 功法品质
  spiritualRootType: SpiritualRootType; // 灵根类型
}

/**
 * 吸收参数（吸收效率维度 - 影响修炼时长）
 * 值越高，吸收越快
 */
export interface AbsorptionParams {
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
