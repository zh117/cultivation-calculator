'use client';

import { useState, useEffect } from 'react';
import type { SavedScheme, CalculationParams, ResourceConfig } from '@/lib/types';
import { getAllSchemes, saveScheme, deleteScheme } from '@/lib/storage/schemes';

interface SchemeManagerProps {
  currentParams: CalculationParams;
  currentResource: ResourceConfig;
  onLoadScheme: (scheme: SavedScheme) => void;
  menuItemMode?: boolean;
  onCloseMenu?: () => void;
}

// SVG 图标组件 - 添加明确的尺寸约束
const SaveIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function SchemeManager({
  currentParams,
  currentResource,
  onLoadScheme,
  menuItemMode = false,
  onCloseMenu,
}: SchemeManagerProps) {
  const [schemes, setSchemes] = useState<SavedScheme[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [schemeName, setSchemeName] = useState('');
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  // 加载方案列表
  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = () => {
    setSchemes(getAllSchemes());
  };

  const handleSave = () => {
    if (!schemeName.trim()) return;

    saveScheme(schemeName.trim(), currentParams, currentResource);
    setSchemeName('');
    setShowSaveDialog(false);
    loadSchemes();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除方案"${name}"吗？`)) {
      deleteScheme(id);
      loadSchemes();
    }
  };

  return (
    <>
      {menuItemMode ? (
        // 菜单项模式 - 用于下拉菜单内
        <>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 cursor-pointer"
          >
            <SaveIcon />
            保存当前方案
          </button>
          <button
            onClick={() => {
              loadSchemes();
              setShowLoadDialog(true);
            }}
            className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 cursor-pointer"
          >
            <FolderIcon />
            加载已保存方案
            {schemes.length > 0 && (
              <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                {schemes.length}
              </span>
            )}
          </button>
        </>
      ) : (
        // 默认模式 - 按钮组
        <div className="flex gap-2">
          {/* 保存按钮 */}
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="保存当前配置为方案"
          >
            <SaveIcon />
            <span className="hidden sm:inline">保存</span>
          </button>

          {/* 加载按钮 */}
          <button
            onClick={() => {
              loadSchemes();
              setShowLoadDialog(!showLoadDialog);
            }}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 relative cursor-pointer"
            title="加载已保存的方案"
          >
            <FolderIcon />
            <span className="hidden sm:inline">加载</span>
            {schemes.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                {schemes.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* 保存对话框 */}
      {showSaveDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowSaveDialog(false);
            setSchemeName('');
          }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-5 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              保存当前方案
            </h3>
            <input
              type="text"
              value={schemeName}
              onChange={(e) => setSchemeName(e.target.value)}
              placeholder="输入方案名称..."
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setShowSaveDialog(false);
                  setSchemeName('');
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSchemeName('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!schemeName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 加载对话框 */}
      {showLoadDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLoadDialog(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                已保存的方案
              </h3>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <XIcon />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {schemes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FolderIcon />
                  <p className="mt-2 text-sm">暂无保存的方案</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {schemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="group flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        onLoadScheme(scheme);
                        setShowLoadDialog(false);
                        onCloseMenu?.();
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                          {scheme.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(scheme.createdAt).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(scheme.id, scheme.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                        title="删除方案"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
