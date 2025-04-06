import React, { useEffect, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface Sensor {
  id: number;
  eui: string;
  name: string;
  latitude: number;
  longitude: number;
}

const Sensors: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await axiosClient.get('/admin/sensors');
        setSensors(response.data);
      } catch (err) {
        setError(t('admin.pages.sensors.loadError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSensors();
  }, []);

  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success);
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleDelete = async (sensorId: number) => {
    if (!window.confirm(t('admin.pages.sensors.deleteConfirm'))) return;
    try {
      await axiosClient.delete(`/admin/sensors/${sensorId}`);
      setSensors(sensors.filter((sensor) => sensor.id !== sensorId));
      setSuccessMessage(t('admin.pages.sensors.deletedSuccess'));
    } catch (error) {
      console.error(error);
      setError(t('admin.pages.sensors.deleteError'));
    }
  };

  if (loading) return <div className="text-center py-8">{t('admin.pages.sensors.loading')}</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {t('admin.pages.sensors.title')}
        </h1>
        <button
          onClick={() => navigate('/admin/sensors/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('admin.pages.sensors.createButton')}
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

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
                    <h2 className="font-semibold text-gray-800">
                      {sensor.name || `Sensor ${sensor.id}`}
                    </h2>
                    <p className="text-xs text-gray-500">ID: {sensor.id}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/sensors/edit/${sensor.id}`)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title={t('admin.pages.sensors.editButton')}>
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sensor.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title={t('admin.pages.sensors.deleteButton')}>
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
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Batería</p>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full mr-2 bg-gray-300"></span>
                    <span className="text-gray-600">-- V</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Señal</p>
                  <p className="text-gray-600">-- dBm</p>
                </div>
              </div>

              {/* Location */}
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

              {/* Additional Info Placeholder */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Estado</p>
                <p className="text-gray-700">Activo</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sensors;