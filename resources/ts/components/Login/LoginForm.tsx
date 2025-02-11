import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axiosClient from '@/api/axiosClient';

const LoginForm = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('customer@urbantree.com');
  const [password, setPassword] = useState('demopass');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('/login', {
        email,
        password,
      });

      login(response.data.accessToken);
    } catch (error) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      {error && (
        <div
          className="bg-red-600 text-white px-4 py-3 rounded mb-6"
          role="alert">
          <strong className="font-semibold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember_me" className="ml-2 text-sm text-gray-900">
              Recuérdame
            </label>
          </div>
        </div>

        <div>
          <input
            value="Iniciar sesión"
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
