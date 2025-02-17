import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';

export default function Contracts() {
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axiosClient.get('/admin/contracts');
        setContracts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContracts();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={contracts}>
          <Column field="name" header="Name" />
          <Column field="start_date" header="Start Date" />
          <Column field="end_date" header="End Date" />
          <Column field="invoice_proposed" header="Invoice Proposed" />
          <Column field="invoice_agreed" header="Invoice Agreed" />
          <Column field="invoice_paid" header="Invoice Paid" />
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
