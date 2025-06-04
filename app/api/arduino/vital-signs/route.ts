import { type NextRequest, NextResponse } from "next/server"
import type { VitalSigns } from "@/types/health"
import { addReadingToHistory, saveVitalSignsToCache } from "@/lib/offline-storage"

// Get API key from environment variable
const ARDUINO_API_KEY = process.env.ARDUINO_API_KEY

export async function POST(request: NextRequest) {
  try {
    // Check API key authentication
    const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!ARDUINO_API_KEY || !apiKey || apiKey !== ARDUINO_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Parse the incoming data from Arduino
    const body = await request.json()

    // Validate the data
    const vitalSigns = validateArduinoData(body)
    if (!vitalSigns) {
      return NextResponse.json({ error: "Invalid vital signs data" }, { status: 400 })
    }

    // Store the data in cache for offline access
    saveVitalSignsToCache(vitalSigns)
    addReadingToHistory(vitalSigns)

    console.log("Received vital signs from Arduino:", vitalSigns)

    return NextResponse.json({
      success: true,
      message: "Vital signs received successfully",
      timestamp: vitalSigns.timestamp,
    })
  } catch (error) {
    console.error("Error processing Arduino data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function validateArduinoData(data: any): VitalSigns | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const heartRate = Number(data.heartRate || data.heart_rate || data.bpm)
  const temperature = Number(data.temperature || data.temp)
  const spO2 = Number(data.spO2 || data.spo2 || data.oxygen)

  // Validate ranges
  if (isNaN(heartRate) || heartRate < 30 || heartRate > 200) {
    console.error("Invalid heart rate:", heartRate)
    return null
  }

  if (isNaN(temperature) || temperature < 30 || temperature > 45) {
    console.error("Invalid temperature:", temperature)
    return null
  }

  if (isNaN(spO2) || spO2 < 70 || spO2 > 100) {
    console.error("Invalid SpO2:", spO2)
    return null
  }

  return {
    timestamp: data.timestamp || new Date().toISOString(),
    heartRate,
    temperature,
    spO2,
  }
}

// CORS headers for Arduino requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, authorization",
    },
  })
}
