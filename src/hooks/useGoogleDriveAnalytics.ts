import { useCallback, useEffect } from 'react';

interface GoogleDriveConfig {
  apiKey: string;
  clientId: string;
  spreadsheetId: string;
}

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
  sessionId: string;
  calculatorType: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  timeSpent: number;
  completedCalculation: boolean;
  timestamp: number;
  errors?: string[];
}

interface UserBehavior {
  sessionId: string;
  action: string;
  element: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface UserFeedback {
  sessionId: string;
  calculatorType?: string;
  rating: number;
  feedback: string;
  category: string;
  timestamp: number;
  userAgent: string;
}

export function useGoogleDriveAnalytics() {
  const config: GoogleDriveConfig = {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || '',
  };

  // Initialize Google APIs
  const initializeGoogleAPI = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window.gapi !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: config.apiKey,
              clientId: config.clientId,
              discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
              scope: 'https://www.googleapis.com/auth/spreadsheets'
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, [config.apiKey, config.clientId]);

  // Authenticate user
  const authenticateUser = useCallback(async () => {
    try {
      await initializeGoogleAPI();
      const authInstance = window.gapi.auth2.getAuthInstance();
      
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      
      return true;
    } catch (error) {
      console.warn('Google authentication failed:', error);
      return false;
    }
  }, [initializeGoogleAPI]);

