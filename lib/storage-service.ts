import { z } from "zod"
import logger from "./logger"
import { config } from "./config"

// Validation schema for vital signs data
const VitalSignsSchema = z.object({
  timestamp: z.string().datetime(),
  heartRate: z.number().min(0).max(300),
  temperature: z.number().min(20).max(50),
  spO2: z.number().min(0).max(100),
  deviceId: z.string(),
  batteryLevel: z.number().min(0).max(100).optional(),
  signalStrength: z.number().min(0).max(100).optional(),
})

type VitalSigns = z.infer<typeof VitalSignsSchema>

class StorageService {
  private static instance: StorageService
  private data: Map<string, VitalSigns[]> = new Map()
  private readonly maxHistorySize: number

  private constructor() {
    this.maxHistorySize = config.data.historyLimit
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  async storeVitalSigns(data: VitalSigns): Promise<void> {
    try {
      // Validate data
      const validatedData = VitalSignsSchema.parse(data)

      // Get existing data for device
      const deviceData = this.data.get(validatedData.deviceId) || []

      // Add new reading
      deviceData.unshift(validatedData)

      // Trim history if needed
      if (deviceData.length > this.maxHistorySize) {
        deviceData.length = this.maxHistorySize
      }

      // Update storage
      this.data.set(validatedData.deviceId, deviceData)

      // Log successful storage
      logger.info("Vital signs stored successfully", {
        deviceId: validatedData.deviceId,
        timestamp: validatedData.timestamp,
      })

      // Check for critical values
      this.checkCriticalValues(validatedData)
    } catch (error) {
      logger.error("Failed to store vital signs", { error, data })
      throw new Error("Failed to store vital signs data")
    }
  }

  async getVitalSigns(deviceId: string, limit: number = 10): Promise<VitalSigns[]> {
    try {
      const deviceData = this.data.get(deviceId) || []
      return deviceData.slice(0, limit)
    } catch (error) {
      logger.error("Failed to retrieve vital signs", { error, deviceId })
      throw new Error("Failed to retrieve vital signs data")
    }
  }

  async getLatestVitalSigns(deviceId: string): Promise<VitalSigns | null> {
    try {
      const deviceData = this.data.get(deviceId) || []
      return deviceData[0] || null
    } catch (error) {
      logger.error("Failed to retrieve latest vital signs", { error, deviceId })
      throw new Error("Failed to retrieve latest vital signs")
    }
  }

  private checkCriticalValues(data: VitalSigns): void {
    const { heartRate, temperature, spO2 } = data
    const { thresholds } = config

    const alerts: string[] = []

    // Check heart rate
    if (heartRate < thresholds.heartRate.critical.min || heartRate > thresholds.heartRate.critical.max) {
      alerts.push(`Critical heart rate: ${heartRate} bpm`)
    }

    // Check temperature
    if (temperature < thresholds.temperature.critical.min || temperature > thresholds.temperature.critical.max) {
      alerts.push(`Critical temperature: ${temperature}°C`)
    }

    // Check SpO2
    if (spO2 < thresholds.spO2.critical) {
      alerts.push(`Critical SpO2: ${spO2}%`)
    }

    if (alerts.length > 0) {
      logger.warn("Critical vital signs detected", {
        deviceId: data.deviceId,
        alerts,
        vitalSigns: data,
      })
    }
  }

  async clearDeviceHistory(deviceId: string): Promise<void> {
    try {
      this.data.delete(deviceId)
      logger.info("Device history cleared", { deviceId })
    } catch (error) {
      logger.error("Failed to clear device history", { error, deviceId })
      throw new Error("Failed to clear device history")
    }
  }

  async getDeviceStats(deviceId: string): Promise<{
    totalReadings: number
    lastReading: string | null
    averageHeartRate: number | null
    averageTemperature: number | null
    averageSpO2: number | null
  }> {
    try {
      const deviceData = this.data.get(deviceId) || []
      
      if (deviceData.length === 0) {
        return {
          totalReadings: 0,
          lastReading: null,
          averageHeartRate: null,
          averageTemperature: null,
          averageSpO2: null,
        }
      }

      const totalReadings = deviceData.length
      const lastReading = deviceData[0].timestamp

      const sumHeartRate = deviceData.reduce((sum, reading) => sum + reading.heartRate, 0)
      const sumTemperature = deviceData.reduce((sum, reading) => sum + reading.temperature, 0)
      const sumSpO2 = deviceData.reduce((sum, reading) => sum + reading.spO2, 0)

      return {
        totalReadings,
        lastReading,
        averageHeartRate: sumHeartRate / totalReadings,
        averageTemperature: sumTemperature / totalReadings,
        averageSpO2: sumSpO2 / totalReadings,
      }
    } catch (error) {
      logger.error("Failed to calculate device stats", { error, deviceId })
      throw new Error("Failed to calculate device statistics")
    }
  }
}

export const storageService = StorageService.getInstance() 