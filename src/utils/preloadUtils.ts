// Intelligent preloading utilities for better performance

interface PreloadConfig {
  threshold: number; // Distance from viewport to start preloading
  priority: 'high' | 'medium' | 'low';
}

class PreloadManager {
  private preloadedModules: Set<string> = new Set();
  private preloadQueue: Map<string, () => Promise<any>> = new Map();
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.initializeIntersectionObserver();
  }

  private initializeIntersectionObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const modulePath = entry.target.getAttribute('data-preload');
              if (modulePath) {
                this.preloadModule(modulePath);
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start preloading 50px before element enters viewport
          threshold: 0.1,
        }
      );
    }
  }

  // Preload a module with caching
  async preloadModule(modulePath: string): Promise<void> {
    if (this.preloadedModules.has(modulePath)) {
      return; // Already preloaded
    }

    try {
      // Add to queue to prevent duplicate requests
      if (this.preloadQueue.has(modulePath)) {
        return;
      }

      const preloadPromise = this.executePreload(modulePath);
      this.preloadQueue.set(modulePath, preloadPromise);

      await preloadPromise;
      this.preloadedModules.add(modulePath);
      this.preloadQueue.delete(modulePath);
    } catch (error) {
      this.preloadQueue.delete(modulePath);
      // Silently fail - preloading is not critical
    }
  }

  private async executePreload(modulePath: string): Promise<void> {
    switch (modulePath) {
      case 'chat':
        await import('@/pages/ChatPage');
        await import('@/pages/ChatDetail');
        break;
      case 'car-detail':
        await import('@/pages/CarDetail');
        break;
      case 'sell-car':
        await import('@/pages/SellCar');
        break;
      case 'profile':
        await import('@/pages/Profile');
        break;
      case 'accessories':
        await import('@/pages/Accessories');
        await import('@/pages/AccessoryDetail');
        break;
      case 'dealers':
        await import('@/pages/Dealers');
        await import('@/pages/DealerProfile');
        break;
      default:
        // Dynamic import for unknown modules
        await import(modulePath);
    }
  }

  // Observe element for preloading
  observeElement(element: Element, modulePath: string): void {
    if (this.observer) {
      element.setAttribute('data-preload', modulePath);
      this.observer.observe(element);
    }
  }

  // Stop observing element
  unobserveElement(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  // Preload based on user behavior patterns
  preloadBasedOnBehavior(userAction: string): void {
    switch (userAction) {
      case 'hover-car-card':
        this.preloadModule('car-detail');
        break;
      case 'click-profile':
        this.preloadModule('profile');
        this.preloadModule('sell-car');
        break;
      case 'hover-chat-button':
        this.preloadModule('chat');
        break;
      case 'search-cars':
        this.preloadModule('car-detail');
        break;
      case 'browse-accessories':
        this.preloadModule('accessories');
        break;
      case 'browse-dealers':
        this.preloadModule('dealers');
        break;
    }
  }

  // Preload critical modules on app start
  preloadCriticalModules(): void {
    // Preload modules that are likely to be used soon
    setTimeout(() => {
      this.preloadModule('profile');
    }, 2000); // Delay to not block initial load
  }

  // Get preload status
  isPreloaded(modulePath: string): boolean {
    return this.preloadedModules.has(modulePath);
  }

  // Clear preloaded modules (useful for testing)
  clearPreloadedModules(): void {
    this.preloadedModules.clear();
    this.preloadQueue.clear();
  }
}

// Global preload manager instance
export const preloadManager = new PreloadManager();

// Utility functions for components
export const preloadUtils = {
  // Preload on hover
  preloadOnHover: (modulePath: string) => ({
    onMouseEnter: () => preloadManager.preloadModule(modulePath),
  }),

  // Preload on focus (for accessibility)
  preloadOnFocus: (modulePath: string) => ({
    onFocus: () => preloadManager.preloadModule(modulePath),
  }),

  // Preload on intersection
  preloadOnIntersection: (modulePath: string) => ({
    ref: (element: Element | null) => {
      if (element) {
        preloadManager.observeElement(element, modulePath);
      }
    },
  }),

  // Preload based on user behavior
  preloadOnBehavior: (action: string) => {
    preloadManager.preloadBasedOnBehavior(action);
  },

  // Check if module is preloaded
  isPreloaded: (modulePath: string) => preloadManager.isPreloaded(modulePath),
};

// Initialize critical preloading
if (typeof window !== 'undefined') {
  // Preload critical modules after initial load
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloadManager.preloadCriticalModules();
    }, 1000);
  });

  // Preload based on user interactions
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    
    // Preload car detail on car card hover
    if (target.closest('[data-car-card]')) {
      preloadManager.preloadBasedOnBehavior('hover-car-card');
    }
    
    // Preload chat on chat button hover
    if (target.closest('[data-chat-button]')) {
      preloadManager.preloadBasedOnBehavior('hover-chat-button');
    }
  });

  // Preload on navigation
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Preload profile features on profile click
    if (target.closest('[data-profile-link]')) {
      preloadManager.preloadBasedOnBehavior('click-profile');
    }
    
    // Preload search results
    if (target.closest('[data-search-form]')) {
      preloadManager.preloadBasedOnBehavior('search-cars');
    }
  });
}

export default preloadManager; 