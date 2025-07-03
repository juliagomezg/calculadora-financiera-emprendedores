import { useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  calculationsPerformed: number;
  timeSpent: number;
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    language: string;
    timezone: string;
  };
}

interface CalculatorUsage {
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  timeSpent: number;
  completedCalculation: boolean;
  errors?: string[];
}

interface UserBehavior {
  sessionId: string;
  action: string;
  element: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export function useAdvancedAnalytics() {
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getDeviceInfo = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }, []);

  const initializeSession = useCallback(async () => {
    const sessionId = generateSessionId();
    const session: UserSession = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 1,
      calculationsPerformed: 0,
      timeSpent: 0,
      deviceInfo: getDeviceInfo(),
    };

    // Store session locally
    localStorage.setItem('userSession', JSON.stringify(session));

    // Only send to database if Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('user_sessions').insert([session]);
      } catch (error) {
        console.warn('Failed to store session:', error);
      }
    }

    return sessionId;
  }, [generateSessionId, getDeviceInfo]);

  const updateSession = useCallback(async (updates: Partial<UserSession>) => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: Date.now(),
      timeSpent: Date.now() - session.startTime,
    };

    localStorage.setItem('userSession', JSON.stringify(updatedSession));

    // Only update database if Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('user_sessions')
          .update(updatedSession)
          .eq('sessionId', session.sessionId);
      } catch (error) {
        console.warn('Failed to update session:', error);
      }
    }
  }, []);

  const trackCalculatorUsage = useCallback(async (usage: CalculatorUsage) => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    
    const usageData = {
      ...usage,
      sessionId: session.sessionId,
      timestamp: Date.now(),
    };

    // Only track in database if Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('calculator_usage').insert([usageData]);
        
        // Update session calculation count
        await updateSession({
          calculationsPerformed: session.calculationsPerformed + 1,
        });
      } catch (error) {
        console.warn('Failed to track calculator usage:', error);
      }
    }
  }, [updateSession]);

  const trackUserBehavior = useCallback(async (behavior: Omit<UserBehavior, 'sessionId' | 'timestamp'>) => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    
    const behaviorData: UserBehavior = {
      ...behavior,
      sessionId: session.sessionId,
      timestamp: Date.now(),
    };

    // Only track in database if Supabase is configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('user_behaviors').insert([behaviorData]);
      } catch (error) {
        console.warn('Failed to track user behavior:', error);
      }
    }
  }, []);

  const trackPageView = useCallback(async (page: string) => {
    await trackUserBehavior({
      action: 'page_view',
      element: page,
      metadata: { url: window.location.href },
    });

    await updateSession({ pageViews: 1 }); // This will increment in the database
  }, [trackUserBehavior, updateSession]);

  const trackButtonClick = useCallback(async (buttonName: string, context?: Record<string, any>) => {
    await trackUserBehavior({
      action: 'button_click',
      element: buttonName,
      metadata: context,
    });
  }, [trackUserBehavior]);

  const trackFormInteraction = useCallback(async (formField: string, action: 'focus' | 'blur' | 'change', value?: any) => {
    await trackUserBehavior({
      action: `form_${action}`,
      element: formField,
      metadata: { value: typeof value === 'string' ? value.substring(0, 100) : value }, // Limit value length
    });
  }, [trackUserBehavior]);

  const trackError = useCallback(async (error: Error, context?: Record<string, any>) => {
    await trackUserBehavior({
      action: 'error',
      element: 'application',
      metadata: {
        error: error.message,
        stack: error.stack?.substring(0, 500), // Limit stack trace length
        context,
      },
    });
  }, [trackUserBehavior]);

  const trackFeatureUsage = useCallback(async (feature: string, metadata?: Record<string, any>) => {
    await trackUserBehavior({
      action: 'feature_usage',
      element: feature,
      metadata,
    });
  }, [trackUserBehavior]);

  // Initialize session on mount
  useEffect(() => {
    const existingSession = localStorage.getItem('userSession');
    if (!existingSession) {
      initializeSession();
    } else {
      // Update last activity for existing session
      const session = JSON.parse(existingSession);
      updateSession({ lastActivity: Date.now() });
    }
  }, [initializeSession, updateSession]);

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackUserBehavior({
          action: 'page_hidden',
          element: 'window',
        });
      } else {
        trackUserBehavior({
          action: 'page_visible',
          element: 'window',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [trackUserBehavior]);

  // Track session end on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackUserBehavior({
        action: 'session_end',
        element: 'window',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackUserBehavior]);

  return {
    initializeSession,
    updateSession,
    trackCalculatorUsage,
    trackUserBehavior,
    trackPageView,
    trackButtonClick,
    trackFormInteraction,
    trackError,
    trackFeatureUsage,
  };
}