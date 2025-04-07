import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSensorByEUI, Sensor } from '@/api/sensors';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';

const SensorHistory: React.FC = () => {
  const { t } = useTranslation();
  const { eui } = useParams<{ eui: string }>();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSensorHistory = async () => {
      try {
        if (!eui) {
          throw new Error('Sensor EUI is missing');
        }
        
        const data = await fetchSensorByEUI(eui);
        setSensorData(Array.isArray(data) ? data : []); // Ensure sensorData is always an array
      } catch (err) {
        console.error('Error loading sensor history:', err);
        setError(t('admin.pages.sensors.history.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadSensorHistory();
  }, [eui, t]);

  const prepareChartData = () => {
    if (!Array.isArray(sensorData)) {
      console.error('sensorData is not an array:', sensorData);
      return [];
    }
    return sensorData.map(item => ({
      time: format(parseISO(item.time), 'MMM dd HH:mm'),
      temp_soil: item.temp_soil,
      ph1_soil: item.ph1_soil,
      water_soil: item.water_soil,
      conductor_soil: item.conductor_soil,
      bat: item.bat,
      rssi: item.rssi,
      snr: item.snr
    })).reverse(); // Reverse to show chronological order
  };

  if (loading) return <div className="text-center py-8">{t('admin.pages.sensors.loading')}</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!sensorData.length) return <div className="text-center py-8">{t('admin.pages.sensors.history.noData')}</div>;

  // Removed unused chartData declaration

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← {t('admin.pages.sensors.history.back')}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {t('admin.pages.sensors.history.title')} {eui}
        </h1>

        {/* Sensor History */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorData.map((entry, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {format(parseISO(entry.time), 'MMM dd, yyyy HH:mm')}
              </h3>
              <ul className="space-y-1">
                <li><strong>{t('admin.pages.sensors.history.metrics.temp_soil')}:</strong> {entry.temp_soil} °C</li>
                <li><strong>{t('admin.pages.sensors.history.metrics.ph1_soil')}:</strong> {entry.ph1_soil} pH</li>
                <li><strong>{t('admin.pages.sensors.history.metrics.water_soil')}:</strong> {entry.water_soil ?? 'N/A'}%</li>
                <li><strong>{t('admin.pages.sensors.history.metrics.conductor_soil')}:</strong> {entry.conductor_soil ?? 'N/A'} µS/cm</li>
                <li><strong>{t('admin.pages.sensors.history.metrics.bat')}:</strong> {entry.bat.toFixed(2)} V</li>
                <li><strong>{t('admin.pages.sensors.history.metrics.rssi')}:</strong> {entry.rssi} dBm</li>
                <li><strong>{t('admin.pages.sensors.history.metrics.snr')}:</strong> {entry.snr} dB</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensorHistory;