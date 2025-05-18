
import React, { useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      
      navigate('/login');
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <Dashboard />
      
      <div className="container mx-auto px-4 py-8 mt-8">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg p-6 shadow-sm dark:bg-gray-800/80 dark:backdrop-blur-sm dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">API Information</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your GSM808 sensor communicates with our platform using a secure API. To ensure the security of your health data, we use API keys for authentication.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">How to Obtain Your API Key</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Navigate to your Account Settings</li>
              <li>Select the "Developer" tab</li>
              <li>Click "Generate New API Key"</li>
              <li>Copy your API key and store it securely</li>
              <li>Program your GSM808 device with this key</li>
            </ol>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
            <h3 className="font-medium text-sm text-yellow-800 dark:text-yellow-300 mb-2">Security Notice</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Never share your API key with anyone. The key is unique to your device and account. If you suspect your key has been compromised, generate a new one immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
