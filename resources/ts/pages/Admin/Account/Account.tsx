import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';
import { Icon } from '@iconify/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export default function Account() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name: '',
    surname: '',
    email: '',
    company: '',
    dni: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get('/admin/account');
        setInitialValues({
          name: response.data.name ?? '',
          surname: response.data.surname ?? '',
          email: response.data.email ?? '',
          company: response.data.company ?? '',
          dni: response.data.dni ?? '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setIsLoading(false);
      } catch (error) {
        showToast('error', t('general.error'), t('admin.pages.account.messages.errorSaving'));
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [t, showToast]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/, t('admin.pages.account.validation.name_invalid'))
      .required(t('admin.pages.account.validation.name_required')),
    surname: Yup.string()
      .matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/, t('admin.pages.account.validation.surname_invalid'))
      .required(t('admin.pages.account.validation.surname_required')),
    currentPassword: Yup.string(),
    newPassword: Yup.string()
      .min(8, t('admin.pages.account.validation.newPasswordMinLength'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, t('admin.pages.account.validation.newPasswordComplexity')),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), undefined], t('admin.pages.account.validation.newPasswordMismatch'))
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await axiosClient.put('/admin/account', {
        name: values.name,
        surname: values.surname,
        email: values.email,
        company: values.company
      });
      if (values.currentPassword && values.newPassword) {
        await axiosClient.put('/admin/account/password', {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          newPassword_confirmation: values.confirmNewPassword
        });
      }
      showToast('success', t('general.success'), t('admin.pages.account.messages.profileUpdated'));
    } catch (error: any) {
      if (error.response?.data?.error === 'La contraseña actual no es correcta') {
        showToast('error', t('general.error'), t('admin.pages.account.messages.passwordCurrentWrong'));
      } else {
        showToast('error', t('general.error'), t('admin.pages.account.messages.errorSaving'));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Icon icon="eos-icons:loading" className="h-8 w-8 animate-spin text-blue-600" />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <Card className="w-full max-w-3xl shadow-lg">
        <header className="bg-blue-700 px-6 py-4 flex items-center -mt-6 -mx-6 rounded-t-lg">
          <Button className="p-button-text mr-4" style={{ color: '#fff' }} onClick={() => navigate('/admin')}>
            <Icon icon="tabler:arrow-left" className="h-6 w-6" />
          </Button>
          <h2 className="text-white text-3xl font-bold">{t('admin.pages.account.title')}</h2>
        </header>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="col-span-2 text-lg font-bold">{t('admin.pages.account.basicInfo')}</h3>
                <div className="flex flex-col">
                  <label>{t('admin.fields.name')}</label>
                  <Field name="name" as={InputText} className={errors.name && touched.name ? "p-invalid" : ""} />
                  {errors.name && touched.name && <small className="p-error">{errors.name}</small>}
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.surname')}</label>
                  <Field name="surname" as={InputText} className={errors.surname && touched.surname ? "p-invalid" : ""} />
                  {errors.surname && touched.surname && <small className="p-error">{errors.surname}</small>}
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.email')}</label>
                  <Field name="email" as={InputText} disabled />
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.dni')}</label>
                  <Field name="dni" as={InputText} disabled />
                </div>
                <h3 className="col-span-2 text-lg font-bold mt-4">{t('admin.pages.account.security')}</h3>
                <div className="flex flex-col col-span-2">
                  <label>{t('admin.fields.currentPassword')}</label>
                  <Field
                    name="currentPassword"
                    as={Password}
                    feedback={false}
                    className={errors.currentPassword && touched.currentPassword ? "p-invalid" : ""}
                  />
                  {errors.currentPassword && touched.currentPassword && <small className="p-error">{errors.currentPassword}</small>}
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.newPassword')}</label>
                  <Field
                    name="newPassword"
                    as={Password}
                    toggleMask={true}
                    feedback={false}
                    className={errors.newPassword && touched.newPassword ? "p-invalid" : ""}
                  />
                  {errors.newPassword && touched.newPassword && <small className="p-error">{errors.newPassword}</small>}
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.confirmPassword')}</label>
                  <Field
                    name="confirmNewPassword"
                    as={Password}
                    toggleMask={true}
                    feedback={false}
                    className={errors.confirmNewPassword && touched.confirmNewPassword ? "p-invalid" : ""}
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword && <small className="p-error">{errors.confirmNewPassword}</small>}
                </div>
                <div className="md:col-span-2 flex justify-end mt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto" icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"} label={isSubmitting ? t('admin.pages.account.actions.saving') : t('admin.pages.account.actions.save')} />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  );
}
