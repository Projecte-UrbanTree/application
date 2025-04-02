import useI18n from '@/hooks/useI18n';
import useToast from '@/hooks/useToast';
import api from '@/services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseCrudDataProps<T> {
  endpoint: string;
  getItemName: (item: T) => string;
  createPath: string;
  editPath: (id: number) => string;
  conditions?: {
    edit?: (item: T) => boolean;
    delete?: (item: T) => boolean;
  };
  onDeleteSuccess?: () => void;
  onDeleteError?: () => void;
}

export default function useCrudData<T extends { id: number }>({
  endpoint,
  getItemName,
  createPath,
  editPath,
  conditions = {},
  onDeleteSuccess,
  onDeleteError,
}: UseCrudDataProps<T>) {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const { showToast } = useToast();
  const { format } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (error) {
      console.error(error);
      showToast(
        'error',
        format('states.error'),
        format('messages.error_loading'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canDelete = (item: T) => {
    return !conditions.delete || conditions.delete(item);
  };

  const canEdit = (item: T) => {
    return !conditions.edit || conditions.edit(item);
  };

  const handleDelete = async (item: T) => {
    if (!canDelete(item)) {
      showToast(
        'warn',
        format('states.warning'),
        format('messages.operation_not_allowed'),
      );
      return;
    }

    if (
      window.confirm(
        format({
          key: 'messages.confirm_delete',
          options: { item: getItemName(item) },
        }),
      )
    ) {
      setIsLoading(true);
      try {
        await api.delete(`${endpoint}/${item.id}`);
        setItems(items.filter((i) => i.id !== item.id));
        showToast(
          'success',
          format('states.deleted'),
          format({
            key: 'messages.success_delete',
            options: { item: getItemName(item) },
          }),
        );
        if (onDeleteSuccess) onDeleteSuccess();
      } catch (error) {
        showToast(
          'error',
          format('states.error'),
          format({
            key: 'messages.error_deleting',
            options: {
              item: getItemName(item),
            },
          }),
        );
        if (onDeleteError) onDeleteError();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreate = () => navigate(createPath);

  const handleEdit = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item && !canEdit(item)) {
      showToast(
        'warn',
        format('states.warning'),
        format('messages.operation_not_allowed'),
      );
      return;
    }
    navigate(editPath(id));
  };

  return {
    canDelete,
    canEdit,
    getItemName,
    handleCreate,
    handleDelete,
    handleEdit,
    isLoading,
    items,
    refresh: fetchData,
  };
}
