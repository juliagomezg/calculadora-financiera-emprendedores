import React, { useEffect, useState, useMemo } from 'react';
import ChartErrorBoundary from '../ChartErrorBoundary';

interface ChartProps {
  data: {
    units: number;
    revenue: number;
    totalCost: number;
    profit: number;
  }[];
  breakEvenPoint: number;
}

const Chart = React.memo(({ data, breakEvenPoint }: ChartProps) => {
  const [animatedData, setAnimatedData] = useState(data);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedData(data);
      setIsAnimating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const chartCalculations = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(
      ...data.map(item => Math.max(item.revenue || 0, item.totalCost || 0))
    );
    
    const maxUnits = data[data.length - 1]?.units || 0;
    
    // Chart dimensions - responsive
    const width = 600;
    const height = 350;
    const padding = 60;
    
    // Helpers to convert data points to coordinates
    const xScale = (units: number) => (units / Math.max(maxUnits, 1)) * (width - padding * 2) + padding;
    const yScale = (value: number) => height - (value / Math.max(maxValue, 1)) * (height - padding * 2) - padding;
    
    return { maxValue, maxUnits, width, height, padding, xScale, yScale };
  }, [data]);

  if (!chartCalculations || !data || data.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full flex items-center justify-center">
          <p className="text-gray-500">No hay datos suficientes para mostrar la gráfica</p>
        </div>
      </div>
    );
  }

  const { maxValue, maxUnits, width, height, padding, xScale, yScale } = chartCalculations;
  
  // Generate path strings for lines with smooth curves
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === 1) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else if (i === points.length - 1) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y + (curr.y - prev.y) * 0.3;
        const cp2x = curr.x - (next.x - prev.x) * 0.1;
        const cp2y = curr.y - (next.y - prev.y) * 0.1;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };
  
  // Generate points for revenue and cost lines
  const revenuePoints = animatedData.map(item => ({
    x: xScale(item.units || 0),
    y: yScale(item.revenue || 0)
  }));
  
  const costPoints = animatedData.map(item => ({
    x: xScale(item.units || 0),
    y: yScale(item.totalCost || 0)
  }));
  
  const revenueLine = createSmoothPath(revenuePoints);
  const costLine = createSmoothPath(costPoints);
  
  // Break-even point coordinates
  const bepX = xScale(breakEvenPoint);
  const bepRevenue = breakEvenPoint * (data[0]?.revenue / Math.max(data[0]?.units, 1) || 0);
  const bepY = yScale(bepRevenue);
  
  // Grid lines
  const gridLines = [];
  const numGridLines = 5;
  
  // Horizontal grid lines
  for (let i = 0; i <= numGridLines; i++) {
    const y = padding + (i * (height - padding * 2)) / numGridLines;
    const value = maxValue * (1 - i / numGridLines);
    gridLines.push(
      <g key={`h-grid-${i}`}>
        <line
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke="#f3f4f6"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <text
          x={padding - 10}
          y={y + 4}
          textAnchor="end"
          fontSize="10"
          fill="#9ca3af"
        >
          ${Math.round(value).toLocaleString()}
        </text>
      </g>
    );
  }
  
  // Vertical grid lines
  for (let i = 0; i <= numGridLines; i++) {
    const x = padding + (i * (width - padding * 2)) / numGridLines;
    const units = (maxUnits * i) / numGridLines;
    gridLines.push(
      <g key={`v-grid-${i}`}>
        <line
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke="#f3f4f6"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <text
          x={x}
          y={height - padding + 15}
          textAnchor="middle"
          fontSize="10"
          fill="#9ca3af"
        >
          {Math.round(units)}
        </text>
      </g>
    );
  }
  
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 h-full">
        <div className="chart-header-section">
          <h4 className="text-sm sm:text-base font-semibold text-gray-700 text-center sm:text-left">Análisis de tu Negocio</h4>
          <div className="chart-legend-items">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <span className="text-gray-600 whitespace-nowrap">Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500"></div>
              <span className="text-gray-600 whitespace-nowrap">Costos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600 whitespace-nowrap">Punto de Equilibrio</span>
            </div>
          </div>
        </div>
        
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Gráfica de análisis financiero mostrando ingresos, costos y punto de equilibrio"
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="costGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="profitArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lossArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid lines */}
          {gridLines}
          
          {/* Profit/Loss areas */}
          {breakEvenPoint > 0 && (
            <>
              <path
                d={`M ${padding} ${yScale(0)} L ${bepX} ${bepY} L ${bepX} ${height - padding} L ${padding} ${height - padding} Z`}
                fill="url(#lossArea)"
              />
              
              <path
                d={`M ${bepX} ${bepY} L ${width - padding} ${yScale(data[data.length - 1]?.revenue || 0)} L ${width - padding} ${yScale(data[data.length - 1]?.totalCost || 0)} Z`}
                fill="url(#profitArea)"
              />
            </>
          )}
          
          {/* Revenue line with glow effect */}
          <path 
            d={revenueLine} 
            fill="none" 
            stroke="url(#revenueGradient)" 
            strokeWidth="3"
            filter="url(#glow)"
            className={`transition-all duration-500 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
          />
          
          {/* Cost line with glow effect */}
          <path 
            d={costLine} 
            fill="none" 
            stroke="url(#costGradient)" 
            strokeWidth="3"
            filter="url(#glow)"
            className={`transition-all duration-500 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
          />
          
          {/* Data points on lines */}
          {revenuePoints.map((point, index) => (
            <circle
              key={`revenue-point-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Punto de ingresos: ${Math.round(animatedData[index]?.units || 0)} unidades, $${Math.round(animatedData[index]?.revenue || 0).toLocaleString()}`}
            >
              <title>
                Unidades: {Math.round(animatedData[index]?.units || 0)} | 
                Ingresos: ${Math.round(animatedData[index]?.revenue || 0).toLocaleString()}
              </title>
            </circle>
          ))}
          
          {costPoints.map((point, index) => (
            <circle
              key={`cost-point-${index}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#f97316"
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Punto de costos: ${Math.round(animatedData[index]?.units || 0)} unidades, $${Math.round(animatedData[index]?.totalCost || 0).toLocaleString()}`}
            >
              <title>
                Unidades: {Math.round(animatedData[index]?.units || 0)} | 
                Costos: ${Math.round(animatedData[index]?.totalCost || 0).toLocaleString()}
              </title>
            </circle>
          ))}
          
          {/* Break-even point with pulsing animation */}
          {breakEvenPoint > 0 && (
            <g>
              <circle 
                cx={bepX} 
                cy={bepY} 
                r="8" 
                fill="#10b981" 
                fillOpacity="0.3"
                className="animate-ping"
              />
              <circle 
                cx={bepX} 
                cy={bepY} 
                r="6" 
                fill="#10b981"
                stroke="white"
                strokeWidth="3"
                filter="url(#glow)"
                role="button"
                tabIndex={0}
                aria-label={`Punto de equilibrio: ${Math.round(breakEvenPoint)} unidades, $${Math.round(bepRevenue).toLocaleString()}`}
              />
              
              <line
                x1={bepX}
                y1={height - padding}
                x2={bepX}
                y2={padding}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="8,4"
                opacity="0.7"
              />
              
              <g transform={`translate(${bepX}, ${height - padding + 35})`}>
                <rect
                  x="-40"
                  y="-12"
                  width="80"
                  height="20"
                  rx="10"
                  fill="#10b981"
                  fillOpacity="0.9"
                />
                <text 
                  textAnchor="middle" 
                  fontSize="11" 
                  fill="white"
                  fontWeight="600"
                  y="2"
                >
                  ¡Punto de Equilibrio!
                </text>
              </g>
              
              <g transform={`translate(${Math.min(bepX + 15, width - 140)}, ${Math.max(bepY - 20, 45)})`}>
                <rect
                  x="0"
                  y="-25"
                  width="120"
                  height="40"
                  rx="8"
                  fill="rgba(0,0,0,0.8)"
                  stroke="#10b981"
                  strokeWidth="1"
                />
                <text 
                  x="60" 
                  y="-12" 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="white"
                  fontWeight="500"
                >
                  {Math.round(breakEvenPoint)} unidades
                </text>
                <text 
                  x="60" 
                  y="0" 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#10b981"
                  fontWeight="600"
                >
                  ${Math.round(bepRevenue).toLocaleString()}
                </text>
              </g>
            </g>
          )}
          
          <line 
            x1={padding} 
            y1={height - padding} 
            x2={width - padding} 
            y2={height - padding} 
            stroke="#374151" 
            strokeWidth="2" 
          />
          <line 
            x1={padding} 
            y1={padding} 
            x2={padding} 
            y2={height - padding} 
            stroke="#374151" 
            strokeWidth="2" 
          />
          
          <text 
            x={width / 2} 
            y={height - 10} 
            textAnchor="middle" 
            fontSize="12" 
            fill="#374151"
            fontWeight="600"
          >
            📦 Unidades Vendidas
          </text>
          
          <text 
            x={20} 
            y={height / 2} 
            textAnchor="middle" 
            fontSize="12" 
            fill="#374151" 
            fontWeight="600"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            💰 Valor en Pesos ($)
          </text>
        </svg>
        
        {/* Summary cards - Fixed layout */}
        <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-xs text-blue-600 font-medium mb-1">Meta de Ventas</div>
            <div className="text-sm sm:text-base font-bold text-blue-700 leading-tight">
              ${Math.round(bepRevenue).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-xs text-green-600 font-medium mb-1">Productos a Vender</div>
            <div className="text-sm sm:text-base font-bold text-green-700 leading-tight">
              {Math.round(breakEvenPoint)} unidades
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-xs text-purple-600 font-medium mb-1">Por Día</div>
            <div className="text-sm sm:text-base font-bold text-purple-700 leading-tight">
              {Math.round(breakEvenPoint / 30)} unidades
            </div>
          </div>
        </div>
        
        {/* Explanation section - Fixed spacing */}
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">¿Qué significa esto? 🤔</h4>
          <div className="space-y-2 text-xs sm:text-sm text-gray-600">
            <p className="leading-relaxed">
              Cuando vendas <strong>{Math.round(breakEvenPoint)} productos al mes</strong>, tu negocio empezará 
              a ganar dinero. ¡Es tu meta mensual! 🎯
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="leading-tight">La línea azul muestra el dinero que ganas vendiendo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="leading-tight">La línea naranja muestra tus gastos totales</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="leading-tight">Donde se cruzan es tu punto de equilibrio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Chart.displayName = 'Chart';

export default function ChartWithErrorBoundary(props: ChartProps) {
  return (
    <ChartErrorBoundary>
      <Chart {...props} />
    </ChartErrorBoundary>
  );
}