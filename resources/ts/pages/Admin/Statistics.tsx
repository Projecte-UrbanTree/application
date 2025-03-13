import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axiosClient from '@/api/axiosClient';
import { Skeleton } from 'primereact/skeleton';
import { differenceInMonths, parseISO } from 'date-fns';
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
        if (rangeOption === 'custom' && customFromIso && customToIso) {
            const startDate = parseISO(customFromIso);
            const endDate = parseISO(customToIso);
            const totalMonths = differenceInMonths(endDate, startDate);
            if (totalMonths > 12) {
                const maxEndDate = new Date(startDate);
                maxEndDate.setFullYear(maxEndDate.getFullYear() + 1);
                const adjustedToIso = maxEndDate.toISOString().split('T')[0];
                setCustomToIso(adjustedToIso);
                setToDate(parseIsoToSpanish(adjustedToIso));
            }
        }
    }, [customFromIso, customToIso, rangeOption]);

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

    const maxAllowedToDate = customFromIso
        ? new Date(
              new Date(customFromIso).setFullYear(
                  new Date(customFromIso).getFullYear() + 1,
              ),
          )
              .toISOString()
              .split('T')[0]
        : new Date().toISOString().split('T')[0];

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        id="this_week"
                        name="rangeOption"
                        value="this_week"
                        checked={rangeOption === 'this_week'}
                        onChange={() => setRangeOption('this_week')}
                    />
                    <label htmlFor="this_week" className="cursor-pointer">
                        {t('admin.pages.stats.week')}
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        id="this_month"
                        name="rangeOption"
                        value="this_month"
                        checked={rangeOption === 'this_month'}
                        onChange={() => setRangeOption('this_month')}
                    />
                    <label htmlFor="this_month" className="cursor-pointer">
                        {t('admin.pages.stats.month')}
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="radio"
                        id="custom"
                        name="rangeOption"
                        value="custom"
                        checked={rangeOption === 'custom'}
                        onChange={() => setRangeOption('custom')}
                    />
                    <label htmlFor="custom" className="cursor-pointer">
                        {t('admin.pages.stats.custom')}
                    </label>
                </div>
                {rangeOption === 'custom' && (
                    <>
                        <div className="flex flex-col">
                            <label>{t('admin.pages.stats.startDate')}</label>
                            <input
                                type="date"
                                className="border rounded px-2 py-1"
                                value={customFromIso}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    setCustomFromIso(e.target.value);
                                    if (e.target.value) {
                                        setFromDate(
                                            parseIsoToSpanish(e.target.value),
                                        );
                                    } else {
                                        setFromDate('');
                                    }
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>{t('admin.pages.stats.endDate')}</label>
                            <input
                                type="date"
                                className="border rounded px-2 py-1"
                                value={customToIso}
                                min={customFromIso || undefined}
                                max={maxAllowedToDate}
                                onChange={(e) => {
                                    setCustomToIso(e.target.value);
                                    if (e.target.value) {
                                        setToDate(
                                            parseIsoToSpanish(e.target.value),
                                        );
                                    } else {
                                        setToDate('');
                                    }
                                }}
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
                            <div
                                key={item.key}
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
                        );
                    })}
                </div>
            )}
        </div>
    );
}
