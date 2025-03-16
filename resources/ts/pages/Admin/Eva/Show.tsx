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

    const getStatusMessage = (status: number) => {
        const percentage = (status / 36) * 100;
        if (percentage == 0 && percentage <= 24) {
            return { message: t('Bajo'), color: '#6AA84F' };
        }
        if (percentage >= 25 && percentage <= 49) {
            return { message: t('Moderado'), color: '#00FF00' };
        }
        if (percentage >= 50 && percentage <= 74) {
            return { message: t('Alto'), color: '#FFFF00' };
        }
        if (percentage >= 75 && percentage <= 100) {
            return { message: t('Critico'), color: '#FF0000' };
        }
        return { message: t('Pendiente'), color: 'gray' };
    };

    const calculateStabilityIndex = (height: number, diameter: number) => {
        const index = height / diameter;
        if (index < 50) {
            return { message: t('Estable'), color: '#6AA84F' };
        } else if (index >= 50 && index <= 80) {
            return { message: t('Moderada'), color: '#FFFF00' };
        } else if (index > 80 && index <= 100) {
            return { message: t('Riesgo alto'), color: '#FF0000' };
        } else {
            return { message: t('Pendiente'), color: 'gray' };
        }
    };

    const calculateGravityHeightRatio = (
        heightEstimation: number,
        height: number,
    ) => {
        const ratio = heightEstimation / height;
        if (ratio < 0.3) {
            return { message: t('Muy estable'), color: '#6AA84F' };
        } else if (ratio >= 0.3 && ratio <= 0.5) {
            return { message: t('Riesgo moderado'), color: '#FFFF00' };
        } else if (ratio > 0.5) {
            return { message: t('Alto riesgo de caída'), color: '#FF0000' };
        } else {
            return { message: t('Pendiente'), color: 'gray' };
        }
    };

    const calculateRootCrownRatio = (
        rootSurfaceDiameter: number,
        crownProjectionArea: number,
    ) => {
        const ratio = rootSurfaceDiameter / crownProjectionArea;
        if (ratio > 2) {
            return { message: t('Muy estable'), color: '#6AA84F' };
        } else if (ratio > 1.5 && ratio <= 2) {
            return { message: t('Estable'), color: '#00FF00' };
        } else if (ratio > 1 && ratio <= 1.5) {
            return { message: t('Estabilidad moderada'), color: '#FFFF00' };
        } else if (ratio <= 1) {
            return { message: t('Riesgo alto de caída'), color: '#FF0000' };
        } else {
            return { message: t('Pendiente'), color: 'gray' };
        }
    };

    const calculateWindStabilityIndex = (
        height: number,
        wind: number,
        rootSurfaceDiameter: number,
    ) => {
        const index = (height * wind) / rootSurfaceDiameter;
        if (index < 0.5) {
            return { message: t('Muy estable'), color: '#6AA84F' };
        } else if (index >= 0.5 && index <= 1) {
            return { message: t('Estabilidad moderada'), color: '#FFFF00' };
        } else if (index > 1) {
            return { message: t('Alto riesgo de vuelco'), color: '#FF0000' };
        } else {
            return { message: t('Pendiente'), color: 'gray' };
        }
    };

    const getSeverityMessage = (value: number) => {
        switch (value) {
            case 0:
                return { message: t('Bajo'), color: '#6AA84F' };
            case 1:
                return { message: t('Moderado'), color: '#00FF00' };
            case 2:
                return { message: t('Alto'), color: '#FFFF00' };
            case 3:
                return { message: t('Extremo'), color: '#FF0000' };
            default:
                return { message: t('Pendiente'), color: 'gray' };
        }
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
    const stabilityIndex = calculateStabilityIndex(eva.height, eva.diameter);
    const gravityHeightRatio = calculateGravityHeightRatio(
        eva.height_estimation,
        eva.height,
    );
    const rootCrownRatio = calculateRootCrownRatio(
        eva.root_surface_diameter,
        eva.crown_projection_area,
    );
    const windStabilityIndex = calculateWindStabilityIndex(
        eva.height,
        eva.wind,
        eva.root_surface_diameter,
    );

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
                        {t('Show')} - {eva.element_id}
                    </h2>
                </header>
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">
                        Calculo de Indices
                    </h1>
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
                        <strong>{t('Índice de esbeltez (H/D)')}:</strong>{' '}
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
                    <p>
                        <strong>
                            {t('Relación Centro de Gravedad / Altura (CG/H)')}:
                        </strong>{' '}
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
                    <p>
                        <strong>
                            {t(
                                'Relación Superficie Radicular vs. Proyección de Copa (SR/SC)',
                            )}
                            :
                        </strong>{' '}
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
                    <p>
                        <strong>
                            {t('Índice de Vulnerabilidad al Viento (WSI)')}:
                        </strong>{' '}
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
                    <h1 className="text-xl font-bold mt-6 mb-4">
                        Factores Ambientales
                    </h1>
                    <p>
                        <strong>{t('Exposicion al viento')}:</strong>{' '}
                        <span
                            style={{
                                backgroundColor: getSeverityMessage(eva.wind)
                                    .color,
                                color: 'black',
                                padding: '2px 4px',
                                borderRadius: '4px',
                            }}>
                            {getSeverityMessage(eva.wind).message}
                        </span>{' '}
                    </p>
                    <p>
                        <strong>{t('Exposicion a la sequia')}:</strong>{' '}
                        <span
                            style={{
                                backgroundColor: getSeverityMessage(eva.drought)
                                    .color,
                                color: 'black',
                                padding: '2px 4px',
                                borderRadius: '4px',
                            }}>
                            {getSeverityMessage(eva.drought).message}
                        </span>{' '}
                    </p>
                </div>
            </Card>
        </div>
    );
}
