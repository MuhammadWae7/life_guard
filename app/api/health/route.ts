import { NextResponse } from "next/server"
import { getApiConfig } from "@/lib/config"
import logger from "@/lib/logger"

export async function GET() {
  try {
    const config = getApiConfig()
    const startTime = Date.now()

    // Basic system checks
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: config.isProduction ? "production" : "development",
      uptime: process.uptime(),
      memory: {
        total: process.memoryUsage().heapTotal,
        used: process.memoryUsage().heapUsed,
        external: process.memoryUsage().external,
      },
      responseTime: Date.now() - startTime,
    }

    logger.info("Health check completed", { health })

    return NextResponse.json(health)
  } catch (error) {
    logger.error("Health check failed", { error })
    
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      },
      { status: 500 }
    )
  }
} 