import axiosClient from "./axiosClient";
interface SensorModulationLoRa {
  bandwidth: number;
  spreadingFactor: number;
  codeRate: string;
}

interface SensorModulation {
  lora: SensorModulationLoRa;
}
const sensorDataCache = new Map<string, Sensor[]>();
export interface Sensor {
  id: number;
  device_name: string;
  device_profile_name: string;
  temp_soil: number;
  tempc_ds18b20: number;
  ph1_soil: number;
  water_soil: number | null;
  conductor_soil: number | null;
  bat: number;
  dev_eui: string;
  dev_addr: string;
  gw_time: string;
  time: string;
  created_at: string;
  updated_at: string;
  latitude: number;
  longitude: number;
  rssi: number;
  snr: number;
  modulation: SensorModulation;
}

export const fetchSensors = async () => {
  try {
    const response = await axiosClient.get('/admin/sensorshistory');
    console.log('External Sensors API Response:', response.data); 
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return [];
  }
};

export const fetchSensorByEUI = async (eui: string) => {
  try {
    const response = await axiosClient.get(`/admin/sensors/${eui}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor by EUI:', error);
    throw error;
  }
};

export const fetchSensorHistoryPaginated = async (eui: string, page = 1, perPage = 10) => {
  const cacheKey = `${eui}-${page}-${perPage}`;
  
  // Verificar si los datos están en caché
  if (sensorDataCache.has(cacheKey)) {
    return sensorDataCache.get(cacheKey);
  }

  try {
    const response = await axiosClient.get(`/admin/sensors/${eui}/history/paginated`, {
      params: { page, perPage }
    });
    
    // Almacenar en caché
    sensorDataCache.set(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated sensor history:', error);
    throw error;
  }
};

export const fetchAndStoreSensorData = async (eui: string) => {
  try {
    const response = await axiosClient.get(`/admin/sensors/${eui}/fetch-and-store`);
    return response.data;
  } catch (error) {
    console.error('Error fetching and storing sensor data:', error);
    throw error;
  }
};
