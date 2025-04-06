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
      .required('EUI is required')
      .min(8, 'EUI must be at least 8 characters')
      .max(32, 'EUI must be less than 32 characters')
      .matches(/^[a-fA-F0-9]+$/, 'EUI must be hexadecimal format (0-9, a-f)'),
    dev_name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be less than 50 characters')
      .matches(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens and underscores'),
    longitude: Yup.string()
      .required('Longitude is required')
      .test('is-longitude', 'Invalid longitude (must be between -180 and 180)', value => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -180 && num <= 180;
      }),
    latitude: Yup.string()
      .required('Latitude is required')
      .test('is-latitude', 'Invalid latitude (must be between -90 and 90)', value => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -90 && num <= 90;
      }),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!currentContract?.id) {
      showToast('error', 'Debe seleccionar un contrato válido');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if the EUI exists in the API
      const existingSensor = await fetchSensorByEUI(values.dev_eui.trim());
      if (!existingSensor) {
        throw new Error(`Sensor with EUI "${values.dev_eui}" does not exist in the system`);
      }
      
      const payload = {
        eui: values.dev_eui.trim(),
        name: values.dev_name.trim(),
        longitude: values.longitude ? parseFloat(values.longitude) : null,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        contract_id: currentContract.id,
      };

      await axiosClient.get('/sanctum/csrf-cookie');
      await axiosClient.post('/admin/sensors', payload);
      showToast('success', 'Sensor created successfully!');
      navigate('/admin/sensors');
    } catch (error: any) {
      console.error('Error creating sensor:', error);

      if (error.response?.status === 422 && error.response?.data?.errors?.eui) {
        // This is a validation error for the EUI field
        if (error.response.data.errors.eui.includes('The eui has already been taken.')) {
          showToast('error', `Sensor with EUI "${values.dev_eui}" already exists`);
          return;
        }
      }

      // Handle other errors
      if (error.response && error.response.data && error.response.data.message) {
        showToast('error', error.response.data.message);
      } else {
        showToast('error', 'Failed to create sensor');
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
          Create Sensor
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
                    EUI
                  </label>
                  <Field
                    name="dev_eui"
                    as={InputText}
                    placeholder="Enter EUI (Hexadecimal)"
                    className={errors.dev_eui && touched.dev_eui ? 'p-invalid' : ''}
                  />
                  {errors.dev_eui && touched.dev_eui && (
                    <small className="p-error">{errors.dev_eui}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:device" className="h-5 w-5 mr-2" />
                    Name
                  </label>
                  <Field
                    name="dev_name"
                    as={InputText}
                    placeholder="Enter Name"
                    className={errors.dev_name && touched.dev_name ? 'p-invalid' : ''}
                  />
                  {errors.dev_name && touched.dev_name && (
                    <small className="p-error">{errors.dev_name}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    Longitude
                  </label>
                  <Field
                    name="longitude"
                    as={InputText}
                    placeholder="Enter Longitude (-180 to 180)"
                    className={errors.longitude && touched.longitude ? 'p-invalid' : ''}
                  />
                  {errors.longitude && touched.longitude && (
                    <small className="p-error">{errors.longitude}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    Latitude
                  </label>
                  <Field
                    name="latitude"
                    as={InputText}
                    placeholder="Enter Latitude (-90 to 90)"
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
                    label={isSubmitting ? 'Creating Sensor...' : 'Create Sensor'}
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