import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { GA_MEASUREMENT_ID } from '@/constants';
import { db } from '@/config/firebase';

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading hook
export function useLazyLoad<T>(
  items: T[],
  itemsPerPage: number = 10
) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    const newItems = items.slice(startIndex, endIndex);
    
    setDisplayedItems(newItems);
    setHasMore(endIndex < items.length);
  }, [items, page, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset: () => setPage(1)
  };
}

// Virtual scrolling hook
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    containerRef,
    handleScroll,
    totalHeight: items.length * itemHeight
  };
}

// Image lazy loading hook
export function useImageLazyLoad() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageRefs, setImageRefs] = useState<Map<string, HTMLImageElement>>(new Map());

  const registerImage = useCallback((src: string, imgElement: HTMLImageElement) => {
    imageRefs.set(src, imgElement);
    setImageRefs(new Map(imageRefs));
  }, [imageRefs]);

  const isImageLoaded = useCallback((src: string) => {
    return loadedImages.has(src);
  }, [loadedImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.src;
            
            img.onload = () => {
              setLoadedImages(prev => new Set([...prev, src]));
            };
            
            img.src = img.dataset.src || src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    imageRefs.forEach((img) => {
      observer.observe(img);
    });

    return () => observer.disconnect();
  }, [imageRefs]);

  return {
    registerImage,
    isImageLoaded
  };
}

// Memoization utilities
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Performance monitoring and optimization utilities

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

interface PerformanceObserver {
  name: string;
  callback: (metric: PerformanceMetric) => void;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  // Start monitoring performance metrics
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    
    // Monitor custom metrics
    this.observeNavigationTiming();
    this.observeResourceTiming();
    
    console.log('Performance monitoring started');
  }

  // Stop monitoring
  stopMonitoring() {
    this.isMonitoring = false;
    console.log('Performance monitoring stopped');
  }

  // Observe Largest Contentful Paint (LCP)
  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.addMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          unit: 'ms',
          timestamp: Date.now()
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Observe First Input Delay (FID)
  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.addMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            unit: 'ms',
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  // Observe Cumulative Layout Shift (CLS)
  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.addMetric({
          name: 'CLS',
          value: clsValue,
          unit: 'score',
          timestamp: Date.now()
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Observe navigation timing
  private observeNavigationTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.addMetric({
            name: 'Navigation',
            value: entry.loadEventEnd - entry.loadEventStart,
            unit: 'ms',
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  // Observe resource timing
  private observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            this.addMetric({
              name: 'API_Call',
              value: entry.responseEnd - entry.requestStart,
              unit: 'ms',
              timestamp: Date.now()
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Add custom metric
  addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    this.notifyObservers(metric);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric: ${metric.name} = ${metric.value}${metric.unit}`);
    }
  }

  // Add observer
  addObserver(name: string, callback: (metric: PerformanceMetric) => void) {
    this.observers.push({ name, callback });
  }

  // Remove observer
  removeObserver(name: string) {
    this.observers = this.observers.filter(obs => obs.name !== name);
  }

  // Notify all observers
  private notifyObservers(metric: PerformanceMetric) {
    this.observers.forEach(observer => {
      try {
        observer.callback(metric);
      } catch (error) {
        console.error(`Error in performance observer ${observer.name}:`, error);
      }
    });
  }

  // Get metrics by name
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return this.metrics;
  }

  // Get latest metric by name
  getLatestMetric(name: string): PerformanceMetric | null {
    const metrics = this.getMetrics(name);
    return metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }

  // Get performance summary
  getSummary() {
    const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { avg: 0, min: Infinity, max: -Infinity, count: 0 };
      }
      
      const stats = summary[metric.name];
      stats.count++;
      stats.min = Math.min(stats.min, metric.value);
      stats.max = Math.max(stats.max, metric.value);
      stats.avg = (stats.avg * (stats.count - 1) + metric.value) / stats.count;
    });
    
    return summary;
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Lazy load images
  lazyLoadImage(img: HTMLImageElement, src: string) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(img);
  },

  // Preload critical images
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  // Generate responsive image srcset
  generateSrcSet(baseUrl: string, widths: number[]): string {
    return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
  }
};

// Code splitting utilities
export const codeSplitting = {
  // Dynamic import with loading state
  async loadComponent(importFn: () => Promise<any>, fallback?: React.ComponentType) {
    try {
      const module = await importFn();
      return module.default || module;
    } catch (error) {
      console.error('Failed to load component:', error);
      return fallback || (() => React.createElement('div', null, 'Failed to load component'));
    }
  },

  // Preload component
  preloadComponent(importFn: () => Promise<any>) {
    return () => {
      importFn();
      return null;
    };
  }
};

// Memory management utilities
export const memoryManagement = {
  // Debounce function calls
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function calls
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Cleanup event listeners
  cleanupEventListeners(element: Element, event: string, handler: EventListener) {
    element.removeEventListener(event, handler);
  },

  // Clear intervals and timeouts
  clearTimers(timers: (NodeJS.Timeout | number)[]) {
    timers.forEach(timer => {
      if (typeof timer === 'number') {
        clearTimeout(timer);
      } else {
        clearTimeout(timer);
      }
    });
  }
};

// Bundle analysis utilities
export const bundleAnalysis = {
  // Get bundle size information
  getBundleInfo() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        totalSize: navigation.transferSize,
        decodedSize: navigation.decodedBodySize,
        encodedSize: navigation.encodedBodySize,
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      };
    }
    return null;
  },

  // Monitor memory usage
  getMemoryInfo() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

// Create global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.startMonitoring();
}

export default performanceMonitor; 