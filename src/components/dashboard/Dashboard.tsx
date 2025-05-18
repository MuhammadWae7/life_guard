import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, ThermometerSun, Activity } from "lucide-react";
import VitalCard from './VitalCard';
import ReferenceCard from './ReferenceCard';
import { Button } from '@/components/ui/button';
import VitalChart from './VitalChart';
import { useToast } from "@/hooks/use-toast";
import { getLatestVitalData, VitalData, getUserVitalSigns } from '@/api/vitalsApi';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useAuth } from '@/hooks/useAuth';

// Initial empty data for the dashboard
const initialVitalSigns = {
  heartRate: 0,
  spo2: 0,
  temperature: 0
};

// Generate empty initial chart data
const generateEmptyChartData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 20; i >= 0; i--) {
    const pastTime = new Date(now.getTime() - i * 5000);
    const time = pastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    data.push({
      time,
      value: 0
    });
  }
  
  return data;
};

// Determine the status based on vital sign values
const getHeartRateStatus = (value: number) => {
  if (value === 0) return "normal"; // Default when no data
  if (value < 60 || value > 100) return "danger";
  if (value < 65 || value > 95) return "warning";
  return "normal";
};

const getSpo2Status = (value: number) => {
  if (value === 0) return "normal"; // Default when no data
  if (value < 95) return "danger";
  if (value < 97) return "warning";
  return "normal";
};

const getTemperatureStatus = (value: number) => {
  if (value === 0) return "normal"; // Default when no data
  if (value < 36 || value > 37.8) return "danger";
  if (value < 36.3 || value > 37.5) return "warning";
  return "normal";
};

