export interface VitalSignsApiResponse {
  temperature: number;
  heartRate: number;
  spo2: number;
  timestamp: string;
  deviceId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://lifeguard-seven.vercel.app/api';

function getToken() {
  return localStorage.getItem('token');
}

export const getLatestVitals = async (deviceId: string): Promise<VitalSignsApiResponse | null> => {
  const res = await fetch(`${API_BASE_URL}/vitals/latest/${deviceId}`, {
    headers: { Authorization: getToken() || '' },
  });
  if (!res.ok) return null;
  return await res.json();
};

export const submitVitals = async (data: Omit<VitalSignsApiResponse, 'timestamp'>): Promise<boolean> => {
  // Validate sensor readings
  if (
    data.temperature < -40 || data.temperature > 125 ||
    data.heartRate < 0 || data.heartRate > 200 ||
    data.spo2 < 0 || data.spo2 > 100
  ) {
    console.error("Invalid sensor readings detected:", data);
    return false; // Reject invalid data
  }

  const res = await fetch(`${API_BASE_URL}/vitals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken() || '',
    },
    body: JSON.stringify(data),
  });
  return res.ok;
};

export const getVitalsHistory = async (deviceId: string, limit = 20): Promise<VitalSignsApiResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/vitals/history/${deviceId}?limit=${limit}`, {
    headers: { Authorization: getToken() || '' },
  });
  if (!res.ok) return [];
  return await res.json();
};
