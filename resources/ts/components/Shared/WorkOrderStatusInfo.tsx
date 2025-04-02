import useI18n from '@/hooks/useI18n';
import { WorkOrderStatus } from '@/types/WorkOrder';
import { Icon } from '@iconify/react';
import { Chip } from 'primereact/chip';

export default function WorkOrderStatusInfo({
  status,
}: {
  status: WorkOrderStatus;
}) {
  const statusInfo = {
    [WorkOrderStatus.NOT_STARTED]: {
      color: 'text-yellow-500',
      icon: 'mdi:clock-outline',
      label: 'not_started',
      severity: 'danger',
    },
    [WorkOrderStatus.IN_PROGRESS]: {
      color: 'text-blue-500',
      icon: 'mdi:progress-clock',
      label: 'in_progress',
      severity: 'warning',
    },
    [WorkOrderStatus.COMPLETED]: {
      color: 'text-green-500',
      icon: 'mdi:check-circle-outline',
      label: 'completed',
      severity: 'success',
    },
    [WorkOrderStatus.REPORT_SENT]: {
      color: 'text-gray-500',
      icon: 'mdi:close-circle-outline',
      label: 'report_sent',
      severity: 'info',
    },
  };

  return (
    statusInfo[status] || {
      label: 'unknown',
      severity: 'secondary',
      color: 'text-gray-500',
    }
  );
}

export function WorkOrderStatusInfoBadge({
  status,
}: {
  status: WorkOrderStatus;
}) {
  const { label, color } = WorkOrderStatusInfo({ status });
  return <span className={`badge ${color}`}>{label}</span>;
}

export function WorkOrderStatusInfoChip({
  status,
}: {
  status: WorkOrderStatus;
}) {
  const { format } = useI18n();
  const { label, icon, severity, color } = WorkOrderStatusInfo({ status });
  return (
    <Chip
      label={format(`states.${label}`)}
      icon={
        <Icon
          icon={icon}
          style={{ color }}
          className="mr-1"
          width="18"
          height="18"
        />
      }
      className={`bg-${severity}-100 text-${severity}-800`}
    />
  );
}
