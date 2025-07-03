import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calculator, Clock, Target, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  data?: Record<string, any>;
}

const UserInsights = () => {
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days

      // Fetch data for analysis
      const [sessionsResult, calculationsResult, feedbackResult, behaviorsResult] = await Promise.all([
        supabase
          .from('user_sessions')
          .select('*')
          .gte('startTime', startDate.getTime()),
        
        supabase
          .from('calculator_usage')
          .select('*')
          .gte('timestamp', startDate.getTime()),
        
        supabase
          .from('user_feedback')
          .select('*')
          .gte('timestamp', startDate.toISOString()),
        
        supabase
          .from('user_behaviors')
          .select('*')
          .gte('timestamp', startDate.getTime())
      ]);

      const sessions = sessionsResult.data || [];
      const calculations = calculationsResult.data || [];
      const feedback = feedbackResult.data || [];
      const behaviors = behaviorsResult.data || [];

      const generatedInsights: UserInsight[] = [];

      // Analyze session duration
      const avgSessionTime = sessions.reduce((acc, s) => acc + (s.timeSpent || 0), 0) / sessions.length / 1000 / 60;
      if (avgSessionTime < 2) {
        generatedInsights.push({
          id: 'short-sessions',
          title: 'Sesiones muy cortas detectadas',
          description: `El tiempo promedio de sesión es de ${avgSessionTime.toFixed(1)} minutos. Los usuarios podrían estar abandonando rápidamente.`,
          type: 'warning',
          priority: 'high',
          actionable: true,
          data: { avgSessionTime, sessionCount: sessions.length }
        });
      }

      // Analyze calculator completion rates
      const completionRate = calculations.filter(c => c.completedCalculation).length / calculations.length * 100;
      if (completionRate < 70) {
        generatedInsights.push({
          id: 'low-completion',
          title: 'Baja tasa de finalización de cálculos',
          description: `Solo el ${completionRate.toFixed(1)}% de los cálculos se completan. Considera simplificar el proceso.`,
          type: 'opportunity',
          priority: 'high',
          actionable: true,
          data: { completionRate, totalCalculations: calculations.length }
        });
      }

      // Analyze most popular calculator
      const calculatorCounts = calculations.reduce((acc, calc) => {
        acc[calc.calculatorType] = (acc[calc.calculatorType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostPopular = Object.entries(calculatorCounts).sort(([,a], [,b]) => b - a)[0];
      if (mostPopular) {
        generatedInsights.push({
          id: 'popular-calculator',
          title: `Calculadora "${mostPopular[0]}" es la más popular`,
          description: `Representa el ${((mostPopular[1] / calculations.length) * 100).toFixed(1)}% del uso total. Considera destacarla más.`,
          type: 'success',
          priority: 'medium',
          actionable: true,
          data: { calculator: mostPopular[0], usage: mostPopular[1], percentage: (mostPopular[1] / calculations.length) * 100 }
        });
      }

      // Analyze user feedback
      const avgRating = feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length;
      if (avgRating < 3.5) {
        generatedInsights.push({
          id: 'low-satisfaction',
          title: 'Satisfacción del usuario por debajo del promedio',
          description: `La calificación promedio es ${avgRating.toFixed(1)}/5. Revisa los comentarios para identificar áreas de mejora.`,
          type: 'warning',
          priority: 'high',
          actionable: true,
          data: { avgRating, feedbackCount: feedback.length }
        });
      } else if (avgRating > 4.5) {
        generatedInsights.push({
          id: 'high-satisfaction',
          title: '¡Excelente satisfacción del usuario!',
          description: `La calificación promedio es ${avgRating.toFixed(1)}/5. Los usuarios están muy satisfechos.`,
          type: 'success',
          priority: 'low',
          actionable: false,
          data: { avgRating, feedbackCount: feedback.length }
        });
      }

      // Analyze error patterns
      const errors = behaviors.filter(b => b.action === 'error');
      if (errors.length > 0) {
        const errorTypes = errors.reduce((acc, error) => {
          const errorMsg = error.metadata?.error || 'Unknown error';
          acc[errorMsg] = (acc[errorMsg] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostCommonError = Object.entries(errorTypes).sort(([,a], [,b]) => b - a)[0];
        generatedInsights.push({
          id: 'common-errors',
          title: 'Errores frecuentes detectados',
          description: `Se detectaron ${errors.length} errores. El más común: "${mostCommonError[0]}" (${mostCommonError[1]} veces).`,
          type: 'warning',
          priority: 'high',
          actionable: true,
          data: { totalErrors: errors.length, mostCommonError: mostCommonError[0], errorCount: mostCommonError[1] }
        });
      }

      // Analyze mobile vs desktop usage
      const mobileUsers = sessions.filter(s => s.deviceInfo?.userAgent?.includes('Mobile')).length;
      const mobilePercentage = (mobileUsers / sessions.length) * 100;
      if (mobilePercentage > 70) {
        generatedInsights.push({
          id: 'mobile-dominant',
          title: 'Uso predominante en móviles',
          description: `${mobilePercentage.toFixed(1)}% de los usuarios acceden desde móviles. Asegúrate de que la experiencia móvil sea óptima.`,
          type: 'info',
          priority: 'medium',
          actionable: true,
          data: { mobilePercentage, mobileUsers, totalUsers: sessions.length }
        });
      }

      // Analyze peak usage times
      const hourCounts = sessions.reduce((acc, session) => {
        const hour = new Date(session.startTime).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      const peakHour = Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0];
      if (peakHour) {
        generatedInsights.push({
          id: 'peak-hours',
          title: `Hora pico: ${peakHour[0]}:00`,
          description: `La mayor actividad ocurre a las ${peakHour[0]}:00 con ${peakHour[1]} sesiones. Considera programar mantenimiento en horas de menor actividad.`,
          type: 'info',
          priority: 'low',
          actionable: true,
          data: { peakHour: parseInt(peakHour[0]), sessionCount: parseInt(peakHour[1]) }
        });
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: UserInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'success':
        return <Target className="h-5 w-5 text-green-600" />;
      case 'info':
        return <Users className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: UserInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'border-blue-200 bg-blue-50';
      case 'warning':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'info':
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: UserInsight['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Insights de Usuario</h3>
        <button
          onClick={generateInsights}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Actualizar
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay insights disponibles en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                </div>
                {getPriorityBadge(insight.priority)}
              </div>
              
              <p className="text-gray-700 text-sm mb-3">{insight.description}</p>
              
              {insight.actionable && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Target className="h-3 w-3" />
                  <span>Acción recomendada</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInsights;