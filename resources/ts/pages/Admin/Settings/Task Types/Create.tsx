import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosClient from '@/api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

export default function CreateTaskType() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    name: '',
    description: '',
  };

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
      await axiosClient.post('/admin/task-types', values);
      navigate('/admin/settings/task-types', {
        state: {
          success: t('admin.pages.taskTypes.list.messages.createSuccess'),
        },
      });
    } catch (error) {
      console.error(error);
      navigate('/admin/settings/task-types', {
        state: { error: t('admin.pages.taskTypes.list.messages.error') },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/settings/task-types')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin.pages.taskTypes.form.title.create')}
          </h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
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

                {/* Description */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
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
                        ? t('admin.pages.taskTypes.form.submittingText.create')
                        : t('admin.pages.taskTypes.form.submitButton.create')
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
