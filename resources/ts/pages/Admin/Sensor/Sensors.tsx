import React, { useEffect, useState } from 'react';
import { Sensor, fetchSensors } from '@/api/sensors';
import { PencilIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const Sensors: React.FC = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSensors = async () => {
      try {
        const data = await fetchSensors();
        setSensors(data);
      } catch (err) {
        setError('Error al cargar los sensores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSensors();
  }, []);

  if (loading) return <div className="text-center py-8">Cargando datos...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  const groupedSensors = sensors.reduce(
    (acc, sensor) => {
      const key = sensor.device_name || sensor.id.toString();
      if (!acc[key]) {
        acc[key] = {
          id: sensor.id,
          device_name: sensor.device_name,
          dev_eui: sensor.dev_eui,
          lastReading: {
            time: sensor.time,
            temp_soil: sensor.temp_soil,
            ph1_soil: sensor.ph1_soil,
            water_soil: sensor.water_soil,
            conductor_soil: sensor.conductor_soil,
            bat: sensor.bat,
            rssi: sensor.rssi,
            snr: sensor.snr,
          },
          location: {
            latitude: sensor.latitude,
            longitude: sensor.longitude,
          },
        };
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const handleEdit = (sensorId: number) => {
    navigate(`/admin/sensors/edit/${sensorId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Monitorización de Sensores
        </h1>
        <button
          onClick={() => navigate('/admin/sensors/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Crear Sensor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(groupedSensors).map(([deviceName, sensorData]) => (
          <div
            key={deviceName}
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
                      {deviceName}
                    </h2>
                    <p className="text-xs text-gray-500">ID: {sensorData.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(sensorData.id)}
                  className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                  aria-label="Editar sensor">
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Last reading info */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">Última lectura:</span>
                  <span className="text-gray-700">
                    {new Date(sensorData.lastReading.time).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">DevEUI:</span>
                  <span className="text-gray-700 font-mono text-xs truncate max-w-[120px]">
                    {sensorData.dev_eui}
                  </span>
                </div>
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Batería</p>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${sensorData.lastReading.bat < 3 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span
                      className={
                        sensorData.lastReading.bat < 3
                          ? 'text-red-600'
                          : 'text-green-600'
                      }>
                      {sensorData.lastReading.bat}V
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Señal</p>
                  <p className="text-gray-700">
                    {sensorData.lastReading.rssi} dBm
                  </p>
                </div>
              </div>

              {/* Soil data */}
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Datos del suelo
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Temperatura</p>
                    <p className="text-gray-700">
                      {sensorData.lastReading.temp_soil}°C
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">pH</p>
                    <p className="text-gray-700">
                      {sensorData.lastReading.ph1_soil}
                    </p>
                  </div>
                  {sensorData.lastReading.water_soil && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Humedad</p>
                      <p className="text-gray-700">
                        {sensorData.lastReading.water_soil}%
                      </p>
                    </div>
                  )}
                  {sensorData.lastReading.conductor_soil && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Conductividad
                      </p>
                      <p className="text-gray-700">
                        {sensorData.lastReading.conductor_soil} µS/cm
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                <p className="text-gray-700 text-sm">
                  {sensorData.location.latitude.toFixed(6)},{' '}
                  {sensorData.location.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sensors;
