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
    const margin = pricePerUnit - variableCostPerUnit;
    setContributionMargin(margin);
    const ratio = margin / pricePerUnit * 100;
    setContributionMarginRatio(ratio);
    if (margin > 0) {
      const calculatedBreakEven = fixedCosts / margin;
      setBreakEvenPoint(calculatedBreakEven);
    } else {
      setBreakEvenPoint(0);
    }

    // Simple calculation updates
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);

  const generateChartData = () => {
    const data = [];
    const maxUnits = breakEvenPoint * 2;
    const step = maxUnits / 10;
    
    for (let i = 0; i <= maxUnits; i += step) {
      const revenue = i * pricePerUnit;
      const totalCost = fixedCosts + (i * variableCostPerUnit);
      const profit = revenue - totalCost;
      data.push({ units: i, revenue, totalCost, profit });
    }
    return data;
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
                  onChange={(e) => setFixedCosts(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suma todo: renta, luz, agua, internet, sueldos, etc.
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿A qué precio vendes cada producto?"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El precio que tus clientes pagan
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto te cuesta cada producto?"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
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
              <>
                <div className="h-60 sm:h-80 mb-4 sm:mb-6">
                  <Chart 
                    data={generateChartData()} 
                    breakEvenPoint={breakEvenPoint}
                  />
                </div>
                
                <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200 clear-both">
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-4 sm:mb-5">¿Qué significa esto? 🤔</h4>
                  <div className="space-y-4 sm:space-y-5">
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
                      Cuando vendas {breakEvenPoint.toFixed(0)} productos al mes, tu negocio empezará 
                      a ganar dinero. ¡Es tu meta mensual! 🎯
                    </p>
                    <div className="text-sm sm:text-base text-gray-600 space-y-2 sm:space-y-3">
                      <p className="break-words">• La línea azul muestra el dinero que ganas vendiendo</p>
                      <p className="break-words">• La línea naranja muestra tus gastos totales</p>
                      <p className="break-words">• Donde se cruzan es tu punto de equilibrio</p>
                    </div>
                  </div>
                </div>
              </>
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