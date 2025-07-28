// Analytics and monitoring utilities for tracking user behavior and performance

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  page: string;
  userAgent: string;
}

interface PerformanceEvent {
  metric: string;
  value: number;
  timestamp: number;
  page: string;
  sessionId: string;
}

interface ConversionEvent {
  type: 'offer_submitted' | 'chat_started' | 'car_viewed' | 'dealer_contacted' | 'listing_created';
  carId?: string;
  dealerId?: string;
  amount?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private performanceEvents: PerformanceEvent[] = [];
  private conversionEvents: ConversionEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredData();
    this.initialize();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredData() {
    try {
      const stored = localStorage.getItem('analytics_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.events = data.events || [];
        this.performanceEvents = data.performanceEvents || [];
        this.conversionEvents = data.conversionEvents || [];
      }
    } catch (e) {
      console.warn('Failed to load analytics data:', e);
    }
  }

  private saveData() {
    try {
      const data = {
        events: this.events.slice(-100), // Keep last 100 events
        performanceEvents: this.performanceEvents.slice(-50), // Keep last 50 performance events
        conversionEvents: this.conversionEvents.slice(-20), // Keep last 20 conversion events
        lastUpdated: Date.now()
      };
      localStorage.setItem('analytics_data', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save analytics data:', e);
    }
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Track page views
    this.trackPageView(window.location.pathname);
    
    // Track performance metrics
    this.initializePerformanceTracking();
    
    // Track user interactions
    this.trackUserInteractions();
    
    this.isInitialized = true;
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public trackEvent(category: string, action: string, label?: string, value?: number) {
    const event: AnalyticsEvent = {
      event: 'user_action',
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      page: window.location.pathname,
      userAgent: navigator.userAgent
    };

    this.events.push(event);
    this.saveData();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  public trackPageView(page: string) {
    this.trackEvent('navigation', 'page_view', page);
  }

  public trackCarView(carId: string, carTitle: string) {
    this.trackEvent('engagement', 'car_viewed', carTitle, undefined);
    
    const conversionEvent: ConversionEvent = {
      type: 'car_viewed',
      carId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    this.conversionEvents.push(conversionEvent);
    this.saveData();
  }

  public trackOfferSubmission(carId: string, amount: number) {
    this.trackEvent('conversion', 'offer_submitted', `Car: ${carId}`, amount);
    
    const conversionEvent: ConversionEvent = {
      type: 'offer_submitted',
      carId,
      amount,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    this.conversionEvents.push(conversionEvent);
    this.saveData();
  }

  public trackChatStarted(carId: string, dealerId?: string) {
    this.trackEvent('engagement', 'chat_started', `Car: ${carId}`, undefined);
    
    const conversionEvent: ConversionEvent = {
      type: 'chat_started',
      carId,
      dealerId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    this.conversionEvents.push(conversionEvent);
    this.saveData();
  }

  public trackDealerContact(dealerId: string, dealerName: string) {
    this.trackEvent('engagement', 'dealer_contacted', dealerName, undefined);
    
    const conversionEvent: ConversionEvent = {
      type: 'dealer_contacted',
      dealerId,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    this.conversionEvents.push(conversionEvent);
    this.saveData();
  }

  public trackListingCreated(type: 'car' | 'accessory') {
    this.trackEvent('conversion', 'listing_created', type, undefined);
    
    const conversionEvent: ConversionEvent = {
      type: 'listing_created',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    this.conversionEvents.push(conversionEvent);
    this.saveData();
  }

  public trackPerformance(metric: string, value: number) {
    const performanceEvent: PerformanceEvent = {
      metric,
      value,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.sessionId
    };

    this.performanceEvents.push(performanceEvent);
    this.saveData();

    if (process.env.NODE_ENV === 'development') {
      console.log('⚡ Performance:', metric, value);
    }
  }

  private initializePerformanceTracking() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.trackPerformance('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer failed:', e);
      }

      // FID
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as any;
            this.trackPerformance('FID', fidEntry.processingStart - fidEntry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer failed:', e);
      }

      // CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          this.trackPerformance('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer failed:', e);
      }
    }
  }

  private trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        if (button) {
          const text = button.textContent?.trim() || 'Unknown';
          this.trackEvent('interaction', 'button_click', text);
        }
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      const formName = form.getAttribute('data-form-name') || form.id || 'Unknown Form';
      this.trackEvent('interaction', 'form_submit', formName);
    });

    // Track navigation
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });
  }

  public getAnalyticsReport(): string {
    const totalEvents = this.events.length;
    const totalConversions = this.conversionEvents.length;
    const sessionDuration = Date.now() - parseInt(this.sessionId.split('-')[0]);
    
    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const conversionCounts = this.conversionEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let report = '📊 Analytics Report\n\n';
    report += `Session ID: ${this.sessionId}\n`;
    report += `Session Duration: ${Math.round(sessionDuration / 1000)}s\n`;
    report += `Total Events: ${totalEvents}\n`;
    report += `Total Conversions: ${totalConversions}\n\n`;

    report += 'Event Categories:\n';
    Object.entries(eventCounts).forEach(([category, count]) => {
      report += `  ${category}: ${count}\n`;
    });

    report += '\nConversions:\n';
    Object.entries(conversionCounts).forEach(([type, count]) => {
      report += `  ${type}: ${count}\n`;
    });

    return report;
  }

  public getPerformanceReport(): string {
    const latestMetrics = this.performanceEvents.slice(-10);
    let report = '⚡ Performance Report\n\n';

    const metricGroups = latestMetrics.reduce((acc, event) => {
      if (!acc[event.metric]) {
        acc[event.metric] = [];
      }
      acc[event.metric].push(event.value);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(metricGroups).forEach(([metric, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      report += `${metric}:\n`;
      report += `  Average: ${avg.toFixed(2)}ms\n`;
      report += `  Range: ${min.toFixed(2)}ms - ${max.toFixed(2)}ms\n`;
      report += `  Samples: ${values.length}\n\n`;
    });

    return report;
  }

  public exportData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events,
      performanceEvents: this.performanceEvents,
      conversionEvents: this.conversionEvents,
      exportTimestamp: Date.now()
    }, null, 2);
  }

  public clearData() {
    this.events = [];
    this.performanceEvents = [];
    this.conversionEvents = [];
    localStorage.removeItem('analytics_data');
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export utility functions
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  analytics.trackEvent(category, action, label, value);
};

export const trackPageView = (page: string) => {
  analytics.trackPageView(page);
};

export const trackCarView = (carId: string, carTitle: string) => {
  analytics.trackCarView(carId, carTitle);
};

export const trackOfferSubmission = (carId: string, amount: number) => {
  analytics.trackOfferSubmission(carId, amount);
};

export const trackChatStarted = (carId: string, dealerId?: string) => {
  analytics.trackChatStarted(carId, dealerId);
};

export const trackDealerContact = (dealerId: string, dealerName: string) => {
  analytics.trackDealerContact(dealerId, dealerName);
};

export const trackListingCreated = (type: 'car' | 'accessory') => {
  analytics.trackListingCreated(type);
};

export const trackPerformance = (metric: string, value: number) => {
  analytics.trackPerformance(metric, value);
};

export const getAnalyticsReport = () => {
  return analytics.getAnalyticsReport();
};

export const getPerformanceReport = () => {
  return analytics.getPerformanceReport();
};

export const exportAnalyticsData = () => {
  return analytics.exportData();
};

export const clearAnalyticsData = () => {
  analytics.clearData();
}; 