import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, TrendingUp, Target, Lightbulb } from 'lucide-react';

interface MetricTooltipProps {
  metric: string;
  percentage: number;
  children: React.ReactNode;
}

const MetricTooltip = ({ metric, percentage, children }: MetricTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: true, left: 'center' });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringTooltip = useRef(false);

  // Cleanup function
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return cleanup; // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const updatePosition = () => {
        const triggerRect = triggerRef.current?.getBoundingClientRect();
        if (!triggerRect) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Determinar posición horizontal con márgenes más generosos
        let horizontalPosition = 'center';
        const tooltipWidth = viewportWidth < 640 ? 256 : viewportWidth < 768 ? 288 : 320; // w-64, w-72, w-80
        const margin = 16; // Margen de seguridad
        
        if (triggerRect.left + tooltipWidth / 2 > viewportWidth - margin) {
          horizontalPosition = 'right';
        } else if (triggerRect.left - tooltipWidth / 2 < margin) {
          horizontalPosition = 'left';
        }
        
        // Determinar posición vertical con mejor detección
        let verticalPosition = true; // true = abajo, false = arriba
        const tooltipHeight = 350; // Altura aproximada más conservadora
        
        if (triggerRect.bottom + tooltipHeight > viewportHeight - margin) {
          verticalPosition = false;
        }
        
        setPosition({ top: verticalPosition, left: horizontalPosition });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isVisible]);

  const getMetricInfo = (metric: string, percentage: number) => {
    const metricLower = metric.toLowerCase();
    
    switch (metricLower) {
      case 'eficiencia':
        return {
          title: 'Eficiencia Operativa',
          description: 'Mide qué tan bien aprovechas tus recursos para generar ganancias.',
          meaning: percentage >= 80 
            ? 'Excelente: Estás usando muy bien tus recursos'
            : percentage >= 60 
            ? 'Bueno: Hay oportunidades de mejora'
            : percentage >= 40
            ? 'Regular: Necesitas optimizar procesos'
            : 'Bajo: Requiere atención inmediata',
          tips: percentage >= 80 
            ? ['Mantén tus procesos actuales', 'Busca nuevas oportunidades de crecimiento', 'Comparte tus mejores prácticas']
            : percentage >= 60
            ? ['Automatiza tareas repetitivas', 'Reduce desperdicios en materiales', 'Mejora la planificación de inventario']
            : percentage >= 40
            ? ['Revisa tus procesos de producción', 'Capacita a tu equipo', 'Elimina actividades que no agregan valor']
            : ['Analiza todos tus gastos', 'Renegocia con proveedores', 'Considera cambiar tu modelo de negocio'],
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };

      case 'escalabilidad':
        return {
          title: 'Capacidad de Escalabilidad',
          description: 'Indica qué tan fácil es hacer crecer tu negocio sin aumentar proporcionalmente los costos.',
          meaning: percentage >= 80 
            ? 'Excelente: Tu negocio puede crecer fácilmente'
            : percentage >= 60 
            ? 'Bueno: Tienes potencial de crecimiento'
            : percentage >= 40
            ? 'Regular: Crecimiento limitado'
            : 'Bajo: Difícil de escalar',
          tips: percentage >= 80 
            ? ['Busca nuevos mercados', 'Desarrolla productos complementarios', 'Considera franquicias o licencias']
            : percentage >= 60
            ? ['Invierte en tecnología', 'Estandariza tus procesos', 'Desarrolla un equipo sólido']
            : percentage >= 40
            ? ['Reduce dependencia de tu tiempo personal', 'Crea sistemas y procedimientos', 'Busca socios estratégicos']
            : ['Simplifica tu modelo de negocio', 'Enfócate en productos más rentables', 'Considera subcontratar'],
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };

      case 'optimización':
        return {
          title: 'Nivel de Optimización',
          description: 'Evalúa qué tan optimizados están tus costos y procesos para maximizar ganancias.',
          meaning: percentage >= 80 
            ? 'Excelente: Costos muy bien optimizados'
            : percentage >= 60 
            ? 'Bueno: Optimización aceptable'
            : percentage >= 40
            ? 'Regular: Necesitas optimizar más'
            : 'Bajo: Muchas oportunidades de mejora',
          tips: percentage >= 80 
            ? ['Mantén el control de costos', 'Busca proveedores premium que agreguen valor', 'Invierte en calidad']
            : percentage >= 60
            ? ['Negocia mejores precios con proveedores', 'Reduce gastos innecesarios', 'Mejora la gestión de inventario']
            : percentage >= 40
            ? ['Compara precios de diferentes proveedores', 'Elimina gastos que no generan valor', 'Optimiza el uso de recursos']
            : ['Revisa todos tus gastos detalladamente', 'Busca alternativas más económicas', 'Considera hacer algunas tareas tú mismo'],
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };

      default:
        return {
          title: 'Métrica de Rendimiento',
          description: 'Indicador de desempeño de tu negocio.',
          meaning: 'Información no disponible',
          tips: ['Consulta con un experto para más detalles'],
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const metricInfo = getMetricInfo(metric, percentage);

  const getTooltipStyles = () => {
    const baseStyles = "absolute z-50 w-64 sm:w-72 md:w-80 max-w-[90vw] p-3 sm:p-4 lg:p-5";
    
    let positionStyles = "";
    let transformStyles = "";
    
    if (position.top) {
      positionStyles += "top-full mt-2 ";
    } else {
      positionStyles += "bottom-full mb-2 ";
    }
    
    switch (position.left) {
      case 'left':
        positionStyles += "left-0 ";
        break;
      case 'right':
        positionStyles += "right-0 ";
        break;
      default:
        positionStyles += "left-1/2 ";
        transformStyles = "-translate-x-1/2";
    }
    
    return `${baseStyles} ${positionStyles} ${transformStyles}`;
  };

  const getArrowStyles = () => {
    let arrowStyles = "absolute w-3 h-3 sm:w-4 sm:h-4";
    
    if (position.top) {
      arrowStyles += " -top-1.5 sm:-top-2 border-l-2 border-t-2 rotate-45";
    } else {
      arrowStyles += " -bottom-1.5 sm:-bottom-2 border-r-2 border-b-2 rotate-45";
    }
    
    switch (position.left) {
      case 'left':
        arrowStyles += " left-6";
        break;
      case 'right':
        arrowStyles += " right-6";
        break;
      default:
        arrowStyles += " left-1/2 transform -translate-x-1/2";
    }
    
    return arrowStyles;
  };

  const showTooltip = () => {
    cleanup();
    setIsVisible(true);
  };

  const hideTooltip = () => {
    cleanup();
    if (!isHoveringTooltip.current) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 150);
    }
  };

  const handleMouseEnter = () => {
    showTooltip();
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleTooltipMouseEnter = () => {
    cleanup();
    isHoveringTooltip.current = true;
  };

  const handleTooltipMouseLeave = () => {
    isHoveringTooltip.current = false;
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsVisible(!isVisible);
    }
  };

  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  return (
    <div className="relative inline-block overflow-visible">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="cursor-help touch-target"
        tabIndex={0}
        role="button"
        aria-label={`Información sobre ${metric}`}
        aria-expanded={isVisible}
        aria-describedby={isVisible ? `tooltip-${metric}` : undefined}
      >
        {children}
      </div>

      {isVisible && (
        <>
          {/* Overlay para cerrar en móvil */}
          <div 
            className="fixed inset-0 z-[50] bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={() => setIsVisible(false)}
            aria-hidden="true"
          />
          
          <div 
            ref={tooltipRef}
            id={`tooltip-${metric}`}
            className={`${getTooltipStyles()} ${metricInfo.bgColor} border-2 ${metricInfo.borderColor} rounded-xl shadow-2xl animate-fade-in`}
            role="tooltip"
            aria-live="polite"
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            
            {/* Arrow pointing to trigger */}
            <div className={`${getArrowStyles()} ${metricInfo.bgColor} ${metricInfo.borderColor}`}></div>
            
            {/* Close button for mobile */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 sm:hidden p-1 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              aria-label="Cerrar información"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header */}
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 pr-8 sm:pr-0">
              <div className={`p-1.5 sm:p-2 ${metricInfo.bgColor} rounded-lg border ${metricInfo.borderColor} flex-shrink-0`}>
                <HelpCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${metricInfo.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`font-bold text-sm sm:text-base ${metricInfo.color} leading-tight`}>
                  {metricInfo.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {percentage.toFixed(1)}% - {metricInfo.meaning}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {metricInfo.description}
              </p>
            </div>

            {/* Performance indicator */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Nivel actual</span>
                <span className={`text-xs font-bold ${metricInfo.color}`}>
                  {percentage >= 80 ? 'Excelente' : 
                   percentage >= 60 ? 'Bueno' : 
                   percentage >= 40 ? 'Regular' : 'Necesita mejora'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    percentage >= 80 ? 'bg-green-500' :
                    percentage >= 60 ? 'bg-yellow-500' :
                    percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Tips section */}
            <div className="border-t border-gray-200 pt-3 sm:pt-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  💡 Tips para mejorar:
                </span>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                {metricInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                    <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action button */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <button 
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 ${metricInfo.color.replace('text-', 'bg-').replace('-600', '-100')} ${metricInfo.color} rounded-lg hover:${metricInfo.color.replace('text-', 'bg-').replace('-600', '-200')} transition-colors text-xs sm:text-sm font-medium touch-target`}
                onClick={() => setIsVisible(false)}
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                Entendido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MetricTooltip;