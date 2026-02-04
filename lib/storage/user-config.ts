// ============================================================================
// 用户配置存储管理（基于 localStorage）
// 细粒度存储用户自定义值，预设仅用于初始化
// ============================================================================

import type { UserOverrides, CurrentPresetInfo, CalculationParams, ResourceConfig, PresetConfig } from '@/lib/types';

const PRESET_KEY = 'cultivation-current-preset';
const OVERRIDES_KEY = 'cultivation-user-overrides';

// ============================================================================
// 预设管理
// ============================================================================

/**
 * 获取当前预设 ID
 */
export function getCurrentPreset(): string {
  if (typeof window === 'undefined') return 'mortal';

  try {
    const data = localStorage.getItem(PRESET_KEY);
    if (!data) return 'mortal';

    const info = JSON.parse(data) as CurrentPresetInfo;
    return info.presetId || 'mortal';
  } catch {
    return 'mortal';
  }
}

/**
 * 设置当前预设 ID
 */
export function setCurrentPreset(presetId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const info: CurrentPresetInfo = {
      presetId,
      updatedAt: Date.now(),
    };
    localStorage.setItem(PRESET_KEY, JSON.stringify(info));
  } catch (e) {
    console.warn('Failed to save current preset:', e);
  }
}

// ============================================================================
// 覆盖值管理
// ============================================================================

/**
 * 获取用户覆盖值
 */
export function getUserOverrides(): UserOverrides {
  if (typeof window === 'undefined') return {};

  try {
    const data = localStorage.getItem(OVERRIDES_KEY);
    if (!data) return {};

    return JSON.parse(data) as UserOverrides;
  } catch {
    return {};
  }
}

/**
 * 保存用户覆盖值（完整替换）
 */
export function setUserOverrides(overrides: UserOverrides): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.warn('Failed to save user overrides:', e);
  }
}

/**
 * 更新单个覆盖值（细粒度）
 */
export function setUserOverride<K extends keyof UserOverrides>(
  key: K,
  value: UserOverrides[K]
): void {
  const overrides = getUserOverrides();
  overrides[key] = value;
  setUserOverrides(overrides);
}

/**
 * 清除单个覆盖值（恢复预设默认值）
 */
export function clearUserOverride<K extends keyof UserOverrides>(key: K): void {
  const overrides = getUserOverrides();
  delete overrides[key];
  setUserOverrides(overrides);
}

/**
 * 清除所有覆盖值
 */
export function clearAllUserOverrides(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(OVERRIDES_KEY);
}

// ============================================================================
// 配置构建
// ============================================================================

/**
 * 构建完整的 CalculationParams
 * 优先级：userOverrides > preset
 */
export function buildParams(preset: PresetConfig): CalculationParams {
  const overrides = getUserOverrides();
  const params = { ...preset.params };

  // 基础参数覆盖
  if (overrides.baseCost !== undefined) params.baseCost = overrides.baseCost;
  if (overrides.smallRealmMultiplier !== undefined) params.smallRealmMultiplier = overrides.smallRealmMultiplier;
  if (overrides.largeRealmMultiplier !== undefined) params.largeRealmMultiplier = overrides.largeRealmMultiplier;
  if (overrides.foundationBuildingMultiplier !== undefined) {
    params.foundationBuildingMultiplier = overrides.foundationBuildingMultiplier;
  }
  if (overrides.qiCondensationLayers !== undefined) params.qiCondensationLayers = overrides.qiCondensationLayers;
  if (overrides.baseAbsorptionRate !== undefined) params.baseAbsorptionRate = overrides.baseAbsorptionRate;
  if (overrides.mediumGradeMultiplier !== undefined) {
    params.mediumGradeMultiplier = overrides.mediumGradeMultiplier;
  }

  // 小类互斥选项覆盖
  if (overrides.techniqueQuality !== undefined) params.techniqueQuality = overrides.techniqueQuality;
  if (overrides.spiritualRootType !== undefined) params.spiritualRootType = overrides.spiritualRootType;

  // 吸收效率覆盖
  if (overrides.comprehension !== undefined) params.comprehension = overrides.comprehension;
  if (overrides.physiqueFactor !== undefined) params.physiqueFactor = overrides.physiqueFactor;
  if (overrides.environmentFactor !== undefined) params.environmentFactor = overrides.environmentFactor;
  if (overrides.retreatFactor !== undefined) params.retreatFactor = overrides.retreatFactor;
  if (overrides.epiphanyFactor !== undefined) params.epiphanyFactor = overrides.epiphanyFactor;

  return params;
}

/**
 * 构建完整的 ResourceConfig
 * 优先级：userOverrides > preset
 */
export function buildResource(preset: PresetConfig): ResourceConfig {
  const overrides = getUserOverrides();
  const resource = { ...preset.resource };

  // 灵脉资源覆盖
  if (overrides.mineGrade !== undefined) resource.mineGrade = overrides.mineGrade;
  if (overrides.mineLevel !== undefined) resource.mineLevel = overrides.mineLevel;
  if (overrides.plantGrade !== undefined) resource.plantGrade = overrides.plantGrade;
  if (overrides.plantLevel !== undefined) resource.plantLevel = overrides.plantLevel;

  return resource;
}

// ============================================================================
// 兼容性迁移
// ============================================================================

