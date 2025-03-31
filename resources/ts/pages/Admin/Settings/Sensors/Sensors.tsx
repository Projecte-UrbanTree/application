import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Chart } from 'primereact/chart'; // Importa el componente de gráficos de PrimeReact
import { Calendar } from 'primereact/calendar'; // Importa el componente de calendario para el rango personalizado

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';
import {
  fetchSensors,
  SensorHistory,
  fetchAllSensorHistories,
} from '@/api/sensorHistoryService';

interface Sensor {
  id: number;
  dev_eui: string; // Canviat de device_eui a dev_eui
  name: string;
  latitude: number;
  longitude: number;
  contract_id: number;
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
  const [chartData, setChartData] = useState<{
    ph: { labels: string[]; datasets: any[] } | null;
    humidity: { labels: string[]; datasets: any[] } | null;
  } | null>(null);
  const [selectedRange, setSelectedRange] = useState<
    'week' | 'month' | 'custom'
  >('week');
  const [customRange, setCustomRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const fetchSensorsData = async () => {
    try {
      const response = await axiosClient.get('/admin/sensors'); // Endpoint correcte
      console.log('Sensors fetched from API:', response.data);

      // Comprova si la resposta és un array
      if (Array.isArray(response.data)) {
        setSensors(response.data); // Assigna els sensors obtinguts
      } else {
        console.error('API response is not an array:', response.data);
        setSensors([]); // Assigna un array buit si la resposta no és vàlida
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

  const handleCreate = async (values: Sensor) => {
    try {
      const response = await axiosClient.post('/admin/sensors', {
        dev_eui: values.dev_eui, // Canviat de device_eui a dev_eui
        name: values.name,
        latitude: values.latitude,
        longitude: values.longitude,
        contract_id: values.contract_id,
      });
      console.log('Sensor created:', response.data);
      setMsg(t('admin.pages.sensors.list.messages.createSuccess'));
      await fetchSensorsData(); // Actualitza la vista
    } catch (error: any) {
      console.error('Error creating sensor:', error.response?.data || error);
      setMsg(
        error.response?.data?.message ||
          t('admin.pages.sensors.list.messages.error'),
      );
    }
  };

  const handleEdit = async (id: number, values: Partial<Sensor>) => {
    try {
      const response = await axiosClient.put(`/admin/sensors/${id}`, values);
      console.log('Sensor updated:', response.data);
      setMsg(t('admin.pages.sensors.list.messages.updateSuccess'));
      await fetchSensorsData(); // Actualitza la vista
    } catch (error) {
      console.error('Error updating sensor:', error);
      setMsg(t('admin.pages.sensors.list.messages.error'));
    }
  };

  const handleEditClick = (id: number) => {
    navigate(`/admin/sensors/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('admin.pages.sensors.list.messages.deleteConfirm'))) {
      try {
        await axiosClient.delete(`/admin/sensors/${id}`);
        setMsg(t('admin.pages.sensors.list.messages.deleteSuccess'));
        await fetchSensorsData(); // Actualitza la vista
      } catch (error) {
        console.error(error);
        setMsg(t('admin.pages.sensors.list.messages.deleteError'));
      }
    }
  };

  const fetchSensorById = async (id: number) => {
    try {
      const response = await axiosClient.get(`/admin/sensor/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      setMsg(t('admin.pages.sensors.list.messages.error'));
      return null;
    }
  };

  const fetchSensorPH = async (sensorId: number) => {
    try {
      const response = await axiosClient.get(`/admin/sensor/${sensorId}/ph`);
      console.log('Sensor PH fetched:', response.data);
      return response.data.ph || 0; // Devuelve el valor de PH o 0 si no está disponible
    } catch (error) {
      console.error('Error fetching sensor PH:', error);
      setMsg(t('admin.pages.sensors.list.messages.error'));
      return 0; // Devuelve 0 en caso de error
    }
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Dilluns
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(
        currentDate.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
      );
    }

    return dates;
  };

  const getCurrentMonthDates = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const dates = [];
    const currentDate = new Date(startOfMonth);

    while (currentDate <= endOfMonth) {
      dates.push(
        currentDate.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
        }),
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleViewSensor = async (id: number) => {
    const sensor = sensors.find((s) => s.id === id);
    if (!sensor) {
      setMsg(t('admin.pages.sensors.list.messages.error'));
      return;
    }

    setSelectedSensor(sensor);

    try {
      const allHistories = await fetchAllSensorHistories();

      // Filtrar dades per al `dev_eui` seleccionat
      const filteredHistories = allHistories.filter(
        (entry) => entry.dev_eui === sensor.dev_eui,
      );

      // Obtenir les etiquetes (dates) de la setmana actual
      const labels = getCurrentWeekDates();

      if (sensor.name.includes('SensorPH')) {
        // Mapar les dades de PH al format de la gràfica
        const phValues = labels.map((label) => {
          const phEntry = filteredHistories.find(
            (entry) =>
              new Date(entry.time).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              }) === label,
          );
          return phEntry ? phEntry.phi_soil : null; // Si no hi ha dades, retorna null
        });

        setChartData({
          ph: {
            labels,
            datasets: [
              {
                label: 'PH Terra',
                data: phValues,
                borderColor: '#66BB6A',
                backgroundColor: 'rgba(102, 187, 106, 0.2)',
                showLine: true,
              },
            ],
          },
          humidity: null, // No mostrar dades d'humitat
        });
      } else if (sensor.name.includes('SensorHumitat')) {
        // Mapar les dades d'humitat al format de la gràfica
        const humidityValues = labels.map((label) => {
          const humidityEntry = filteredHistories.find(
            (entry) =>
              new Date(entry.time).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              }) === label,
          );
          return humidityEntry ? humidityEntry.humidity_soil : null; // Si no hi ha dades, retorna null
        });

        setChartData({
          ph: null, // No mostrar dades de PH
          humidity: {
            labels,
            datasets: [
              {
                label: 'Humitat Terra',
                data: humidityValues,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                showLine: true,
              },
            ],
          },
        });
      } else {
        // Si el sensor no és ni PH ni Humitat, no mostrar cap gràfica
        setChartData({
          ph: null,
          humidity: null,
        });
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setMsg(t('admin.pages.sensors.list.messages.error'));
    }

    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setSelectedSensor(null);
  };

