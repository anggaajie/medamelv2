// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = 'G-Z69Z6JXWJW'; // Replace with your actual GA4 Measurement ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      ...parameters,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
    });
  }
};

// Track user engagement
export const trackEngagement = (eventType: string, details: Record<string, any> = {}) => {
  trackEvent('user_engagement', {
    event_type: eventType,
    ...details,
  });
};

// Track form interactions
export const trackFormInteraction = (formName: string, action: 'start' | 'complete' | 'abandon', fields?: string[]) => {
  trackEvent('form_interaction', {
    form_name: formName,
    action: action,
    fields_count: fields?.length || 0,
    fields: fields?.join(',') || '',
  });
};

// Track search behavior
export const trackSearch = (searchType: string, query: string, resultsCount: number, filters?: Record<string, any>) => {
  trackEvent('search', {
    search_type: searchType,
    query: query,
    results_count: resultsCount,
    filters: JSON.stringify(filters || {}),
  });
};

// Track application funnel
export const trackApplicationFunnel = (step: string, jobType: string, details?: Record<string, any>) => {
  trackEvent('application_funnel', {
    step: step,
    job_type: jobType,
    ...details,
  });
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent('performance', {
    metric: metric,
    value: value,
    unit: unit,
  });
};

// Track error events
export const trackError = (errorType: string, errorMessage: string, context?: Record<string, any>) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    ...context,
  });
};

// Track user session
export const trackSession = (action: 'start' | 'end', sessionData?: Record<string, any>) => {
  trackEvent('session', {
    action: action,
    session_duration: sessionData?.duration || 0,
    pages_visited: sessionData?.pagesVisited || 0,
    ...sessionData,
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName: string, action: string, details?: Record<string, any>) => {
  trackEvent('feature_usage', {
    feature: featureName,
    action: action,
    ...details,
  });
};

// Track conversion events
export const trackConversion = (conversionType: string, value?: number, currency: string = 'IDR') => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value || 0,
    currency: currency,
  });
};

// Analytics Dashboard Helpers
export const getAnalyticsData = async (dateRange: { start: Date; end: Date }) => {
  // This would typically call your analytics API
  // For now, we'll return mock data structure
  return {
    pageViews: 0,
    uniqueUsers: 0,
    sessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    topEvents: [],
    conversions: [],
  };
};

// Export for global window object
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 