/**
 * 从旧的 auto-config 迁移数据
 * @returns 是否成功迁移
 */
export function migrateFromAutoConfig(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const OLD_KEY = 'cultivation-calculator-current-config';
    const oldData = localStorage.getItem(OLD_KEY);
    if (!oldData) return false;

    const oldConfig = JSON.parse(oldData);
    if (!oldConfig.params) return false;

    // 提取所有非默认值作为覆盖值
    const overrides: UserOverrides = {};
    const params = oldConfig.params;
    const resource = oldConfig.resource;

    // 基础参数（假设凡人流的值作为默认）
    if (params.baseCost !== 12) overrides.baseCost = params.baseCost;
    if (params.smallRealmMultiplier !== 2) overrides.smallRealmMultiplier = params.smallRealmMultiplier;
    if (params.largeRealmMultiplier !== 10) overrides.largeRealmMultiplier = params.largeRealmMultiplier;
    if (params.qiCondensationLayers !== 12) overrides.qiCondensationLayers = params.qiCondensationLayers;
    if (params.baseAbsorptionRate !== 12) overrides.baseAbsorptionRate = params.baseAbsorptionRate;

    // 可选参数
    if (params.foundationBuildingMultiplier !== undefined) overrides.foundationBuildingMultiplier = params.foundationBuildingMultiplier;
    if (params.mediumGradeMultiplier !== undefined) overrides.mediumGradeMultiplier = params.mediumGradeMultiplier;

    // 小类选项（默认值：废灵根、黄阶中）
    if (params.spiritualRootType !== 'waste') overrides.spiritualRootType = params.spiritualRootType;
    if (params.techniqueQuality !== 1.03) overrides.techniqueQuality = params.techniqueQuality;

    // 吸收效率（默认值：1.0）
    if (params.comprehension !== 1.0) overrides.comprehension = params.comprehension;
    if (params.physiqueFactor !== 1.0) overrides.physiqueFactor = params.physiqueFactor;
    if (params.environmentFactor !== 1.0) overrides.environmentFactor = params.environmentFactor;
    if (params.retreatFactor !== 1.0) overrides.retreatFactor = params.retreatFactor;
    if (params.epiphanyFactor !== 1.0) overrides.epiphanyFactor = params.epiphanyFactor;

    // 资源配置（默认值：下品、3级）
    if (resource.mineGrade !== 'inferior') overrides.mineGrade = resource.mineGrade;
    if (resource.mineLevel !== 3) overrides.mineLevel = resource.mineLevel;
    if (resource.plantGrade !== 'inferior') overrides.plantGrade = resource.plantGrade;
    if (resource.plantLevel !== 3) overrides.plantLevel = resource.plantLevel;

    // 只有存在覆盖值时才保存
    if (Object.keys(overrides).length > 0) {
      setUserOverrides(overrides);
    }

    // 设置为自定义预设
    setCurrentPreset('custom');

    // 清除旧数据
    localStorage.removeItem(OLD_KEY);

    return true;
  } catch {
    return false;
  }
}

/**
 * 从旧的 schemes 迁移最新的方案
 * @returns 是否成功迁移
 */
export function migrateFromSchemes(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const OLD_KEY = 'cultivation-calculator-schemes';
    const oldData = localStorage.getItem(OLD_KEY);
    if (!oldData) return false;

    const schemes = JSON.parse(oldData);
    if (!Array.isArray(schemes) || schemes.length === 0) return false;

    // 获取最新的方案
    const latestScheme = schemes.sort((a: { createdAt: number }, b: { createdAt: number }) =>
      b.createdAt - a.createdAt
    )[0];

    if (!latestScheme || !latestScheme.params) return false;

    // 提取所有值作为覆盖值
    const overrides: UserOverrides = {};
    const params = latestScheme.params;
    const resource = latestScheme.resource;

    // 提取所有基础参数
    overrides.baseCost = params.baseCost;
    overrides.smallRealmMultiplier = params.smallRealmMultiplier;
    overrides.largeRealmMultiplier = params.largeRealmMultiplier;
    overrides.qiCondensationLayers = params.qiCondensationLayers;
    overrides.baseAbsorptionRate = params.baseAbsorptionRate;

    // 可选参数
    if (params.foundationBuildingMultiplier !== undefined) overrides.foundationBuildingMultiplier = params.foundationBuildingMultiplier;
    if (params.mediumGradeMultiplier !== undefined) overrides.mediumGradeMultiplier = params.mediumGradeMultiplier;

    // 小类选项
    overrides.spiritualRootType = params.spiritualRootType;
    overrides.techniqueQuality = params.techniqueQuality;

    // 吸收效率
    overrides.comprehension = params.comprehension;
    overrides.physiqueFactor = params.physiqueFactor;
    overrides.environmentFactor = params.environmentFactor;
    overrides.retreatFactor = params.retreatFactor;
    overrides.epiphanyFactor = params.epiphanyFactor;

    // 资源配置
    overrides.mineGrade = resource.mineGrade;
    overrides.mineLevel = resource.mineLevel;
    overrides.plantGrade = resource.plantGrade;
    overrides.plantLevel = resource.plantLevel;

    setUserOverrides(overrides);
    setCurrentPreset('custom');

    return true;
  } catch {
    return false;
  }
}
