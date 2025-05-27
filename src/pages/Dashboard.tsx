
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useVitalSigns } from '@/hooks/useVitalSigns';
import Header from '@/components/Header';
import VitalSignCard from '@/components/VitalSignCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Thermometer, Heart, Activity, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { current, history, isConnected, isLoading, error } = useVitalSigns(user?.deviceId);

  const formatChartData = () => {
    return history.slice(0, 20).map((reading, index) => ({
      time: new Date(reading.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      temperature: reading.temperature,
      heartRate: reading.heartRate,
      spo2: reading.spo2,
      index: history.length - index
    }));
  };

  const chartConfig = {
    temperature: {
      label: "Temperature",
      color: "#3b82f6",
    },
    heartRate: {
      label: "Heart Rate", 
      color: "#ef4444",
    },
    spo2: {
      label: "SpO2",
      color: "#10b981",
    },
  };

  if (isLoading && !current) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Connecting to device...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Patient Monitor
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Device: {user?.deviceId || 'Not configured'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Current Vital Signs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <VitalSignCard
            title="Temperature"
            value={current?.temperature ?? null}
            unit="°C"
            icon={<Thermometer className="h-5 w-5" />}
            normalRange={{ min: 36.1, max: 37.2 }}
            isConnected={isConnected || !!current}
          />
          <VitalSignCard
            title="Heart Rate"
            value={current?.heartRate ?? null}
            unit="bpm"
            icon={<Heart className="h-5 w-5" />}
            normalRange={{ min: 60, max: 100 }}
            isConnected={isConnected || !!current}
          />
          <VitalSignCard
            title="SpO2"
            value={current?.spo2 ?? null}
            unit="%"
            icon={<Activity className="h-5 w-5" />}
            normalRange={{ min: 95, max: 100 }}
            isConnected={isConnected || !!current}
          />
        </div>

        {/* Last Reading Timestamp */}
        {current && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Last reading: {new Date(current.timestamp).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Section */}
        {history.length > 0 && (
          <div className="space-y-6">
            {/* Temperature Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  <span>Temperature Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={[35, 39]}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Heart Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Heart Rate Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={[40, 120]}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="heartRate" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* SpO2 Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>SpO2 Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData()}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={[90, 100]}
                        tick={{ fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="spo2" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Data State */}
        {!current && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Waiting for Device Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your Arduino device to start monitoring vital signs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
