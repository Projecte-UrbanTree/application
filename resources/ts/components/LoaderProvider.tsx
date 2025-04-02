import Preloader from '@/components/Preloader';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function LoaderProvider() {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 300);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 w-screen h-screen
                backdrop-blur-md transition-opacity duration-300 ${
                  isLoading ? 'opacity-100' : 'opacity-0'
                }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
      <Preloader bg_white={false} />
    </div>
  );
}
