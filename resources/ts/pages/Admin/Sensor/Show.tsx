import React, { useEffect, useState, useRef } from 'react';
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
  }, [eui, t]);

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

  const onPageChange = (event: any) => {
    setPage(event.page + 1);
    setFirst(event.first);
    setPerPage(event.rows);
  };

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

    const labels = filteredData.map((data) =>
      format(parseISO(data.time), 'dd/MM/yyyy HH:mm'),
    );

    const chartConfigs = [
      {
        title:
          t('admin.pages.sensors.history.metrics.temp_soil') ||
          'Soil Temperature',
        data: filteredData.map((data) => data.temp_soil),
        borderColor: '#ef4444',
        backgroundColor: '#fca5a5',
        yAxisTitle: '°C',
      },
      {
        title: t('admin.pages.sensors.history.metrics.ph1_soil') || 'Soil pH',
        data: filteredData.map((data) => data.ph1_soil),
        borderColor: '#8b5cf6',
        backgroundColor: '#c4b5fd',
        yAxisTitle: 'pH',
      },
      {
        title:
          t('admin.pages.sensors.history.metrics.water_soil') ||
          'Soil Moisture',
        data: filteredData.map((data) => data.water_soil || null),
        borderColor: '#059669',
        backgroundColor: '#6ee7b7',
        yAxisTitle: '%',
      },
      {
        title:
          t('admin.pages.sensors.history.metrics.conductor_soil') ||
          'Soil Conductivity',
        data: filteredData.map((data) => data.conductor_soil || null),
        borderColor: '#d97706',
        backgroundColor: '#fcd34d',
        yAxisTitle: 'µS/cm',
      },
      {
        title: t('admin.pages.sensors.history.metrics.bat') || 'Battery',
        data: filteredData.map((data) => data.bat),
        borderColor: '#2563eb',
        backgroundColor: '#93c5fd',
        yAxisTitle: 'V',
      },
      {
        title: t('admin.pages.sensors.history.metrics.rssi') || 'RSSI',
        data: filteredData.map((data) => data.rssi),
        borderColor: '#7c3aed',
        backgroundColor: '#c4b5fd',
        yAxisTitle: 'dBm',
      },
      {
        title: t('admin.pages.sensors.history.metrics.snr') || 'SNR',
        data: filteredData.map((data) => data.snr),
        borderColor: '#db2777',
        backgroundColor: '#f9a8d4',
        yAxisTitle: 'dB',
      },
    ];

    // Create and attach refs for more charts
    while (chartRefs.current.length < chartConfigs.length) {
      chartRefs.current.push(null);
    }

    // Render each chart
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
              display: false, // No legend needed for single dataset
            },
            tooltip: {
              mode: 'index',
              intersect: false,
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
                text: t('admin.pages.sensors.history.metrics.time') || 'Time',
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
        {/* Header with back button, title, and view toggle */}
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
            onCreate={undefined} // No create action for sensor history
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
              <Column
                field="temp_soil"
                header={t('admin.pages.sensors.history.metrics.temp_soil')}
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:temperature" className="text-red-500" />
                    <span>{rowData.temp_soil} °C</span>
                  </div>
                )}
              />
              <Column
                field="ph1_soil"
                header={t('admin.pages.sensors.history.metrics.ph1_soil')}
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <Icon icon="tabler:ph" className="text-purple-500" />
                    <span>{rowData.ph1_soil} pH</span>
                  </div>
                )}
              />
              <Column
                field="water_soil"
                header={t('admin.pages.sensors.history.metrics.water_soil')}
                body={(rowData) =>
                  rowData.water_soil ? (
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
              <Column
                field="conductor_soil"
                header={t('admin.pages.sensors.history.metrics.conductor_soil')}
                body={(rowData) =>
                  rowData.conductor_soil ? (
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
              <Column
                field="bat"
                header={t('admin.pages.sensors.history.metrics.bat')}
                body={(rowData) => (
                  <Tag
                    value={`${rowData.bat.toFixed(2)} V`}
                    severity={getBatterySeverity(rowData.bat)}
                    className="font-medium"
                  />
                )}
              />
              <Column
                field="rssi"
                header={t('admin.pages.sensors.history.metrics.rssi')}
                body={(rowData) => (
                  <Tag
                    value={`${rowData.rssi} dBm`}
                    severity={getSignalSeverity(rowData.rssi)}
                    className="font-medium"
                  />
                )}
              />
              <Column
                field="snr"
                header={t('admin.pages.sensors.history.metrics.snr')}
                body={(rowData) => `${rowData.snr} dB`}
              />
            </DataTable>
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
                {Array.from({
                  length: Math.ceil(chartRefs.current.length / 2),
                }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex flex-col md:flex-row gap-6">
                    {/* First chart in the row */}
                    {rowIndex * 2 < chartRefs.current.length && (
                      <Card className="p-4 shadow-sm border border-gray-300 bg-gray-50 flex-1">
                        <div className="h-80">
                          <canvas
                            ref={(el) => {
                              chartRefs.current[rowIndex * 2] = el;
                            }}
                          />
                        </div>
                      </Card>
                    )}

                    {/* Second chart in the row */}
                    {rowIndex * 2 + 1 < chartRefs.current.length && (
                      <Card className="p-4 shadow-sm border border-gray-300 bg-gray-50 flex-1">
                        <div className="h-80">
                          <canvas
                            ref={(el) => {
                              chartRefs.current[rowIndex * 2 + 1] = el;
                            }}
                          />
                        </div>
                      </Card>
                    )}
                  </div>
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
