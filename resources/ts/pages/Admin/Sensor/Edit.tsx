import axiosClient from '@/api/axiosClient';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { useToast } from '@/hooks/useToast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function EditSensor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const [initialValues, setInitialValues] = useState({
    eui: '',
    name: '',
    longitude: '',
    latitude: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get(`/admin/sensors/${id}/edit`);
        setInitialValues({
          eui: data.sensor.eui || '',
          name: data.sensor.name || '',
          longitude: data.sensor.longitude?.toString() || '',
          latitude: data.sensor.latitude?.toString() || '',
        });
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
      .required(t('admin.pages.sensors.form.validation.eui_required', 'EUI is required'))
      .max(255, t('admin.pages.sensors.form.validation.eui_max', 'EUI must be less than 255 characters')),
    name: Yup.string()
      .required(t('admin.pages.sensors.form.validation.name_required', 'Name is required'))
      .max(255, t('admin.pages.sensors.form.validation.name_max', 'Name must be less than 255 characters')),
    longitude: Yup.string().nullable(),
    latitude: Yup.string().nullable(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!currentContract?.id) {
      showToast('error', t('admin.pages.sensors.errors.no_contract', 'Debe seleccionar un contrato válido'));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      
      const data = { 
        ...values,
        contract_id: currentContract.id,
        longitude: values.longitude ? parseFloat(values.longitude) : null,
        latitude: values.latitude ? parseFloat(values.latitude) : null
      };
      
      await axiosClient.put(`/admin/sensors/${id}`, data);
      showToast(
        'success',
        t('admin.pages.sensors.list.messages.updateSuccess', 'Sensor updated successfully')
      );
      navigate('/admin/sensors');
    } catch (error: any) {
      console.error('Error updating sensor:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        showToast('error', error.response.data.message);
      } else {
        showToast('error', t('admin.pages.sensors.list.messages.error', 'Error updating sensor'));
      }
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={() => navigate('/admin/sensors')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.sensors.form.title.edit', 'Edit Sensor')}
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
                    <Icon icon="tabler:device" className="h-5 w-5 mr-2" />
                    {t('admin.fields.eui', 'EUI')}
                  </label>
                  <Field
                    name="eui"
                    as={InputText}
                    placeholder={t('admin.fields.eui', 'EUI')}
                    className={errors.eui && touched.eui ? 'p-invalid' : ''}
                  />
                  {errors.eui && touched.eui && (
                    <small className="p-error">{errors.eui}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:note" className="h-5 w-5 mr-2" />
                    {t('admin.fields.name', 'Name')}
                  </label>
                  <Field
                    name="name"
                    as={InputText}
                    placeholder={t('admin.fields.name', 'Name')}
                    className={errors.name && touched.name ? 'p-invalid' : ''}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t('admin.fields.latitude', 'Latitude')}
                  </label>
                  <Field
                    name="latitude"
                    as={InputText}
                    placeholder={t('admin.fields.latitude', 'Latitude')}
                    className={errors.latitude && touched.latitude ? 'p-invalid' : ''}
                  />
                  {errors.latitude && touched.latitude && (
                    <small className="p-error">{errors.latitude}</small>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t('admin.fields.longitude', 'Longitude')}
                  </label>
                  <Field
                    name="longitude"
                    as={InputText}
                    placeholder={t('admin.fields.longitude', 'Longitude')}
                    className={errors.longitude && touched.longitude ? 'p-invalid' : ''}
                  />
                  {errors.longitude && touched.longitude && (
                    <small className="p-error">{errors.longitude}</small>
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
                        ? t('admin.pages.sensors.form.submittingText.edit', 'Updating...')
                        : t('admin.pages.sensors.form.submitButton.edit', 'Update Sensor')
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
