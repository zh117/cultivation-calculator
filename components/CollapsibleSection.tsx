'use client';

import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string | number;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
          {title}
        </span>
        <div className="flex items-center gap-3">
          {badge !== undefined && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              typeof badge === 'number' && badge > 0
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {badge}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}
