import { type NextRequest, NextResponse } from "next/server"

// This should match the same API key from vital-signs route
const ARDUINO_API_KEY = process.env.ARDUINO_API_KEY || "lifeguard_arduino_key_2024"

// This would normally come from a database
// For now, we'll import from the vital-signs route (in production, use a shared database)
export async function GET(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!apiKey || apiKey !== ARDUINO_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // In production, fetch from database
    // For now, return empty array (the vital-signs route stores data in memory)
    const history = [] // This should come from your database

    return NextResponse.json({
      data: history.slice(0, limit),
      pagination: {
        page: 1,
        limit,
        total: history.length,
      },
    })
  } catch (error) {
    console.error("Error fetching history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
