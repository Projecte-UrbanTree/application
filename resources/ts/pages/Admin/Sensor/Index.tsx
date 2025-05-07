import React, { useEffect, useState } from 'react';
import axiosClient from '@/api/axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { fetchSensors, Sensor as ApiSensor } from '@/api/sensors';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Icon } from '@iconify/react';
import { Tag } from 'primereact/tag';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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
}

const Sensors: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  useEffect(() => {
    const fetchAndProcessSensors = async () => {
      try {
        const backendResponse = await axiosClient.get('/admin/sensors', {
          params: { contract_id: currentContract?.id || 0 },
        });
        const backendSensors: Sensor[] = backendResponse.data;

        const apiSensors = await fetchSensors();

        const latestByEui: Record<string, ApiSensor> = {};
        apiSensors.forEach((sensor: ApiSensor) => {
          if (
            !latestByEui[sensor.dev_eui] ||
            new Date(sensor.time) > new Date(latestByEui[sensor.dev_eui].time)
          ) {
            latestByEui[sensor.dev_eui] = sensor;
          }
        });

        const combinedSensors = backendSensors.map((backendSensor) => {
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
            };
          }
          return backendSensor;
        });

        setSensors(combinedSensors);
      } catch (err) {
        setError(t('admin.pages.sensors.loadError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessSensors();
  }, [t, currentContract]);

  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(t(location.state.success));
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [location.state, t]);

  const handleDelete = async (sensorId: number) => {
    if (!window.confirm(t('admin.pages.sensors.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/sensors/${sensorId}`);
      setSensors(sensors.filter((sensor) => sensor.id !== sensorId));
      setSuccessMessage(t('admin.pages.sensors.list.messages.deletedSuccess'));
    } catch (error) {
      console.error(error);
      setError(t('admin.pages.sensors.list.messages.deleteError'));
    }
  };

  const getBatterySeverity = (voltage?: number) => {
    if (!voltage) return 'warning';
    if (voltage >= 3.6) return 'success';
    if (voltage >= 3.3) return 'warning';
    return 'danger';
  };

  const getSignalSeverity = (rssi?: number) => {
    if (!rssi) return 'warning';
    if (rssi >= -70) return 'success';
    if (rssi >= -85) return 'warning';
    return 'danger';
  };

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 shadow-sm">
        <div className="flex items-center">
          <Icon icon="tabler:alert-circle" className="mr-2 text-xl" />
          <span>{error}</span>
        </div>
        <Button
          label={t('common.tryAgain')}
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          onClick={() => window.location.reload()}
          className="mt-3"
        />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Icon
            icon="tabler:device-analytics"
            className="text-2xl text-indigo-600"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            {t('admin.pages.sensors.title.title')}
          </h1>
        </div>
        <Button
          label={t('admin.pages.sensors.form.title.create')}
          icon="pi pi-plus"
          onClick={() => navigate('/admin/sensors/create')}
          className="mt-2"
        />
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200 shadow-sm flex items-center">
          <Icon icon="tabler:circle-check" className="mr-2 text-xl" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((sensor) => (
          <Card
            key={sensor.id}
            className="border border-gray-300 bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
            pt={{ root: { className: 'p-0' } }}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Icon
                      icon="tabler:device-analytics"
                      className="text-indigo-600 text-xl"
                    />
                  </div>
                  <div>
                    <h2
                      className="font-semibold text-gray-800 cursor-pointer hover:text-indigo-600"
                      onClick={() => navigate(`/admin/sensors/${sensor.eui}`)}>
                      {sensor.name ||
                        t('admin.pages.sensors.list.sensorDefaultName', {
                          id: sensor.id,
                        })}
                    </h2>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    severity="info"
                    text
                    tooltip={t('admin.pages.sensors.form.title.edit')}
                    tooltipOptions={{ position: 'left' }}
                    onClick={() => navigate(`/admin/sensors/edit/${sensor.id}`)}
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    severity="danger"
                    text
                    tooltip={t('admin.pages.sensors.form.title.delete')}
                    tooltipOptions={{ position: 'left' }}
                    onClick={() => handleDelete(sensor.id)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Icon icon="tabler:id" className="text-gray-400" />
                    {t('admin.pages.sensors.list.devEUI')}:
                  </span>
                  <Tag
                    value={sensor.eui}
                    className="font-mono text-xs bg-gray-100 text-gray-700"
                  />
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Icon icon="tabler:clock" className="text-gray-400" />
                    {t('admin.pages.sensors.list.lastUpdate')}:
                  </span>
                  <span className="text-gray-700 text-xs">
                    {sensor.lastUpdated
                      ? new Date(sensor.lastUpdated).toLocaleString()
                      : t('admin.pages.sensors.list.notAvailable')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    {t('admin.pages.sensors.list.battery')}
                  </p>
                  <div className="flex items-center">
                    <Tag
                      severity={getBatterySeverity(sensor.battery)}
                      icon="pi pi-bolt"
                      value={
                        sensor.battery
                          ? `${sensor.battery.toFixed(2)} V`
                          : t('admin.pages.sensors.list.noValueUnit', {
                              unit: 'V',
                            })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    {t('admin.pages.sensors.list.signal')}
                  </p>
                  <Tag
                    severity={getSignalSeverity(sensor.rssi)}
                    icon="pi pi-wifi"
                    value={
                      sensor.rssi
                        ? `${sensor.rssi} dBm`
                        : t('admin.pages.sensors.list.noValueUnit', {
                            unit: 'dBm',
                          })
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {sensor.temp_soil !== undefined && sensor.temp_soil !== null && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('admin.pages.sensors.list.temperature')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:temperature"
                        className="text-red-500 mr-1"
                      />
                      <span className="text-gray-700">{`${sensor.temp_soil} °C`}</span>
                    </div>
                  </div>
                )}
                {sensor.water_soil !== undefined &&
                  sensor.water_soil !== null && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">
                        {t('admin.pages.sensors.list.moisture')}
                      </p>
                      <div className="flex items-center">
                        <Icon
                          icon="tabler:droplet"
                          className="text-blue-500 mr-1"
                        />
                        <span className="text-gray-700">{`${sensor.water_soil}%`}</span>
                      </div>
                    </div>
                  )}
                {sensor.conductor_soil !== undefined &&
                  sensor.conductor_soil !== null && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">
                        {t('admin.pages.sensors.list.conductor')}
                      </p>
                      <div className="flex items-center">
                        <Icon
                          icon="tabler:current"
                          className="text-green-500 mr-1"
                        />
                        <span className="text-gray-700">{`${sensor.conductor_soil} mS/cm`}</span>
                      </div>
                    </div>
                  )}
                {sensor.ph1_soil !== undefined && sensor.ph1_soil !== null && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('admin.pages.sensors.list.ph')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:ph"
                        className="text-yellow-500 mr-1"
                      />
                      <span className="text-gray-700">{`${sensor.ph1_soil} pH`}</span>
                    </div>
                  </div>
                )}
                {sensor.snr !== undefined && sensor.snr !== null && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('admin.pages.sensors.list.snr')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:wave-sine"
                        className="text-purple-500 mr-1"
                      />
                      <span className="text-gray-700">{`${sensor.snr} dB`}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                <Button
                  label={t('admin.pages.sensors.list.viewHistory')}
                  icon="pi pi-chart-line"
                  severity="secondary"
                  text
                  onClick={() => navigate(`/admin/sensors/${sensor.eui}`)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sensors.length === 0 && !loading && !error && (
        <Card className="border border-blue-300 bg-blue-50">
          <div className="flex flex-col items-center gap-3 p  y-8">
            <Icon
              icon="tabler:device-desktop-off"
              className="text-blue-500 text-4xl"
            />
            <h3 className="text-center text-blue-700 font-medium">
              {t('admin.pages.sensors.list.noSensors')}
            </h3>
            <Button
              label={t('admin.pages.sensors.form.title.create')}
              icon="pi pi-plus"
              onClick={() => navigate('/admin/sensors/create')}
              className="mt-2"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Sensors;
