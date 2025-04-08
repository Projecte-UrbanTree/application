import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSensorHistoryPaginated } from '@/api/sensors';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { Icon } from '@iconify/react';

const SensorHistory: React.FC = () => {
  const { t } = useTranslation();
  const { eui } = useParams<{ eui: string }>();
  const navigate = useNavigate();
  
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);

  useEffect(() => {
    const loadSensorHistory = async () => {
      try {
        if (!eui) {
          throw new Error('Sensor EUI is missing');
        }
        
        setLoading(true);
        const response = await fetchSensorHistoryPaginated(eui, page, perPage);
        
        if (response && response.data) {
          setSensorData(response.data);
          setTotalRecords(response.total);
        } else {
          setSensorData([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error('Error loading sensor history:', err);
        setError(t('admin.pages.sensors.history.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadSensorHistory();
  }, [eui, page, perPage, t]);

  const onPageChange = (event: any) => {
    setPage(event.page + 1);
    setFirst(event.first);
    setPerPage(event.rows);
  };

  const getBatterySeverity = (voltage: number) => {
    if (voltage >= 3.6) return 'success';
    if (voltage >= 3.3) return 'warning';
    return 'danger';
  };

  const getSignalSeverity = (rssi: number) => {
    if (rssi >= -70) return 'success';
    if (rssi >= -85) return 'warning';
    return 'danger';
  };

  const getMoistureSeverity = (moisture: number) => {
    if (moisture >= 60) return 'success';
    if (moisture >= 30) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ProgressSpinner 
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
          animationDuration=".5s"
        />
      </div>
    );
  }

  if (error) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Card className="border-red-200 bg-red-50 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="tabler:alert-circle" className="text-red-500 text-4xl" />
          <h3 className="text-red-600 font-semibold text-lg">{error}</h3>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Icon icon="tabler:reload" /> {t('common.tryAgain')}
          </button>
        </div>
      </Card>
    </div>
  );

  if (!sensorData.length) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Card className="border-blue-200 bg-blue-50 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="tabler:database-off" className="text-blue-500 text-4xl" />
          <h3 className="text-blue-600 font-semibold text-lg">
            {t('admin.pages.sensors.history.noData')}
          </h3>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        {/* Header with back button and title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Icon icon="tabler:arrow-left" className="text-lg" />
            <span>{t('admin.pages.sensors.history.back')}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <Icon icon="tabler:device-analytics" className="text-2xl text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              {t('admin.pages.sensors.history.title')}
            </h1>
            <Tag 
              value={eui} 
              className="font-mono bg-gray-100 text-gray-800 border border-gray-300" 
            />
          </div>
        </div>

        {/* Data Table Card */}
        <Card className="shadow-sm border border-gray-100 overflow-hidden">
          <DataTable 
            value={sensorData} 
            paginator={false}
            stripedRows
            size="small"
            className="p-datatable-sm"
            emptyMessage={t('admin.pages.sensors.history.noData')}
            scrollable
            scrollHeight="flex"
          >
            <Column 
              field="time" 
              header={t('admin.pages.sensors.history.metrics.time')} 
              body={(rowData) => (
                <div className="flex items-center gap-2">
                  <Icon icon="tabler:clock" className="text-gray-500" />
                  <span>{format(parseISO(rowData.time), 'PPpp')}</span>
                </div>
              )}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="temp_soil" 
              header={t('admin.pages.sensors.history.metrics.temp_soil')}
              body={(rowData) => (
                <div className="flex items-center gap-2">
                  <Icon icon="tabler:temperature" className="text-red-500" />
                  <span>{rowData.temp_soil} °C</span>
                </div>
              )}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="ph1_soil" 
              header={t('admin.pages.sensors.history.metrics.ph1_soil')}
              body={(rowData) => (
                <div className="flex items-center gap-2">
                  <Icon icon="tabler:ph" className="text-purple-500" />
                  <span>{rowData.ph1_soil} pH</span>
                </div>
              )}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="water_soil" 
              header={t('admin.pages.sensors.history.metrics.water_soil')}
              body={(rowData) => rowData.water_soil ? (
                <Tag 
                  value={`${rowData.water_soil}%`}
                  severity={getMoistureSeverity(rowData.water_soil)}
                  className="font-medium"
                />
              ) : (
                <Tag value="N/A" severity="info" />
              )}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="conductor_soil" 
              header={t('admin.pages.sensors.history.metrics.conductor_soil')}
              body={(rowData) => rowData.conductor_soil ? (
                <div className="flex items-center gap-2">
                  <Icon icon="tabler:lightning-bolt" className="text-yellow-500" />
                  <span>{rowData.conductor_soil} µS/cm</span>
                </div>
              ) : 'N/A'}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="bat" 
              header={t('admin.pages.sensors.history.metrics.bat')}
              body={(rowData) => (
                <Tag 
                  value={`${rowData.bat.toFixed(2)} V`}
                  severity={getBatterySeverity(rowData.bat)}
                  className="font-medium"
                />
              )}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="rssi" 
              header={t('admin.pages.sensors.history.metrics.rssi')}
              body={(rowData) => (
                <Tag 
                  value={`${rowData.rssi} dBm`}
                  severity={getSignalSeverity(rowData.rssi)}
                  className="font-medium"
                />
              )}
              headerClassName="font-semibold"
              sortable
            />
            
            <Column 
              field="snr" 
              header={t('admin.pages.sensors.history.metrics.snr')}
              body={(rowData) => `${rowData.snr} dB`}
              headerClassName="font-semibold"
              sortable
            />
          </DataTable>

          {/* Paginator with improved styling */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <Paginator 
              first={first} 
              rows={perPage} 
              totalRecords={totalRecords} 
              rowsPerPageOptions={[5, 10, 20, 50]} 
              onPageChange={onPageChange} 
              className="border-0"
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
              currentPageReportTemplate={`{first} - {last} ${t('admin.pages.sensors.history.of')} {totalRecords}`}
              leftContent={
                <div className="text-sm text-gray-600 ml-2">
                  {t('common.totalRecords')}: <strong>{totalRecords}</strong>
                </div>
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SensorHistory;