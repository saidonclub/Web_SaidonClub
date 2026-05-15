'use client';

import { useCallback } from 'react';

// El módulo @saidonclub/analytics se integrará cuando esté configurado correctamente
// Por ahora este hook sirve como placeholder para tracking futuro

export function useAnalytics() {
  const trackEvent = useCallback((event: string, metadata?: Record<string, unknown>) => {
    // Placeholder - integrar con analytics provider después
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, metadata)
    }
  }, [])

  const trackPageView = useCallback((pageName: string, metadata?: Record<string, unknown>) => {
    trackEvent('page_view', { page: pageName, ...metadata })
  }, [trackEvent])

  const trackProductView = useCallback((productId: string, productName: string, price: number, category: string) => {
    trackEvent('product_view', { productId, productName, price, category })
  }, [trackEvent])

  const trackAddToCart = useCallback((productId: string, productName: string, price: number, quantity: number) => {
    trackEvent('add_to_cart', { productId, productName, price, quantity })
  }, [trackEvent])

  const trackCheckout = useCallback((cartValue: number, itemCount: number) => {
    trackEvent('checkout', { cartValue, itemCount })
  }, [trackEvent])

  const trackSignup = useCallback((method: string) => {
    trackEvent('signup', { method })
  }, [trackEvent])

  const trackLogin = useCallback((method: string) => {
    trackEvent('login', { method })
  }, [trackEvent])

  const trackMembershipPurchase = useCallback((planId: string, planName: string, value: number) => {
    trackEvent('membership_purchase', { planId, planName, value })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackCheckout,
    trackSignup,
    trackLogin,
    trackMembershipPurchase,
  };
}