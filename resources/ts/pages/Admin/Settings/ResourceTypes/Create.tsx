import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

export default function CreateResourceType() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: '',
    description: '',
  };

  useEffect(() => {
    // Simulate initial loading if needed
    setIsLoading(false);
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[a-zA-Z0-9 ]*$/,
        t('admin.pages.resourceTypes.form.validation.name_invalid'),
      )
      .required(t('admin.pages.resourceTypes.form.validation.name_required')),
    description: Yup.string().nullable(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      await axiosClient.post('/admin/resource-types', values);
      showToast(
        'success',
        t('admin.pages.resourceTypes.list.messages.createSuccess'),
      );
      navigate('/admin/settings/resource-types');
    } catch (error) {
      console.error(error);
      showToast('error', t('admin.pages.resourceTypes.list.messages.error'));
    }
    setIsSubmitting(false);
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
          onClick={() => navigate('/admin/settings/resource-types')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.resourceTypes.form.title.create')}
        </h2>
      </div>

      <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
        <div className="p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <Icon icon="tabler:info-circle" className="h-5 w-5 mr-2" />
                    {t('admin.fields.description')}
                  </label>
                  <Field
                    name="description"
                    as={InputText}
                    placeholder={t('admin.fields.description')}
                    className={
                      errors.description && touched.description
                        ? 'p-invalid'
                        : ''
                    }
                  />
                  {errors.description && touched.description && (
                    <small className="p-error">{errors.description}</small>
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
                        ? t(
                            'admin.pages.resourceTypes.form.submittingText.create',
                          )
                        : t(
                            'admin.pages.resourceTypes.form.submitButton.create',
                          )
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
