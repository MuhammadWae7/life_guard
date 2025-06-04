export interface VitalSigns {
  timestamp: string
  heartRate: number
  temperature: number
  spO2: number
}

export interface AlertThreshold {
  heartRateMin: number
  heartRateMax: number
  temperatureMin: number
  temperatureMax: number
  spO2Min: number
}

export const DEFAULT_THRESHOLDS: AlertThreshold = {
  heartRateMin: 60,
  heartRateMax: 100,
  temperatureMin: 36.1,
  temperatureMax: 37.2,
  spO2Min: 95,
}
