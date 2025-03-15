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
                    <Column field="element_id" header={'Especie'} />
                    <Column field="height" header={'Coordenadas'} />
                    <Column
                        header={'Age'}
                        body={(rowData: { date_birth: string }) => (
                            <span>{calculateAge(rowData.date_birth)}</span>
                        )}
                    />
                    <Column field="" header={'Status'} />
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
                                            icon="tabler:edit"
                                            className="h-5 w-5"
                                        />
                                    }
                                    className="p-button-rounded p-button-info"
                                    tooltip={t(
                                        'admin.pages.evas.list.actions.edit',
                                    )}
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() =>
                                        navigate(
                                            `/admin/evas/edit/${rowData.id}`,
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
