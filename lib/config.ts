import { z } from "zod"

// Environment variables schema
const envSchema = z.object({
  ARDUINO_API_KEY: z.string().min(1),
  ARDUINO_SAMPLING_RATE: z.string().transform(Number).pipe(z.number().min(1).max(60)),
  ARDUINO_MAX_RETRIES: z.string().transform(Number).pipe(z.number().min(1).max(10)),
  ARDUINO_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000).max(30000)),
  WEBSOCKET_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
})

// Validate environment variables
const env = envSchema.parse({
  ARDUINO_API_KEY: process.env.ARDUINO_API_KEY,
  ARDUINO_SAMPLING_RATE: process.env.ARDUINO_SAMPLING_RATE || "5",
  ARDUINO_MAX_RETRIES: process.env.ARDUINO_MAX_RETRIES || "3",
  ARDUINO_TIMEOUT: process.env.ARDUINO_TIMEOUT || "5000",
  WEBSOCKET_URL: process.env.WEBSOCKET_URL || "wss://ws.lifeguard.com",
  NODE_ENV: process.env.NODE_ENV || "development",
})

// Arduino configuration
export const getArduinoConfig = () => ({
  apiKey: env.ARDUINO_API_KEY,
  samplingRate: env.ARDUINO_SAMPLING_RATE,
  maxRetries: env.ARDUINO_MAX_RETRIES,
  timeout: env.ARDUINO_TIMEOUT,
})

// API configuration
export const getApiConfig = () => ({
  websocketUrl: env.WEBSOCKET_URL,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
})

// Rate limiting configuration
export const getRateLimitConfig = () => ({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})

// Logging configuration
export const getLoggingConfig = () => ({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: env.NODE_ENV === "production" ? "json" : "pretty",
  enableConsole: true,
  enableFile: env.NODE_ENV === "production",
})

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
