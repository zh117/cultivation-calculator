// ============================================================================
// 核心计算函数（纯函数）
// ============================================================================

import type { CalculationParams, CultivationParams, AbsorptionParams, ResourceConfig, CalculationResult, SubLevelResult, RealmSummary, Alert, DurationResult, CoefficientOverrides, CalculationDisplay } from '@/lib/types';
import { getRealmConfigs } from '@/lib/data/realms';

// ============================================================================
// 常量
// ============================================================================

/** 默认吸收一颗灵石需要的时辰数 */
const DEFAULT_HOURS_PER_STONE = 12;

/** 灵根系数映射表（新体系：值越大越好）
 * 废灵根（五灵根）: 1.0
 * 杂灵根（四灵根）: 1.11
 * 三灵根: 1.25
 * 双灵根: 1.67
 * 天灵根（单灵根）: 3.33
 */
const SPIRITUAL_ROOT_COEFFICIENTS: Record<string, number> = {
  waste: 1.0,      // 废灵根（五灵根）
  mixed: 1.11,     // 杂灵根（四灵根）= 1/0.9
  triple: 1.25,    // 三灵根 = 1/0.8
  dual: 1.67,      // 双灵根 = 1/0.6
  heavenly: 3.33,  // 天灵根（单灵根）= 1/0.3
};

/** 默认资源档位倍率 */
const DEFAULT_GRADE_MULTIPLIERS: Record<string, number> = {
  inferior: 1,
  medium: 100,
  superior: 10000,
  extreme: 1000000,
};

/** 资源类型倍率 */
const RESOURCE_TYPE_MULTIPLIERS: Record<string, number> = {
  mine: 1.0,
  plant: 0.8,
};

/** 单级基础产量（下品灵石/年） */
const BASE_PRODUCTION_PER_LEVEL = 100;

// ============================================================================
// 转换率 & 吸收效率计算
// ============================================================================

/**
 * 计算转换率系数（影响资源消耗）
 * 新体系：值越大，消耗越少（公式反转：cost = rawCost / conversionRate）
 * 例如：天灵根(3.33) + 天阶(4.55) = 15.15，消耗 = rawCost / 15.15（最小）
 *      废灵根(1.0) + 黄阶(1.03) = 1.03，消耗 = rawCost / 1.03（最大）
 */
export function calculateConversionRate(params: CultivationParams, overrides?: CoefficientOverrides): number {
  // 优先使用覆盖值
  const technique = overrides?.techniqueQuality ?? params.techniqueQuality ?? 1.0;
  const spiritualRootType = params.spiritualRootType ?? 'waste';
  const spiritualRootCoeff = overrides?.spiritualRootCoeff ?? SPIRITUAL_ROOT_COEFFICIENTS[spiritualRootType] ?? 1.0;

  // 新公式：值越大，转换率越高，消耗越少
  return technique * spiritualRootCoeff;
}

/**
 * 计算吸收效率系数（影响吸收速度）
 * 值越高，吸收越快
 */
export function calculateAbsorptionRate(params: AbsorptionParams, overrides?: CoefficientOverrides): number {
  const comprehension = overrides?.comprehension ?? params.comprehension ?? 1.0;
  const physique = overrides?.physiqueFactor ?? params.physiqueFactor ?? 1.0;
  const environment = overrides?.environmentFactor ?? params.environmentFactor ?? 1.0;
  const retreat = overrides?.retreatFactor ?? params.retreatFactor ?? 1.0;
  const epiphany = overrides?.epiphanyFactor ?? params.epiphanyFactor ?? 1.0;
  return comprehension * physique * environment * retreat * epiphany;
}

/**
 * 获取计算结果显示（用于标题展示）
 */
export function getCalculationDisplay(params: CalculationParams, overrides?: CoefficientOverrides): CalculationDisplay {
  const conversionRate = calculateConversionRate(params, overrides);
  const absorptionRate = calculateAbsorptionRate(params, overrides);
  return { conversionRate, absorptionRate };
}

// ============================================================================
// 计算函数
// ============================================================================

