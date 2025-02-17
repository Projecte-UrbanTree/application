import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';

export default function ElementTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [elementTypes, setElementTypes] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchElementTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/element-types');
        setElementTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchElementTypes();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={elementTypes}>
          <Column
            field="name"
            header={t('admin.pages.elementTypes.columns.name')}
          />
          <Column
            field="requires_tree_type"
            header={t('admin.pages.elementTypes.columns.requires_tree_type')}
          />
          <Column
            field="description"
            header={t('admin.pages.elementTypes.columns.description')}
          />
          <Column
            field="icon"
            header={t('admin.pages.elementTypes.columns.icon')}
          />
          <Column
            field="color"
            header={t('admin.pages.elementTypes.columns.color')}
          />
          {/* Actions */}
          <Column
            body={() => (
              <div className="flex justify-center space-x-2">
                <Button>
                  <Icon icon="tabler:edit" />
                </Button>
              </div>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
