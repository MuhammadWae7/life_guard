import { type NextRequest, NextResponse } from "next/server"

// Get API key from environment variable
const ARDUINO_API_KEY = process.env.ARDUINO_API_KEY

export async function GET(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!ARDUINO_API_KEY || !apiKey || apiKey !== ARDUINO_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Return API status
    return NextResponse.json({
      status: "online",
      message: "LifeGuard API is ready to receive Arduino data",
      timestamp: new Date().toISOString(),
      endpoints: {
        "POST /api/arduino/vital-signs": "Send vital signs data",
      },
    })
  } catch (error) {
    console.error("Error checking status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// CORS headers for Arduino requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, authorization",
    },
  })
}
