import { Icon } from '@iconify/react';
import axiosClient from '@/api/axiosClient';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSensorByEUI } from '@/api/sensors';

export default function CreateSensor() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);

  const initialValues = {
    dev_eui: '',
    dev_name: '',
    longitude: '',
    latitude: '',
  };

  const validationSchema = Yup.object({
    dev_eui: Yup.string()
      .required(t('admin.pages.sensors.form.validation.eui_required'))
      .min(8, t('admin.pages.sensors.form.validation.eui_min'))
      .max(32, t('admin.pages.sensors.form.validation.eui_max'))
      .matches(/^[a-zA-Z0-9]+$/, t('admin.pages.sensors.form.validation.eui_format')),
    dev_name: Yup.string()
      .required(t('admin.pages.sensors.form.validation.name_required'))
      .min(3, t('admin.pages.sensors.form.validation.name_min'))
      .max(50, t('admin.pages.sensors.form.validation.name_max'))
      .matches(/^[a-zA-Z0-9\s\-_]+$/, t('admin.pages.sensors.form.validation.name_format')),
    longitude: Yup.string()
      .required(t('admin.pages.sensors.form.validation.longitude_required'))
      .test('is-longitude', t('admin.pages.sensors.form.validation.longitude_format'), value => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -180 && num <= 180;
      }),
    latitude: Yup.string()
      .required(t('admin.pages.sensors.form.validation.latitude_required'))
      .test('is-latitude', t('admin.pages.sensors.form.validation.latitude_format'), value => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -90 && num <= 90;
      }),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!currentContract?.id) {
      showToast('error', t('admin.pages.sensors.errors.no_contract'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        eui: values.dev_eui.trim(),
        name: values.dev_name.trim(),
        longitude: values.longitude ? parseFloat(values.longitude) : null,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        contract_id: currentContract.id,
      };

      await axiosClient.post('/admin/sensors', payload);
      showToast('success', t('admin.pages.sensors.list.messages.createSuccess'));
      navigate('/admin/sensors');
    } catch (error: any) {
      console.error('Error creating sensor:', error);

      if (error.response?.status === 422 && error.response?.data?.errors?.eui) {
        if (error.response.data.errors.eui.includes('The eui has already been taken.')) {
          showToast('error', t('admin.pages.sensors.list.messages.euiTaken'));
          return;
        }
      }

      if (error.response && error.response.data && error.response.data.message) {
        showToast('error', error.response.data.message);
      } else {
        showToast('error', t('admin.pages.sensors.list.messages.error'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          icon={<Icon icon="tabler:arrow-left" className="h-5 w-5" />}
          className="p-button-text mr-3"
          onClick={() => navigate('/admin/sensors')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.sensors.title.create')}
        </h2>
      </div>

      <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
        <div className="p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:id" className="h-5 w-5 mr-2" />
                    {t('admin.pages.sensors.fields.eui')}
                  </label>
                  <Field
                    name="dev_eui"
                    as={InputText}
                    placeholder={t('admin.pages.sensors.fields.eui')}
                    className={errors.dev_eui && touched.dev_eui ? 'p-invalid' : ''}
                  />
                  {errors.dev_eui && touched.dev_eui && (
                    <small className="p-error">{errors.dev_eui}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:device" className="h-5 w-5 mr-2" />
                    {t('admin.pages.sensors.fields.name')}
                  </label>
                  <Field
                    name="dev_name"
                    as={InputText}
                    placeholder={t('admin.pages.sensors.fields.name')}
                    className={errors.dev_name && touched.dev_name ? 'p-invalid' : ''}
                  />
                  {errors.dev_name && touched.dev_name && (
                    <small className="p-error">{errors.dev_name}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t('admin.pages.sensors.fields.longitude')}
                  </label>
                  <Field
                    name="longitude"
                    as={InputText}
                    placeholder={t('admin.pages.sensors.fields.longitude')}
                    className={errors.longitude && touched.longitude ? 'p-invalid' : ''}
                  />
                  {errors.longitude && touched.longitude && (
                    <small className="p-error">{errors.longitude}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    {t('admin.pages.sensors.fields.latitude')}
                  </label>
                  <Field
                    name="latitude"
                    as={InputText}
                    placeholder={t('admin.pages.sensors.fields.latitude')}
                    className={errors.latitude && touched.latitude ? 'p-invalid' : ''}
                  />
                  {errors.latitude && touched.latitude && (
                    <small className="p-error">{errors.latitude}</small>
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
    </>
  );
}