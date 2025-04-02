import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import useToast from '@/hooks/useToast';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';

const LoginForm = () => {
  const { showToast } = useToast();
  const { handleLogin } = useAuth();
  const { t, format } = useI18n();

  const [email, setEmail] = useState('customer@urbantree.com');
  const [password, setPassword] = useState('demopass');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleLogin({ email, password })
      .unwrap()
      .then((payload) => {
        if (payload) {
          showToast(
            'success',
            format('messages.success_login'),
            format({ key: 'messages.greeting', options: payload }),
          );
        }
      })
      .catch((error) =>
        showToast(
          'error',
          format('messages.error_login'),
          error.message
            ? format({ text: error.message })
            : format('error.unspecific'),
        ),
      );
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {format('tooltips.enter', 'glossary:email')}
          </label>
          <InputText
            autoComplete="email"
            className="w-full"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholders.email')}
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            {format('tooltips.enter', 'glossary:password')}
          </label>
          <Password
            autoComplete="current-password"
            className="w-full mt-1 p-password"
            feedback={false}
            id="password"
            inputStyle={{ width: '100%' }}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('placeholders.password')}
            required
            value={password}
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            checked={rememberMe}
            inputId="remember_me"
            onChange={(e) => setRememberMe(e.checked ?? false)}
          />
          <label htmlFor="remember_me" className="ml-2 text-sm">
            {format('actions.remember_me')}
          </label>
        </div>

        <Button
          className="w-full"
          label={format('actions.login')}
          type="submit"
        />
      </form>
    </div>
  );
};

export default LoginForm;
