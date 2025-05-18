
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ArduinoComponent {
  id: number;
  title: string;
  description: string;
  image: string;
  purpose: string;
  specifications: string[];
}

const components: ArduinoComponent[] = [
  {
    id: 1,
    title: "GSM808 Module",
    description: "Cellular communication module with integrated GPS capabilities",
    image: "https://via.placeholder.com/400x300?text=GSM808+Module",
    purpose: "Provides cellular connectivity to transmit health data and location information in real-time.",
    specifications: [
      "Quad-band GSM/GPRS (850/900/1800/1900MHz)",
      "Integrated GPS/GNSS receiver",
      "TCP/IP stack with HTTP, FTP protocols",
      "Operating voltage: 3.4V-4.4V DC",
      "SMS support in text and PDU mode"
    ]
  },
  {
    id: 2,
    title: "MAX30102 Sensor",
    description: "High-precision optical sensor for heart rate and SpO2 monitoring",
    image: "https://via.placeholder.com/400x300?text=MAX30102+Sensor",
    purpose: "Accurately measures heart rate and blood oxygen saturation (SpO2) through optical sensing.",
    specifications: [
      "Integrated red and IR LEDs with photodetector",
      "Low power operation (<1mA)",
      "High SNR optical detection",
      "I2C digital interface",
      "Programmable sample rate and LED current"
    ]
  },
  {
    id: 3,
    title: "Arduino Nano",
    description: "Compact microcontroller board based on the ATmega328P",
    image: "https://via.placeholder.com/400x300?text=Arduino+Nano",
    purpose: "Acts as the central processing unit, collecting data from sensors and controlling communication.",
    specifications: [
      "ATmega328 microcontroller",
      "Operating voltage: 5V",
      "14 digital I/O pins (6 PWM outputs)",
      "8 analog inputs",
      "16 MHz clock speed",
      "32KB flash memory"
    ]
  },
  {
    id: 4,
    title: "LM35DZ Temperature Sensor",
    description: "Precision centigrade temperature sensor with linear output",
    image: "https://via.placeholder.com/400x300?text=LM35DZ+Sensor",
    purpose: "Provides accurate body temperature measurements with minimal calibration required.",
    specifications: [
      "Calibrated directly in Celsius",
      "Linear +10-mV/°C scale factor",
      "±0.5°C accuracy at 25°C",
      "Operation from 4V to 30V",
      "Low self-heating",
      "Low impedance output"
    ]
  }
];

const ArduinoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Arduino Hardware Components</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Life Guard uses cutting-edge Arduino-compatible components to monitor your vital signs with precision and reliability.
            Our hardware is designed for comfort, accuracy, and real-time data transmission.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {components.map((component, index) => (
            <motion.div 
              key={component.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="flex flex-col"
            >
              <Card className="overflow-hidden h-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                <CardContent className="p-0">
                  <img 
                    src={component.image} 
                    alt={component.title}
                    className="w-full h-52 object-cover object-center" 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{component.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{component.description}</p>
                    
                    <h4 className="text-sm font-semibold text-blue-500 mb-2">Purpose:</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{component.purpose}</p>
                    
                    <h4 className="text-sm font-semibold text-blue-500 mb-2">Specifications:</h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                      {component.specifications.map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArduinoPage;
