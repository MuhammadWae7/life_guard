
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Mail } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const team = [
    {
      name: 'Ahmed Hassan',
      role: 'Lead Developer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'ahmed@lifeguard.com'
    },
    {
      name: 'Sarah Johnson',
      role: 'Hardware Engineer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'sarah@lifeguard.com'
    },
    {
      name: 'Mohamed Ali',
      role: 'Health Specialist',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'mohamed@lifeguard.com'
    },
    {
      name: 'Fatima Alkaabi',
      role: 'Frontend Developer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'fatima@lifeguard.com'
    },
    {
      name: 'Omar Khalil',
      role: 'Backend Developer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'omar@lifeguard.com'
    },
    {
      name: 'Layla Rahman',
      role: 'Mobile Developer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'layla@lifeguard.com'
    },
    {
      name: 'Khalid Mansour',
      role: 'DevOps Engineer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'khalid@lifeguard.com'
    },
    {
      name: 'Nour Farouk',
      role: 'UI/UX Designer',
      image: '/placeholder.svg',
      github: '#',
      linkedin: '#',
      email: 'nour@lifeguard.com'
    }
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
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {member.role}
                </p>
                <div className="flex justify-center space-x-4">
                  <a href={member.github} className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href={member.linkedin} className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