/**
 * 计算小境界的资源消耗
 *
 * 公式（新体系）：
 * - 首境（炼气1→2）= baseCost / conversionRate
 * - 首境后续小境界 = baseCost × smallRealmMultiplier^(subLevelIndex - 1) / conversionRate
 * - 跨大境界 = 前境界最后小境界消耗 × largeRealmMultiplier（或筑基倍率）
 * - 新大境界小境界 = 跨大境界消耗 × smallRealmMultiplier^subLevelIndex
 *
 * @param baseCost - 基数
 * @param smallMultiplier - 小境界系数
 * @param largeMultiplier - 大境界系数
 * @param foundationMultiplier - 筑基独立倍率（可选）
 * @param realmIndex - 境界索引（0开始）
 * @param subLevelIndex - 小境界索引（0开始）
 * @param qiCondensationLayers - 炼气层数
 * @param conversionRate - 转换率系数（值越大，消耗越少）
 * @returns 资源消耗（下品灵石）
 */
export function calculateSubLevelCost(
  baseCost: number,
  smallMultiplier: number,
  largeMultiplier: number,
  foundationMultiplier: number | undefined,
  realmIndex: number,
  subLevelIndex: number,
  qiCondensationLayers: number,
  conversionRate: number = 1.0
): number {
  // 炼气期（第一个境界）的层数可能不是4层
  const firstRealmSubLevels = qiCondensationLayers;

  // 首境第一个小境界
  if (realmIndex === 0 && subLevelIndex === 0) {
    return baseCost / conversionRate;
  }

  // 首境后续小境界
  if (realmIndex === 0) {
    return (baseCost * Math.pow(smallMultiplier, subLevelIndex)) / conversionRate;
  }

  // 计算首境最后一个小境界的消耗
  const firstRealmLastCost = baseCost * Math.pow(smallMultiplier, firstRealmSubLevels - 1);

  // 计算本大境界的基数
  // 炼气→筑基（realmIndex=1）使用筑基独立倍率（如果有）
  let realmBaseCost: number;
  if (realmIndex === 1 && foundationMultiplier) {
    realmBaseCost = firstRealmLastCost * foundationMultiplier;
  } else {
    realmBaseCost = firstRealmLastCost * Math.pow(largeMultiplier, realmIndex - 1);
  }

  // 本大境界第一个小境界
  if (subLevelIndex === 0) {
    return (realmBaseCost * largeMultiplier) / conversionRate;
  }

  // 本大境界后续小境界
  return (realmBaseCost * largeMultiplier * Math.pow(smallMultiplier, subLevelIndex)) / conversionRate;
}

/**
 * 计算两种时长（理论时长 vs 资源限制时长）
 * @param hoursPerStone - 吸收一颗灵石需要的时辰数（默认12时辰）
 */
export function calculateDualDuration(
  cost: number,
  absorptionRate: number,
  resourceProduction: number,
  hoursPerStone: number = DEFAULT_HOURS_PER_STONE
): DurationResult {
  // 默认值处理（兼容旧数据）
  const safeHoursPerStone = hoursPerStone ?? DEFAULT_HOURS_PER_STONE;
  // 每年时辰数（修仙设定：1天=12时辰，1年=365天）
  const HOURS_PER_YEAR = 12 * 365;
  // 年吸收速度 = 每年时辰数 / 吸收一颗灵石需要的时辰
  const stonesPerYear = HOURS_PER_YEAR / safeHoursPerStone;
  // 理论时长：纯吸收能力，不考虑资源限制
  const effectiveAbsorptionRate = stonesPerYear * absorptionRate;
  const theoreticalDuration = cost / effectiveAbsorptionRate;

  // 资源限制时长：受灵脉产量限制
  const resourceLimitedDuration = cost / resourceProduction;

  // 瓶颈比例：资源限制时长 / 理论时长
  const bottleneckRatio = resourceLimitedDuration / theoreticalDuration;

  return {
    theoreticalDuration,
    resourceLimitedDuration,
    bottleneckRatio,
  };
}

/**
 * @deprecated 使用 calculateDualDuration 替代
 * 计算修炼时长（年）
 */
