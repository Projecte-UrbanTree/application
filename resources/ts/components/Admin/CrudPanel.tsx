import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CrudPanelProps {
  title: string;
  onCreate?: () => void;
  createButtonLabel?: string;
  createDisabled?: boolean;
  createTooltip?: string;
  children?: React.ReactNode;
  data?: any[];
  columns?: {
    field: string;
    header: string;
    body?: (rowData: any) => React.ReactNode;
  }[];
  onEdit?: (id: number) => void;
  onDelete?: (rowData: any) => void;
  getItemName?: (item: any) => string;
  [key: string]: any;
}

export default function CrudPanel({
  title,
  onCreate,
  createDisabled = false,
  createTooltip,
  children,
  data,
  columns,
  onEdit,
  onDelete,
  getItemName,
  ...params
}: CrudPanelProps) {
  const { t, i18n } = useTranslation();

  const renderTable = () => {
    if (!data || !columns) return children;

    return (
      <DataTable
        value={data}
        paginator
        rows={10}
        stripedRows
        showGridlines
        className="p-datatable-sm"
        {...params}>
        {columns.map((col) => (
          <Column key={col.field} {...col} />
        ))}
        {(onEdit || onDelete) && (
          <Column
            header={t('_capitalize', { val: t('glossary:actions') })}
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                {['edit', 'delete'].map((action) => (
                  <Button
                    key={action}
                    icon={
                      <Icon
                        icon={`tabler:${action === 'edit' ? 'edit' : 'trash'}`}
                        className="h-5 w-5"
                      />
                    }
                    className={`p-button-rounded ${action === 'edit' ? 'p-button-info' : 'p-button-danger'}`}
                    tooltip={i18n.format(
                      t(`tooltips.${action}`, {
                        item: getItemName ? getItemName(rowData) : rowData.id,
                      }),
                      'capitalize',
                    )}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() =>
                      action === 'edit'
                        ? onEdit && onEdit(rowData.id)
                        : onDelete && onDelete(rowData)
                    }
                  />
                ))}
              </div>
            )}
          />
        )}
      </DataTable>
    );
  };

  return (
    <Panel
      headerTemplate={
        <div className="bg-gray-50 border border-gray-200 px-6 py-4 flex justify-between items-center rounded">
          <div className="text-xl font-bold text-gray-700">
            {i18n.format(title, 'capitalize')}
          </div>
          {onCreate && (
            <div>
              <Button
                onClick={onCreate}
                disabled={createDisabled}
                tooltip={createTooltip}
                tooltipOptions={{ position: 'left' }}>
                <Icon icon="tabler:plus" inline className="mr-1" />
                {t('_capitalize', { val: t('actions.create_new') })}
              </Button>
            </div>
          )}
        </div>
      }>
      {renderTable()}
    </Panel>
  );
}
