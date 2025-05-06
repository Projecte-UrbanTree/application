import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllSensorHistory } from '@/api/sensors';
import { useTranslation } from 'react-i18next';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  subMonths,
  addMonths,
} from 'date-fns';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import { Icon } from '@iconify/react';
import { Chart, registerables } from 'chart.js';
import CrudPanel  from '@/components/CrudPanel';

// Register Chart.js core components
Chart.register(...registerables);

const SensorHistory: React.FC = () => {
  const { t } = useTranslation();
  const { eui } = useParams<{ eui: string }>();
  const navigate = useNavigate();

  const [sensorData, setSensorData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const chartRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const charts = useRef<Chart[]>([]);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);

  const availableMetrics = useMemo(() => {
    const metrics = {
      temp_soil: sensorData.some((data) => data.temp_soil != null),
      ph1_soil: sensorData.some((data) => data.ph1_soil != null),
      water_soil: sensorData.some((data) => data.water_soil != null),
      conductor_soil: sensorData.some((data) => data.conductor_soil != null),
      bat: sensorData.some((data) => data.bat != null),
      rssi: sensorData.some((data) => data.rssi != null),
      snr: sensorData.some((data) => data.snr != null),
    };
    return metrics;
  }, [sensorData]);

  useEffect(() => {
    const loadSensorHistory = async () => {
      try {
        if (!eui) {
          throw new Error('Sensor EUI is missing');
        }

        setLoading(true);
        const response = await fetchAllSensorHistory(eui);

        if (response) {
          setSensorData(response);
          const filtered = response.filter((data: any) => {
            const dataDate = parseISO(data.time);
            return isSameMonth(dataDate, selectedMonth);
          });
          setFilteredData(filtered);

          // Preload charts immediately after data is loaded
          setTimeout(() => {
            preloadCharts(filtered);
          }, 100);
        } else {
          setSensorData([]);
        }
      } catch (err: any) {
        console.error('Error loading sensor history:', err);
        setError(t('admin.pages.sensors.history.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadSensorHistory();
  }, [eui, t, selectedMonth]);

  const preloadCharts = (data: any[]) => {
    charts.current.forEach((chart) => chart.destroy());
    charts.current = [];

    while (chartRefs.current.length < 7) {
      chartRefs.current.push(null);
    }

    const reversedData = [...data].reverse();

    const labels = reversedData.map((data) =>
      format(parseISO(data.time), 'dd/MM/yyyy HH:mm'),
    );

    const chartConfigs = [
      {
        title: t('admin.pages.sensors.history.metrics.temp_soil') || 'Soil Temperature',
        data: reversedData.map((data) => data.temp_soil),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        yAxisTitle: '°C',
      },
      {
        title: t('admin.pages.sensors.history.metrics.ph1_soil') || 'Soil pH',
        data: reversedData.map((data) => data.ph1_soil),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        yAxisTitle: 'pH',
      },
      {
        title: t('admin.pages.sensors.history.metrics.water_soil') || 'Soil Moisture',
        data: reversedData.map((data) => data.water_soil || null),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.2)',
        yAxisTitle: '%',
      },
      {
        title: t('admin.pages.sensors.history.metrics.conductor_soil') || 'Soil Conductivity',
        data: reversedData.map((data) => data.conductor_soil || null),
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.2)',
        yAxisTitle: 'µS/cm',
      },
      {
        title: t('admin.pages.sensors.history.metrics.bat') || 'Battery',
        data: reversedData.map((data) => data.bat),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        yAxisTitle: 'V',
      },
      {
        title: t('admin.pages.sensors.history.metrics.rssi') || 'RSSI',
        data: reversedData.map((data) => data.rssi),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        yAxisTitle: 'dBm',
      },
      {
        title: t('admin.pages.sensors.history.metrics.snr') || 'SNR',
        data: reversedData.map((data) => data.snr),
        borderColor: '#db2777',
        backgroundColor: 'rgba(219, 39, 119, 0.2)',
        yAxisTitle: 'dB',
      },
    ];

    chartConfigs.forEach((config, index) => {
      const ctx = chartRefs.current[index]?.getContext('2d');
      if (!ctx) return;

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: config.title,
              data: config.data,
              borderColor: config.borderColor,
              backgroundColor: config.backgroundColor,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: config.title,
              font: { size: 18, weight: 'bold', family: 'Arial, sans-serif' },
              color: '#374151',
            },
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1f2937',
              titleFont: { size: 14, weight: 'bold', family: 'Arial, sans-serif' },
              bodyFont: { size: 12, family: 'Arial, sans-serif' },
              titleColor: '#f9fafb',
              bodyColor: '#f3f4f6',
              borderColor: '#4b5563',
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: config.yAxisTitle,
                font: { size: 14, weight: 'bold', family: 'Arial, sans-serif' },
                color: '#374151',
              },
              grid: {
                color: 'rgba(156, 163, 175, 0.2)',
              },
              ticks: {
                color: '#4b5563',
                font: { size: 12, family: 'Arial, sans-serif' },
              },
            },
            x: {
              title: {
                display: true,
                text: t('admin.pages.sensors.history.metrics.time') || 'Time',
                font: { size: 14, weight: 'bold', family: 'Arial, sans-serif' },
                color: '#374151',
              },
              grid: {
                color: 'rgba(156, 163, 175, 0.2)',
              },
              ticks: {
                color: '#4b5563',
                font: { size: 12, family: 'Arial, sans-serif' },
              },
            },
          },
        },
      });

      charts.current.push(chart);
    });
  };

  useEffect(() => {
    // Destroy charts when component unmounts or data changes
    return () => {
      charts.current.forEach((chart) => chart.destroy());
      charts.current = [];
    };
  }, [sensorData]);

  useEffect(() => {
    // This will ensure charts render whenever view mode or data changes
    if (viewMode === 'chart' && filteredData.length > 0) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        renderCharts();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [viewMode, filteredData]);

  useEffect(() => {
    if (sensorData.length > 0) {
      const filtered = sensorData.filter((data) => {
        const dataDate = parseISO(data.time);
        return isSameMonth(dataDate, selectedMonth);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [sensorData, selectedMonth]);

  const getBatterySeverity = (voltage: number) => {
    if (voltage >= 3.6) return 'success';
    if (voltage >= 3.3) return 'warning';
    return 'danger';
  };

  const getSignalSeverity = (rssi: number) => {
    if (rssi >= -70) return 'success';
    if (rssi >= -85) return 'warning';
    return 'danger';
  };

  const getMoistureSeverity = (moisture: number) => {
    if (moisture >= 60) return 'success';
    if (moisture >= 30) return 'warning';
    return 'danger';
  };

  const renderCharts = () => {
    charts.current.forEach((chart) => chart.destroy());
    charts.current = [];

    while (chartRefs.current.length < 7) {
        // We have 7 chart configs
        chartRefs.current.push(null);
    }

    // Generate all days of the selected month
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    const allDays = [];
    for (let day = start; day <= end; day = new Date(day.getTime() + 24 * 60 * 60 * 1000)) {
        allDays.push(format(day, 'dd'));
    }

    // Group data by day and calculate averages
    const dataByDay = filteredData.reduce((acc, data) => {
        const day = format(parseISO(data.time), 'dd');
        if (!acc[day]) acc[day] = [];
        acc[day].push(data);
        return acc;
    }, {} as Record<string, any[]>);

    const calculateAverage = (values: (number | null)[]) => {
        const validValues = values.filter((v) => v != null) as number[];
        return validValues.length > 0
            ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
            : null;
    };

    const labels = allDays;
    const chartConfigs = [
        {
            title: t('admin.pages.sensors.history.metrics.temp_soil') || 'Soil Temperature',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.temp_soil) || [])
            ),
            borderColor: '#ef4444',
            backgroundColor: '#fca5a5',
            yAxisTitle: '°C',
        },
        {
            title: t('admin.pages.sensors.history.metrics.ph1_soil') || 'Soil pH',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.ph1_soil) || [])
            ),
            borderColor: '#8b5cf6',
            backgroundColor: '#c4b5fd',
            yAxisTitle: 'pH',
        },
        {
            title: t('admin.pages.sensors.history.metrics.water_soil') || 'Soil Moisture',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.water_soil) || [])
            ),
            borderColor: '#059669',
            backgroundColor: '#6ee7b7',
            yAxisTitle: '%',
        },
        {
            title: t('admin.pages.sensors.history.metrics.conductor_soil') || 'Soil Conductivity',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.conductor_soil) || [])
            ),
            borderColor: '#d97706',
            backgroundColor: '#fcd34d',
            yAxisTitle: 'µS/cm',
        },
        {
            title: t('admin.pages.sensors.history.metrics.bat') || 'Battery',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.bat) || [])
            ),
            borderColor: '#2563eb',
            backgroundColor: '#93c5fd',
            yAxisTitle: 'V',
        },
        {
            title: t('admin.pages.sensors.history.metrics.rssi') || 'RSSI',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.rssi) || [])
            ),
            borderColor: '#7c3aed',
            backgroundColor: '#c4b5fd',
            yAxisTitle: 'dBm',
        },
        {
            title: t('admin.pages.sensors.history.metrics.snr') || 'SNR',
            data: allDays.map((day) =>
                calculateAverage(dataByDay[day]?.map((entry: any) => entry.snr) || [])
            ),
            borderColor: '#db2777',
            backgroundColor: '#f9a8d4',
            yAxisTitle: 'dB',
        },
    ].filter((config) => config.data.some((value) => value != null));

    chartConfigs.forEach((config, index) => {
        const ctx = chartRefs.current[index]?.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: config.title,
                        data: config.data,
                        borderColor: config.borderColor,
                        backgroundColor: config.backgroundColor,
                        fill: false,
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: config.title,
                        font: { size: 16 },
                    },
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: (context) => {
                                // Show full date in tooltip
                                const day = context[0].label;
                                const fullDate = `${day}/${format(selectedMonth, 'MM/yyyy')}`;
                                return fullDate;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: config.yAxisTitle,
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: t('admin.pages.sensors.history.metrics.day') || 'Day', // Updated to "Day"
                        },
                    },
                },
            },
        });

        charts.current.push(chart);
    });
};

  const previousMonth = () => {
    setSelectedMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const nextMonth = () => {
    setSelectedMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button
            icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
            severity="secondary"
            outlined
            className="p-button-sm"
            onClick={() => navigate('/admin/sensors')}
            label={t('admin.pages.sensors.history.back')}
          />

          <div className="flex items-center gap-3">
            <Icon
              icon="tabler:device-analytics"
              className="text-2xl text-indigo-600"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              {t('admin.pages.sensors.history.title')}
            </h1>
            <Tag
              value={eui}
              className="font-mono bg-gray-100 text-gray-800 border border-gray-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {t('admin.pages.sensors.history.view')}:
            </span>
            <ToggleButton
              checked={viewMode === 'chart'}
              onChange={(e) => setViewMode(e.value ? 'chart' : 'table')}
              onLabel={t('admin.pages.sensors.history.chartView')}
              offLabel={t('admin.pages.sensors.history.tableView')}
              onIcon="pi pi-chart-line"
              offIcon="pi pi-table"
              className="w-40"
            />
          </div>
        </div>

        {viewMode === 'table' ? (
          /* Table View */
          <CrudPanel
            title="admin.pages.sensors.history.title"
            onCreate={undefined} 
            createDisabled={true}>
            <DataTable
              value={sensorData}
              paginator
              rows={perPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              stripedRows
              showGridlines
              className="p-datatable-sm">
              <Column
                field="time"
                header={t('admin.pages.sensors.history.metrics.time')}
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:clock" className="text-gray-500" />
                    <span>{format(parseISO(rowData.time), 'PPpp')}</span>
                  </div>
                )}
              />
              {availableMetrics.temp_soil && (
                <Column
                  field="temp_soil"
                  header={t('admin.pages.sensors.history.metrics.temp_soil')}
                  body={(rowData) =>
                    rowData.temp_soil != null ? (
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:temperature" className="text-red-500" />
                        <span>{rowData.temp_soil} °C</span>
                      </div>
                    ) : (
                      'N/A'
                    )
                  }
                />
              )}
              {availableMetrics.ph1_soil && (
                <Column
                  field="ph1_soil"
                  header={t('admin.pages.sensors.history.metrics.ph1_soil')}
                  body={(rowData) =>
                    rowData.ph1_soil != null ? (
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:ph" className="text-purple-500" />
                        <span>{rowData.ph1_soil} pH</span> {/* Fixed mismatched tags */}
                      </div>
                    ) : (
                      'N/A'
                    )
                  }
                />
              )}
              {availableMetrics.water_soil && (
                <Column
                  field="water_soil"
                  header={t('admin.pages.sensors.history.metrics.water_soil')}
                  body={(rowData) =>
                    rowData.water_soil != null ? (
                      <Tag
                        value={`${rowData.water_soil}%`}
                        severity={getMoistureSeverity(rowData.water_soil)}
                        className="font-medium"
                      />
                    ) : (
                      <Tag value="N/A" severity="info" />
                    )
                  }
                />
              )}
              {availableMetrics.conductor_soil && (
                <Column
                  field="conductor_soil"
                  header={t('admin.pages.sensors.history.metrics.conductor_soil')}
                  body={(rowData) =>
                    rowData.conductor_soil != null ? (
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="tabler:lightning-bolt"
                          className="text-yellow-500"
                        />
                        <span>{rowData.conductor_soil} µS/cm</span>
                      </div>
                    ) : (
                      'N/A'
                    )
                  }
                />
              )}
              {availableMetrics.bat && (
                <Column
                  field="bat"
                  header={t('admin.pages.sensors.history.metrics.bat')}
                  body={(rowData) =>
                    rowData.bat != null ? (
                      <Tag
                        value={`${rowData.bat.toFixed(2)} V`}
                        severity={getBatterySeverity(rowData.bat)}
                        className="font-medium"
                      />
                    ) : (
                      <Tag value="N/A" severity="info" />
                    )
                  }
                />
              )}
              {availableMetrics.rssi && (
                <Column
                  field="rssi"
                  header={t('admin.pages.sensors.history.metrics.rssi')}
                  body={(rowData) =>
                    rowData.rssi != null ? (
                      <Tag
                        value={`${rowData.rssi} dBm`}
                        severity={getSignalSeverity(rowData.rssi)}
                        className="font-medium"
                      />
                    ) : (
                      <Tag value="N/A" severity="info" />
                    )
                  }
                />
              )}
              {availableMetrics.snr && (
                <Column
                  field="snr"
                  header={t('admin.pages.sensors.history.metrics.snr')}
                  body={(rowData) =>
                    rowData.snr != null ? `${rowData.snr} dB` : 'N/A'
                  }
                />
              )}
            </DataTable> {/* Fixed mismatched closing tag */}
          </CrudPanel>
        ) : (
          /* Chart View */
          <div className="flex flex-col gap-8">
            {/* Month selector */}
            <Card className="p-4 shadow-sm border border-gray-300 bg-gray-50">
              <div className="flex justify-between items-center">
                <Button
                  icon={<Icon icon="tabler:chevron-left" className="h-5 w-5" />}
                  onClick={previousMonth}
                  className="p-button-outlined p-button-sm"
                />

                <h2 className="text-xl font-semibold text-gray-700">
                  {format(selectedMonth, 'MMMM yyyy')}
                </h2>

                <Button
                  icon={
                    <Icon icon="tabler:chevron-right" className="h-5 w-5" />
                  }
                  onClick={nextMonth}
                  className="p-button-outlined p-button-sm"
                  disabled={isSameMonth(selectedMonth, new Date())}
                />
              </div>

              {filteredData.length === 0 && (
                <div className="text-center mt-4 p-4 bg-blue-50 text-blue-600 rounded-lg">
                  <Icon icon="tabler:info-circle" className="inline mr-2" />
                  {t('admin.pages.sensors.history.noDataForMonth') ||
                    'No data available for this month'}
                </div>
              )}
            </Card>

            {/* Individual charts */}
            {filteredData.length > 0 && (
              <div className="flex flex-col gap-6">
                {Object.entries(availableMetrics)
                  .filter(([key, value]) => value)
                  .map(([key, _], index) => (
                    <Card
                      key={index}
                      className="p-4 shadow-sm border border-gray-300 bg-gray-50 flex-1">
                      <div className="h-80">
                        <canvas
                          ref={(el) => {
                            chartRefs.current[index] = el;
                          }}
                        />
                      </div>
                    </Card>
                  ))}
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button
                icon={<Icon icon="tabler:table" className="h-5 w-5 mr-2" />}
                label={t('admin.pages.sensors.history.backToTable')}
                onClick={() => setViewMode('table')}
                className="p-button-text"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorHistory;
