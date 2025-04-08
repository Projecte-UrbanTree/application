import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '@/api/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { fetchSensors, Sensor as ApiSensor } from '@/api/sensors';

interface Sensor {
  id: number;
  eui: string;
  name: string;
  latitude: number;
  longitude: number;
  battery?: number;
  rssi?: number;
  snr?: number;
  lastUpdated?: string;
  temp_soil?: number;
  ph1_soil?: number;
  water_soil?: number | null;
  conductor_soil?: number | null;
  tempc_ds18b20?: number;
}

const Sensors: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchAndProcessSensors = async () => {
      try {
        const backendResponse = await axiosClient.get('/admin/sensors');
        const backendSensors: Sensor[] = backendResponse.data;
        
        const apiSensors = await fetchSensors();
        
        const latestByEui: Record<string, ApiSensor> = {};
        apiSensors.forEach((sensor: ApiSensor) => {
          if (!latestByEui[sensor.dev_eui] || 
              new Date(sensor.time) > new Date(latestByEui[sensor.dev_eui].time)) {
            latestByEui[sensor.dev_eui] = sensor;
          }
        });
        
        const combinedSensors = backendSensors.map(backendSensor => {
          const apiData = latestByEui[backendSensor.eui];
          if (apiData) {
            return {
              ...backendSensor,
              battery: apiData.bat,
              rssi: apiData.rssi,
              snr: apiData.snr,
              lastUpdated: apiData.time,
              temp_soil: apiData.temp_soil,
              ph1_soil: apiData.ph1_soil,
              water_soil: apiData.water_soil,
              conductor_soil: apiData.conductor_soil,
              tempc_ds18b20: apiData.tempc_ds18b20
            };
          }
          return backendSensor;
        });
        
        setSensors(combinedSensors);
      } catch (err) {
        toast.current?.show({ severity: 'error', summary: t('Error'), detail: t('admin.pages.sensors.loadError'), life: 4000 });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndProcessSensors();
  }, [t]);

  useEffect(() => {
    if (location.state?.success) {
      toast.current?.show({ severity: 'success', summary: t('Success'), detail: location.state.success, life: 4000 });
    }
  }, [location.state, t]);

  const handleDelete = async (sensorId: number) => {
    if (!window.confirm(t('admin.pages.sensors.list.messages.deleteConfirm'))) return;
    try {
      await axiosClient.delete(`/admin/sensors/${sensorId}`);
      setSensors(sensors.filter((sensor) => sensor.id !== sensorId));
      toast.current?.show({ severity: 'success', summary: t('Success'), detail: t('admin.pages.sensors.list.messages.deletedSuccess'), life: 4000 });
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: t('Error'), detail: t('admin.pages.sensors.list.messages.deleteError'), life: 4000 });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <>
      <Toast ref={toast} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('admin.pages.sensors.title')}
          </h1>
          <button
            onClick={() => navigate('/admin/sensors/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            {t('admin.pages.sensors.form.title.create')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <span className="text-blue-600 text-xl">📡</span>
                    </div>
                    <div>
                      <h2
                        className="font-semibold text-gray-800 cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/sensors/${sensor.eui}`)}>
                        {sensor.name || `Sensor ${sensor.id}`}
                      </h2>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/sensors/edit/${sensor.id}`)}
                      className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title={t('admin.pages.sensors.form.title.edit')}>
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sensor.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      title={t('admin.pages.sensors.form.title.delete')}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Device Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">DevEUI:</span>
                    <span className="text-gray-700 font-mono text-xs truncate max-w-[120px]">
                      {sensor.eui}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Última actualización:</span>
                    <span className="text-gray-700 text-xs">
                      {sensor.lastUpdated ? new Date(sensor.lastUpdated).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Status indicators - Always shown */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Batería</p>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        sensor.battery && sensor.battery > 3.2 ? 'bg-green-500' : 
                        sensor.battery && sensor.battery > 2.8 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-gray-600">{sensor.battery ? `${sensor.battery.toFixed(2)} V` : '-- V'}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Señal</p>
                    <p className="text-gray-600">
                      {sensor.rssi ? `${sensor.rssi} dBm` : '-- dBm'}
                      {sensor.snr ? ` (${sensor.snr.toFixed(1)} SNR)` : ''}
                    </p>
                  </div>
                </div>

                {/* Soil Measurements - Flexible Layout */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {sensor.temp_soil && (
                    <div className="bg-gray-50 p-3 rounded-lg flex-1 min-w-[45%]">
                      <p className="text-xs text-gray-500 mb-1">Temperatura Suelo</p>
                      <p className="text-gray-700">{`${sensor.temp_soil.toFixed(1)} °C`}</p>
                    </div>
                  )}
                  {sensor.tempc_ds18b20 !== undefined && sensor.tempc_ds18b20 !== null && (
                    <div className="bg-gray-50 p-3 rounded-lg flex-1 min-w-[45%]">
                      <p className="text-xs text-gray-500 mb-1">Temperatura Aire</p>
                      <p className="text-gray-700">{`${Number(sensor.tempc_ds18b20).toFixed(1)} °C`}</p>
                    </div>
                  )}
                  {sensor.ph1_soil && (
                    <div className="bg-gray-50 p-3 rounded-lg flex-1 min-w-[45%]">
                      <p className="text-xs text-gray-500 mb-1">pH</p>
                      <p className="text-gray-700">{sensor.ph1_soil.toFixed(2)}</p>
                    </div>
                  )}
                  {sensor.water_soil && (
                    <div className="bg-gray-50 p-3 rounded-lg flex-1 min-w-[45%]">
                      <p className="text-xs text-gray-500 mb-1">Humedad</p>
                      <p className="text-gray-700">{`${sensor.water_soil.toFixed(1)}%`}</p>
                    </div>
                  )}
                  {sensor.conductor_soil && (
                    <div className="bg-gray-50 p-3 rounded-lg flex-1 min-w-[45%]">
                      <p className="text-xs text-gray-500 mb-1">Conductividad</p>
                      <p className="text-gray-700">{`${sensor.conductor_soil.toFixed(1)} µS/cm`}</p>
                    </div>
                  )}
                </div>

                {/* Location - Fixed Layout */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Latitud</p>
                    <p className="text-gray-700">{sensor.latitude}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Longitud</p>
                    <p className="text-gray-700">{sensor.longitude}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sensors;