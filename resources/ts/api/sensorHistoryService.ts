import axios from 'axios';

const API_BASE_URL = 'http://api_urbantree.alumnat.iesmontsia.org';

export interface SensorHistoryParams {
  device_name?: string;
  application_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface SensorHistory {
  id: number;
  device_eui: number;
  device_name?: string;
  application_id?: string;
  time: string;
  temp_soil?: number;
  phi_soil?: number;
  bat?: number;
  tempc_ds18b20?: number;
  [key: string]: any;
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY,
  },
});

export async function fetchSensorHistory(
  devEui: string,
  range: 'week' | 'month' | 'custom',
  startDate?: string,
  endDate?: string,
): Promise<{
  labels: string[];
  datasets: { label: string; data: number[] }[];
}> {
  try {
    const params = { range, startDate, endDate };
    const response = await axiosInstance.get(
      `/api/admin/sensors/${devEui}/history`,
      { params },
    );

    // Retorna les dades en el format adequat per a les gràfiques
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    throw new Error('Failed to fetch sensor history');
  }
}

export async function fetchSensors(devEuis?: string[]): Promise<any[]> {
  try {
    const params: any = {};
    if (devEuis) params.dev_euis = devEuis;

    const response = await axiosInstance.get('/sensors', { params });

    if (!response.data || response.data.length === 0) {
      console.warn('No sensors found for the provided dev_euis:', devEuis);
      return [];
    }

    // Filtra sensors únics per `dev_eui`
    const uniqueSensors = response.data.reduce((acc: any[], sensor: any) => {
      if (!acc.some((s) => s.dev_eui === sensor.dev_eui)) {
        acc.push(sensor);
      }
      return acc;
    }, []);

    return uniqueSensors;
  } catch (error: any) {
    console.error('Error fetching sensors:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sensors');
  }
}

export async function fetchAllSensorsHistory(
  range: 'week' | 'month' | 'custom',
  startDate?: string,
  endDate?: string,
): Promise<SensorHistory[]> {
  const params = { range, startDate, endDate };
  const response = await axiosInstance.get('/sensors/history', { params });
  return response.data;
}

export async function updateSensor(
  devEui: string,
  updatedData: Partial<any>,
): Promise<any> {
  try {
    // Assegura que l'endpoint és correcte i que el `devEui` es passa adequadament
    const response = await axiosInstance.put(
      `/api/admin/sensors/${devEui}`, // Endpoint correcte per al microservei
      updatedData,
    );
    return response.data; // Retorna les dades actualitzades del sensor
  } catch (error: any) {
    console.error('Error updating sensor:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to update sensor');
  }
}

export async function deleteSensor(devEui: string): Promise<void> {
  try {
    await axiosInstance.delete(`/api/admin/sensors/${devEui}`);
  } catch (error) {
    console.error('Error deleting sensor:', error);
    throw new Error('Failed to delete sensor');
  }
}
