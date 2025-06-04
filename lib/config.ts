// LifeGuard Configuration
export const config = {
  // Arduino WebSocket Configuration
  arduino: {
    // Update this with your Arduino's IP address
    websocketUrl: process.env.NEXT_PUBLIC_ARDUINO_WEBSOCKET_URL || "ws://192.168.1.100:8080",

    // Fallback REST API URL (if you implement one)
    apiUrl: process.env.NEXT_PUBLIC_ARDUINO_API_URL || "http://192.168.1.100:3001",

    // Connection settings
    reconnectAttempts: 3,
    reconnectDelay: 1000, // ms
    connectionTimeout: 5000, // ms
  },

  // Health monitoring thresholds
  thresholds: {
    heartRate: {
      min: 60,
      max: 100,
      critical: { min: 40, max: 150 },
    },
    temperature: {
      min: 36.1,
      max: 37.2,
      critical: { min: 35.0, max: 39.0 },
    },
    spO2: {
      min: 95,
      critical: 90,
    },
  },

  // Data settings
  data: {
    updateInterval: 1000, // ms
    historyLimit: 100, // number of readings to keep
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in ms
  },

  // App settings
  app: {
    name: "LifeGuard",
    version: "1.0.0",
    defaultTheme: "dark",
    defaultLanguage: "en",
  },
}

export default config
