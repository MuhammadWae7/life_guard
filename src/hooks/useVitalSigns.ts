import { useState, useEffect } from 'react';
import { getLatestVitals, getVitalsHistory } from '../api/vitalsApi';

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
    let isMounted = true;
    let ws: WebSocket | null = null;
    const fetchVitals = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const latest = await getLatestVitals(deviceId);
        const history = await getVitalsHistory(deviceId, 20);
        if (!isMounted) return;
        setData({
          current: latest ? {
            temperature: latest.temperature,
            heartRate: latest.heartRate,
            spo2: latest.spo2,
            timestamp: new Date(latest.timestamp)
          } : null,
          history: history.map(r => ({
            temperature: r.temperature,
            heartRate: r.heartRate,
            spo2: r.spo2,
            timestamp: new Date(r.timestamp)
          })),
          isConnected: !!latest,
          isLoading: false,
          error: null
        });
      } catch (e: any) {
        setData(prev => ({ ...prev, isLoading: false, error: e.message }));
      }
    };
    fetchVitals();

    // WebSocket for real-time updates
    const wsUrl = (import.meta.env.VITE_WS_URL || 'ws://localhost:3001').replace(/^http/, 'ws');
    ws = new window.WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'new_vital' && msg.data.deviceId === deviceId) {
        setData(prev => {
          const vital = {
            temperature: msg.data.temperature,
            heartRate: msg.data.heartRate,
            spo2: msg.data.spo2,
            timestamp: new Date(msg.data.timestamp)
          };
          return {
            ...prev,
            current: vital,
            history: [vital, ...prev.history].slice(0, 20),
            isConnected: true,
            isLoading: false,
            error: null
          };
        });
      }
    };
    ws.onerror = () => setData(prev => ({ ...prev, isConnected: false }));
    ws.onclose = () => setData(prev => ({ ...prev, isConnected: false }));

    return () => { isMounted = false; ws && ws.close(); };
  }, [deviceId]);

  return data;
};
