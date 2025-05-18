
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Activity, ThermometerSun } from 'lucide-react';
import VitalCard from '@/components/vitals/VitalCard';

const HomePage: React.FC = () => {
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 75,
    spo2: 98,
    temperature: 36.6
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate changing vitals
      setVitalSigns({
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
        spo2: Math.floor(Math.random() * 5) + 95, // 95-100%
        temperature: parseFloat((Math.random() * 2 + 36).toFixed(1)) // 36-38°C
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Your Health, <br />Monitored in <span className="text-blue-500">Real-Time</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Life Guard provides continuous monitoring of your vital health metrics, giving you peace of mind and valuable insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="dark:border-gray-700 dark:text-gray-200">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <VitalCard title="Heart Rate" subtitle="Beats per minute" value={vitalSigns.heartRate} unit="bpm" icon={<Heart className="text-red-500" size={24} />} status={vitalSigns.heartRate < 60 || vitalSigns.heartRate > 100 ? "danger" : "normal"} animate={true} />
            
            <VitalCard title="Temperature" subtitle="Body temperature" value={vitalSigns.temperature} unit="°C" icon={<ThermometerSun className="text-amber-500" size={24} />} status={vitalSigns.temperature < 36 || vitalSigns.temperature > 37.8 ? "danger" : "normal"} animate={true} />
            
            <VitalCard title="Blood Oxygen" subtitle="SpO2 Saturation" value={vitalSigns.spo2} unit="%" icon={<Activity className="text-blue-500" size={24} />} status={vitalSigns.spo2 < 95 ? "danger" : "normal"} animate={true} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How Life Guard Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-700">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                <Heart className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Real-time Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                The GSM808 sensor continuously tracks your vital signs and transmits data in real-time via cellular connection.
              </p>
            </div>
            <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-700">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                <Activity className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Data Security</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your health data is securely transmitted and stored using industry-standard encryption and security protocols.
              </p>
            </div>
            <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-700">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                <ThermometerSun className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Mobile Integration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your health data on-the-go with our mobile app, providing you with insights wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to monitor your health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their health with Life Guard's real-time monitoring solution.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-base bg-zinc-50 text-sky-900">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
