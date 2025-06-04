"use client"

import { useEffect, useRef } from "react"
import { type VitalSigns, DEFAULT_THRESHOLDS } from "@/types/health"
import { AlertTriangle, CloudOff } from "lucide-react"

interface VitalSignsMonitorProps {
  vitalSigns: VitalSigns | null
  loading: boolean
  error: string | null
  isOfflineMode?: boolean
}

export function VitalSignsMonitor({ vitalSigns, loading, error, isOfflineMode = false }: VitalSignsMonitorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the ECG-like display
  useEffect(() => {
    if (loading || error || !vitalSigns || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set line style
    ctx.lineWidth = 2
    ctx.strokeStyle = isOfflineMode ? "#94a3b8" : "#10b981" // Gray for offline, green for online

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height)

    // Draw ECG-like line
    drawECGLine(ctx, canvas.width, canvas.height, vitalSigns.heartRate, isOfflineMode)
  }, [vitalSigns, loading, error, isOfflineMode])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !vitalSigns) return

      const canvas = canvasRef.current
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Redraw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid(ctx, canvas.width, canvas.height)
      drawECGLine(ctx, canvas.width, canvas.height, vitalSigns.heartRate, isOfflineMode)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [vitalSigns, isOfflineMode])

  // Draw grid lines
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath()
    ctx.strokeStyle = "#334155" // Slate-600
    ctx.lineWidth = 0.5

    // Draw vertical grid lines
    const verticalSpacing = width / 20
    for (let x = 0; x <= width; x += verticalSpacing) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    // Draw horizontal grid lines
    const horizontalSpacing = height / 10
    for (let y = 0; y <= height; y += horizontalSpacing) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    ctx.stroke()
  }

  // Draw ECG-like line
  const drawECGLine = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    heartRate: number,
    isOffline: boolean,
  ) => {
    if (!heartRate) return

    ctx.beginPath()
    ctx.strokeStyle = isOffline ? "#94a3b8" : "#10b981" // Gray for offline, green for online
    ctx.lineWidth = 2

    const baseY = height / 2
    const amplitude = height / 4

    // Start at the left edge
    ctx.moveTo(0, baseY)

    // Calculate wave frequency based on heart rate
    const frequency = heartRate / 60 // beats per second
    const period = width / (frequency * 5) // pixels per beat

    for (let x = 0; x < width; x++) {
      const phase = (x % period) / period

      // Create an ECG-like pattern
      let y
      if (phase < 0.1) {
        y = baseY
      } else if (phase < 0.15) {
        y = baseY - amplitude * 0.5
      } else if (phase < 0.2) {
        y = baseY + amplitude * 0.5
      } else if (phase < 0.25) {
        y = baseY - amplitude
      } else if (phase < 0.3) {
        y = baseY + amplitude * 0.8
      } else if (phase < 0.4) {
        y = baseY
      } else {
        y = baseY
      }

      ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Add offline indicator if in offline mode
    if (isOffline) {
      ctx.font = "16px sans-serif"
      ctx.fillStyle = "#94a3b8"
      ctx.textAlign = "center"
      ctx.fillText("OFFLINE MODE", width / 2, 30)
    }
  }

  // Check if any vital sign is outside normal range
  const checkAlerts = (vitalSigns: VitalSigns) => {
    const alerts = []

    if (
      vitalSigns.heartRate < DEFAULT_THRESHOLDS.heartRateMin ||
      vitalSigns.heartRate > DEFAULT_THRESHOLDS.heartRateMax
    ) {
      alerts.push("Abnormal heart rate")
    }

    if (
      vitalSigns.temperature < DEFAULT_THRESHOLDS.temperatureMin ||
      vitalSigns.temperature > DEFAULT_THRESHOLDS.temperatureMax
    ) {
      alerts.push("Abnormal temperature")
    }

    if (vitalSigns.spO2 < DEFAULT_THRESHOLDS.spO2Min) {
      alerts.push("Low oxygen saturation")
    }

    return alerts
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center">Loading vital signs data...</div>
  }

  if (error && !isOfflineMode) {
    return (
      <div className="h-[300px] flex items-center justify-center text-destructive">
        <AlertTriangle className="w-5 h-5 mr-2" />
        {error}
      </div>
    )
  }

  const alerts = vitalSigns ? checkAlerts(vitalSigns) : []

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex items-center">
          {isOfflineMode ? (
            <>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>OFFLINE</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span>MONITORING</span>
            </>
          )}
        </div>
        {vitalSigns && <div className="text-muted-foreground">Last updated: {formatTime(vitalSigns.timestamp)}</div>}
      </div>

      <div
        className={`flex-1 relative border border-slate-700 rounded-md overflow-hidden bg-black ${isOfflineMode ? "opacity-80" : ""}`}
      >
        <canvas ref={canvasRef} className="w-full h-full"></canvas>

        {/* Vital signs overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className={`bg-black/70 p-2 rounded ${isOfflineMode ? "text-slate-400" : "text-green-500"} font-mono`}>
            HR: {vitalSigns?.heartRate || "--"} bpm
          </div>
          <div className={`bg-black/70 p-2 rounded ${isOfflineMode ? "text-slate-400" : "text-blue-500"} font-mono`}>
            SpO2: {vitalSigns?.spO2 || "--"}%
          </div>
          <div className={`bg-black/70 p-2 rounded ${isOfflineMode ? "text-slate-400" : "text-orange-500"} font-mono`}>
            TEMP: {vitalSigns?.temperature?.toFixed(1) || "--"}°C
          </div>
        </div>

        {/* Offline indicator */}
        {isOfflineMode && (
          <div className="absolute top-4 right-4 bg-black/70 p-2 rounded flex items-center">
            <CloudOff className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-yellow-500 font-mono">OFFLINE MODE</span>
          </div>
        )}
      </div>

      {/* Alerts section */}
      {alerts.length > 0 && (
        <div className="mt-4 p-3 bg-destructive/20 border border-destructive rounded-md">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
            <span className="font-semibold text-destructive">Alerts</span>
          </div>
          <ul className="list-disc list-inside text-sm">
            {alerts.map((alert, index) => (
              <li key={index} className="text-destructive">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
