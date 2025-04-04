import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '@/api/axiosClient';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { RootState } from '@/store/store';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import CrudPanel from '@/components/Admin/CrudPanel';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  company?: string;
  dni?: string;
}

export default function Workers() {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  const [workers, setWorkers] = useState<User[]>([]);
  const [allWorkers, setAllWorkers] = useState<User[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(false);

  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  useEffect(() => {
    if (currentContract?.id !== undefined) {
      fetchAllWorkers().then(() => {
        if (currentContract.id !== undefined) {
          fetchWorkersForContract(currentContract.id);
        }
      });
    } else {
      setLoading(false);
      setWorkers([]);
      setSelectedWorkers([]);
    }
  }, [currentContract]);

  const fetchAllWorkers = async () => {
    try {
      setSelectLoading(true);
      const response = await axiosClient.get('/admin/users', {
        params: { role: 'worker' },
      });
      const workerUsers = response.data.filter(
        (user: User) => user.role === 'worker',
      );
      setAllWorkers(workerUsers);
      return workerUsers;
    } catch (error) {
      console.error('Error fetching available workers:', error);
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.workers.failedToLoad'),
        life: 3000,
      });
      return [];
    } finally {
      setSelectLoading(false);
    }
  };

  const fetchWorkersForContract = async (contractId: number) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/admin/contracts/${contractId}/users`,
      );
      const contractWorkers = response.data;
      setWorkers(contractWorkers);
      const selectedIds = new Set(contractWorkers.map((w: User) => w.id));
      const matchedWorkers = allWorkers.filter((w) => selectedIds.has(w.id));

      if (contractWorkers.length === 0) {
        setSelectedWorkers([]);
      } else if (matchedWorkers.length !== contractWorkers.length) {
        setSelectedWorkers(contractWorkers);
      } else {
        setSelectedWorkers(matchedWorkers);
      }
    } catch (error) {
      console.error('Error fetching contract workers:', error);
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.workers.failedToLoad'),
        life: 3000,
      });
      setWorkers([]);
      setSelectedWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkersChange = async (e: { value: User[] }) => {
    if (!currentContract?.id) return;

    const contractId = currentContract.id;
    const newSelectedWorkers = e.value;

    const currentWorkerIds = new Set(workers.map((w) => w.id));
    const newWorkerIds = new Set(newSelectedWorkers.map((w) => w.id));

    const workersToAdd = newSelectedWorkers.filter(
      (w) => !currentWorkerIds.has(w.id),
    );
    const workersToRemove = workers.filter((w) => !newWorkerIds.has(w.id));

    setSelectedWorkers(newSelectedWorkers);

    try {
      for (const worker of workersToAdd) {
        await axiosClient.post(
          `/admin/contracts/${contractId}/users/${worker.id}`,
        );
      }

      for (const worker of workersToRemove) {
        await axiosClient.delete(
          `/admin/contracts/${contractId}/users/${worker.id}`,
        );
      }

      if (workersToAdd.length > 0 || workersToRemove.length > 0) {
        await fetchWorkersForContract(contractId);
        toast.current?.show({
          severity: 'success',
          summary: t('general.success'),
          detail: t('admin.pages.workers.updatedSuccessfully'),
          life: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating workers:', error);
      toast.current?.show({
        severity: 'error',
        summary: t('general.error'),
        detail: t('admin.pages.workers.failedToUpdate'),
        life: 3000,
      });
      await fetchWorkersForContract(contractId);
    }
  };

  const fullNameTemplate = (rowData: User) =>
    `${rowData.name} ${rowData.surname || ''}`;

  if (loading && !currentContract?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
          className="text-indigo-600"
        />
        <span className="mt-2 text-indigo-600">{t('general.loading')}</span>
      </div>
    );
  }

  return (
    <CrudPanel title="admin.pages.workers.title">
      <Toast ref={toast} position="top-right" />

      {!currentContract?.id ? (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center text-indigo-700">
          <Icon icon="mdi:file-document-alert" className="text-2xl mb-2" />
          {t('admin.pages.workers.pleaseSelectContract')}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('admin.pages.workers.contractWorkers')}:{' '}
              {currentContract?.name}
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('admin.pages.workers.assignRemoveWorkers')}
              </label>
              <MultiSelect
                value={selectedWorkers}
                options={allWorkers}
                onChange={handleWorkersChange}
                optionLabel="name"
                itemTemplate={(option: User) => (
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:account" className="text-gray-600" />
                    <span>
                      {option.name} {option.surname}
                    </span>
                  </div>
                )}
                placeholder={t('admin.pages.workers.selectWorkers')}
                filter
                showSelectAll={false}
                loading={selectLoading}
                className="w-full rounded-lg"
                display="chip"
                dataKey="id"
                maxSelectedLabels={3}
                selectedItemsLabel={`${t('admin.pages.workers.selected')} {0}`}
              />
              <p className="text-sm text-gray-500 mt-1">
                {t('admin.pages.workers.selectWorkerHelp')}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('admin.pages.workers.workersForContract')}:{' '}
              {currentContract.name}
            </h3>

            {loading ? (
              <div className="flex justify-center p-4">
                <ProgressSpinner
                  style={{ width: '50px', height: '50px' }}
                  strokeWidth="4"
                  className="text-indigo-600"
                />
              </div>
            ) : workers.length === 0 ? (
              <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                <Icon
                  icon="mdi:account-question"
                  className="text-3xl text-gray-400 mb-3"
                />
                <p className="font-medium text-gray-600">
                  {t('admin.pages.workers.noWorkersAssigned')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('admin.pages.workers.useDropdownToAssign')}
                </p>
              </div>
            ) : (
              <DataTable
                value={workers}
                paginator
                rows={10}
                stripedRows
                showGridlines
                className="p-datatable-sm"
                emptyMessage={t('admin.pages.workers.noWorkersFound')}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
                <Column
                  field="name"
                  header={t('admin.pages.workers.name')}
                  body={fullNameTemplate}
                />
                <Column field="email" header={t('admin.pages.workers.email')} />
                <Column
                  field="company"
                  header={t('admin.pages.workers.company')}
                />
                <Column field="dni" header={t('admin.pages.workers.dni')} />
              </DataTable>
            )}
          </div>
        </div>
      )}
    </CrudPanel>
  );
}
