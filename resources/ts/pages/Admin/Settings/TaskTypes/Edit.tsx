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

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

export default function EditTaskType() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTaskType = async () => {
      try {
        const response = await axiosClient.get(`/admin/task-types/${id}`);
        const data = response.data;
        setInitialValues({
          name: data.name || '',
          description: data.description || '',
        });
      } catch {}
      setIsLoading(false);
    };
    fetchTaskType();
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('admin.pages.taskTypes.form.validation.name_required'))
      .matches(
        /^[A-Za-z0-9 ]+$/,
        t('admin.pages.taskTypes.form.validation.error_numbers'),
      ),
    description: Yup.string().nullable(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await axiosClient.put(`/admin/task-types/${id}`, values);
      showToast(
        'success',
        t('admin.pages.taskTypes.list.messages.updateSuccess'),
      );
      navigate('/admin/settings/task-types');
    } catch {
      showToast('error', t('admin.pages.taskTypes.list.messages.error'));
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
          onClick={() => navigate('/admin/settings/task-types')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.taskTypes.form.title.edit')}
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
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    {t('admin.pages.taskTypes.form.fields.name')}
                  </label>
                  <Field
                    name="name"
                    as={InputText}
                    placeholder={t(
                      'admin.pages.taskTypes.form.placeholders.name',
                    )}
                    className={errors.name && touched.name ? 'p-invalid' : ''}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:notes" className="h-5 w-5 mr-2" />
                    {t('admin.pages.taskTypes.form.fields.description')}
                  </label>
                  <Field
                    name="description"
                    as={InputText}
                    placeholder={t(
                      'admin.pages.taskTypes.form.placeholders.description',
                    )}
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
                        ? t('admin.pages.taskTypes.form.submittingText.edit')
                        : t('admin.pages.taskTypes.form.submitButton.edit')
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
