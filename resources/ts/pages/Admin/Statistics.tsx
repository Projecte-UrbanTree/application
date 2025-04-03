import axiosClient from '@/api/axiosClient';
import { differenceInMonths } from 'date-fns';
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'primereact/dropdown';

function formatDateSpanish(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

function parseIsoToSpanish(isoDate: string): string {
  if (!isoDate || typeof isoDate !== 'string') return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
}

function getThisWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return [formatDateSpanish(monday), formatDateSpanish(sunday)];
}

function getThisMonthRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return [formatDateSpanish(firstDay), formatDateSpanish(lastDay)];
}

function ShimmerCard() {
  return (
    <div className="p-6 border border-gray-300 rounded bg-white">
      <Skeleton width="75%" height="1rem" className="mb-4" />
      <Skeleton width="50%" height="1rem" className="mb-4" />
      <Skeleton width="100%" height="150px" />
    </div>
  );
}
interface Resource {
  id: number;
  name: string;
  unit_name: string;
}

interface ResourceUsageData {
  [resourceId: number]: {
    [date: string]: number;
  };
}

export default function Stats() {
  const { t } = useTranslation();
  const [rangeOption, setRangeOption] = useState<
    'this_week' | 'this_month' | 'custom'
  >('this_week');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [rawDays, setRawDays] = useState<string[]>([]);
  const [formattedDays, setFormattedDays] = useState<string[]>([]);
  const [tasksDoneCount, setTasksDoneCount] = useState<number[]>([]);
  const [tasksNotDoneCount, setTasksNotDoneCount] = useState<number[]>([]);
  const [hoursWorked, setHoursWorked] = useState<number[]>([]);
  const [fuelConsumption, setFuelConsumption] = useState<number[]>([]);
  const [summary, setSummary] = useState({
    tasks_done_total: 0,
    tasks_not_done_total: 0,
    hours_worked_total: 0,
    fuel_consumption_total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [customFromDate, setCustomFromDate] = useState<Date | null>(null);
  const [customToDate, setCustomToDate] = useState<Date | null>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceUsageData, setResourceUsageData] = useState<ResourceUsageData>(
    {},
  );
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(
    null,
  );
  const [selectedResourceChartData, setSelectedResourceChartData] = useState<
    number[]
  >([]);
  const [selectedResourceInfo, setSelectedResourceInfo] =
    useState<Resource | null>(null);

  const rangeOptions = [
    { label: t('admin.pages.stats.week'), value: 'this_week' },
    { label: t('admin.pages.stats.month'), value: 'this_month' },
    { label: t('admin.pages.stats.custom'), value: 'custom' },
  ];

  useEffect(() => {
    const [start, end] = getThisWeekRange();
    setFromDate(start);
    setToDate(end);
  }, []);

  useEffect(() => {
    if (rangeOption === 'this_week') {
      const [start, end] = getThisWeekRange();
      if (fromDate !== start || toDate !== end) {
        setFromDate(start);
        setToDate(end);
      }
      setCustomFromDate(null);
      setCustomToDate(null);
    } else if (rangeOption === 'this_month') {
      const [start, end] = getThisMonthRange();
      if (fromDate !== start || toDate !== end) {
        setFromDate(start);
        setToDate(end);
      }
      setCustomFromDate(null);
      setCustomToDate(null);
    } else if (rangeOption === 'custom') {
      if (customFromDate && customToDate) {
        const newFrom = formatDateSpanish(customFromDate);
        const newTo = formatDateSpanish(customToDate);
        if (fromDate !== newFrom || toDate !== newTo) {
          setFromDate(newFrom);
          setToDate(newTo);
        }
      } else {
        if (fromDate !== '' || toDate !== '') {
          setFromDate('');
          setToDate('');
        }
      }
    }
  }, [rangeOption]);

  useEffect(() => {
    if (rangeOption === 'custom' && customFromDate && customToDate) {
      if (customFromDate > customToDate) {
        return;
      }

      const totalMonths = differenceInMonths(customToDate, customFromDate);
      let adjustedToDate = customToDate;
      if (totalMonths > 12) {
        const maxEndDate = new Date(customFromDate);
        maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
        adjustedToDate = maxEndDate < customToDate ? maxEndDate : customToDate;
        if (customToDate.getTime() !== adjustedToDate.getTime()) {
          setCustomToDate(adjustedToDate);
        }
      }

      const newFromDate = formatDateSpanish(customFromDate);
      const newToDate = formatDateSpanish(adjustedToDate);
      if (fromDate !== newFromDate || toDate !== newToDate) {
        setFromDate(newFromDate);
        setToDate(newToDate);
      }
    } else if (rangeOption === 'custom' && (!customFromDate || !customToDate)) {
      if (fromDate !== '' || toDate !== '') {
        setFromDate('');
        setToDate('');
      }
    }
  }, [customFromDate, customToDate, rangeOption]);

  useEffect(() => {
    if (fromDate && toDate) {
      if (
        rangeOption === 'custom' &&
        customFromDate &&
        customToDate &&
        customFromDate > customToDate
      ) {
        return;
      }
      fetchData();
    }
  }, [fromDate, toDate]);

  const fetchData = async () => {
    if (!fromDate || !toDate) return;
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/admin/statistics', {
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
      });
      const daysRaw = res.data.days || [];
      setRawDays(daysRaw);
      setFormattedDays(daysRaw.map(parseIsoToSpanish));

      setTasksDoneCount(res.data.tasksDoneCount || []);
      setTasksNotDoneCount(res.data.tasksNotDoneCount || []);
      setHoursWorked(res.data.hoursWorked || []);
      setFuelConsumption(res.data.fuelConsumption || []);
      setSummary(
        res.data.summary || {
          tasks_done_total: 0,
          tasks_not_done_total: 0,
          hours_worked_total: 0,
          fuel_consumption_total: 0,
        },
      );

      const fetchedResources: Resource[] = res.data.resourcesList || [];
      setResources(fetchedResources);
      setResourceUsageData(res.data.resourceUsageData || {});

      if (selectedResourceId === null && fetchedResources.length > 0) {
        setSelectedResourceId(fetchedResources[0].id);
      } else if (!fetchedResources.some((r) => r.id === selectedResourceId)) {
        setSelectedResourceId(
          fetchedResources.length > 0 ? fetchedResources[0].id : null,
        );
      } else if (fetchedResources.length === 0) {
        setSelectedResourceId(null);
        setSelectedResourceInfo(null);
        setSelectedResourceChartData([]);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setRawDays([]);
      setFormattedDays([]);
      setTasksDoneCount([]);
      setTasksNotDoneCount([]);
      setHoursWorked([]);
      setFuelConsumption([]);
      setResources([]);
      setResourceUsageData({});
      setSelectedResourceId(null);
      setSelectedResourceInfo(null);
      setSelectedResourceChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      selectedResourceId !== null &&
      resources.length > 0 &&
      rawDays.length > 0
    ) {
      const currentResource = resources.find(
        (r) => r.id === selectedResourceId,
      );
      setSelectedResourceInfo(currentResource || null);

      if (currentResource) {
        const usageForSelectedResource =
          resourceUsageData[selectedResourceId] || {};
        const chartDataPoints = rawDays.map(
          (day) => usageForSelectedResource[day] || 0,
        );
        setSelectedResourceChartData(chartDataPoints);
      } else {
        setSelectedResourceChartData([]);
        setSelectedResourceInfo(null);
      }
    } else {
      setSelectedResourceChartData([]);
      setSelectedResourceInfo(null);
    }
  }, [selectedResourceId, resources, resourceUsageData, rawDays]);

  const exportToCSV = (data: number[], labels: string[], filename: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Date,Value',
        ...data.map((value, index) => `${labels[index] || ''},${value}`),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bentoItems = [
    {
      key: 'tasksDone',
      label: t('admin.pages.stats.tasksDone'),
      total: summary.tasks_done_total,
      data: tasksDoneCount,
      backgroundColor: 'rgba(52, 211, 153, 0.6)',
      borderColor: 'rgb(16, 185, 129)',
    },
    {
      key: 'tasksNotDone',
      label: t('admin.pages.stats.tasksNotDone'),
      total: summary.tasks_not_done_total,
      data: tasksNotDoneCount,
      backgroundColor: 'rgba(248, 113, 113, 0.6)',
      borderColor: 'rgb(239, 68, 68)',
    },
    {
      key: 'hoursWorked',
      label: t('admin.pages.stats.hoursWorked'),
      total: summary.hours_worked_total,
      data: hoursWorked,
      backgroundColor: 'rgba(96, 165, 250, 0.6)',
      borderColor: 'rgb(59, 130, 246)',
    },
    {
      key: 'fuelConsumption',
      label: t('admin.pages.stats.fuelConsumption'),
      total: summary.fuel_consumption_total,
      data: fuelConsumption,
      backgroundColor: 'rgba(251, 191, 36, 0.6)',
      borderColor: 'rgb(245, 158, 11)',
    },
  ];

  const smallChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => tooltipItems[0]?.label || '',
        },
      },
    },
    barThickness: 'flex' as const,
    maxBarThickness: 50,
  };

  const resourceChartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text:
            selectedResourceInfo?.unit_name || t('admin.pages.stats.quantity'),
        },
        ticks: {
          precision: selectedResourceInfo?.unit_name === 'Hores' ? 2 : 0,
        },
      },
      x: { ticks: { autoSkip: true, maxTicksLimit: 15 } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => tooltipItems[0]?.label || '',
          label: (tooltipItem: any) => {
            let label = tooltipItem.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (tooltipItem.parsed.y !== null) {
              label += tooltipItem.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits:
                  selectedResourceInfo?.unit_name === 'Hores' ? 2 : 0,
                maximumFractionDigits:
                  selectedResourceInfo?.unit_name === 'Hores' ? 2 : 0,
              });
              if (selectedResourceInfo?.unit_name) {
                label += ` ${selectedResourceInfo.unit_name}`;
              }
            }
            return label;
          },
        },
      },
    },
    barThickness: 'flex' as const,
    maxBarThickness: 80,
  };

  const resourceDropdownOptions = resources.map((res) => ({
    label: res.name,
    value: res.id,
  }));

  const maxDate = customFromDate
    ? new Date(
        customFromDate.getFullYear() + 1,
        customFromDate.getMonth(),
        customFromDate.getDate(),
      )
    : new Date();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div
        className="flex flex-wrap items-end gap-4 p-4 bg-white rounded border border-gray-200 shadow-sm min-h-32">
        <div>
          <SelectButton
            value={rangeOption}
            options={rangeOptions}
            onChange={(e) => {
              if (e.value !== null && e.value !== undefined)
                setRangeOption(e.value);
            }}
            itemTemplate={(option) => t(option.label)}
            className="p-button-outlined"
          />
        </div>

        {rangeOption === 'custom' && (
          <>
            <div className="flex flex-col">
              <label
                htmlFor="customFromDateCal"
                className="mb-1 text-sm font-medium text-gray-700">
                {t('admin.pages.stats.startDate')}
              </label>
              <Calendar
                inputId="customFromDateCal"
                value={customFromDate}
                onChange={(e) =>
                  setCustomFromDate(e.value instanceof Date ? e.value : null)
                }
                maxDate={new Date()}
                showIcon
                dateFormat="dd/mm/yy"
                className="p-inputtext-sm"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="customToDateCal"
                className="mb-1 text-sm font-medium text-gray-700">
                {t('admin.pages.stats.endDate')}
              </label>
              <Calendar
                inputId="customToDateCal"
                value={customToDate}
                onChange={(e) =>
                  setCustomToDate(e.value instanceof Date ? e.value : null)
                }
                minDate={customFromDate || undefined}
                maxDate={new Date()}
                showIcon
                dateFormat="dd/mm/yy"
                className="p-inputtext-sm"
                disabled={!customFromDate}
              />
            </div>
          </>
        )}
        {fromDate && toDate && (
          <div className="text-sm text-gray-600 ml-auto self-center pb-2">
            {fromDate} - {toDate}
          </div>
        )}
      </div>

      {isLoading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bentoItems.map((item) => (
              <ShimmerCard key={item.key} />
            ))}
          </div>
          <div className="mt-6">
            <Skeleton width="25%" height="2.5rem" className="mb-4" />
            <div className="p-6 border border-gray-300 rounded bg-white">
              <Skeleton width="30%" height="1.5rem" className="mb-4" />
              <Skeleton width="100%" height="350px" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bentoItems.map((item) => {
              const chartData = {
                labels: formattedDays,
                datasets: [
                  {
                    label: item.label,
                    data: item.data,
                    backgroundColor: item.backgroundColor,
                    borderColor: item.borderColor,
                    borderWidth: 1,
                  },
                ],
              };
              const hasData =
                Array.isArray(item.data) &&
                item.data.length > 0 &&
                item.data.some((d) => d > 0);
              const hasLabels =
                Array.isArray(formattedDays) && formattedDays.length > 0;

              return (
                <div key={item.key} className="flex flex-col">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <div className="text-sm font-bold uppercase text-gray-600">
                      {item.label}
                    </div>
                    <Button
                      label={t('admin.pages.stats.exportCSV')}
                      icon="pi pi-download"
                      className="p-button-sm p-button-outlined text-blue-600 hover:bg-blue-50"
                      onClick={() =>
                        exportToCSV(item.data, formattedDays, item.label)
                      }
                      disabled={!hasData || !hasLabels}
                    />
                  </div>

                  <div
                    className="bg-white rounded p-4 border border-gray-300 flex-grow"
                    style={{ height: '280px' }}>
                    <div className="text-right text-xl font-semibold mb-3">
                      {item.total.toLocaleString()}
                    </div>

                    {!hasData || !hasLabels ? (
                      <div
                        className="flex justify-center items-center h-full text-gray-500"
                        style={{ height: 'calc(100% - 40px)' }}>
                        {t('admin.pages.stats.noData')}
                      </div>
                    ) : (
                      <div style={{ height: 'calc(100% - 40px)' }}>
                        <Chart
                          type="bar"
                          data={chartData}
                          options={smallChartOptions}
                          style={{ height: '100%', width: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center gap-4">
              <label htmlFor="resourceDropdown" className="font-semibold">
                {t('admin.pages.stats.selectResource')}:
              </label>
              <Dropdown
                inputId="resourceDropdown"
                value={selectedResourceId}
                options={resourceDropdownOptions}
                onChange={(e) => setSelectedResourceId(e.value)}
                placeholder={t('admin.pages.stats.selectResourcePlaceholder')}
                disabled={resources.length === 0 || isLoading}
                className="w-full md:w-auto min-w-[250px]"
                filter
                showClear={selectedResourceId !== null}
                filterPlaceholder={t(
                  'admin.pages.stats.selectResourcePlaceholder',
                )}
              />
            </div>

            <div
              className="bg-white rounded p-6 border border-gray-300"
              style={{ height: '450px' }}>
              {selectedResourceId !== null && selectedResourceInfo ? (
                <>
                  <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <div className="text-lg font-bold uppercase">
                      {selectedResourceInfo.name}{' '}
                      {selectedResourceInfo.unit_name
                        ? `(${selectedResourceInfo.unit_name})`
                        : ''}
                    </div>
                    <div className="text-xl">
                      {t('admin.pages.stats.total')}:{' '}
                      {selectedResourceChartData
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString(undefined, {
                          minimumFractionDigits:
                            selectedResourceInfo?.unit_name === 'Hores' ? 2 : 0,
                          maximumFractionDigits:
                            selectedResourceInfo?.unit_name === 'Hores' ? 2 : 0,
                        })}{' '}
                      {selectedResourceInfo.unit_name}
                    </div>
                    <Button
                      label={t('admin.pages.stats.exportCSV')}
                      icon="pi pi-download"
                      className="p-button-sm p-button-outlined text-blue-600 hover:bg-blue-50"
                      onClick={() =>
                        exportToCSV(
                          selectedResourceChartData,
                          formattedDays,
                          `${selectedResourceInfo.name}_usage`,
                        )
                      }
                      disabled={
                        selectedResourceChartData.length === 0 ||
                        selectedResourceChartData.every((d) => d === 0) ||
                        formattedDays.length === 0
                      }
                    />
                  </div>
                  {formattedDays.length === 0 ||
                  selectedResourceChartData.length === 0 ||
                  selectedResourceChartData.every((d) => d === 0) ? (
                    <div
                      className="flex justify-center items-center h-full text-gray-500"
                      style={{ height: 'calc(100% - 60px)' }}>
                      {t('admin.pages.stats.noDataResourcePeriod')}
                    </div>
                  ) : (
                    <div style={{ height: 'calc(100% - 60px)' }}>
                      <Chart
                        type="bar"
                        data={{
                          labels: formattedDays,
                          datasets: [
                            {
                              label: `${selectedResourceInfo.name} (${selectedResourceInfo.unit_name || t('admin.pages.stats.quantity')})`,
                              data: selectedResourceChartData,
                              backgroundColor: 'rgba(168, 85, 247, 0.6)',
                              borderColor: 'rgb(147, 51, 234)',
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={resourceChartOptions}
                        style={{ height: '100%', width: '100%' }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                  {resources.length > 0
                    ? t('admin.pages.stats.selectResourcePrompt')
                    : t('admin.pages.stats.noResourcesAvailable')}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
