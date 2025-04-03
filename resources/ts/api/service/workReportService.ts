import axiosClient from '../axiosClient';

export const fetchWorkReports = async () => {
  const response = await axiosClient.get('admin/work-reports');
  return response.data;
};
