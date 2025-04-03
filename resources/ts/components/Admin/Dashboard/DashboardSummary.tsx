import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SummaryData {
  totalWorkOrders: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  pendingReports: number;
}

export const DashboardSummary = () => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalWorkOrders: 0,
    inProgressWorkOrders: 0,
    completedWorkOrders: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract
  );

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        // Fetch work orders to calculate stats
        const response = await axiosClient.get('/admin/work-orders');
        
        let filteredOrders = response.data;
        if (currentContract && currentContract.id !== 0) {
          filteredOrders = filteredOrders.filter(
            (order: any) => order.contract_id === currentContract.id
          );
        }
        
        // Calculate summary data
        const inProgress = filteredOrders.filter((order: any) => order.status === 1).length;
        const completed = filteredOrders.filter((order: any) => order.status === 2 || order.status === 3).length;
        const pendingReports = filteredOrders.filter((order: any) => {
          return order.status >= 1 && (!order.work_reports || order.work_reports.length === 0 || 
                 (order.work_reports.length > 0 && order.work_reports[order.work_reports.length - 1].report_status === 0));
        }).length;
        
        setSummaryData({
          totalWorkOrders: filteredOrders.length,
          inProgressWorkOrders: inProgress,
          completedWorkOrders: completed,
          pendingReports: pendingReports,
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [currentContract]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white rounded p-6 border border-gray-300">
        <div className="flex items-center">
          <div className="mr-4 text-gray-600">
            <Icon icon="tabler:clipboard-list" width={40} />
          </div>
          <div>
            <h4 className="text-gray-500 text-xs uppercase mb-1">
              {t('admin.pages.dashboard.totalWorkOrders')}
            </h4>
            <div className="text-xl font-bold text-gray-800">{summaryData.totalWorkOrders}</div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded p-6 border border-gray-300">
        <div className="flex items-center">
          <div className="mr-4 text-gray-600">
            <Icon icon="tabler:hourglass" width={40} />
          </div>
          <div>
            <h4 className="text-gray-500 text-xs uppercase mb-1">
              {t('admin.pages.dashboard.inProgressWorkOrders')}
            </h4>
            <div className="text-xl font-bold text-gray-800">{summaryData.inProgressWorkOrders}</div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded p-6 border border-gray-300">
        <div className="flex items-center">
          <div className="mr-4 text-gray-600">
            <Icon icon="tabler:check" width={40} />
          </div>
          <div>
            <h4 className="text-gray-500 text-xs uppercase mb-1">
              {t('admin.pages.dashboard.completedWorkOrders')}
            </h4>
            <div className="text-xl font-bold text-gray-800">{summaryData.completedWorkOrders}</div>
          </div>
        </div>
      </Card>

      <Card className="bg-white rounded p-6 border border-gray-300">
        <div className="flex items-center">
          <div className="mr-4 text-gray-600">
            <Icon icon="tabler:file-alert" width={40} />
          </div>
          <div>
            <h4 className="text-gray-500 text-xs uppercase mb-1">
              {t('admin.pages.dashboard.pendingReports')}
            </h4>
            <div className="text-xl font-bold text-gray-800">{summaryData.pendingReports}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
