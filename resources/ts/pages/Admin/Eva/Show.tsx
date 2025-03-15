import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

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

    const factorEstadoArbol = [
        { range: [0, 24], message: t('Bajo'), color: '#6AA84F' },
        { range: [25, 49], message: t('Moderado'), color: '#00FF00' },
        { range: [50, 74], message: t('Alto'), color: '#FFFF00' },
        { range: [75, 100], message: t('Critico'), color: '#FF0000' },
    ];
    const getStatusMessage = (status: number) => {
        const percentage = (status / 36) * 100;
        const factor = factorEstadoArbol.find(
            (f) => percentage >= f.range[0] && percentage <= f.range[1],
        );
        return factor ? factor : { message: t('Pendiente'), color: 'gray' };
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Icon
                    icon="eos-icons:loading"
                    className="h-8 w-8 animate-spin text-blue-600"
                />
                <span className="mt-2 text-blue-600">
                    {t('general.loading')}
                </span>
            </div>
        );
    }

    if (!eva) {
        return <p>{t('not_found')}</p>;
    }
    const { message, color } = getStatusMessage(eva.status);
    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button
                        className="p-button-text mr-4"
                        style={{ color: '#fff' }}
                        onClick={() => navigate('/admin/evas')}>
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t('Calculo de Indices')} - {eva.element_id}
                    </h2>
                </header>
                <div className="p-6">
                    <p>
                        <strong>{t('Factor estado del arbol')}:</strong>{' '}
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
                    <p>
                        <strong>{t('date_birth')}:</strong> {eva.date_birth}
                    </p>
                    <p>
                        <strong>{t('height')}:</strong> {eva.height}
                    </p>
                    <p>
                        <strong>{t('diameter')}:</strong> {eva.diameter}
                    </p>
                    <p>
                        <strong>{t('crown_width')}:</strong> {eva.crown_width}
                    </p>
                    <p>
                        <strong>{t('crown_projection_area')}:</strong>{' '}
                        {eva.crown_projection_area}
                    </p>
                    <p>
                        <strong>{t('root_surface_diameter')}:</strong>{' '}
                        {eva.root_surface_diameter}
                    </p>
                    <p>
                        <strong>{t('effective_root_area')}:</strong>{' '}
                        {eva.effective_root_area}
                    </p>
                    <p>
                        <strong>{t('height_estimation')}:</strong>{' '}
                        {eva.height_estimation}
                    </p>
                    <p>
                        <strong>{t('unbalanced_crown')}:</strong>{' '}
                        {eva.unbalanced_crown}
                    </p>
                    <p>
                        <strong>{t('overextended_branches')}:</strong>{' '}
                        {eva.overextended_branches}
                    </p>
                    <p>
                        <strong>{t('cracks')}:</strong> {eva.cracks}
                    </p>
                    <p>
                        <strong>{t('dead_branches')}:</strong>{' '}
                        {eva.dead_branches}
                    </p>
                    <p>
                        <strong>{t('inclination')}:</strong> {eva.inclination}
                    </p>
                    <p>
                        <strong>{t('V_forks')}:</strong> {eva.V_forks}
                    </p>
                    <p>
                        <strong>{t('cavities')}:</strong> {eva.cavities}
                    </p>
                    <p>
                        <strong>{t('bark_damage')}:</strong> {eva.bark_damage}
                    </p>
                    <p>
                        <strong>{t('soil_lifting')}:</strong> {eva.soil_lifting}
                    </p>
                    <p>
                        <strong>{t('cut_damaged_roots')}:</strong>{' '}
                        {eva.cut_damaged_roots}
                    </p>
                    <p>
                        <strong>{t('basal_rot')}:</strong> {eva.basal_rot}
                    </p>
                    <p>
                        <strong>{t('exposed_surface_roots')}:</strong>{' '}
                        {eva.exposed_surface_roots}
                    </p>
                    <p>
                        <strong>{t('wind')}:</strong> {eva.wind}
                    </p>
                    <p>
                        <strong>{t('drought')}:</strong> {eva.drought}
                    </p>
                    <p>
                        <strong>{t('status')}:</strong> {eva.status}
                    </p>
                </div>
            </Card>
        </div>
    );
}
