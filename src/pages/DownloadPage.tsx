
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowDown, Smartphone, Tablet, Laptop, ExternalLink } from 'lucide-react';

const DownloadPage = () => {
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  
  const handleDownload = () => {
    setShowDownloadMessage(true);
    setTimeout(() => setShowDownloadMessage(false), 3000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Download Life Guard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Access your health data anytime, anywhere with our mobile application. 
            Stay connected to your vital signs and receive real-time alerts.
          </p>
          
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10"
            >
              <Button 
                onClick={handleDownload}
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowDown className="mr-2" />
                Download Android App
              </Button>
            </motion.div>
            
            {showDownloadMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-lg shadow-md"
              >
                Download starting...
              </motion.div>
            )}
            
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Latest version: 1.2.3 | Released: May 15, 2023
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="text-blue-500 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Mobile App</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our Android app offers a streamlined experience optimized for smartphones.
            </p>
            <Button variant="outline" onClick={handleDownload} className="w-full dark:border-gray-700 dark:text-gray-200">
              Download for Android
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Tablet className="text-blue-500 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Tablet Version</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our tablet interface provides expanded visualizations and easier data entry.
            </p>
            <Button variant="outline" onClick={handleDownload} className="w-full dark:border-gray-700 dark:text-gray-200">
              Download for Tablets
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Laptop className="text-blue-500 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Web App</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Use our progressive web app for a full-featured experience on any device.
            </p>
            <Button variant="outline" className="w-full dark:border-gray-700 dark:text-gray-200">
              <ExternalLink className="mr-2 h-4 w-4" />
              Use Web App
            </Button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Why Download Our App?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Real-time health monitoring</li>
                <li>Customizable alerts and notifications</li>
                <li>Historical data visualization</li>
                <li>Health trends and insights</li>
                <li>Secure data encryption</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">Requirements:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Android 7.0 or higher</li>
                <li>At least 50MB of storage space</li>
                <li>Internet connection for data synchronization</li>
                <li>GPS for emergency location services (optional)</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadPage;
