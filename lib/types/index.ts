// ============================================================================
// 修仙世界观量化计算器 - 类型定义
// ============================================================================

/**
 * 资源档位
 */
export type ResourceGrade = 'inferior' | 'medium' | 'superior' | 'extreme';

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
export type AlertType = 'lifespan' | 'resource' | 'exponential';

/**
 * 警报严重程度
 */
export type AlertSeverity = 'warning' | 'error' | 'critical';

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
 * 计算参数
 */
export interface CalculationParams {
  // 基础参数
  baseCost: number;
  smallRealmMultiplier: number;
  largeRealmMultiplier: number;
  qiCondensationLayers: number;

  // 速度系数
  techniqueQuality: number;
  environmentFactor: number;
  physiqueFactor: number;
  retreatFactor: number;
  epiphanyFactor: number;
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
  duration: number;
  cumulativeDuration: number;
  lifespanRemaining: number;
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
