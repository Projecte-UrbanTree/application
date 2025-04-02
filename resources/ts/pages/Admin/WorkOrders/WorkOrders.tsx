import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import { WorkOrderStatusInfoChip } from '@/components/Shared/WorkOrderStatusInfo';
import { WorkReportStatusInfoChip } from '@/components/Shared/WorkReportStatusInfo';
import useAuth from '@/hooks/useAuth';
import useCrudData from '@/hooks/useCrudData';
import useI18n from '@/hooks/useI18n';
import type { User } from '@/types/User';
import type { WorkOrder } from '@/types/WorkOrder';
import { Icon } from '@iconify/react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WorkOrders() {
  const { format } = useI18n();
  const { selectedContractId } = useAuth();
  const navigate = useNavigate();

  const isEditable = (wo: WorkOrder) => ![1, 2, 3].includes(wo.status);

  const {
    canDelete,
    canEdit,
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: workOrders,
  } = useCrudData<Required<WorkOrder>>({
    conditions: { delete: isEditable, edit: isEditable },
    endpoint: '/admin/work-orders',
    getItemName: (wo) => `OT-${wo.id}`,
    createPath: '/admin/work-orders/create',
    editPath: (id) => `/admin/work-orders/edit/${id}`,
  });

  const rowExpansionTemplate = useCallback(
    (data: WorkOrder) => {
      const activeTabs = data.work_order_blocks.map((_, i) => i);
      return (
        <div className="p-4 bg-gray-50">
          <Accordion multiple activeIndex={activeTabs}>
            {data.work_order_blocks.map((block, index) => (
              <AccordionTab
                key={block.id}
                header={`${format('admin:pages.workOrders.details.block')} ${index + 1}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Icon icon="tabler:map-pin" />
                      {format('admin:pages.workOrders.details.zones')}
                    </h4>
                    <ul className="list-disc pl-5">
                      {block.zones.map((zone) => (
                        <li key={zone.id}>{zone.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Icon icon="tabler:clipboard-list" />
                      {format('admin:pages.workOrders.details.tasks')}
                    </h4>
                    <ul className="list-disc pl-5">
                      {block.work_order_block_tasks.map(
                        ({ id, task_type, element_type, tree_type }) => (
                          <li key={id}>
                            {task_type.name} {element_type.name}
                            {tree_type?.species ? `: ${tree_type.species}` : ''}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      <Icon icon="tabler:note" />
                      {format('admin:pages.workOrders.details.notes')}
                    </h4>
                    <p>
                      {block.notes ||
                        format('admin:pages.workOrders.details.noNotes')}
                    </p>
                  </div>
                </div>
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      );
    },
    [format],
  );

  if (isLoading) return <Preloader />;

  const columns = [
    {
      field: 'id',
      header: format('glossary:id'),
      body: (wo: WorkOrder) => `OT-${wo.id}`,
    },
    {
      field: 'date',
      header: format('glossary:date'),
      body: (wo: WorkOrder) => new Date(wo.date).toLocaleDateString(),
    },
    {
      field: 'users',
      header: format('glossary:users'),
      body: (wo: WorkOrder) =>
        wo.users?.length
          ? wo.users
              .map((user: User) => `${user.name} ${user.surname}`)
              .join(', ')
          : format('admin:pages.workOrders.details.noUsers'),
    },
    {
      field: 'status',
      header: format('glossary:status'),
      body: (wo: WorkOrder) => WorkOrderStatusInfoChip({ status: wo.status }),
    },
    {
      field: 'report_status',
      header: format('glossary:report_status'),
      body: (wo: WorkOrder) =>
        WorkReportStatusInfoChip({ status: wo.work_report?.report_status }),
    },
  ];

  if (!selectedContractId || selectedContractId === 0) {
    columns.splice(2, 0, {
      field: 'contract.name',
      header: format('glossary:contract'),
      body: (wo: WorkOrder) => wo.contract.name,
    });
  }

  const customActions = [
    {
      icon: 'tabler:file-text',
      tooltip: format('tooltips.review', 'report', 1),
      className: 'p-button-rounded p-button-info',
      onClick: (wo: WorkOrder) => navigate(`/admin/work-reports/${wo.id}`),
      isVisible: (wo: WorkOrder) => [1, 2, 3].includes(wo.status),
    },
  ];

  return (
    <CrudPanel
      canDelete={canDelete}
      canEdit={canEdit}
      columns={columns}
      customActions={customActions}
      data={workOrders}
      getItemName={getItemName}
      onCreate={handleCreate}
      onDelete={handleDelete}
      onEdit={handleEdit}
      requiresContract
      rowExpansionTemplate={rowExpansionTemplate}
      title="work_order"
    />
  );
}
