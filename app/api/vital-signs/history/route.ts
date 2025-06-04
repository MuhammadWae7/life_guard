import { NextResponse } from "next/server"
import type { VitalSigns } from "@/types/health"

export async function GET() {
  try {
    // In a real implementation, you would:
    // 1. Connect to your database or Arduino data storage
    // 2. Fetch the last few readings
    // 3. Return them in chronological order

    // This is a placeholder that should be replaced with actual Arduino historical data
    const historicalReadings: VitalSigns[] = []

    return NextResponse.json(historicalReadings)
  } catch (error) {
    console.error("Error fetching historical readings:", error)
    return NextResponse.json({ error: "Failed to fetch historical readings" }, { status: 500 })
  }
}
