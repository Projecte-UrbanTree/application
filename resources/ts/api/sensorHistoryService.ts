import axios from 'axios';

const API_BASE_URL = `http://api_urbantree.alumnat.iesmontsia.org`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-Key': import.meta.env.VITE_API_KEY,
  },
});

export interface SensorHistoryEntry {
  time: string;
  ph1_soil: number | null;
  humidity_soil: number | null;
}

function generateSimulatedData(): SensorHistoryEntry[] {
  const simulatedDate = new Date(2025, 4, 1);
  simulatedDate.setHours(12, 0, 0, 0);

  return [
    {
      time: simulatedDate.toISOString(),
      ph1_soil: 7,
      humidity_soil: 7,
    },
  ];
}

export async function fetchSensorHistoryByDevEui(
  dev_eui: string,
  startDate?: Date | null,
  endDate?: Date | null,
): Promise<SensorHistoryEntry[]> {
  if (!dev_eui?.trim()) {
    console.error('Invalid dev_eui provided');
    return [];
  }

  try {
    let url = `${API_BASE_URL}/sensors/deveui/${dev_eui}`;

    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate.toISOString());
    if (endDate) params.append('end', endDate.toISOString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axiosInstance.get(url);
    let data = Array.isArray(response.data) ? response.data : [];

    if (data.length === 0) {
      console.warn('No data from API, using simulated data for 1/05/2025');
      data = generateSimulatedData();
    }

    return data.map((entry: any) => ({
      time: entry.time,
      ph1_soil: entry.ph1_soil !== undefined ? Number(entry.ph1_soil) : null,
      humidity_soil:
        entry.humidity_soil !== undefined ? Number(entry.humidity_soil) : null,
    }));
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`Sensor history not found for dev_eui ${dev_eui}`);
      return generateSimulatedData();
    } else {
      console.error(
        `Error fetching sensor history for dev_eui ${dev_eui}:`,
        error,
      );
      return generateSimulatedData();
    }
  }
}
