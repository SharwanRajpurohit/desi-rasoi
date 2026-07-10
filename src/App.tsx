import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import { CustomerLayout } from './components/layout/CustomerLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminRoute } from './components/layout/AdminRoute'
import { Spinner } from './components/ui/Spinner'

// ─── Customer pages (lazy) ────────────────────────────────────────────────────
const Home       = lazy(() => import('./pages/customer/Home'))
const Login      = lazy(() => import('./pages/customer/Login'))
const About      = lazy(() => import('./pages/customer/About'))
const Contact    = lazy(() => import('./pages/customer/Contact'))

// ─── Admin pages (lazy) ───────────────────────────────────────────────────────
const AdminLogin  = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

// ─── Fallback ─────────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8 text-brand" />
    </div>
  )
}

function NotFound() {
  return (
    <CustomerLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <p className="font-display text-6xl font-bold text-brand">404</p>
        <h1 className="font-display text-2xl text-charcoal">Page not found</h1>
        <p className="text-warm-gray">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-2 text-sm font-medium text-brand underline hover:text-brand-dark">
          Back to Home
        </a>
      </div>
    </CustomerLayout>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Customer routes ── */}
              <Route
                path="/"
                element={
                  <CustomerLayout>
                    <Home />
                  </CustomerLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <CustomerLayout>
                    <Login />
                  </CustomerLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <CustomerLayout>
                    <About />
                  </CustomerLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <CustomerLayout>
                    <Contact />
                  </CustomerLayout>
                }
              />

              {/* Protected customer routes — Phase 3 will fill these */}
              <Route
                path="/cart"
                element={
                  <CustomerLayout>
                    <ProtectedRoute>
                      <div className="p-8 text-center text-warm-gray">Cart — coming in Phase 3</div>
                    </ProtectedRoute>
                  </CustomerLayout>
                }
              />
              <Route
                path="/orders"
                element={
                  <CustomerLayout>
                    <ProtectedRoute>
                      <div className="p-8 text-center text-warm-gray">Orders — coming in Phase 3</div>
                    </ProtectedRoute>
                  </CustomerLayout>
                }
              />
              <Route
                path="/products"
                element={
                  <CustomerLayout>
                    <div className="p-8 text-center text-warm-gray">Catalog — coming in Phase 3</div>
                  </CustomerLayout>
                }
              />

              {/* ── Admin routes ── */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route
                path="/admin/login"
                element={<AdminLogin />}
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              {/* Admin sub-routes — Phase 4 */}
              {['/admin/products', '/admin/orders', '/admin/inventory', '/admin/categories'].map((path) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <AdminRoute>
                      <AdminLayout>
                        <div className="text-warm-gray">
                          {path.split('/').pop()} management — coming in Phase 4
                        </div>
                      </AdminLayout>
                    </AdminRoute>
                  }
                />
              ))}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