export function calculateDuration(
  cost: number,
  efficiencyFactor: number,
  hoursPerStone: number = DEFAULT_HOURS_PER_STONE
): number {
  const HOURS_PER_YEAR = 12 * 365;
  const stonesPerYear = HOURS_PER_YEAR / hoursPerStone;
  const effectiveRate = stonesPerYear * efficiencyFactor;
  return cost / effectiveRate;
}

/**
 * 计算总效率系数（保留兼容性）
 */
export function calculateEfficiencyFactor(params: CalculationParams): number {
  return calculateAbsorptionRate(params);
}

/**
 * 计算资源年产出
 */
export function calculateResourceProduction(
  type: 'mine' | 'plant',
  grade: string,
  level: number,
  mediumGradeMultiplier?: number
): number {
  const gradeMultipliers = mediumGradeMultiplier
    ? { ...DEFAULT_GRADE_MULTIPLIERS, medium: mediumGradeMultiplier }
    : DEFAULT_GRADE_MULTIPLIERS;
  const gradeMultiplier = gradeMultipliers[grade as keyof typeof gradeMultipliers] || 1;
  const typeMultiplier = RESOURCE_TYPE_MULTIPLIERS[type] || 1;
  return BASE_PRODUCTION_PER_LEVEL * level * gradeMultiplier * typeMultiplier;
}

/**
 * 格式化灵石数量
 */
export function formatSpiritStones(amount: number): string {
  if (amount >= 1e8) return `${(amount / 1e8).toFixed(2)}亿`;
  if (amount >= 1e4) return `${(amount / 1e4).toFixed(2)}万`;
  return amount.toFixed(0);
}

/**
 * 格式化时长
 * - 小于1年：显示天数（精确到0.1天）
 * - 1-10000年：显示"X年X天"（天数四舍五入）
 * - 超过10000年：显示"X.XX万年"（保留两位小数）
 */
export function formatDuration(years: number): string {
  if (years >= 10000) return `${(years / 10000).toFixed(2)}万年`;
  if (years >= 1) {
    const fullYears = Math.floor(years);
    const days = Math.round((years - fullYears) * 365);
    if (days === 0) return `${fullYears}年`;
    return `${fullYears}年${days}天`;
  }
  // 小于1年，显示天数（精确到0.1天）
  const days = years * 365;
  return `${days.toFixed(1)}天`;
}

/**
 * 格式化系数显示（× 格式）
 */
export function formatCoefficient(value: number): string {
  if (value >= 100) {
    return `×${value.toFixed(0)}`;
  } else if (value >= 10) {
    return `×${value.toFixed(1)}`;
  } else {
    return `×${value.toFixed(2)}`;
  }
}

// ============================================================================
// 完整计算函数
// ============================================================================

/**
 * 完整计算所有境界
 */
