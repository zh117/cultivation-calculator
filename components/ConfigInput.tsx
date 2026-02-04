'use client';

import { useState, useEffect } from 'react';

interface ConfigInputProps {
  label: string;
  value: number | undefined;
  defaultValue: number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | undefined) => void;
  className?: string;
}

/**
 * 系数配置输入框组件
 * - 紧凑型设计，嵌入标题旁
 * - 支持 0.1-999 范围输入
 * - 选中时显示当前值
 */
export function ConfigInput({
  label,
  value,
  defaultValue,
  placeholder = '自定义',
  min = 0.1,
  max = 999,
  step = 0.01,
  onChange,
  className = '',
}: ConfigInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  // 同步外部值变化
  useEffect(() => {
    if (value !== undefined && value !== defaultValue) {
      setIsCustom(true);
      setInputValue(value.toString());
    } else {
      setIsCustom(false);
      setInputValue('');
    }
  }, [value, defaultValue]);

  const handleFocus = () => {
    setIsFocused(true);
    if (!inputValue && value !== undefined) {
      setInputValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 如果输入为空，清除覆盖值
    if (!inputValue.trim()) {
      setIsCustom(false);
      setInputValue('');
      onChange?.(undefined);
      return;
    }

    // 验证并修正输入值
    const numValue = parseFloat(inputValue);
    let clampedValue = numValue;

    if (isNaN(numValue)) {
      // 无效输入，清除覆盖值
      setIsCustom(false);
      setInputValue('');
      onChange?.(undefined);
      return;
    } else if (numValue < min) {
      clampedValue = min;
    } else if (numValue > max) {
      clampedValue = max;
    }

    // 如果修正后的值与默认值相同，清除覆盖值
    if (Math.abs(clampedValue - defaultValue) < 0.001) {
      setIsCustom(false);
      setInputValue('');
      onChange?.(undefined);
    } else {
      setIsCustom(true);
      setInputValue(clampedValue.toString());
      onChange?.(clampedValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setIsCustom(false);
      setInputValue('');
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setIsCustom(false);
    setInputValue('');
    onChange?.(undefined);
  };

  // 显示当前值的格式化字符串
  const formatValue = (val: number): string => {
    if (val >= 100) return val.toFixed(0);
    if (val >= 10) return val.toFixed(1);
    return val.toFixed(2);
  };

  // 显示当前值的格式化字符串
  const displayValue = isCustom || isFocused
    ? inputValue
    : (value !== undefined ? formatValue(value) : '');

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        <input
          type="number"
          value={displayValue}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`
            w-16 px-1.5 py-0.5 text-xs text-center
            border rounded transition-all
            ${isCustom
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
            ${isFocused ? 'ring-1 ring-blue-500' : ''}
            focus:outline-none
          `}
        />
        {isCustom && !isFocused && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute -right-1 -top-1 w-3 h-3 flex items-center justify-center
              bg-red-500 hover:bg-red-600 text-white rounded-full text-[8px]
              transition-colors"
            title="清除自定义"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
