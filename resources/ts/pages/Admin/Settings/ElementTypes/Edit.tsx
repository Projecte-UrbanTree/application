import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

export default function EditElementType() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconList, setIconList] = useState<string[]>([]);

  useEffect(() => {
    const fetchElementType = async () => {
      try {
        const response = await axiosClient.get(`/admin/element-types/${id}`);
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
    setIsSubmitting(true);
    try {
      const updatedValues = {
        ...values,
        requires_tree_type: values.requires_tree_type ? 1 : 0,
      };
      await axiosClient.put(`/admin/element-types/${id}`, updatedValues);
      showToast('success', t('admin.pages.elementTypes.update'));
      navigate('/admin/settings/element-types');
    } catch (error) {
      showToast('error', t('admin.pages.elementTypes.error'));
    }
    setIsSubmitting(false);
  };

  const booleanOptions = [
    { label: t('admin.pages.elementTypes.true'), value: true },
    { label: t('admin.pages.elementTypes.false'), value: false },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <ProgressSpinner
          style={{ width: '50px', height: '50px' }}
          strokeWidth="4"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
          className="p-button-text mr-3"
          onClick={() => navigate('/admin/settings/element-types')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.elementTypes.edit.title')}
        </h2>
      </div>

      <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
        <div className="p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize>
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    {t('admin.fields.name')}
                  </label>
                  <Field
                    name="name"
                    as={InputText}
                    placeholder={t('admin.fields.name')}
                    className={errors.name && touched.name ? 'p-invalid' : ''}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                    {t(
                      'admin.pages.elementTypes.create.placeholders.requires_tree_type',
                    )}
                  </label>
                  <Field
                    name="requires_tree_type"
                    render={({ field, form }: { field: any; form: any }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        options={booleanOptions}
                        onChange={(e) =>
                          form.setFieldValue(field.name, e.value)
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
                  {errors.requires_tree_type && touched.requires_tree_type && (
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
                    {t(
                      'admin.pages.elementTypes.create.placeholders.description',
                    )}
                  </label>
                  <Field
                    name="description"
                    as={InputTextarea}
                    rows={5}
                    placeholder={t(
                      'admin.pages.elementTypes.create.placeholders.description',
                    )}
                    className={
                      errors.description && touched.description
                        ? 'p-invalid'
                        : ''
                    }
                  />
                  {errors.description && touched.description && (
                    <small className="p-error">{errors.description}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:icon" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.create.placeholders.icon')}
                  </label>
                  <Field
                    name="icon"
                    render={({ field, form }: { field: any; form: any }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        options={iconList.map((icon) => ({
                          label: t('admin.pages.elementTypes.icons.' + icon),
                          value: icon,
                        }))}
                        onChange={(e) =>
                          form.setFieldValue(field.name, e.value)
                        }
                        placeholder={t(
                          'admin.pages.elementTypes.create.placeholders.icon',
                        )}
                        filter
                        filterBy="label"
                        itemTemplate={(option) => (
                          <div className="flex align-items-center">
                            <Icon
                              icon={'mdi:' + option.value}
                              className="mr-2 text-2xl"
                            />
                            <span>{option.label}</span>
                          </div>
                        )}
                        valueTemplate={(option) =>
                          option ? (
                            <div className="flex align-items-center">
                              <Icon
                                icon={'mdi:' + option.value}
                                className="mr-2 text-2xl"
                              />
                              <span>{option.label}</span>
                            </div>
                          ) : null
                        }
                        className={
                          errors.icon && touched.icon ? 'p-invalid' : ''
                        }
                      />
                    )}
                  />
                  {errors.icon && touched.icon && (
                    <small className="p-error">{errors.icon}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:palette" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.create.placeholders.color')}
                  </label>
                  <Field
                    name="color"
                    render={({ field, form }: { field: any; form: any }) => (
                      <ColorPicker
                        id={field.name}
                        value={field.value}
                        onChange={(e) =>
                          form.setFieldValue(field.name, e.value)
                        }
                        className={
                          errors.color && touched.color ? 'p-invalid' : ''
                        }
                      />
                    )}
                  />
                  {errors.color && touched.color && (
                    <small className="p-error">{errors.color}</small>
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end mt-6">
                  <Button
                    type="submit"
                    severity="info"
                    disabled={isSubmitting}
                    className="p-button-sm"
                    icon={isSubmitting ? 'pi pi-spin pi-spinner' : undefined}
                    label={
                      isSubmitting
                        ? t('admin.pages.elementTypes.edit.submittingText')
                        : t('admin.pages.elementTypes.edit.submitButton')
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    </>
  );
}
