import Preloader from '@/components/Preloader';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

export default function EditTreeType() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [initialValues, setInitialValues] = useState<{
    family: string;
    genus: string;
    species: string;
  }>({
    family: '',
    genus: '',
    species: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchTreeType = async () => {
      try {
        const response = await api.get(`/admin/tree-types/${id}`);
        const tree_type = response.data;
        setInitialValues({
          family: tree_type.family,
          genus: tree_type.genus,
          species: tree_type.species ?? '',
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchTreeType();
  }, [id]);
  const validationSchema = Yup.object({
    family: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin:pages.treeTypes.form.validation.alphanumeric.family'),
      )
      .required(t('admin:pages.treeTypes.form.validation.family')),
    genus: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('admin:pages.treeTypes.form.validation.alphanumeric.genus'),
      )
      .required(t('admin:pages.treeTypes.form.validation.genus')),
    species: Yup.string().matches(
      /^[a-zA-Z0-9\s]+$/,
      t('admin:pages.treeTypes.form.validation.alphanumeric.species'),
    ),
  });
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const data = { ...values };
      await api.put(`/admin/tree-types/${id}`, data);
      navigate('/admin/settings/tree-types', {
        state: {
          success: t('admin:pages.treeTypes.list.messages.updateSuccess'),
        },
      });
    } catch (error) {
      navigate('/admin/settings/tree-types', {
        state: { error: t('admin:pages.treeTypes.list.messages.error') },
      });
    }
  };
  if (isLoading) return <Preloader />;
  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/settings/tree-types')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin:pages.treeTypes.form.title.edit')}
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
                    <Icon icon="tabler:treeType" className="h-5 w-5 mr-2" />
                    {t('admin:fields.family')}
                  </label>
                  <Field
                    name="family"
                    as={InputText}
                    placeholder={t('admin:fields.family')}
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
                    <Icon icon="tabler:treeType" className="h-5 w-5 mr-2" />
                    {t('admin:fields.genus')}
                  </label>
                  <Field
                    name="genus"
                    as={InputText}
                    placeholder={t('admin:fields.genus')}
                    className={errors.genus && touched.genus ? 'p-invalid' : ''}
                  />
                  {errors.genus && touched.genus && (
                    <small className="p-error">{errors.genus}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:treeType" className="h-5 w-5 mr-2" />
                    {t('admin:fields.species')}
                  </label>
                  <Field
                    name="species"
                    as={InputText}
                    placeholder={t('admin:fields.species')}
                    className={
                      errors.species && touched.species ? 'p-invalid' : ''
                    }
                  />
                  {errors.species && touched.species && (
                    <small className="p-error">{errors.species}</small>
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
                        ? t('admin:pages.treeTypes.form.submittingText.edit')
                        : t('admin:pages.treeTypes.form.submitButton.edit')
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
