import { formatDateForUrl } from '@/utils/navigation';
import { Icon } from '@iconify/react';
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface WorkOrdersProps {
  children?: React.ReactNode;
}

export const WorkOrdersNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Inicializa la fecha desde la URL o usa hoy
  useEffect(() => {
    if (location.pathname.startsWith('/app/work-orders')) {
      const searchParams = new URLSearchParams(location.search);
      const dateParam = searchParams.get('date');

      if (dateParam) {
        // Crear fecha a las 12:00 para evitar problemas de zona horaria
        const date = new Date(dateParam + 'T12:00:00');
        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
        }
      } else {
        // Si no hay fecha en la URL, establecer a hoy y actualizar URL
        const today = new Date();
        const dateStr = formatDateForUrl(today);
        navigate(`/app/work-orders?date=${dateStr}`, { replace: true });
      }
    }
  }, [location.pathname]);

  // Date navigation handlers
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);

    // Update URL if we're on the work orders page
    if (location.pathname.startsWith('/app/work-orders')) {
      const dateStr = formatDateForUrl(prevDay);
      navigate(`/app/work-orders?date=${dateStr}`, { replace: true });
    }
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Establecer horas, minutos, segundos a 12:00:00 para comparación consistente
    nextDay.setHours(12, 0, 0, 0);

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    // Allow navigation up to and including today
    if (nextDay.getTime() <= today.getTime()) {
      setSelectedDate(nextDay);

      // Update URL if we're on the work orders page
      if (location.pathname.startsWith('/app/work-orders')) {
        const dateStr = formatDateForUrl(nextDay);
        navigate(`/app/work-orders?date=${dateStr}`, { replace: true });
      }
    }
  };

  const handleCalendarChange = (date: Date) => {
    // Asegurar que la fecha es válida
    if (!date || isNaN(date.getTime())) return;

    // Establecer hora a mediodía para evitar problemas de zona horaria
    date.setHours(12, 0, 0, 0);
    setSelectedDate(date);

    // Update URL if we're on the work orders page
    if (location.pathname.startsWith('/app/work-orders')) {
      const dateStr = formatDateForUrl(date);
      navigate(`/app/work-orders?date=${dateStr}`, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 w-full">
      <button
        onClick={handlePreviousDay}
        className="p-2 rounded-full hover:bg-gray-200">
        <Icon icon="tabler:chevron-left" width="20px" />
      </button>
      <Calendar
        value={selectedDate}
        onChange={(e) => {
          if (e.value) handleCalendarChange(e.value as Date);
        }}
        maxDate={new Date()}
        showButtonBar
        dateFormat="dd M yy"
        className="p-inputtext-sm"
      />
      <button
        onClick={handleNextDay}
        className="p-2 rounded-full hover:bg-gray-200">
        <Icon icon="tabler:chevron-right" width="20px" />
      </button>
    </div>
  );
};

const WorkOrders: React.FC<WorkOrdersProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default WorkOrders;
