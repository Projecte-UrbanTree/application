import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';

export default function Resources() {
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axiosClient.get('/admin/resources');
        setResources(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResources();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={resources}>
          <Column field="name" header="Name" />
          <Column field="description" header="Description" />
          <Column field="resource_type_id" header="Resource Type" />
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
