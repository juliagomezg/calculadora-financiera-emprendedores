import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calculator, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { useGoogleDriveAnalytics } from '../hooks/useGoogleDriveAnalytics';

interface AnalyticsData {
  totalSessions: number;
  totalCalculations: number;
  averageSessionTime: number;
  mostUsedCalculator: string;
  conversionRate: number;
  userFeedbackAverage: number;
  dailyActiveUsers: number;
}

const GoogleAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { getAnalyticsData, authenticateUser } = useGoogleDriveAnalytics();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalyticsData();
      
      // Process the data
      const sessions = data.sessions;
      const calculations = data.calculations;
      const feedback = data.feedback;

      const totalSessions = sessions.length;
      const totalCalculations = calculations.length;
      
      // Calculate average session time (assuming column 5 is timeSpent)
      const totalTime = sessions.reduce((acc, session) => acc + (parseInt(session[5]) || 0), 0);
      const averageSessionTime = totalSessions > 0 ? totalTime / totalSessions / 1000 / 60 : 0; // Convert to minutes

      // Most used calculator (assuming column 1 is calculatorType)
      const calculatorCounts = calculations.reduce((acc, calc) => {
        const type = calc[1] || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostUsedCalculator = Object.entries(calculatorCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      // Conversion rate (assuming column 5 is completedCalculation)
      const completedCalculations = calculations.filter(calc => calc[5] === 'true' || calc[5] === true).length;
      const conversionRate = totalSessions > 0 ? (completedCalculations / totalSessions) * 100 : 0;

      // Average feedback rating (assuming column 2 is rating)
      const ratings = feedback.map(f => parseInt(f[2]) || 0).filter(r => r > 0);
      const userFeedbackAverage = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      // Daily active users (unique sessions today)
      const today = new Date().toDateString();
      const todaySessions = sessions.filter(session => {
        const sessionDate = new Date(parseInt(session[1]) || 0).toDateString();
        return sessionDate === today;
      });
      const dailyActiveUsers = todaySessions.length;

      setAnalytics({
        totalSessions,
        totalCalculations,
        averageSessionTime,
        mostUsedCalculator,
        conversionRate,
        userFeedbackAverage,
        dailyActiveUsers
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const data = await getAnalyticsData();
      
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add sessions data
      csvContent += "SESIONES DE USUARIO\n";
      csvContent += "Session ID,Start Time,Last Activity,Page Views,Calculations,Time Spent,Device Info,Created At\n";
      data.sessions.forEach(row => {
        csvContent += row.join(",") + "\n";
      });
      
      csvContent += "\nUSO DE CALCULADORAS\n";
      csvContent += "Session ID,Calculator Type,Inputs,Results,Time Spent,Completed,Timestamp,Errors,Created At\n";
      data.calculations.forEach(row => {
        csvContent += row.join(",") + "\n";
      });

      // Download CSV
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const openGoogleSheets = () => {
    const spreadsheetId = localStorage.getItem('google_spreadsheet_id');
    if (spreadsheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics desde Google Drive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Drive Analytics</h1>
              <p className="text-gray-600">
                Datos almacenados en Google Sheets
                {lastUpdated && (
                  <span className="ml-2 text-sm">
                    • Última actualización: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                Actualizar
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Exportar CSV
              </button>
              <button
                onClick={openGoogleSheets}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <BarChart3 size={16} />
                Ver en Google Sheets
              </button>
            </div>
          </div>
        </div>

        {/* Main Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Sesiones"
              value={analytics.totalSessions}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              subtitle="Usuarios únicos"
              color="blue"
            />
            <MetricCard
              title="Total de Cálculos"
              value={analytics.totalCalculations}
              icon={<Calculator className="h-6 w-6 text-green-600" />}
              subtitle="Cálculos realizados"
              color="green"
            />
            <MetricCard
              title="Tiempo Promedio"
              value={`${analytics.averageSessionTime.toFixed(1)}m`}
              icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
              subtitle="Por sesión"
              color="orange"
            />
            <MetricCard
              title="Tasa de Conversión"
              value={`${analytics.conversionRate.toFixed(1)}%`}
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              subtitle="Cálculos completados"
              color="purple"
            />
          </div>
        )}

        {/* Additional Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculadora Más Usada</h3>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.mostUsedCalculator}</p>
                  <p className="text-sm text-gray-600">Más popular</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfacción del Usuario</h3>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.userFeedbackAverage.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-gray-600">Calificación promedio</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuarios Activos Hoy</h3>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.dailyActiveUsers}</p>
                  <p className="text-sm text-gray-600">Sesiones hoy</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Sheets Integration Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Integración con Google Sheets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Hojas de datos disponibles:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>UserSessions:</strong> Sesiones de usuario y tiempo de uso</li>
                <li>• <strong>CalculatorUsage:</strong> Uso detallado de calculadoras</li>
                <li>• <strong>UserBehaviors:</strong> Comportamiento y navegación</li>
                <li>• <strong>UserFeedback:</strong> Comentarios y calificaciones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Ventajas de Google Sheets:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Gratis:</strong> Sin costos de base de datos</li>
                <li>• <strong>Accesible:</strong> Desde cualquier dispositivo</li>
                <li>• <strong>Colaborativo:</strong> Comparte con tu equipo</li>
                <li>• <strong>Flexible:</strong> Crea gráficas y reportes personalizados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const MetricCard = ({ title, value, icon, subtitle, color }: MetricCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default GoogleAnalyticsDashboard;