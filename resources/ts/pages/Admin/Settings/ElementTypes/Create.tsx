import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

export default function CreateElementType() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const iconInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iconList, setIconList] = useState<string[]>([]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axiosClient.get('/admin/element-types/icons');
        setIconList(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchIcons();
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
      t('admin.pages.elementTypes.create.validations.name'),
    ),
    requires_tree_type: Yup.boolean().required(
      t('admin.pages.elementTypes.create.validations.requires_tree_type'),
    ),
    description: Yup.string(),
    icon: Yup.string().required(
      t('admin.pages.elementTypes.create.validations.icon'),
    ),
    color: Yup.string().required(),
  });

  const booleanOptions = [
    { label: t('admin.pages.elementTypes.true'), value: true },
    { label: t('admin.pages.elementTypes.false'), value: false },
  ];

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post('/admin/element-types', values);
      showToast('success', t('admin.pages.elementTypes.success'));
      navigate('/admin/settings/element-types');
    } catch (error) {
      console.error(error);
      showToast('error', t('admin.pages.elementTypes.error'));
    }
    setIsSubmitting(false);
  };

  const searchIcons = (event: { query: string }) => {
    const query = event.query.toLowerCase();
    setFilteredIcons(
      iconList.filter((icon) => icon.toLowerCase().includes(query)),
    );
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
          onClick={() => navigate('/admin/settings/element-types')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.elementTypes.create.title')}
        </h2>
      </div>

      <Card className="border border-gray-300 bg-gray-50 rounded shadow-sm">
        <div className="p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tag" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.columns.name')}
                  </label>
                  <Field
                    name="name"
                    as={InputText}
                    placeholder={t(
                      'admin.pages.elementTypes.create.placeholders.name',
                    )}
                    className={errors.name && touched.name ? 'p-invalid' : ''}
                  />
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:tree" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.columns.requires_tree_type')}
                  </label>
                  <Dropdown
                    value={values.requires_tree_type}
                    options={booleanOptions}
                    onChange={(e) =>
                      setFieldValue('requires_tree_type', e.value)
                    }
                    placeholder={t(
                      'admin.pages.elementTypes.create.placeholders.requires_tree_type',
                    )}
                    className={
                      errors.requires_tree_type && touched.requires_tree_type
                        ? 'p-invalid'
                        : ''
                    }
                  />
                  {errors.requires_tree_type && touched.requires_tree_type && (
                    <small className="p-error">
                      {errors.requires_tree_type}
                    </small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:notes" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.columns.description')}
                  </label>
                  <Field
                    name="description"
                    as={InputTextarea}
                    rows={5}
                    placeholder={t(
                      'admin.pages.elementTypes.create.placeholders.description',
                    )}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:icons" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.create.placeholders.icon')}
                  </label>
                  <Dropdown
                    value={values.icon}
                    options={iconList}
                    onChange={(e) => setFieldValue('icon', e.value)}
                    placeholder={t(
                      'admin.pages.elementTypes.create.placeholders.icon',
                    )}
                    filter
                    itemTemplate={(option) => (
                      <div className="flex align-items-center">
                        <Icon
                          icon={'mdi:' + option}
                          className="mr-2 text-2xl"
                        />
                        <span>
                          {t('admin.pages.elementTypes.icons.' + option)}
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
                          <span>
                            {t('admin.pages.elementTypes.icons.' + option)}
                          </span>
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
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:palette" className="h-5 w-5 mr-2" />
                    {t('admin.pages.elementTypes.columns.color')}
                  </label>
                  <ColorPicker
                    value={values.color}
                    onChange={(e) => setFieldValue('color', e.value)}
                  />
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
                        ? t('admin.pages.elementTypes.create.submittingText')
                        : t('admin.pages.elementTypes.create.submitButton')
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
