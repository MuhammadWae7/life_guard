import { NextResponse } from "next/server"
import { z } from "zod"
import { getArduinoConfig } from "@/lib/config"
import { storageService } from "@/lib/storage-service"
import logger from "@/lib/logger"

// Validation schema for Arduino data
const ArduinoDataSchema = z.object({
  timestamp: z.string().datetime(),
  heartRate: z.number().min(0).max(300),
  temperature: z.number().min(20).max(50),
  spO2: z.number().min(0).max(100),
  deviceId: z.string(),
  batteryLevel: z.number().min(0).max(100).optional(),
  signalStrength: z.number().min(0).max(100).optional(),
})

export async function POST(request: Request) {
  try {
    const config = getArduinoConfig()
    
    // Validate request headers
    const deviceId = request.headers.get("x-device-id")
    const apiKey = request.headers.get("x-api-key")
    
    if (!deviceId || !apiKey) {
      logger.warn("Missing required headers", { deviceId, hasApiKey: !!apiKey })
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 401 }
      )
    }

    // Validate API key
    if (apiKey !== config.apiKey) {
      logger.warn("Invalid API key", { deviceId })
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = ArduinoDataSchema.parse({
      ...body,
      deviceId, // Ensure deviceId from header is used
    })

    // Store the data
    await storageService.storeVitalSigns(validatedData)

    // Get device stats for response
    const stats = await storageService.getDeviceStats(deviceId)

    logger.info("Arduino data received and stored", {
      deviceId,
      timestamp: validatedData.timestamp,
      stats,
    })

    return NextResponse.json({ 
      success: true,
      message: "Data received successfully",
      timestamp: new Date().toISOString(),
      stats,
    })

  } catch (error) {
    logger.error("Error processing Arduino data", { error })
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data format", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const config = getArduinoConfig()
    
    // Validate request headers
    const deviceId = request.headers.get("x-device-id")
    const apiKey = request.headers.get("x-api-key")
    
    if (!deviceId || !apiKey) {
      logger.warn("Missing required headers", { deviceId, hasApiKey: !!apiKey })
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 401 }
      )
    }

    // Validate API key
    if (apiKey !== config.apiKey) {
      logger.warn("Invalid API key", { deviceId })
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Get latest vital signs
    const latestData = await storageService.getLatestVitalSigns(deviceId)
    const stats = await storageService.getDeviceStats(deviceId)

    logger.info("Arduino configuration requested", {
      deviceId,
      hasLatestData: !!latestData,
    })

    // Return device configuration and latest data
    return NextResponse.json({
      deviceId,
      config: {
        samplingRate: config.samplingRate,
        maxRetries: config.maxRetries,
        timeout: config.timeout,
      },
      latestData,
      stats,
    })

  } catch (error) {
    logger.error("Error fetching Arduino configuration", { error })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 