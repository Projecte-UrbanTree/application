import CrudPanel from '@/components/Admin/CrudPanel';
import NoContractSelected from '@/components/Admin/NoContractSelected';
import Preloader from '@/components/Preloader';
import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import type { User } from '@/types/User';
import { Icon } from '@iconify/react';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { useEffect, useRef, useState } from 'react';

interface Worker extends User {
  assigned: boolean;
  fullname: string;
}

export default function Workers() {
  const { t, format } = useI18n();
  const { selectedContractId } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingUserId, setProcessingUserId] =
    useState<Worker['id']>(undefined);
  const toast = useRef<Toast>(null);
  const [filters, setFilters] = useState({
    assigned: { value: null, matchMode: FilterMatchMode.EQUALS },
    company: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fullname: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  if (!selectedContractId) return <NoContractSelected />;

  // Sort workers function
  const sortWorkers = (workersToSort: Worker[]): Worker[] => {
    return [...workersToSort].sort((a: Worker, b: Worker) => {
      if (a.assigned !== b.assigned) return a.assigned ? -1 : 1;
      return a.fullname.localeCompare(b.fullname);
    });
  };

  useEffect(() => {
    api
      .get('/admin/workers')
      .then(({ data }) => {
        const { users, usersByContract } = data;
        setWorkers(
          sortWorkers(
            users.map((user: User) => ({
              ...user,
              assigned:
                usersByContract?.some((u: User) => u.id === user.id) ?? false,
              fullname: `${user.name} ${user.surname}`,
            })),
          ),
        );
      })
      .catch(() => {
        toast.current?.show({
          severity: 'error',
          summary: t('messages:error'),
          detail: t('messages:error_loading_workers'),
        });
      })
      .finally(() => setIsLoading(false));
  }, [selectedContractId]);

  // Toggle worker assignment status
  const handleToggleAssigned = (rowData: Worker) => {
    if (!selectedContractId) {
      toast.current?.show({
        severity: 'warn',
        summary: t('messages:warning'),
        detail: t('messages:no_contract_selected'),
      });
      return;
    }

    setProcessingUserId(rowData.id);
    const endpoint = `/admin/contracts/${selectedContractId}/users/${rowData.id}`;
    const isAssigning = !rowData.assigned;

    // Use appropriate method based on whether we're assigning or unassigning
    const apiCall = isAssigning ? api.post(endpoint) : api.delete(endpoint);

    apiCall
      .then(() => {
        // Update and re-sort the workers array
        setWorkers(
          sortWorkers(
            workers.map((worker) =>
              worker.id === rowData.id
                ? { ...worker, assigned: isAssigning }
                : worker,
            ),
          ),
        );

        toast.current?.show({
          severity: 'success',
          summary: t('messages:success'),
          detail: t(
            `messages:worker_${isAssigning ? 'assigned' : 'unassigned'}_successfully`,
          ),
        });
      })
      .catch(() => {
        toast.current?.show({
          severity: 'error',
          summary: t('messages:error'),
          detail: t(
            `messages:error_${isAssigning ? 'assigning' : 'unassigning'}_worker`,
          ),
        });
      })
      .finally(() => setProcessingUserId(undefined));
  };

  const columns = [
    ...['fullname', 'email', 'company'].map((field) => ({
      field,
      header: format(`glossary:${field}`),
      filter: true,
      filterPlaceholder: format(`glossary:${field}`),
      style: { minWidth: '12rem' },
    })),
    {
      field: 'assigned',
      header: format('glossary:assigned'),
      filter: true,
      filterElement: (options: any) => (
        <TriStateCheckbox
          value={options.value}
          onChange={(e) => options.filterApplyCallback(e.value)}
        />
      ),
      dataType: 'boolean',
      style: { minWidth: '6rem' },
      body: (rowData: any) => {
        const isProcessing = processingUserId === rowData.id;

        return (
          <div
            onClick={() => !isProcessing && handleToggleAssigned(rowData)}
            className={`cursor-pointer flex items-center gap-2 ${isProcessing ? 'opacity-60' : ''}`}>
            {isProcessing ? (
              <Icon icon="prime:spinner" className="animate-spin" />
            ) : (
              <Icon
                icon={`prime:${rowData.assigned ? 'check-circle' : 'times-circle'}`}
                className={
                  rowData.assigned
                    ? 'true-icon stroke-green-500'
                    : 'false-icon stroke-red-500'
                }
              />
            )}
            <span>{rowData.assigned ? 'Desasignar' : 'Asignar'}</span>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Preloader />;

  return (
    <>
      <Toast ref={toast} />
      <CrudPanel
        loading={isLoading}
        title={format('worker_interval')}
        data={workers}
        columns={columns}
        filters={filters}
        filterDisplay="row"
      />
    </>
  );
}
