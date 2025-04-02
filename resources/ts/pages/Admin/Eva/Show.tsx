import Preloader from '@/components/Preloader';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Eva {
  element_id: number;
  date_birth: string;
  height: number;
  diameter: number;
  crown_width: number;
  crown_projection_area: number;
  root_surface_diameter: number;
  effective_root_area: number;
  height_estimation: number;
  unbalanced_crown: number;
  overextended_branches: number;
  cracks: number;
  dead_branches: number;
  inclination: number;
  V_forks: number;
  cavities: number;
  bark_damage: number;
  soil_lifting: number;
  cut_damaged_roots: number;
  basal_rot: number;
  exposed_surface_roots: number;
  wind: number;
  drought: number;
  status: number;
}

export default function ShowEva() {
  const { id } = useParams<{ id: string }>();
  const [eva, setEva] = useState<Eva | null>(null);
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () =>
      await api
        .get(`/admin/evas/${id}`)
        .then(({ data }) => setEva(data))
        .finally(() => setIsLoading(false)))();
  }, [id]);

  const getStatusMessage = (status: number) => {
    const percentage = (status / 36) * 100;
    if (percentage == 0 && percentage <= 24) {
      return { message: t('admin:pages.evas.status.low'), color: '#6AA84F' };
    }
    if (percentage >= 25 && percentage <= 49) {
      return {
        message: t('admin:pages.evas.status.moderate'),
        color: '#00FF00',
      };
    }
    if (percentage >= 50 && percentage <= 74) {
      return { message: t('admin:pages.evas.status.high'), color: '#FFFF00' };
    }
    if (percentage >= 75 && percentage <= 100) {
      return {
        message: t('admin:pages.evas.status.critical'),
        color: '#FF0000',
      };
    }
    return { message: t('admin:pages.evas.status.pending'), color: 'gray' };
  };

  const calculateStabilityIndex = (height: number, diameter: number) => {
    const index = (height / diameter) * 100;
    if (index < 50) {
      return {
        message: t('admin:pages.evas.stability.stable'),
        color: '#6AA84F',
      };
    } else if (index >= 50 && index <= 80) {
      return {
        message: t('admin:pages.evas.stability.moderate'),
        color: '#00FF00',
      };
    } else if (index > 80) {
      return {
        message: t('admin:pages.evas.stability.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin:pages.evas.stability.pending'),
        color: 'gray',
      };
    }
  };

  const calculateGravityHeightRatio = (
    heightEstimation: number,
    height: number,
  ) => {
    const ratio = heightEstimation / height;
    if (ratio < 0.3) {
      return {
        message: t('admin:pages.evas.gravityHeight.veryStable'),
        color: '#6AA84F',
      };
    } else if (ratio >= 0.3 && ratio <= 0.5) {
      return {
        message: t('admin:pages.evas.gravityHeight.moderateRisk'),
        color: '#00FF00',
      };
    } else if (ratio > 0.5) {
      return {
        message: t('admin:pages.evas.gravityHeight.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin:pages.evas.gravityHeight.pending'),
        color: 'gray',
      };
    }
  };

  const calculateRootCrownRatio = (
    effective_root_area: number,
    crown_projection_area: number,
  ) => {
    const ratio = effective_root_area / crown_projection_area;
    if (ratio > 2) {
      return {
        message: t('admin:pages.evas.rootCrown.veryStable'),
        color: '#6AA84F',
      };
    } else if (ratio > 1.5 && ratio <= 2) {
      return {
        message: t('admin:pages.evas.rootCrown.stable'),
        color: '#00FF00',
      };
    } else if (ratio > 1 && ratio <= 1.5) {
      return {
        message: t('admin:pages.evas.rootCrown.moderateStability'),
        color: '#FFFF00',
      };
    } else if (ratio <= 1) {
      return {
        message: t('admin:pages.evas.rootCrown.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin:pages.evas.rootCrown.pending'),
        color: 'gray',
      };
    }
  };

  const calculateWindStabilityIndex = (
    height: number,
    wind: number,
    rootSurfaceDiameter: number,
  ) => {
    const index = (height * wind) / rootSurfaceDiameter;
    if (index < 0.5) {
      return {
        message: t('admin:pages.evas.windStability.veryStable'),
        color: '#6AA84F',
      };
    } else if (index >= 0.5 && index <= 1) {
      return {
        message: t('admin:pages.evas.windStability.moderateStability'),
        color: '#FFFF00',
      };
    } else if (index > 1) {
      return {
        message: t('admin:pages.evas.windStability.highRisk'),
        color: '#FF0000',
      };
    } else {
      return {
        message: t('admin:pages.evas.windStability.pending'),
        color: 'gray',
      };
    }
  };

  const getSeverityMessage = (value: number) => {
    switch (value) {
      case 0:
        return {
          message: t('admin:pages.evas.severity.low'),
          color: '#6AA84F',
        };
      case 1:
        return {
          message: t('admin:pages.evas.severity.moderate'),
          color: '#00FF00',
        };
      case 2:
        return {
          message: t('admin:pages.evas.severity.high'),
          color: '#FFFF00',
        };
      case 3:
        return {
          message: t('admin:pages.evas.severity.extreme'),
          color: '#FF0000',
        };
      default:
        return {
          message: t('admin:pages.evas.severity.pending'),
          color: 'gray',
        };
    }
  };

  if (isLoading) return <Preloader />;

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
              {t('admin:pages.evas.show.title')}
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
                {t('admin:pages.evas.indexCalculation')}
              </h1>
              <p className="mb-4">
                <strong>{t('admin:pages.evas.treeStatusFactor')}:</strong>{' '}
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
                <strong>{t('admin:pages.evas.stabilityIndex')}:</strong>{' '}
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
                <strong>{t('admin:pages.evas.gravityHeightRatio')}:</strong>{' '}
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
                <strong>{t('admin:pages.evas.rootCrownRatio')}:</strong>{' '}
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
                <strong>{t('admin:pages.evas.windStabilityIndex')}:</strong>{' '}
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
                {t('admin:pages.evas.environmentalFactors')}
              </h1>
              <p className="mb-4">
                <strong>{t('admin:pages.evas.windExposure')}:</strong>{' '}
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
                <strong>{t('admin:pages.evas.droughtExposure')}:</strong>{' '}
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