// Device ID from environment variable
const DEVICE_ID = import.meta.env.VITE_DEVICE_ID || 'GSM808-DEFAULT';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const { deviceId } = useAuth(); // Get the device ID from auth context
  const isOffline = useOfflineStatus(); // Add the missing hook call
  const [vitalSigns, setVitalSigns] = useState(initialVitalSigns);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [heartRateData, setHeartRateData] = useState(generateEmptyChartData());
  const [spo2Data, setSpo2Data] = useState(generateEmptyChartData());
  const [temperatureData, setTemperatureData] = useState(generateEmptyChartData());
  
  const [animate, setAnimate] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  
  // Memoized function to fetch data
  const fetchVitalData = useCallback(async () => {
    if (isOffline) {
      setError("You are currently offline. Data cannot be updated.");
      return;
    }
    
    try {
      const data = await getLatestVitalData(DEVICE_ID);
      
      if (!data || typeof data.heartRate !== 'number' || typeof data.spo2 !== 'number' || typeof data.temperature !== 'number') {
        throw new Error("Invalid data format received from API");
      }
      
      // Update vital signs
      setVitalSigns({
        heartRate: data.heartRate,
        spo2: data.spo2,
        temperature: data.temperature
      });
      
      // Update last updated time
      setLastUpdated(new Date());
      
      // Update chart data
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setHeartRateData(prev => [...prev.slice(1), { time: currentTime, value: data.heartRate }]);
      setSpo2Data(prev => [...prev.slice(1), { time: currentTime, value: data.spo2 }]);
      setTemperatureData(prev => [...prev.slice(1), { time: currentTime, value: data.temperature }]);
      
      // Trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Error fetching vital data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vital data');
      
      // Show error toast only on first error
      if (!error) {
        toast({
          title: "Data Fetch Error",
          description: err instanceof Error ? err.message : 'Failed to fetch vital data',
          variant: "destructive",
        });
      }
    }
  }, [isOffline, toast, error]);
  
  // Function to fetch data for a specific device
  const fetchDataForDevice = useCallback((deviceId: string) => {
    // This would be replaced with actual API calls in a real implementation
    console.log(`Fetching data for device: ${deviceId}`);
    
    // For demo purposes, we'll use the mock API function
    if (isLive) {
      const interval = setInterval(async () => {
        try {
          const data = await getUserVitalSigns(deviceId);
          if (data) {
            setVitalSigns({
              heartRate: data.heartRate,
              spo2: data.spo2,
              temperature: data.temperature
            });
            
            // Update charts with new data
            const now = new Date();
            const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            setHeartRateData(prev => [...prev.slice(1), { time: currentTime, value: data.heartRate }]);
            setSpo2Data(prev => [...prev.slice(1), { time: currentTime, value: data.spo2 }]);
            setTemperatureData(prev => [...prev.slice(1), { time: currentTime, value: data.temperature }]);
            
            setAnimate(true);
            setTimeout(() => setAnimate(false), 1000);
          }
        } catch (error) {
          console.error("Error fetching vital signs:", error);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLive, setVitalSigns, setHeartRateData, setSpo2Data, setTemperatureData, setAnimate]);
  
  // Connect to API with proper error handling and reconnection logic
  const connectToAPI = useCallback(() => {
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "Cannot connect while offline. Please check your internet connection.",
        variant: "destructive",
      });
      return;
    }
    
    setConnectionStatus('connecting');
    
    // Use the device ID from auth context if available, otherwise use the default
    const activeDeviceId = deviceId || DEVICE_ID;
    
    // Attempt to fetch initial data
    fetchVitalData()
      .then(() => {
        setConnectionStatus('connected');
        setIsLive(true);
        toast({
          title: "Connected to GSM808 Sensor",
          description: `Now receiving real-time health data from device ${activeDeviceId}.`,
          variant: "default",
        });
        
        // Start fetching data for the specific device
        fetchDataForDevice(activeDeviceId);
      })
      .catch(() => {
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Failed",
          description: "Could not connect to GSM808 sensor. Please try again.",
          variant: "destructive",
        });
      });
  }, [fetchVitalData, toast, isOffline, deviceId, fetchDataForDevice]);
  
  const disconnectFromAPI = useCallback(() => {
    setIsLive(false);
    setConnectionStatus('disconnected');
    toast({
      title: "Disconnected",
      description: "Live monitoring has been stopped.",
      variant: "default",
    });
  }, [toast]);
  
  // Effect for polling data when live
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isLive && connectionStatus === 'connected') {
      // Fetch immediately and then set up interval
      fetchVitalData();
      
      interval = setInterval(() => {
        fetchVitalData();
      }, 5000); // Update every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive, connectionStatus, fetchVitalData]);
  
  // Auto-disconnect when going offline
  useEffect(() => {
    if (isOffline && isLive) {
      disconnectFromAPI();
      toast({
        title: "Connection Lost",
        description: "You are offline. Live monitoring has been paused.",
        variant: "destructive",
      });
    }
  }, [isOffline, isLive, disconnectFromAPI, toast]);
  
  // Format the last updated time
  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return 'Never';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(lastUpdated);
  }, [lastUpdated]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Vital Signs Monitor</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {formattedLastUpdated}
            </p>
          )}
        </div>
        <Button 
          onClick={isLive ? disconnectFromAPI : connectToAPI}
          className={`${
            connectionStatus === 'connecting' 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : isLive 
                ? 'bg-health-danger hover:bg-red-700' 
                : 'bg-health-primary hover:bg-health-secondary'
          }`}
          disabled={connectionStatus === 'connecting' || isOffline}
          aria-label={isLive ? "Stop live monitoring" : "Start live monitoring"}
        >
          {connectionStatus === 'connecting' 
            ? 'Connecting...' 
            : isLive 
              ? 'Stop Live Monitoring' 
              : 'Start Live Monitoring'
          }
        </Button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400">
          <p className="font-medium">Error: {error}</p>
          <p className="text-sm mt-1">Please check your connection and try again.</p>
        </div>
      )}
      
      {/* Offline indicator */}
      {isOffline && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-400">
          <p className="font-medium">You are currently offline</p>
          <p className="text-sm mt-1">Live monitoring is unavailable. Displaying last known data.</p>
        </div>
      )}
      
      {/* Live Indicator */}
      {isLive && connectionStatus === 'connected' && (
        <div className="flex items-center mb-6 animate-pulse">
          <div className="h-3 w-3 rounded-full bg-health-danger mr-2" aria-hidden="true"></div>
          <span className="text-sm font-medium text-health-danger">LIVE: Receiving real-time data from GSM808 sensor</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-fade-in">
        <VitalCard
          title="Heart Rate"
          value={vitalSigns.heartRate || "—"}
          unit="bpm"
          icon={<Heart className="animate-heartbeat" />}
          status={getHeartRateStatus(vitalSigns.heartRate)}
          normalRange="60-100 bpm"
          animate={animate}
          pulsing={true}
        />
        <VitalCard
          title="SpO2"
          value={vitalSigns.spo2 || "—"}
          unit="%"
          icon={<Activity />}
          status={getSpo2Status(vitalSigns.spo2)}
          normalRange="95-100%"
          animate={animate}
        />
        <VitalCard
          title="Body Temperature"
          value={vitalSigns.temperature || "—"}
          unit="°C"
          icon={<ThermometerSun />}
          status={getTemperatureStatus(vitalSigns.temperature)}
          normalRange="36.5-37.5°C"
          animate={animate}
        />
      </div>
      
      {/* Chart Section */}
      <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-6">Monitoring History</h3>
      <div className="space-y-8">
        <VitalChart 
          title="Heart Rate" 
          data={heartRateData} 
          unit="bpm" 
          normalRangeMin={60} 
          normalRangeMax={100}
          color="#ef4444" 
        />
        <VitalChart 
          title="Blood Oxygen" 
          data={spo2Data} 
          unit="%" 
          normalRangeMin={95} 
          normalRangeMax={100}
          color="#3b82f6" 
        />
        <VitalChart 
          title="Body Temperature" 
          data={temperatureData} 
          unit="°C" 
          normalRangeMin={36.5} 
          normalRangeMax={37.5}
          color="#f97316" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-4 mt-10">Reference Ranges</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        <ReferenceCard
          title="Heart Rate"
          range={{ min: 60, max: 100 }}
          unit="bpm"
          infoText="The normal resting heart rate for adults ranges from 60 to 100 beats per minute. Athletes may have lower resting heart rates, sometimes as low as 40 bpm."
        />
        <ReferenceCard
          title="Oxygen Saturation (SpO2)"
          range={{ min: 95, max: 100 }}
          unit="%"
          infoText="Normal SpO2 levels are 95% to 100%. Values below 95% may indicate inadequate oxygen in the blood and should be addressed."
        />
        <ReferenceCard
          title="Body Temperature"
          range={{ min: 36.5, max: 37.5 }}
          unit="°C"
          infoText="Normal body temperature typically ranges from 36.5°C to 37.5°C (97.7°F to 99.5°F). Temperatures outside this range may indicate fever or hypothermia."
        />
      </div>
    </div>
  );
};

export default Dashboard;
