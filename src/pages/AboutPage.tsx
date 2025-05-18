
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Medical Director",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "Hardware Engineer",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 3,
    name: "Mei Lin",
    role: "Software Developer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "David Kumar",
    role: "Data Scientist",
    image: "https://randomuser.me/api/portraits/men/82.jpg",
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "Biomedical Engineer",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 6,
    name: "Michael Chen",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: 7,
    name: "Sophia Martinez",
    role: "Clinical Specialist",
    image: "https://randomuser.me/api/portraits/women/23.jpg",
  },
  {
    id: 8,
    name: "James Wilson",
    role: "Network Engineer",
    image: "https://randomuser.me/api/portraits/men/60.jpg",
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About Life Guard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Life Guard is a revolutionary health monitoring system designed to provide real-time tracking of vital health metrics using cutting-edge GSM808 sensor technology.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To empower individuals with accurate, real-time health data, enabling proactive health management and early intervention when needed. We believe that continuous monitoring leads to better health outcomes and peace of mind.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To revolutionize personal health monitoring by making hospital-grade vital signs tracking accessible to everyone, anywhere. We envision a world where preventative healthcare is the norm, not the exception.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Our Technology</h2>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Life Guard leverages the GSM808 sensor, a state-of-the-art device that combines multiple health monitoring capabilities with cellular connectivity. This allows for real-time transmission of vital health data from anywhere with cellular coverage, without requiring Wi-Fi or Bluetooth connections.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our system monitors three critical health metrics:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-6">
              <li><span className="font-semibold">Heart Rate:</span> Continuous monitoring of beats per minute, with alerts for abnormal rhythms.</li>
              <li><span className="font-semibold">Blood Oxygen Saturation (SpO2):</span> Tracking oxygen levels in your bloodstream, critical for respiratory health.</li>
              <li><span className="font-semibold">Body Temperature:</span> Precision temperature monitoring to detect fevers or hypothermia early.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              Data is encrypted end-to-end and transmitted securely to our servers, where it's analyzed and made available through both our web platform and mobile application.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
                  <CardContent className="p-0">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-48 object-cover object-center" 
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{member.name}</h3>
                      <p className="text-blue-500 dark:text-blue-400">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
