import axiosClient from '@/api/axiosClient';
import type { IResource } from '@/interfaces/IResource';
import type { IResourceType } from '@/interfaces/IResourceType';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

export default function EditResource() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState<IResource>({
    id: 0,
    name: '',
    description: '',
    resource_type_id: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState<IResourceType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourceResponse, typesResponse] = await Promise.all([
          axiosClient.get(`/admin/resources/${id}`),
          axiosClient.get('/admin/resource-types'),
        ]);

        setInitialValues({
          id: resourceResponse.data.id,
          name: resourceResponse.data.name,
          description: resourceResponse.data.description,
          resource_type_id: resourceResponse.data.resource_type_id,
        });

        setResourceTypes(typesResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('admin.pages.resources.form.validation.name_required'))
      .min(3, t('admin.pages.resources.form.validation.name_min'))
      .max(50, t('admin.pages.resources.form.validation.name_max'))
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin.pages.resources.form.validation.name_format')
      ),
    description: Yup.string()
      .max(255, t('admin.pages.resources.form.validation.description_max')),
    resource_type_id: Yup.number()
      .required(t('admin.pages.resources.form.validation.type_required'))
      .positive(t('admin.pages.resources.form.validation.type_invalid')),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const data = { ...values };
      await axiosClient.put(`/admin/resources/${id}`, data);
      navigate('/admin/resources', {
        state: {
          success: t('admin.pages.resources.list.messages.updateSuccess'),
        },
      });
    } catch (error) {
      navigate('/admin/resources', {
        state: { error: t('admin.pages.resources.list.messages.error') },
      });
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Icon
          icon="eos-icons:loading"
          className="h-8 w-8 animate-spin text-blue-600"
        />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
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
            onClick={() => navigate('/admin/resources')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.resources.form.title.edit')}
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
                        ? t('admin.pages.resources.form.submittingText.edit')
                        : t('admin.pages.resources.form.submitButton.edit')
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
