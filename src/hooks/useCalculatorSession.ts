import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnalytics } from './useAnalytics';
import { useAdvancedAnalytics } from './useAdvancedAnalytics';

interface CalculatorSession {
  sessionId: string;
  calculatorType: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  completed: boolean;
  inputs: Record<string, any>;
  results?: Record<string, any>;
  interactions: number;
  errorsEncountered: string[];
}

export function useCalculatorSession(calculatorType: string) {
  const [currentSession, setCurrentSession] = useState<CalculatorSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const interactionCountRef = useRef(0);
  const { trackEvent, trackCalculation } = useAnalytics();
  const { trackCalculatorUsage, trackUserBehavior } = useAdvancedAnalytics();

  // Generar ID único para la sesión
  const generateSessionId = useCallback(() => {
    return `calc_${calculatorType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, [calculatorType]);

  // Iniciar nueva sesión de calculadora
  const startSession = useCallback(() => {
    if (currentSession && !currentSession.completed) {
      // Finalizar sesión anterior si existe
      endSession(false);
    }

    const newSession: CalculatorSession = {
      sessionId: generateSessionId(),
      calculatorType,
      startTime: Date.now(),
      completed: false,
      inputs: {},
      interactions: 0,
      errorsEncountered: [],
    };

    setCurrentSession(newSession);
    setIsActive(true);
    interactionCountRef.current = 0;

    // Tracking de inicio
    trackEvent({
      event: 'calculator_session_started',
      category: 'engagement',
      action: 'start_session',
      label: calculatorType,
      calculatorType,
    });

    trackUserBehavior({
      action: 'session_start',
      element: calculatorType,
      metadata: {
        sessionId: newSession.sessionId,
        timestamp: newSession.startTime,
      },
    });

    // Auto-finalizar sesión después de 30 minutos de inactividad
    sessionTimeoutRef.current = setTimeout(() => {
      if (currentSession && !currentSession.completed) {
        endSession(false, 'timeout');
      }
    }, 30 * 60 * 1000); // 30 minutos

    return newSession.sessionId;
  }, [currentSession, generateSessionId, calculatorType, trackEvent, trackUserBehavior]);

  // Actualizar inputs de la sesión
  const updateInputs = useCallback((inputs: Record<string, any>) => {
    if (!currentSession || !isActive) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      inputs: { ...prev.inputs, ...inputs },
      interactions: prev.interactions + 1,
    } : null);

    interactionCountRef.current += 1;

    // Tracking de interacción
    trackUserBehavior({
      action: 'input_change',
      element: `${calculatorType}_input`,
      metadata: {
        sessionId: currentSession.sessionId,
        inputKeys: Object.keys(inputs),
        interactionCount: interactionCountRef.current,
      },
    });

    // Resetear timeout de inactividad
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = setTimeout(() => {
        if (currentSession && !currentSession.completed) {
          endSession(false, 'timeout');
        }
      }, 30 * 60 * 1000);
    }
  }, [currentSession, isActive, calculatorType, trackUserBehavior]);

  // Registrar resultados del cálculo
  const recordResults = useCallback((results: Record<string, any>) => {
    if (!currentSession || !isActive) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      results,
    } : null);

    // Tracking de cálculo realizado
    trackCalculation(calculatorType, Object.values(results)[0] as number, currentSession.inputs);

    trackUserBehavior({
      action: 'calculation_performed',
      element: calculatorType,
      metadata: {
        sessionId: currentSession.sessionId,
        hasResults: true,
        inputCount: Object.keys(currentSession.inputs).length,
        resultKeys: Object.keys(results),
      },
    });
  }, [currentSession, isActive, calculatorType, trackCalculation, trackUserBehavior]);

  // Registrar error en la sesión
  const recordError = useCallback((error: string) => {
    if (!currentSession || !isActive) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      errorsEncountered: [...prev.errorsEncountered, error],
    } : null);

    trackUserBehavior({
      action: 'error_encountered',
      element: calculatorType,
      metadata: {
        sessionId: currentSession.sessionId,
        error,
        errorCount: currentSession.errorsEncountered.length + 1,
      },
    });
  }, [currentSession, isActive, calculatorType, trackUserBehavior]);

  // Finalizar sesión
  const endSession = useCallback((completed: boolean = true, reason?: string) => {
    if (!currentSession) return;

    const endTime = Date.now();
    const duration = endTime - currentSession.startTime;

    const finalSession: CalculatorSession = {
      ...currentSession,
      endTime,
      duration,
      completed,
    };

    setCurrentSession(finalSession);
    setIsActive(false);

    // Limpiar timeout
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    // Tracking de finalización
    trackEvent({
      event: 'calculator_session_ended',
      category: 'engagement',
      action: completed ? 'complete_session' : 'abandon_session',
      label: calculatorType,
      calculatorType,
      value: Math.round(duration / 1000), // duración en segundos
    });

    trackCalculatorUsage({
      calculatorType,
      inputs: finalSession.inputs,
      results: finalSession.results || {},
      timeSpent: duration,
      completedCalculation: completed,
      errors: finalSession.errorsEncountered,
    });

    trackUserBehavior({
      action: 'session_end',
      element: calculatorType,
      metadata: {
        sessionId: finalSession.sessionId,
        duration,
        completed,
        reason: reason || (completed ? 'completed' : 'abandoned'),
        interactions: finalSession.interactions,
        errorsCount: finalSession.errorsEncountered.length,
        hasResults: !!finalSession.results,
      },
    });

    // Guardar sesión en historial local
    const sessionHistory = JSON.parse(localStorage.getItem('calculator_sessions') || '[]');
    sessionHistory.push(finalSession);
    
    // Mantener solo las últimas 50 sesiones
    if (sessionHistory.length > 50) {
      sessionHistory.splice(0, sessionHistory.length - 50);
    }
    
    localStorage.setItem('calculator_sessions', JSON.stringify(sessionHistory));

    return finalSession;
  }, [currentSession, calculatorType, trackEvent, trackCalculatorUsage, trackUserBehavior]);

  // Marcar sesión como completada (cuando se obtienen resultados válidos)
  const completeSession = useCallback(() => {
    return endSession(true, 'completed');
  }, [endSession]);

  // Pausar/reanudar sesión
  const pauseSession = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    setIsActive(false);

    trackUserBehavior({
      action: 'session_paused',
      element: calculatorType,
      metadata: {
        sessionId: currentSession?.sessionId,
        duration: currentSession ? Date.now() - currentSession.startTime : 0,
      },
    });
  }, [calculatorType, currentSession, trackUserBehavior]);

  const resumeSession = useCallback(() => {
    setIsActive(true);
    
    // Reiniciar timeout
    sessionTimeoutRef.current = setTimeout(() => {
      if (currentSession && !currentSession.completed) {
        endSession(false, 'timeout');
      }
    }, 30 * 60 * 1000);

    trackUserBehavior({
      action: 'session_resumed',
      element: calculatorType,
      metadata: {
        sessionId: currentSession?.sessionId,
      },
    });
  }, [calculatorType, currentSession, endSession, trackUserBehavior]);

  // Obtener estadísticas de la sesión actual
  const getSessionStats = useCallback(() => {
    if (!currentSession) return null;

    const currentTime = Date.now();
    const currentDuration = currentTime - currentSession.startTime;

    return {
      sessionId: currentSession.sessionId,
      duration: currentDuration,
      isActive,
      interactions: currentSession.interactions,
      hasInputs: Object.keys(currentSession.inputs).length > 0,
      hasResults: !!currentSession.results,
      errorCount: currentSession.errorsEncountered.length,
      estimatedCompletion: currentSession.interactions > 3 && !!currentSession.results ? 90 : 
                          currentSession.interactions > 2 ? 60 : 
                          currentSession.interactions > 0 ? 30 : 0, // Porcentaje estimado
    };
  }, [currentSession, isActive]);

  // Obtener historial de sesiones
  const getSessionHistory = useCallback(() => {
    const history = JSON.parse(localStorage.getItem('calculator_sessions') || '[]');
    return history.filter((session: CalculatorSession) => session.calculatorType === calculatorType);
  }, [calculatorType]);

  // Limpiar al desmontar componente
  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      
      // Si hay una sesión activa al salir, marcarla como abandonada
      if (currentSession && isActive && !currentSession.completed) {
        endSession(false, 'component_unmount');
      }
    };
  }, [currentSession, isActive, endSession]);

  // Auto-iniciar sesión cuando se monta el componente
  useEffect(() => {
    if (!currentSession) {
      startSession();
    }
  }, []);

  return {
    // Estado de la sesión
    currentSession,
    isActive,
    
    // Controles de sesión
    startSession,
    endSession,
    completeSession,
    pauseSession,
    resumeSession,
    
    // Tracking de actividad
    updateInputs,
    recordResults,
    recordError,
    
    // Información y estadísticas
    getSessionStats,
    getSessionHistory,
  };
} 