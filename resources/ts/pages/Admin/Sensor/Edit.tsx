import axiosClient from '@/api/axiosClient';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

export default function EditSensor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState<Sensor>({
    id: 0,
    eui: '',
    name: '',
    longitude: '',
    latitude: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get(`/admin/sensors/${id}/edit`);
        setInitialValues(data.sensor);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validationSchema = Yup.object({
    eui: Yup.string()
      .required(t('admin.pages.sensors.form.validation.eui_required'))
      .max(255, t('admin.pages.sensors.form.validation.eui_max')),
    name: Yup.string()
      .required(t('admin.pages.sensors.form.validation.name_required'))
      .max(255, t('admin.pages.sensors.form.validation.name_max')),
    longitude: Yup.string().nullable(),
    latitude: Yup.string().nullable(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const data = { ...values };
      await axiosClient.put(`/admin/sensors/${id}`, data);
      navigate('/admin/sensors', {
        state: {
          success: t('admin.pages.sensors.list.messages.updateSuccess'),
        },
      });
    } catch (error) {
      navigate('/admin/sensors', {
        state: { error: t('admin.pages.sensors.list.messages.error') },
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
            onClick={() => navigate('/admin/sensors')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.sensors.form.title.edit')}
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
                    <Icon icon="tabler:device" className="h-5 w-5 mr-2" />
                    {t('admin.fields.eui')}
                  </label>
                  <Field
                    name="eui"
                    as={InputText}
                    placeholder={t('admin.fields.eui')}
                    className={errors.eui && touched.eui ? 'p-invalid' : ''}
                  />
                  {errors.eui && touched.eui && (
                    <small className="p-error">{errors.eui}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:note" className="h-5 w-5 mr-2" />
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
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t('admin.fields.longitude')}
                  </label>
                  <Field
                    name="longitude"
                    as={InputText}
                    placeholder={t('admin.fields.longitude')}
                    className={
                      errors.longitude && touched.longitude ? 'p-invalid' : ''
                    }
                  />
                  {errors.longitude && touched.longitude && (
                    <small className="p-error">{errors.longitude}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t('admin.fields.latitude')}
                  </label>
                  <Field
                    name="latitude"
                    as={InputText}
                    placeholder={t('admin.fields.latitude')}
                    className={
                      errors.latitude && touched.latitude ? 'p-invalid' : ''
                    }
                  />
                  {errors.latitude && touched.latitude && (
                    <small className="p-error">{errors.latitude}</small>
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
                        ? t('admin.pages.sensors.form.submittingText.edit')
                        : t('admin.pages.sensors.form.submitButton.edit')
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
