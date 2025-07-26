import React, { useState, useEffect } from 'react';
import { AlertCircle, Store, Package, Building2, BookOpen } from 'lucide-react';
import InputField from '../ui/InputField';
import Chart from '../ui/Chart';
import InteractiveChart from '../ui/InteractiveChart';
import GPTShareButton from '../ui/GPTShareButton';
import PDFDownloadButton from '../ui/PDFDownloadButton';
const BreakEvenCalculator = () => {
  const [fixedCosts, setFixedCosts] = useState(8000);
  const [pricePerUnit, setPricePerUnit] = useState(25);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(15);
  const [showTutorial, setShowTutorial] = useState(false);
  const [breakEvenPoint, setBreakEvenPoint] = useState(0);
  const [contributionMargin, setContributionMargin] = useState(0);
  const [contributionMarginRatio, setContributionMarginRatio] = useState(0);
  
  // Simple local tracking (no external dependencies)
  
  useEffect(() => {
    // Validar que los valores sean seguros
    const safeFixedCosts = Math.min(Math.max(fixedCosts || 0, 0), 10000000);
    const safePricePerUnit = Math.min(Math.max(pricePerUnit || 0, 0), 1000000);
    const safeVariableCostPerUnit = Math.min(Math.max(variableCostPerUnit || 0, 0), 1000000);
    
    const margin = safePricePerUnit - safeVariableCostPerUnit;
    setContributionMargin(margin);
    
    const ratio = safePricePerUnit > 0 ? (margin / safePricePerUnit * 100) : 0;
    setContributionMarginRatio(isFinite(ratio) ? ratio : 0);
    
    if (margin > 0 && isFinite(margin)) {
      const calculatedBreakEven = safeFixedCosts / margin;
      setBreakEvenPoint(isFinite(calculatedBreakEven) ? Math.min(calculatedBreakEven, 1000000) : 0);
    } else {
      setBreakEvenPoint(0);
    }

    // Simple calculation updates
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);

  const generateChartData = () => {
    const data = [];
    
    // Protección contra números muy grandes
    const safeBreakEvenPoint = Math.min(breakEvenPoint, 100000);
    const maxUnits = Math.min(safeBreakEvenPoint * 2, 200000);
    const step = Math.max(maxUnits / 10, 1);
    
    // Validar que los cálculos sean seguros
    if (!isFinite(maxUnits) || !isFinite(step) || maxUnits <= 0) {
      return [
        { units: 0, revenue: 0, totalCost: fixedCosts, profit: -fixedCosts },
        { units: 100, revenue: 100 * pricePerUnit, totalCost: fixedCosts + (100 * variableCostPerUnit), profit: (100 * pricePerUnit) - (fixedCosts + (100 * variableCostPerUnit)) }
      ];
    }
    
    for (let i = 0; i <= maxUnits; i += step) {
      const revenue = i * pricePerUnit;
      const totalCost = fixedCosts + (i * variableCostPerUnit);
      const profit = revenue - totalCost;
      
      // Validar que los valores no sean infinitos
      if (isFinite(revenue) && isFinite(totalCost) && isFinite(profit)) {
        data.push({ units: i, revenue, totalCost, profit });
      }
    }
    
    return data.length > 0 ? data : [
      { units: 0, revenue: 0, totalCost: fixedCosts, profit: -fixedCosts }
    ];
  };

  const getProgressData = () => {
    const dailyTarget = breakEvenPoint / 30;
    const weeklyTarget = breakEvenPoint / 4;
    
    return [
      {
        label: 'Meta Diaria',
        value: dailyTarget,
        target: dailyTarget,
        color: '#3b82f6',
        icon: <Package size={16} />
      },
      {
        label: 'Meta Semanal',
        value: weeklyTarget,
        target: weeklyTarget,
        color: '#10b981',
        icon: <Store size={16} />
      },
      {
        label: 'Meta Mensual',
        value: breakEvenPoint,
        target: breakEvenPoint,
        color: '#8b5cf6',
        icon: <Building2 size={16} />
      }
    ];
  };

  // Datos para compartir con el GPT
  const calculatorData = {
    fixedCosts,
    pricePerUnit,
    variableCostPerUnit
  };

  const results = {
    breakEvenPoint,
    contributionMargin,
    contributionMarginRatio
  };

  const TutorialExample = () => (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
        <h3 className="font-medium text-sm sm:text-base text-blue-800">Ejemplo: Tu Papelería "El Lápiz Mágico" 📚</h3>
      </div>
      
      <div className="space-y-4 text-sm sm:text-base text-gray-700">
        <p>¡Hola! Vamos a ayudarte a entender tu negocio con un ejemplo real. Imagina que tienes una papelería:</p>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Gastos Fijos Mensuales:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Renta del local: $5,000</li>
            <li>Luz y agua: $1,000</li>
            <li>Internet: $500</li>
            <li>Salario de ayudante: $1,500</li>
            <li><strong>Total: $8,000</strong></li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Por cada cuaderno que vendes:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Precio de venta: $25</li>
            <li>Costo del cuaderno: $15 (lo que te cuesta comprarlo)</li>
            <li><strong>Ganancia por cuaderno: $10</strong></li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm">
            Con estos números, necesitas vender <strong>{breakEvenPoint.toFixed(0)} cuadernos al mes</strong> para 
            cubrir todos tus gastos. ¡Eso es aproximadamente {(breakEvenPoint / 30).toFixed(0)} cuadernos por día!
          </p>
        </div>

        <button
          onClick={() => setShowTutorial(false)}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          ¡Entendido! Quiero calcular mi propio negocio
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12 overflow-hidden">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <span className="text-2xl">⚖️</span>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">¿Cuándo No Pierdo?</h2>
            <p className="text-sm text-blue-600 font-medium">📚 Concepto: Punto de Equilibrio (Break-Even)</p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <BookOpen size={16} />
            <span className="text-xs sm:text-sm">Ver ejemplo</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          🌿 <strong>Nivel Intermedio</strong> • ¡Vamos a descubrir cuánto necesitas vender para que tu negocio sea exitoso!
        </p>
      </div>

      {showTutorial && <TutorialExample />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="calculator-form order-1">
          <div className="bg-blue-50 p-6 sm:p-8 rounded-lg border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-sm sm:text-base text-blue-800">Datos de tu Negocio</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto gastas en total cada mes?"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Math.min(Number(e.target.value), 10000000))}
                  prefix="$"
                  type="number"
                  min={0}
                  max={10000000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suma todo: renta, luz, agua, internet, sueldos, etc.
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿A qué precio vendes cada producto?"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Math.min(Number(e.target.value), 1000000))}
                  prefix="$"
                  type="number"
                  min={0}
                  max={1000000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El precio que tus clientes pagan
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto te cuesta cada producto?"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(Math.min(Number(e.target.value), 1000000))}
                  prefix="$"
                  type="number"
                  min={0}
                  max={1000000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lo que pagas por cada producto antes de venderlo
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-2 border-blue-100 rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-sm sm:text-base text-gray-800">Resultados</h3>
            </div>
            
            {contributionMargin <= 0 ? (
              <div className="flex items-start gap-2 p-3 sm:p-4 bg-red-50 rounded-lg text-red-700">
                <AlertCircle size={20} />
                <p className="text-xs sm:text-sm">
                  ¡Cuidado! Estás vendiendo más barato de lo que te cuesta. 
                  Sube el precio o busca productos más baratos.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <ResultCard 
                  label="Necesitas vender" 
                  value={`${breakEvenPoint.toFixed(0)} productos al mes`}
                  description={`Eso son ${(breakEvenPoint / 30).toFixed(0)} productos cada día`}
                />
                
                <ResultCard 
                  label="Ventas necesarias" 
                  value={`$${(breakEvenPoint * pricePerUnit).toFixed(2)}`}
                  description="El dinero que necesitas hacer en ventas" 
                />
                
                <ResultCard 
                  label="Ganas por producto" 
                  value={`$${contributionMargin.toFixed(2)}`}
                  description="Tu ganancia por cada venta" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="calculator-results order-2">
          <div className="chart-analysis-container">
            <h3 className="font-medium text-base sm:text-lg text-gray-800 mb-6 sm:mb-8 text-center leading-relaxed">Tu Camino al Éxito</h3>
            
            {contributionMargin <= 0 ? (
              <div className="h-60 sm:h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 text-center">
                  Ajusta los números para ver tu camino al éxito
                </p>
              </div>
            ) : (
              <Chart 
                data={generateChartData()} 
                breakEvenPoint={breakEvenPoint}
              />
            )}
          </div>

          {/* Interactive Progress Chart */}
          {contributionMargin > 0 && (
            <InteractiveChart
              data={getProgressData()}
              title="Tus Metas de Venta"
              type="progress"
            />
          )}
        </div>
      </div>

      {/* GPT Share Section */}
      {contributionMargin > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              🎯 ¿Quieres llevar tu negocio al siguiente nivel?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Descarga tu reporte personalizado o comparte tu análisis con un experto en emprendimiento.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PDFDownloadButton
              calculatorType="break-even"
              inputs={calculatorData}
              results={results}
              className="w-full sm:w-auto"
            >
              📄 Descargar Reporte PDF
            </PDFDownloadButton>
            
            <GPTShareButton 
              calculatorType="break-even"
              calculatorData={calculatorData}
              results={results}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ResultCardProps {
  label: string;
  value: string;
  description: string;
}

const ResultCard = ({ label, value, description }: ResultCardProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-5 break-words overflow-hidden">
      <div className="flex justify-between items-start mb-2 sm:mb-3 gap-3">
        <span className="text-sm text-gray-700 flex-1">{label}</span>
        <span className="font-medium text-blue-600 text-base sm:text-lg text-right">{value}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
};

export default BreakEvenCalculator;