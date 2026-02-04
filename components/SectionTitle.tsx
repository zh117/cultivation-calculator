'use client';

import { formatCoefficient } from '@/lib/calculator/core';

interface SectionTitleProps {
  title: string;
  description?: string;
  resultValue?: number;
  resultPrefix?: string;
  resultSuffix?: string;
  color?: 'indigo' | 'emerald' | 'blue' | 'purple';
  children?: React.ReactNode;
}

/**
 * 区域标题组件
 * - 增大字号，醒目背景装饰
 * - 支持显示最终计算结果
 * - 可在标题后嵌入额外内容（如输入框）
 */
export function SectionTitle({
  title,
  description,
  resultValue,
  resultPrefix = '×',
  resultSuffix = '',
  color = 'indigo',
  children,
}: SectionTitleProps) {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-700',
      text: 'text-indigo-700 dark:text-indigo-300',
      result: 'text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-700',
      text: 'text-emerald-700 dark:text-emerald-300',
      result: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-700 dark:text-blue-300',
      result: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      text: 'text-purple-700 dark:text-purple-300',
      result: 'text-purple-600 dark:text-purple-400',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="space-y-2">
      {/* 主标题栏 */}
      <div className={`
        flex items-center justify-between px-3 py-2 rounded-lg border
        ${colors.bg} ${colors.border}
      `}>
        <div className="flex items-center gap-2">
          {/* 装饰图标 */}
          <span className={`w-1 h-4 rounded ${colors.text.replace('text', 'bg').replace('700', '500').replace('300', '400')}`} />
          <h3 className={`text-sm font-bold uppercase tracking-wide ${colors.text}`}>
            {title}
          </h3>
        </div>

        {/* 结果显示或自定义内容 */}
        <div className="flex items-center gap-3">
          {children}
          {resultValue !== undefined && (
            <span className={`text-sm font-mono font-bold ${colors.result}`}>
              {resultPrefix}{formatCoefficient(resultValue)}{resultSuffix}
            </span>
          )}
        </div>
      </div>

      {/* 描述文字 */}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">
          {description}
        </p>
      )}
    </div>
  );
}
