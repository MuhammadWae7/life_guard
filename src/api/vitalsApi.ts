
// API endpoints for vital signs data
// This file defines the expected API structure for your Arduino data

export interface VitalSignsApiResponse {
  temperature: number;
  heartRate: number;
  spo2: number;
  timestamp: string;
  deviceId: string;
}

export interface ApiEndpoints {
  // GET /api/vitals/latest/{deviceId} - Get latest readings
  getLatestVitals: (deviceId: string) => Promise<VitalSignsApiResponse[]>;
  
  // POST /api/vitals - Submit new reading from Arduino
  submitVitals: (data: Omit<VitalSignsApiResponse, 'timestamp'>) => Promise<void>;
  
  // GET /api/vitals/history/{deviceId}?limit=20 - Get historical data
  getVitalsHistory: (deviceId: string, limit?: number) => Promise<VitalSignsApiResponse[]>;
}

// Expected POST endpoint structure for Arduino to send data:
// POST /api/vitals
// Content-Type: application/json
// 
// Body:
// {
//   "deviceId": "your-device-id",
//   "temperature": 36.5,
//   "heartRate": 72,
//   "spo2": 98.5
// }

// Expected WebSocket message format from server:
// {
//   "temperature": 36.5,
//   "heartRate": 72,
//   "spo2": 98.5,
//   "timestamp": "2024-01-15T10:30:00Z",
//   "deviceId": "your-device-id"
// }

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:3001';

export const WEBSOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-api-domain.com'
  : 'ws://localhost:3001';

// Arduino code expectations:
// 1. Send HTTP POST requests to /api/vitals endpoint
// 2. Include deviceId in the request body
// 3. Send temperature (float), heartRate (int), spo2 (float)
// 4. Server will add timestamp automatically
// 5. WebSocket will broadcast to connected clients
