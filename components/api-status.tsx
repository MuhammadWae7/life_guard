"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { apiConfig, validateApiConfig } from "@/lib/api-config"

interface ApiStatus {
  endpoint: string
  status: "success" | "error" | "testing"
  message: string
  responseTime?: number
}

export function ApiStatus() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([])
  const [isTestingAll, setIsTestingAll] = useState(false)

  const testEndpoints = [
    { name: "Current Vital Signs", endpoint: apiConfig.endpoints.vitalSigns.current },
    { name: "Vital Signs History", endpoint: apiConfig.endpoints.vitalSigns.history },
    { name: "Device Status", endpoint: apiConfig.endpoints.devices.status },
    { name: "User Profile", endpoint: apiConfig.endpoints.user.profile },
  ]

  const testEndpoint = async (endpoint: string): Promise<ApiStatus> => {
    const startTime = Date.now()

    try {
      const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Remove API key from client-side requests
        },
        signal: AbortSignal.timeout(5000),
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        return {
          endpoint,
          status: "success",
          message: `Connected (${response.status})`,
          responseTime,
        }
      } else {
        return {
          endpoint,
          status: "error",
          message: `Error ${response.status}: ${response.statusText}`,
          responseTime,
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      return {
        endpoint,
        status: "error",
        message: error instanceof Error ? error.message : "Connection failed",
        responseTime,
      }
    }
  }

  const testAllEndpoints = async () => {
    setIsTestingAll(true)

    // Initialize with testing status
    const initialStatuses = testEndpoints.map(({ endpoint }) => ({
      endpoint,
      status: "testing" as const,
      message: "Testing...",
    }))
    setApiStatuses(initialStatuses)

    // Test each endpoint
    const results = await Promise.all(testEndpoints.map(({ endpoint }) => testEndpoint(endpoint)))

    setApiStatuses(results)
    setIsTestingAll(false)
  }

  useEffect(() => {
    // Test endpoints on component mount
    testAllEndpoints()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "testing":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Connected
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      case "testing":
        return <Badge variant="secondary">Testing...</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const configValidation = validateApiConfig()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Connection Status</CardTitle>
        <Button variant="outline" size="sm" onClick={testAllEndpoints} disabled={isTestingAll}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isTestingAll ? "animate-spin" : ""}`} />
          Test All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Status - Remove API key display */}
        <div className="space-y-2">
          <h4 className="font-medium">Configuration</h4>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Base URL</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">{apiConfig.baseUrl || "Not set"}</code>
                {apiConfig.baseUrl ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">WebSocket URL</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">{apiConfig.websocketUrl || "Not set"}</code>
                {apiConfig.websocketUrl ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Errors */}
        {!configValidation.isValid && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <h4 className="font-medium text-destructive mb-2">Configuration Errors</h4>
            <ul className="text-sm text-destructive space-y-1">
              {configValidation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Endpoint Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Endpoint Status</h4>
          <div className="space-y-2">
            {testEndpoints.map(({ name, endpoint }, index) => {
              const status = apiStatuses[index]
              return (
                <div key={endpoint} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {status && getStatusIcon(status.status)}
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {status?.responseTime && (
                      <span className="text-xs text-muted-foreground">{status.responseTime}ms</span>
                    )}
                    {status && getStatusBadge(status.status)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Setup Instructions</h4>
          <ol className="text-sm space-y-1">
            <li>1. Get API credentials from your hardware team</li>
            <li>2. Set environment variables in .env.local</li>
            <li>3. Restart the application</li>
            <li>4. Test the connection using the button above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
