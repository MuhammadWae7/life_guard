// API Configuration for LifeGuard Platform
export const apiConfig = {
  // Base API URL - your hardware team will provide this
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lifeguard.com",

  // Remove API key from client-side config - this will be handled server-side
  // apiKey: process.env.NEXT_PUBLIC_API_KEY || "",

  // WebSocket URL for real-time data - your hardware team will provide this
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://ws.lifeguard.com",

  // API Endpoints
  endpoints: {
    // Authentication
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      refresh: "/auth/refresh",
      logout: "/auth/logout",
    },

    // Vital Signs Data
    vitalSigns: {
      current: "/api/vital-signs/current",
      history: "/api/vital-signs/history",
      stream: "/api/vital-signs/stream", // WebSocket endpoint
    },

    // User Management
    user: {
      profile: "/api/user/profile",
      settings: "/api/user/settings",
      devices: "/api/user/devices",
    },

    // Device Management
    devices: {
      list: "/api/devices",
      register: "/api/devices/register",
      status: "/api/devices/status",
      calibrate: "/api/devices/calibrate",
    },

    // Alerts and Notifications
    alerts: {
      list: "/api/alerts",
      settings: "/api/alerts/settings",
      acknowledge: "/api/alerts/acknowledge",
    },

    // Health Records
    records: {
      list: "/api/records",
      export: "/api/records/export",
      summary: "/api/records/summary",
    },
  },

  // Request configuration
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
}

// Headers for API requests (without sensitive API key)
export const getApiHeaders = () => ({
  "Content-Type": "application/json",
  "X-Client-Version": "1.0.0",
  "X-Platform": "web",
})

// Validate API configuration (remove API key validation)
export const validateApiConfig = () => {
  const errors: string[] = []

  if (!apiConfig.baseUrl) {
    errors.push("API_BASE_URL is required")
  }

  if (!apiConfig.websocketUrl) {
    errors.push("WEBSOCKET_URL is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export default apiConfig
