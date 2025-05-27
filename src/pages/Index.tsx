
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { Heart, Shield, Activity, ArrowRight, Play } from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Activity className="h-8 w-8" />,
      title: t('realTimeMonitoring'),
      description: t('realTimeDesc')
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('secureData'),
      description: t('secureDataDesc')
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: t('multiDevice'),
      description: t('multiDeviceDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {t('heroSubtitle')}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              {t('heroDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                  {t('getStarted')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="px-8 py-3 rounded-lg font-semibold border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group">
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  {t('learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('features')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="medical-card hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Monitor Your Health?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust Life Guard for professional health monitoring
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                {t('getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">{t('heroTitle')}</span>
          </div>
          <p className="text-gray-400">
            © 2024 Life Guard. Professional health monitoring solutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
