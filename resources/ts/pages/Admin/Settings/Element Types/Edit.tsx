import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { InputTextarea } from 'primereact/inputtextarea';

export default function EditElementType() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [initialValues, setInitialValues] = useState<{
        name: string;
        requires_tree_type: boolean;
        description: string;
        icon: string;
        color: string;
    }>({
        name: '',
        requires_tree_type: false,
        description: '',
        icon: '',
        color: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [iconList, setIconList] = useState<string[]>([]);

    useEffect(() => {
        const fetchElementType = async () => {
            try {
                const response = await axiosClient.get(
                    `/admin/element-types/${id}`,
                );
                const elementType = response.data;
                const responseIcons = await axiosClient.get(
                    '/admin/element-types/icons',
                );
                const iconList = responseIcons.data;
                setIconList(iconList);

                setInitialValues({
                    name: elementType.name,
                    requires_tree_type: elementType.requires_tree_type === 1,
                    description: elementType.description ?? '',
                    icon: elementType.icon,
                    color: elementType.color,
                });

                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchElementType();
    }, [id]);

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const response = await axiosClient.get(
                    '/admin/element-types/icons',
                );
                setIconList(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchIcons();
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().required(
            t('admin.pages.elementTypes.edit.validations.name_required'),
        ),
        requires_tree_type: Yup.boolean().required(
            t('admin.pages.elementTypes.edit.validations.requires_tree_type'),
        ),
        description: Yup.string(),
        icon: Yup.string().required(
            t('admin.pages.elementTypes.edit.validations.icon_required'),
        ),
        color: Yup.string().required(
            t('admin.pages.elementTypes.edit.validations.color_required'),
        ),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const updatedValues = {
                ...values,
                requires_tree_type: values.requires_tree_type ? 1 : 0,
            };
            await axiosClient.put(`/admin/element-types/${id}`, updatedValues);
            navigate('/admin/settings/element-types', {
                state: { success: t('admin.pages.elementTypes.update') },
            });
        } catch (error) {
            navigate('/admin/settings/element-types', {
                state: { error: t('admin.pages.elementTypes.error') },
            });
        }
    };

    const booleanOptions = [
        { label: t('admin.fields.true'), value: true },
        { label: t('admin.fields.false'), value: false },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Icon
                    icon="eos-icons:loading"
                    className="h-8 w-8 animate-spin text-blue-600"
                />
                <span className="mt-2 text-blue-600">
                    {t('admin.pages.elementTypes.loading')}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
            <Card className="w-full max-w-3xl shadow-lg">
                <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
                    <Button
                        className="p-button-text mr-4"
                        style={{ color: '#fff' }}
                        onClick={() =>
                            navigate('/admin/settings/element-types')
                        }>
                        <Icon icon="tabler:arrow-left" className="h-6 w-6" />
                    </Button>
                    <h2 className="text-white text-3xl font-bold">
                        {t('admin.pages.elementTypes.edit.title')}
                    </h2>
                </header>
                <div className="p-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize>
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon
                                            icon="tabler:tag"
                                            className="h-5 w-5 mr-2"
                                        />
                                        {t('admin.fields.name')}
                                    </label>
                                    <Field
                                        name="name"
                                        as={InputText}
                                        placeholder={t('admin.fields.name')}
                                        className={
                                            errors.name && touched.name
                                                ? 'p-invalid'
                                                : ''
                                        }
                                    />
                                    {errors.name && touched.name && (
                                        <small className="p-error">
                                            {errors.name}
                                        </small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon
                                            icon="tabler:tree"
                                            className="h-5 w-5 mr-2"
                                        />
                                        {t('admin.fields.requires_tree_type')}
                                    </label>
                                    <Field
                                        name="requires_tree_type"
                                        render={({
                                            field,
                                            form,
                                        }: {
                                            field: any;
                                            form: any;
                                        }) => (
                                            <Dropdown
                                                id={field.name}
                                                value={field.value}
                                                options={booleanOptions}
                                                onChange={(e) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        e.value,
                                                    )
                                                }
                                                className={
                                                    errors.requires_tree_type &&
                                                    touched.requires_tree_type
                                                        ? 'p-invalid'
                                                        : ''
                                                }
                                            />
                                        )}
                                    />
                                    {errors.requires_tree_type &&
                                        touched.requires_tree_type && (
                                            <small className="p-error">
                                                {errors.requires_tree_type}
                                            </small>
                                        )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon
                                            icon="tabler:file-description"
                                            className="h-5 w-5 mr-2"
                                        />
                                        {t('admin.fields.description')}
                                    </label>
                                    <Field
                                        name="description"
                                        as={InputTextarea}
                                        rows={5}
                                        placeholder={t(
                                            'admin.fields.description',
                                        )}
                                        className={
                                            errors.description &&
                                            touched.description
                                                ? 'p-invalid'
                                                : ''
                                        }
                                    />
                                    {errors.description &&
                                        touched.description && (
                                            <small className="p-error">
                                                {errors.description}
                                            </small>
                                        )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon
                                            icon="tabler:icon"
                                            className="h-5 w-5 mr-2"
                                        />
                                        {t('admin.fields.icon')}
                                    </label>
                                    <Field
                                        name="icon"
                                        render={({
                                            field,
                                            form,
                                        }: {
                                            field: any;
                                            form: any;
                                        }) => (
                                            <Dropdown
                                                id={field.name}
                                                value={field.value}
                                                options={iconList.map(
                                                    (icon) => ({
                                                        label: t(
                                                            'admin.icons.' +
                                                                icon,
                                                        ),
                                                        value: icon,
                                                    }),
                                                )}
                                                onChange={(e) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        e.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'admin.pages.elementTypes.create.placeholders.icon',
                                                )}
                                                filter
                                                filterBy="label"
                                                itemTemplate={(option) => (
                                                    <div className="flex align-items-center">
                                                        <Icon
                                                            icon={
                                                                'mdi:' +
                                                                option.value
                                                            }
                                                            className="mr-2 text-2xl"
                                                        />
                                                        <span>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                )}
                                                valueTemplate={(option) =>
                                                    option ? (
                                                        <div className="flex align-items-center">
                                                            <Icon
                                                                icon={
                                                                    'mdi:' +
                                                                    option.value
                                                                }
                                                                className="mr-2 text-2xl"
                                                            />
                                                            <span>
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                    ) : null
                                                }
                                                className={
                                                    errors.icon && touched.icon
                                                        ? 'p-invalid'
                                                        : ''
                                                }
                                            />
                                        )}
                                    />
                                    {errors.icon && touched.icon && (
                                        <small className="p-error">
                                            {errors.icon}
                                        </small>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Icon
                                            icon="tabler:palette"
                                            className="h-5 w-5 mr-2"
                                        />
                                        {t('admin.fields.color')}
                                    </label>
                                    <Field
                                        name="color"
                                        render={({
                                            field,
                                            form,
                                        }: {
                                            field: any;
                                            form: any;
                                        }) => (
                                            <ColorPicker
                                                id={field.name}
                                                value={field.value}
                                                onChange={(e) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        e.value,
                                                    )
                                                }
                                                className={
                                                    errors.color &&
                                                    touched.color
                                                        ? 'p-invalid'
                                                        : ''
                                                }
                                            />
                                        )}
                                    />
                                    {errors.color && touched.color && (
                                        <small className="p-error">
                                            {errors.color}
                                        </small>
                                    )}
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
                                                ? t(
                                                      'admin.pages.elementTypes.edit.submittingText',
                                                  )
                                                : t(
                                                      'admin.pages.elementTypes.edit.submitButton',
                                                  )
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
