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
        <div className="bg-gray-50 border border-gray-200 px-6 py-4 flex justify-between items-center rounded">
          <div className="text-xl font-bold text-gray-700">{t(title)}</div>
          {onCreate && (
            <>
              <Tooltip target=".create-button-wrapper" />
              <div
                className="inline-block create-button-wrapper"
                data-pr-tooltip={createTooltip ? t(createTooltip) : undefined}
                data-pr-position="left">
                <Button onClick={onCreate} disabled={createDisabled}>
                  <Icon icon="tabler:plus" inline />
                  {t('admin.buttons.createNew')}
                </Button>
              </div>
            </>
          )}
        </div>
      }>
      {children}
    </Panel>
  );
}
