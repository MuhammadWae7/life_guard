
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
  Area
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
          <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-300 font-medium">{`Time: ${label}`}</p>
            <p className="text-gray-500 dark:text-gray-400">Waiting for data...</p>
          </div>
        );
      }

      const status =
        value < normalRangeMin ? "Below Normal" :
          value > normalRangeMax ? "Above Normal" : "Normal";

      const statusColor =
        value < normalRangeMin || value > normalRangeMax ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400";

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-gray-600 dark:text-gray-300 font-medium">{`Time: ${label}`}</p>
          <p className="text-lg font-semibold">{`${title}: `}<span className="font-bold" style={{ color }}>{value} {unit}</span></p>
          <p className={`font-medium ${statusColor} flex items-center`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${value < normalRangeMin || value > normalRangeMax ? "bg-red-500" : "bg-green-500"}`}></span>
            {status}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full h-[400px] dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 border-t-4" style={{ borderTopColor: color }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            {title} Monitoring
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </CardTitle>
          <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
            Normal: {normalRangeMin}-{normalRangeMax} {unit}
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[320px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.3" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.1} vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#888', fontSize: 12 }}
              tickLine={{ stroke: '#888', opacity: 0.5 }}
              axisLine={{ stroke: '#888', opacity: 0.5 }}
              dy={10}
            />
            <YAxis
              domain={[yDomainMin, yDomainMax]}
              tick={{ fill: '#888', fontSize: 12 }}
              tickLine={{ stroke: '#888', opacity: 0.5 }}
              axisLine={{ stroke: '#888', opacity: 0.5 }}
              unit={` ${unit}`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={normalRangeMin}
              stroke="#888"
              strokeDasharray="3 3"
              label={{
                value: `Min: ${normalRangeMin}`,
                position: 'insideBottomLeft',
                fill: '#888',
                fontSize: 10
              }}
            />
            <ReferenceLine
              y={normalRangeMax}
              stroke="#888"
              strokeDasharray="3 3"
              label={{
                value: `Max: ${normalRangeMax}`,
                position: 'insideTopLeft',
                fill: '#888',
                fontSize: 10
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fillOpacity={0.2}
              fill={`url(#color${title})`}
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ stroke: color, strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: 'white' }}
              isAnimationActive={true}
              animationDuration={1500}
              filter="url(#shadow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VitalChart;
