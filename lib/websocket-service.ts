import type { VitalSigns } from "@/types/health"
import { getApiConfig } from "./config"
import { websocketAuth } from "./websocket-auth"
import { storageService } from "./storage-service"
import logger from "./logger"

type MessageHandler = (data: VitalSigns) => void
type ErrorHandler = (error: string) => void
type StatusHandler = (status: string) => void

export class WebSocketService {
  private socket: WebSocket | null = null
  private messageHandlers: MessageHandler[] = []
  private errorHandlers: ErrorHandler[] = []
  private statusHandlers: StatusHandler[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts: number
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isManuallyDisconnected = false
  private heartbeatInterval: NodeJS.Timeout | null = null
  private deviceId: string | null = null
  private apiKey: string | null = null

  constructor(
    private url: string = getApiConfig().websocketUrl,
    maxReconnectAttempts: number = 3
  ) {
    this.maxReconnectAttempts = maxReconnectAttempts
  }

  setCredentials(deviceId: string, apiKey: string) {
    this.deviceId = deviceId
    this.apiKey = apiKey
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return
    if (this.isManuallyDisconnected) return

    if (!this.deviceId || !this.apiKey) {
      this.notifyError("Missing device credentials")
      return
    }

    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        logger.info("WebSocket connected", { url: this.url })
        this.reconnectAttempts = 0
        this.isManuallyDisconnected = false
        this.notifyStatus("connected")
        this.startHeartbeat()
        this.authenticate()
      }

      this.socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)

          // Handle different message types
          if (data.type === "vital_signs") {
            if (!this.deviceId || !websocketAuth.isAuthenticated(this.deviceId)) {
              this.notifyError("Device not authenticated")
              return
            }

            const vitalSigns = this.validateVitalSigns(data.payload)
            if (vitalSigns) {
              // Store the data
              await storageService.storeVitalSigns({
                ...vitalSigns,
                deviceId: this.deviceId,
              })

              // Notify handlers
              this.messageHandlers.forEach((handler) => handler(vitalSigns))
            }
          } else if (data.type === "auth_response") {
            if (data.success) {
              logger.info("WebSocket authentication successful", {
                deviceId: this.deviceId,
              })
            } else {
              this.notifyError(data.error || "Authentication failed")
              this.socket?.close()
            }
          } else if (data.type === "heartbeat") {
            logger.debug("Heartbeat received")
          } else if (data.type === "error") {
            this.notifyError(data.message || "Unknown server error")
          }
        } catch (error) {
          logger.error("Error parsing WebSocket message", { error })
          this.notifyError("Failed to parse incoming data")
        }
      }

      this.socket.onclose = (event) => {
        logger.info("WebSocket disconnected", {
          code: event.code,
          reason: event.reason,
        })
        this.notifyStatus("disconnected")
        this.stopHeartbeat()

        if (this.deviceId) {
          websocketAuth.removeDevice(this.deviceId)
        }

        if (!this.isManuallyDisconnected && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect()
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.notifyError("Unable to connect to health monitoring device")
        }
      }

      this.socket.onerror = (error) => {
        logger.error("WebSocket connection error", { error })
        this.notifyStatus("error")

        if (this.socket?.readyState === WebSocket.CONNECTING) {
          this.notifyError("Failed to connect to health monitoring service")
        } else {
          this.notifyError("Connection to health monitoring service lost")
        }

        this.socket?.close()
      }
    } catch (error) {
      logger.error("Failed to create WebSocket connection", { error })
      this.notifyError("Failed to establish connection")
      this.attemptReconnect()
    }
  }

  private authenticate() {
    if (!this.deviceId || !this.apiKey || !this.socket) return

    const authMessage = {
      type: "auth",
      deviceId: this.deviceId,
      apiKey: this.apiKey,
      timestamp: new Date().toISOString(),
    }

    this.socket.send(JSON.stringify(authMessage))
  }

  disconnect() {
    this.isManuallyDisconnected = true

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    this.stopHeartbeat()

    if (this.socket) {
      this.socket.close(1000, "Manual disconnect")
      this.socket = null
    }

    if (this.deviceId) {
      websocketAuth.removeDevice(this.deviceId)
    }

    this.reconnectAttempts = 0
    this.notifyStatus("disconnected")
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.send({ type: "heartbeat", timestamp: new Date().toISOString() })
      }
    }, 30000) // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private validateVitalSigns(data: any): VitalSigns | null {
    if (!data || typeof data !== "object") return null

    const heartRate = Number(data.heartRate)
    const temperature = Number(data.temperature)
    const spO2 = Number(data.spO2)

    // Basic validation
    if (isNaN(heartRate) || isNaN(temperature) || isNaN(spO2)) return null
    if (heartRate < 0 || heartRate > 300) return null
    if (temperature < 20 || temperature > 50) return null
    if (spO2 < 0 || spO2 > 100) return null

    return {
      timestamp: data.timestamp || new Date().toISOString(),
      heartRate,
      temperature,
      spO2,
    }
  }

  send(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  addMessageHandler(handler: MessageHandler) {
    this.messageHandlers.push(handler)
  }

  removeMessageHandler(handler: MessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
  }

  addErrorHandler(handler: ErrorHandler) {
    this.errorHandlers.push(handler)
  }

  removeErrorHandler(handler: ErrorHandler) {
    this.errorHandlers = this.errorHandlers.filter((h) => h !== handler)
  }

  addStatusHandler(handler: StatusHandler) {
    this.statusHandlers.push(handler)
  }

  removeStatusHandler(handler: StatusHandler) {
    this.statusHandlers = this.statusHandlers.filter((h) => h !== handler)
  }

  private notifyError(message: string) {
    this.errorHandlers.forEach((handler) => handler(message))
  }

  private notifyStatus(status: string) {
    this.statusHandlers.forEach((handler) => handler(status))
  }

  private attemptReconnect() {
    if (this.isManuallyDisconnected || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000)

    logger.info("Attempting to reconnect", {
      attempt: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      delay,
    })

    this.notifyStatus("reconnecting")

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isManuallyDisconnected) {
        this.connect()
      }
    }, delay)
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN
  }

  getConnectionState() {
    if (!this.socket) return "disconnected"

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return "connecting"
      case WebSocket.OPEN:
        return "connected"
      case WebSocket.CLOSING:
        return "closing"
      case WebSocket.CLOSED:
        return "disconnected"
      default:
        return "unknown"
    }
  }
}

// Create a singleton instance
let wsService: WebSocketService | null = null

export function getWebSocketService(url?: string) {
  if (!wsService) {
    wsService = new WebSocketService(url)
  }
  return wsService
}
