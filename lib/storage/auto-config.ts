// ============================================================================
// 自动配置存储管理（基于 localStorage）
// 用于实时保存用户当前输入的配置，刷新后自动恢复
// ============================================================================

import type { AutoSavedConfig, CalculationParams, ResourceConfig, CoefficientOverrides } from '@/lib/types';

const STORAGE_KEY = 'cultivation-calculator-current-config';

/**
 * 保存当前配置到 localStorage
 */
export function saveAutoConfig(
  params: CalculationParams,
  resource: ResourceConfig,
  coefficientOverrides?: CoefficientOverrides
): void {
  if (typeof window === 'undefined') return;

  try {
    const config: AutoSavedConfig = {
      params,
      resource,
      coefficientOverrides,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save auto config:', e);
  }
}

/**
 * 从 localStorage 加载当前配置
 */
export function loadAutoConfig(): AutoSavedConfig | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const config = JSON.parse(data) as AutoSavedConfig;

    // 兼容旧数据：迁移旧体系系数到新体系
    const params = migrateOldParams(config.params);

    return {
      ...config,
      params,
    };
  } catch (e) {
    console.warn('Failed to load auto config:', e);
    return null;
  }
}

/**
 * 清除当前配置
 */
export function clearAutoConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 迁移旧体系系数到新体系（公式反转）
 * 旧体系：值越小越好（0.22-0.99）
 * 新体系：值越大越好（除法反转）
 */
function migrateOldParams(params: CalculationParams): CalculationParams {
  const migrated = { ...params };

  // 功法品质：旧值 0.22-0.99 → 新值使用倒数
  // 如果值在 0.1-1 范围内，说明是旧体系，需要转换
  if (migrated.techniqueQuality > 0 && migrated.techniqueQuality <= 1) {
    migrated.techniqueQuality = 1 / migrated.techniqueQuality;
  }

  // 吸收效率参数保持不变（本来就是越大越好）

  return migrated;
}
