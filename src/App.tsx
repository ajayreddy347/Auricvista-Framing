/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProduceProvider } from './context/ProduceContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CartDrawer } from './components/CartDrawer';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';

import { GlobalCinematicBackground } from './components/GlobalCinematicBackground';
import { AvaniCinematicBackground } from './components/AvaniCinematicBackground';

// Page Views
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { FarmersPage } from './pages/FarmersPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ImpactPage } from './pages/ImpactPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { PostProducePage } from './pages/PostProducePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmedPage } from './pages/OrderConfirmedPage';
import { AuricAvaniPage } from './pages/AuricAvaniPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

/**
 * AppRootLayout
 * 
 * Shared root layout component wrapped by BrowserRouter.
 * Implements route-aware background mounting and responsive left sidebar navigation.
 */
export function AppRootLayout() {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const { isDark } = useTheme();
  const isAvaniRoute =
    location.pathname === '/avani' ||
    location.pathname.startsWith('/avani/') ||
    location.pathname === '/auric-avani' ||
    location.pathname.startsWith('/auric-avani/');

  return (
    <>
      <ScrollToTop />

      {/* ========================================================================= */}
      {/* ROUTE-AWARE GLOBAL BACKGROUND                                             */}
      {/* ========================================================================= */}
      {!isAvaniRoute ? (
        <GlobalCinematicBackground />
      ) : (
        <AvaniCinematicBackground />
      )}

      <div className={`min-h-screen bg-transparent ${isDark ? 'text-[#f5f3eb]' : 'text-[#1c1917]'} flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fae69e] relative z-10`}>
        {/* Left Collapsible Desktop Sidebar + Mobile Drawer */}
        <Sidebar />

        {/* Brand Sticky Header with Role Auth State & Controls */}
        <Header />

        {/* Slide-in Cart Panel */}
        <CartDrawer />

        {/* Global Floating AI Assistant Button */}
        <FloatingAIAssistant />

        {/* Dynamic Route Pages - pt-20 clears 80px sticky header, with responsive left padding for sidebar */}
        <main
          className={`flex-1 flex flex-col relative z-10 pt-20 transition-all duration-300 ${
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/avani" element={<AuricAvaniPage />} />
              <Route path="/auric-avani" element={<AuricAvaniPage />} />
              <Route path="/farmers" element={<FarmersPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/impact" element={<ImpactPage />} />

              {/* Farmer Protected Routes */}
              <Route
                path="/farmer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer-dashboard/post-produce"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <PostProducePage />
                  </ProtectedRoute>
                }
              />

              {/* Customer Protected Routes */}
              <Route
                path="/customer-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

              {/* Fallback route back to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ProduceProvider>
            <ReviewsProvider>
              <CartProvider>
                <OrdersProvider>
                  <Router>
                    <SidebarProvider>
                      <AppRootLayout />
                    </SidebarProvider>
                  </Router>
                </OrdersProvider>
              </CartProvider>
            </ReviewsProvider>
          </ProduceProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
