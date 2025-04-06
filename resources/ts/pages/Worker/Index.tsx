import { useCallback,useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import axiosClient from '@/api/axiosClient';
import { RootState } from '@/store/store';

const WorkerWorkOrders = () => {
  const { t } = useTranslation();
  const currentContract = useSelector((state: RootState) => state.contract.currentContract);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkOrders = useCallback(async () => {
    if (!currentContract) return;

    setLoading(true);
    try {
      const response = await axiosClient.get(`/worker/work-orders`);
      setWorkOrders(response.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
    setLoading(false);
  }, [currentContract]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  return (
    <>
    WorkOrders
    </>
  );
};

export default WorkerWorkOrders;