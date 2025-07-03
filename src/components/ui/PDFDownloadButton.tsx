import React, { useState } from 'react';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';

interface PDFDownloadButtonProps {
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  calculatorType,
  inputs,
  results,
  className = '',
  variant = 'primary',
  size = 'md',
  showIcon = true,
  children
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      await generatePDF({
        calculatorType,
        inputs,
        results,
        timestamp: new Date()
      });

      setIsSuccess(true);
      
      // Resetear estado de éxito después de 2 segundos
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Estilos base
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variantes de estilo
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
  };

  // Tamaños
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Iconos según el estado
  const getIcon = () => {
    if (isGenerating) return <Loader2 size={20} className="animate-spin" />;
    if (isSuccess) return <CheckCircle size={20} className="text-green-200" />;
    return <Download size={20} />;
  };

  // Texto según el estado
  const getText = () => {
    if (isGenerating) return 'Generando PDF...';
    if (isSuccess) return '¡PDF Descargado!';
    return children || 'Descargar PDF';
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      type="button"
      aria-label="Descargar reporte en PDF"
    >
      {showIcon && getIcon()}
      <span>{getText()}</span>
      {!showIcon && <FileText size={16} className="ml-1 opacity-75" />}
    </button>
  );
};

export default PDFDownloadButton; 