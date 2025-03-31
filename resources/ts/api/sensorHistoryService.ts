import axios from 'axios';

const API_BASE_URL = 'http://api_urbantree.alumnat.iesmontsia.org';

export async function fetchAllSensorHistories(): Promise<
  {
    dev_eui: string;
    time: string;
    phi_soil: number | null;
    humidity_soil: number | null;
  }[]
> {
  try {
    const response = await axios.get(`${API_BASE_URL}/sensors/history/all`);
    return response.data.map((entry: any) => ({
      dev_eui: entry.dev_eui,
      time: entry.time,
      phi_soil: entry.phi_soil || null,
      humidity_soil: entry.humidity_soil || null,
    }));
  } catch (error) {
    console.error('Error fetching all sensor histories:', error);

    return [
      {
        dev_eui: 'a84041265185f3fc',
        time: new Date().toISOString(),
        phi_soil: 6.8,
        humidity_soil: null,
      },
      {
        dev_eui: 'a840418401877546',
        time: new Date(
          new Date().setDate(new Date().getDate() - 1),
        ).toISOString(),
        phi_soil: null,
        humidity_soil: 45,
      },
    ];
  }
}