  // Write data to Google Sheets
  const writeToSheet = useCallback(async (sheetName: string, values: any[][]) => {
    try {
      const isAuthenticated = await authenticateUser();
      if (!isAuthenticated) {
        throw new Error('Authentication failed');
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: config.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: values
        }
      });

      return response.result;
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      // Fallback to localStorage
      const fallbackKey = `fallback_${sheetName}`;
      const existingData = JSON.parse(localStorage.getItem(fallbackKey) || '[]');
      existingData.push(...values);
      localStorage.setItem(fallbackKey, JSON.stringify(existingData));
      throw error;
    }
  }, [config.spreadsheetId, authenticateUser]);

  // Read data from Google Sheets
  const readFromSheet = useCallback(async (sheetName: string, range: string = 'A:Z') => {
    try {
      const isAuthenticated = await authenticateUser();
      if (!isAuthenticated) {
        throw new Error('Authentication failed');
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: config.spreadsheetId,
        range: `${sheetName}!${range}`
      });

      return response.result.values || [];
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      // Fallback to localStorage
      const fallbackKey = `fallback_${sheetName}`;
      return JSON.parse(localStorage.getItem(fallbackKey) || '[]');
    }
  }, [config.spreadsheetId, authenticateUser]);

  // Generate session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Get device info
  const getDeviceInfo = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }, []);

  // Initialize session
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

    // Send to Google Sheets
    try {
      await writeToSheet('UserSessions', [
        [
          session.sessionId,
          session.startTime,
          session.lastActivity,
          session.pageViews,
          session.calculationsPerformed,
          session.timeSpent,
          JSON.stringify(session.deviceInfo),
          new Date().toISOString()
        ]
      ]);
    } catch (error) {
      console.warn('Failed to store session in Google Sheets:', error);
    }

    return sessionId;
  }, [generateSessionId, getDeviceInfo, writeToSheet]);

  // Update session
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

    // Note: Google Sheets doesn't support easy updates, so we'll append a new row
    try {
      await writeToSheet('SessionUpdates', [
        [
          session.sessionId,
          updatedSession.lastActivity,
          updatedSession.pageViews,
          updatedSession.calculationsPerformed,
          updatedSession.timeSpent,
          new Date().toISOString()
        ]
      ]);
    } catch (error) {
      console.warn('Failed to update session in Google Sheets:', error);
    }
  }, [writeToSheet]);

  // Track calculator usage
  const trackCalculatorUsage = useCallback(async (usage: CalculatorUsage) => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    
    try {
      await writeToSheet('CalculatorUsage', [
        [
          usage.sessionId,
          usage.calculatorType,
          JSON.stringify(usage.inputs),
          JSON.stringify(usage.results),
          usage.timeSpent,
          usage.completedCalculation,
          usage.timestamp,
          JSON.stringify(usage.errors || []),
          new Date().toISOString()
        ]
      ]);
      
      // Update session calculation count
      await updateSession({
        calculationsPerformed: session.calculationsPerformed + 1,
      });
    } catch (error) {
      console.warn('Failed to track calculator usage:', error);
    }
  }, [updateSession, writeToSheet]);

  // Track user behavior
  const trackUserBehavior = useCallback(async (behavior: Omit<UserBehavior, 'sessionId' | 'timestamp'>) => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    
    const behaviorData: UserBehavior = {
      ...behavior,
      sessionId: session.sessionId,
      timestamp: Date.now(),
    };

    try {
      await writeToSheet('UserBehaviors', [
        [
          behaviorData.sessionId,
          behaviorData.action,
          behaviorData.element,
          behaviorData.timestamp,
          JSON.stringify(behaviorData.metadata || {}),
          new Date().toISOString()
        ]
      ]);
    } catch (error) {
      console.warn('Failed to track user behavior:', error);
    }
  }, [writeToSheet]);

  // Track user feedback
  const trackUserFeedback = useCallback(async (feedback: Omit<UserFeedback, 'sessionId' | 'timestamp'>) => {
    const sessionData = localStorage.getItem('userSession');
    if (!sessionData) return;

    const session = JSON.parse(sessionData);
    
    const feedbackData: UserFeedback = {
      ...feedback,
      sessionId: session.sessionId,
      timestamp: Date.now(),
    };

    try {
      await writeToSheet('UserFeedback', [
        [
          feedbackData.sessionId,
          feedbackData.calculatorType || '',
          feedbackData.rating,
          feedbackData.feedback,
          feedbackData.category,
          feedbackData.timestamp,
          feedbackData.userAgent,
          new Date().toISOString()
        ]
      ]);
    } catch (error) {
      console.warn('Failed to track user feedback:', error);
    }
  }, [writeToSheet]);

  // Track page view
  const trackPageView = useCallback(async (page: string) => {
    await trackUserBehavior({
      action: 'page_view',
      element: page,
      metadata: { url: window.location.href },
    });

    await updateSession({ pageViews: 1 }); // This will increment in the tracking
  }, [trackUserBehavior, updateSession]);

  // Track button click
  const trackButtonClick = useCallback(async (buttonName: string, context?: Record<string, any>) => {
    await trackUserBehavior({
      action: 'button_click',
      element: buttonName,
      metadata: context,
    });
  }, [trackUserBehavior]);

  // Track form interaction
  const trackFormInteraction = useCallback(async (formField: string, action: 'focus' | 'blur' | 'change', value?: any) => {
    await trackUserBehavior({
      action: `form_${action}`,
      element: formField,
      metadata: { value: typeof value === 'string' ? value.substring(0, 100) : value },
    });
  }, [trackUserBehavior]);

  // Track error
  const trackError = useCallback(async (error: Error, context?: Record<string, any>) => {
    await trackUserBehavior({
      action: 'error',
      element: 'application',
      metadata: {
        error: error.message,
        stack: error.stack?.substring(0, 500),
        context,
      },
    });
  }, [trackUserBehavior]);

  // Track feature usage
  const trackFeatureUsage = useCallback(async (feature: string, metadata?: Record<string, any>) => {
    await trackUserBehavior({
      action: 'feature_usage',
      element: feature,
      metadata,
    });
  }, [trackUserBehavior]);

  // Get analytics data
  const getAnalyticsData = useCallback(async () => {
    try {
      const [sessions, behaviors, feedback, calculations] = await Promise.all([
        readFromSheet('UserSessions'),
        readFromSheet('UserBehaviors'),
        readFromSheet('UserFeedback'),
        readFromSheet('CalculatorUsage')
      ]);

      return {
        sessions: sessions.slice(1), // Remove header row
        behaviors: behaviors.slice(1),
        feedback: feedback.slice(1),
        calculations: calculations.slice(1)
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return {
        sessions: [],
        behaviors: [],
        feedback: [],
        calculations: []
      };
    }
  }, [readFromSheet]);

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

  return {
    initializeSession,
    updateSession,
    trackCalculatorUsage,
    trackUserBehavior,
    trackUserFeedback,
    trackPageView,
    trackButtonClick,
    trackFormInteraction,
    trackError,
    trackFeatureUsage,
    getAnalyticsData,
    authenticateUser,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gapi: any;
  }
}