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

export default function CreateSensor() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);

  const initialValues = {
    dev_eui: '',
    dev_name: '',
    longitude: '',
    latitude: '',
  };

  const validationSchema = Yup.object({
    dev_eui: Yup.string().required('EUI is required'),
    dev_name: Yup.string().required('Name is required'),
    longitude: Yup.string(),
    latitude: Yup.string(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!currentContract?.id) {
      showToast('error', 'Debe seleccionar un contrato válido');
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

      await axiosClient.get('/sanctum/csrf-cookie');
      await axiosClient.post('/admin/sensors', payload);
      showToast('success', 'Sensor created successfully!');
      navigate('/admin/sensors');
    } catch (error: any) {
      console.error('Error creating sensor:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        showToast('error', error.response.data.message);
      } else {
        showToast('error', 'Failed to create sensor');
      }
    }
    setIsSubmitting(false);
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
                    placeholder="Enter EUI"
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
                    placeholder="Enter Longitude"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:map-pin" className="h-5 w-5 mr-2" />
                    Latitude
                  </label>
                  <Field
                    name="latitude"
                    as={InputText}
                    placeholder="Enter Latitude"
                  />
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