import { useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

import { Icon } from '@iconify/react';

import axiosClient from '@/api/axiosClient';

export default function Users() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/admin/users');
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="bg-white rounded p-6 mb-8 border border-gray-300">
        <DataTable loading={isLoading} value={users}>
          <Column field="name" header="Name" />
          <Column field="surname" header="Surname" />
          <Column field="email" header="Email" />
          <Column field="company" header="Company" />
          <Column field="dni" header="DNI" />
          <Column
            field="role"
            header="Role"
            body={(rowData: { role: string }) => {
              switch (rowData.role) {
                case 'admin':
                  return <Badge severity="danger" value="Admin" />;
                case 'worker':
                  return <Badge severity="success" value="Worker" />;
                case 'customer':
                  return <Badge severity="info" value="Customer" />;
                default:
                  return <Badge severity="warning" value="Unknown" />;
              }
            }}
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
