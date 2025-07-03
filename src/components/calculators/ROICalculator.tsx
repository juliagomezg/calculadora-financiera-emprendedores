import React, { useState, useEffect } from 'react';
import { TrendingUp, Coins, Timer, Store, Target, DollarSign } from 'lucide-react';
import InputField from '../ui/InputField';
import Slider from '../ui/Slider';
import InteractiveChart from '../ui/InteractiveChart';
import MetricTooltip from '../ui/MetricTooltip';
import GPTShareButton from '../ui/GPTShareButton';
import PDFDownloadButton from '../ui/PDFDownloadButton';


const ROICalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(500);
  const [netProfit, setNetProfit] = useState(200);
  const [timeframe, setTimeframe] = useState(1); // months
  const [showTutorial, setShowTutorial] = useState(false);
  const [roi, setRoi] = useState(0);
  const [annualizedRoi, setAnnualizedRoi] = useState(0);
  const [paybackPeriod, setPaybackPeriod] = useState(0);
  
  // Simple local tracking (no external dependencies)
  
  useEffect(() => {
    if (initialInvestment > 0) {
      const calculatedRoi = (netProfit / initialInvestment) * 100;
      setRoi(calculatedRoi);
      
      const annualized = (Math.pow(1 + (calculatedRoi / 100), 12 / timeframe) - 1) * 100;
      setAnnualizedRoi(annualized);
      
      if (netProfit > 0) {
        const payback = (initialInvestment / netProfit) * timeframe;
        setPaybackPeriod(payback);
      } else {
        setPaybackPeriod(0);
      }
    } else {
      setRoi(0);
      setAnnualizedRoi(0);
      setPaybackPeriod(0);
    }
  }, [initialInvestment, netProfit, timeframe]);
  
  const getRoiRating = () => {
    if (annualizedRoi < 0) return { text: "¡Ups! Estás perdiendo dinero", color: "text-red-600", emoji: "😢" };
    if (annualizedRoi < 10) return { text: "Puedes mejorar", color: "text-orange-600", emoji: "🤔" };
    if (annualizedRoi < 20) return { text: "¡Vas bien!", color: "text-yellow-600", emoji: "😊" };
    if (annualizedRoi < 50) return { text: "¡Excelente!", color: "text-green-600", emoji: "🌟" };
    return { text: "¡Increíble!", color: "text-emerald-600", emoji: "🚀" };
  };
  
  const rating = getRoiRating();

  const getROIProgressData = () => {
    const benchmarks = [
      { label: 'ROI Actual', value: Math.max(0, annualizedRoi), target: 50, color: '#10b981', icon: <TrendingUp size={16} /> },
      { label: 'Recuperación', value: paybackPeriod > 0 ? Math.max(0, 12 - paybackPeriod) : 0, target: 12, color: '#3b82f6', icon: <Timer size={16} /> },
      { label: 'Rentabilidad', value: Math.max(0, roi), target: 40, color: '#8b5cf6', icon: <DollarSign size={16} /> }
    ];
    
    return benchmarks;
  };

  const getCircularData = () => {
    const efficiency = Math.min(100, Math.max(0, (roi + 50) * 2));
    const competitiveness = Math.min(100, Math.max(0, annualizedRoi * 2));
    const scalability = paybackPeriod > 0 ? Math.min(100, (12 / paybackPeriod) * 100) : 0;
    
    return [
      {
        label: 'Eficiencia',
        value: efficiency,
        target: 100,
        color: '#10b981',
        icon: <MetricTooltip metric="Eficiencia" percentage={efficiency}>
          <TrendingUp size={20} />
        </MetricTooltip>
      },
      {
        label: 'Optimización',
        value: Math.max(0, annualizedRoi),
        target: 100,
        color: '#3b82f6',
        icon: <MetricTooltip metric="Optimización" percentage={Math.max(0, annualizedRoi)}>
          <Target size={20} />
        </MetricTooltip>
      },
      {
        label: 'Escalabilidad',
        value: scalability,
        target: 100,
        color: '#8b5cf6',
        icon: <MetricTooltip metric="Escalabilidad" percentage={scalability}>
          <Timer size={20} />
        </MetricTooltip>
      }
    ];
  };

  // Datos para compartir con el GPT
  const calculatorData = {
    initialInvestment,
    netProfit,
    timeframe
  };

  const results = {
    roi,
    annualizedRoi,
    paybackPeriod
  };

  const TutorialExample = () => (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Store className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
        <h3 className="font-medium text-sm sm:text-base text-green-800">Ejemplo: Tu Puesto de Limonada 🍋</h3>
      </div>
      
      <div className="space-y-4 text-sm sm:text-base text-gray-700">
        <p>¡Vamos a ver un ejemplo divertido! Imagina que quieres poner un puesto de limonada:</p>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Lo que necesitas comprar:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Mesa y sillas: $200</li>
            <li>Jarra y vasos: $150</li>
            <li>Hielera: $100</li>
            <li>Ingredientes para empezar: $50</li>
            <li><strong>Inversión total: $500</strong></li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Después de un mes:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Ventas totales: $700</li>
            <li>Gastos en ingredientes: $500</li>
            <li><strong>Ganancia: $200</strong></li>
          </ul>
        </div>

        <div className="bg-green-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm">
            ¡Tu dinero está creciendo! En este ejemplo, tu ROI es del {roi.toFixed(0)}%. 
            Esto significa que por cada $100 que invertiste, ganaste ${(roi/100 * 100).toFixed(0)} extra.
          </p>
        </div>

        <button
          onClick={() => setShowTutorial(false)}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
        >
          ¡Entendido! Quiero calcular mi negocio
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <span className="text-2xl">📈</span>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">¿Crece Mi Dinero?</h2>
            <p className="text-sm text-green-600 font-medium">📚 Concepto: ROI (Retorno de Inversión)</p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Store size={16} />
            <span className="text-xs sm:text-sm">Ver ejemplo</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          🌳 <strong>Nivel Avanzado</strong> • Descubre si tu negocio está haciendo crecer tu dinero
        </p>
      </div>

      {showTutorial && <TutorialExample />}
      
      <div className="calculator-grid">
        <div className="calculator-form space-y-6">
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg border-2 border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-sm sm:text-base text-green-800">Tu Inversión</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto dinero vas a invertir?"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Todo el dinero que necesitas para empezar
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto dinero extra ganaste?"
                  value={netProfit}
                  onChange={(e) => setNetProfit(Number(e.target.value))}
                  prefix="$"
                  type="number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El dinero que te quedó después de pagar todo
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿En cuánto tiempo?: {timeframe} {timeframe === 1 ? 'mes' : 'meses'}
                </label>
                <Slider 
                  min={1} 
                  max={12} 
                  value={timeframe} 
                  onChange={(value) => setTimeframe(value)} 
                  color="bg-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 mes</span>
                  <span>1 año</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6">
            <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-4">Más Detalles</h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg hover-lift">
                <span className="text-sm text-gray-700">¿Cuándo recuperas tu dinero?</span>
                <span className="font-medium text-sm sm:text-base text-gray-900">
                  {paybackPeriod > 0 ? `${paybackPeriod.toFixed(1)} meses` : "---"}
                </span>
              </div>
              
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg hover-lift">
                <span className="text-sm text-gray-700">ROI en este periodo</span>
                <span className="font-medium text-sm sm:text-base text-gray-900">{roi.toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg hover-lift">
                <span className="text-sm text-gray-700">¿Qué tal lo estás haciendo?</span>
                <span className={`font-medium text-sm sm:text-base ${rating.color}`}>
                  {rating.text} {rating.emoji}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="calculator-results space-y-6">
          {/* Circular ROI Display */}
          <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6">
            <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-6 text-center">Resultado Final</h3>
            
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <filter id="roiGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8" 
                />
                
                {annualizedRoi > 0 && (
                  <>
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="url(#roiGradient)" 
                      strokeWidth="8" 
                      strokeDasharray={`${Math.min(annualizedRoi, 100) * 2.83} 283`}
                      strokeDashoffset="70.75"
                      transform="rotate(-90 50 50)"
                      filter="url(#roiGlow)"
                      className="transition-all duration-1000 ease-out"
                    />
                    {annualizedRoi > 50 && (
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="35" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2" 
                        strokeDasharray="4 4"
                        opacity="0.5"
                        className="animate-spin"
                        style={{ animationDuration: '3s' }}
                      />
                    )}
                  </>
                )}
                
                <text 
                  x="50" 
                  y="42" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  fontSize="18" 
                  fontWeight="bold"
                  fill="#111827"
                >
                  {annualizedRoi.toFixed(0)}%
                </text>
                <text 
                  x="50" 
                  y="58" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  fontSize="10" 
                  fill="#6b7280"
                  fontWeight="600"
                >
                  ROI ANUAL
                </text>
                
                {/* Animated emoji based on performance */}
                <text 
                  x="50" 
                  y="75" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  fontSize="16"
                  className="animate-bounce"
                >
                  {rating.emoji}
                </text>
              </svg>
            </div>
            
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">¿Qué significa esto? 🤔</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Por cada $100 que invertiste en tu negocio, ganaste ${(roi/100 * 100).toFixed(0)} extra 
                {timeframe > 1 ? ` en ${timeframe} meses` : ' en un mes'}.
                {paybackPeriod > 0 ? ` Recuperarás todo tu dinero en ${paybackPeriod.toFixed(1)} meses.` : ''}
              </p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-green-800">
                  Consejo: {
                    roi < 0 ? "¡Busca formas de reducir tus gastos o aumentar tus ventas!" :
                    roi < 10 ? "Vas por buen camino. ¡Sigue mejorando!" :
                    roi < 30 ? "¡Excelente trabajo! Tu negocio está creciendo." :
                    "¡Increíble! Eres todo un empresario exitoso. 🌟"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Progress Charts */}
          <InteractiveChart
            data={getROIProgressData()}
            title="Análisis de Rendimiento"
            type="progress"
          />
        </div>
      </div>

      {/* Circular Performance Metrics with Tooltips */}
      <InteractiveChart
        data={getCircularData()}
        title="Métricas de Desempeño"
        type="circular"
      />

      {/* GPT Share Section */}
      {roi > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              💰 ¿Quieres maximizar tu ROI?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Descarga tu reporte personalizado o comparte tu análisis con un experto en emprendimiento.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PDFDownloadButton
              calculatorType="roi"
              inputs={calculatorData}
              results={results}
              className="w-full sm:w-auto"
            >
              📄 Descargar Reporte PDF
            </PDFDownloadButton>
            
            <GPTShareButton 
              calculatorType="roi"
              calculatorData={calculatorData}
              results={results}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ROICalculator;