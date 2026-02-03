'use client';

import type { Alert } from '@/lib/types';

interface AlertListProps {
  alerts: Alert[];
}

// SVG 图标组件 - 添加明确的尺寸约束
const CheckShieldIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CriticalIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const severityConfig = {
  notice: {
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800/50',
    textColor: 'text-blue-900 dark:text-blue-100',
    icon: <InfoIcon />,
    label: '提示',
  },
  warning: {
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
    textColor: 'text-amber-900 dark:text-amber-100',
    icon: <WarningIcon />,
    label: '资源缺口',
  },
  error: {
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800/50',
    textColor: 'text-red-900 dark:text-red-100',
    icon: <ErrorIcon />,
    label: '双重困境',
  },
  critical: {
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700/50',
    textColor: 'text-red-900 dark:text-red-100',
    icon: <CriticalIcon />,
    label: '设定崩塌',
  },
};

export function AlertList({ alerts }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl flex items-center gap-3">
        <div className="text-green-600 dark:text-green-400">
          <CheckShieldIcon />
        </div>
        <span className="font-medium text-green-900 dark:text-green-100">
          数值体系自洽，未检测到崩坏风险
        </span>
      </div>
    );
  }

  // 按严重程度和类型分组
  const groupedAlerts = {
    critical: alerts.filter(a => a.severity === 'critical'),
    error: alerts.filter(a => a.severity === 'error'),
    warning: alerts.filter(a => a.severity === 'warning'),
    notice: alerts.filter(a => a.severity === 'notice'),
  };

  return (
    <div className="space-y-3">
      {groupedAlerts.critical.length > 0 && (
        <AlertGroup
          alerts={groupedAlerts.critical}
          config={severityConfig.critical}
        />
      )}
      {groupedAlerts.error.length > 0 && (
        <AlertGroup alerts={groupedAlerts.error} config={severityConfig.error} />
      )}
      {groupedAlerts.warning.length > 0 && (
        <AlertGroup
          alerts={groupedAlerts.warning}
          config={severityConfig.warning}
        />
      )}
      {groupedAlerts.notice.length > 0 && (
        <AlertGroup alerts={groupedAlerts.notice} config={severityConfig.notice} />
      )}
    </div>
  );
}

interface AlertGroupProps {
  alerts: Alert[];
  config: (typeof severityConfig)[keyof typeof severityConfig];
}

function AlertGroup({ alerts, config }: AlertGroupProps) {
  return (
    <div className={`p-4 ${config.bgColor} border ${config.borderColor} rounded-xl`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={config.textColor}>
          {config.icon}
        </span>
        <span className={`font-semibold ${config.textColor}`}>
          {config.label} ({alerts.length}项)
        </span>
      </div>
      <ul className="space-y-2">
        {alerts.map((alert, index) => (
          <li key={index} className={`text-sm ${config.textColor} flex items-start gap-2`}>
            <span className="mt-0.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
            <span>{alert.message}</span>
            {alert.isTheoreticalBreakdown === false && (
              <span className="text-xs opacity-70">(可通过剧情解决)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
