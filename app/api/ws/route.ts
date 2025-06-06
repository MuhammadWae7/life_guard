import { NextResponse } from "next/server"
import { WebSocketServer, WebSocket } from "ws"
import { IncomingMessage } from "http"
import { Socket } from "net"
import { getArduinoConfig } from "@/lib/config"
import { websocketAuth } from "@/lib/websocket-auth"
import { storageService } from "@/lib/storage-service"
import logger from "@/lib/logger"

// Extend IncomingMessage to include our custom properties
interface WebSocketRequest extends IncomingMessage {
  socket: Socket
}

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true })

// Handle WebSocket connections
wss.on("connection", (ws: WebSocket, request: WebSocketRequest) => {
  const ip = request.socket.remoteAddress
  logger.info("New WebSocket connection", { ip })

  // Set up message handler
  ws.on("message", async (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString())

      // Handle authentication
      if (data.type === "auth") {
        const authResult = await websocketAuth.authenticate(message.toString())
        
        if (authResult.success && authResult.deviceId) {
          ws.send(JSON.stringify({
            type: "auth_response",
            success: true,
            deviceId: authResult.deviceId,
          }))
        } else {
          ws.send(JSON.stringify({
            type: "auth_response",
            success: false,
            error: authResult.error,
          }))
          ws.close(1000, "Authentication failed")
        }
        return
      }

      // Handle vital signs data
      if (data.type === "vital_signs") {
        const deviceIdHeader = request.headers["x-device-id"]
        const deviceId = Array.isArray(deviceIdHeader) ? deviceIdHeader[0] : deviceIdHeader
        
        if (!deviceId || !websocketAuth.isAuthenticated(deviceId)) {
          ws.send(JSON.stringify({
            type: "error",
            message: "Device not authenticated",
          }))
          return
        }

        // Store the data
        await storageService.storeVitalSigns({
          ...data.payload,
          deviceId,
        })

        // Acknowledge receipt
        ws.send(JSON.stringify({
          type: "vital_signs_ack",
          timestamp: new Date().toISOString(),
        }))
      }

      // Handle heartbeat
      if (data.type === "heartbeat") {
        ws.send(JSON.stringify({
          type: "heartbeat",
          timestamp: new Date().toISOString(),
        }))
      }
    } catch (error) {
      logger.error("Error processing WebSocket message", { error })
      ws.send(JSON.stringify({
        type: "error",
        message: "Failed to process message",
      }))
    }
  })

  // Handle disconnection
  ws.on("close", () => {
    const deviceIdHeader = request.headers["x-device-id"]
    const deviceId = Array.isArray(deviceIdHeader) ? deviceIdHeader[0] : deviceIdHeader
    if (deviceId) {
      websocketAuth.removeDevice(deviceId)
    }
    logger.info("WebSocket connection closed", { ip, deviceId })
  })

  // Handle errors
  ws.on("error", (error: Error) => {
    logger.error("WebSocket error", { error, ip })
  })
})

// Export WebSocket upgrade handler
export async function GET(request: Request) {
  try {
    const upgrade = request.headers.get("upgrade")
    if (upgrade?.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket connection", { status: 400 })
    }

    // Create a new Response with WebSocket upgrade headers
    const response = new Response(null, {
      status: 101,
      headers: {
        "Upgrade": "websocket",
        "Connection": "Upgrade",
      },
    })

    // Get the underlying socket from the response
    const { socket } = response as unknown as { socket: Socket }
    if (!socket) {
      return new Response("WebSocket upgrade failed", { status: 500 })
    }

    // Convert Request to IncomingMessage-like object
    const incomingMessage = {
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      url: request.url,
      socket: socket,
    } as unknown as IncomingMessage

    // Handle the WebSocket upgrade
    wss.handleUpgrade(incomingMessage, socket, Buffer.alloc(0), (ws) => {
      wss.emit("connection", ws, incomingMessage)
    })

    return response
  } catch (error) {
    logger.error("WebSocket upgrade failed", { error })
    return new Response("WebSocket upgrade failed", { status: 500 })
  }
} 