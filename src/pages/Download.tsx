
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download as DownloadIcon, Smartphone, Globe } from 'lucide-react';

const Download = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('downloadTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('downloadDesc')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {t('androidApp')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Download our mobile app for Android devices
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 group">
                  <DownloadIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Download APK
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Web App (PWA)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Install as a Progressive Web App from your browser
                </p>
                <Button variant="outline" className="group">
                  <DownloadIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Install PWA
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
