import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';
import { fetchSensorHistoryByDevEui } from '@/api/sensorHistoryService';

interface Sensor {
  id: number;
  dev_eui: string;
  name: string;
  latitude: number;
  longitude: number;
  contract_id: number;
}

interface SensorDataPoint {
  time: string;
  value: number;
}

export default function Sensors() {
  const [isLoading, setIsLoading] = useState(true);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);
  const { t } = useTranslation();
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [phData, setPhData] = useState<SensorDataPoint[]>([]);
  const [humidityData, setHumidityData] = useState<SensorDataPoint[]>([]);
  const [selectedRange, setSelectedRange] = useState<
    'week' | 'month' | 'custom'
  >('week');
  const [customRange, setCustomRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // Fixed to April 2025 for simulation
  const getCurrentWeekRange = () => {
    const now = new Date('2025-04-01');
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);

    const start = new Date(now);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const getCurrentMonthRange = () => {
    const now = new Date('2025-04-01');
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const getTodayRange = () => {
    const now = new Date('2025-04-01T12:00:00Z');
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const generateSimulatedDailyData = (sensorType: 'ph' | 'humidity') => {
    const today = new Date('2025-04-01T12:00:00Z');

    if (sensorType === 'ph') {
      return [
        {
          time: today.toISOString(),
          ph1_soil: 6.5,
          humidity_soil: null,
        },
      ];
    } else {
      return [
        {
          time: today.toISOString(),
          ph1_soil: null,
          humidity_soil: 42,
        },
      ];
    }
  };

  const fetchSensorsData = async () => {
    try {
      const response = await axiosClient.get('/admin/sensors');
      if (Array.isArray(response.data)) {
        setSensors(response.data);
      } else {
        console.error('API response is not an array:', response.data);
        setSensors([]);
      }
      setHasError(false);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      setHasError(true);
      setMsg(t('admin.pages.sensors.list.messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorsData();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleViewSensor = async (id: number) => {
    const sensor = sensors.find((s) => s.id === id);
    if (!sensor) {
      setMsg(t('admin.pages.sensors.list.messages.invalidSensor'));
      return;
    }

    setSelectedSensor(sensor);

    try {
      let dateRange = { start: new Date(), end: new Date() };

      switch (selectedRange) {
        case 'week':
          dateRange = getCurrentWeekRange();
          break;
        case 'month':
          dateRange = getCurrentMonthRange();
          break;
        case 'custom':
          if (customRange[0] && customRange[1]) {
            dateRange.start = new Date(customRange[0]);
            dateRange.end = new Date(customRange[1]);
            dateRange.start.setHours(0, 0, 0, 0);
            dateRange.end.setHours(23, 59, 59, 999);
          } else {
            dateRange = getTodayRange();
          }
          break;
        default:
          dateRange = getTodayRange();
      }

      let sensorHistories: any[] = [];

      if (sensor.name.includes('SensorPH')) {
        sensorHistories = generateSimulatedDailyData('ph');
      } else if (sensor.name.includes('SensorHumitat')) {
        sensorHistories = generateSimulatedDailyData('humidity');
      }

      const processDailyData = (
        data: any[],
        key: 'ph1_soil' | 'humidity_soil',
      ) => {
        const dailyValues: { [key: string]: any } = {};

        data.forEach((entry) => {
          const date = new Date(entry.time);
          const dateKey = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          if (entry[key] !== null && !isNaN(Number(entry[key]))) {
            if (!dailyValues[dateKey]) {
              dailyValues[dateKey] = {
                time: dateKey,
                value: Number(entry[key]),
              };
            }
          }
        });

        return Object.values(dailyValues);
      };

      const phPoints = processDailyData(sensorHistories, 'ph1_soil');
      const humidityPoints = processDailyData(sensorHistories, 'humidity_soil');

      setPhData(phPoints);
      setHumidityData(humidityPoints);

      if (phPoints.length === 0 && humidityPoints.length === 0) {
        setMsg('No data available for the selected range');
      } else {
        setMsg(null);
      }

      setIsDialogVisible(true);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setMsg('Error loading sensor data');
    }
  };

  const prepareChartData = (
    dataPoints: SensorDataPoint[],
    label: string,
    color: string,
  ) => {
    return {
      labels: dataPoints.map((point) => point.time),
      datasets: [
        {
          label: label,
          data: dataPoints.map((point) => point.value),
          borderColor: color,
          backgroundColor: `${color}33`,
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: color,
          fill: false,
          tension: 0.1,
        },
      ],
    };
  };

  const handleRangeChange = async (range: 'week' | 'month' | 'custom') => {
    setSelectedRange(range);
    if (range !== 'custom') setCustomRange([null, null]);

    if (!selectedSensor) return;

    try {
      await handleViewSensor(selectedSensor.id);
    } catch (error) {
      console.error('Error updating sensor data:', error);
      setMsg('Error updating data range');
    }
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setSelectedSensor(null);
    setPhData([]);
    setHumidityData([]);
  };

  const handleEditClick = (id: number) => navigate(`/admin/sensors/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      try {
        await axiosClient.delete(`/admin/sensors/${id}`);
        setMsg('Sensor deleted successfully');
        await fetchSensorsData();
      } catch (error) {
        console.error(error);
        setMsg('Error deleting sensor');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
        <span className="mt-2 text-blue-600">Loading...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600">Error loading sensors</p>
        <Button label="Retry" onClick={fetchSensorsData} />
      </div>
    );
  }

  return (
    <>
      {msg && (
        <Message
          severity={msg.includes('Success') ? 'success' : 'error'}
          text={msg}
          className="mb-4 w-full"
        />
      )}

      <CrudPanel
        title="Sensors Management"
        onCreate={() => navigate('/admin/sensors/create')}>
        <DataTable
          value={sensors}
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm"
          emptyMessage="No sensors found">
          <Column field="dev_eui" header="Device EUI" />
          <Column field="name" header="Name" />
          <Column field="latitude" header="Latitude" />
          <Column field="longitude" header="Longitude" />
          <Column
            header="Actions"
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:eye" className="h-5 w-5" />}
                  className="p-button-rounded p-button-success"
                  tooltip="View details"
                  onClick={() => handleViewSensor(rowData.id)}
                />
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip="Edit sensor"
                  onClick={() => handleEditClick(rowData.id)}
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip="Delete sensor"
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>

      <Dialog
        visible={isDialogVisible}
        style={{ width: '90vw', maxWidth: '1200px' }}
        onHide={closeDialog}
        header={`Sensor data: ${selectedSensor?.name || ''} (${selectedSensor?.dev_eui || ''})`}
        modal>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <div className="flex gap-2">
              <Button
                label="This week"
                onClick={() => handleRangeChange('week')}
                className={selectedRange === 'week' ? 'p-button-primary' : ''}
              />
              <Button
                label="This month"
                onClick={() => handleRangeChange('month')}
                className={selectedRange === 'month' ? 'p-button-primary' : ''}
              />
              <Button
                label="Custom"
                onClick={() => handleRangeChange('custom')}
                className={selectedRange === 'custom' ? 'p-button-primary' : ''}
              />
            </div>

            {selectedRange === 'custom' && (
              <div className="flex gap-2 items-center">
                <Calendar
                  value={customRange[0]}
                  onChange={(e) =>
                    setCustomRange([e.value as Date, customRange[1]])
                  }
                  placeholder="Start date"
                  showIcon
                  dateFormat="dd/mm/yy"
                />
                <span>to</span>
                <Calendar
                  value={customRange[1]}
                  onChange={(e) =>
                    setCustomRange([customRange[0], e.value as Date])
                  }
                  placeholder="End date"
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
            )}
          </div>

          <div className="mb-4 text-center text-gray-600">
            {selectedRange === 'week' && (
              <span>
                Showing data for this week:{' '}
                {getCurrentWeekRange().start.toLocaleDateString('en-US')} -{' '}
                {getCurrentWeekRange().end.toLocaleDateString('en-US')}
              </span>
            )}
            {selectedRange === 'month' && (
              <span>
                Showing data for this month:{' '}
                {getCurrentMonthRange().start.toLocaleDateString('en-US')} -{' '}
                {getCurrentMonthRange().end.toLocaleDateString('en-US')}
              </span>
            )}
            {selectedRange === 'custom' && customRange[0] && customRange[1] ? (
              <span>
                Showing data from {customRange[0].toLocaleDateString('en-US')}{' '}
                to {customRange[1].toLocaleDateString('en-US')}
              </span>
            ) : (
              <span>
                Showing data for today:{' '}
                {new Date('2025-04-01').toLocaleDateString('en-US')}
              </span>
            )}
          </div>

          <div className="grid">
            {selectedSensor?.name.includes('SensorPH') && phData.length > 0 && (
              <div className="col-12">
                <h3 className="text-lg font-semibold mb-3 text-center">
                  Soil PH (ph1_soil)
                </h3>
                <Chart
                  type="line"
                  data={prepareChartData(phData, 'Soil PH', '#66BB6A')}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: true },
                      tooltip: {
                        callbacks: {
                          label: (context) => `PH: ${context.raw}`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 14,
                        title: { display: true, text: 'PH Value' },
                      },
                      x: {
                        title: { display: true, text: 'Date' },
                      },
                    },
                  }}
                  style={{ height: '400px' }}
                />
              </div>
            )}

            {selectedSensor?.name.includes('SensorHumitat') &&
              humidityData.length > 0 && (
                <div className="col-12">
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    Soil Humidity
                  </h3>
                  <Chart
                    type="line"
                    data={prepareChartData(
                      humidityData,
                      'Soil Humidity',
                      '#42A5F5',
                    )}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Humidity: ${context.raw}%`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          min: 0,
                          max: 100,
                          title: { display: true, text: 'Humidity Percentage' },
                        },
                        x: {
                          title: { display: true, text: 'Date' },
                        },
                      },
                    }}
                    style={{ height: '400px' }}
                  />
                </div>
              )}

            {phData.length === 0 && humidityData.length === 0 && (
              <div className="col-12 text-center py-4">
                <p className="text-gray-500">
                  No data available for this sensor in the selected range
                </p>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
