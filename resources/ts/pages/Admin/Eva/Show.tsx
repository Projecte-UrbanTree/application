import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { useTreeEvaluation, Eva } from '@/components/FuncionesEva';

export default function ShowEva() {
  const { id } = useParams<{ id: string }>();
  const [eva, setEva] = useState<Eva | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const {
    getStatusMessage,
    calculateStabilityIndex,
    calculateGravityHeightRatio,
    calculateRootCrownRatio,
    calculateWindStabilityIndex,
    getSeverityMessage,
  } = useTreeEvaluation();

  useEffect(() => {
    const fetchEva = async () => {
      try {
        const response = await axiosClient.get(`/admin/evas/${id}`);
        setEva(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchEva();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Icon
          icon="eos-icons:loading"
          className="h-8 w-8 animate-spin text-blue-600"
        />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );
  }

  if (!eva) {
    return <p>{t('not_found')}</p>;
  }

  const { message, color } = getStatusMessage(eva.status);
  const stabilityIndex = calculateStabilityIndex(eva.height, eva.diameter);
  const gravityHeightRatio = calculateGravityHeightRatio(
    eva.height_estimation,
    eva.height,
  );
  const rootCrownRatio = calculateRootCrownRatio(
    eva.effective_root_area,
    eva.crown_projection_area,
  );
  const windStabilityIndex = calculateWindStabilityIndex(
    eva.height,
    eva.crown_width,
    eva.effective_root_area,
  );

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center justify-between -mt-6 -mx-6 rounded-t-lg">
          <div className="flex items-center">
            <Button
              className="p-button-text mr-4"
              style={{ color: '#fff' }}
              onClick={() => navigate('/admin/evas')}>
              <Icon icon="tabler:arrow-left" className="h-6 w-6" />
            </Button>
            <h2 className="text-white text-3xl font-bold">
              {t('admin.pages.evas.show.title')}
            </h2>
          </div>
          <Button
            className="p-button-text"
            style={{ color: '#fff' }}
            onClick={() => navigate(`/admin/evas/edit/${id}`)}>
            <Icon icon="tabler:edit" className="h-6 w-6" />
          </Button>
        </header>
        <div className="p-6">
          <div className="bg-gray-200 rounded-lg border-2 border-gray-300">
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4 underline">
                {t('admin.pages.evas.indexCalculation')}
              </h1>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.treeStatusFactor')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {message}
                </span>{' '}
              </p>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.stabilityIndex')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: stabilityIndex.color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {stabilityIndex.message}
                </span>{' '}
              </p>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.gravityHeightRatio')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: gravityHeightRatio.color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {gravityHeightRatio.message}
                </span>{' '}
              </p>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.rootCrownRatio')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: rootCrownRatio.color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {rootCrownRatio.message}
                </span>{' '}
              </p>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.windStabilityIndex')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: windStabilityIndex.color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {windStabilityIndex.message}
                </span>{' '}
              </p>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg mt-4 border-2 border-gray-300">
            <div className="p-4">
              <h1 className="text-xl font-bold mb-4 underline">
                {t('admin.pages.evas.environmentalFactors')}
              </h1>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.windExposure')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: getSeverityMessage(eva.wind).color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {getSeverityMessage(eva.wind).message}
                </span>{' '}
              </p>
              <p className="mb-4">
                <strong>{t('admin.pages.evas.droughtExposure')}:</strong>{' '}
                <span
                  style={{
                    backgroundColor: getSeverityMessage(eva.drought).color,
                    color: 'black',
                    padding: '2px 4px',
                    borderRadius: '4px',
                  }}>
                  {getSeverityMessage(eva.drought).message}
                </span>{' '}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
