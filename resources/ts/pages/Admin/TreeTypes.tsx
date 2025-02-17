import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';

export default function TreeTypes() {
  const [isLoading, setIsLoading] = useState(true);
  const [treeTypes, setTreeTypes] = useState([]);

  useEffect(() => {
    const fetchTreeTypes = async () => {
      try {
        const response = await axiosClient.get('/admin/tree-types');
        setTreeTypes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTreeTypes();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={treeTypes}>
          <Column field="family" header="Family" />
          <Column field="genus" header="Genus" />
          <Column field="species" header="Species" />
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
