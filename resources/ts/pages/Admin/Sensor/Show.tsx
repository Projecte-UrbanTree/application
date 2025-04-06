import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSensorByEUI } from '@/api/sensors';
import { useTranslation } from 'react-i18next';
import { PencilIcon, DevicePhoneMobileIcon, MapPinIcon, ChartBarIcon, ClockIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axiosClient from '@/api/axiosClient';

interface SensorDetails {
  id: number;
  dev_eui: string;
  device_name: string;
  [key: string]: any;
}

const ShowSensor: React.FC = () => {
  const { eui } = useParams<{ eui: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState<SensorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const sensorData = await fetchSensorByEUI(eui!);
        const backendResponse = await axiosClient.get(`/admin/sensors/eui/${eui}`);
        setSensor({
          ...sensorData,
          ...backendResponse.data,
          device_name: backendResponse.data.name || sensorData.device_name
        });
      } catch (err) {
        setError(t('admin.pages.sensors.loadError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSensor();
  }, [eui, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-4 bg-blue-100 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t('admin.pages.sensors.notFound')}</h3>
        </div>
      </div>
    );
  }

  const formatField = (key: string, value: any) => {
    if (value == null) return <span className="text-gray-400">N/A</span>;
    
    if (key.toLowerCase().includes('time') || key.toLowerCase().includes('date')) {
      return new Date(value).toLocaleString();
    }
    
    if (key === 'bat' || key === 'battery') {
      const voltage = parseFloat(value);
      let color = 'text-red-500';
      if (voltage > 3.2) color = 'text-green-600';
      else if (voltage > 2.8) color = 'text-yellow-500';
      
      return (
        <span className={`font-mono ${color}`}>
          {voltage.toFixed(2)} V
          {voltage <= 2.8 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Low
            </span>
          )}
        </span>
      );
    }
    
    if (key === 'rssi') {
      const rssiValue = parseInt(value);
      let quality = '';
      if (rssiValue >= -50) quality = 'Excellent';
      else if (rssiValue >= -60) quality = 'Good';
      else if (rssiValue >= -70) quality = 'Fair';
      else quality = 'Poor';
      
      return (
        <div>
          <span className="font-mono">{value} dBm</span>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {quality}
          </span>
        </div>
      );
    }
    
    if (key === 'snr') return `${parseFloat(value).toFixed(1)} SNR`;
    if (key === 'temp_soil') return `${value} °C`;
    if (key === 'water_soil') return `${value}%`;
    if (key === 'conductor_soil') return `${value} µS/cm`;
    if (key === 'ph1_soil') {
      const ph = parseFloat(value);
      let color = 'text-green-600';
      if (ph < 5.5) color = 'text-red-500';
      else if (ph > 7.5) color = 'text-yellow-500';
      
      return <span className={`font-mono ${color}`}>{value}</span>;
    }
    
    return value.toString();
  };

  const getGroupIcon = (groupKey: string) => {
    switch(groupKey) {
      case 'identification':
        return <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500" />;
      case 'location':
        return <MapPinIcon className="h-5 w-5 text-green-500" />;
      case 'status':
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case 'soil_measurements':
        return <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6m1.5 0h9m-9 0H7m0 0H4.5m0 0a1.5 1.5 0 010-3h15a1.5 1.5 0 010 3m-15 0h15" />
        </svg>;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const fieldGroups = {
    identification: {
      title: t('admin.pages.sensors.identification'),
      fields: ['dev_eui', 'device_name'],
      bgColor: 'bg-blue-50'
    },
    status: {
      title: t('admin.pages.sensors.status'),
      fields: ['bat', 'battery', 'rssi', 'snr', 'last_seen'],
      bgColor: 'bg-purple-50'
    },
    soil_measurements: {
      title: t('admin.pages.sensors.soilMeasurements'),
      fields: ['temp_soil', 'ph1_soil', 'water_soil', 'conductor_soil'],
      bgColor: 'bg-amber-50'
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            {t('admin.pages.sensors.backButton')}
          </button>
          
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {sensor.device_name || `Sensor ${sensor.dev_eui}`}
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(fieldGroups).map(([groupKey, group]) => {
            const fieldsToShow = group.fields.filter(field => sensor[field] !== undefined);
            
            if (fieldsToShow.length === 0) return null;
            
            return (
              <div key={groupKey} className={`${group.bgColor} rounded-xl shadow-sm overflow-hidden`}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      {getGroupIcon(groupKey)}
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-gray-900">
                      {group.title}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fieldsToShow.map((field) => (
                      <div key={field} className="bg-white p-4 rounded-lg shadow-xs border border-gray-200 hover:shadow-sm transition-shadow">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t(`admin.pages.sensors.fields.${field}`, field.replace(/_/g, ' '))}
                        </p>
                        <div className="text-lg font-medium text-gray-900">
                          {formatField(field, sensor[field])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShowSensor;