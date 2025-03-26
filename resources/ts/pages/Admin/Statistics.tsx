import axiosClient from '@/api/axiosClient';
import { differenceInMonths, parseISO } from 'date-fns';
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function formatDateSpanish(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

function parseIsoToSpanish(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
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

export default function Stats() {
  const { t } = useTranslation();
  const [rangeOption, setRangeOption] = useState<
    'this_week' | 'this_month' | 'custom'
  >('this_week');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState<string[]>([]);
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
  const [customFromIso, setCustomFromIso] = useState('');
  const [customToIso, setCustomToIso] = useState('');
  const [customFromDate, setCustomFromDate] = useState<Date | null>(null);
  const [customToDate, setCustomToDate] = useState<Date | null>(null);

  const rangeOptions = [
    { label: t('admin.pages.stats.week'), value: 'this_week' },
    { label: t('admin.pages.stats.month'), value: 'this_month' },
    { label: t('admin.pages.stats.custom'), value: 'custom' },
  ];

  useEffect(() => {
    if (rangeOption === 'this_week') {
      const [start, end] = getThisWeekRange();
      setFromDate(start);
      setToDate(end);
    } else if (rangeOption === 'this_month') {
      const [start, end] = getThisMonthRange();
      setFromDate(start);
      setToDate(end);
    } else {
      setFromDate('');
      setToDate('');
    }
  }, [rangeOption]);

  useEffect(() => {
    const [start, end] = getThisWeekRange();
    setFromDate(start);
    setToDate(end);
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    if (rangeOption === 'custom' && customFromDate && customToDate) {
      const fromIso = customFromDate.toISOString().split('T')[0];
      const toIso = customToDate.toISOString().split('T')[0];

      setCustomFromIso(fromIso);
      setCustomToIso(toIso);
      setFromDate(parseIsoToSpanish(fromIso));
      setToDate(parseIsoToSpanish(toIso));

      const totalMonths = differenceInMonths(customToDate, customFromDate);
      if (totalMonths > 12) {
        const maxEndDate = new Date(customFromDate);
        maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
        setCustomToDate(maxEndDate);
      }
    }
  }, [customFromDate, customToDate, rangeOption]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/admin/statistics', {
        params: { from_date: fromDate, to_date: toDate },
      });
      const daysRaw = res.data.days || [];
      const daysFormatted = daysRaw.map(parseIsoToSpanish);
      setDays(daysFormatted);
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const exportToCSV = (data: number[], labels: string[], filename: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Date,Value',
        ...data.map((value, index) => `${labels[index]},${value}`),
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
      backgroundColor: 'rgba(52,211,153,0.6)',
      borderColor: '#34D399',
    },
    {
      key: 'tasksNotDone',
      label: t('admin.pages.stats.tasksNotDone'),
      total: summary.tasks_not_done_total,
      data: tasksNotDoneCount,
      backgroundColor: 'rgba(248,113,113,0.6)',
      borderColor: '#F87171',
    },
    {
      key: 'hoursWorked',
      label: t('admin.pages.stats.hoursWorked'),
      total: summary.hours_worked_total,
      data: hoursWorked,
      backgroundColor: 'rgba(96,165,250,0.6)',
      borderColor: '#60A5FA',
    },
    {
      key: 'fuelConsumption',
      label: t('admin.pages.stats.fuelConsumption'),
      total: summary.fuel_consumption_total,
      data: fuelConsumption,
      backgroundColor: 'rgba(251,191,36,0.6)',
      borderColor: '#FBBF24',
    },
  ];

  const maxDate = customFromDate
    ? new Date(
        customFromDate.getFullYear() + 1,
        customFromDate.getMonth(),
        customFromDate.getDate(),
      )
    : new Date();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <SelectButton
            value={rangeOption}
            options={rangeOptions}
            onChange={(e) => setRangeOption(e.value)}
          />
        </div>

        {rangeOption === 'custom' && (
          <>
            <div className="flex flex-col">
              <label className="mb-2">{t('admin.pages.stats.startDate')}</label>
              <Calendar
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.value as Date)}
                maxDate={new Date()}
                showIcon
                dateFormat="dd/mm/yy"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">{t('admin.pages.stats.endDate')}</label>
              <Calendar
                value={customToDate}
                onChange={(e) => setCustomToDate(e.value as Date)}
                minDate={customFromDate || undefined}
                maxDate={maxDate}
                showIcon
                dateFormat="dd/mm/yy"
                disabled={!customFromDate}
              />
            </div>
          </>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bentoItems.map((item) => (
            <ShimmerCard key={item.key} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bentoItems.map((item) => {
            const chartData = {
              labels: days,
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
            const options = {
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true },
              },
              plugins: {
                legend: {
                  display: false,
                  onClick: () => {},
                },
              },
              barThickness: 'flex',
              maxBarThickness: 60,
            };
            return (
              <div key={item.key}>
                <div className="flex justify-end mb-2">
                  <Button
                    label={t('admin.pages.stats.exportCSV')}
                    icon="pi pi-file"
                    className="p-button-sm p-button-text p-button-plain"
                    style={{ color: 'blue' }}
                    onClick={() => exportToCSV(item.data, days, item.label)}
                  />
                </div>
                <div
                  className="bg-white rounded p-6 border border-gray-300"
                  style={{ height: '300px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-bold uppercase">
                      {item.label}
                    </div>
                    <div className="text-xl">{item.total}</div>
                  </div>
                  {item.data.length === 0 ? (
                    <div className="text-center text-gray-500">
                      {t('admin.pages.stats.noData')}
                    </div>
                  ) : (
                    <Chart
                      type="bar"
                      data={chartData}
                      options={options}
                      style={{ height: '88%' }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
