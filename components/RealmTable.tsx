'use client';

import type { SubLevelResult, RealmSummary } from '@/lib/types';
import { formatSpiritStones, formatDuration } from '@/lib/calculator/core';

// 图标组件 - 添加明确的尺寸约束
const CheckCircleIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

interface RealmTableProps {
  realms: RealmSummary[];
  subLevels: SubLevelResult[];
}

export function RealmTable({ realms, subLevels }: RealmTableProps) {
  if (subLevels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        暂无数据，请先配置参数
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              境界
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              单次消耗
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              修炼时长
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              累计时长
            </th>
            <th className="px-3 py-2.5 text-right font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              剩余寿命
            </th>
            <th className="px-3 py-2.5 text-center font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              状态
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {subLevels.map((row, index) => {
            const isFirstOfRealm =
              index === 0 ||
              subLevels[index - 1].realmName !== row.realmName;

            return (
              <tr
                key={index}
                className={`${
                  isFirstOfRealm ? 'border-t-2 border-gray-300 dark:border-gray-600' : ''
                } ${
                  row.isLifespanExceeded
                    ? 'bg-red-50/50 dark:bg-red-900/10'
                    : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                } transition-colors`}
              >
                <td className="px-3 py-2">
                  <div className="flex flex-col">
                    {isFirstOfRealm && (
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
                        {row.realmName}
                      </span>
                    )}
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      {row.subLevelName}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300 font-mono text-xs">
                  {formatSpiritStones(row.cost)}
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 text-xs">
                  {formatDuration(row.duration)}
                </td>
                <td className="px-3 py-2 text-right text-gray-900 dark:text-gray-100 font-medium text-xs">
                  {formatDuration(row.cumulativeDuration)}
                </td>
                <td className="px-3 py-2 text-right">
                  <span
                    className={`text-xs font-medium ${
                      row.lifespanRemaining < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {row.lifespanRemaining < 0
                      ? `超${Math.abs(Math.round(row.lifespanRemaining))}年`
                      : `${Math.round(row.lifespanRemaining)}年`}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  {row.isLifespanExceeded ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      <AlertCircleIcon />
                      寿命不足
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      <CheckCircleIcon />
                      正常
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 境界汇总表格（简化版）
 */
export function RealmSummaryTable({ realms }: { realms: RealmSummary[] }) {
  if (realms.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 px-1">
        境界汇总
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {realms.map((realm) => (
          <div
            key={realm.realmName}
            className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-sm transition-shadow"
          >
            <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">
              {realm.realmName}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">总消耗</span>
                <span className="text-gray-700 dark:text-gray-300 font-mono">
                  {formatSpiritStones(realm.totalCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">总时长</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {formatDuration(realm.totalDuration)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">小境界</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {realm.subLevels.length}个
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
