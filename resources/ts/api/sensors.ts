import axiosClient from "./axiosClient";
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
