import { Icon } from '@iconify/react';
import { differenceInMonths, differenceInYears } from 'date-fns';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import CrudPanel from '@/components/CrudPanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Evas() {
  const [isLoading, setIsLoading] = useState(true);
  interface Eva {
    id: number;
    element_id: number;
    date_birth: string;
    height: number;
    diameter: number;
    crown_width: number;
    crown_projection_area: number;
    root_surface_diameter: number;
    effective_root_area: number;
    height_estimation: number;
    unbalanced_crown: string;
    overextended_branches: string;
    cracks: string;
    dead_branches: string;
    inclination: string;
    V_forks: string;
    cavities: string;
    bark_damage: string;
    soil_lifting: string;
    cut_damaged_roots: string;
    basal_rot: string;
    exposed_surface_roots: string;
    wind: string;
    drought: string;
    status: number;
    element: {
      point: {
        latitude: number;
        longitude: number;
      };
      element_type: {
        name: string;
      };
    };
  }

  const [evas, setEvas] = useState<Eva[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentContract = useSelector(
    (state: RootState) => state.contract.currentContract,
  );
  const successMsg = location.state?.success;
  const errorMsg = location.state?.error;
  const [msg, setMsg] = useState<string | null>(successMsg || errorMsg || null);

  useEffect(() => {
    const fetchEvas = async () => {
      try {
        const response = await axiosClient.get('/admin/evas', {
          params: { contract_id: currentContract?.id || 0 },
        });
        setEvas(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchEvas();
  }, [currentContract]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleDelete = async (evaId: number) => {
    if (!window.confirm(t('admin.pages.evas.list.messages.deleteConfirm')))
      return;
    try {
      await axiosClient.delete(`/admin/evas/${evaId}`);
      setEvas(evas.filter((eva) => eva.id !== evaId));
      setMsg(t('admin.pages.evas.list.messages.deleteSuccess'));
    } catch (error) {
      console.error(error);
    }
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const years = differenceInYears(today, birthDate);
    const months = differenceInMonths(today, birthDate) % 12;

    if (years === 0) {
      return `${months} ${t('admin.pages.evas.age.months')}`;
    }

    return `${years} ${t('admin.pages.evas.age.years')}, ${months} ${t('admin.pages.evas.age.months')}`;
  };

  const calculateIndices = (eva: Eva) => {
    const calculateStabilityIndex = (height: number, diameter: number) => {
      const index = height / diameter;
      if (index < 50) {
        return 0;
      } else if (index >= 50 && index <= 80) {
        return 2;
      } else if (index > 80 && index <= 100) {
        return 3;
      } else {
        return -1;
      }
    };

    const calculateGravityHeightRatio = (
      heightEstimation: number,
      height: number,
    ) => {
      const ratio = heightEstimation / height;
      if (ratio < 0.3) {
        return 0;
      } else if (ratio >= 0.3 && ratio <= 0.5) {
        return 2;
      } else if (ratio > 0.5) {
        return 3;
      } else {
        return -1;
      }
    };

    const calculateRootCrownRatio = (
      rootSurfaceDiameter: number,
      crownProjectionArea: number,
    ) => {
      const ratio = rootSurfaceDiameter / crownProjectionArea;
      if (ratio > 2) {
        return 0;
      } else if (ratio > 1.5 && ratio <= 2) {
        return 1;
      } else if (ratio > 1 && ratio <= 1.5) {
        return 2;
      } else if (ratio <= 1) {
        return 3;
      } else {
        return -1;
      }
    };

    const calculateWindStabilityIndex = (
      height: number,
      crown_width: number,
      rootSurfaceDiameter: number,
    ) => {
      const index = (height * crown_width) / rootSurfaceDiameter;
      if (index < 0.5) {
        return 0;
      } else if (index >= 0.5 && index <= 1) {
        return 2;
      } else if (index > 1) {
        return 3;
      } else {
        return -1;
      }
    };

    return [
      calculateStabilityIndex(eva.height, eva.diameter),
      calculateGravityHeightRatio(eva.height_estimation, eva.height),
      calculateRootCrownRatio(
        eva.root_surface_diameter,
        eva.crown_projection_area,
      ),
      calculateWindStabilityIndex(
        eva.height,
        eva.crown_width,
        eva.root_surface_diameter,
      ),
    ];
  };

  const CRITICAL = '3';
  const HIGH = '2';
  const MODERATE = '1';
  const LOW = '0';

  const getStatusColor = (eva: Eva) => {
    const statusValues = [
      eva.unbalanced_crown,
      eva.overextended_branches,
      eva.cracks,
      eva.dead_branches,
      eva.inclination,
      eva.V_forks,
      eva.cavities,
      eva.bark_damage,
      eva.soil_lifting,
      eva.cut_damaged_roots,
      eva.basal_rot,
      eva.exposed_surface_roots,
      eva.wind,
      eva.drought,
      eva.status,
    ];

    const indices = calculateIndices(eva);
    const allValues = [...statusValues, ...indices];

    if (allValues.some((element) => String(element) === CRITICAL)) {
      return '#FF0000';
    } else if (allValues.some((element) => String(element) === HIGH)) {
      return '#FFFF00';
    } else if (allValues.some((element) => String(element) === MODERATE)) {
      return '#00FF00';
    } else if (allValues.some((element) => String(element) === LOW)) {
      return '#6AA84F';
    } else {
      return 'gray';
    }
  };

  const getStatusIcon = (eva: Eva) => {
    const statusValues = [
      eva.unbalanced_crown,
      eva.overextended_branches,
      eva.cracks,
      eva.dead_branches,
      eva.inclination,
      eva.V_forks,
      eva.cavities,
      eva.bark_damage,
      eva.soil_lifting,
      eva.cut_damaged_roots,
      eva.basal_rot,
      eva.exposed_surface_roots,
      eva.wind,
      eva.drought,
      eva.status,
    ];

    const indices = calculateIndices(eva);
    const allValues = [...statusValues, ...indices];

    if (allValues.some((element) => String(element) === CRITICAL)) {
      return 'tabler:x';
    } else if (allValues.some((element) => String(element) === HIGH)) {
      return 'tabler:alert-circle';
    }
    return 'tabler:check';
  };

  return (
    <>
      {msg && (
        <Message
          severity={
            successMsg ||
            msg === t('admin.pages.evas.list.messages.deleteSuccess')
              ? 'success'
              : 'error'
          }
          text={msg}
          className="mb-4 w-full"
        />
      )}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <ProgressSpinner
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
          />
        </div>
      ) : evas.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-600">{t('admin.pages.evas.list.noData')}</p>
          <Button
            label={t('admin.pages.evas.list.actions.create')}
            onClick={() => navigate('/admin/evas/create')}
            className="mt-2"
          />
        </div>
      ) : (
        <CrudPanel
          title={t('admin.pages.evas.title')}
          onCreate={() => navigate('/admin/evas/create')}>
          <DataTable
            value={evas}
            paginator
            rows={10}
            stripedRows
            showGridlines
            className="p-datatable-sm">
            <Column
              header={t('admin.pages.evas.columns.name')}
              body={(rowData: Eva) => (
                <span>{rowData.element_id || 'N/A'}</span>
              )}
            />
            <Column
              header={t('admin.pages.evas.columns.age')}
              body={(rowData: Eva) => (
                <span>{calculateAge(rowData.date_birth)}</span>
              )}
            />
            <Column
              field="status"
              header={t('admin.pages.evas.columns.status')}
              body={(rowData: Eva) => (
                <Icon
                  icon={getStatusIcon(rowData)}
                  className="h-5 w-5 mx-auto"
                  style={{ color: getStatusColor(rowData) }}
                />
              )}
            />
            <Column
              header={t('admin.pages.evas.columns.actions')}
              body={(rowData: Eva) => (
                <div className="flex justify-center gap-2">
                  <Button
                    icon={<Icon icon="tabler:eye" className="h-5 w-5" />}
                    className="p-button-outlined p-button-indigo p-button-sm"
                    tooltip={t('admin.pages.evas.list.actions.show')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => navigate(`/admin/evas/${rowData.id}`)}
                  />
                  <Button
                    icon={<Icon icon="tabler:trash" className="h-5 w-5" />}
                    className="p-button-outlined p-button-danger p-button-sm"
                    tooltip={t('admin.pages.evas.list.actions.delete')}
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => handleDelete(rowData.id)}
                  />
                </div>
              )}
            />
          </DataTable>
        </CrudPanel>
      )}
    </>
  );
}
