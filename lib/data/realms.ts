// ============================================================================
// 境界体系配置
// ============================================================================

import type { RealmConfig } from '@/lib/types';

/**
 * 创建小境界配置（前期/中期/后期/大圆满）
 */
function createStandardSubLevels() {
  return [
    { name: '前期', index: 0 },
    { name: '中期', index: 1 },
    { name: '后期', index: 2 },
    { name: '大圆满', index: 3 },
  ];
}

/**
 * 创建炼气期小境界配置（动态层数）
 */
function createQiCondensationSubLayers(layers: number) {
  return Array.from({ length: layers }, (_, i) => ({
    name: `${i + 1}层`,
    index: i,
  }));
}

/**
 * 境界基础配置（不含炼气期）
 */
const BASE_REALM_CONFIGS: Omit<RealmConfig, 'subLevels'>[] = [
  { name: '筑基', lifespan: 200 },
  { name: '金丹', lifespan: 500 },
  { name: '元婴', lifespan: 1000 },
  { name: '化神', lifespan: 2000 },
  { name: '炼虚', lifespan: 4000 },
  { name: '合体', lifespan: 8000 },
  { name: '大乘', lifespan: 20000 },
  { name: '渡劫', lifespan: 30000 },
];

/**
 * 标准九大境界配置（保留默认12层用于兼容）
 * @deprecated 使用 getRealmConfigs 替代
 */
export const REALM_CONFIGS: RealmConfig[] = getRealmConfigs(12);

/**
 * 根据炼气层数获取动态境界配置
 */
export function getRealmConfigs(qiCondensationLayers: number = 12): RealmConfig[] {
  const configs: RealmConfig[] = [
    {
      name: '炼气',
      subLevels: createQiCondensationSubLayers(qiCondensationLayers),
      lifespan: 100,
    },
    ...BASE_REALM_CONFIGS.map(config => ({
      ...config,
      subLevels: createStandardSubLevels(),
    })),
  ];
  return configs;
}

/**
 * 境界数量
 */
export const REALM_COUNT = REALM_CONFIGS.length;

/**
 * 获取境界配置
 */
export function getRealmConfig(realmIndex: number): RealmConfig | undefined {
  return REALM_CONFIGS[realmIndex];
}

/**
 * 获取境界名称
 */
export function getRealmName(realmIndex: number): string {
  return REALM_CONFIGS[realmIndex]?.name || '';
}

/**
 * 获取境界寿命
 */
export function getRealmLifespan(realmIndex: number): number {
  return REALM_CONFIGS[realmIndex]?.lifespan || 0;
}

/**
 * 获取境界小境界数量
 */
export function getSubLevelCount(realmIndex: number): number {
  return REALM_CONFIGS[realmIndex]?.subLevels.length || 0;
}
