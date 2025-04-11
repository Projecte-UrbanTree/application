import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axiosClient.get(`/admin/contracts/${id}`);
        const contract = response.data;
        setInitialValues({
          name: `${contract.name} (copy)`,
          start_date: null,
          end_date: null,
        });
      } catch (error) {
        console.error('Error loading original contract', error);
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
    setIsSubmitting(true);
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
          onClick={() => navigate('/admin/settings/contracts')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.contracts.duplicate.title')}
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
                  <Field name="start_date">
                    {({ field, form }: any) => (
                      <Calendar
                        id="start_date"
                        value={field.value}
                        onChange={(e) =>
                          form.setFieldValue('start_date', e.value)
                        }
                        showIcon
                        className={
                          errors.start_date && touched.start_date
                            ? 'p-invalid'
                            : ''
                        }
                        placeholder={t('admin.fields.start_date')}
                      />
                    )}
                  </Field>
                  {errors.start_date && touched.start_date && (
                    <small className="p-error">{errors.start_date}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:calendar" className="h-5 w-5 mr-2" />
                    {t('admin.fields.end_date')}
                  </label>
                  <Field name="end_date">
                    {({ field, form }: any) => (
                      <Calendar
                        id="end_date"
                        value={field.value}
                        onChange={(e) =>
                          form.setFieldValue('end_date', e.value)
                        }
                        showIcon
                        className={
                          errors.end_date && touched.end_date ? 'p-invalid' : ''
                        }
                        placeholder={t('admin.fields.end_date')}
                      />
                    )}
                  </Field>
                  {errors.end_date && touched.end_date && (
                    <small className="p-error">{errors.end_date}</small>
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
    </>
  );
}
