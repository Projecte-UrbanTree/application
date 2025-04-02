import api from '../api';

export const fetchWorkReports = async () => {
  const response = await api.get('admin/work-reports');
  return response.data;
};