  const handleRangeChange = async (range: 'week' | 'month' | 'custom') => {
    setSelectedRange(range);

    if (range !== 'custom') {
      setCustomRange([null, null]);
    }

    if (selectedSensor) {
      let labels: string[] = [];
      let startDate: string = '';
      let endDate: string = '';

      if (range === 'week') {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Dilluns
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Diumenge

        startDate = startOfWeek.toISOString();
        endDate = endOfWeek.toISOString();

        labels = getCurrentWeekDates();
      } else if (range === 'month') {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        );

        startDate = startOfMonth.toISOString();
        endDate = endOfMonth.toISOString();

        labels = getCurrentMonthDates();
      } else if (range === 'custom' && customRange[0] && customRange[1]) {
        const currentDate = new Date(customRange[0]);
        const endDateObj = new Date(customRange[1]);

        startDate = customRange[0].toISOString();
        endDate = customRange[1].toISOString();

        while (currentDate <= endDateObj) {
          labels.push(
            currentDate.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            }),
          );
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      try {
        const allHistories = await fetchAllSensorHistories();

        // Filtrar dades per al `dev_eui` seleccionat
        const filteredHistories = allHistories.filter(
          (entry) => entry.dev_eui === selectedSensor.dev_eui,
        );

        if (selectedSensor.name.includes('SensorPH')) {
          // Mapar les dades de PH al format de la gràfica
          const phValues = labels.map((label) => {
            const phEntry = filteredHistories.find(
              (entry) =>
                new Date(entry.time).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                }) === label,
            );
            return phEntry ? phEntry.phi_soil : null; // Si no hi ha dades, retorna null
          });

          setChartData({
            ph: {
              labels,
              datasets: [
                {
                  label: 'PH Terra',
                  data: phValues,
                  borderColor: '#66BB6A',
                  backgroundColor: 'rgba(102, 187, 106, 0.2)',
                  showLine: true,
                },
              ],
            },
            humidity: null, // No mostrar dades d'humitat
          });
        } else if (selectedSensor.name.includes('SensorHumitat')) {
          // Mapar les dades d'humitat al format de la gràfica
          const humidityValues = labels.map((label) => {
            const humidityEntry = filteredHistories.find(
              (entry) =>
                new Date(entry.time).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                }) === label,
            );
            return humidityEntry ? humidityEntry.humidity_soil : null; // Si no hi ha dades, retorna null
          });

          setChartData({
            ph: null, // No mostrar dades de PH
            humidity: {
              labels,
              datasets: [
                {
                  label: 'Humitat Terra',
                  data: humidityValues,
                  borderColor: '#42A5F5',
                  backgroundColor: 'rgba(66, 165, 245, 0.2)',
                  showLine: true,
                },
              ],
            },
          });
        }
      } catch (error) {
        console.error('Error updating chart data:', error);
        setMsg(t('admin.pages.sensors.list.messages.error'));
      }
    }
  };

  const handleCustomRangeChange = (index: 0 | 1, date: Date | null) => {
    setCustomRange((prevRange) => {
      const newRange = [...prevRange] as [Date | null, Date | null];
      newRange[index] = date;
      return newRange;
    });

    // Actualitzar les dades quan es selecciona un rang personalitzat complet
    if (customRange[0] && customRange[1]) {
      handleRangeChange('custom');
    }
  };

  useEffect(() => {
    if (
      selectedRange === 'custom' &&
      customRange[0] &&
      customRange[1] &&
      selectedSensor
    ) {
      const startDate = customRange[0].toISOString();
      const endDate = customRange[1].toISOString();
      // fetchSensorHistoryData(selectedSensor.id, 'custom', startDate, endDate);
    }
  }, [customRange, selectedRange]);

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
          severity={
            msg === t('admin.pages.sensors.list.messages.createSuccess') ||
            msg === t('admin.pages.sensors.list.messages.deleteSuccess') ||
            msg === t('admin.pages.sensors.list.messages.updateSuccess')
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      <CrudPanel
        title={t('admin.pages.sensors.title')}
        onCreate={() => navigate('/admin/sensors/create')}>
        <DataTable
          value={sensors || []} // Assegura que `value` sempre és un array
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm"
          emptyMessage={t('admin.pages.sensors.list.noData')}>
          <Column
            field="dev_eui" // Canviat de device_eui a dev_eui
            header={t('admin.pages.sensors.list.columns.deviceEui')}
            body={(rowData) => rowData.dev_eui || 'No EUI'} // Canviat de device_eui a dev_eui
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
            field="status"
            header={t('admin.pages.sensors.list.columns.status')}
            body={(rowData) => (
              <div className="flex justify-center items-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    rowData.dev_eui && rowData.status
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                  title={
                    rowData.dev_eui && rowData.status
                      ? t('admin.status.active')
                      : t('admin.status.inactive')
                  }></span>
              </div>
            )}
          />
          <Column
            header={t('admin.pages.sensors.list.actions.label')}
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:eye" className="h-5 w-5" />}
                  className="p-button-rounded p-button-success"
                  tooltip={t('admin.pages.sensors.list.actions.view')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() => handleViewSensor(rowData.id)}
                />
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t('admin.pages.sensors.list.actions.edit')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() => handleEditClick(rowData.id)} // Utilitza la funció corregida
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t('admin.pages.sensors.list.actions.delete')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>

      <Dialog
        visible={isDialogVisible}
        style={{ width: '80vw' }}
        onHide={closeDialog}>
        <div className="p-6 bg-gray-50">
          {selectedSensor && chartData && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-center gap-4 mb-4">
                <Button
                  label={t('admin.sensors.stats.week')} // Traducción para el botón de la semana
                  onClick={() => handleRangeChange('week')}
                  className={selectedRange === 'week' ? 'p-button-primary' : ''}
                />
                <Button
                  label={t('admin.sensors.stats.month')} // Traducción para el botón del mes
                  onClick={() => handleRangeChange('month')}
                  className={
                    selectedRange === 'month' ? 'p-button-primary' : ''
                  }
                />
                <Button
                  label={t('admin.sensors.stats.custom')} // Traducción para el botón de rango personalizado
                  onClick={() => handleRangeChange('custom')}
                  className={
                    selectedRange === 'custom' ? 'p-button-primary' : ''
                  }
                />
              </div>
              {selectedRange === 'custom' && (
                <div className="flex justify-center gap-4 mb-4">
                  <Calendar
                    value={customRange[0]}
                    onChange={(e) => handleCustomRangeChange(0, e.value)}
                    placeholder={t('admin.sensors.stats.startDate')} // Traducción para la fecha de inicio
                  />
                  <Calendar
                    value={customRange[1]}
                    onChange={(e) => handleCustomRangeChange(1, e.value)}
                    placeholder={t('admin.sensors.stats.endDate')} // Traducción para la fecha de fin
                  />
                </div>
              )}
              <Chart
                type="line"
                data={
                  chartData.ph ||
                  chartData.humidity || { labels: [], datasets: [] }
                }
                options={{
                  scales: {
                    x: {
                      title: { display: true, text: 'Dates' },
                    },
                    y: {
                      title: { display: true, text: 'Values' },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
