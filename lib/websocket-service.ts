import type { VitalSigns } from "@/types/health"
import { apiConfig } from "./api-config"

type MessageHandler = (data: VitalSigns) => void
type ErrorHandler = (error: string) => void
type StatusHandler = (status: string) => void

export class WebSocketService {
  private socket: WebSocket | null = null
  private messageHandlers: MessageHandler[] = []
  private errorHandlers: ErrorHandler[] = []
  private statusHandlers: StatusHandler[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = apiConfig.retryAttempts
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isManuallyDisconnected = false
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor(private url: string = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "wss://ws.lifeguard.com") {}

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return

    // Don't try to connect if manually disconnected
    if (this.isManuallyDisconnected) return

    try {
      // Use WebSocket URL without API key (authentication handled server-side)
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        console.log("WebSocket connected to:", this.url)
        this.reconnectAttempts = 0
        this.isManuallyDisconnected = false
        this.notifyStatus("connected")
        this.startHeartbeat()
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Handle different message types
          if (data.type === "vital_signs") {
            const vitalSigns = this.validateVitalSigns(data.payload)
            if (vitalSigns) {
              this.messageHandlers.forEach((handler) => handler(vitalSigns))
            }
          } else if (data.type === "heartbeat") {
            // Handle heartbeat response
            console.log("Heartbeat received")
          } else if (data.type === "error") {
            this.notifyError(data.message || "Unknown server error")
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
          this.notifyError("Failed to parse incoming data")
        }
      }

      this.socket.onclose = (event) => {
        console.log("WebSocket disconnected. Code:", event.code, "Reason:", event.reason)
        this.notifyStatus("disconnected")
        this.stopHeartbeat()

        // Only attempt reconnect if not manually disconnected and within retry limits
        if (!this.isManuallyDisconnected && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect()
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.notifyError("Unable to connect to health monitoring device. Please check your connection.")
        }
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket connection error:", error)
        this.notifyStatus("error")

        // Provide more specific error messages
        if (this.socket?.readyState === WebSocket.CONNECTING) {
          this.notifyError("Failed to connect to health monitoring service. Please check your internet connection.")
        } else {
          this.notifyError("Connection to health monitoring service lost.")
        }

        // Close the socket to trigger reconnection logic
        this.socket?.close()
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.notifyError("Failed to establish connection to health monitoring service.")
      this.attemptReconnect()
    }
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

    this.reconnectAttempts = 0
    this.notifyStatus("disconnected")
  }

  // Send message to server
  send(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  // Heartbeat to keep connection alive
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

  // Validate incoming vital signs data
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
    const delay = Math.min(apiConfig.retryDelay * Math.pow(2, this.reconnectAttempts), 10000) // Max 10 seconds

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    )

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
