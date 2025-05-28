import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { t } = useTranslation();

  const team = [
    { name: 'MW', role: 'Back-End Dev' },
    { name: 'MF', role: 'UX/UI Designer' },
    { name: 'MN', role: 'Front-End Dev' },
    { name: 'MAW', role: 'Front-End Dev' },
    { name: 'MAL', role: 'Application Dev (Flutter)' },
    { name: 'AA', role: 'Arduino Dev' },
    { name: 'AR', role: 'Front-End Dev' },
    { name: 'AM', role: 'Arduino Dev' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('ourTeam')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('teamDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {member.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
