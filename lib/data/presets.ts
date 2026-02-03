// ============================================================================
// 预设方案配置
// ============================================================================

import type { PresetConfig } from '@/lib/types';

/**
 * 默认凡人流预设
 * 基于经典修仙小说数值体系
 */
export const MORTAL_PRESET: PresetConfig = {
  id: 'mortal',
  name: '凡人流',
  description: '经典凡人流数值体系，适合传统修仙小说',
  params: {
    baseCost: 12,
    smallRealmMultiplier: 2,
    largeRealmMultiplier: 10,
    qiCondensationLayers: 12,
    techniqueQuality: 1.0,
    environmentFactor: 1.0,
    physiqueFactor: 1.0,
    retreatFactor: 1.0,
    epiphanyFactor: 1.0,
  },
  resource: {
    mineType: 'mine',
    mineGrade: 'inferior',
    mineLevel: 3,
    plantGrade: 'inferior',
    plantLevel: 3,
  },
};

/**
 * 高武流预设
 * 升级更快，资源需求更低
 */
export const HIGH_MARTIAL_PRESET: PresetConfig = {
  id: 'high-martial',
  name: '高武流',
  description: '升级速度快，适合爽文风格',
  params: {
    baseCost: 10,
    smallRealmMultiplier: 1.5,
    largeRealmMultiplier: 5,
    qiCondensationLayers: 9,
    techniqueQuality: 1.2,
    environmentFactor: 1.2,
    physiqueFactor: 1.2,
    retreatFactor: 1.0,
    epiphanyFactor: 1.0,
  },
  resource: {
    mineType: 'mine',
    mineGrade: 'medium',
    mineLevel: 5,
    plantGrade: 'medium',
    plantLevel: 5,
  },
};

/**
 * 速成流预设
 * 极速升级，后期可能崩坏
 */
export const FAST_CULTIVATION_PRESET: PresetConfig = {
  id: 'fast-cultivation',
  name: '速成流',
  description: '极速突破，注意后期数值可能失控',
  params: {
    baseCost: 8,
    smallRealmMultiplier: 1.2,
    largeRealmMultiplier: 3,
    qiCondensationLayers: 9,
    techniqueQuality: 2.0,
    environmentFactor: 1.5,
    physiqueFactor: 1.5,
    retreatFactor: 1.5,
    epiphanyFactor: 1.5,
  },
  resource: {
    mineType: 'mine',
    mineGrade: 'superior',
    mineLevel: 7,
    plantGrade: 'superior',
    plantLevel: 7,
  },
};

/**
 * 困难模式预设
 * 资源稀缺，修炼极难
 */
export const HARD_MODE_PRESET: PresetConfig = {
  id: 'hard-mode',
  name: '困难模式',
  description: '资源匮乏，修炼艰难，适合写实风格',
  params: {
    baseCost: 20,
    smallRealmMultiplier: 2.5,
    largeRealmMultiplier: 15,
    qiCondensationLayers: 15,
    techniqueQuality: 0.8,
    environmentFactor: 0.8,
    physiqueFactor: 0.8,
    retreatFactor: 1.0,
    epiphanyFactor: 1.0,
  },
  resource: {
    mineType: 'mine',
    mineGrade: 'inferior',
    mineLevel: 1,
    plantGrade: 'inferior',
    plantLevel: 1,
  },
};

/**
 * 所有预设
 */
export const PRESETS: Record<string, PresetConfig> = {
  mortal: MORTAL_PRESET,
  'high-martial': HIGH_MARTIAL_PRESET,
  'fast-cultivation': FAST_CULTIVATION_PRESET,
  'hard-mode': HARD_MODE_PRESET,
};

/**
 * 预设选项列表（用于下拉选择）
 */
export const PRESET_OPTIONS = [
  { value: 'mortal', label: '凡人流', description: '经典凡人流数值体系' },
  { value: 'high-martial', label: '高武流', description: '升级速度快，适合爽文' },
  { value: 'fast-cultivation', label: '速成流', description: '极速突破，注意后期数值' },
  { value: 'hard-mode', label: '困难模式', description: '资源匮乏，修炼艰难' },
];
