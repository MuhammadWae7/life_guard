
// This is a mock API implementation
// In a production environment, this would be replaced with actual API calls to your backend

// Define the vital signs data structure
export interface VitalSignsData {
  heartRate: number;
  spo2: number;
  temperature: number;
  timestamp: string;
  deviceId: string;
}

// API key for authentication from environment variables
const API_KEY = import.meta.env.VITE_API_KEY || "development-only-key";

// Mock function to simulate receiving vital signs data from the GSM808 sensor
export const receiveVitalSigns = async (data: VitalSignsData, apiKey: string): Promise<{success: boolean, message?: string}> => {
  // This is where you'd validate the API key
  if (apiKey !== API_KEY) {
    console.error('Invalid API key');
    return {
      success: false,
      message: 'Authentication failed. Invalid API key.'
    };
  }
  
  try {
    // In a real implementation, this would save data to your database
    console.log('Received vital signs data:', data);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: 'Data received successfully'
    };
  } catch (error) {
    console.error('Error processing vital signs data:', error);
    return {
      success: false,
      message: 'Error processing vital signs data'
    };
  }
};

// Function to get vital signs data for a specific user/device
export const getUserVitalSigns = async (deviceId: string): Promise<VitalSignsData | null> => {
  try {
    // In a real implementation, this would fetch data from your database
    // For now, we'll return mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data within normal ranges
    const mockData: VitalSignsData = {
      heartRate: Math.floor(Math.random() * 20) + 70, // 70-90 bpm
      spo2: Math.floor(Math.random() * 5) + 95, // 95-100%
      temperature: parseFloat((Math.random() * 1 + 36.5).toFixed(1)), // 36.5-37.5°C
      timestamp: new Date().toISOString(),
      deviceId
    };
    
    return mockData;
  } catch (error) {
    console.error('Error fetching vital signs data:', error);
    return null;
  }
};

// Helper function to generate an API key (for demonstration purposes)
export const generateApiKey = (): string => {
  // In a real application, you would implement a secure method for generating API keys
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Information about how to get an API key
export const getApiKeyInformation = (): string => {
  return `
    To obtain an API key for your GSM808 sensor:
    
    1. Create an account on our platform
    2. Register your device with its serial number
    3. Navigate to the "Developer" section in your account settings
    4. Generate a new API key
    5. Securely store this key and use it in your Arduino code
    
    For security, API keys are associated with specific devices and users.
    Never share your API key or include it in public code repositories.
  `;
};

// Use environment variables for API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.healthmonitor.com/v1';
// Remove this duplicate declaration
// const API_KEY = import.meta.env.VITE_API_KEY;

// Helper function to create authenticated requests
const createAuthenticatedRequest = (endpoint: string, method: string = 'GET', body?: any) => {
  if (!API_KEY) {
    console.error('API key is not configured. Please set VITE_API_KEY in your environment variables.');
    throw new Error('API key is not configured');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include', // For cookies if needed
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(`${API_BASE_URL}${endpoint}`, options);
};

export const getLatestVitalData = async (deviceId: string): Promise<VitalData> => {
  try {
    // In development or when API is not available, return mock data
    if (import.meta.env.DEV && !API_KEY) {
      console.warn('Using mock data in development mode. Set VITE_API_KEY for real API calls.');
      return getMockVitalData();
    }

    const response = await createAuthenticatedRequest(`/vitals/${deviceId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vital data:', error);
    throw error;
  }
};

// Define VitalData interface for getLatestVitalData
export interface VitalData extends VitalSignsData {
  status: 'normal' | 'warning' | 'danger';
}

// Mock function to get vital data when API is not available
const getMockVitalData = (): VitalData => {
  const heartRate = Math.floor(Math.random() * 20) + 70; // 70-90 bpm
  const spo2 = Math.floor(Math.random() * 5) + 95; // 95-100%
  const temperature = parseFloat((Math.random() * 1 + 36.5).toFixed(1)); // 36.5-37.5°C
  
  // Determine status based on values
  let status: 'normal' | 'warning' | 'danger' = 'normal';
  if (heartRate > 100 || heartRate < 60 || spo2 < 95 || temperature > 37.5) {
    status = 'warning';
  }
  if (heartRate > 120 || heartRate < 50 || spo2 < 90 || temperature > 38) {
    status = 'danger';
  }
  
  return {
    heartRate,
    spo2,
    temperature,
    timestamp: new Date().toISOString(),
    deviceId: 'mock-device',
    status
  };
};

// Remove this comment as it's no longer needed
// Remove the duplicate getApiKeyInformation function
