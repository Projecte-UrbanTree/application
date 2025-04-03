import { Welcome } from '@/components/Admin/Dashboard/Welcome';
import { InProgressWorkOrders } from '@/components/Admin/Dashboard/InProgressWorkOrders';
import { DashboardSummary } from '@/components/Admin/Dashboard/DashboardSummary';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Welcome />
      <DashboardSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
        <div className="lg:col-span-2">
          <InProgressWorkOrders />
        </div>
        <div>
          <Card className="mb-6 lg:mb-8 border border-gray-200 bg-gray-50 rounded shadow-sm">
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
                onClick={() => navigate('/admin/users')}
              />
              <Button
                label={t('admin.pages.dashboard.reviewReports')}
                icon={<Icon icon="tabler:file-text" />}
                className="w-full text-gray-800"
                onClick={() => navigate('/admin/reports')}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
