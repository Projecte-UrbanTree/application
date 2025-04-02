import Preloader from '@/components/Preloader';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import type { ResourceType } from '@/types/ResourceType';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export default function CreateResource() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        const { data } = await api.get(`/admin/resources/create`);
        setResourceTypes(data.resource_types);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
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
      .required(t('admin:pages.resources.form.validation.name_required'))
      .min(3, t('admin:pages.resources.form.validation.name_min'))
      .max(50, t('admin:pages.resources.form.validation.name_max'))
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin:pages.resources.form.validation.name_format'),
      ),
    description: Yup.string().max(
      255,
      t('admin:pages.resources.form.validation.description_max'),
    ),
    resource_type_id: Yup.number()
      .required(t('admin:pages.resources.form.validation.type_required'))
      .positive(t('admin:pages.resources.form.validation.type_invalid')),
    unit_cost: Yup.number()
      .min(0, t('admin:pages.resources.form.validation.unit_cost_min'))
      .required(t('admin:pages.resources.form.validation.unit_cost_required')),
    unit_name: Yup.string().required(
      t('admin:pages.resources.form.validation.unit_name_required'),
    ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/admin/resources', values);
      navigate('/admin/resources', {
        state: {
          success: t('admin:pages.resources.list.messages.createSuccess'),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Preloader />;

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/resources')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin:pages.resources.form.title.create')}
          </h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:resource" className="h-5 w-5 mr-2" />
                    {t('admin:fields.name')}
                  </label>
                  <Field
                    name="name"
                    as={InputText}
                    placeholder={t('admin:fields.name')}
                    className={errors.name && touched.name ? 'p-invalid' : ''}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:note" className="h-5 w-5 mr-2" />
                    {t('admin:fields.description')}
                  </label>
                  <Field
                    name="description"
                    as={InputText}
                    placeholder={t('admin:fields.description')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:category" className="h-5 w-5 mr-2" />
                    {t('admin:fields.resource_type')}
                  </label>
                  <Field
                    name="resource_type_id"
                    as={Dropdown}
                    options={resourceTypes}
                    optionLabel="name"
                    optionValue="id"
                    placeholder={t('admin:fields.select_resource_type')}
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
                    {t('admin:fields.unit_cost')}
                  </label>
                  <Field
                    name="unit_cost"
                    as={InputText}
                    type="number"
                    placeholder={t('admin:fields.unit_cost')}
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
                    {t('admin:fields.unit_name')}
                  </label>
                  <Field
                    name="unit_name"
                    as={InputText}
                    placeholder={t('admin:fields.unit_name')}
                    className={
                      errors.unit_name && touched.unit_name ? 'p-invalid' : ''
                    }
                  />
                  {errors.unit_name && touched.unit_name && (
                    <small className="p-error">{errors.unit_name}</small>
                  )}
                </div>
                <div className="md:col-span-2 flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                    icon={
                      isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'
                    }
                    label={
                      isSubmitting
                        ? t('admin:pages.resources.form.submittingText.create')
                        : t('admin:pages.resources.form.submitButton.create')
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
