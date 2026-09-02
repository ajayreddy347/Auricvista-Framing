/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProduceProvider } from './context/ProduceContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';

// Page Views
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { FarmersPage } from './pages/FarmersPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ImpactPage } from './pages/ImpactPage';
import { TrustPage } from './pages/TrustPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { PostProducePage } from './pages/PostProducePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmedPage } from './pages/OrderConfirmedPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProduceProvider>
          <ReviewsProvider>
            <CartProvider>
              <OrdersProvider>
                <Router>
                  <ScrollToTop />
                  <div className="min-h-screen bg-[#070707] text-[#f5f3eb] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fae69e] relative">
                    {/* Brand Sticky Header with Role Auth State & Language Selector */}
                    <Header />

                    {/* Slide-in Cart Panel */}
                    <CartDrawer />

                    {/* Global Floating AI Assistant Button */}
                    <FloatingAIAssistant />

                    {/* Dynamic Route Pages */}
                    <main className="flex-1 flex flex-col">
                      <ErrorBoundary>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/marketplace" element={<MarketplacePage />} />
                          <Route path="/farmers" element={<FarmersPage />} />
                          <Route path="/how-it-works" element={<HowItWorksPage />} />
                          <Route path="/impact" element={<ImpactPage />} />
                          <Route path="/trust" element={<TrustPage />} />

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

                          {/* Fallback route back to home */}
                          <Route path="*" element={<HomePage />} />
                        </Routes>
                      </ErrorBoundary>
                    </main>
                  </div>
                </Router>
              </OrdersProvider>
            </CartProvider>
          </ReviewsProvider>
        </ProduceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
