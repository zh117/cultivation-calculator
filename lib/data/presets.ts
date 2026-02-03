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
    // 基础参数
    baseCost: 12,
    smallRealmMultiplier: 2,
    largeRealmMultiplier: 10,
    qiCondensationLayers: 12,
    baseAbsorptionRate: 12, // 吸收一颗灵石需要12时辰，年吸收365颗
    // 转换率参数（影响消耗）
    comprehension: 1.0,
    techniqueQuality: 0.97, // 黄阶中
    spiritualRootType: 'waste', // 废灵根（五灵根）
    // 吸收效率参数（影响时长）
    physiqueFactor: 1.0,
    environmentFactor: 1.0,
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
 * 天才流预设
 * 天赋全面碾压，消耗少吸收快
 */
export const GENIUS_PRESET: PresetConfig = {
  id: 'genius',
  name: '天才流',
  description: '天赋高，消耗少且吸收快',
  params: {
    // 基础参数
    baseCost: 12,
    smallRealmMultiplier: 2,
    largeRealmMultiplier: 10,
    qiCondensationLayers: 12,
    baseAbsorptionRate: 6, // 吸收一颗灵石需要6时辰，年吸收730颗
    // 转换率参数（影响消耗）
    comprehension: 1.5,
    techniqueQuality: 0.79, // 玄阶上
    spiritualRootType: 'heavenly', // 天灵根（单灵根）
    // 吸收效率参数（影响时长）
    physiqueFactor: 2.0,   // 天灵根，吸收也快
    environmentFactor: 1.0,
    retreatFactor: 1.5,
    epiphanyFactor: 1.5,
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
    // 基础参数
    baseCost: 10,
    smallRealmMultiplier: 1.5,
    largeRealmMultiplier: 5,
    qiCondensationLayers: 9,
    baseAbsorptionRate: 6, // 吸收一颗灵石需要6时辰，年吸收730颗
    // 转换率参数（影响消耗）
    comprehension: 1.2,
    techniqueQuality: 0.85, // 玄阶中
    spiritualRootType: 'dual', // 双灵根
    // 吸收效率参数（影响时长）
    physiqueFactor: 1.2,
    environmentFactor: 1.2,
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
 * 土豪流预设
 * 天赋一般，但资源堆砌
 */
export const TYCOON_PRESET: PresetConfig = {
  id: 'tycoon',
  name: '土豪流',
  description: '天赋一般，靠资源堆砌',
  params: {
    // 基础参数
    baseCost: 12,
    smallRealmMultiplier: 2,
    largeRealmMultiplier: 10,
    qiCondensationLayers: 12,
    baseAbsorptionRate: 8, // 吸收一颗灵石需要8时辰，年吸收547颗
    // 转换率参数（影响消耗）
    comprehension: 1.0,
    techniqueQuality: 0.72, // 地阶下
    spiritualRootType: 'triple', // 三灵根
    // 吸收效率参数（影响时长）
    physiqueFactor: 1.0,
    environmentFactor: 3.0, // 大型灵脉
    retreatFactor: 2.0,
    epiphanyFactor: 1.0,
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
 * 速成流预设
 * 极速升级，后期可能崩坏
 */
export const FAST_CULTIVATION_PRESET: PresetConfig = {
  id: 'fast-cultivation',
  name: '速成流',
  description: '极速突破，注意后期数值可能失控',
  params: {
    // 基础参数
    baseCost: 8,
    smallRealmMultiplier: 1.2,
    largeRealmMultiplier: 3,
    qiCondensationLayers: 9,
    baseAbsorptionRate: 4, // 吸收一颗灵石需要4时辰，年吸收1095颗
    // 转换率参数（影响消耗）
    comprehension: 2.0,
    techniqueQuality: 0.90, // 玄阶下
    spiritualRootType: 'dual', // 双灵根
    // 吸收效率参数（影响时长）
    physiqueFactor: 1.5,
    environmentFactor: 1.5,
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
    // 基础参数
    baseCost: 20,
    smallRealmMultiplier: 2.5,
    largeRealmMultiplier: 15,
    qiCondensationLayers: 15,
    baseAbsorptionRate: 18, // 吸收一颗灵石需要18时辰，年吸收243颗
    // 转换率参数（影响消耗）
    comprehension: 0.8,
    techniqueQuality: 0.99, // 黄阶下
    spiritualRootType: 'waste', // 废灵根（五灵根）
    // 吸收效率参数（影响时长）
    physiqueFactor: 0.8,
    environmentFactor: 0.8,
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
  genius: GENIUS_PRESET,
  'high-martial': HIGH_MARTIAL_PRESET,
  tycoon: TYCOON_PRESET,
  'fast-cultivation': FAST_CULTIVATION_PRESET,
  'hard-mode': HARD_MODE_PRESET,
};

/**
 * 预设选项列表（用于下拉选择）
 */
export const PRESET_OPTIONS = [
  { value: 'mortal', label: '凡人流', description: '经典凡人流数值体系' },
  { value: 'genius', label: '天才流', description: '天赋高，消耗少且吸收快' },
  { value: 'high-martial', label: '高武流', description: '升级速度快，适合爽文' },
  { value: 'tycoon', label: '土豪流', description: '天赋一般，靠资源堆砌' },
  { value: 'fast-cultivation', label: '速成流', description: '极速突破，注意后期数值' },
  { value: 'hard-mode', label: '困难模式', description: '资源匮乏，修炼艰难' },
];
