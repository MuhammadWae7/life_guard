// Remove API key from client-side API calls
import type { VitalSigns } from "@/types/health"
import { apiConfig, getApiHeaders } from "./api-config"

// Enhanced API client with proper error handling (server-side authentication)
class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor() {
    this.baseUrl = apiConfig.baseUrl
    this.headers = getApiHeaders()
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
      signal: AbortSignal.timeout(apiConfig.timeout),
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Get current vital signs (using internal API routes)
  async getCurrentVitalSigns(): Promise<VitalSigns> {
    try {
      const data = await this.request<VitalSigns>("/api/vital-signs")
      return this.validateVitalSigns(data)
    } catch (error) {
      // Return empty data structure when API fails
      return {
        timestamp: new Date().toISOString(),
        heartRate: 0,
        temperature: 0,
        spO2: 0,
      }
    }
  }

  // Get historical vital signs (using internal API routes)
  async getVitalSignsHistory(limit = 10): Promise<VitalSigns[]> {
    try {
      const data = await this.request<VitalSigns[]>(`/api/vital-signs/history?limit=${limit}`)
      return data.map((reading) => this.validateVitalSigns(reading))
    } catch (error) {
      return []
    }
  }

  // Data validation
  private validateVitalSigns(data: any): VitalSigns {
    // Ensure data is in the correct format
    return {
      timestamp: data.timestamp || new Date().toISOString(),
      heartRate: Number(data.heartRate) || 0,
      temperature: Number(data.temperature) || 0,
      spO2: Number(data.spO2) || 0,
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// Export convenience functions
export const fetchVitalSigns = () => apiClient.getCurrentVitalSigns()
export const fetchHistoricalReadings = (limit?: number) => apiClient.getVitalSignsHistory(limit)

export default apiClient