export function calculateAll(
  params: CalculationParams,
  resource: ResourceConfig,
  overrides?: CoefficientOverrides
): CalculationResult {
  const subLevelResults: SubLevelResult[] = [];
  const realmSummaries: RealmSummary[] = [];
  const alerts: Alert[] = [];

  let cumulativeCost = 0;
  let cumulativeTheoreticalDuration = 0;
  let cumulativeResourceDuration = 0;
  let maxSingleCost = 0;
  let maxRealmReached = '';

  // 根据炼气层数获取动态境界配置
  const REALM_CONFIGS = getRealmConfigs(params.qiCondensationLayers);

  // 计算转换率和吸收率
  const conversionRate = calculateConversionRate(params, overrides);
  const absorptionRate = calculateAbsorptionRate(params, overrides);

  // 计算资源产出（支持可配置的进位倍率）
  const mineOutput = calculateResourceProduction(
    resource.mineType,
    resource.mineGrade,
    resource.mineLevel,
    params.mediumGradeMultiplier
  );
  const plantOutput = calculateResourceProduction(
    'plant',
    resource.plantGrade,
    resource.plantLevel,
    params.mediumGradeMultiplier
  );
  const maxProduction = Math.max(mineOutput, plantOutput);

  // 遍历所有境界
  for (let realmIndex = 0; realmIndex < REALM_CONFIGS.length; realmIndex++) {
    const realm = REALM_CONFIGS[realmIndex];
    const realmSubLevels: SubLevelResult[] = [];
    let realmTotalCost = 0;
    let realmTotalTheoreticalDuration = 0;
    let realmTotalResourceDuration = 0;

    // 遍历小境界
    for (let subLevelIndex = 0; subLevelIndex < realm.subLevels.length; subLevelIndex++) {
      const subLevel = realm.subLevels[subLevelIndex];

      // 计算消耗（考虑转换率）
      const cost = calculateSubLevelCost(
        params.baseCost,
        params.smallRealmMultiplier,
        params.largeRealmMultiplier,
        params.foundationBuildingMultiplier,
        realmIndex,
        subLevelIndex,
        params.qiCondensationLayers,
        conversionRate
      );

      cumulativeCost += cost;
      realmTotalCost += cost;

      // 计算两种时长
      const durationResult = calculateDualDuration(cost, absorptionRate, maxProduction, params.baseAbsorptionRate);

      cumulativeTheoreticalDuration += durationResult.theoreticalDuration;
      cumulativeResourceDuration += durationResult.resourceLimitedDuration;
      realmTotalTheoreticalDuration += durationResult.theoreticalDuration;
      realmTotalResourceDuration += durationResult.resourceLimitedDuration;

      // 剩余寿命（基于理论时长）
      const lifespanRemaining = realm.lifespan - cumulativeTheoreticalDuration;

      const result: SubLevelResult = {
        realmName: realm.name,
        subLevelName: subLevel.name,
        subLevelIndex,
        cost,
        cumulativeCost,
        duration: durationResult.theoreticalDuration, // 保留兼容性
        cumulativeDuration: cumulativeTheoreticalDuration, // 保留兼容性
        theoreticalDuration: durationResult.theoreticalDuration,
        cumulativeTheoreticalDuration,
        resourceLimitedDuration: durationResult.resourceLimitedDuration,
        cumulativeResourceDuration,
        bottleneckRatio: durationResult.bottleneckRatio,
        lifespanRemaining,
        isLifespanExceeded: cumulativeTheoreticalDuration > realm.lifespan,
      };

      subLevelResults.push(result);
      realmSubLevels.push(result);

      // 追踪最大单次消耗
      if (cost > maxSingleCost) {
        maxSingleCost = cost;
        maxRealmReached = `${realm.name}${subLevel.name}`;
      }

      // 检测寿命不足（规则1：使用理论时长判断）
      if (cumulativeTheoreticalDuration > realm.lifespan && alerts.length < 50) {
        const existingAlert = alerts.find(
          a => a.type === 'lifespan' && a.realm === realm.name
        );
        if (!existingAlert) {
          alerts.push({
            type: 'lifespan',
            realm: realm.name,
            message: `[理论崩塌] ${realm.name}: 理论需${formatDuration(cumulativeTheoreticalDuration)}，但只有${realm.lifespan}年`,
            severity: cumulativeTheoreticalDuration > realm.lifespan * 1.5 ? 'critical' : 'error',
            actualValue: cumulativeTheoreticalDuration,
            threshold: realm.lifespan,
            isTheoreticalBreakdown: true,
          });
        }
      }

      // 检测资源断档（规则2：降级为 warning，可通过剧情解决）
      if (cost > maxProduction && alerts.length < 50) {
        const existingAlert = alerts.find(
          a => a.type === 'resource' && a.realm === realm.name
        );
        if (!existingAlert) {
          alerts.push({
            type: 'resource',
            realm: realm.name,
            message: `[资源缺口] ${realm.name}${subLevel.name}: 单次需${formatSpiritStones(cost)}，但灵脉最多年产${formatSpiritStones(maxProduction)}`,
            severity: cost > maxProduction * 10 ? 'error' : 'warning',
            actualValue: cost,
            threshold: maxProduction,
            isTheoreticalBreakdown: false,
          });
        }
      }

      // 检测瓶颈比例（仅当瓶颈严重且寿元不足时）
      if (durationResult.bottleneckRatio > 2 && cumulativeTheoreticalDuration > realm.lifespan && alerts.length < 50) {
        const existingAlert = alerts.find(
          a => a.type === 'bottleneck' && a.realm === realm.name
        );
        if (!existingAlert) {
          alerts.push({
            type: 'bottleneck',
            realm: realm.name,
            message: `[雪上加霜] 理论可成但寿元不足，且资源限制时长是理论的 ${durationResult.bottleneckRatio.toFixed(1)} 倍`,
            severity: 'error',
            actualValue: durationResult.bottleneckRatio,
            threshold: 2,
            isTheoreticalBreakdown: true,
          });
        }
      }
    }

    realmSummaries.push({
      realmName: realm.name,
      totalCost: realmTotalCost,
      totalDuration: realmTotalTheoreticalDuration, // 保留兼容性
      subLevels: realmSubLevels,
    });

    // 如果寿命已经不足，停止后续计算
    if (cumulativeTheoreticalDuration > realm.lifespan) {
      break;
    }
  }

  // 检测指数爆炸警告
  if (params.smallRealmMultiplier > 2.5) {
    alerts.push({
      type: 'exponential',
      realm: '全局',
      message: `[指数爆炸] 小境界系数(${params.smallRealmMultiplier})过高，后期可能失控`,
      severity: 'warning',
      actualValue: params.smallRealmMultiplier,
      threshold: 2.5,
      isTheoreticalBreakdown: false,
    });
  }

  if (params.largeRealmMultiplier > 20) {
    alerts.push({
      type: 'exponential',
      realm: '全局',
      message: `[指数爆炸] 大境界系数(${params.largeRealmMultiplier})过高，后期可能失控`,
      severity: 'warning',
      actualValue: params.largeRealmMultiplier,
      threshold: 20,
      isTheoreticalBreakdown: false,
    });
  }

  return {
    realms: realmSummaries,
    subLevels: subLevelResults,
    alerts,
    totalDuration: cumulativeTheoreticalDuration, // 保留兼容性
    maxRealmReached,
    resourceSelfSufficiency: {
      mineOutput,
      plantOutput,
      maxSingleCost,
      isSufficient: maxSingleCost <= maxProduction,
    },
  };
}

