import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calculator, TrendingUp, Eye, Clock, Star, MessageSquare } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AnalyticsData {
  totalSessions: number;
  totalCalculations: number;
  averageSessionTime: number;
  mostUsedCalculator: string;
  conversionRate: number;
  userFeedbackAverage: number;
  dailyActiveUsers: number;
  topCountries: Array<{ country: string; count: number }>;
}

interface RealtimeMetrics {
  activeUsers: number;
  calculationsLastHour: number;
  newSessionsToday: number;
}

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [realtime, setRealtime] = useState<RealtimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Check if Supabase is configured before attempting to fetch data
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    fetchAnalytics();
    fetchRealtimeMetrics();
    
    // Update realtime metrics every 30 seconds
    const interval = setInterval(fetchRealtimeMetrics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchAnalytics = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      // Fetch sessions data
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('startTime', startDate.getTime())
        .lte('startTime', endDate.getTime());

      // Fetch calculator usage data
      const { data: calculations } = await supabase
        .from('calculator_usage')
        .select('*')
        .gte('timestamp', startDate.getTime())
        .lte('timestamp', endDate.getTime());

      // Fetch feedback data
      const { data: feedback } = await supabase
        .from('user_feedback')
        .select('rating')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      // Process data
      const totalSessions = sessions?.length || 0;
      const totalCalculations = calculations?.length || 0;
      const averageSessionTime = sessions?.reduce((acc, session) => acc + (session.timeSpent || 0), 0) / totalSessions || 0;
      
      // Most used calculator
      const calculatorCounts = calculations?.reduce((acc, calc) => {
        acc[calc.calculatorType] = (acc[calc.calculatorType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      const mostUsedCalculator = Object.entries(calculatorCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      // Conversion rate (completed calculations / total sessions)
      const completedCalculations = calculations?.filter(calc => calc.completedCalculation).length || 0;
      const conversionRate = totalSessions > 0 ? (completedCalculations / totalSessions) * 100 : 0;

      // Average feedback rating
      const averageRating = feedback?.reduce((acc, f) => acc + f.rating, 0) / (feedback?.length || 1) || 0;

      // Daily active users (unique sessions per day)
      const uniqueSessionsToday = new Set(
        sessions?.filter(session => {
          const sessionDate = new Date(session.startTime);
          const today = new Date();
          return sessionDate.toDateString() === today.toDateString();
        }).map(session => session.sessionId)
      ).size;

      setAnalytics({
        totalSessions,
        totalCalculations,
        averageSessionTime: averageSessionTime / 1000 / 60, // Convert to minutes
        mostUsedCalculator,
        conversionRate,
        userFeedbackAverage: averageRating,
        dailyActiveUsers: uniqueSessionsToday,
        topCountries: [], // Would need geolocation data
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeMetrics = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Active users (sessions with activity in last 30 minutes)
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      const { data: activeSessions } = await supabase
        .from('user_sessions')
        .select('sessionId')
        .gte('lastActivity', thirtyMinutesAgo.getTime());

      // Calculations in last hour
      const { data: recentCalculations } = await supabase
        .from('calculator_usage')
        .select('*')
        .gte('timestamp', oneHourAgo.getTime());

      // New sessions today
      const { data: todaySessions } = await supabase
        .from('user_sessions')
        .select('sessionId')
        .gte('startTime', todayStart.getTime());

      setRealtime({
        activeUsers: activeSessions?.length || 0,
        calculationsLastHour: recentCalculations?.length || 0,
        newSessionsToday: todaySessions?.length || 0,
      });

    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
    }
  };

  // Show configuration message if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Configuración Requerida
            </h2>
            <p className="text-yellow-700 mb-4">
              Para ver el dashboard de analytics, necesitas configurar Supabase primero.
            </p>
            <div className="text-left text-sm text-yellow-600">
              <p className="mb-2">Pasos:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Crea un proyecto en Supabase</li>
                <li>Obtén tu URL y clave anónima</li>
                <li>Actualiza el archivo .env con tus credenciales</li>
                <li>Reinicia el servidor de desarrollo</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Analytics</h1>
          <p className="text-gray-600">Monitoreo en tiempo real del comportamiento de usuarios</p>
          
          {/* Time range selector */}
          <div className="mt-4 flex gap-2">
            {[
              { value: '24h', label: 'Últimas 24h' },
              { value: '7d', label: 'Últimos 7 días' },
              { value: '30d', label: 'Últimos 30 días' },
              { value: '90d', label: 'Últimos 90 días' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Realtime Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Usuarios Activos"
            value={realtime?.activeUsers || 0}
            icon={<Eye className="h-6 w-6 text-green-600" />}
            subtitle="En los últimos 30 minutos"
            color="green"
          />
          <MetricCard
            title="Cálculos por Hora"
            value={realtime?.calculationsLastHour || 0}
            icon={<Calculator className="h-6 w-6 text-blue-600" />}
            subtitle="En la última hora"
            color="blue"
          />
          <MetricCard
            title="Nuevas Sesiones"
            value={realtime?.newSessionsToday || 0}
            icon={<Users className="h-6 w-6 text-purple-600" />}
            subtitle="Hoy"
            color="purple"
          />
        </div>

        {/* Main Analytics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Sesiones"
              value={analytics.totalSessions}
              icon={<Users className="h-6 w-6 text-blue-600" />}
              subtitle={`En ${timeRange}`}
              color="blue"
            />
            <MetricCard
              title="Total de Cálculos"
              value={analytics.totalCalculations}
              icon={<Calculator className="h-6 w-6 text-green-600" />}
              subtitle={`En ${timeRange}`}
              color="green"
            />
            <MetricCard
              title="Tiempo Promedio"
              value={`${analytics.averageSessionTime.toFixed(1)}m`}
              icon={<Clock className="h-6 w-6 text-orange-600" />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculadora Más Usada</h3>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
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
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.userFeedbackAverage.toFixed(1)}/5
                  </p>
                  <p className="text-sm text-gray-600">Calificación promedio</p>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default AdminDashboard;