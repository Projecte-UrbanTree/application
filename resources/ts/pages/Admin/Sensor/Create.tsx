import axiosClient from '@/api/axiosClient';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function CreateSensor() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
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
    longitude: Yup.string().required('Longitude is required'),
    latitude: Yup.string().required('Latitude is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    if (!currentContract?.id) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar un contrato válido',
        life: 5000,
      });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        eui: values.dev_eui.trim(),
        name: values.dev_name.trim(),
        longitude: values.longitude ? parseFloat(values.longitude) : null,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        contract_id: currentContract.id,
      };

      console.log('Payload:', payload);

      await axiosClient.post('/admin/sensors', payload);

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Sensor created successfully!',
        life: 3000,
      });

      setTimeout(() => {
        navigate('/admin/sensors', {
          state: { success: 'Sensor created successfully!' },
        });
      }, 1000);
    } catch (error: any) {
      console.error('Error creating sensor:', error);
      console.error('Server Response:', error.response?.data);

      let errorMessage = 'Failed to create sensor';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Toast ref={toast} />
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4 text-white"
            onClick={() => navigate('/admin/sensors')}
            icon="pi pi-arrow-left"
            aria-label="Back"
          />
          <h2 className="text-white text-3xl font-bold">Create Sensor</h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium">EUI</label>
                  <Field
                    name="dev_eui"
                    as={InputText}
                    placeholder="Enter EUI"
                    className={`${errors.dev_eui && touched.dev_eui ? 'p-invalid' : ''}`}
                  />
                  {errors.dev_eui && touched.dev_eui && (
                    <small className="p-error">{errors.dev_eui}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium">Name</label>
                  <Field
                    name="dev_name"
                    as={InputText}
                    placeholder="Enter Name"
                    className={`${errors.dev_name && touched.dev_name ? 'p-invalid' : ''}`}
                  />
                  {errors.dev_name && touched.dev_name && (
                    <small className="p-error">{errors.dev_name}</small>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Longitude</label>
                    <Field
                      name="longitude"
                      as={InputText}
                      placeholder="Enter Longitude"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Latitude</label>
                    <Field
                      name="latitude"
                      as={InputText}
                      placeholder="Enter Latitude"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    icon="pi pi-check"
                    label="Create Sensor"
                    className="w-full md:w-auto"
                    loading={isSubmitting}
                    disabled={isSubmitting}
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