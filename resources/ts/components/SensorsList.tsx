import React, { useEffect, useState } from 'react';
import { Sensor, fetchSensors } from '../api/sensors';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

type Reading = Pick<
  Sensor,
  | 'time'
  | 'temp_soil'
  | 'tempc_ds18b20'
  | 'ph1_soil'
  | 'water_soil'
  | 'conductor_soil'
  | 'bat'
  | 'rssi'
  | 'snr'
>;

interface Sensor {
  id: number;
  device_name?: string;
  dev_eui?: string;
  dev_addr?: string;
  latitude?: number;
  longitude?: number;
  modulation?: string;
  time: string;
  temp_soil?: number;
  tempc_ds18b20?: number;
  ph1_soil?: number;
  water_soil?: number;
  conductor_soil?: number;
  bat?: number;
  rssi?: number;
  snr?: number;
}

export const SensorList = () => {
  const { t } = useTranslation();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSensors, setExpandedSensors] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const loadSensors = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSensors();
        setSensors(data);
      } catch (err) {
        setError(t('sensors.monitoring.loadError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSensors();
  }, [t]);

  const toggleHistory = (deviceName: string) => {
    setExpandedSensors((prev) => ({
      ...prev,
      [deviceName]: !prev[deviceName],
    }));
  };

  if (loading) return <div className="text-center py-8">{t('sensors.monitoring.loading')}</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  const sortedSensors = [...sensors].sort((a, b) =>
    (a.dev_eui || '').localeCompare(b.dev_eui || ''),
  );

  const groupedSensors = sortedSensors.reduce(
    (acc, sensor) => {
      const key = sensor.device_name || sensor.id.toString();
      if (!acc[key]) {
        acc[key] = {
          fixedData: {
            id: sensor.id,
            dev_eui: sensor.dev_eui,
            dev_addr: sensor.dev_addr,
            latitude: sensor.latitude,
            longitude: sensor.longitude,
            modulation: sensor.modulation,
          },
          variableReadings: [],
        };
      }
      acc[key].variableReadings.push({
        time: sensor.time,
        temp_soil: sensor.temp_soil,
        tempc_ds18b20: sensor.tempc_ds18b20,
        ph1_soil: sensor.ph1_soil,
        water_soil: sensor.water_soil,
        conductor_soil: sensor.conductor_soil,
        bat: sensor.bat,
        rssi: sensor.rssi,
        snr: sensor.snr,
      });
      return acc;
    },
    {} as Record<
      string,
      {
        fixedData: Pick<
          Sensor,
          | 'id'
          | 'dev_eui'
          | 'dev_addr'
          | 'latitude'
          | 'longitude'
          | 'modulation'
        >;
        variableReadings: Array<x>;
      }
    >,
  );

  Object.values(groupedSensors).forEach((sensorData) => {
    sensorData.variableReadings.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('sensors.monitoring.title')}</h1>

      {Object.entries(groupedSensors).map(([deviceName, sensorData]) => (
        <div key={deviceName} className="mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1 flex items-center">
                  📡 {deviceName}
                </h2>
                {sensorData.variableReadings.length > 0 && (
                   <p className="text-sm text-gray-500">
                     {t('sensors.monitoring.lastUpdateLabel')}{' '}
                     {new Date(
                       sensorData.variableReadings[0].time,
                     ).toLocaleString()}
                   </p>
                )}
              </div>
              {sensorData.variableReadings.length > 1 && (
                  <button
                    onClick={() => toggleHistory(deviceName)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                    {expandedSensors[deviceName] ? (
                      <>
                        <ChevronUpIcon className="w-4 h-4 mr-1" />
                        {t('sensors.monitoring.history.hide')}
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="w-4 h-4 mr-1" />
                        {t('sensors.monitoring.history.show', { count: sensorData.variableReadings.length - 1 })}
                      </>
                    )}
                  </button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <h3 className="font-medium text-gray-600 mb-2">
                  {t('sensors.identification')}
                </h3>
                <p>
                  <span className="font-medium">{t('sensors.monitoring.labels.dev_eui')}</span>{' '}
                  {sensorData.fixedData.dev_eui || '-'}
                </p>
                <p>
                  <span className="font-medium">{t('sensors.monitoring.labels.dev_addr')}</span>{' '}
                  {sensorData.fixedData.dev_addr || '-'}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-600 mb-2">{t('sensors.monitoring.locationTitle')}</h3>
                <p>
                  📍
                  {sensorData.fixedData.latitude !== undefined ? sensorData.fixedData.latitude : '-'},{' '}
                  {sensorData.fixedData.longitude !== undefined ? sensorData.fixedData.longitude : '-'}
                </p>
              </div>
            </div>
          </div>

           {sensorData.variableReadings.length > 0 && (
             <div className="mb-3 bg-white p-4 rounded-lg shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  {t('sensors.monitoring.latestReadingTitle')}
                </h3>
                <ReadingDetails reading={sensorData.variableReadings[0]} />
             </div>
           )}

          {expandedSensors[deviceName] && sensorData.variableReadings.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-gray-600 font-medium">
                📜 {t('sensors.monitoring.history.title')}
              </h3>
              {sensorData.variableReadings.slice(1).map((reading, index) => (
                <div
                  key={`${deviceName}-${reading.time}-${index}`}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <ReadingDetails reading={reading} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ReadingDetails = ({ reading }: { reading: Reading }) => {
  const { t } = useTranslation();

  const formatValue = (value: number | undefined | null, unitKey?: string): string => {
      if (value === undefined || value === null) return '-';
      const unit = unitKey ? t(unitKey) : '';
      return `${value}${unit}`;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">
        {t('sensors.monitoring.labels.readingTime')} {new Date(reading.time).toLocaleString()}
      </p>

      <div className="flex justify-between">
        <span className="font-medium">🔋 {t('sensors.monitoring.labels.battery')}</span>
        {reading.bat !== undefined ? (
            <span className={reading.bat < 3 ? 'text-red-500' : 'text-green-500'}>
             {formatValue(reading.bat, 'sensors.monitoring.units.voltage')}
            </span>
        ) : (
            <span>-</span>
        )}
      </div>

      <div className="flex justify-between">
        <span className="font-medium">📶 {t('sensors.monitoring.labels.signal')}</span>
        {(reading.rssi !== undefined && reading.snr !== undefined) ? (
            <span>
             {t('sensors.monitoring.signalFormat', { rssi: reading.rssi, snr: reading.snr })}
            </span>
        ) : (
            <span>-</span>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="font-medium text-gray-600 mb-1">🌱 {t('sensors.monitoring.soilDataTitle')}</p>
        <p>🌡 {t('sensors.monitoring.labels.temp_soil')} {formatValue(reading.temp_soil, 'sensors.monitoring.units.celsius')}</p>
        <p>🧪 {t('sensors.monitoring.labels.ph_soil')} {formatValue(reading.ph1_soil)}</p>
        {reading.water_soil !== undefined && <p>💧 {t('sensors.monitoring.labels.water_soil')} {formatValue(reading.water_soil, 'sensors.monitoring.units.percent')}</p>}
        {reading.conductor_soil !== undefined && <p>⚡ {t('sensors.monitoring.labels.conductivity_soil')} {formatValue(reading.conductor_soil, 'sensors.monitoring.units.microsiemens_per_cm')}</p>}
      </div>
    </div>
  );
};