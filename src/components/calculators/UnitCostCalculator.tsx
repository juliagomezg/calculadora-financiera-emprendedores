import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Store, Package, Calculator, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import InputField from '../ui/InputField';
import InteractiveChart from '../ui/InteractiveChart';
import MetricTooltip from '../ui/MetricTooltip';
import GPTShareButton from '../ui/GPTShareButton';
import PDFDownloadButton from '../ui/PDFDownloadButton';


interface CostItem {
  id: string;
  name: string;
  cost: number;
  type: 'fixed' | 'variable';
}

const UnitCostCalculator = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [productionVolume, setProductionVolume] = useState(50);
  const [costs, setCosts] = useState<CostItem[]>([
    { id: '1', name: 'Chaquiras y cuentas', cost: 200, type: 'variable' },
    { id: '2', name: 'Hilo elástico', cost: 100, type: 'variable' },
    { id: '3', name: 'Mesa de trabajo', cost: 300, type: 'fixed' },
    { id: '4', name: 'Publicidad', cost: 100, type: 'fixed' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState(0);
  const [newItemType, setNewItemType] = useState<'fixed' | 'variable'>('variable');
  
  const [totalFixedCost, setTotalFixedCost] = useState(0);
  const [totalVariableCost, setTotalVariableCost] = useState(0);
  const [fixedCostPerUnit, setFixedCostPerUnit] = useState(0);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(0);
  const [totalCostPerUnit, setTotalCostPerUnit] = useState(0);
  
  // Simple local tracking (no external dependencies)
  
  useEffect(() => {
    let fixedSum = 0;
    let variableSum = 0;
    
    costs.forEach(item => {
      if (item.type === 'fixed') {
        fixedSum += item.cost;
      } else {
        variableSum += item.cost;
      }
    });
    
    setTotalFixedCost(fixedSum);
    setTotalVariableCost(variableSum);
    
        if (productionVolume > 0) {
      const fixedPerUnit = fixedSum / productionVolume;
      const variablePerUnit = variableSum / productionVolume;
      const totalPerUnit = fixedPerUnit + variablePerUnit;
      
      setFixedCostPerUnit(fixedPerUnit);
      setVariableCostPerUnit(variablePerUnit);
      setTotalCostPerUnit(totalPerUnit);
    } else {
      setFixedCostPerUnit(0);
      setVariableCostPerUnit(0);
      setTotalCostPerUnit(0);
    }
  }, [costs, productionVolume]);
  
  const addCostItem = () => {
    if (newItemName.trim() && newItemCost > 0) {
      const newItem: CostItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        cost: newItemCost,
        type: newItemType
      };
      
      setCosts([...costs, newItem]);
      setNewItemName('');
      setNewItemCost(0);
    }
  };
  
  const removeCostItem = (id: string) => {
    setCosts(costs.filter(item => item.id !== id));
  };
  
  const updateCostItem = (id: string, field: keyof CostItem, value: string | number) => {
    setCosts(costs.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const getCostBreakdownData = () => {
    return [
      {
        label: 'Costos Fijos',
        value: fixedCostPerUnit,
        target: totalCostPerUnit,
        color: '#f59e0b',
        icon: <Store size={16} />
      },
      {
        label: 'Costos Variables',
        value: variableCostPerUnit,
        target: totalCostPerUnit,
        color: '#3b82f6',
        icon: <Package size={16} />
      },
      {
        label: 'Costo Total',
        value: totalCostPerUnit,
        target: totalCostPerUnit * 1.5, // Suggested selling price
        color: '#8b5cf6',
        icon: <Calculator size={16} />
      }
    ];
  };

  const getEfficiencyData = () => {
    const efficiency = productionVolume > 0 ? Math.min(100, (100 / productionVolume) * 50) : 0;
    const costOptimization = totalCostPerUnit > 0 ? Math.min(100, (50 / totalCostPerUnit) * 100) : 0;
    const scalability = Math.min(100, productionVolume * 2);
    
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
        value: costOptimization,
        target: 100,
        color: '#f59e0b',
        icon: <MetricTooltip metric="Optimización" percentage={costOptimization}>
          <DollarSign size={20} />
        </MetricTooltip>
      },
      {
        label: 'Escalabilidad',
        value: scalability,
        target: 100,
        color: '#8b5cf6',
        icon: <MetricTooltip metric="Escalabilidad" percentage={scalability}>
          <TrendingUp size={20} />
        </MetricTooltip>
      }
    ];
  };

  // Datos para compartir con el GPT
  const calculatorData = {
    productionVolume,
    costs,
    totalFixedCost,
    totalVariableCost
  };

  const results = {
    totalCostPerUnit,
    fixedCostPerUnit,
    variableCostPerUnit
  };

  const TutorialExample = () => (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Store className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
        <h3 className="font-medium text-sm sm:text-base text-yellow-800">Ejemplo: Tu Negocio de Pulseras 🌈</h3>
      </div>
      
      <div className="space-y-4 text-sm sm:text-base text-gray-700">
        <p>¡Hola! Vamos a ver cuánto cuesta hacer pulseras de chaquira para vender:</p>
        
        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Gastos que pagas una sola vez:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Mesa de trabajo: $300</li>
            <li>Publicidad en carteles: $100</li>
            <li><strong>Total de gastos fijos: $400</strong></li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-3 sm:p-4 space-y-2">
          <h4 className="font-medium">Lo que gastas por cada 50 pulseras:</h4>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
            <li>Chaquiras y cuentas: $200</li>
            <li>Hilo elástico: $100</li>
            <li><strong>Total de materiales: $300</strong></li>
          </ul>
        </div>

        <div className="bg-yellow-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm">
            Si haces 50 pulseras, cada una te cuesta <strong>${totalCostPerUnit.toFixed(2)}</strong> 
            ¡Ahora puedes decidir a qué precio venderlas para ganar dinero! 💰
          </p>
        </div>

        <button
          onClick={() => setShowTutorial(false)}
          className="w-full mt-4 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base"
        >
          ¡Entendido! Quiero calcular mi propio negocio
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <span className="text-2xl">🏷️</span>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">¿Cuánto Me Cuesta?</h2>
            <p className="text-sm text-yellow-600 font-medium">📚 Concepto: Costo Unitario y Estructura de Costos</p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 px-3 py-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <Store size={16} />
            <span className="text-xs sm:text-sm">Ver ejemplo</span>
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          🌱 <strong>Nivel Fácil</strong> • ¡Vamos a calcular cuánto gastas en hacer cada producto!
        </p>
      </div>

      {showTutorial && <TutorialExample />}
      
      <div className="calculator-grid">
        <div className="calculator-form space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-yellow-600" />
              <h3 className="font-medium text-sm sm:text-base text-yellow-800">¿Cuántos productos vas a hacer?</h3>
            </div>
            
            <InputField
              label="Número de productos"
              value={productionVolume}
              onChange={(e) => setProductionVolume(Number(e.target.value))}
              type="number"
              min={1}
            />
            <p className="text-xs text-gray-500 mt-1">
              La cantidad de productos que planeas hacer
            </p>
          </div>
          
          <div className="bg-white border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm sm:text-base text-gray-800">Lista de Gastos</h3>
              <div className="flex items-center space-x-1 text-xs">
                <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-500">Una sola vez</span>
                <span className="inline-block w-3 h-3 bg-blue-400 rounded-full ml-2"></span>
                <span className="text-gray-500">Por producto</span>
              </div>
            </div>
            
            <div className="max-h-48 sm:max-h-60 overflow-y-auto mb-4 -mx-4 px-4">
              {costs.length > 0 ? (
                <table className="w-full">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left">¿Qué compraste?</th>
                      <th className="px-2 sm:px-3 py-2 text-right">¿Cuánto costó?</th>
                      <th className="px-2 sm:px-3 py-2 text-center">Tipo</th>
                      <th className="px-2 sm:px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {costs.map(item => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-2 sm:px-3 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateCostItem(item.id, 'name', e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-xs sm:text-sm hover:bg-gray-50 rounded px-1"
                          />
                        </td>
                        <td className="px-2 sm:px-3 py-2">
                          <div className="flex items-center justify-end">
                            <span className="text-gray-500 mr-1">$</span>
                            <input
                              type="number"
                              value={item.cost}
                              onChange={(e) => updateCostItem(item.id, 'cost', Number(e.target.value))}
                              className="w-16 sm:w-20 bg-transparent border-none focus:ring-0 p-0 text-right text-xs sm:text-sm hover:bg-gray-50 rounded px-1"
                              min={0}
                            />
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-center">
                          <select
                            value={item.type}
                            onChange={(e) => updateCostItem(item.id, 'type', e.target.value as 'fixed' | 'variable')}
                            className="bg-transparent border-none text-xs rounded p-0 focus:ring-0 hover:bg-gray-50"
                          >
                            <option value="fixed">Una vez</option>
                            <option value="variable">Por producto</option>
                          </select>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-right">
                          <button 
                            onClick={() => removeCostItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                          >
                            <MinusCircle size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
                  ¡Agrega tus gastos aquí!
                </p>
              )}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="¿Qué compraste?"
                  className="w-full sm:w-auto flex-1 border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 text-xs sm:text-sm"
                />
                
                <div className="flex items-center w-full sm:w-auto">
                  <span className="text-gray-500 mr-1">$</span>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    placeholder="Precio"
                    className="w-full sm:w-20 border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 text-xs sm:text-sm"
                    min={0}
                  />
                </div>
                
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value as 'fixed' | 'variable')}
                  className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-200 text-xs sm:text-sm"
                >
                  <option value="fixed">Una vez</option>
                  <option value="variable">Por producto</option>
                </select>
                
                <button 
                  onClick={addCostItem}
                  className="w-full sm:w-auto text-yellow-600 hover:text-yellow-700 flex items-center justify-center gap-1 py-2 sm:py-0 hover:bg-yellow-50 rounded-lg px-2 transition-colors"
                  disabled={!newItemName || newItemCost <= 0}
                >
                  <PlusCircle size={20} />
                  <span className="sm:hidden">Agregar gasto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="calculator-results space-y-6">
          <div className="bg-white border-2 border-yellow-100 rounded-lg p-4 sm:p-6">
            <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-6 text-center">El Costo de tu Producto</h3>
            
            <div className="space-y-6">
              <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg border border-yellow-200 overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <dt className="text-xs sm:text-sm font-medium text-gray-500">Cada producto te cuesta</dt>
                      <dd className="mt-1 text-2xl sm:text-3xl font-bold text-yellow-600">
                        ${totalCostPerUnit.toFixed(2)}
                      </dd>
                      <div className="mt-2 text-xs text-gray-500">
                        Precio sugerido de venta: <span className="font-semibold text-green-600">
                          ${(totalCostPerUnit * 1.5).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
                <div className="w-full h-4 bg-gray-200 relative overflow-hidden">
                  {totalCostPerUnit > 0 && (
                    <>
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000 ease-out" 
                        style={{
                          width: `${(fixedCostPerUnit / totalCostPerUnit) * 100}%`,
                          float: 'left'
                        }}
                      ></div>
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000 ease-out" 
                        style={{
                          width: `${(variableCostPerUnit / totalCostPerUnit) * 100}%`,
                          float: 'left'
                        }}
                      ></div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg hover-lift">
                  <h4 className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">Gastos fijos</h4>
                  <p className="text-xl sm:text-2xl font-medium text-gray-900">${fixedCostPerUnit.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">por producto</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-3">
                    Total: ${totalFixedCost.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg hover-lift">
                  <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-1">Gastos por producto</h4>
                  <p className="text-xl sm:text-2xl font-medium text-gray-900">${variableCostPerUnit.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">por producto</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-3">
                    Total: ${totalVariableCost.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">¿Qué significa esto? 🤔</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Cada producto que haces te cuesta ${totalCostPerUnit.toFixed(2)}. Este precio incluye:
                </p>
                <ul className="text-xs sm:text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                  <li>${fixedCostPerUnit.toFixed(2)} de gastos que pagas una sola vez</li>
                  <li>${variableCostPerUnit.toFixed(2)} de materiales y gastos por producto</li>
                </ul>
                <p className="text-xs sm:text-sm font-medium text-yellow-800 mt-4">
                  💡 Consejo: Para ganar dinero, debes vender cada producto a más de ${totalCostPerUnit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <InteractiveChart
            data={getCostBreakdownData()}
            title="Desglose de Costos"
            type="progress"
          />
        </div>
      </div>

      {/* Efficiency Metrics with Tooltips */}
      <InteractiveChart
        data={getEfficiencyData()}
        title="Métricas de Eficiencia"
        type="circular"
      />

      {/* GPT Share Section */}
      {totalCostPerUnit > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              🎯 ¿Quieres optimizar tus costos?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Descarga tu reporte personalizado o comparte tu análisis con un experto en emprendimiento.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PDFDownloadButton
              calculatorType="unit-cost"
              inputs={calculatorData}
              results={results}
              className="w-full sm:w-auto"
            >
              📄 Descargar Reporte PDF
            </PDFDownloadButton>
            
            <GPTShareButton 
              calculatorType="unit-cost"
              calculatorData={calculatorData}
              results={results}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitCostCalculator;