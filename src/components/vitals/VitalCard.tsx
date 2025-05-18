
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export type VitalStatus = "normal" | "warning" | "danger";

interface VitalCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  status: VitalStatus;
  animate?: boolean;
}

const VitalCard: React.FC<VitalCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  icon,
  status,
  animate = false
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
      "overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700",
      isAnimated && "scale-105",
      status === "normal" && "border-l-4 border-l-green-500",
      status === "warning" && "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      status === "danger" && "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20"
    )}>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
          <div className={cn(
            "text-2xl",
            status === "normal" && "text-green-500",
            status === "warning" && "text-yellow-500",
            status === "danger" && "text-red-500",
            title === "Heart Rate" && "animate-pulse"
          )}>
            {icon}
          </div>
        </div>
        <div className="flex items-end">
          <div className={cn(
            "text-3xl font-bold transition-all",
            status === "normal" && "text-green-500",
            status === "warning" && "text-yellow-500",
            status === "danger" && "text-red-500"
          )}>
            {value}
          </div>
          <div className="text-lg ml-1 text-gray-500 dark:text-gray-400">{unit}</div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {status === "normal" && "Normal"}
          {status === "warning" && "Warning: Outside normal range"}
          {status === "danger" && "Critical: Take action immediately"}
        </p>
      </CardContent>
    </Card>
  );
};

export default VitalCard;
