import axios from 'axios';

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

export const fetchSensors = async () => {
  try {
    const apiKey = import.meta.env.VITE_X_API_KEY;
    const response = await axios.get(
      'http://api_urbantree.alumnat.iesmontsia.org/sensors',
      {
        headers: {
          'X-API-Key': apiKey,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching sensors:', error);
    throw error;
  }
};
export const fetchSensorByEUI = async (eui: string) => {
  try {
    const apiKey = import.meta.env.VITE_X_API_KEY;
    const response = await axios.get(
      `http://api_urbantree.alumnat.iesmontsia.org/sensors/deveui/${eui}`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor by EUI:', error);
    throw error;
  }
};
