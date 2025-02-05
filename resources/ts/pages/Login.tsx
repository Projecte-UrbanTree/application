import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/admin/dashboard'); // Redirect after login
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
