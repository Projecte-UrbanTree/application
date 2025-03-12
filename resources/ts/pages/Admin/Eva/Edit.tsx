import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import FormField from '@/components/FormField';
import {
    differenceInYears,
    differenceInMonths,
    subYears,
    subMonths,
    format,
} from 'date-fns';

export default function EditEva() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [initialValues, setInitialValues] = useState({
        element_id: 0,
        date_birth: '',
        years: 0,
        months: 0,
        height: 0,
        diameter: 0,
        crown_width: 0,
        crown_projection_area: 0,
        root_surface_diameter: 0,
        effective_root_area: 0,
        height_estimation: 0,
        unbalanced_crown: 0,
        overextended_branches: 0,
        cracks: 0,
        dead_branches: 0,
        inclination: 0,
        V_forks: 0,
        cavities: 0,
        bark_damage: 0,
        soil_lifting: 0,
        cut_damaged_roots: 0,
        basal_rot: 0,
        exposed_surface_roots: 0,
        wind: 0,
        drought: 0,
        status: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEva = async () => {
            try {
                const response = await axiosClient.get(`/admin/evas/${id}`);
                const data = response.data;
                setInitialValues(data);
                setIsLoading(false);

                const today = new Date();
                const birthDate = new Date(data.date_birth);
                const years = differenceInYears(today, birthDate);
                const months = differenceInMonths(today, birthDate) % 12;
                setInitialValues({
                    ...data,
                    years,
                    months,
                });
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchEva();
    }, [id]);

    const validationSchema = Yup.object({
        element_id: Yup.number(),
        date_birth: Yup.date(),
        years: Yup.number().min(0),
        months: Yup.number().min(0).max(11),
        height: Yup.number(),
        diameter: Yup.number(),
        crown_width: Yup.number(),
        crown_projection_area: Yup.number(),
        root_surface_diameter: Yup.number(),
        effective_root_area: Yup.number(),
        height_estimation: Yup.number(),
        unbalanced_crown: Yup.number(),
        overextended_branches: Yup.number(),
        cracks: Yup.number(),
        dead_branches: Yup.number(),
        inclination: Yup.number(),
        V_forks: Yup.number(),
        cavities: Yup.number(),
        bark_damage: Yup.number(),
        soil_lifting: Yup.number(),
        cut_damaged_roots: Yup.number(),
        basal_rot: Yup.number(),
        exposed_surface_roots: Yup.number(),
        wind: Yup.number(),
        drought: Yup.number(),
        status: Yup.number(),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const today = new Date();
            const birthDate = subMonths(
                subYears(today, values.years),
                values.months,
            );
            const formattedDate = format(birthDate, 'yyyy-MM-dd'); // Formato para el backend

            // Actualizar los valores con la fecha convertida
            const updatedValues = {
                ...values,
                date_birth: formattedDate,
            };

            await axiosClient.put(`/admin/evas/${id}`, values);
            navigate('/admin/evas', {
                state: { success: t('messages.updateSuccess') },
            });
        } catch (error) {
            navigate('/admin/evas', { state: { error: t('messages.error') } });
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

    const booleanOptions = [
        { label: 'True', value: true },
        { label: 'False', value: false },
    ];

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
                        {t('admin.eva.editTitle')}
                    </h2>
                </header>
                <div className="p-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize>
                        {({ isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Sección: Identificación */}
                                <div className="md:col-span-2">
                                    <h1 className="text-xl font-bold mb-4">
                                        Identificación
                                    </h1>
                                    <FormField
                                        name="element_id"
                                        label={t('admin.fields.element_id')}
                                        as="InputText"
                                    />
                                    <FormField
                                        name="years"
                                        label={t('admin.fields.years')}
                                        as="InputNumber"
                                        min={0}
                                    />
                                    <FormField
                                        name="months"
                                        label={t('admin.fields.months')}
                                        as="InputNumber"
                                        min={0}
                                        max={11}
                                    />
                                </div>

                                {/* Sección: Condición del árbol */}
                                <div className="md:col-span-2">
                                    <h1 className="text-xl font-bold mb-4">
                                        Condición del árbol
                                    </h1>

                                    {/* Subsección: Dimensiones */}
                                    <h2 className="text-lg font-semibold mb-2">
                                        Dimensiones
                                    </h2>
                                    <FormField
                                        name="height"
                                        label={t('admin.fields.height')}
                                        as="InputNumber"
                                    />
                                    <FormField
                                        name="diameter"
                                        label={t('admin.fields.diameter')}
                                        as="InputNumber"
                                    />
                                    <FormField
                                        name="crown_width"
                                        label={t('admin.fields.crown_width')}
                                        as="InputNumber"
                                    />
                                    <FormField
                                        name="crown_projection_area"
                                        label={t(
                                            'admin.fields.crown_projection_area',
                                        )}
                                        as="InputNumber"
                                    />
                                    <FormField
                                        name="root_surface_diameter"
                                        label={t(
                                            'admin.fields.root_surface_diameter',
                                        )}
                                        as="InputNumber"
                                    />
                                    <FormField
                                        name="effective_root_area"
                                        label={t(
                                            'admin.fields.effective_root_area',
                                        )}
                                        as="InputNumber"
                                    />
                                    <FormField
                                        name="height_estimation"
                                        label={t(
                                            'admin.fields.height_estimation',
                                        )}
                                        as="InputNumber"
                                    />

                                    {/* Subsección: Estado */}
                                    <h2 className="text-lg font-semibold mt-4 mb-2">
                                        Estado
                                    </h2>

                                    {/* Subsubsección: Copa y Ramas */}
                                    <h3 className="text-md font-medium mb-2">
                                        Copa y Ramas
                                    </h3>
                                    <FormField
                                        name="unbalanced_crown"
                                        label={t(
                                            'admin.fields.unbalanced_crown',
                                        )}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="overextended_branches"
                                        label={t(
                                            'admin.fields.overextended_branches',
                                        )}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="cracks"
                                        label={t('admin.fields.cracks')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="dead_branches"
                                        label={t('admin.fields.dead_branches')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />

                                    {/* Subsubsección: Tronco */}
                                    <h3 className="text-md font-medium mt-4 mb-2">
                                        Tronco
                                    </h3>
                                    <FormField
                                        name="inclination"
                                        label={t('admin.fields.inclination')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="V_forks"
                                        label={t('admin.fields.V_forks')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="cavities"
                                        label={t('admin.fields.cavities')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="bark_damage"
                                        label={t('admin.fields.bark_damage')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />

                                    {/* Subsubsección: Raíces */}
                                    <h3 className="text-md font-medium mt-4 mb-2">
                                        Raíces
                                    </h3>
                                    <FormField
                                        name="soil_lifting"
                                        label={t('admin.fields.soil_lifting')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="cut_damaged_roots"
                                        label={t(
                                            'admin.fields.cut_damaged_roots',
                                        )}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="basal_rot"
                                        label={t('admin.fields.basal_rot')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                    <FormField
                                        name="exposed_surface_roots"
                                        label={t(
                                            'admin.fields.exposed_surface_roots',
                                        )}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                </div>

                                {/* Sección: Condición del entorno */}
                                <div className="md:col-span-2">
                                    <h1 className="text-xl font-bold mt-6 mb-4">
                                        Condición del entorno
                                    </h1>

                                    {/* Subsección: Factores Ambientales */}
                                    <h2 className="text-lg font-semibold mb-2">
                                        Factores Ambientales
                                    </h2>

                                    {/* Subsubsección: Exposición al viento */}
                                    <h3 className="text-md font-medium mb-2">
                                        Exposición al viento
                                    </h3>
                                    <FormField
                                        name="wind"
                                        label={t('admin.fields.wind')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />

                                    {/* Subsubsección: Exposición a la sequía */}
                                    <h3 className="text-md font-medium mt-4 mb-2">
                                        Exposición a la sequía
                                    </h3>
                                    <FormField
                                        name="drought"
                                        label={t('admin.fields.drought')}
                                        as="Dropdown"
                                        options={booleanOptions}
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end mt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto"
                                        icon={
                                            isSubmitting
                                                ? 'pi pi-spin pi-spinner'
                                                : 'pi pi-check'
                                        }
                                        label={
                                            isSubmitting
                                                ? t('admin.eva.saving')
                                                : t('admin.eva.save')
                                        }
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Card>
        </div>
    );
}
