import useI18n from '@/hooks/useI18n';
import { WorkReportStatus } from '@/types/WorkReport';
import { Icon } from '@iconify/react';
import { Chip } from 'primereact/chip';

export default function WorkReportStatusInfo({
  status,
}: {
  status?: WorkReportStatus;
}) {
  const statusInfo = {
    [WorkReportStatus.PENDING]: {
      color: 'text-yellow-500',
      icon: '',
      label: 'pending',
      severity: 'warning',
    },
    [WorkReportStatus.COMPLETED]: {
      color: '',
      icon: '',
      label: 'completed',
      severity: 'success',
    },
    [WorkReportStatus.REJECTED]: {
      color: '',
      icon: '',
      label: 'rejected',
      severity: 'danger',
    },
    [WorkReportStatus.CLOSED_WITH_INCIDENTS]: {
      color: '',
      icon: '',
      label: 'closed_with_incidents',
      severity: 'danger',
    },
  };

  return (
    (status !== undefined ? statusInfo[status] : undefined) || {
      color: 'text-gray-500',
      icon: 'mdi:alert-circle-outline',
      label: 'unknown',
      severity: 'secondary',
    }
  );
}

export function WorkReportStatusInfoBadge({
  status,
}: {
  status?: WorkReportStatus;
}) {
  const { label, color } = WorkReportStatusInfo({ status });
  return <span className={`badge ${color}`}>{label}</span>;
}

export function WorkReportStatusInfoChip({
  status,
}: {
  status?: WorkReportStatus;
}) {
  const { format } = useI18n();

  const { label, icon, severity, color } = WorkReportStatusInfo({ status });

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
