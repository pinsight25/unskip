// Performance monitoring utilities for tracking Core Web Vitals and app performance

interface PerformanceMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

// Type definitions for performance entries
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
  }

  private initObservers() {
    // Observe LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.LCP = lastEntry.startTime;
          this.logMetric('LCP', this.metrics.LCP);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer failed:', e);
      }

      // Observe FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as FirstInputEntry;
            this.metrics.FID = fidEntry.processingStart - fidEntry.startTime;
            this.logMetric('FID', this.metrics.FID);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer failed:', e);
      }

      // Observe CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShiftEntry = entry as LayoutShiftEntry;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          this.metrics.CLS = clsValue;
          this.logMetric('CLS', this.metrics.CLS);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer failed:', e);
      }
    }

    // Measure FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const fcpEntry = entries[0];
          this.metrics.FCP = fcpEntry.startTime;
          this.logMetric('FCP', this.metrics.FCP);
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer failed:', e);
      }
    }

    // Measure TTFB (Time to First Byte)
    this.measureTTFB();
  }

  private measureTTFB() {
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const navigationEntry = entries[0] as PerformanceNavigationTiming;
          this.metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
          this.logMetric('TTFB', this.metrics.TTFB);
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('TTFB observer failed:', e);
      }
    }
  }

  private logMetric(name: string, value: number) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}:`, value.toFixed(2), 'ms');
    }

    // In production, send to analytics service
    // Example: gtag('event', 'web_vitals', { [name]: value });
    
    // Store in localStorage for debugging
    try {
      const stored = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
      stored[name] = value;
      stored[`${name}_timestamp`] = Date.now();
      localStorage.setItem('performance_metrics', JSON.stringify(stored));
    } catch (e) {
      console.warn('Failed to store performance metric:', e);
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public getMetricGrade(metric: keyof PerformanceMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'needs-improvement';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  public getPerformanceReport(): string {
    const metrics = this.getMetrics();
    let report = '🚀 Performance Report:\n\n';

    Object.entries(metrics).forEach(([name, value]) => {
      const grade = this.getMetricGrade(name as keyof PerformanceMetrics, value);
      const emoji = grade === 'good' ? '✅' : grade === 'needs-improvement' ? '⚠️' : '❌';
      report += `${emoji} ${name}: ${value.toFixed(2)}ms (${grade})\n`;
    });

    return report;
  }

  public measurePageLoad(): number {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      return navigation.loadEventEnd - navigation.loadEventStart;
    }
    return 0;
  }

  public measureComponentRender(componentName: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${componentName} render time:`, duration.toFixed(2), 'ms');
      }
      
      // Store component render times
      try {
        const stored = JSON.parse(localStorage.getItem('component_render_times') || '{}');
        if (!stored[componentName]) {
          stored[componentName] = [];
        }
        stored[componentName].push(duration);
        // Keep only last 10 measurements
        if (stored[componentName].length > 10) {
          stored[componentName] = stored[componentName].slice(-10);
        }
        localStorage.setItem('component_render_times', JSON.stringify(stored));
      } catch (e) {
        console.warn('Failed to store component render time:', e);
      }
    };
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export utility functions
export const measureComponent = (componentName: string) => {
  return performanceMonitor.measureComponentRender(componentName);
};

export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics();
};

export const getPerformanceReport = () => {
  return performanceMonitor.getPerformanceReport();
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.cleanup();
  });
} 