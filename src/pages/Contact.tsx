
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contactTitle')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('contactDesc')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                {t('sendMessage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-105"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-105"
                />
                <Textarea
                  name="message"
                  placeholder={t('message')}
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="transition-all duration-200 focus:scale-105"
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 group">
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  {t('sendMessage')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Card className="group hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-xl w-full">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Email Us</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Get in touch with our support team
                </p>
                <a 
                  href="mailto:contact@lifeguard.com" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  contact@lifeguard.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
