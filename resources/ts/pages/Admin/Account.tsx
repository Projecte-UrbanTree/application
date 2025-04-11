import { Icon } from '@iconify/react';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import axiosClient from '@/api/axiosClient';
import { useToast } from '@/hooks/useToast';

export default function Account() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    surname: '',
    email: '',
    company: '',
    dni: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const formatName = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get('/admin/account');
        setInitialValues({
          name: formatName(response.data.name) ?? '',
          surname: formatName(response.data.surname) ?? '',
          email: response.data.email ?? '',
          company: response.data.company ?? '',
          dni: response.data.dni ?? '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });

        const tokenResponse = await axiosClient.get('/admin/account/tokens');
        setTokens(tokenResponse.data);

        const successMessage = sessionStorage.getItem('accountUpdateSuccess');
        if (successMessage) {
          showToast('success', t('general.success'), t(successMessage));
          sessionStorage.removeItem('accountUpdateSuccess');
        }

        setIsLoading(false);
      } catch (error) {
        showToast(
          'error',
          t('general.error'),
          t('admin.pages.account.messages.errorSaving'),
        );
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [t, showToast]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
        t('admin.pages.account.validation.name_invalid'),
      )
      .required(t('admin.pages.account.validation.name_required')),
    surname: Yup.string()
      .matches(
        /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
        t('admin.pages.account.validation.surname_invalid'),
      )
      .required(t('admin.pages.account.validation.surname_required')),
    currentPassword: Yup.string(),
    newPassword: Yup.string()
      .min(8, t('admin.pages.account.validation.newPasswordMinLength'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        t('admin.pages.account.validation.newPasswordComplexity'),
      ),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), undefined],
      t('admin.pages.account.validation.newPasswordMismatch'),
    ),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: { resetForm: (nextState?: Partial<any>) => void },
  ) => {
    try {
      await axiosClient.put('/admin/account', {
        name: values.name,
        surname: values.surname,
        email: values.email,
        company: values.company,
      });

      if (values.currentPassword && values.newPassword) {
        await axiosClient.put('/admin/account/password', {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          newPassword_confirmation: values.confirmNewPassword,
        });
      }

      setInitialValues({
        ...values,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });

      resetForm({
        values: {
          ...values,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        },
      });

      showToast(
        'success',
        t('general.success'),
        t('admin.pages.account.messages.profileUpdated'),
      );

      const tokenResponse = await axiosClient.get('/admin/account/tokens');
      setTokens(tokenResponse.data);
    } catch (error: any) {
      if (
        error.response?.data?.error === 'La contraseña actual no es correcta'
      ) {
        showToast(
          'error',
          t('general.error'),
          t('admin.pages.account.messages.passwordCurrentWrong'),
        );
      } else {
        showToast(
          'error',
          t('general.error'),
          t('admin.pages.account.messages.errorSaving'),
        );
      }
    }
  };

  const handleRevokeToken = async (tokenId: number) => {
    try {
      await axiosClient.delete(`/admin/account/tokens/${tokenId}`);
      setTokens(tokens.filter((token) => token.id !== tokenId));
      showToast(
        'success',
        t('general.success'),
        t('admin.pages.account.messages.tokenRevoked'),
      );
    } catch (error) {
      showToast(
        'error',
        t('general.error'),
        t('admin.pages.account.messages.errorRevokingToken'),
      );
    }
  };

  const nameBodyTemplate = (rowData: any) => {
    const displayName =
      rowData.name.length > 45
        ? `${rowData.name.substring(0, 45)}...`
        : rowData.name;

    return (
      <div className="flex items-center gap-2">
        <Icon
          icon="mdi:account"
          className="text-blue-600"
          width={18}
          height={18}
        />
        <span title={rowData.name}>{displayName}</span>
      </div>
    );
  };

  const lastUsedTemplate = (rowData: any) => {
    return <span>{formatDate(rowData.last_used_at)}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Icon
          icon="eos-icons:loading"
          className="h-8 w-8 animate-spin text-blue-600"
        />
        <span className="mt-2 text-blue-600">{t('general.loading')}</span>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <TabView>
        <TabPanel header={t('admin.pages.account.tabs.profile')}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize>
            {({ errors, touched, isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label>{t('admin.fields.name')}</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <Icon icon="mdi:account" width={18} height={18} />
                    </span>
                    <Field
                      name="name"
                      as={InputText}
                      className={errors.name && touched.name ? 'p-invalid' : ''}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <small className="p-error">{errors.name}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.surname')}</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <Icon icon="mdi:account-details" width={18} height={18} />
                    </span>
                    <Field
                      name="surname"
                      as={InputText}
                      className={
                        errors.surname && touched.surname ? 'p-invalid' : ''
                      }
                    />
                  </div>
                  {errors.surname && touched.surname && (
                    <small className="p-error">{errors.surname}</small>
                  )}
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.email')}</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <Icon icon="mdi:email" width={18} height={18} />
                    </span>
                    <Field name="email" as={InputText} disabled />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label>{t('admin.fields.dni')}</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <Icon
                        icon="mdi:card-account-details"
                        width={18}
                        height={18}
                      />
                    </span>
                    <Field name="dni" as={InputText} disabled />
                  </div>
                </div>
                <h3 className="col-span-2 text-lg font-bold mt-4">
                  {t('admin.pages.account.security.title')}
                </h3>
                <p className="col-span-2 text-sm text-gray-600 mb-4">
                  {t('admin.pages.account.passwordChangeInfo')}
                </p>
                <div className="flex flex-col col-span-2">
                  <label className="font-medium text-gray-700">
                    {t('admin.fields.currentPassword')}
                  </label>
                  <Field
                    name="currentPassword"
                    as={InputText}
                    type="password"
                    className={`mt-1 ${errors.currentPassword && touched.currentPassword ? 'p-invalid' : ''}`}
                  />
                  {errors.currentPassword && touched.currentPassword && (
                    <small className="p-error mt-1">
                      {errors.currentPassword}
                    </small>
                  )}
                </div>
                <div className="flex flex-col mt-4">
                  <label className="font-medium text-gray-700">
                    {t('admin.fields.newPassword')}
                  </label>
                  <Field
                    name="newPassword"
                    as={InputText}
                    type="password"
                    className={`mt-1 ${errors.newPassword && touched.newPassword ? 'p-invalid' : ''}`}
                  />
                  {errors.newPassword && touched.newPassword && (
                    <small className="p-error mt-1">{errors.newPassword}</small>
                  )}
                </div>
                <div className="flex flex-col mt-4">
                  <label className="font-medium text-gray-700">
                    {t('admin.fields.confirmPassword')}
                  </label>
                  <Field
                    name="confirmNewPassword"
                    as={InputText}
                    type="password"
                    className={`mt-1 ${errors.confirmNewPassword && touched.confirmNewPassword ? 'p-invalid' : ''}`}
                  />
                  {errors.confirmNewPassword && touched.confirmNewPassword && (
                    <small className="p-error mt-1">
                      {errors.confirmNewPassword}
                    </small>
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
                        ? t('admin.pages.account.actions.saving')
                        : t('admin.pages.account.actions.save')
                    }
                  />
                </div>
              </Form>
            )}
          </Formik>
        </TabPanel>
        <TabPanel header={t('admin.pages.account.tabs.security')}>
          <h3 className="text-lg font-bold mb-4">
            {t('admin.pages.account.security.tokens')}
          </h3>
          <DataTable value={tokens} className="p-datatable-sm">
            <Column
              field="name"
              header={t('admin.pages.account.securityTable.name')}
              body={nameBodyTemplate}
            />
            <Column
              field="last_used_at"
              header={t('admin.pages.account.securityTable.lastUsed')}
              body={lastUsedTemplate}
            />
            <Column
              body={(rowData) => (
                <Button
                  className="p-button-danger p-button-sm"
                  onClick={() => handleRevokeToken(rowData.id)}
                  tooltip={t('admin.pages.account.actions.revoke')}>
                  <Icon icon="mdi:trash" className="h-5 w-5" />
                </Button>
              )}
              header={t('admin.pages.account.securityTable.actions')}
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </Card>
  );
}
