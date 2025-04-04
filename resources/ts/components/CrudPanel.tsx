import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Tooltip } from 'primereact/tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CrudPanelProps {
  title: string;
  onCreate?: () => void;
  createButtonLabel?: string;
  createDisabled?: boolean;
  createTooltip?: string;
  children: React.ReactNode;
}

export default function CrudPanel({
  title,
  onCreate,
  createDisabled = false,
  createTooltip,
  children,
}: CrudPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel
      headerTemplate={
        <div className="bg-gray-50 border-b border-gray-300 px-6 py-4 flex justify-between items-center rounded-t-md shadow-sm">
          <div className="text-lg font-semibold text-gray-800">{t(title)}</div>
          {onCreate && (
            <>
              <Tooltip target=".create-button-wrapper" />
              <div
                className="inline-block create-button-wrapper"
                data-pr-tooltip={createTooltip ? t(createTooltip) : undefined}
                data-pr-position="left">
                <Button
                  onClick={onCreate}
                  disabled={createDisabled}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2">
                  <Icon icon="tabler:plus" inline />
                  {t('admin.buttons.createNew')}
                </Button>
              </div>
            </>
          )}
        </div>
      }
      className="bg-white shadow-sm rounded-md border border-gray-300 mb-6">
      <div className="p-6">{children}</div>
    </Panel>
  );
}
