import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axiosClient from '@/api/axiosClient';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { useToast } from '@/hooks/useToast';
import { User } from '@/types/User';
import { getRouteByRole } from '@/utils/roleRoutes';

export interface LoginResponse {
  success?: boolean;
  accessToken?: string;
  userData?: User;
}

const LoginForm = () => {
  const { showToast } = useToast();
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post<LoginResponse>('/login', {
        email,
        password,
      });

      const { accessToken, userData } = response.data;

      if (!accessToken || !userData) {
        throw new Error('Error en la autenticación: Datos incompletos');
      }

      showToast(
        'success',
        t('public.login.form.titleSuccess'),
        t('public.login.form.msgSuccess'),
      );

      await login(accessToken);
      if (userData.role) {
        navigate(getRouteByRole(userData.role));
      } else {
        setError(t('general.genericError'));
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setError(error.response.data.message);
      } else {
        setError(t('general.genericError'));
      }
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="p-4 w-full">
      {error && <Message severity="error" text={error} className="w-full" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {t('public.login.form.labelEmail')}
          </label>
          <InputText
            id="email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('public.login.form.placeholderEmail')}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            {t('public.login.form.labelPassword')}
          </label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-password"
            inputStyle={{ width: '100%' }}
            feedback={false}
            required
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            inputId="remember_me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.checked ?? false)}
          />
          <label htmlFor="remember_me" className="ml-2 text-sm">
            {t('public.login.form.rememberMe')}
          </label>
        </div>

        <Button
          label={t('public.login.form.btnLogin')}
          type="submit"
          className="w-full"
        />
      </form>
    </div>
  );
};

export default LoginForm;
