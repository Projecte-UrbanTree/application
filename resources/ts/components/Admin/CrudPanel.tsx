import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Panel } from 'primereact/panel';
import React, { useState } from 'react';

// Interfaces para acciones personalizadas
interface CustomAction {
  icon: string;
  tooltip: string;
  className?: string;
  onClick: (rowData: any) => void;
  isVisible?: (rowData: any) => boolean;
}

type ColumnDefinition =
  | string
  | {
      field: string;
      header: string;
      body?: (item: any) => React.ReactNode;
      sortable?: boolean;
      [key: string]: any;
    };

interface CrudPanelProps {
  title: string;
  onCreate?: () => void;
  createButtonLabel?: string;
  createDisabled?: boolean;
  createTooltip?: string;
  requiresContract?: boolean;
  children?: React.ReactNode;
  data?: any[];
  columns: ColumnDefinition[];
  onEdit?: (id: number) => void;
  onDelete?: (rowData: any) => void;
  canEdit?: (rowData: any) => boolean;
  canDelete?: (rowData: any) => boolean;
  customActions?: CustomAction[];
  getItemName?: (item: any) => string;
  rowExpansionTemplate?: (data: any) => React.ReactNode;
  expandedRows?: any;
  onRowToggle?: (e: any) => void;
  [key: string]: any;
}

export default function CrudPanel({
  canDelete,
  canEdit,
  children,
  columns,
  createDisabled = false,
  createTooltip,
  customActions = [],
  data,
  getItemName,
  onCreate,
  onDelete,
  onEdit,
  requiresContract = false,
  rowExpansionTemplate,
  title,
  ...otherParams
}: CrudPanelProps) {
  const { t, format } = useI18n();
  const { selectedContractId } = useAuth();
  const [expandedRows, setExpandedRows] = useState<any>({});

  const processedColumns = columns.map((col) => {
    if (typeof col === 'string') {
      return {
        field: col,
        header: format(`glossary:${col}`),
        sortable: true,
      };
    }
    col.sortable = col.sortable ?? true;
    return col;
  });

  const renderTable = () => {
    if (!data || !columns) return children;

    return (
      <DataTable
        className="p-datatable-sm"
        dataKey="id"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        paginator
        removableSort
        rowExpansionTemplate={rowExpansionTemplate}
        rows={10}
        showGridlines
        stripedRows
        value={data}
        {...otherParams}>
        {!!rowExpansionTemplate && (
          <Column
            expander
            style={{ width: '3rem' }}
            className="expander-column"
          />
        )}

        {processedColumns.map((col, i) => (
          <Column key={i} {...col} />
        ))}

        {(onEdit || onDelete || customActions.length > 0) && (
          <Column
            header={format('glossary:actions')}
            body={(rowData) => (
              <div className="flex justify-center gap-2">
                {onEdit && (!canEdit || canEdit(rowData)) && (
                  <Button
                    icon={<Icon icon="tabler:edit" className="h-5 w-5" />}
                    className="p-button-rounded p-button-info"
                    tooltip={format({
                      key: 'tooltips.edit',
                      options: {
                        item: getItemName ? getItemName(rowData) : rowData.id,
                      },
                      formatOptions: ['question', 'capitalize'],
                    })}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => onEdit(rowData.id)}
                  />
                )}

                {onDelete && (!canDelete || canDelete(rowData)) && (
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-rounded p-button-danger"
                    tooltip={format({
                      key: 'tooltips.delete',
                      options: {
                        item: getItemName ? getItemName(rowData) : rowData.id,
                      },
                      formatOptions: ['question', 'capitalize'],
                    })}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => onDelete(rowData)}
                  />
                )}

                {customActions.map((action, index) => {
                  if (action.isVisible && !action.isVisible(rowData)) {
                    return null;
                  }

                  return (
                    <Button
                      key={index}
                      icon={<Icon icon={action.icon} className="h-5 w-5" />}
                      className={`p-button-rounded ${action.className || 'p-button-secondary'}`}
                      tooltip={format({
                        key: action.tooltip,
                        formatOptions: ['question'],
                      })}
                      tooltipOptions={{ position: 'top' }}
                      onClick={() => action.onClick(rowData)}
                    />
                  );
                })}
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
            {format({
              key: title,
              options: { count: data?.length || 0 },
              formatOptions: ['capitalize', 'interval'],
            })}
          </div>
          {onCreate && (
            <div>
              <Button
                onClick={onCreate}
                disabled={
                  requiresContract ? !selectedContractId : createDisabled
                }
                tooltip={
                  requiresContract && !selectedContractId
                    ? t('tooltips.select_contract')
                    : createTooltip
                }
                tooltipOptions={{ position: 'left' }}>
                <Icon icon="tabler:plus" inline className="mr-1" />
                {format('actions.create_new')}
              </Button>
            </div>
          )}
        </div>
      }>
      {renderTable()}
    </Panel>
  );
}
