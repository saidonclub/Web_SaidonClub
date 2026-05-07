// Analytics Package - Sistema de tracking básico para SaidonClub
// Alternativa simple a PostHog/Plausible

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  sessionId?: string
  userId?: string
}

export interface PageView {
  path: string
  title?: string
  referrer?: string
  timestamp: number
}

export interface User {
  id?: string
  anonymousId: string
  traits?: Record<string, any>
}

// Simple localStorage-based analytics
class SimpleAnalytics {
  private sessionId: string
  private anonymousId: string
  private enabled: boolean
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []

  constructor() {
    this.sessionId = this.generateSessionId()
    this.anonymousId = this.getOrCreateAnonymousId()
    this.enabled = this.shouldEnable()
    
    if (this.enabled) {
      this.init()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getOrCreateAnonymousId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let id = localStorage.getItem('saidon_anon_id')
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('saidon_anon_id', id)
    }
    return id
  }

  private shouldEnable(): boolean {
    if (typeof window === 'undefined') return false
    return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false'
  }

  private init() {
    this.trackPageView()
    
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => this.trackPageView())
      
      const originalPushState = history.pushState
      history.pushState = (...args) => {
        originalPushState.apply(history, args)
        this.trackPageView()
      }
    }
  }

  // Trackear evento
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.enabled) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.getUserId()
    }

    this.events.push(event)
    this.persistEvents()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, properties)
    }
  }

  // Trackear page view
  private trackPageView() {
    if (typeof window === 'undefined') return

    const path = window.location.pathname
    const title = document.title

    const pageView: PageView = {
      path,
      title,
      referrer: document.referrer,
      timestamp: Date.now()
    }

    this.pageViews.push(pageView)
    this.persistPageViews()
    
    this.track('page_view', { path, title })
  }

  // Obtener user ID del localStorage/session
  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined
    return localStorage.getItem('saidon_user_id') || undefined
  }

  // Persistir eventos en localStorage (limitado)
  private persistEvents() {
    if (typeof window === 'undefined') return
    
    const limited = this.events.slice(-50)
    localStorage.setItem('saidon_events', JSON.stringify(limited))
  }

  private persistPageViews() {
    if (typeof window === 'undefined') return
    
    const limited = this.pageViews.slice(-100)
    localStorage.setItem('saidon_pageviews', JSON.stringify(limited))
  }

  // Getters
  getSessionId() { return this.sessionId }
  getAnonymousId() { return this.anonymousId }
  getEvents() { return this.events }
  getPageViews() { return this.pageViews }

  // Reset para testing
  reset() {
    this.events = []
    this.pageViews = []
    this.sessionId = this.generateSessionId()
  }
}

// Singleton
export const analytics = new SimpleAnalytics()

// Helper functions para tracking común
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  analytics.track(name, properties)
}

export const trackPageView = (path?: string) => {
  if (path) {
    analytics.track('page_view', { path })
  } else {
    analytics.track('page_view')
  }
}

// Pre-defined event trackers
export const analyticsEvents = {
  // Ecommerce
  productViewed: (productId: string, productName: string, price: number) => 
    trackEvent('product_viewed', { productId, productName, price }),
  
  productAdded: (productId: string, productName: string, price: number, quantity: number) =>
    trackEvent('product_added', { productId, productName, price, quantity }),
  
  productRemoved: (productId: string, productName: string) =>
    trackEvent('product_removed', { productId, productName }),
  
  checkoutStarted: (cartValue: number, itemCount: number) =>
    trackEvent('checkout_started', { cartValue, itemCount }),
  
  orderCompleted: (orderId: string, total: number, currency: string) =>
    trackEvent('order_completed', { orderId, total, currency }),
  
  orderFailed: (orderId: string, reason: string) =>
    trackEvent('order_failed', { orderId, reason }),

  // Membership
  membershipUpgraded: (fromTier: string, toTier: string, price: number) =>
    trackEvent('membership_upgraded', { fromTier, toTier, price }),
  
  membershipCancelled: (tier: string, reason?: string) =>
    trackEvent('membership_cancelled', { tier, reason }),

  // User actions
  signUp: (method: string) =>
    trackEvent('user_signed_up', { method }),
  
  login: (method: string) =>
    trackEvent('user_logged_in', { method }),
  
  logout: () =>
    trackEvent('user_logged_out'),
  
  profileUpdated: (fields: string[]) =>
    trackEvent('profile_updated', { fields }),

  // Engagement
  searchPerformed: (query: string, resultCount: number) =>
    trackEvent('search_performed', { query, resultCount }),
  
  filterUsed: (filterType: string, filterValue: string) =>
    trackEvent('filter_used', { filterType, filterValue }),
  
  serviceBooked: (serviceId: string, serviceName: string, date: string) =>
    trackEvent('service_booked', { serviceId, serviceName, date }),

  // Errors
  errorOccurred: (errorType: string, errorMessage: string, stack?: string) =>
    trackEvent('error_occurred', { errorType, errorMessage, stack }),
}

export default analytics