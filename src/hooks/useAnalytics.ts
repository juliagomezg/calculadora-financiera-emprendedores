import { useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  calculatorType?: string;
  result?: number;
  timestamp?: number;
}

export function useAnalytics() {
  const trackEvent = useCallback((eventData: AnalyticsEvent) => {
    const event = {
      ...eventData,
      timestamp: Date.now(),
    };

    // Store in localStorage for now (in production, send to analytics service)
    try {
      const existingEvents = JSON.parse(localStorage.getItem('calculator_analytics') || '[]');
      existingEvents.push(event);
      
      // Keep only last 100 events to prevent storage bloat
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }
      
      localStorage.setItem('calculator_analytics', JSON.stringify(existingEvents));
      
      // In production, you would send this to your analytics service
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', event);
      }
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  }, []);

  const trackCalculation = useCallback((calculatorType: string, result: number, inputs: Record<string, any>) => {
    trackEvent({
      event: 'calculation_performed',
      category: 'calculator',
      action: 'calculate',
      label: calculatorType,
      calculatorType,
      result,
      value: result,
    });
  }, [trackEvent]);

  const trackTutorialView = useCallback((calculatorType: string) => {
    trackEvent({
      event: 'tutorial_viewed',
      category: 'education',
      action: 'view_tutorial',
      label: calculatorType,
      calculatorType,
    });
  }, [trackEvent]);

  const trackReportRequest = useCallback((calculatorType: string, email: string) => {
    trackEvent({
      event: 'report_requested',
      category: 'conversion',
      action: 'request_report',
      label: calculatorType,
      calculatorType,
    });
  }, [trackEvent]);

  const trackWhatsAppClick = useCallback(() => {
    trackEvent({
      event: 'whatsapp_clicked',
      category: 'conversion',
      action: 'contact_whatsapp',
      label: 'advisory_request',
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackCalculation,
    trackTutorialView,
    trackReportRequest,
    trackWhatsAppClick,
  };
}