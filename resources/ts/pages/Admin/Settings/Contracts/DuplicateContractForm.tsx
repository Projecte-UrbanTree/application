import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';

export default function DuplicateContractForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [initialValues, setInitialValues] = useState<{
    name: string;
    start_date: Date | null;
    end_date: Date | null;
  }>({
    name: '',
    start_date: null,
    end_date: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axiosClient.get(`/admin/contracts/${id}`);
        const contract = response.data;
        setInitialValues({
          name: `${contract.name}`,
          start_date: null,
          end_date: null,
        });
      } catch (error) {
        console.error('Error carregant el contracte original', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required(
      t('admin.pages.contracts.form.validation.name_required'),
    ),
    start_date: Yup.date().required(
      t('admin.pages.contracts.form.validation.start_date_required'),
    ),
    end_date: Yup.date()
      .required(t('admin.pages.contracts.form.validation.end_date_required'))
      .min(
        Yup.ref('start_date'),
        t('admin.pages.contracts.form.validation.end_date_after_start_date'),
      ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await axiosClient.post(`/admin/contracts/${id}/duplicate`, {
        name: values.name,
        start_date: values.start_date?.toISOString().split('T')[0],
        end_date: values.end_date?.toISOString().split('T')[0],
      });
      navigate('/admin/settings/contracts', {
        state: { success: t('admin.pages.contracts.duplicate.success') },
      });
    } catch (error) {
      navigate('/admin/settings/contracts', {
        state: { error: t('admin.pages.contracts.duplicate.error') },
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
            onClick={() => navigate('/admin/settings/contracts')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.contracts.duplicate.title')}
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
                    <Icon icon="tabler:file" className="h-5 w-5 mr-2" />
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
                    <Icon icon="tabler:calendar" className="h-5 w-5 mr-2" />
                    {t('admin.fields.start_date')}
                  </label>
                  <Field
                    name="start_date"
                    as={Calendar}
                    placeholder={t('admin.fields.start_date')}
                    className={
                      errors.start_date && touched.start_date ? 'p-invalid' : ''
                    }
                  />
                  {errors.start_date && touched.start_date && (
                    <small className="p-error">{errors.start_date}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:calendar" className="h-5 w-5 mr-2" />
                    {t('admin.fields.end_date')}
                  </label>
                  <Field
                    name="end_date"
                    as={Calendar}
                    placeholder={t('admin.fields.end_date')}
                    className={
                      errors.end_date && touched.end_date ? 'p-invalid' : ''
                    }
                  />
                  {errors.end_date && touched.end_date && (
                    <small className="p-error">{errors.end_date}</small>
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
                        ? t('admin.pages.contracts.duplicate.submitting')
                        : t('admin.pages.contracts.duplicate.submit')
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
