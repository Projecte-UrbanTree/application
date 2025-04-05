import { Icon } from '@iconify/react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { useToast } from '@/hooks/useToast';
import { RootState } from '@/store/store';

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
  const { showToast } = useToast();
  const [workers, setWorkers] = useState<User[]>([]);
  const [allWorkers, setAllWorkers] = useState<User[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(false);

  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );

  useEffect(() => {
    if (currentContract?.id) {
      initializeWorkersData(currentContract.id);
    } else {
      resetWorkersData();
    }
  }, [currentContract]);

  const initializeWorkersData = async (contractId: number) => {
    setLoading(true);
    await fetchAllWorkers();
    await fetchWorkersForContract(contractId);
    setLoading(false);
  };

  const resetWorkersData = () => {
    setWorkers([]);
    setSelectedWorkers([]);
    setLoading(false);
  };

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
      setSelectLoading(false);
    } catch (error) {
      showToast(
        'error',
        t('general.error'),
        t('admin.pages.workers.failedToLoad'),
      );
      setSelectLoading(false);
    }
  };

  const fetchWorkersForContract = async (contractId: number) => {
    try {
      const response = await axiosClient.get(
        `/admin/contracts/${contractId}/users`,
      );
      const contractWorkers = response.data;
      setWorkers(contractWorkers);
      updateSelectedWorkers(contractWorkers);
      setLoading(false);
    } catch (error) {
      showToast(
        'error',
        t('general.error'),
        t('admin.pages.workers.failedToLoad'),
      );
      resetWorkersData();
      setLoading(false);
    }
  };

  const updateSelectedWorkers = (contractWorkers: User[]) => {
    const selectedIds = new Set(contractWorkers.map((w) => w.id));
    const matchedWorkers = allWorkers.filter((w) => selectedIds.has(w.id));

    if (contractWorkers.length === 0) {
      setSelectedWorkers([]);
    } else if (matchedWorkers.length !== contractWorkers.length) {
      setSelectedWorkers(contractWorkers);
    } else {
      setSelectedWorkers(matchedWorkers);
    }
  };

  const handleWorkersChange = async (e: { value: User[] }) => {
    if (!currentContract?.id) return;

    const newSelectedWorkers = e.value;
    const workersToAdd = getWorkersToAdd(newSelectedWorkers);
    const workersToRemove = getWorkersToRemove(newSelectedWorkers);

    setSelectedWorkers(newSelectedWorkers);

    try {
      await updateWorkersInContract(workersToAdd, workersToRemove);
      await fetchWorkersForContract(currentContract.id);
      showToast(
        'success',
        t('general.success'),
        t('admin.pages.workers.updatedSuccessfully'),
      );
    } catch (error) {
      showToast(
        'error',
        t('general.error'),
        t('admin.pages.workers.failedToUpdate'),
      );
      await fetchWorkersForContract(currentContract.id);
    }
  };

  const getWorkersToAdd = (newSelectedWorkers: User[]) => {
    const currentWorkerIds = new Set(workers.map((w) => w.id));
    return newSelectedWorkers.filter((w) => !currentWorkerIds.has(w.id));
  };

  const getWorkersToRemove = (newSelectedWorkers: User[]) => {
    const newWorkerIds = new Set(newSelectedWorkers.map((w) => w.id));
    return workers.filter((w) => !newWorkerIds.has(w.id));
  };

  const updateWorkersInContract = async (
    workersToAdd: User[],
    workersToRemove: User[],
  ) => {
    const contractId = currentContract?.id;
    if (!contractId) return;

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
  };

  const fullNameTemplate = (rowData: User) =>
    `${rowData.name} ${rowData.surname || ''}`;

  const renderNoContractSelected = () => (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg text-center text-gray-700">
      <Icon
        icon="mdi:file-document-alert"
        className="text-3xl mb-3 text-gray-500"
      />
      <p className="font-medium">
        {t('admin.pages.workers.pleaseSelectContract')}
      </p>
    </div>
  );

  const renderWorkersTable = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {t('admin.pages.workers.workersForContract')}:{' '}
        <span className="text-indigo-600">{currentContract?.name}</span>
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
        <div className="p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <Icon
            icon="mdi:account-question"
            className="text-4xl text-gray-400 mb-3"
          />
          <p className="font-medium text-gray-600">
            {t('admin.pages.workers.noWorkersAssigned')}
          </p>
          <p className="text-sm text-gray-500">
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
          className="p-datatable-sm border border-gray-300 rounded-lg"
          emptyMessage={t('admin.pages.workers.noWorkersFound')}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink">
          <Column
            field="name"
            header={t('admin.pages.workers.name')}
            body={fullNameTemplate}
          />
          <Column field="email" header={t('admin.pages.workers.email')} />
          <Column field="company" header={t('admin.pages.workers.company')} />
          <Column field="dni" header={t('admin.pages.workers.dni')} />
        </DataTable>
      )}
    </div>
  );

  return (
    <CrudPanel title="admin.pages.workers.title">
      {!currentContract?.id ? (
        renderNoContractSelected()
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
            <div className="space-y-3">
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
                className="w-full rounded-lg border border-gray-300"
                display="chip"
                dataKey="id"
                maxSelectedLabels={3}
                selectedItemsLabel={`${t('admin.pages.workers.selected')} {0}`}
              />
              <p className="text-sm text-gray-500">
                {t('admin.pages.workers.selectWorkerHelp')}
              </p>
            </div>
          </div>

          {renderWorkersTable()}
        </div>
      )}
    </CrudPanel>
  );
}
