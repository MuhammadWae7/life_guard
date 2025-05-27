import { supabase } from '../supabaseClient';

export interface VitalSignsApiResponse {
  temperature: number;
  heartRate: number;
  spo2: number;
  timestamp: string;
  deviceId: string;
}

export const getLatestVitals = async (deviceId: string): Promise<VitalSignsApiResponse | null> => {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  if (!data) return null;
  return {
    temperature: data.temperature,
    heartRate: data.heart_rate,
    spo2: data.spo2,
    timestamp: data.created_at,
    deviceId: data.device_id,
  };
};

export const submitVitals = async (data: Omit<VitalSignsApiResponse, 'timestamp'>): Promise<boolean> => {
  const { error } = await supabase.from('vitals').insert([
    {
      temperature: data.temperature,
      heart_rate: data.heartRate,
      spo2: data.spo2,
      device_id: data.deviceId,
    },
  ]);
  return !error;
};

export const getVitalsHistory = async (deviceId: string, limit = 20): Promise<VitalSignsApiResponse[]> => {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((row: any) => ({
    temperature: row.temperature,
    heartRate: row.heart_rate,
    spo2: row.spo2,
    timestamp: row.created_at,
    deviceId: row.device_id,
  }));
};
