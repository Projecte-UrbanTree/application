import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import DashboardSummary from './Components/DashboardSummary';
import InProgressWorkOrders from './Components/InProgressWorkOrders';
import Welcome from './Components/Welcome';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Welcome />
      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
        <div className="lg:col-span-2">
          <InProgressWorkOrders />
        </div>
        <div>
          <Card className="mb-6 lg:mb-8 border border-gray-300 bg-gray-50 rounded shadow-sm">
            <div className="text-lg mb-4 text-gray-800">
              {t('admin.pages.dashboard.quickActions')}
            </div>
            <div className="flex flex-col gap-4">
              <Button
                label={t('admin.pages.dashboard.createWorkOrder')}
                icon={<Icon icon="tabler:plus" />}
                className="w-full text-gray-800"
                onClick={() => navigate('/admin/work-orders/create')}
              />
              <Button
                label={t('admin.pages.dashboard.manageUsers')}
                icon={<Icon icon="tabler:user" />}
                className="w-full text-gray-800"
                onClick={() => navigate('/admin/settings/users')}
              />
              <Button
                label={t('admin.pages.dashboard.reviewReports')}
                icon={<Icon icon="tabler:file-text" />}
                className="w-full text-gray-800"
                onClick={() => navigate('/admin/work-orders')}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
