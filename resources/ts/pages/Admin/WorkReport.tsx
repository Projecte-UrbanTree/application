import { useState, useEffect, useRef } from 'react';
import axiosClient from '@/api/axiosClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Icon } from '@iconify/react';
import { SplitButton } from 'primereact/splitbutton';
import { Toast } from 'primereact/toast';

interface WorkReport {
  id: number;
  observation: string;
  spent_fuel: number;
  report_status: number;
  report_incidents: string;
  work_order_id: number;
}

const WorkReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [workReport, setWorkReport] = useState<WorkReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const items = [
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: () => {
        toast.current?.show({
          severity: 'success',
          summary: 'Updated',
          detail: 'Data Updated',
        });
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-times',
      command: () => {
        toast.current?.show({
          severity: 'warn',
          summary: 'Delete',
          detail: 'Data Deleted',
        });
      },
    },
    {
      label: 'React Website',
      icon: 'pi pi-external-link',
      command: () => {
        window.location.href = 'https://reactjs.org/';
      },
    },
    {
      label: 'Upload',
      icon: 'pi pi-upload',
      command: () => {
        //router.push('/fileupload');
      },
    },
  ];

  useEffect(() => {
    const fetchWorkReport = async () => {
      try {
        const response = await axiosClient.get(`/admin/work-reports/${id}`);
        setWorkReport(response.data);
        setLoading(false);
      } catch (err) {
        setError(t('admin.pages.error.fetching_data'));
        setLoading(false);
        console.error('Error fetching work report:', err);
      }
    };

    fetchWorkReport();
  }, [id]);

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return t('admin.pages.work_reports.status.pending');
      case 1:
        return t('admin.pages.work_reports.status.in_progress');
      case 2:
        return t('admin.pages.work_reports.status.completed');
      case 3:
        return t('admin.pages.work_reports.status.cancelled');
      default:
        return t('admin.pages.work_reports.status.unknown');
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
        <Card className="w-full max-w-3xl shadow-lg">
          <div className="p-6 text-center">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-red-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">
              {t('admin.pages.error.error')}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              label={t('admin.pages.general.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-reports')}
            />
          </div>
        </Card>
      </div>
    );

  if (!workReport)
    return (
      <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
        <Card className="w-full max-w-3xl shadow-lg">
          <div className="p-6 text-center">
            <Icon
              icon="tabler:alert-circle"
              className="h-16 w-16 text-yellow-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-4">
              {t('admin.pages.work_reports.not_found')}
            </h2>
            <Button
              label={t('admin.pages.general.returnButton')}
              icon="pi pi-arrow-left"
              onClick={() => navigate('/admin/work-reports')}
            />
          </div>
        </Card>
      </div>
    );

  return (
    <div className="flex items-center justify-center bg-gray-50 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/work-reports')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.work_reports.title')} #{workReport.id}
          </h2>
        </header>
        <div className="pt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('admin.pages.work_reports.details')}
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {t('admin.pages.work_reports.columns.observation')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {workReport.observation || 'N/A'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {t('admin.pages.work_reports.columns.spent_fuel')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {workReport.spent_fuel} L
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    {t('admin.pages.work_reports.columns.status')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        workReport.report_status === 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : workReport.report_status === 1
                            ? 'bg-blue-100 text-blue-800'
                            : workReport.report_status === 2
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}>
                      {getStatusText(workReport.report_status)}
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    {t('admin.pages.work_reports.columns.incidents')}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {workReport.report_incidents || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="card flex justify-end mt-4">
            <Toast ref={toast}></Toast>
            <SplitButton
              label="Save"
              icon="pi pi-plus"
              model={items}
              severity="contrast"
              rounded
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkReportDetail;
