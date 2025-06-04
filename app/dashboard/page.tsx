"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VitalSignsMonitor } from "@/components/vital-signs-monitor"
import { HistoricalReadings } from "@/components/historical-readings"
import { useLanguage } from "@/contexts/language-context"
import { fetchVitalSigns, fetchHistoricalReadings } from "@/lib/api"
import type { VitalSigns } from "@/types/health"
import { getWebSocketService } from "@/lib/websocket-service"
import { Heart, Thermometer, Activity, Wifi, WifiOff, RefreshCw, Clock, CloudOff } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import {
  getVitalSignsFromCache,
  getReadingsHistoryFromCache,
  saveVitalSignsToCache,
  saveReadingsHistoryToCache,
  getLastUpdatedTime,
  addReadingToHistory,
} from "@/lib/offline-storage"

export default function Dashboard() {
  const { t } = useLanguage()
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null)
  const [lastReadings, setLastReadings] = useState<VitalSigns[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected")
  const [wsError, setWsError] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load cached data on initial load
  useEffect(() => {
    const cachedVitalSigns = getVitalSignsFromCache()
    const cachedReadings = getReadingsHistoryFromCache()
    const lastUpdatedTime = getLastUpdatedTime()

    if (cachedVitalSigns) {
      setVitalSigns(cachedVitalSigns)
    }

    if (cachedReadings && cachedReadings.length > 0) {
      setLastReadings(cachedReadings)
    }

    if (lastUpdatedTime) {
      setLastUpdated(lastUpdatedTime)
    }
  }, [])

  // Use WebSocket for real-time data
  useEffect(() => {
    const wsService = getWebSocketService()

    const handleMessage = (data: VitalSigns) => {
      setVitalSigns(data)
      setLastReadings((prev) => {
        const newReadings = [data, ...prev]
        const limitedReadings = newReadings.slice(0, 3)
        return limitedReadings
      })

      // Cache the data for offline use
      saveVitalSignsToCache(data)
      addReadingToHistory(data)
      setLastUpdated(new Date().toISOString())

      setLoading(false)
      setError(null)
      setWsError(null)
      setIsOfflineMode(false)
    }

    const handleError = (errorMessage: string) => {
      setWsError(errorMessage)
      setConnectionStatus("error")

      // Switch to offline mode if we have cached data
      const cachedData = getVitalSignsFromCache()
      if (cachedData) {
        setIsOfflineMode(true)
      }
    }

    wsService.addMessageHandler(handleMessage)
    wsService.addErrorHandler(handleError)

    // Monitor connection status
    const statusInterval = setInterval(() => {
      const status = wsService.getConnectionState()
      setConnectionStatus(status)

      // If we're disconnected and have cached data, switch to offline mode
      if (status === "disconnected" || status === "error") {
        const cachedData = getVitalSignsFromCache()
        if (cachedData) {
          setIsOfflineMode(true)
        }
      } else if (status === "connected") {
        setIsOfflineMode(false)
      }
    }, 1000)

    // Try to connect
    wsService.connect()

    // Fallback to API if WebSocket fails after a delay
    const fallbackTimeout = setTimeout(async () => {
      if (!wsService.isConnected()) {
        console.log("WebSocket connection failed, falling back to API")
        try {
          const [currentData, historicalData] = await Promise.all([fetchVitalSigns(), fetchHistoricalReadings()])

          if (currentData) {
            setVitalSigns(currentData)
            saveVitalSignsToCache(currentData)
          }

          if (historicalData && historicalData.length > 0) {
            setLastReadings(historicalData.slice(0, 3))
            saveReadingsHistoryToCache(historicalData)
          }

          setLoading(false)
          setError("Using simulated data - Arduino not connected")
          setIsOfflineMode(true)
          setLastUpdated(new Date().toISOString())
        } catch (err) {
          // If API fails too, check if we have cached data
          const cachedVitalSigns = getVitalSignsFromCache()
          const cachedReadings = getReadingsHistoryFromCache()

          if (cachedVitalSigns) {
            setVitalSigns(cachedVitalSigns)
            setLastReadings(cachedReadings)
            setIsOfflineMode(true)
            setError("Using cached data - Arduino not connected")
          } else {
            setError("Failed to fetch vital signs data. Please ensure Arduino is connected.")
          }

          setLoading(false)
        }
      }
    }, 5000) // Wait 5 seconds before falling back

    return () => {
      clearInterval(statusInterval)
      clearTimeout(fallbackTimeout)
      wsService.removeMessageHandler(handleMessage)
      wsService.removeErrorHandler(handleError)
    }
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)

    try {
      // Try to reconnect WebSocket
      const wsService = getWebSocketService()
      wsService.disconnect()
      setTimeout(() => {
        wsService.connect()
      }, 500)

      // Also try API as fallback
      const [currentData, historicalData] = await Promise.all([fetchVitalSigns(), fetchHistoricalReadings()])

      if (currentData) {
        setVitalSigns(currentData)
        saveVitalSignsToCache(currentData)
      }

      if (historicalData && historicalData.length > 0) {
        setLastReadings(historicalData.slice(0, 3))
        saveReadingsHistoryToCache(historicalData)
      }

      setLastUpdated(new Date().toISOString())
    } catch (err) {
      console.error("Refresh failed:", err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatLastUpdated = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString()
    } catch (e) {
      return "Unknown"
    }
  }

  const getConnectionIcon = () => {
    if (isOfflineMode) {
      return <CloudOff className="w-4 h-4 text-yellow-500" />
    }

    switch (connectionStatus) {
      case "connected":
        return <Wifi className="w-4 h-4 text-green-500" />
      case "connecting":
        return <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
      case "error":
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />
    }
  }

  const getConnectionText = () => {
    if (isOfflineMode) {
      return "Offline Mode"
    }

    switch (connectionStatus) {
      case "connected":
        return "Arduino Connected"
      case "connecting":
        return "Connecting to Arduino..."
      case "error":
        return wsError || "Connection Error"
      case "disconnected":
        return "Arduino Disconnected"
      default:
        return "Unknown Status"
    }
  }

  const DashboardContent = () => {
    if (loading && !vitalSigns) {
      return (
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t("loading")}</p>
              <p className="text-sm text-muted-foreground mt-2">Connecting to Arduino device...</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t("dashboard")}</h1>
              <p className="text-muted-foreground">{t("realTimeMonitor")}</p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                {getConnectionIcon()}
                <span className="text-sm font-medium">{getConnectionText()}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || connectionStatus === "connected"}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Offline Mode Banner */}
          {isOfflineMode && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CloudOff className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    You're viewing cached data in offline mode
                  </p>
                  <div className="flex items-center text-sm text-yellow-700 dark:text-yellow-300">
                    <Clock className="w-4 h-4 mr-1" />
                    Last updated: {lastUpdated ? formatLastUpdated(lastUpdated) : "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {(error || wsError) && !isOfflineMode && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">{error || wsError}</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Make sure your Arduino is connected and the WebSocket server is running on the correct port.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Monitor */}
        <div className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                {isOfflineMode ? "Offline Monitor" : t("realTimeMonitor")}
              </CardTitle>
              {isOfflineMode && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  Cached data from: {lastUpdated ? formatLastUpdated(lastUpdated) : "Unknown"}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <VitalSignsMonitor
                vitalSigns={vitalSigns}
                loading={loading}
                error={error || wsError}
                isOfflineMode={isOfflineMode}
              />
            </CardContent>
          </Card>
        </div>

        {/* Current Vital Signs Cards */}
        {vitalSigns && (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("heartRate")}</p>
                    <p className="text-2xl font-bold text-red-500">
                      {vitalSigns.heartRate || "--"} <span className="text-sm">{t("bpm")}</span>
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("temperature")}</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {vitalSigns.temperature?.toFixed(1) || "--"} <span className="text-sm">°C</span>
                    </p>
                  </div>
                  <Thermometer className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("oxygenSaturation")}</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {vitalSigns.spO2 || "--"} <span className="text-sm">%</span>
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Last 3 Readings */}
        {lastReadings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t("history")} - Last 3 Readings</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {lastReadings.map((reading, index) => (
                <HistoricalReadings key={reading.timestamp} reading={reading} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!vitalSigns && !loading && (
          <Card className="text-center p-8">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Please ensure your Arduino device is connected and sending data to the WebSocket server.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Expected WebSocket URL: ws://192.168.1.100:8080</p>
                <p>Make sure your Arduino is running the WebSocket server on this address.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
