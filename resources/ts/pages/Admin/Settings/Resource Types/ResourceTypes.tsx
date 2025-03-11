import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';

interface ResourceType {
  id: number;
  name: string;
  description: string;
}

export default function ResourceTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null); 
  const { t } = useTranslation();

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/resource-types');
        setResourceTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchResourceTypes();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleCreate = async (values: ResourceType) => {
    try {
      const response = await axiosClient.post('/admin/resource-types', values);
      setResourceTypes((prevResourceTypes) => [...prevResourceTypes, response.data]);
      setMsg(t("admin.pages.resourceTypes.createSuccess"));
    } catch (error) {
      console.error(error);
      setMsg(t("admin.pages.resourceTypes.error"));
    }
  };

  const handleEdit = async (id: number, values: ResourceType) => {
    try {
      const response = await axiosClient.put(`/admin/resource-types/${id}`, values);
      setResourceTypes((prevResourceTypes) =>
        prevResourceTypes.map((resourceType) =>
          resourceType.id === id ? response.data : resourceType
        )
      );
      setMsg(t("admin.pages.resourceTypes.updateSuccess"));
    } catch (error) {
      console.error(error);
      setMsg(t("admin.pages.resourceTypes.error"));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t("admin.pages.resourceTypes.list.messages.deleteConfirm"))) {
      try {
        await axiosClient.delete(`/admin/resource-types/${id}`);
        setResourceTypes((prevResourceTypes) => prevResourceTypes.filter((resourceType) => resourceType.id !== id));
        setMsg(t("admin.pages.resourceTypes.list.messages.deleteSuccess"));
      } catch (error) {
        console.error(error);
        setMsg(t("admin.pages.resourceTypes.list.messages.deleteError"));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
        <span className="mt-2 text-blue-600">{t("general.loading")}</span>
      </div>
    );
  }

  return (
    <>
      {msg && (
        <Message
          severity={successMsg || msg === t("admin.pages.resourceTypes.list.messages.deleteSuccess") ? "success" : "error"}
          text={msg}
          className="mb-4 w-full"
        />
      )}
      <CrudPanel
        title={t("admin.pages.resourceTypes.title")}
        onCreate={() => navigate('/admin/settings/resource-types/create')}>
        <DataTable
          value={resourceTypes}
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm">
          <Column
            field="name"
            header={t('admin.pages.resourceTypes.list.columns.name')}
          />
          <Column
            field="description"
            header={t('admin.pages.resourceTypes.list.columns.description')}
          />
          
          <Column
            header={t("admin.pages.resourceTypes.list.actions.label")}
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t("admin.pages.resourceTypes.list.actions.edit")}
                  tooltipOptions={{ position: "top" }}
                  onClick={() => navigate(`/admin/settings/resource-types/edit/${rowData.id}`)}
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t("admin.pages.resourceTypes.list.actions.delete")}
                  tooltipOptions={{ position: "top" }}
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </CrudPanel>
    </>
  );
}