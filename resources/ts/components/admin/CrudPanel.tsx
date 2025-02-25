import React from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface CrudPanelProps {
  title: string;
  onCreate?: () => void;
  createButtonLabel?: string;
  children: React.ReactNode;
}

export default function CrudPanel({
  title,
  onCreate,
  children,
}: CrudPanelProps) {
  const { t } = useTranslation();
  return (
    <Panel
      headerTemplate={
        <div className="bg-gray-50 border border-gray-200 px-6 py-4 flex justify-between items-center rounded">
          <div className="text-xl font-bold text-gray-700">{t(title)}</div>
          {onCreate && (
            <div>
              <Button onClick={onCreate}>
                <Icon icon="tabler:plus" inline />
                {t('admin.buttons.createNew')}
              </Button>
            </div>
          )}
        </div>
      }>
      {children}
    </Panel>
  );
}
