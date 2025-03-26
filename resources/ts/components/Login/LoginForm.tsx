import useAuth from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { useToast } from '@/hooks/useToast';
import { User } from '@/types/User';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';

export interface LoginResponse {
  success?: boolean;
  accessToken?: string;
  userData?: User;
}

const LoginForm = () => {
  const { showToast } = useToast();
  const { handleLogin } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState('admin@urbantree.com');
  const [password, setPassword] = useState('demopass');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleLogin({ email, password })
      .unwrap()
      .then((payload: User) => {
        if (payload) {
          const { name, surname } = payload;
          showToast(
            'success',
            t('_capitalize', { val: t('messages.success_login') }),
            t('_capitalize', {
              val: t('messages.greeting', {
                name,
                surname,
              }),
            }),
          );
        }
      })
      .catch((error: any) =>
        showToast(
          'error',
          t('_capitalize', { val: t('messages.error_login') }),
          error.message || t('error.unspecific'),
        ),
      );
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {t('_capitalize', {
              val: t('tooltips.enter', { item: t('glossary:email') }),
            })}
          </label>
          <InputText
            id="email"
            type="email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholders.email')}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            {t('_capitalize', {
              val: t('tooltips.enter', { item: t('glossary:password') }),
            })}
          </label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-password"
            inputStyle={{ width: '100%' }}
            feedback={false}
            placeholder={t('placeholders.password')}
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
            {t('_capitalize', { val: t('actions.remember_me') })}
          </label>
        </div>

        <Button
          label={t('_capitalize', { val: t('actions.login') })}
          type="submit"
          className="w-full"
        />
      </form>
    </div>
  );
};

export default LoginForm;
