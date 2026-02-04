// ============================================================================
// 预设方案配置（新体系：值越大越好）
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
    // 转换率参数（新体系：值越大越好）
    comprehension: 1.0,
    techniqueQuality: 1.03, // 黄阶中（原0.97取倒数）
    spiritualRootType: 'waste', // 废灵根（五灵根）
    // 吸收效率参数（值越大越好）
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
    // 转换率参数（新体系：值越大越好）
    comprehension: 1.5,
    techniqueQuality: 1.27, // 玄阶上（原0.79取倒数）
    spiritualRootType: 'heavenly', // 天灵根（单灵根）
    // 吸收效率参数
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
    // 转换率参数（新体系：值越大越好）
    comprehension: 1.2,
    techniqueQuality: 1.18, // 玄阶中（原0.85取倒数）
    spiritualRootType: 'dual', // 双灵根
    // 吸收效率参数
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
    // 转换率参数（新体系：值越大越好）
    comprehension: 1.0,
    techniqueQuality: 1.39, // 地阶下（原0.72取倒数）
    spiritualRootType: 'triple', // 三灵根
    // 吸收效率参数
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
    // 转换率参数（新体系：值越大越好）
    comprehension: 2.0,
    techniqueQuality: 1.11, // 玄阶下（原0.90取倒数）
    spiritualRootType: 'dual', // 双灵根
    // 吸收效率参数
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
    // 转换率参数（新体系：值越大越好）
    comprehension: 0.8,
    techniqueQuality: 1.01, // 黄阶下（原0.99取倒数）
    spiritualRootType: 'waste', // 废灵根（五灵根）
    // 吸收效率参数
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

/**
 * 功法品质选项（新体系：值越大越好）
 */
export const TECHNIQUE_OPTIONS = [
  { id: 'yellow-inferior', value: 1.01, label: '黄阶下', color: 'text-gray-500' },
  { id: 'yellow-medium', value: 1.03, label: '黄阶中', color: 'text-gray-500' },
  { id: 'yellow-superior', value: 1.06, label: '黄阶上', color: 'text-gray-400' },
  { id: 'mysterious-inferior', value: 1.11, label: '玄阶下', color: 'text-green-600' },
  { id: 'mysterious-medium', value: 1.18, label: '玄阶中', color: 'text-green-500' },
  { id: 'mysterious-superior', value: 1.27, label: '玄阶上', color: 'text-green-400' },
  { id: 'earth-inferior', value: 1.39, label: '地阶下', color: 'text-blue-600' },
  { id: 'earth-medium', value: 1.56, label: '地阶中', color: 'text-blue-500' },
  { id: 'earth-superior', value: 1.82, label: '地阶上', color: 'text-blue-400' },
  { id: 'heaven-inferior', value: 2.22, label: '天阶下', color: 'text-purple-600' },
  { id: 'heaven-medium', value: 2.94, label: '天阶中', color: 'text-purple-500' },
  { id: 'heaven-superior', value: 4.55, label: '天阶上', color: 'text-purple-400' },
];

/**
 * 灵根选项（新体系：值越大越好）
 */
export const SPIRITUAL_ROOT_OPTIONS = [
  { value: 'waste' as const, label: '废灵根', sublabel: '五灵根', coefficient: 1.0, color: 'text-red-600' },
  { value: 'mixed' as const, label: '杂灵根', sublabel: '四灵根', coefficient: 1.11, color: 'text-orange-600' },
  { value: 'triple' as const, label: '三灵根', sublabel: '三灵根', coefficient: 1.25, color: 'text-yellow-600' },
  { value: 'dual' as const, label: '双灵根', sublabel: '双灵根', coefficient: 1.67, color: 'text-green-600' },
  { value: 'heavenly' as const, label: '天灵根', sublabel: '单灵根', coefficient: 3.33, color: 'text-purple-600' },
];
