import Preloader from '@/components/Preloader';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

export default function EditResourceType() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [initialValues, setInitialValues] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () =>
      await api
        .get(`/admin/resource-types/${id}`)
        .then(({ data }) => setInitialValues(data))
        .finally(() => setIsLoading(false)))();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[a-zA-Z0-9 ]*$/,
        t('admin:pages.resourceTypes.form.validation.name_invalid'),
      )
      .required(t('admin:pages.resourceTypes.form.validation.name_required')),
    description: Yup.string().nullable(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await api.put(`/admin/resource-types/${id}`, values);
      navigate('/admin/settings/resource-types', {
        state: {
          success: t('admin:pages.resourceTypes.list.messages.updateSuccess'),
        },
      });
    } catch (error) {
      navigate('/admin/settings/resource-types', {
        state: { error: t('admin:pages.resourceTypes.list.messages.error') },
      });
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
            onClick={() => navigate('/admin/settings/resource-types')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin:pages.resourceTypes.form.title.edit')}
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
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
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
                    <Icon icon="tabler:info-circle" className="h-5 w-5 mr-2" />
                    {t('admin:fields.description')}
                  </label>
                  <Field
                    name="description"
                    as={InputText}
                    placeholder={t('admin:fields.description')}
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
                        ? t(
                            'admin:pages.resourceTypes.form.submittingText.edit',
                          )
                        : t('admin:pages.resourceTypes.form.submitButton.edit')
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
