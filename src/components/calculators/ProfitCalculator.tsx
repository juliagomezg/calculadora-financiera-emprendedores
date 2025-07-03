import React, { useState, useEffect } from 'react';
import { DollarSign, Store, Calculator, TrendingUp, TrendingDown, Target, Percent } from 'lucide-react';
import InputField from '../ui/InputField';
import InteractiveChart from '../ui/InteractiveChart';
import MetricTooltip from '../ui/MetricTooltip';
import GPTShareButton from '../ui/GPTShareButton';
import PDFDownloadButton from '../ui/PDFDownloadButton';


const ProfitCalculator = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(1000);
  const [totalCosts, setTotalCosts] = useState(600);
  const [salesPrice, setSalesPrice] = useState(20);
  const [unitCost, setUnitCost] = useState(12);
  
  const [grossProfit, setGrossProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [unitProfitMargin, setUnitProfitMargin] = useState(0);
  const [markupPercentage, setMarkupPercentage] = useState(0);
  
  // Simple local tracking (no external dependencies)
  
  useEffect(() => {
    // Calculate gross profit
    const profit = totalRevenue - totalCosts;
    setGrossProfit(profit);
    
    // Calculate profit margin
    let margin = 0;
    if (totalRevenue > 0) {
      margin = (profit / totalRevenue) * 100;
      setProfitMargin(margin);
    } else {
      setProfitMargin(0);
    }
    
    // Calculate unit profit margin
    let unitMargin = 0;
    if (salesPrice > 0) {
      unitMargin = ((salesPrice - unitCost) / salesPrice) * 100;
      setUnitProfitMargin(unitMargin);
    } else {
      setUnitProfitMargin(0);
    }
    
    // Calculate markup percentage
    let markup = 0;
    if (unitCost > 0) {
      markup = ((salesPrice - unitCost) / unitCost) * 100;
      setMarkupPercentage(markup);
    } else {
      setMarkupPercentage(0);
    }
  }, [totalRevenue, totalCosts, salesPrice, unitCost]);
  
  const getEmoji = (value: number) => {
    if (value < 0) return '😢';
    if (value < 15) return '🤔';
    if (value < 25) return '😊';
    if (value < 35) return '🌟';
    return '🚀';
  };

  const getProfitAnalysisData = () => {
    return [
      {
        label: 'Margen de Ganancia',
        value: Math.max(0, profitMargin),
        target: 30,
        color: '#10b981',
        icon: <Percent size={16} />
      },
      {
        label: 'Markup',
        value: Math.max(0, markupPercentage),
        target: 50,
        color: '#3b82f6',
        icon: <TrendingUp size={16} />
      },
      {
        label: 'Ganancia por Unidad',
        value: Math.max(0, unitProfitMargin),
        target: 40,
        color: '#8b5cf6',
        icon: <DollarSign size={16} />
      }
    ];
  };

  const getPerformanceData = () => {
    const efficiency = Math.min(100, Math.max(0, profitMargin * 2));
    const competitiveness = Math.min(100, Math.max(0, (markupPercentage / 100) * 100));
    const sustainability = Math.min(100, Math.max(0, (grossProfit / totalRevenue) * 200));
    
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
        value: competitiveness,
        target: 100,
        color: '#f59e0b',
        icon: <MetricTooltip metric="Optimización" percentage={competitiveness}>
          <Target size={20} />
        </MetricTooltip>
      },
      {
        label: 'Escalabilidad',
        value: sustainability,
        target: 100,
        color: '#8b5cf6',
        icon: <MetricTooltip metric="Escalabilidad" percentage={sustainability}>
          <Store size={20} />
        </MetricTooltip>
      }
    ];
  };

  // Datos para compartir con el GPT
  const calculatorData = {
    totalRevenue,
    totalCosts,
    salesPrice,
    unitCost
  };

  const results = {
    grossProfit,
    profitMargin,
    unitProfitMargin,
    markupPercentage
  };
  
  const TutorialExample = () => (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Store className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
        <h3 className="font-medium text-sm sm:text-base text-purple-800">Ejemplo: Venta de Pulseras 🌈</h3>
      </div>
      
      <div className="space-y-4 text-sm sm:text-base text-gray-700">
        <p>¡Sigamos con nuestro negocio de pulseras! Veamos cuánto dinero podemos ganar:</p>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Este mes vendiste:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>50 pulseras a $20 cada una</li>
            <li>Total de ventas: $1,000</li>
            <li>Gastos totales: $600</li>
            <li><strong>¡Ganancia: $400! 🎉</strong></li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Por cada pulsera:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Precio de venta: $20</li>
            <li>Costo de materiales: $12</li>
            <li><strong>Ganancia por pulsera: $8 💰</strong></li>
          </ul>
        </div>

        <div className="bg-purple-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm">
            ¡Felicidades! Tu negocio está ganando dinero. Por cada $100 que vendes, 
            te quedas con ${profitMargin.toFixed(0)} de ganancia. 🌟
          </p>
        </div>

        <button
          onClick={() => setShowTutorial(false)}
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
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
          <span className="text-2xl">💰</span>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">¿Cuánto Gano?</h2>
            <p className="text-sm text-purple-600 font-medium">📚 Concepto: Utilidad y Margen de Ganancia</p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <Store size={16} />
            <span className="text-xs sm:text-sm">Ver ejemplo</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          🌱 <strong>Nivel Fácil</strong> • ¡Descubre si tu negocio está ganando o perdiendo dinero!
        </p>
      </div>

      {showTutorial && <TutorialExample />}
      
      <div className="calculator-grid">
        <div className="calculator-form space-y-6">
          <div className="bg-purple-50 p-4 sm:p-6 rounded-lg border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-sm sm:text-base text-purple-800">Tu Negocio Este Mes</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto dinero ganaste en total?"
                  value={totalRevenue}
                  onChange={(e) => setTotalRevenue(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Todo el dinero que recibiste por tus ventas
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto gastaste en total?"
                  value={totalCosts}
                  onChange={(e) => setTotalCosts(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suma todos tus gastos del mes
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 sm:p-6 rounded-lg border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-sm sm:text-base text-purple-800">Por Cada Producto</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿A qué precio vendes cada uno?"
                  value={salesPrice}
                  onChange={(e) => setSalesPrice(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El precio que pagan tus clientes
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                <InputField
                  label="¿Cuánto te cuesta hacer cada uno?"
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value))}
                  prefix="$"
                  type="number"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lo que gastas en materiales y trabajo
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="calculator-results space-y-6">
          <div className="bg-white border-2 border-purple-100 rounded-lg p-4 sm:p-6">
            <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-6 text-center">Resultados</h3>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg shadow-lg p-4 sm:p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm sm:text-base text-gray-700 font-medium">¡Tu Ganancia Total!</h4>
                  <span className={`text-xl sm:text-2xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${grossProfit.toFixed(2)} {getEmoji(grossProfit)}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${grossProfit >= 0 ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
                    style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-3">
                  Este es el dinero extra que te queda después de pagar todo
                </p>
                
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-pink-100/20 opacity-50"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg hover-lift">
                  <h4 className="text-xs sm:text-sm font-medium text-purple-800 mb-1">Por cada $100</h4>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    ${profitMargin.toFixed(0)} {getEmoji(profitMargin)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">te quedan de ganancia</p>
                </div>
                
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg hover-lift">
                  <h4 className="text-xs sm:text-sm font-medium text-purple-800 mb-1">Por producto</h4>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                    ${(salesPrice - unitCost).toFixed(2)} {getEmoji(unitProfitMargin)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ganas en cada venta</p>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">¿Cómo te está yendo? 🤔</h4>
                
                {profitMargin < 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-red-600">
                      ¡Ups! Estás perdiendo dinero. Vamos a mejorar esto:
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-600 list-disc list-inside">
                      <li>Intenta vender a un precio más alto</li>
                      <li>Busca materiales más baratos</li>
                      <li>Reduce otros gastos</li>
                    </ul>
                  </div>
                ) : profitMargin < 15 ? (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-orange-600">
                      Estás ganando un poco. ¡Podemos mejorar!
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-600 list-disc list-inside">
                      <li>Prueba subir un poco el precio</li>
                      <li>Busca formas de reducir gastos</li>
                    </ul>
                  </div>
                ) : profitMargin < 35 ? (
                  <p className="text-xs sm:text-sm text-green-600">
                    ¡Muy bien! Tu negocio está ganando dinero de forma saludable. 
                    Sigue así y verás crecer tus ganancias. 🌱
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-emerald-600">
                    ¡Increíble! 🌟 Eres todo un empresario exitoso. Tus ganancias son 
                    excelentes. ¡Sigue con el gran trabajo!
                  </p>
                )}
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-purple-800">
                    <strong>Consejo del día:</strong> {
                      markupPercentage > 0 
                        ? `Estás vendiendo tus productos ${markupPercentage.toFixed(0)}% más caro de lo que te cuestan. 
                           ${markupPercentage < 50 ? '¡Podrías subir un poco el precio!' : '¡Excelente margen!'}`
                        : 'Necesitas vender a un precio mayor que tu costo para ganar dinero.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profit Analysis Chart */}
          <InteractiveChart
            data={getProfitAnalysisData()}
            title="Análisis de Rentabilidad"
            type="progress"
          />
        </div>
      </div>

      {/* Performance Metrics with Tooltips */}
      <InteractiveChart
        data={getPerformanceData()}
        title="Métricas de Rendimiento"
        type="circular"
      />

      {/* GPT Share Section */}
      {grossProfit !== 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              💰 ¿Quieres maximizar tus ganancias?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Descarga tu reporte personalizado o comparte tu análisis de rentabilidad con un experto en emprendimiento.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PDFDownloadButton
              calculatorType="profit"
              inputs={calculatorData}
              results={results}
              className="w-full sm:w-auto"
            >
              📄 Descargar Reporte PDF
            </PDFDownloadButton>
            
            <GPTShareButton 
              calculatorType="profit"
              calculatorData={calculatorData}
              results={results}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfitCalculator;