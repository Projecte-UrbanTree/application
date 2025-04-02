import { useToastContext } from '@/contexts/ToastContext';

export default function useToast() {
  const { showToast } = useToastContext();

  return { showToast };
}
