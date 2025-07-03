import React, { useState } from 'react';
import { MessageSquare, ExternalLink, Copy, CheckCircle, Sparkles, Brain } from 'lucide-react';

interface GPTShareButtonProps {
  calculatorType: string;
  calculatorData: any;
  results: any;
}

const GPTShareButton = ({ calculatorType, calculatorData, results }: GPTShareButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'direct' | 'copy'>('direct');

  const generatePrompt = () => {
    const basePrompt = `Hola! Soy un joven emprendedor y acabo de completar un ejercicio financiero en mi calculadora. Me gustaría recibir tu guía y consejos personalizados.

📊 **TIPO DE ANÁLISIS:** ${getCalculatorName(calculatorType)}

📈 **MIS DATOS:**
${formatCalculatorData(calculatorType, calculatorData)}

🎯 **RESULTADOS OBTENIDOS:**
${formatResults(calculatorType, results)}

🤔 **LO QUE NECESITO:**
• Análisis de mis números y si están bien
• Consejos específicos para mejorar mi negocio
• Estrategias para optimizar mis resultados
• Próximos pasos recomendados
• Alertas sobre posibles riesgos

💡 **CONTEXTO ADICIONAL:**
Soy principiante en finanzas empresariales y busco aprender mientras desarrollo mi negocio. Me interesa entender no solo los números, sino también las estrategias prácticas que puedo implementar.

¿Podrías ayudarme con un análisis detallado y recomendaciones específicas para mi situación?`;

    return basePrompt;
  };

  const getCalculatorName = (type: string) => {
    const names = {
      'break-even': 'Punto de Equilibrio',
      'roi': 'Retorno de Inversión (ROI)',
      'unit-cost': 'Costo por Unidad',
      'profit': 'Análisis de Ganancias'
    };
    return names[type as keyof typeof names] || 'Análisis Financiero';
  };

  const formatCalculatorData = (type: string, data: any) => {
    switch (type) {
      case 'break-even':
        return `• Costos fijos mensuales: $${data.fixedCosts?.toLocaleString() || 'N/A'}
• Precio por unidad: $${data.pricePerUnit?.toLocaleString() || 'N/A'}
• Costo variable por unidad: $${data.variableCostPerUnit?.toLocaleString() || 'N/A'}`;

      case 'roi':
        return `• Inversión inicial: $${data.initialInvestment?.toLocaleString() || 'N/A'}
• Ganancia neta: $${data.netProfit?.toLocaleString() || 'N/A'}
• Período de tiempo: ${data.timeframe || 'N/A'} meses`;

      case 'unit-cost':
        return `• Volumen de producción: ${data.productionVolume?.toLocaleString() || 'N/A'} unidades
• Costos fijos totales: $${data.totalFixedCost?.toLocaleString() || 'N/A'}
• Costos variables totales: $${data.totalVariableCost?.toLocaleString() || 'N/A'}`;

      case 'profit':
        return `• Ingresos totales: $${data.totalRevenue?.toLocaleString() || 'N/A'}
• Costos totales: $${data.totalCosts?.toLocaleString() || 'N/A'}
• Precio de venta por unidad: $${data.salesPrice?.toLocaleString() || 'N/A'}
• Costo por unidad: $${data.unitCost?.toLocaleString() || 'N/A'}`;

      default:
        return '• Datos no disponibles';
    }
  };

  const formatResults = (type: string, results: any) => {
    switch (type) {
      case 'break-even':
        return `• Punto de equilibrio: ${results.breakEvenPoint?.toFixed(0) || 'N/A'} unidades/mes
• Margen de contribución: $${results.contributionMargin?.toFixed(2) || 'N/A'} por unidad
• Ratio de margen: ${results.contributionMarginRatio?.toFixed(1) || 'N/A'}%
• Meta diaria: ${results.breakEvenPoint ? (results.breakEvenPoint / 30).toFixed(0) : 'N/A'} unidades`;

      case 'roi':
        return `• ROI del período: ${results.roi?.toFixed(1) || 'N/A'}%
• ROI anualizado: ${results.annualizedRoi?.toFixed(1) || 'N/A'}%
• Período de recuperación: ${results.paybackPeriod?.toFixed(1) || 'N/A'} meses`;

      case 'unit-cost':
        return `• Costo por unidad: $${results.totalCostPerUnit?.toFixed(2) || 'N/A'}
• Costo fijo por unidad: $${results.fixedCostPerUnit?.toFixed(2) || 'N/A'}
• Costo variable por unidad: $${results.variableCostPerUnit?.toFixed(2) || 'N/A'}
• Precio sugerido de venta: $${results.totalCostPerUnit ? (results.totalCostPerUnit * 1.5).toFixed(2) : 'N/A'}`;

      case 'profit':
        return `• Ganancia bruta: $${results.grossProfit?.toLocaleString() || 'N/A'}
• Margen de ganancia: ${results.profitMargin?.toFixed(1) || 'N/A'}%
• Margen por unidad: ${results.unitProfitMargin?.toFixed(1) || 'N/A'}%
• Markup: ${results.markupPercentage?.toFixed(1) || 'N/A'}%`;

      default:
        return '• Resultados no disponibles';
    }
  };

  const handleCopyPrompt = async () => {
    const prompt = generatePrompt();
    try {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDirectShare = () => {
    const prompt = generatePrompt();
    const encodedPrompt = encodeURIComponent(prompt);
    const gptUrl = `https://chatgpt.com/g/g-3Ri2vU6gM-creative-entrepreneurship-educator?q=${encodedPrompt}`;
    window.open(gptUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 touch-target hover:scale-105 active:scale-95 shadow-lg"
        aria-label="Obtener guía personalizada de un experto en emprendimiento"
      >
        <Brain size={20} className="animate-pulse" />
        <span className="font-medium text-sm sm:text-base">Obtener Guía de Experto</span>
        <Sparkles size={16} className="animate-bounce" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Guía Personalizada de Experto</h3>
                    <p className="text-purple-100 text-sm">
                      Recibe consejos específicos para tu negocio
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Cerrar modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">
                      🎯 Creative Entrepreneurship Educator
                    </h4>
                    <p className="text-sm text-purple-700 leading-relaxed">
                      Un GPT especializado en emprendimiento creativo que te ayudará a analizar tus números, 
                      identificar oportunidades de mejora y crear estrategias específicas para hacer crecer tu negocio.
                    </p>
                  </div>
                </div>
              </div>

              {/* Method selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">¿Cómo quieres compartir tu análisis?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setShareMethod('direct')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      shareMethod === 'direct'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ExternalLink className={`h-5 w-5 ${shareMethod === 'direct' ? 'text-purple-600' : 'text-gray-500'}`} />
                      <span className="font-medium">Abrir directamente</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Se abrirá ChatGPT con tu información ya cargada
                    </p>
                  </button>

                  <button
                    onClick={() => setShareMethod('copy')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      shareMethod === 'copy'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Copy className={`h-5 w-5 ${shareMethod === 'copy' ? 'text-purple-600' : 'text-gray-500'}`} />
                      <span className="font-medium">Copiar mensaje</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Copia el texto y pégalo manualmente en ChatGPT
                    </p>
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Vista previa del mensaje:</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {generatePrompt().substring(0, 300)}...
                  </pre>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {shareMethod === 'direct' ? (
                  <button
                    onClick={handleDirectShare}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 touch-target"
                  >
                    <ExternalLink size={20} />
                    <span className="font-medium">Abrir ChatGPT con mi análisis</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCopyPrompt}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-target ${
                      isCopied
                        ? 'bg-green-600 text-white focus:ring-green-500'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white focus:ring-purple-500'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle size={20} />
                        <span className="font-medium">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        <span className="font-medium">Copiar mensaje completo</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 touch-target"
                >
                  Cancelar
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-full flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-1">💡 Consejos para obtener mejores resultados:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Sé específico sobre tu tipo de negocio y mercado</li>
                      <li>• Menciona cualquier desafío particular que enfrentes</li>
                      <li>• Pregunta sobre estrategias específicas para tu industria</li>
                      <li>• Solicita ejemplos prácticos y pasos concretos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GPTShareButton;