import { formatDateForUrl, matchPath } from '@/utils/navigation';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateToDate = (date: Date, path: string) => {
    const dateStr = formatDateForUrl(date);
    navigate(`${path}?date=${dateStr}`, { replace: true });
  };

  return {
    matchPath: (patterns: string[]) => matchPath(patterns, location.pathname),
    formatDateForUrl,
    navigateToDate,
    currentPath: location.pathname,
  };
}
