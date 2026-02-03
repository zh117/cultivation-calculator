// ============================================================================
// 核心计算函数（纯函数）
// ============================================================================

import type { CalculationParams, CultivationParams, AbsorptionParams, ResourceConfig, CalculationResult, SubLevelResult, RealmSummary, Alert, DurationResult } from '@/lib/types';
import { REALM_CONFIGS } from '@/lib/data/realms';

// ============================================================================
// 常量
// ============================================================================

/** 基础吸收速度（下品灵石/年） */
const BASE_ABSORPTION_RATE = 100;

/** 灵根系数映射表
 * 废灵根（五灵根）: 1.0
 * 杂灵根（四灵根）: 0.9
 * 三灵根: 0.8
 * 双灵根: 0.6
 * 天灵根（单灵根）: 0.3
 */
const SPIRITUAL_ROOT_COEFFICIENTS: Record<string, number> = {
  waste: 1.0,      // 废灵根（五灵根）
  mixed: 0.9,      // 杂灵根（四灵根）
  triple: 0.8,     // 三灵根
  dual: 0.6,       // 双灵根
  heavenly: 0.3,   // 天灵根（单灵根）
};

/** 资源档位倍率 */
const GRADE_MULTIPLIERS: Record<string, number> = {
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
 * 值越高，消耗越少（天赋越高，需要的灵石越少）
 */
export function calculateConversionRate(params: CultivationParams): number {
  const talent = params.talent ?? 1.0;
  const comprehension = params.comprehension ?? 1.0;
  const technique = params.techniqueQuality ?? 1.0;
  const spiritualRootType = params.spiritualRootType ?? 'waste';
  const spiritualRootCoeff = SPIRITUAL_ROOT_COEFFICIENTS[spiritualRootType] ?? 1.0;
  // 转换率越高，实际消耗越少：rawCost / conversionRate
  // 灵根系数越小，转换率越高（天灵根0.3的系数会让消耗更少）
  return (talent * comprehension * technique) / spiritualRootCoeff;
}

/**
 * 计算吸收效率系数（影响吸收速度）
 * 值越高，吸收越快
 */
export function calculateAbsorptionRate(params: AbsorptionParams): number {
  const physique = params.physiqueFactor ?? 1.0;
  const environment = params.environmentFactor ?? 1.0;
  const retreat = params.retreatFactor ?? 1.0;
  const epiphany = params.epiphanyFactor ?? 1.0;
  return physique * environment * retreat * epiphany;
}

// ============================================================================
// 计算函数
// ============================================================================

/**
 * 计算小境界的资源消耗
 *
 * 公式：
 * - 首境（炼气1→2）= baseCost
 * - 首境后续小境界 = baseCost × smallRealmMultiplier^(subLevelIndex - 1)
 * - 跨大境界 = 前境界最后小境界消耗 × largeRealmMultiplier
 * - 新大境界小境界 = 跨大境界消耗 × smallRealmMultiplier^subLevelIndex
 *
 * @param baseCost - 基数
 * @param smallMultiplier - 小境界系数
 * @param largeMultiplier - 大境界系数
 * @param realmIndex - 境界索引（0开始）
 * @param subLevelIndex - 小境界索引（0开始）
 * @param qiCondensationLayers - 炼气层数
 * @param conversionRate - 转换率系数（值越高，消耗越少）
 * @returns 资源消耗（下品灵石）
 */
export function calculateSubLevelCost(
  baseCost: number,
  smallMultiplier: number,
  largeMultiplier: number,
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
  const realmBaseCost = firstRealmLastCost * Math.pow(largeMultiplier, realmIndex - 1);

  // 本大境界第一个小境界
  if (subLevelIndex === 0) {
    return (realmBaseCost * largeMultiplier) / conversionRate;
  }

  // 本大境界后续小境界
  return (realmBaseCost * largeMultiplier * Math.pow(smallMultiplier, subLevelIndex)) / conversionRate;
}

/**
 * 计算两种时长（理论时长 vs 资源限制时长）
 */
export function calculateDualDuration(
  cost: number,
  absorptionRate: number,
  resourceProduction: number
): DurationResult {
  // 理论时长：纯吸收能力，不考虑资源限制
  const effectiveAbsorptionRate = BASE_ABSORPTION_RATE * absorptionRate;
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
  efficiencyFactor: number
): number {
  const effectiveRate = BASE_ABSORPTION_RATE * efficiencyFactor;
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
  level: number
): number {
  const gradeMultiplier = GRADE_MULTIPLIERS[grade] || 1;
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
 */
export function formatDuration(years: number): string {
  if (years >= 10000) return `${(years / 10000).toFixed(2)}万年`;
  if (years >= 100) return `${(years / 100).toFixed(2)}世纪`;
  if (years >= 1) return `${years.toFixed(2)}年`;
  return `${(years * 12).toFixed(1)}月`;
}

// ============================================================================
// 完整计算函数
// ============================================================================

/**
 * 完整计算所有境界
 */
export function calculateAll(
  params: CalculationParams,
  resource: ResourceConfig
): CalculationResult {
  const subLevelResults: SubLevelResult[] = [];
  const realmSummaries: RealmSummary[] = [];
  const alerts: Alert[] = [];

  let cumulativeCost = 0;
  let cumulativeTheoreticalDuration = 0;
  let cumulativeResourceDuration = 0;
  let maxSingleCost = 0;
  let maxRealmReached = '';

  // 计算转换率和吸收率
  const conversionRate = calculateConversionRate(params);
  const absorptionRate = calculateAbsorptionRate(params);

  // 计算资源产出
  const mineOutput = calculateResourceProduction(
    resource.mineType,
    resource.mineGrade,
    resource.mineLevel
  );
  const plantOutput = calculateResourceProduction(
    'plant',
    resource.plantGrade,
    resource.plantLevel
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
        realmIndex,
        subLevelIndex,
        params.qiCondensationLayers,
        conversionRate
      );

      cumulativeCost += cost;
      realmTotalCost += cost;

      // 计算两种时长
      const durationResult = calculateDualDuration(cost, absorptionRate, maxProduction);

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

  // 转换率参数
  if (params.talent < 0.1 || params.talent > 10) {
    errors.push('天赋应在0.1-10之间');
  }

  if (params.comprehension < 0.1 || params.comprehension > 10) {
    errors.push('悟性应在0.1-10之间');
  }

  if (params.techniqueQuality < 0.1 || params.techniqueQuality > 10) {
    errors.push('功法品质应在0.1-10之间');
  }

  // 吸收效率参数
  if (params.physiqueFactor < 0.1 || params.physiqueFactor > 10) {
    errors.push('体系数应在0.1-10之间');
  }

  if (params.environmentFactor < 0.1 || params.environmentFactor > 10) {
    errors.push('环境系数应在0.1-10之间');
  }

  if (params.retreatFactor < 0.1 || params.retreatFactor > 10) {
    errors.push('闭关系数应在0.1-10之间');
  }

  if (params.epiphanyFactor < 1 || params.epiphanyFactor > 100) {
    errors.push('顿悟系数应在1-100之间');
  }

  return errors;
}
