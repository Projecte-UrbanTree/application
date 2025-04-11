import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Sensor, fetchSensors } from '../api/sensors';
import { useTranslation } from 'react-i18next';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';

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

type FixedSensorData = Pick<
  Sensor,
  'id' | 'dev_eui' | 'dev_addr' | 'latitude' | 'longitude' | 'modulation'
>;

interface GroupedSensor {
  fixedData: FixedSensorData;
  variableReadings: Reading[];
}

export const SensorList = () => {
  const { t } = useTranslation();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<any>({});
  const [groupedSensorsList, setGroupedSensorsList] = useState<any[]>([]);

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

  const groupedSensors = useMemo(() => {
    if (!sensors.length) return {};

    // Sort sensors by EUI
    const sortedSensors = [...sensors].sort((a, b) =>
      (a.dev_eui || '').localeCompare(b.dev_eui || ''),
    );

    // Group by device name or ID
    return sortedSensors.reduce(
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
      {} as Record<string, GroupedSensor>,
    );
  }, [sensors]);

  // Process groups into a flat list for DataTable
  useEffect(() => {
    const sensorsList = [];

    for (const [deviceName, sensorData] of Object.entries(groupedSensors)) {
      // Sort readings by time in descending order (newest first)
      sensorData.variableReadings.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      );

      // Use most recent reading as the main row data
      if (sensorData.variableReadings.length > 0) {
        const latestReading = sensorData.variableReadings[0];
        sensorsList.push({
          deviceName,
          ...sensorData.fixedData,
          ...latestReading,
          allReadings: sensorData.variableReadings,
        });
      }
    }

    setGroupedSensorsList(sensorsList);
  }, [groupedSensors]);

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

  const formatValue = (
    value: number | undefined | null,
    unit: string = '',
  ): string => {
    if (value === undefined || value === null) return '-';
    return `${value}${unit}`;
  };

  const batteryTemplate = (rowData: any) => (
    <Tag
      severity={getBatterySeverity(rowData.bat)}
      value={formatValue(rowData.bat, 'V')}
    />
  );

  const signalTemplate = (rowData: any) => (
    <Tag
      severity={getSignalSeverity(rowData.rssi)}
      value={`${rowData.rssi || '-'} dBm / SNR: ${rowData.snr || '-'}`}
    />
  );

  const temperatureTemplate = (rowData: any) => (
    <div className="flex items-center gap-2">
      <Icon icon="tabler:temperature" className="text-red-500" />
      <span>{formatValue(rowData.temp_soil, '°C')}</span>
    </div>
  );

  const moistureTemplate = (rowData: any) => (
    <div className="flex items-center gap-2">
      <Icon icon="tabler:droplet" className="text-blue-500" />
      <span>{formatValue(rowData.water_soil, '%')}</span>
    </div>
  );

  const latestTimeTemplate = (rowData: any) => (
    <div className="flex items-center gap-2">
      <Icon icon="tabler:clock" className="text-gray-500" />
      <span>{new Date(rowData.time).toLocaleString()}</span>
    </div>
  );

  const locationTemplate = (rowData: any) => (
    <div className="flex items-center gap-2">
      <Icon icon="tabler:map-pin" className="text-gray-500" />
      <span>
        {rowData.latitude !== undefined ? rowData.latitude.toFixed(6) : '-'},
        {rowData.longitude !== undefined ? rowData.longitude.toFixed(6) : '-'}
      </span>
    </div>
  );

  const nameTemplate = (rowData: any) => (
    <div className="flex items-center gap-2">
      <Icon icon="tabler:device-analytics" className="text-indigo-600" />
      <span className="font-medium">{rowData.deviceName}</span>
    </div>
  );

  const rowExpansionTemplate = (data: any) => {
    return (
      <div className="p-4 bg-gray-50">
        <h3 className="text-gray-700 font-medium flex items-center gap-2 mb-3">
          <Icon icon="tabler:history" className="text-indigo-600" />
          {t('sensors.monitoring.history.title')}
        </h3>

        {data.allReadings.length > 1 ? (
          <div className="space-y-4">
            {data.allReadings.slice(1).map((reading: Reading, idx: number) => (
              <Card
                key={`${data.deviceName}-${reading.time}-${idx}`}
                className="bg-white shadow-sm">
                <div className="text-sm text-gray-500 mb-3">
                  {new Date(reading.time).toLocaleString()}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('sensors.monitoring.labels.temp_soil')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:temperature"
                        className="text-red-500 mr-2"
                      />
                      <span className="text-gray-700">
                        {formatValue(reading.temp_soil, '°C')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('sensors.monitoring.labels.ph_soil')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:flask"
                        className="text-purple-500 mr-2"
                      />
                      <span className="text-gray-700">
                        {formatValue(reading.ph1_soil)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('sensors.monitoring.labels.battery')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:battery"
                        className="text-green-500 mr-2"
                      />
                      <span className="text-gray-700">
                        {formatValue(reading.bat, 'V')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      {t('sensors.monitoring.labels.signal')}
                    </p>
                    <div className="flex items-center">
                      <Icon
                        icon="tabler:signal"
                        className="text-blue-500 mr-2"
                      />
                      <span className="text-gray-700">
                        {reading.rssi ? `${reading.rssi} dBm` : '-'} /{' '}
                        {reading.snr ? `SNR: ${reading.snr}` : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            {t('sensors.monitoring.history.noData')}
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
          animationDuration=".5s"
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
            {t('sensors.monitoring.title')}
          </h1>
        </div>
      </div>

      {groupedSensorsList.length === 0 ? (
        <Card className="border border-blue-300 bg-blue-50">
          <div className="flex flex-col items-center gap-3 py-8">
            <Icon
              icon="tabler:device-desktop-off"
              className="text-blue-500 text-4xl"
            />
            <h3 className="text-center text-blue-700 font-medium">
              {t('sensors.monitoring.noSensors')}
            </h3>
          </div>
        </Card>
      ) : (
        <DataTable
          value={groupedSensorsList}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="dev_eui"
          paginator
          rows={10}
          stripedRows
          showGridlines
          emptyMessage={t('sensors.monitoring.noSensors')}
          className="p-datatable-sm">
          <Column expander style={{ width: '3rem' }} />
          <Column
            field="deviceName"
            header={t('admin.pages.sensors.fields.device_name')}
            body={nameTemplate}
            sortable
          />
          <Column
            field="dev_eui"
            header={t('admin.pages.sensors.fields.dev_eui')}
            sortable
          />
          <Column
            header={t('sensors.monitoring.lastUpdateLabel')}
            body={latestTimeTemplate}
            sortable
            field="time"
          />
          <Column
            header={t('sensors.monitoring.labels.battery')}
            body={batteryTemplate}
            sortable
            field="bat"
          />
          <Column
            header={t('sensors.monitoring.labels.signal')}
            body={signalTemplate}
            sortable
            field="rssi"
          />
          <Column
            header={t('sensors.monitoring.labels.temp_soil')}
            body={temperatureTemplate}
            sortable
            field="temp_soil"
          />
          <Column
            header={t('sensors.monitoring.labels.water_soil')}
            body={moistureTemplate}
            sortable
            field="water_soil"
          />
          <Column
            header={t('sensors.monitoring.locationTitle')}
            body={locationTemplate}
          />
        </DataTable>
      )}
    </div>
  );
};
