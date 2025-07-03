import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import ChartErrorBoundary from '../ChartErrorBoundary';

interface InteractiveChartProps {
  data: {
    label: string;
    value: number;
    target?: number;
    color: string;
    icon?: React.ReactNode;
  }[];
  title: string;
  type?: 'bar' | 'progress' | 'circular';
}

const InteractiveChart = React.memo(({ data, title, type = 'bar' }: InteractiveChartProps) => {
  const [animatedValues, setAnimatedValues] = useState(data.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(data.map(item => item.value));
    }, 300);

    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = useMemo(() => {
    if (data.length === 0) return 100;
    return Math.max(...data.map(item => Math.max(item.value, item.target || 0)));
  }, [data]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setHoveredIndex(hoveredIndex === index ? null : index);
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">{title}</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  if (type === 'circular') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => {
            const safeValue = Math.max(0, animatedValues[index] || 0);
            const safeMaxValue = Math.max(1, maxValue);
            const percentage = Math.min(100, (safeValue / safeMaxValue) * 100);
            const circumference = 2 * Math.PI * 45;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            
            return (
              <div
                key={`${item.label}-${index}`}
                className="relative flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={0}
                role="button"
                aria-label={`${item.label}: ${safeValue.toLocaleString()}${item.target ? ` de ${item.target.toLocaleString()}` : ''}`}
              >
                <div className="relative w-24 h-24 mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: hoveredIndex === index ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {Math.round(percentage)}%
                      </div>
                      {item.icon && (
                        <div className="text-gray-500 mt-1" aria-hidden="true">
                          {item.icon}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-lg font-bold" style={{ color: item.color }}>
                    {safeValue.toLocaleString()}
                  </div>
                  {item.target && (
                    <div className="text-xs text-gray-500 mt-1">
                      Meta: {item.target.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'progress') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
        <div className="space-y-6">
          {data.map((item, index) => {
            const safeValue = Math.max(0, animatedValues[index] || 0);
            const safeMaxValue = Math.max(1, maxValue);
            const percentage = Math.min(100, (safeValue / safeMaxValue) * 100);
            const targetPercentage = item.target ? Math.min(100, (item.target / safeMaxValue) * 100) : 0;
            
            return (
              <div
                key={`${item.label}-${index}`}
                className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onKeyDown={(e) => handleKeyDown(e, index)}
                tabIndex={0}
                role="button"
                aria-label={`${item.label}: ${safeValue.toLocaleString()}${item.target ? ` de ${item.target.toLocaleString()}` : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {safeValue.toLocaleString()}
                    </span>
                    {item.target && (
                      <span className="text-xs text-gray-500">
                        / {item.target.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  {item.target && (
                    <div
                      className="absolute top-0 w-0.5 h-full bg-gray-400 z-10"
                      style={{ left: `${targetPercentage}%` }}
                      aria-label="Meta"
                    >
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      boxShadow: hoveredIndex === index ? `0 0 12px ${item.color}40` : 'none'
                    }}
                    role="progressbar"
                    aria-valuenow={safeValue}
                    aria-valuemin={0}
                    aria-valuemax={item.target || safeMaxValue}
                  ></div>
                </div>
                {hoveredIndex === index && (
                  <div className="mt-2 text-xs text-gray-600 animate-fade-in">
                    {percentage.toFixed(1)}% del máximo
                    {item.target && (
                      <span className="ml-2">
                        {safeValue >= item.target ? '✅ Meta alcanzada' : '🎯 Trabajando hacia la meta'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default bar chart
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="flex items-end justify-between h-64 gap-4">
        {data.map((item, index) => {
          const safeValue = Math.max(0, animatedValues[index] || 0);
          const safeMaxValue = Math.max(1, maxValue);
          const height = Math.min(100, (safeValue / safeMaxValue) * 100);
          
          return (
            <div
              key={`${item.label}-${index}`}
              className="flex-1 flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
              role="button"
              aria-label={`${item.label}: ${safeValue.toLocaleString()}${item.target ? `, meta: ${item.target.toLocaleString()}` : ''}`}
            >
              <div className="relative w-full flex flex-col items-center">
                <div
                  className={`mb-2 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                    hoveredIndex === index
                      ? 'bg-gray-800 text-white scale-110'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {safeValue.toLocaleString()}
                </div>
                
                <div
                  className="w-full rounded-t-lg transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    height: `${height}%`,
                    background: `linear-gradient(180deg, ${item.color}, ${item.color}dd)`,
                    boxShadow: hoveredIndex === index ? `0 0 20px ${item.color}40` : 'none',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                  role="progressbar"
                  aria-valuenow={safeValue}
                  aria-valuemin={0}
                  aria-valuemax={safeMaxValue}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 ${
                      hoveredIndex === index ? 'opacity-20' : ''
                    }`}
                    style={{
                      transform: 'skewX(-20deg)',
                      animation: hoveredIndex === index ? 'shine 1s ease-in-out' : 'none'
                    }}
                  ></div>
                  
                  {item.icon && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white" aria-hidden="true">
                      {item.icon}
                    </div>
                  )}
                </div>
                
                {item.target && (
                  <div
                    className="absolute w-full border-t-2 border-dashed border-gray-400"
                    style={{
                      bottom: `${(item.target / safeMaxValue) * 100}%`
                    }}
                    aria-label="Meta"
                  >
                    <span className="absolute -right-8 -top-2 text-xs text-gray-500">
                      Meta
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-center">
                <div className="text-sm font-medium text-gray-700">{item.label}</div>
                {hoveredIndex === index && item.target && (
                  <div className="text-xs text-gray-500 mt-1">
                    {safeValue >= item.target ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <TrendingUp size={12} aria-hidden="true" /> ¡Meta alcanzada!
                      </span>
                    ) : (
                      <span className="text-orange-600 flex items-center gap-1">
                        <Target size={12} aria-hidden="true" /> Faltan {(item.target - safeValue).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

InteractiveChart.displayName = 'InteractiveChart';

export default function InteractiveChartWithErrorBoundary(props: InteractiveChartProps) {
  return (
    <ChartErrorBoundary>
      <InteractiveChart {...props} />
    </ChartErrorBoundary>
  );
}