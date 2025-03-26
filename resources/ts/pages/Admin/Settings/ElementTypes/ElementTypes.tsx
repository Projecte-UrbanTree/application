import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
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
        const response = await api.get('/admin/element-types');
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
    if (!window.confirm(t('admin.pages.elementTypes.deleteConfirm'))) return;
    try {
      await api.delete(`/admin/element-types/${elementTypeId}`);
      setElementTypes(
        elementTypes.filter((elementype) => elementype.id !== elementTypeId),
      );
      setMsg(t('admin.pages.elementTypes.deletedSuccess'));
    } catch (error) {
      console.error(error);
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

  if (isLoading) return <Preloader bg_white={false} />;

  return (
    <>
      {msg && (
        <Message
          severity={
            successMsg || msg === t('admin.pages.elementTypes.deletedSuccess')
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      <CrudPanel
        title={t('glossary:element_type_interval', {
          postProcess: 'interval',
          count: elementTypes.length,
        })}
        onCreate={() => navigate('/admin/settings/element-types/create')}>
        <DataTable
          value={elementTypes}
          paginator
          rows={10}
          stripedRows
          showGridlines
          className="p-datatable-sm">
          <Column
            field="name"
            header={t('_capitalize', { val: t('glossary:name') })}
          />
          <Column
            field="requires_tree_type"
            header={t('admin.pages.elementTypes.columns.requires_tree_type')}
            body={(rowData: ElementType) =>
              rowData.requires_tree_type
                ? t('_capitalize', { val: t('glossary:yes') })
                : t('_capitalize', { val: t('glossary:no') })
            }
          />
          <Column
            field="description"
            header={t('_capitalize', { val: t('glossary:description') })}
          />
          <Column
            field="icon"
            header={t('admin.pages.elementTypes.columns.icon')}
            body={(rowData: ElementType) => (
              <Icon icon={'mdi:' + rowData.icon} className="text-2xl mx-auto" />
            )}
            style={{ textAlign: 'center' }}
          />
          <Column
            field="color"
            header={t('admin.pages.elementTypes.columns.color')}
            body={colorBodyTemplate}
            style={{ textAlign: 'center' }}
          />
          <Column
            header={t('_capitalize', { val: t('glossary:actions') })}
            body={(rowData: { id: number }) => (
              <div className="flex justify-center gap-2">
                <Button
                  icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                  className="p-button-rounded p-button-info"
                  tooltip={t('admin.pages.elementTypes.editButton')}
                  tooltipOptions={{ position: 'top' }}
                  onClick={() =>
                    navigate(`/admin/settings/element-types/edit/${rowData.id}`)
                  }
                />
                <Button
                  icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                  className="p-button-rounded p-button-danger"
                  tooltip={t('admin.pages.elementTypes.deleteButton')}
                  tooltipOptions={{ position: 'top' }}
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
