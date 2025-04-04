import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosClient from '@/api/axiosClient';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState<{
    name: string;
    surname: string;
    email: string;
    company: string;
    dni: string;
    role: string;
    password?: string;
  }>({
    name: '',
    surname: '',
    email: '',
    company: '',
    dni: '',
    role: 'worker',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get(`/admin/users/${id}`);
        const user = response.data;
        setInitialValues({
          name: user.name,
          surname: user.surname,
          email: user.email,
          company: user.company || '',
          dni: user.dni || '',
          role: user.role,
          password: '',
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  
  const validationSchema = Yup.object({
    name: Yup.string().required(
      t('admin.pages.users.form.validation.name_required'),
    ),
    surname: Yup.string().required(
      t('admin.pages.users.form.validation.surname_required'),
    ),
    email: Yup.string()
      .email(t('admin.pages.users.form.validation.invalid_email'))
      .required(t('admin.pages.users.form.validation.email_required')),
    company: Yup.string(),
    dni: Yup.string(),
    role: Yup.string()
      .oneOf(
        ['admin', 'worker', 'customer'],
        t('admin.pages.users.form.validation.role_invalid'),
      )
      .required(t('admin.pages.users.form.validation.role_invalid')),
    password: Yup.string()
      .min(8, t('admin.pages.users.form.validation.password_min'))
      .matches(
        /[A-Z]/,
        t('admin.pages.users.form.validation.password_uppercase'),
      )
      .matches(/[0-9]/, t('admin.pages.users.form.validation.password_number'))
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        t('admin.pages.users.form.validation.password_special'),
      ),
  });
  
  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      const data = { ...values };
      if (!data.password) {
        delete data.password;
      }
      await axiosClient.put(`/admin/users/${id}`, data);
      navigate('/admin/settings/users', {
        state: { success: t('admin.pages.users.list.messages.updateSuccess') },
      });
    } catch (error) {
      navigate('/admin/settings/users', {
        state: { error: t('admin.pages.users.list.messages.error') },
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const roleOptions = [
    { label: t('admin.roles.admin'), value: 'admin' },
    { label: t('admin.roles.worker'), value: 'worker' },
    { label: t('admin.roles.customer'), value: 'customer' },
  ];
  
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
          onClick={() => navigate('/admin/settings/users')}
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {t('admin.pages.users.form.title.edit')}
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
                    <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
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
                    <Icon icon="tabler:user" className="h-5 w-5 mr-2" />
                    {t('admin.fields.surname')}
                  </label>
                  <Field
                    name="surname"
                    as={InputText}
                    placeholder={t('admin.fields.surname')}
                    className={
                      errors.surname && touched.surname ? 'p-invalid' : ''
                    }
                  />
                  {errors.surname && touched.surname && (
                    <small className="p-error">{errors.surname}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:mail" className="h-5 w-5 mr-2" />
                    {t('admin.fields.email')}
                  </label>
                  <Field
                    name="email"
                    as={InputText}
                    type="email"
                    placeholder={t('admin.fields.email')}
                    className={errors.email && touched.email ? 'p-invalid' : ''}
                    keyfilter="email"
                  />
                  {errors.email && touched.email && (
                    <small className="p-error">{errors.email}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:building" className="h-5 w-5 mr-2" />
                    {t('admin.fields.company')}
                  </label>
                  <Field
                    name="company"
                    as={InputText}
                    placeholder={t('admin.fields.company')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:id" className="h-5 w-5 mr-2" />
                    {t('admin.fields.dni')}
                  </label>
                  <Field
                    name="dni"
                    as={InputText}
                    placeholder={t('admin.fields.dni')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:users" className="h-5 w-5 mr-2" />
                    {t('admin.fields.role')}
                  </label>
                  <Field
                    name="role"
                    as={Dropdown}
                    options={roleOptions}
                    placeholder={t('admin.pages.users.form.edit.placeholders.role')}
                    className={errors.role && touched.role ? 'p-invalid' : ''}
                  />
                  {errors.role && touched.role && (
                    <small className="p-error">{errors.role}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Icon icon="tabler:lock" className="h-5 w-5 mr-2" />
                    {t('admin.fields.password')}
                  </label>
                  <Field
                    name="password"
                    as={Password}
                    placeholder={t('admin.pages.users.form.placeholders.passwordEdit')}
                    toggleMask
                    className={errors.password && touched.password ? 'p-invalid' : ''}
                  />
                  {errors.password && touched.password && (
                    <small className="p-error">{errors.password}</small>
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
                        ? t('admin.pages.users.form.submittingText.edit')
                        : t('admin.pages.users.form.submitButton.edit')
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
