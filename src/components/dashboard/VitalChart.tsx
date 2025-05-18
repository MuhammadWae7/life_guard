
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  time: string;
  value: number;
}

interface VitalChartProps {
  title: string;
  data: DataPoint[];
  unit: string;
  normalRangeMin: number;
  normalRangeMax: number;
  color: string;
}

const VitalChart: React.FC<VitalChartProps> = ({
  title,
  data,
  unit,
  normalRangeMin,
  normalRangeMax,
  color
}) => {
  // Calculate domain padding
  const allValues = data.map(item => item.value);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  
  // Set domain with 10% padding and ensure normal range is included
  // If all values are 0 (no data yet), use the normal ranges for the domain
  const effectiveMinValue = allValues.every(v => v === 0) ? normalRangeMin * 0.9 : minValue;
  const effectiveMaxValue = allValues.every(v => v === 0) ? normalRangeMax * 1.1 : maxValue;
  
  const yDomainMin = Math.min(normalRangeMin, effectiveMinValue) - Math.max(1, (normalRangeMax - normalRangeMin) * 0.1);
  const yDomainMax = Math.max(normalRangeMax, effectiveMaxValue) + Math.max(1, (normalRangeMax - normalRangeMin) * 0.1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      
      // Handle the case when value is 0 (no data)
      if (value === 0) {
        return (
          <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
            <p className="text-gray-600 dark:text-gray-300">{`Time: ${label}`}</p>
            <p>Waiting for data...</p>
          </div>
        );
      }
      
      const status = 
        value < normalRangeMin ? "Below Normal" :
        value > normalRangeMax ? "Above Normal" : "Normal";
      
      const statusColor = 
        value < normalRangeMin || value > normalRangeMax ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400";
      
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="text-gray-600 dark:text-gray-300">{`Time: ${label}`}</p>
          <p>{`${title}: `}<span className="font-bold">{value} {unit}</span></p>
          <p className={`font-medium ${statusColor}`}>{status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-[400px] dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{title} Monitoring</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">Normal Range: {normalRangeMin}-{normalRangeMax} {unit}</p>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#888', fontSize: 12 }}
              tickLine={{ stroke: '#888' }}
              axisLine={{ stroke: '#888' }}
            />
            <YAxis 
              domain={[yDomainMin, yDomainMax]}
              tick={{ fill: '#888', fontSize: 12 }}
              tickLine={{ stroke: '#888' }}
              axisLine={{ stroke: '#888' }}
              unit={` ${unit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={normalRangeMin} stroke="#888" strokeDasharray="3 3" />
            <ReferenceLine y={normalRangeMax} stroke="#888" strokeDasharray="3 3" />
            <defs>
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ stroke: color, strokeWidth: 1, r: 2, fill: color }}
              activeDot={{ r: 5 }}
              fill={`url(#color${title})`}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VitalChart;
