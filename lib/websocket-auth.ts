import { z } from "zod"
import { getArduinoConfig } from "./config"
import logger from "./logger"

// Authentication message schema
const AuthMessageSchema = z.object({
  type: z.literal("auth"),
  deviceId: z.string(),
  apiKey: z.string(),
  timestamp: z.string().datetime(),
})

type AuthMessage = z.infer<typeof AuthMessageSchema>

class WebSocketAuth {
  private static instance: WebSocketAuth
  private authenticatedDevices: Map<string, { lastSeen: number }> = new Map()
  private readonly config = getArduinoConfig()
  private readonly authTimeout: number = 30000 // 30 seconds

  private constructor() {
    // Start cleanup interval
    setInterval(() => this.cleanupStaleDevices(), 60000) // Clean up every minute
  }

  static getInstance(): WebSocketAuth {
    if (!WebSocketAuth.instance) {
      WebSocketAuth.instance = new WebSocketAuth()
    }
    return WebSocketAuth.instance
  }

  async authenticate(message: string): Promise<{ success: boolean; deviceId?: string; error?: string }> {
    try {
      // Parse and validate auth message
      const authMessage = AuthMessageSchema.parse(JSON.parse(message))

      // Validate API key
      if (authMessage.apiKey !== this.config.apiKey) {
        logger.warn("Invalid WebSocket API key", { deviceId: authMessage.deviceId })
        return { success: false, error: "Invalid API key" }
      }

      // Validate timestamp (prevent replay attacks)
      const messageTime = new Date(authMessage.timestamp).getTime()
      const now = Date.now()
      if (Math.abs(now - messageTime) > this.authTimeout) {
        logger.warn("Stale authentication message", {
          deviceId: authMessage.deviceId,
          messageTime,
          now,
        })
        return { success: false, error: "Stale authentication message" }
      }

      // Register authenticated device
      this.authenticatedDevices.set(authMessage.deviceId, { lastSeen: now })

      logger.info("Device authenticated successfully", {
        deviceId: authMessage.deviceId,
      })

      return { success: true, deviceId: authMessage.deviceId }
    } catch (error) {
      logger.error("WebSocket authentication failed", { error })
      return { success: false, error: "Authentication failed" }
    }
  }

  isAuthenticated(deviceId: string): boolean {
    const device = this.authenticatedDevices.get(deviceId)
    if (!device) return false

    // Update last seen timestamp
    device.lastSeen = Date.now()
    return true
  }

  private cleanupStaleDevices(): void {
    const now = Date.now()
    for (const [deviceId, data] of this.authenticatedDevices.entries()) {
      if (now - data.lastSeen > this.authTimeout) {
        this.authenticatedDevices.delete(deviceId)
        logger.info("Removed stale device", { deviceId })
      }
    }
  }

  getAuthenticatedDevices(): string[] {
    return Array.from(this.authenticatedDevices.keys())
  }

  removeDevice(deviceId: string): void {
    this.authenticatedDevices.delete(deviceId)
    logger.info("Device removed from authenticated list", { deviceId })
  }
}

export const websocketAuth = WebSocketAuth.getInstance() 