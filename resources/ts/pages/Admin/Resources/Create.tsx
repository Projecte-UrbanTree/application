import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';
import type { ResourceType } from '@/types/ResourceType';

export default function CreateResource() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const { data } = await axiosClient.get(`/admin/resources/create`);
        setResourceTypes(data.resource_types);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    fetchResourceTypes();
  }, []);

  const initialValues = {
    name: '',
    description: '',
    resource_type_id: 0,
    unit_cost: 0,
    unit_name: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('admin.pages.resources.form.validation.name_required'))
      .min(3, t('admin.pages.resources.form.validation.name_min'))
      .max(50, t('admin.pages.resources.form.validation.name_max'))
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin.pages.resources.form.validation.name_format'),
      ),
    description: Yup.string().max(
      255,
      t('admin.pages.resources.form.validation.description_max'),
    ),
    resource_type_id: Yup.number()
      .required(t('admin.pages.resources.form.validation.type_required'))
      .positive(t('admin.pages.resources.form.validation.type_invalid')),
    unit_cost: Yup.number()
      .min(0, t('admin.pages.resources.form.validation.unit_cost_min'))
      .required(t('admin.pages.resources.form.validation.unit_cost_required')),
    unit_name: Yup.string().required(
      t('admin.pages.resources.form.validation.unit_name_required'),
    ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      await axiosClient.post('/admin/resources', values);
      showToast(
        'success',
        t('admin.pages.resources.list.messages.createSuccess'),
      );
      navigate('/admin/resources');
    } catch (error) {
      console.error(error);
      showToast('error', t('admin.pages.resources.list.messages.error'));
    }
    setIsSubmitting(false);
  };

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
          onClick={() => navigate('/admin/resources')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.resources.form.title.create')}
        </h2>
      </div>

      <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
        <div className="p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:resource" className="h-5 w-5 mr-2" />
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
                    <Icon icon="tabler:note" className="h-5 w-5 mr-2" />
                    {t('admin.fields.description')}
                  </label>
                  <Field
                    name="description"
                    as={InputText}
                    placeholder={t('admin.fields.description')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:category" className="h-5 w-5 mr-2" />
                    {t('admin.fields.resource_type')}
                  </label>
                  <Field
                    name="resource_type_id"
                    as={Dropdown}
                    options={resourceTypes}
                    optionLabel="name"
                    optionValue="id"
                    placeholder={t('admin.fields.select_resource_type')}
                    className={
                      errors.resource_type_id && touched.resource_type_id
                        ? 'p-invalid'
                        : ''
                    }
                  />
                  {errors.resource_type_id && touched.resource_type_id && (
                    <small className="p-error">{errors.resource_type_id}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon
                      icon="tabler:currency-euro"
                      className="h-5 w-5 mr-2"
                    />
                    {t('admin.fields.unit_cost')}
                  </label>
                  <Field
                    name="unit_cost"
                    as={InputText}
                    type="number"
                    placeholder={t('admin.fields.unit_cost')}
                    className={
                      errors.unit_cost && touched.unit_cost ? 'p-invalid' : ''
                    }
                  />
                  {errors.unit_cost && touched.unit_cost && (
                    <small className="p-error">{errors.unit_cost}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:ruler" className="h-5 w-5 mr-2" />
                    {t('admin.fields.unit_name')}
                  </label>
                  <Field
                    name="unit_name"
                    as={InputText}
                    placeholder={t('admin.fields.unit_name')}
                    className={
                      errors.unit_name && touched.unit_name ? 'p-invalid' : ''
                    }
                  />
                  {errors.unit_name && touched.unit_name && (
                    <small className="p-error">{errors.unit_name}</small>
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
                        ? t('admin.pages.resources.form.submittingText.create')
                        : t('admin.pages.resources.form.submitButton.create')
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
