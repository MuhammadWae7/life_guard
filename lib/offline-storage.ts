import type { VitalSigns } from "@/types/health"

const VITAL_SIGNS_CACHE_KEY = "lifeguard_vital_signs_cache"
const READINGS_HISTORY_CACHE_KEY = "lifeguard_readings_history"
const LAST_UPDATED_KEY = "lifeguard_last_updated"

export function saveVitalSignsToCache(data: VitalSigns): void {
  try {
    localStorage.setItem(VITAL_SIGNS_CACHE_KEY, JSON.stringify(data))
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString())
  } catch (error) {
    console.error("Failed to save vital signs to cache:", error)
  }
}

export function getVitalSignsFromCache(): VitalSigns | null {
  try {
    const cached = localStorage.getItem(VITAL_SIGNS_CACHE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error("Failed to get vital signs from cache:", error)
    return null
  }
}

export function saveReadingsHistoryToCache(data: VitalSigns[]): void {
  try {
    // Limit to last 10 readings to prevent excessive storage use
    const limitedData = data.slice(0, 10)
    localStorage.setItem(READINGS_HISTORY_CACHE_KEY, JSON.stringify(limitedData))
  } catch (error) {
    console.error("Failed to save readings history to cache:", error)
  }
}

export function getReadingsHistoryFromCache(): VitalSigns[] {
  try {
    const cached = localStorage.getItem(READINGS_HISTORY_CACHE_KEY)
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.error("Failed to get readings history from cache:", error)
    return []
  }
}

export function getLastUpdatedTime(): string | null {
  return localStorage.getItem(LAST_UPDATED_KEY)
}

export function clearCache(): void {
  try {
    localStorage.removeItem(VITAL_SIGNS_CACHE_KEY)
    localStorage.removeItem(READINGS_HISTORY_CACHE_KEY)
    localStorage.removeItem(LAST_UPDATED_KEY)
  } catch (error) {
    console.error("Failed to clear cache:", error)
  }
}

export function addReadingToHistory(reading: VitalSigns): void {
  try {
    const history = getReadingsHistoryFromCache()
    const updatedHistory = [reading, ...history].slice(0, 10) // Keep only last 10 readings
    saveReadingsHistoryToCache(updatedHistory)
  } catch (error) {
    console.error("Failed to add reading to history:", error)
  }
}
