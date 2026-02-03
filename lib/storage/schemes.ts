// ============================================================================
// 方案存储管理（基于 localStorage）
// ============================================================================

import type { SavedScheme, CalculationParams, ResourceConfig, CalculationResult } from '@/lib/types';

const STORAGE_KEY = 'cultivation-calculator-schemes';

/**
 * 获取所有保存的方案
 */
export function getAllSchemes(): SavedScheme[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const schemes = JSON.parse(data) as SavedScheme[];
    // 兼容旧数据
    return schemes.map(scheme => {
      const params = { ...scheme.params };
      // 为缺失的 baseAbsorptionRate 添加默认值
      if (params.baseAbsorptionRate === undefined) {
        params.baseAbsorptionRate = 12;
      }
      // 兼容旧功法品质值（>1的值映射到新体系）
      if (params.techniqueQuality > 1) {
        // 旧值映射：1.0→0.97, 1.5→0.85, 2.0→0.72, 3.0→0.64, 5.0→0.45, 10.0→0.22
        const oldMapping: Record<number, number> = {
          10.0: 0.22,  // 天阶上
          5.0: 0.45,   // 地阶上
          3.0: 0.64,   // 地阶中
          2.0: 0.72,   // 地阶下
          1.5: 0.85,   // 玄阶中
          1.2: 0.90,   // 玄阶下
          1.0: 0.97,   // 黄阶中
          0.8: 0.99,   // 黄阶下
        };
        params.techniqueQuality = oldMapping[params.techniqueQuality] ?? 0.97;
      }
      return { ...scheme, params };
    });
  } catch {
    return [];
  }
}

/**
 * 保存新方案
 */
export function saveScheme(
  name: string,
  params: CalculationParams,
  resource: ResourceConfig,
  result?: CalculationResult
): SavedScheme {
  const schemes = getAllSchemes();

  const newScheme: SavedScheme = {
    id: `scheme-${Date.now()}`,
    name,
    createdAt: Date.now(),
    params,
    resource,
    result,
  };

  schemes.push(newScheme);
  setSchemes(schemes);

  return newScheme;
}

/**
 * 更新现有方案
 */
export function updateScheme(id: string, updates: Partial<SavedScheme>): boolean {
  const schemes = getAllSchemes();
  const index = schemes.findIndex(s => s.id === id);

  if (index === -1) return false;

  schemes[index] = { ...schemes[index], ...updates };
  setSchemes(schemes);

  return true;
}

/**
 * 删除方案
 */
export function deleteScheme(id: string): boolean {
  const schemes = getAllSchemes();
  const filtered = schemes.filter(s => s.id !== id);

  if (filtered.length === schemes.length) return false;

  setSchemes(filtered);
  return true;
}

/**
 * 获取单个方案
 */
export function getScheme(id: string): SavedScheme | undefined {
  const schemes = getAllSchemes();
  return schemes.find(s => s.id === id);
}

/**
 * 清空所有方案
 */
export function clearAllSchemes(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 内部方法：设置方案列表
 */
function setSchemes(schemes: SavedScheme[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemes));
}

/**
 * 导出方案配置（不包含计算结果）
 */
export function exportScheme(scheme: SavedScheme): string {
  const exportData = {
    name: scheme.name,
    params: scheme.params,
    resource: scheme.resource,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * 导入方案配置
 */
export function importScheme(jsonString: string): {
  success: boolean;
  scheme?: SavedScheme;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);

    if (!data.params || !data.resource) {
      return { success: false, error: '无效的方案格式' };
    }

    // 兼容旧数据
    const params = { ...data.params };
    if (params.baseAbsorptionRate === undefined) {
      params.baseAbsorptionRate = 12;
    }
    // 兼容旧功法品质值
    if (params.techniqueQuality > 1) {
      const oldMapping: Record<number, number> = {
        10.0: 0.22,
        5.0: 0.45,
        3.0: 0.64,
        2.0: 0.72,
        1.5: 0.85,
        1.2: 0.90,
        1.0: 0.97,
        0.8: 0.99,
      };
      params.techniqueQuality = oldMapping[params.techniqueQuality] ?? 0.97;
    }

    const scheme: SavedScheme = {
      id: `imported-${Date.now()}`,
      name: data.name || '导入的方案',
      createdAt: Date.now(),
      params,
      resource: data.resource,
    };

    return { success: true, scheme };
  } catch (e) {
    return { success: false, error: '解析失败：' + (e as Error).message };
  }
}
