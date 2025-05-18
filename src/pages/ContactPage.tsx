
import React from 'react';
import ContactForm from '@/components/contact/ContactForm';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Contact Our Support Team</h1>
        <ContactForm />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-health-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="text-health-primary" />
            </div>
            <h3 className="font-medium mb-2">Chat Support</h3>
            <p className="text-gray-600 text-sm">Available weekdays 9am-6pm</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-health-primary/10 flex items-center justify-center mb-4">
              <Mail className="text-health-primary" />
            </div>
            <h3 className="font-medium mb-2">Email</h3>
            <p className="text-gray-600 text-sm">support@healthmonitor.com</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-health-primary/10 flex items-center justify-center mb-4">
              <Phone className="text-health-primary" />
            </div>
            <h3 className="font-medium mb-2">Phone</h3>
            <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import { MessageSquare, Mail, Phone } from 'lucide-react';
