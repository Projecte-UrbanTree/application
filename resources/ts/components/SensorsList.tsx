import { useEffect, useState } from 'react';
import { Sensor, fetchSensors } from '../api/sensors';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export const SensorList = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSensors, setExpandedSensors] = useState<
    Record<string, boolean>
  >({});

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

  // Función para alternar el historial
  const toggleHistory = (deviceName: string) => {
    setExpandedSensors((prev) => ({
      ...prev,
      [deviceName]: !prev[deviceName],
    }));
  };

  if (loading) return <div className="text-center py-8">Cargando datos...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  // Ordenar sensores por DevEUI
  const sortedSensors = [...sensors].sort((a, b) =>
    (a.dev_eui || '').localeCompare(b.dev_eui || ''),
  );

  // Agrupar por dispositivo y ordenar el historial por fecha
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
        variableReadings: Array<
          Pick<
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
          >
        >;
      }
    >,
  );

  // Ordenar el historial por fecha dentro de cada dispositivo
  Object.values(groupedSensors).forEach((sensorData) => {
    sensorData.variableReadings.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Monitorización en Tiempo Real</h1>

      {Object.entries(groupedSensors).map(([deviceName, sensorData]) => (
        <div key={deviceName} className="mb-8 bg-gray-50 p-4 rounded-lg">
          {/* Sección de Datos Fijos */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1 flex items-center">
                  📡 {deviceName}
                </h2>
                <p className="text-sm text-gray-500">
                  Última actualización:{' '}
                  {new Date(
                    sensorData.variableReadings[0].time,
                  ).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => toggleHistory(deviceName)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                {expandedSensors[deviceName] ? (
                  <>
                    <ChevronUpIcon className="w-4 h-4 mr-1" />
                    Ocultar historial
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="w-4 h-4 mr-1" />
                    Ver historial ({sensorData.variableReadings.length - 1})
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {/* Columna 1: Identificación */}
              <div>
                <h3 className="font-medium text-gray-600 mb-2">
                  Identificación
                </h3>
                <p>
                  <span className="font-medium">DevEUI:</span>{' '}
                  {sensorData.fixedData.dev_eui}
                </p>
                <p>
                  <span className="font-medium">DevAddr:</span>{' '}
                  {sensorData.fixedData.dev_addr}
                </p>
              </div>

              {/* Columna 2: Ubicación y Configuración */}
              <div>
                <h3 className="font-medium text-gray-600 mb-2">Ubicación</h3>
                <p>
                  📍 {sensorData.fixedData.latitude},{' '}
                  {sensorData.fixedData.longitude}
                </p>
              </div>
            </div>
          </div>

          {/* Lectura más reciente (siempre visible) */}
          <div className="mb-3 bg-white p-4 rounded-lg shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
            <h3 className="font-medium text-gray-700 mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              ÚLTIMA LECTURA
            </h3>
            <ReadingDetails reading={sensorData.variableReadings[0]} />
          </div>

          {/* Historial (colapsable) */}
          {expandedSensors[deviceName] && (
            <div className="space-y-3">
              <h3 className="text-gray-600 font-medium">
                📜 Historial anterior
              </h3>
              {sensorData.variableReadings.slice(1).map((reading, index) => (
                <div
                  key={`${deviceName}-${index}`}
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

// Componente auxiliar para mostrar los detalles de lectura
const ReadingDetails = ({ reading }: { reading: any }) => (
  <div className="space-y-2">
    <p className="text-sm text-gray-500">
      ⏱ {new Date(reading.time).toLocaleString()}
    </p>

    <div className="flex justify-between">
      <span className="font-medium">🔋 Batería:</span>
      <span className={reading.bat < 3 ? 'text-red-500' : 'text-green-500'}>
        {reading.bat}V
      </span>
    </div>

    <div className="flex justify-between">
      <span className="font-medium">📶 Señal:</span>
      <span>
        RSSI: {reading.rssi}dBm | SNR: {reading.snr}
      </span>
    </div>

    <div className="mt-2 pt-2 border-t border-gray-100">
      <p className="font-medium text-gray-600 mb-1">🌱 Datos del suelo:</p>
      <p>🌡 Temp: {reading.temp_soil}°C</p>
      <p>🧪 pH: {reading.ph1_soil}</p>
      {reading.water_soil && <p>💧 Humedad: {reading.water_soil}%</p>}
      {reading.conductor_soil && (
        <p>⚡ Conductividad: {reading.conductor_soil}µS/cm</p>
      )}
    </div>
  </div>
);
