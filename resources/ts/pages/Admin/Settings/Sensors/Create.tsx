import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosClient from '@/api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

interface Sensor {
  dev_eui: string;
  name: string;
  latitude: number;
  longitude: number;
  contract_id: number;
}

export default function CreateSensor() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: Sensor = {
    dev_eui: '',
    name: '',
    latitude: 0,
    longitude: 0,
    contract_id: 1,
  };

  const validationSchema = Yup.object({
    dev_eui: Yup.string().required(
      t('admin.pages.sensors.form.validation.dev_eui_required'),
    ),
    name: Yup.string().required(
      t('admin.pages.sensors.form.validation.name_required'),
    ),
    latitude: Yup.number().required(
      t('admin.pages.sensors.form.validation.latitude_required'),
    ),
    longitude: Yup.number().required(
      t('admin.pages.sensors.form.validation.longitude_required'),
    ),
    contract_id: Yup.number().required(
      t('admin.pages.sensors.form.validation.contract_id_required'),
    ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting values:', values); // Afegim un log per veure les dades enviades
      const response = await axiosClient.post('/admin/sensors', {
        dev_eui: values.dev_eui,
        name: values.name,
        latitude: Number(values.latitude), // Convertim a número
        longitude: Number(values.longitude), // Convertim a número
        contract_id: values.contract_id,
      });
      console.log('Sensor created:', response.data);
      navigate('/admin/sensors', {
        state: {
          success: 'Sensor created successfully',
        },
      });
    } catch (error: any) {
      console.error('Error creating sensor:', error.response?.data || error);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors); // Mostrem errors de validació
      }
      navigate('/admin/sensors', {
        state: { error: 'Error creating sensor' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {t('admin.pages.sensors.form.title.create')}
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
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    {t('admin.fields.dev_eui')}
                  </label>
                  <Field
                    name="dev_eui"
                    as={InputText}
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
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    {t('admin.fields.contract_id')}
                  </label>
                  <Field
                    name="contract_id"
                    as={InputText}
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
                        ? t('admin.pages.sensors.form.submittingText.create')
                        : t('admin.pages.sensors.form.submitButton.create')
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
