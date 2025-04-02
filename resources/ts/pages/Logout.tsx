import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
    navigate('/login', { replace: true });
  }, [handleLogout, navigate]);

  return null;
}
