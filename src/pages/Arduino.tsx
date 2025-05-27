
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Zap, Activity, Thermometer } from 'lucide-react';

const Arduino = () => {
  const { t } = useTranslation();

  const components = [
    {
      name: 'MAX30102 Sensor',
      description: 'Heart rate and SpO2 sensor for accurate vital signs monitoring',
      icon: <Activity className="h-8 w-8" />,
      required: true
    },
    {
      name: 'Arduino Uno R3',
      description: 'Main microcontroller board for processing sensor data',
      icon: <Cpu className="h-8 w-8" />,
      required: true
    },
    {
      name: 'GSM 808 Module',
      description: 'Wireless communication module for data transmission',
      icon: <Zap className="h-8 w-8" />,
      required: true
    },
    {
      name: 'LM35 DZ Temperature Sensor',
      description: 'Precision temperature sensor for body temperature measurement',
      icon: <Thermometer className="h-8 w-8" />,
      required: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('arduinoTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('arduinoDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {components.map((component, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">{component.icon}</span>
                  </div>
                  {component.required && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <CardTitle className="text-gray-900 dark:text-white">
                  {component.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {component.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Arduino;
