"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VitalSigns } from "@/types/health"
import { Heart, Thermometer, Activity, Clock } from "lucide-react"

interface HistoricalReadingsProps {
  reading: VitalSigns
  index: number
}

export function HistoricalReadings({ reading, index }: HistoricalReadingsProps) {
  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <Card className={`bg-background border-primary/20 ${index === 0 ? "border-green-500/50" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Reading {index + 1}</span>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(reading.timestamp)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            <div>
              <div className="text-sm text-muted-foreground">Heart Rate</div>
              <div className="font-bold">{reading.heartRate} bpm</div>
            </div>
          </div>
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-orange-500" />
            <div>
              <div className="text-sm text-muted-foreground">Temperature</div>
              <div className="font-bold">{reading.temperature.toFixed(1)}°C</div>
            </div>
          </div>
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">SpO2</div>
              <div className="font-bold">{reading.spO2}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
