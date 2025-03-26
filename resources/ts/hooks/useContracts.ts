import api from '@/services/api';
import { type Contract } from '@/types/Contract';
import { useEffect, useState } from 'react';
interface UseContractsResult {
  contracts: Contract[];
  loading: boolean;
}

export function useContracts(): UseContractsResult {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Load contracts on mount
  useEffect(() => {
    const loadContracts = async (retryCount = 0) => {
      api
        .get<Contract[]>('/me/contract/edit')
        .then(({ data }) => {
          setContracts([
            {
              id: null,
              name: 'All Contracts',
              status: 0,
            },
            ...data.filter((contract) => contract.status === 0),
          ]);
        })
        .catch((error) => {
          if (error && retryCount < 2) {
            console.error('Failed to load contracts, retrying...', error);
            setTimeout(() => loadContracts(retryCount + 1), 1000);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    loadContracts();
  }, []);

  return {
    contracts,
    loading,
  };
}
