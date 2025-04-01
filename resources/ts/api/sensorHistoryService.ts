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

export async function fetchSensorHistoryByDevEui(
  dev_eui: string,
  startDate?: Date | null,
  endDate?: Date | null,
): Promise<SensorHistoryEntry[]> {
  if (!dev_eui?.trim()) {
    console.error('Invalid dev_eui provided');
    return [];
  }

  // Definimos la fecha de hoy como 1 de abril de 2025
  const today = new Date('2025-04-01T12:00:00Z');

  // Verificamos si el rango solicitado incluye hoy
  const includesToday =
    (!startDate || today >= startDate) && (!endDate || today <= endDate);

  if (includesToday) {
    // Solo devolvemos un único dato para hoy
    return [
      {
        time: today.toISOString(),
        ph1_soil: 6.5, // Valor simulado de pH
        humidity_soil: 42, // Valor simulado de humedad
      },
    ];
  }

  // Para cualquier otro rango, devolvemos array vacío
  return [];
}
