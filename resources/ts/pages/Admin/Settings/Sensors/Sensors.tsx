import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from 'primereact/dialog';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';

interface Sensor {
  id: number;
  device_eui: string;
  name: string;
  latitude: number;
  longitude: number;
  contract_id: number;
}

export default function Sensors() {
  const [isLoading, setIsLoading] = useState(true);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [hasError, setHasError] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);
  const { t } = useTranslation();
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const fetchSensors = async () => {
    try {
      const response = await axiosClient.get('/admin/sensor'); 
      console.log('Sensors fetched:', response.data); 
      setSensors(Array.isArray(response.data) ? response.data : []); 
      setHasError(false); 
    } catch (error) {
      console.error('Error fetching sensors:', error);
      setHasError(true); 
      setMsg(t("admin.pages.sensors.list.messages.error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors(); 
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleCreate = async (values: Sensor) => {
    try {
      const response = await axiosClient.post('/admin/sensor', values);
      console.log('Sensor created:', response.data);
      setMsg(t("admin.pages.sensors.list.messages.createSuccess"));
      await fetchSensors(); 
    } catch (error) {
      console.error('Error creating sensor:', error);
      setMsg(t("admin.pages.sensors.list.messages.error"));
    }
  };

  const handleEdit = async (id: number, values: Sensor) => {
    try {
      const response = await axiosClient.put(`/admin/sensor/${id}`, values);
      setSensors((prevSensors) =>
        prevSensors.map((sensor) =>
          sensor.id === id ? response.data : sensor
        )
      );
      setMsg(t("admin.pages.sensors.list.messages.updateSuccess"));
    } catch (error) {
      console.error(error);
      setMsg(t("admin.pages.sensors.list.messages.error"));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t("admin.pages.sensors.list.messages.deleteConfirm"))) {
      try {
        await axiosClient.delete(`/admin/sensor/${id}`);
        setSensors((prevSensors) => prevSensors.filter((sensor) => sensor.id !== id));
        setMsg(t("admin.pages.sensors.list.messages.deleteSuccess"));
      } catch (error) {
        console.error(error);
        setMsg(t("admin.pages.sensors.list.messages.deleteError"));
      }
    }
  };

  const fetchSensorById = async (id: number) => {
    try {
      const response = await axiosClient.get(`/admin/sensor/${id}`); 
      return response.data;
    } catch (error) {
      console.error(error);
      setMsg(t("admin.pages.sensors.list.messages.error")); 
      return null;
    }
  };

  const handleViewSensor = async (id: number) => {
    try {
      const response = await axiosClient.get(`/admin/sensor/${id}`);
      setSelectedSensor(response.data);
      setIsDialogVisible(true);
    } catch (error) {
      console.error('Error fetching sensor:', error);
      setMsg(t("admin.pages.sensors.list.messages.error"));
    }
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setSelectedSensor(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
        <span className="mt-2 text-blue-600">{t("general.loading")}</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600">{t("admin.pages.sensors.list.messages.error")}</p>
        <Button label={t("general.retry")} onClick={fetchSensors} />
      </div>
    );
  }

  return (
    <>
      {msg && (
        <Message
          severity={
            msg === t("admin.pages.sensors.list.messages.createSuccess") || 
            msg === t("admin.pages.sensors.list.messages.deleteSuccess") || 
            msg === t("admin.pages.sensors.list.messages.updateSuccess") 
                ? "success" 
                : "error"
        }
        text={msg}
        className="mb-4 w-full"
      />
      )}
      <CrudPanel
        title={t("admin.pages.sensors.title")}
        onCreate={() => navigate('/admin/sensors/create')}>
        <DataTable
          value={sensors} 
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm"
        >
          <Column
            field="device_eui"
            header={t('admin.pages.sensors.list.columns.deviceEui')}
          />
          <Column
            field="name"
            header={t('admin.pages.sensors.list.columns.name')}
          />
          <Column
            field="latitude"
            header={t('admin.pages.sensors.list.columns.latitude')}
          />
          <Column
            field="longitude"
            header={t('admin.pages.sensors.list.columns.longitude')}
          />
          <Column
            field="status"
            header={t('admin.pages.sensors.list.columns.status')}
            body={(rowData) => (
                <div className="flex justify-center items-center">
                    <span
                        className={`inline-block w-3 h-3 rounded-full ${
                            rowData.device_eui ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        title={rowData.device_eui ? t('admin.status.active') : t('admin.status.inactive')}
                    ></span>
                </div>
            )}
          />
          <Column
            header={t("admin.pages.sensors.list.actions.label")}
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:eye" className="h-5 w-5" />}
                  className="p-button-rounded p-button-success"
                  tooltip={t("admin.pages.sensors.list.actions.view")}
                  tooltipOptions={{ position: "top" }}
                  onClick={() => handleViewSensor(rowData.id)} 
                />
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t("admin.pages.sensors.list.actions.edit")}
                  tooltipOptions={{ position: "top" }}
                  onClick={() => navigate(`/admin/sensors/edit/${rowData.id}`)} 
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t("admin.pages.sensors.list.actions.delete")}
                  tooltipOptions={{ position: "top" }}
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>

      <Dialog
        visible={isDialogVisible}
        style={{ width: '50vw' }}
        onHide={closeDialog}
      >
        <div className="p-6 bg-gray-50">
          {selectedSensor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-gray-700 font-semibold">{t("admin.fields.id")}</h4>
                <p className="text-gray-900">{selectedSensor.id}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-gray-700 font-semibold">{t("admin.fields.device_eui")}</h4>
                <p className="text-gray-900">{selectedSensor.device_eui}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-gray-700 font-semibold">{t("admin.fields.name")}</h4>
                <p className="text-gray-900">{selectedSensor.name}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-gray-700 font-semibold">{t("admin.fields.latitude")}</h4>
                <p className="text-gray-900">{selectedSensor.latitude}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-gray-700 font-semibold">{t("admin.fields.longitude")}</h4>
                <p className="text-gray-900">{selectedSensor.longitude}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-gray-700 font-semibold">{t("admin.fields.contract_id")}</h4>
                <p className="text-gray-900">{selectedSensor.contract_id}</p>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}