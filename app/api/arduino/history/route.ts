import { NextResponse } from "next/server"
import { getArduinoConfig } from "@/lib/config"
import type { VitalSigns } from "@/types/health"

// This should match the same API key from vital-signs route
const ARDUINO_API_KEY = process.env.ARDUINO_API_KEY || "lifeguard_arduino_key_2024"

// This would normally come from a database
// For now, we'll import from the vital-signs route (in production, use a shared database)
export async function GET(request: Request) {
  try {
    // Check API key
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey || apiKey !== getArduinoConfig().apiKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")

    // In production, fetch from database
    // For now, return empty array (the vital-signs route stores data in memory)
    const history: VitalSigns[] = [] // This should come from your database

    return NextResponse.json({
      data: history.slice(0, limit),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching Arduino history:", error)
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    )
  }
}
