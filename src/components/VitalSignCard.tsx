import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VitalSignCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: React.ReactNode;
  normalRange: { min: number; max: number };
  isConnected: boolean;
}

const VitalSignCard: React.FC<VitalSignCardProps> = ({
  title,
  value,
  unit,
  icon,
  normalRange,
  isConnected
}) => {
  const { t } = useTranslation();

  const getStatusColor = () => {
    if (!value || !isConnected) return 'text-gray-400';
    if (value < normalRange.min || value > normalRange.max) {
      return 'text-red-500';
    }
    return 'text-green-500';
  };

  const getBackgroundColor = () => {
    if (!value || !isConnected) return 'bg-gray-50 dark:bg-gray-800';
    if (value < normalRange.min || value > normalRange.max) {
      return 'bg-red-50 dark:bg-red-900/20';
    }
    return 'bg-green-50 dark:bg-green-900/20';
  };

  return (
    <Card className={`medical-card ${getBackgroundColor()} transition-all duration-700 shadow-lg hover:scale-105 hover:shadow-2xl animate-fade-in`}> 
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2 animate-gradient-x">
          <span className={getStatusColor()}>{icon}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={`vital-display ${getStatusColor()} ${isConnected && value ? 'pulse-animation' : ''} animate-fade-in`}> 
            {!isConnected ? (
              <span className="text-lg text-gray-400 animate-pulse">{t('connecting')}</span>
            ) : value !== null ? (
              <>
                <span className="drop-shadow-lg animate-bounce">{value.toFixed(1)}</span>
                <span className="text-lg font-normal ml-1 animate-gradient-x">{unit}</span>
              </>
            ) : (
              <span className="text-lg text-gray-400 animate-pulse">{t('noData')}</span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Normal: {normalRange.min}-{normalRange.max} {unit}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignCard;
