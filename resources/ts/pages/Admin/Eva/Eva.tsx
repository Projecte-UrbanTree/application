import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import CrudPanel from '@/components/Admin/CrudPanel';
import { Icon } from '@iconify/react';
import { differenceInYears, differenceInMonths } from 'date-fns';

export default function Evas() {
    const [isLoading, setIsLoading] = useState(true);
    interface Eva {
        id: number;
        element_id: string;
        date_birth: string;
        height: string;
        diameter: string;
        crown_width: string;
        crown_projection_area: string;
        root_surface_diameter: string;
        effective_root_area: string;
        height_estimation: string;
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
                coordinates: string;
            };
            treeType: {
                species: string;
            };
        };
    }

    const [evas, setEvas] = useState<Eva[]>([]);
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const successMsg = location.state?.success;
    const errorMsg = location.state?.error;
    const [msg, setMsg] = useState<string | null>(
        successMsg || errorMsg || null,
    );

    const statusOptions = [
        { label: t('admin.status.active'), value: 0, color: 'yellow' },
        { label: t('admin.status.inactive'), value: 1, color: 'red' },
        { label: t('admin.status.completed'), value: 2, color: 'green' },
    ];

    useEffect(() => {
        const fetchEvas = async () => {
            try {
                const response = await axiosClient.get('/admin/evas');
                setEvas(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchEvas();
    }, []);

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
        if (years == 0) {
            return `${months} ${t('admin.pages.evas.age.months')}`;
        }

        return `${years} ${t('admin.pages.evas.age.years')}, ${months} ${t('admin.pages.evas.age.months')}`;
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
            wind: number,
            rootSurfaceDiameter: number,
        ) => {
            const index = (height * wind) / rootSurfaceDiameter;
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

        const indices = [
            calculateStabilityIndex(
                parseFloat(eva.height),
                parseFloat(eva.diameter),
            ),
            calculateGravityHeightRatio(
                parseFloat(eva.height_estimation),
                parseFloat(eva.height),
            ),
            calculateRootCrownRatio(
                parseFloat(eva.root_surface_diameter),
                parseFloat(eva.crown_projection_area),
            ),
            calculateWindStabilityIndex(
                parseFloat(eva.height),
                parseFloat(eva.wind),
                parseFloat(eva.root_surface_diameter),
            ),
        ];

        const allValues = [...statusValues, ...indices];

        if (allValues.some((element) => String(element) === '3')) {
            return '#FF0000';
        } else if (allValues.some((element) => String(element) === '2')) {
            return '#FFFF00';
        } else if (allValues.some((element) => String(element) === '1')) {
            return '#00FF00';
        } else if (allValues.some((element) => String(element) === '0')) {
            return '#6AA84F';
        } else {
            return 'gray';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <ProgressSpinner
                    style={{ width: '50px', height: '50px' }}
                    strokeWidth="4"
                />
                <span className="mt-2 text-blue-600">
                    {t('general.loading')}
                </span>
            </div>
        );
    }

    return (
        <>
            {msg && (
                <Message
                    severity={
                        successMsg ||
                        msg ===
                            t('admin.pages.evas.list.messages.deleteSuccess')
                            ? 'success'
                            : 'error'
                    }
                    text={msg}
                    className="mb-4 w-full"
                />
            )}
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
                        field="element.treeType.species"
                        header={'Especie'}
                    />
                    <Column
                        field="element.point.coordinates"
                        header={'Coordenadas'}
                    />
                    <Column
                        header={'Age'}
                        body={(rowData: { date_birth: string }) => (
                            <span>{calculateAge(rowData.date_birth)}</span>
                        )}
                    />
                    <Column
                        field="status"
                        header={'Status'}
                        body={(rowData: Eva) => (
                            <div
                                style={{
                                    backgroundColor: getStatusColor(rowData),
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'inline-block',
                                }}
                            />
                        )}
                    />
                    <Column
                        header={'Actions'}
                        body={(rowData: { id: number }) => (
                            <div className="flex justify-center gap-2">
                                <Button
                                    icon={
                                        <Icon
                                            icon="tabler:eye"
                                            className="h-5 w-5"
                                        />
                                    }
                                    className="p-button-rounded p-button-info"
                                    tooltip={t(
                                        'admin.pages.evas.list.actions.show',
                                    )}
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() =>
                                        navigate(
                                            `/admin/evas/show/${rowData.id}`,
                                        )
                                    }
                                />
                                <Button
                                    icon={
                                        <Icon
                                            icon="tabler:trash"
                                            className="h-5 w-5"
                                        />
                                    }
                                    className="p-button-rounded p-button-danger"
                                    tooltip={t(
                                        'admin.pages.evas.list.actions.delete',
                                    )}
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => handleDelete(rowData.id)}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </CrudPanel>
        </>
    );
}
