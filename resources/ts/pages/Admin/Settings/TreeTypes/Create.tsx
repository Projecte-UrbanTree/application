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

export default function CreateTreeType() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    family: '',
    genus: '',
    species: '',
  };

  useEffect(() => {
    // Simulate initial loading if needed
    setIsLoading(false);
  }, []);

  const validationSchema = Yup.object({
    family: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin.pages.treeTypes.form.validation.alphanumeric.family'),
      )
      .required(t('admin.pages.treeTypes.form.validation.family')),
    genus: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin.pages.treeTypes.form.validation.alphanumeric.genus'),
      )
      .required(t('admin.pages.treeTypes.form.validation.genus')),
    species: Yup.string().matches(
      /^[a-zA-Z0-9\s]+$/,
      t('admin.pages.treeTypes.form.validation.alphanumeric.species'),
    ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await axiosClient.get('/sanctum/csrf-cookie');
      await axiosClient.post('/admin/tree-types', values);
      showToast(
        'success',
        t('admin.pages.treeTypes.list.messages.createSuccess'),
      );
      navigate('/admin/settings/tree-types');
    } catch (error) {
      console.error(error);
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
          onClick={() => navigate('/admin/settings/tree-types')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.treeTypes.form.title.create')}
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
                    <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                    {t('admin.fields.family')}
                  </label>
                  <Field
                    name="family"
                    as={InputText}
                    placeholder={t('admin.fields.family')}
                    className={
                      errors.family && touched.family ? 'p-invalid' : ''
                    }
                  />
                  {errors.family && touched.family && (
                    <small className="p-error">{errors.family}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                    {t('admin.fields.genus')}
                  </label>
                  <Field
                    name="genus"
                    as={InputText}
                    placeholder={t('admin.fields.genus')}
                    className={errors.genus && touched.genus ? 'p-invalid' : ''}
                  />
                  {errors.genus && touched.genus && (
                    <small className="p-error">{errors.genus}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                    {t('admin.fields.species')}
                  </label>
                  <Field
                    name="species"
                    as={InputText}
                    placeholder={t('admin.fields.species')}
                    className={
                      errors.species && touched.species ? 'p-invalid' : ''
                    }
                  />
                  {errors.species && touched.species && (
                    <small className="p-error">{errors.species}</small>
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
                        ? t('admin.pages.treeTypes.form.submittingText.create')
                        : t('admin.pages.treeTypes.form.submitButton.create')
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
