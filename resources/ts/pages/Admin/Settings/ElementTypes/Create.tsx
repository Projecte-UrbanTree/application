import Preloader from '@/components/Preloader';
import useI18n from '@/hooks/useI18n';
import api from '@/services/api';
import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export default function CreateElementType() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iconList, setIconList] = useState<string[]>([]);

  useEffect(() => {
    (async () =>
      await api
        .get('/admin/element-types/icons')
        .then(({ data }) => setIconList(data))
        .finally(() => setIsLoading(false)))();
  }, []);

  const initialValues = {
    name: '',
    requires_tree_type: false,
    description: '',
    icon: '',
    color: 'FF0000',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(
      t('admin:pages.elementTypes.create.validations.name'),
    ),
    requires_tree_type: Yup.boolean().required(
      t('admin:pages.elementTypes.create.validations.requires_tree_type'),
    ),
    description: Yup.string(),
    icon: Yup.string().required(
      t('admin:pages.elementTypes.create.validations.icon'),
    ),
    color: Yup.string().required(),
  });

  const booleanOptions = [
    { label: t('admin:pages.elementTypes.true'), value: true },
    { label: t('admin:pages.elementTypes.false'), value: false },
  ];

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/admin/element-types', values);
      navigate('/admin/settings/element-types', {
        state: { success: t('admin:pages.elementTypes.success') },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Preloader />;

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button
            className="p-button-text mr-4 text-white"
            style={{ color: '#fff' }}
            onClick={() => navigate('/admin/settings/element-types')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">
            {t('admin:pages.elementTypes.create.title')}
          </h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched, values, setFieldValue }) => (
              <>
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">
                      {t('admin:pages.elementTypes.columns.name')}
                    </label>
                    <Field
                      name="name"
                      as={InputText}
                      placeholder={t(
                        'admin:pages.elementTypes.create.placeholders.name',
                      )}
                      className={errors.name && touched.name ? 'p-invalid' : ''}
                    />
                    {errors.name && touched.name && (
                      <small className="p-error">{errors.name}</small>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium">
                      {t('admin:pages.elementTypes.columns.requires_tree_type')}
                    </label>
                    <Dropdown
                      value={values.requires_tree_type}
                      options={booleanOptions}
                      onChange={(e) =>
                        setFieldValue('requires_tree_type', e.value)
                      }
                      placeholder={t(
                        'admin:pages.elementTypes.create.placeholders.requires_tree_type',
                      )}
                      className={
                        errors.requires_tree_type && touched.requires_tree_type
                          ? 'p-invalid'
                          : ''
                      }
                    />
                    {errors.requires_tree_type &&
                      touched.requires_tree_type && (
                        <small className="p-error">
                          {errors.requires_tree_type}
                        </small>
                      )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium">
                      {t('admin:pages.elementTypes.columns.description')}
                    </label>
                    <Field
                      name="description"
                      as={InputTextarea}
                      rows={5}
                      placeholder={t(
                        'admin:pages.elementTypes.create.placeholders.description',
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Ícono</label>
                    <Dropdown
                      value={values.icon}
                      options={iconList}
                      onChange={(e) => setFieldValue('icon', e.value)}
                      placeholder={t(
                        'admin:pages.elementTypes.create.placeholders.icon',
                      )}
                      filter
                      itemTemplate={(option) => (
                        <div className="flex align-items-center">
                          <Icon
                            icon={'mdi:' + option}
                            className="mr-2 text-2xl"
                          />
                          <span>
                            {t('admin:pages.elementTypes.icons.' + option)}
                          </span>
                        </div>
                      )}
                      valueTemplate={(option) =>
                        option ? (
                          <div className="flex align-items-center">
                            <Icon
                              icon={'mdi:' + option}
                              className="mr-2 text-2xl"
                            />
                            <span>{t('admin:icons.' + option)}</span>
                          </div>
                        ) : null
                      }
                      className={errors.icon && touched.icon ? 'p-invalid' : ''}
                    />
                    {errors.icon && touched.icon && (
                      <small className="p-error">{errors.icon}</small>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium">
                      {t('admin:pages.elementTypes.columns.color')}
                    </label>
                    <ColorPicker
                      value={values.color}
                      onChange={(e) => setFieldValue('color', e.value)}
                    />
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
                          ? t('admin:pages.elementTypes.create.submittingText')
                          : t('admin:pages.elementTypes.create.submitButton')
                      }
                    />
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  );
}