/**
 * 验证参数合法性
 */
export function validateParams(params: CalculationParams): string[] {
  const errors: string[] = [];

  if (params.baseCost <= 0) {
    errors.push('基数必须大于0');
  }

  if (params.smallRealmMultiplier < 1) {
    errors.push('小境界系数不能小于1');
  }

  if (params.largeRealmMultiplier < 1) {
    errors.push('大境界系数不能小于1');
  }

  if (params.qiCondensationLayers < 3 || params.qiCondensationLayers > 20) {
    errors.push('炼气层数应在3-20之间');
  }

  if (params.baseAbsorptionRate < 1 || params.baseAbsorptionRate > 24) {
    errors.push('吸收一颗灵石所需时辰应在1-24之间');
  }

  // 新体系：功法品质系数范围 0.1-999（值越大越好）
  if (params.techniqueQuality < 0.1 || params.techniqueQuality > 999) {
    errors.push('功法品质系数应在0.1-999之间');
  }

  // 筑基倍率可选，但如果设置了需要验证
  if (params.foundationBuildingMultiplier !== undefined) {
    if (params.foundationBuildingMultiplier < 1 || params.foundationBuildingMultiplier > 999) {
      errors.push('筑基倍率应在1-999之间');
    }
  }

  // 灵脉进位倍率可选
  if (params.mediumGradeMultiplier !== undefined) {
    if (params.mediumGradeMultiplier < 1 || params.mediumGradeMultiplier > 999) {
      errors.push('中品进位倍率应在1-999之间');
    }
  }

  // 吸收效率参数范围 0.1-999
  if (params.comprehension < 0.1 || params.comprehension > 999) {
    errors.push('悟性应在0.1-999之间');
  }

  if (params.physiqueFactor < 0.1 || params.physiqueFactor > 999) {
    errors.push('体系数应在0.1-999之间');
  }

  if (params.environmentFactor < 0.1 || params.environmentFactor > 999) {
    errors.push('环境系数应在0.1-999之间');
  }

  if (params.retreatFactor < 0.1 || params.retreatFactor > 999) {
    errors.push('闭关系数应在0.1-999之间');
  }

  if (params.epiphanyFactor < 0.1 || params.epiphanyFactor > 999) {
    errors.push('顿悟系数应在0.1-999之间');
  }

  return errors;
}
