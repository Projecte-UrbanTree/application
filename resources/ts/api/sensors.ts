import axiosClient from './axiosClient';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const sensorCache = new Map<string, { data: any; timestamp: number }>();

// Type definitions
interface SensorModulationLoRa {
  bandwidth: number;
  spreadingFactor: number;
  codeRate: string;
}

interface SensorModulation {
  lora: SensorModulationLoRa;
}

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

// Helper functions
const isCacheValid = (key: string): boolean => {
  const cachedItem = sensorCache.get(key);
  if (!cachedItem) return false;

  const now = Date.now();
  return now - cachedItem.timestamp < CACHE_TTL;
};

const getCachedData = <T>(key: string): T | null => {
  if (!isCacheValid(key)) return null;
  return sensorCache.get(key)?.data as T;
};

const setCacheData = <T>(key: string, data: T): void => {
  sensorCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// API functions
export const fetchSensors = async (): Promise<Sensor[]> => {
  const cacheKey = 'all-sensors';

  // Try to get from cache first
  const cachedData = getCachedData<Sensor[]>(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axiosClient.get('/admin/sensorshistory');
    const data = Array.isArray(response.data) ? response.data : [];

    // Store in cache
    setCacheData(cacheKey, data);
    return data;
  } catch (error: any) {
    console.error('Error fetching sensors:', error.message);
    return [];
  }
};

export const fetchSensorByEUI = async (eui: string): Promise<any> => {
  const cacheKey = `sensor-${eui}`;

  // Try to get from cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axiosClient.get(`/admin/sensors/${eui}/history`);

    // Store in cache
    setCacheData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor by EUI:', error);
    throw error;
  }
};

export const fetchSensorHistoryPaginated = async (
  eui: string,
  page = 1,
  perPage = 10,
): Promise<any> => {
  const cacheKey = `sensor-history-${eui}-${page}-${perPage}`;

  // Try to get from cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axiosClient.get(
      `/admin/sensors/${eui}/history/paginated`,
      {
        params: { page, perPage },
      },
    );

    // Store in cache
    setCacheData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated sensor history:', error);
    throw error;
  }
};

export const fetchAndStoreSensorData = async (eui: string): Promise<any> => {
  try {
    // This is a write operation, so we clear related cache entries
    const keysToDelete: string[] = [];

    sensorCache.forEach((_, key) => {
      if (key === 'all-sensors' || key.startsWith(`sensor-${eui}`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => sensorCache.delete(key));

    // Make the API request
    const response = await axiosClient.get(
      `/admin/sensors/${eui}/fetch-and-store`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching and storing sensor data:', error);
    throw error;
  }
};

// Cache management
export const clearSensorsCache = (): void => {
  sensorCache.clear();
};
