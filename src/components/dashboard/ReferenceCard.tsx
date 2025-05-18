
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReferenceCardProps {
  title: string;
  range: {
    min: number;
    max: number;
  };
  unit: string;
  infoText: string;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({
  title,
  range,
  unit,
  infoText
}) => {
  const [value, setValue] = useState<number>(Math.floor((range.min + range.max) / 2));
  const [progress, setProgress] = useState<number>(50);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random value within range
      const newValue = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      setValue(newValue);
      
      // Calculate progress percentage
      const percentage = ((newValue - range.min) / (range.max - range.min)) * 100;
      setProgress(percentage);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [range.min, range.max]);
  
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">Reference: {title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{range.min} {unit}</span>
          <span className="text-lg font-semibold">{value} {unit}</span>
          <span className="text-xs text-gray-500">{range.max} {unit}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 mt-3">{infoText}</p>
      </CardContent>
    </Card>
  );
};

export default ReferenceCard;
