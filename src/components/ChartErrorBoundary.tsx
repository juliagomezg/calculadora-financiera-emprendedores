import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ChartErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ChartErrorFallback({ error, resetErrorBoundary }: ChartErrorFallbackProps) {
  return (
    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Error en la gráfica
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          No pudimos mostrar la gráfica. Verifica tus datos e intenta de nuevo.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-xs text-gray-500">
              Error details
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

interface ChartErrorBoundaryProps {
  children: React.ReactNode;
}

export default function ChartErrorBoundary({ children }: ChartErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ChartErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Chart error:', error, errorInfo);
        // Track chart errors in analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: `Chart Error: ${error.message}`,
            fatal: false
          });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}