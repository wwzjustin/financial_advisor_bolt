import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  color?: 'blue' | 'green' | 'yellow';
  showValues?: boolean;
}

export default function ProgressBar({ 
  current, 
  target, 
  label, 
  color = 'blue',
  showValues = true 
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-primary-500',
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
  };

  const bgColorClasses = {
    blue: 'bg-primary-100',
    green: 'bg-success-100',
    yellow: 'bg-warning-100',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-900">{label}</span>
          {showValues && (
            <span className="text-gray-600">
              {formatCurrency(current)} / {formatCurrency(target)}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${bgColorClasses[color]} rounded-full h-3`}>
        <div
          className={`${colorClasses[color]} h-3 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500">
        {percentage.toFixed(1)}% complete
      </div>
    </div>
  );
}