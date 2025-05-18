
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export type VitalStatus = "normal" | "warning" | "danger";

interface VitalCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  status: VitalStatus;
  normalRange: string;
  animate?: boolean;
  pulsing?: boolean;
}

const VitalCard: React.FC<VitalCardProps> = ({
  title,
  value,
  unit,
  icon,
  status,
  normalRange,
  animate = true,
  pulsing = false
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    if (animate) {
      setIsAnimated(true);
      
      const timer = setTimeout(() => {
        setIsAnimated(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [value, animate]);
  
  return (
    <Card className={cn(
      "stat-card overflow-hidden transition-all duration-300",
      isAnimated && "scale-105",
      status === "normal" && "border-l-4 border-l-health-success",
      status === "warning" && "border-l-4 border-l-health-warning",
      status === "danger" && "border-l-4 border-l-health-danger bg-red-50"
    )}
      role="region"
      aria-label={`${title} vital sign`}
      aria-live={status === "danger" ? "assertive" : "polite"}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
        <div className={cn(
          "text-2xl",
          status === "normal" && "text-health-success",
          status === "warning" && "text-health-warning",
          status === "danger" && "text-health-danger",
          pulsing && title === "Heart Rate" && "animate-heartbeat"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end">
          <div className={cn(
            "text-3xl font-bold transition-all",
            status === "normal" && "text-health-success",
            status === "warning" && "text-health-warning",
            status === "danger" && "text-health-danger"
          )}>
            {value}
          </div>
          <div className="text-lg ml-1 text-gray-500">{unit}</div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Normal range: {normalRange}</p>
        
        {status === "warning" && (
          <p className="text-sm text-health-warning mt-2 font-medium">Slightly out of normal range</p>
        )}
        
        {status === "danger" && (
          <p className="text-sm text-health-danger mt-2 font-medium">Critical value! Please take action.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalCard;
