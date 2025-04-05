import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ElementsTypes() {
  const [isLoading, setIsLoading] = useState(true);
  interface ElementType {
    id: number;
    name: string;
    requires_tree_type: boolean;
    description: string;
    icon: string;
    color: string;
  }

  const [elementTypes, setElementTypes] = useState<ElementType[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

  useEffect(() => {
    const fetchElementTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/element-types');
        setElementTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchElementTypes();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleDelete = async (elementTypeId: number) => {
    if (!window.confirm(t('admin.pages.elementTypes.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/element-types/${elementTypeId}`);
      setElementTypes(elementTypes.filter((et) => et.id !== elementTypeId));
      setMsg(t('admin.pages.elementTypes.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
      setMsg(t('admin.pages.elementTypes.list.messages.error'));
    }
  };

  const colorBodyTemplate = (rowData: ElementType) => {
    return (
      <div
        style={{
          backgroundColor: `#${rowData.color}`,
          width: '24px',
          height: '24px',
          borderRadius: '10%',
          margin: '0 auto',
        }}></div>
    );
  };

  const iconBodyTemplate = (rowData: ElementType) => {
    return rowData.icon ? (
      <Icon icon={'mdi:' + rowData.icon} className="text-2xl mx-auto" />
    ) : null;
  };

  const requiresTreeTypeBodyTemplate = (rowData: ElementType) => {
    return rowData.requires_tree_type ? 'Si' : 'No';
  };

  return (
    <>
      {msg && (
        <Message
          severity={
            msg === t('admin.pages.elementTypes.list.messages.deleteSuccess') ||
            msg === successMsg
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      ) : elementTypes.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">{t('admin.pages.elementTypes.list.noData')}</p>
          <Button
            label={t('admin.pages.elementTypes.list.actions.create')}
            onClick={() => navigate('/admin/settings/element-types/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title={t('admin.pages.elementTypes.title')}
          onCreate={() => navigate('/admin/settings/element-types/create')}
        >
          <DataTable
            value={elementTypes}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm">
            <Column
              field="name"
              header={t('admin.pages.elementTypes.columns.name')}
            />
            <Column
              field="requires_tree_type"
              header={t('admin.pages.elementTypes.columns.requires_tree_type')}
              body={requiresTreeTypeBodyTemplate}
            />
            <Column
              field="description"
              header={t('admin.pages.elementTypes.columns.description')}
            />
            <Column
              field="icon"
              header={t('admin.pages.elementTypes.columns.icon')}
              body={iconBodyTemplate}
              style={{ textAlign: 'center' }}
            />
            <Column
              field="color"
              header={t('admin.pages.elementTypes.columns.color')}
              body={colorBodyTemplate}
              style={{ textAlign: 'center' }}
            />
            <Column
              header={t('admin.pages.elementTypes.actions')}
              body={(rowData: { id: number }) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.elementTypes.editButton')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() =>
                      navigate(`/admin/settings/element-types/edit/${rowData.id}`)
                    }
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    tooltip={t('admin.pages.elementTypes.deleteButton')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleDelete(rowData.id)}
                  />
                </div>
              )}
            />
          </DataTable>
        </CrudPanel>
      )}
    </>
  );
}
