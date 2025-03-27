import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { updateSensor, fetchSensors } from '@/api/sensorHistoryService';
import axiosClient from '@/api/axiosClient';

interface Sensor {
  dev_eui: string;
  name: string;
  latitude: number;
  longitude: number;
  contract_id: number;
}

export default function EditSensor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Sensor | null>(null);

  const validationSchema = Yup.object({
    dev_eui: Yup.string().required(
      t('admin.pages.sensors.form.validation.dev_eui_required'),
    ),
    name: Yup.string().required(
      t('admin.pages.sensors.form.validation.name_required'),
    ),
    latitude: Yup.number()
      .required(t('admin.pages.sensors.form.validation.latitude_required'))
      .test(
        'max-decimals',
        t('admin.pages.sensors.form.validation.latitude_precision'),
        (value) => (value ? value.toString().split('.')[1]?.length <= 6 : true),
      ), // Permet fins a 6 decimals
    longitude: Yup.number()
      .required(t('admin.pages.sensors.form.validation.longitude_required'))
      .test(
        'max-decimals',
        t('admin.pages.sensors.form.validation.longitude_precision'),
        (value) => (value ? value.toString().split('.')[1]?.length <= 6 : true),
      ), // Permet fins a 6 decimals
    contract_id: Yup.number().required(
      t('admin.pages.sensors.form.validation.contract_id_required'),
    ),
  });

  useEffect(() => {
    const fetchSensorById = async () => {
      try {
        const response = await axiosClient.get(`/admin/sensors/${id}`); // Endpoint correcte
        const sensor = response.data;
        setInitialValues({
          dev_eui: sensor.dev_eui,
          name: sensor.name || '',
          latitude: sensor.latitude,
          longitude: sensor.longitude,
          contract_id: sensor.contract_id,
        });
      } catch (error) {
        console.error('Error fetching sensor by ID:', error);
        navigate('/admin/sensors', {
          state: { error: t('admin.pages.sensors.list.messages.error') },
        });
      }
    };
    if (id) {
      fetchSensorById();
    }
  }, [id, navigate, t]);

  const handleSubmit = async (values: Sensor) => {
    setIsSubmitting(true);
    try {
      // Crida a l'API per actualitzar el sensor utilitzant l'ID
      await axiosClient.put(`/admin/sensors/${id}`, values);

      // Redirigeix a la vista de sensors amb un missatge d'èxit
      navigate('/admin/sensors', {
        state: {
          success: t('admin.pages.sensors.list.messages.updateSuccess'),
        },
      });
    } catch (error: any) {
      console.error('Error updating sensor:', error.response?.data || error);

      // Mostra un missatge d'error més clar
      const errorMessage =
        error.response?.data?.message ||
        t('admin.pages.sensors.form.errorSaving');
      navigate('/admin/sensors', {
        state: { error: errorMessage },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('general.loading')}</p>
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
            {({ errors, touched, values, handleChange }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t('admin.fields.dev_eui')}
                  </label>
                  <InputText
                    name="dev_eui"
                    value={values.dev_eui}
                    onChange={handleChange}
                    placeholder={t('admin.fields.dev_eui')}
                    className={
                      errors.dev_eui && touched.dev_eui ? 'p-invalid' : ''
                    }
                  />
                  {errors.dev_eui && touched.dev_eui && (
                    <small className="p-error">{errors.dev_eui}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t('admin.fields.name')}
                  </label>
                  <InputText
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder={t('admin.fields.name')}
                    className={errors.name && touched.name ? 'p-invalid' : ''}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t('admin.fields.latitude')}
                  </label>
                  <InputText
                    name="latitude"
                    value={values.latitude}
                    onChange={handleChange}
                    placeholder={t('admin.fields.latitude')}
                    className={
                      errors.latitude && touched.latitude ? 'p-invalid' : ''
                    }
                  />
                  {errors.latitude && touched.latitude && (
                    <small className="p-error">{errors.latitude}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t('admin.fields.longitude')}
                  </label>
                  <InputText
                    name="longitude"
                    value={values.longitude}
                    onChange={handleChange}
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
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t('admin.fields.contract_id')}
                  </label>
                  <InputText
                    name="contract_id"
                    value={values.contract_id}
                    onChange={handleChange}
                    placeholder={t('admin.fields.contract_id')}
                    className={
                      errors.contract_id && touched.contract_id
                        ? 'p-invalid'
                        : ''
                    }
                  />
                  {errors.contract_id && touched.contract_id && (
                    <small className="p-error">{errors.contract_id}</small>
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
