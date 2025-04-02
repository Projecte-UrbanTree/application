import CrudPanel from '@/components/Admin/CrudPanel';
import Preloader from '@/components/Preloader';
import useCrudData from '@/hooks/useCrudData';
import useI18n from '@/hooks/useI18n';
import type { Eva } from '@/types/Eva';
import { differenceInMonths, differenceInYears } from 'date-fns';

export default function Evas() {
  const { format } = useI18n();

  const {
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items: evas,
  } = useCrudData<Required<Eva>>({
    endpoint: '/admin/evas',
    getItemName: (eva) => eva.element?.element_type?.name || `Eva ${eva.id}`,
    createPath: '/admin/evas/create',
    editPath: (id) => `/admin/evas/${id}`,
  });

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const years = differenceInYears(today, birthDate);
    const months = differenceInMonths(today, birthDate) % 12;
    if (years === 0) {
      return `${months} ${format('month', months)}`;
    }
    return `${years} ${format('year', years)}, ${months} ${format('month', months)}`;
  };

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

    const calculateStabilityIndex = (height: number, diameter: number) => {
      const index = height / diameter;
      if (index < 50) return 0;
      else if (index >= 50 && index <= 80) return 2;
      else if (index > 80 && index <= 100) return 3;
      else return -1;
    };

    const calculateGravityHeightRatio = (
      heightEstimation: number,
      height: number,
    ) => {
      const ratio = heightEstimation / height;
      if (ratio < 0.3) return 0;
      else if (ratio >= 0.3 && ratio <= 0.5) return 2;
      else if (ratio > 0.5) return 3;
      else return -1;
    };

    const calculateRootCrownRatio = (
      rootSurfaceDiameter: number,
      crownProjectionArea: number,
    ) => {
      const ratio = rootSurfaceDiameter / crownProjectionArea;
      if (ratio > 2) return 0;
      else if (ratio > 1.5 && ratio <= 2) return 1;
      else if (ratio > 1 && ratio <= 1.5) return 2;
      else if (ratio <= 1) return 3;
      else return -1;
    };

    const calculateWindStabilityIndex = (
      height: number,
      crown_width: number,
      rootSurfaceDiameter: number,
    ) => {
      const index = (height * crown_width) / rootSurfaceDiameter;
      if (index < 0.5) return 0;
      else if (index >= 0.5 && index <= 1) return 2;
      else if (index > 1) return 3;
      else return -1;
    };

    const indices = [
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

    const allValues = [...statusValues, ...indices];

    if (allValues.some((element) => String(element) === '3')) return '#FF0000';
    else if (allValues.some((element) => String(element) === '2'))
      return '#FFFF00';
    else if (allValues.some((element) => String(element) === '1'))
      return '#00FF00';
    else if (allValues.some((element) => String(element) === '0'))
      return '#6AA84F';
    else return 'gray';
  };

  if (isLoading) return <Preloader />;

  const columns = [
    {
      field: 'element.element_type.name',
      header: format('glossary:name'),
      body: (rowData: Eva) => (
        <span>{rowData.element?.element_type?.name || 'N/A'}</span>
      ),
    },
    {
      field: 'element.point',
      header: format('glossary:coordinates'),
      body: (rowData: Eva) => (
        <span>
          {rowData.element?.point
            ? `${rowData.element.point.latitude}, ${rowData.element.point.longitude}`
            : 'N/A'}
        </span>
      ),
    },
    {
      field: 'date_birth',
      header: format('glossary:age'),
      body: (rowData: Eva) => <span>{calculateAge(rowData.date_birth)}</span>,
    },
    {
      field: 'status',
      header: format('glossary:status'),
      body: (rowData: Eva) => (
        <div
          style={{
            backgroundColor: getStatusColor(rowData),
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
          }}
        />
      ),
    },
  ];

  return (
    <CrudPanel
      columns={columns}
      data={evas}
      getItemName={getItemName}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      requiresContract
      title="eva"
    />
  );
}
