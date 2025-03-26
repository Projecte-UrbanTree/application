import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  itemName: string;
}

export default function ActionButtons({
  onEdit,
  onDelete,
  itemName,
}: ActionButtonsProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex justify-center gap-2">
      {onEdit && (
        <Button
          icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
          className="p-button-rounded p-button-info"
          tooltip={i18n.format(
            t('tooltips.edit', { item: itemName }),
            'capitalize',
          )}
          tooltipOptions={{ position: 'top' }}
          onClick={onEdit}
        />
      )}
      {onDelete && (
        <Button
          icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
          className="p-button-rounded p-button-danger"
          tooltip={i18n.format(
            t('tooltips.delete', { item: itemName }),
            'capitalize',
          )}
          tooltipOptions={{ position: 'top' }}
          onClick={onDelete}
        />
      )}
    </div>
  );
}
