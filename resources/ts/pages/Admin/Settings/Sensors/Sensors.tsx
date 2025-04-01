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

  const getCurrentWeekRange = () => {
    const now = new Date();
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
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const getTodayRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return { start, end };
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
      let dateRange = { start: null, end: null };

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

      const sensorHistories = await fetchSensorHistoryByDevEui(
        sensor.dev_eui,
        dateRange.start,
        dateRange.end,
      );

      console.log('Datos recibidos de la API:', sensorHistories);

      // Procesar datos asegurando que los valores son números válidos
      const processData = (data: any[], key: 'ph1_soil' | 'humidity_soil') => {
        return data
          .filter((entry) => entry[key] !== null && !isNaN(Number(entry[key])))
          .map((entry) => ({
            time: new Date(entry.time).toLocaleString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
            value: Number(entry[key]),
          }));
      };

      const phPoints = processData(sensorHistories, 'ph1_soil');
      const humidityPoints = processData(sensorHistories, 'humidity_soil');

      console.log('Datos de PH procesados:', phPoints);
      console.log('Datos de humedad procesados:', humidityPoints);

      setPhData(phPoints);
      setHumidityData(humidityPoints);

      if (phPoints.length === 0 && humidityPoints.length === 0) {
        setMsg(t('admin.pages.sensors.list.messages.noDataAvailable'));
      } else {
        setMsg(null);
      }

      setIsDialogVisible(true);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setMsg(t('admin.pages.sensors.list.messages.error'));
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
          pointRadius: 4,
          pointHoverRadius: 6,
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
      setMsg(t('admin.pages.sensors.list.messages.error'));
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
    if (window.confirm(t('admin.pages.sensors.list.messages.deleteConfirm'))) {
      try {
        await axiosClient.delete(`/admin/sensors/${id}`);
        setMsg(t('admin.pages.sensors.list.messages.deleteSuccess'));
        await fetchSensorsData();
      } catch (error) {
        console.error(error);
        setMsg(t('admin.pages.sensors.list.messages.deleteError'));
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
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600">
          {t('admin.pages.sensors.list.messages.error')}
        </p>
        <Button label={t('general.retry')} onClick={fetchSensorsData} />
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
        title={t('admin.pages.sensors.title')}
        onCreate={() => navigate('/admin/sensors/create')}>
        <DataTable
          value={sensors}
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm"
          emptyMessage={t('admin.pages.sensors.list.noData')}>
          <Column
            field="dev_eui"
            header={t('admin.pages.sensors.list.columns.deviceEui')}
          />
          <Column
            field="name"
            header={t('admin.pages.sensors.list.columns.name')}
          />
          <Column
            field="latitude"
            header={t('admin.pages.sensors.list.columns.latitude')}
          />
          <Column
            field="longitude"
            header={t('admin.pages.sensors.list.columns.longitude')}
          />
          <Column
            header={t('admin.pages.sensors.list.actions.label')}
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:eye" className="h-5 w-5" />}
                  className="p-button-rounded p-button-success"
                  tooltip={t('admin.pages.sensors.list.actions.view')}
                  onClick={() => handleViewSensor(rowData.id)}
                />
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t('admin.pages.sensors.list.actions.edit')}
                  onClick={() => handleEditClick(rowData.id)}
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t('admin.pages.sensors.list.actions.delete')}
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
        header={`Dades del sensor: ${selectedSensor?.name || ''} (${selectedSensor?.dev_eui || ''})`}
        modal>
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <div className="flex gap-2">
              <Button
                label={t('admin.sensors.stats.week')}
                onClick={() => handleRangeChange('week')}
                className={selectedRange === 'week' ? 'p-button-primary' : ''}
              />
              <Button
                label={t('admin.sensors.stats.month')}
                onClick={() => handleRangeChange('month')}
                className={selectedRange === 'month' ? 'p-button-primary' : ''}
              />
              <Button
                label={t('admin.sensors.stats.custom')}
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
                  placeholder="Data inicial"
                  showIcon
                  dateFormat="dd/mm/yy"
                />
                <span>a</span>
                <Calendar
                  value={customRange[1]}
                  onChange={(e) =>
                    setCustomRange([customRange[0], e.value as Date])
                  }
                  placeholder="Data final"
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
            )}
          </div>

          <div className="mb-4 text-center text-gray-600">
            {selectedRange === 'week' && (
              <span>
                Mostrant dades d'aquesta setmana:{' '}
                {getCurrentWeekRange().start.toLocaleDateString('es-ES')} -{' '}
                {getCurrentWeekRange().end.toLocaleDateString('es-ES')}
              </span>
            )}
            {selectedRange === 'month' && (
              <span>
                Mostrant dades d'aquest mes:{' '}
                {getCurrentMonthRange().start.toLocaleDateString('es-ES')} -{' '}
                {getCurrentMonthRange().end.toLocaleDateString('es-ES')}
              </span>
            )}
            {selectedRange === 'custom' && customRange[0] && customRange[1] ? (
              <span>
                Mostrant dades des de{' '}
                {customRange[0].toLocaleDateString('es-ES')} fins a{' '}
                {customRange[1].toLocaleDateString('es-ES')}
              </span>
            ) : (
              <span>
                Mostrant dades d'avui: {new Date().toLocaleDateString('es-ES')}
              </span>
            )}
          </div>

          <div className="grid">
            {selectedSensor?.name.includes('SensorPH') && phData.length > 0 && (
              <div className="col-12">
                <h3 className="text-lg font-semibold mb-3 text-center">
                  PH del Sòl (ph1_soil)
                </h3>
                <Chart
                  type="line"
                  data={prepareChartData(phData, 'PH del Sòl', '#66BB6A')}
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
                        title: { display: true, text: 'Valor de PH' },
                      },
                      x: {
                        title: { display: true, text: 'Data i hora' },
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
                    Humitat del Sòl
                  </h3>
                  <Chart
                    type="line"
                    data={prepareChartData(
                      humidityData,
                      'Humitat del Sòl',
                      '#42A5F5',
                    )}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Humitat: ${context.raw}%`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: "Percentatge d'Humitat",
                          },
                        },
                        x: {
                          title: { display: true, text: 'Data i hora' },
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
                  No hi ha dades disponibles per aquest sensor en el rang
                  seleccionat
                </p>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
