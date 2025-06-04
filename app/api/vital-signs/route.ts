import { NextResponse } from "next/server"
import { getVitalSignsFromCache } from "@/lib/offline-storage"
import type { VitalSigns } from "@/types/health"

export async function GET() {
  try {
    // Get cached vital signs data (from Arduino API)
    const cachedData = getVitalSignsFromCache()

    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Return empty data if no cached data available
    const emptyData: VitalSigns = {
      timestamp: new Date().toISOString(),
      heartRate: 0,
      temperature: 0,
      spO2: 0,
    }

    return NextResponse.json(emptyData)
  } catch (error) {
    console.error("Error fetching vital signs:", error)
    return NextResponse.json({ error: "Failed to fetch vital signs data" }, { status: 500 })
  }
}
