// ============================================================================
// 境界体系配置
// ============================================================================

import type { RealmConfig } from '@/lib/types';

/**
 * 标准九大境界配置
 */
export const REALM_CONFIGS: RealmConfig[] = [
  {
    name: '炼气',
    subLevels: Array.from({ length: 12 }, (_, i) => ({
      name: `${i + 1}层`,
      index: i,
    })),
    lifespan: 100,
  },
  {
    name: '筑基',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 200,
  },
  {
    name: '金丹',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 500,
  },
  {
    name: '元婴',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 1000,
  },
  {
    name: '化神',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 2000,
  },
  {
    name: '炼虚',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 4000,
  },
  {
    name: '合体',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 8000,
  },
  {
    name: '大乘',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 15000,
  },
  {
    name: '渡劫',
    subLevels: [
      { name: '前期', index: 0 },
      { name: '中期', index: 1 },
      { name: '后期', index: 2 },
      { name: '大圆满', index: 3 },
    ],
    lifespan: 30000,
  },
];

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
