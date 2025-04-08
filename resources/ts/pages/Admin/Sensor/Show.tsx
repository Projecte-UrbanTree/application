import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSensorByEUI } from '@/api/sensors';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';

interface SensorHistoryData {
  time: string;
  temp_soil?: number;
  ph1_soil?: number;
  water_soil?: number;
  conductor_soil?: number;
  bat?: number;
  rssi?: number;
  snr?: number;
  [key: string]: any; // Para otras propiedades dinámicas
}

const SensorHistory: React.FC = () => {
  const { t } = useTranslation();
  const { eui } = useParams<{ eui: string }>();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorHistoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const loadSensorHistory = async () => {
      try {
        if (!eui) {
          throw new Error(t('admin.pages.sensors.history.missingEUI'));
        }
        
        setLoading(true);
        setError(null);
        
        const data = await fetchSensorByEUI(eui);
        
        if (!Array.isArray(data)) {
          throw new Error(t('admin.pages.sensors.history.invalidData'));
        }
        
        // Asegurar que los datos tienen el formato esperado
        const formattedData = data.map(item => ({
          time: item.time || item.gw_time || new Date().toISOString(),
          temp_soil: item.temp_soil ?? null,
          ph1_soil: item.ph1_soil ?? null,
          water_soil: item.water_soil ?? null,
          conductor_soil: item.conductor_soil ?? null,
          bat: item.bat ?? null,
          rssi: item.rssi ?? null,
          snr: item.snr ?? null,
          ...item // Mantener otras propiedades
        }));
        
        setSensorData(formattedData);
        setTotalRecords(formattedData.length);
      } catch (err: any) {
        console.error('Error loading sensor history:', err);
        setError(err.message || t('admin.pages.sensors.history.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadSensorHistory();
  }, [eui, t]);

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return t('admin.pages.sensors.history.invalidDate');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-4">
        <div className="text-center p-8 text-red-500">
          <i className="pi pi-exclamation-triangle text-4xl mb-4"></i>
          <h2 className="text-xl font-bold mb-2">{t('admin.pages.error.title')}</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="p-button p-button-text"
          >
            {t('admin.pages.sensors.history.back')}
          </button>
        </div>
      </Card>
    );
  }

  if (!sensorData.length) {
    return (
      <Card className="m-4">
        <div className="text-center p-8">
          <i className="pi pi-database text-4xl mb-4"></i>
          <h2 className="text-xl font-bold mb-2">
            {t('admin.pages.sensors.history.noDataTitle')}
          </h2>
          <p className="mb-4">{t('admin.pages.sensors.history.noData')}</p>
          <button 
            onClick={() => navigate(-1)}
            className="p-button p-button-text"
          >
            {t('admin.pages.sensors.history.back')}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="p-button p-button-text mb-6 flex align-items-center"
      >
        <i className="pi pi-arrow-left mr-2"></i>
        {t('admin.pages.sensors.history.back')}
      </button>

      <Card className="mb-8">
        <div className="flex justify-content-between align-items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('admin.pages.sensors.history.title')} {eui}
          </h1>
        </div>

        <div className="overflow-auto">
          <DataTable 
            value={sensorData.slice(first, first + rows)} 
            paginator={false} 
            className="p-datatable-sm"
            stripedRows
            responsiveLayout="scroll"
          >
            <Column 
              field="time" 
              header={t('admin.pages.sensors.history.metrics.time')} 
              body={(rowData) => formatDate(rowData.time)} 
              sortable
            />
            <Column field="temp_soil" header={t('admin.pages.sensors.history.metrics.temp_soil')} />
            <Column field="ph1_soil" header={t('admin.pages.sensors.history.metrics.ph1_soil')} />
            <Column field="water_soil" header={t('admin.pages.sensors.history.metrics.water_soil')} />
            <Column field="conductor_soil" header={t('admin.pages.sensors.history.metrics.conductor_soil')} />
            <Column field="bat" header={t('admin.pages.sensors.history.metrics.bat')} />
            <Column field="rssi" header={t('admin.pages.sensors.history.metrics.rssi')} />
            <Column field="snr" header={t('admin.pages.sensors.history.metrics.snr')} />
          </DataTable>

          <Paginator 
            first={first} 
            rows={rows} 
            totalRecords={totalRecords} 
            rowsPerPageOptions={[5, 10, 20, 50]} 
            onPageChange={onPageChange} 
            className="mt-4 justify-content-start"
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          />
        </div>
      </Card>
    </div>
  );
};

export default SensorHistory;