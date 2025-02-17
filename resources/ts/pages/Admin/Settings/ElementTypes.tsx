import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';

export default function ElementTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [elementTypes, setElementTypes] = useState([]);

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
          <Column field="name" header="Name" />
          <Column field="requires_tree_type" header="Requires Tree Type" />
          <Column field="description" header="Description" />
          <Column field="icon" header="Icon" />
          <Column field="color" header="Color" />
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
