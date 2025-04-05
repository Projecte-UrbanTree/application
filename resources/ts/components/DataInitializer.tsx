import React, { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useContracts } from '@/hooks/useContracts';

import Preloader from './Preloader';

type DataInitializerProps = {
  children: React.ReactNode;
};

const DataInitializer = ({ children }: DataInitializerProps) => {
  const { fetchContracts } = useContracts();
  const { fetchUser } = useAuth();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchUser();
        await fetchContracts();
        setLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return <>{children}</>;
};

export default DataInitializer;
