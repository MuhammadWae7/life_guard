export interface VitalSignsApiResponse {
  temperature: number;
  heartRate: number;
  spo2: number;
  timestamp: string;
  deviceId: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
