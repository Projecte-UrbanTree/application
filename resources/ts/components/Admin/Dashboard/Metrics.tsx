import { useI18n } from '@/hooks/useI18n';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

const TYPES_WITH_TOTAL = ['user', 'element', 'work_order'] as const;

export function Metrics() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);

  const [metricsData, setMetricsData] = useState([
    {
      key: 'user',
      icon: 'tabler:users',
      count: 0,
      total: 0,
    },
    {
      key: 'contract',
      icon: 'tabler:notebook',
      count: 0,
    },
    {
      key: 'element',
      icon: 'tabler:box',
      count: 0,
      total: 0,
    },
    {
      key: 'work_order',
      icon: 'tabler:tool',
      count: 0,
      total: 0,
    },
  ]);

  useEffect(() => {
    api
      .get('/admin/statistics/metrics')
      .then(({ data }) => {
        setMetricsData((prev) =>
          prev.map((item) => ({
            ...item,
            count: data[item.key],
            total: TYPES_WITH_TOTAL.includes(
              item.key as (typeof TYPES_WITH_TOTAL)[number],
            )
              ? data[`${item.key}_all`]
              : undefined,
          })),
        );
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded p-6 flex flex-col items-center text-center border border-gray-300">
            <div className="bg-gray-200 w-16 h-16 rounded-full mb-4 animate-pulse"></div>
            <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
            <p className="mt-3 text-3xl font-semibold text-gray-700">0</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {metricsData.map((item) => (
        <div
          key={item.key}
          className="bg-white rounded p-6 flex flex-col items-center text-center border border-gray-300">
          <div className="text-gray-700 mb-4">
            <Icon icon={item.icon} width="48px" />
          </div>
          <h2 className="text-lg font-medium text-gray-700">
            {t('_capitalize', {
              val: t(`glossary:${item.key}_interval`, {
                postProcess: 'interval',
              }),
            })}
          </h2>
          <p className="mt-3 text-3xl font-semibold text-gray-700">
            {TYPES_WITH_TOTAL.includes(
              item.key as (typeof TYPES_WITH_TOTAL)[number],
            ) && item.total
              ? item.count === item.total
                ? item.count
                : `${item.count}/${item.total}`
              : item.count}
          </p>
        </div>
      ))}
    </div>
  );
}
