import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface VitalSigns {
  temperature: number;
  heartRate: number;
  spo2: number;
  timestamp: Date;
}

interface VitalSignsData {
  current: VitalSigns | null;
  history: VitalSigns[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useVitalSigns = (deviceId: string | undefined) => {
  const [data, setData] = useState<VitalSignsData>({
    current: null,
    history: [],
    isConnected: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!deviceId) {
      setData(prev => ({ ...prev, isLoading: false, error: 'No device ID provided' }));
      return;
    }

    let subscription: any = null;
    let isMounted = true;

    const fetchVitals = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      const { data: readings, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) {
        setData(prev => ({ ...prev, isLoading: false, error: error.message }));
        return;
      }
      if (readings && readings.length > 0) {
        const latest = readings[0];
        setData(prev => ({
          ...prev,
          current: {
            temperature: latest.temperature,
            heartRate: latest.heart_rate,
            spo2: latest.spo2,
            timestamp: new Date(latest.created_at)
          },
          history: readings.map((r: any) => ({
            temperature: r.temperature,
            heartRate: r.heart_rate,
            spo2: r.spo2,
            timestamp: new Date(r.created_at)
          })),
          isConnected: true,
          isLoading: false,
          error: null
        }));
      } else {
        setData(prev => ({ ...prev, isLoading: false, error: null, current: null, history: [] }));
      }
    };

    fetchVitals();

    // Subscribe to real-time inserts for this device
    subscription = supabase
      .channel('vitals-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vitals', filter: `device_id=eq.${deviceId}` },
        (payload) => {
          const newReading = payload.new;
          if (!isMounted) return;
          setData(prev => {
            const vitalSigns: VitalSigns = {
              temperature: newReading.temperature,
              heartRate: newReading.heart_rate,
              spo2: newReading.spo2,
              timestamp: new Date(newReading.created_at)
            };
            return {
              ...prev,
              current: vitalSigns,
              history: [vitalSigns, ...prev.history].slice(0, 20),
              isConnected: true,
              isLoading: false,
              error: null
            };
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [deviceId]);

  return data;
};
