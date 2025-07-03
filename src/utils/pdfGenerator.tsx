import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    color: '#4b5563',
    flex: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  highlight: {
    backgroundColor: '#dbeafe',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  highlightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
  },
  recommendation: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#0284c7',
    lineHeight: 1.4,
  },
});

interface PDFData {
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
}

// Componente del documento PDF
const FinancialReportDocument = ({ data }: { data: PDFData }) => {
  const getCalculatorName = (type: string) => {
    const names = {
      'break-even': 'Punto de Equilibrio',
      'roi': 'Retorno de Inversión (ROI)',
      'unit-cost': 'Costo por Unidad',
      'profit': 'Análisis de Ganancias'
    };
    return names[type as keyof typeof names] || 'Análisis Financiero';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  const getRecommendations = (type: string, results: any) => {
    switch (type) {
      case 'break-even':
        const dailyTarget = Math.ceil(results.breakEvenPoint / 30);
        return [
          `Necesitas vender ${Math.ceil(results.breakEvenPoint)} unidades al mes para no perder dinero.`,
          `Tu meta diaria es de ${dailyTarget} unidades.`,
          `Cada unidad te deja ${formatCurrency(results.contributionMargin)} de ganancia.`,
          results.contributionMarginRatio < 30 
            ? 'Considera aumentar el precio o reducir costos variables.' 
            : 'Tu margen de contribución es saludable.'
        ];
      case 'roi':
        return [
          `Tu inversión se recuperará en ${results.paybackPeriod?.toFixed(1)} meses.`,
          results.annualizedRoi > 20 
            ? '¡Excelente retorno de inversión!' 
            : 'Considera estrategias para mejorar la rentabilidad.',
          `ROI anualizado: ${results.annualizedRoi?.toFixed(1)}%`,
        ];
      case 'unit-cost':
        const suggestedPrice = results.totalCostPerUnit * 1.5;
        return [
          `Costo por unidad: ${formatCurrency(results.totalCostPerUnit)}`,
          `Precio sugerido de venta: ${formatCurrency(suggestedPrice)}`,
          'Si produces más unidades, el costo fijo por unidad será menor.',
        ];
      case 'profit':
        const returnOnInvestment = results.totalCosts > 0 ? (results.grossProfit / results.totalCosts) : 0;
        return [
          `Margen de ganancia: ${results.profitMargin?.toFixed(1)}%`,
          results.profitMargin > 25 ? '¡Excelente rentabilidad!' : 'Busca formas de optimizar costos.',
          `Ganancia por cada peso de costo: $${returnOnInvestment.toFixed(2)}`,
        ];
      default:
        return ['Análisis completado exitosamente.'];
    }
  };

  const renderInputs = () => {
    const { inputs, calculatorType } = data;
    
    switch (calculatorType) {
      case 'break-even':
        return [
          <View key="fixed" style={styles.row}>
            <Text style={styles.label}>Costos fijos mensuales:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.fixedCosts || 0)}</Text>
          </View>,
          <View key="price" style={styles.row}>
            <Text style={styles.label}>Precio por unidad:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.pricePerUnit || 0)}</Text>
          </View>,
          <View key="variable" style={styles.row}>
            <Text style={styles.label}>Costo variable por unidad:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.variableCostPerUnit || 0)}</Text>
          </View>
        ];
      case 'roi':
        return [
          <View key="investment" style={styles.row}>
            <Text style={styles.label}>Inversión inicial:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.initialInvestment || 0)}</Text>
          </View>,
          <View key="profit" style={styles.row}>
            <Text style={styles.label}>Ganancia neta:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.netProfit || 0)}</Text>
          </View>,
          <View key="timeframe" style={styles.row}>
            <Text style={styles.label}>Período de tiempo:</Text>
            <Text style={styles.value}>{inputs.timeframe || 0} meses</Text>
          </View>
        ];
      case 'unit-cost':
        return [
          <View key="volume" style={styles.row}>
            <Text style={styles.label}>Volumen de producción:</Text>
            <Text style={styles.value}>{inputs.productionVolume || 0} unidades</Text>
          </View>,
          <View key="fixed" style={styles.row}>
            <Text style={styles.label}>Costos fijos totales:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.totalFixedCost || 0)}</Text>
          </View>,
          <View key="variable" style={styles.row}>
            <Text style={styles.label}>Costos variables totales:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.totalVariableCost || 0)}</Text>
          </View>
        ];
      case 'profit':
        return [
          <View key="revenue" style={styles.row}>
            <Text style={styles.label}>Ingresos totales:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.totalRevenue || 0)}</Text>
          </View>,
          <View key="costs" style={styles.row}>
            <Text style={styles.label}>Costos totales:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.totalCosts || 0)}</Text>
          </View>,
          <View key="salesPrice" style={styles.row}>
            <Text style={styles.label}>Precio de venta por unidad:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.salesPrice || 0)}</Text>
          </View>,
          <View key="unitCost" style={styles.row}>
            <Text style={styles.label}>Costo por unidad:</Text>
            <Text style={styles.value}>{formatCurrency(inputs.unitCost || 0)}</Text>
          </View>
        ];
      default:
        return null;
    }
  };

  const renderResults = () => {
    const { results, calculatorType } = data;
    
    switch (calculatorType) {
      case 'break-even':
        return [
          <View key="highlight" style={styles.highlight}>
            <Text style={styles.highlightText}>
              Punto de Equilibrio: {Math.ceil(results.breakEvenPoint || 0)} unidades/mes
            </Text>
          </View>,
          <View key="margin" style={styles.row}>
            <Text style={styles.label}>Margen de contribución:</Text>
            <Text style={styles.value}>{formatCurrency(results.contributionMargin || 0)} por unidad</Text>
          </View>,
          <View key="ratio" style={styles.row}>
            <Text style={styles.label}>Ratio de margen:</Text>
            <Text style={styles.value}>{results.contributionMarginRatio?.toFixed(1) || 0}%</Text>
          </View>,
          <View key="daily" style={styles.row}>
            <Text style={styles.label}>Meta diaria:</Text>
            <Text style={styles.value}>{Math.ceil((results.breakEvenPoint || 0) / 30)} unidades</Text>
          </View>
        ];
      case 'roi':
        return [
          <View key="highlight" style={styles.highlight}>
            <Text style={styles.highlightText}>
              ROI Anualizado: {results.annualizedRoi?.toFixed(1) || 0}%
            </Text>
          </View>,
          <View key="period" style={styles.row}>
            <Text style={styles.label}>ROI del período:</Text>
            <Text style={styles.value}>{results.roi?.toFixed(1) || 0}%</Text>
          </View>,
          <View key="payback" style={styles.row}>
            <Text style={styles.label}>Período de recuperación:</Text>
            <Text style={styles.value}>{results.paybackPeriod?.toFixed(1) || 0} meses</Text>
          </View>
        ];
      case 'unit-cost':
        return [
          <View key="highlight" style={styles.highlight}>
            <Text style={styles.highlightText}>
              Costo por Unidad: {formatCurrency(results.totalCostPerUnit || 0)}
            </Text>
          </View>,
          <View key="fixed" style={styles.row}>
            <Text style={styles.label}>Costo fijo por unidad:</Text>
            <Text style={styles.value}>{formatCurrency(results.fixedCostPerUnit || 0)}</Text>
          </View>,
          <View key="variable" style={styles.row}>
            <Text style={styles.label}>Costo variable por unidad:</Text>
            <Text style={styles.value}>{formatCurrency(results.variableCostPerUnit || 0)}</Text>
          </View>,
          <View key="suggested" style={styles.row}>
            <Text style={styles.label}>Precio sugerido de venta:</Text>
            <Text style={styles.value}>{formatCurrency((results.totalCostPerUnit || 0) * 1.5)}</Text>
          </View>
        ];
      case 'profit':
        return [
          <View key="highlight" style={styles.highlight}>
            <Text style={styles.highlightText}>
              Ganancia Bruta: {formatCurrency(results.grossProfit || 0)}
            </Text>
          </View>,
          <View key="margin" style={styles.row}>
            <Text style={styles.label}>Margen de ganancia:</Text>
            <Text style={styles.value}>{results.profitMargin?.toFixed(1) || 0}%</Text>
          </View>,
          <View key="unitMargin" style={styles.row}>
            <Text style={styles.label}>Margen por unidad:</Text>
            <Text style={styles.value}>{results.unitProfitMargin?.toFixed(1) || 0}%</Text>
          </View>,
          <View key="markup" style={styles.row}>
            <Text style={styles.label}>Markup:</Text>
            <Text style={styles.value}>{results.markupPercentage?.toFixed(1) || 0}%</Text>
          </View>
        ];
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 Reporte Financiero</Text>
          <Text style={styles.subtitle}>
            {getCalculatorName(data.calculatorType)}
          </Text>
          <Text style={styles.subtitle}>
            Generado el {data.timestamp.toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Datos Ingresados</Text>
          {renderInputs()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Resultados del Análisis</Text>
          {renderResults()}
        </View>

        <View style={styles.recommendation}>
          <Text style={styles.recommendationTitle}>💡 Recomendaciones</Text>
          {getRecommendations(data.calculatorType, data.results).map((rec, index) => (
            <Text key={index} style={styles.recommendationText}>
              • {rec}
            </Text>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>📱 Calculadora Financiera para Jóvenes Emprendedores</Text>
          <Text>Hecho con ❤️ por Julia Gómez</Text>
        </View>
      </Page>
    </Document>
  );
};

// Función para generar y descargar PDF
export const generatePDF = async (data: PDFData): Promise<void> => {
  try {
    const doc = <FinancialReportDocument data={data} />;
    const blob = await pdf(doc).toBlob();
    
    // Crear URL para descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${data.calculatorType}-${Date.now()}.pdf`;
    
    // Simular click para descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw new Error('No se pudo generar el PDF');
  }
};

// Componente React para botón de descarga
export const PDFDownloadButton = ({ 
  data, 
  children, 
  className = '' 
}: { 
  data: PDFData; 
  children: React.ReactNode; 
  className?: string;
}) => {
  const handleDownload = () => {
    generatePDF(data);
  };

  return (
    <button
      onClick={handleDownload}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default FinancialReportDocument; 