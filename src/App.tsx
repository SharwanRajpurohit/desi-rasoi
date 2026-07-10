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
import type { ReactNode } from 'react'

// ─── Customer pages ───────────────────────────────────────────────────────────
const Home          = lazy(() => import('./pages/customer/Home'))
const Catalog       = lazy(() => import('./pages/customer/Catalog'))
const ProductDetail = lazy(() => import('./pages/customer/ProductDetail'))
const Category      = lazy(() => import('./pages/customer/Category'))
const Cart          = lazy(() => import('./pages/customer/Cart'))
const Checkout      = lazy(() => import('./pages/customer/Checkout'))
const Orders        = lazy(() => import('./pages/customer/Orders'))
const OrderDetail   = lazy(() => import('./pages/customer/OrderDetail'))
const Login         = lazy(() => import('./pages/customer/Login'))
const About         = lazy(() => import('./pages/customer/About'))
const Contact       = lazy(() => import('./pages/customer/Contact'))

// ─── Admin pages ──────────────────────────────────────────────────────────────
const AdminLogin       = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts    = lazy(() => import('./pages/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'))
const AdminOrders      = lazy(() => import('./pages/admin/AdminOrders'))
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'))
const AdminInventory   = lazy(() => import('./pages/admin/AdminInventory'))
const AdminCategories  = lazy(() => import('./pages/admin/AdminCategories'))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8 text-brand" />
    </div>
  )
}

function NotFound() {
  return (
    <CL>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-6xl font-bold text-brand">404</p>
        <h1 className="font-display text-2xl text-charcoal">Page not found</h1>
        <p className="text-warm-gray">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-2 text-sm font-medium text-brand underline hover:text-brand-dark">
          Back to Home
        </a>
      </div>
    </CL>
  )
}

function CL({ children }: { children: ReactNode }) {
  return <CustomerLayout>{children}</CustomerLayout>
}

function AL({ children }: { children: ReactNode }) {
  return (
    <AdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminRoute>
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

              {/* ── Public customer ── */}
              <Route path="/"                 element={<CL><Home /></CL>} />
              <Route path="/products"         element={<CL><Catalog /></CL>} />
              <Route path="/products/:slug"   element={<CL><ProductDetail /></CL>} />
              <Route path="/categories/:slug" element={<CL><Category /></CL>} />
              <Route path="/cart"             element={<CL><Cart /></CL>} />
              <Route path="/login"            element={<CL><Login /></CL>} />
              <Route path="/about"            element={<CL><About /></CL>} />
              <Route path="/contact"          element={<CL><Contact /></CL>} />

              {/* ── Protected customer ── */}
              <Route path="/checkout"   element={<CL><ProtectedRoute><Checkout /></ProtectedRoute></CL>} />
              <Route path="/orders"     element={<CL><ProtectedRoute><Orders /></ProtectedRoute></CL>} />
              <Route path="/orders/:id" element={<CL><ProtectedRoute><OrderDetail /></ProtectedRoute></CL>} />

              {/* ── Admin ── */}
              <Route path="/admin"                      element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login"                element={<AdminLogin />} />
              <Route path="/admin/dashboard"            element={<AL><AdminDashboard /></AL>} />
              <Route path="/admin/products"             element={<AL><AdminProducts /></AL>} />
              <Route path="/admin/products/new"         element={<AL><AdminProductForm /></AL>} />
              <Route path="/admin/products/:id/edit"    element={<AL><AdminProductForm /></AL>} />
              <Route path="/admin/orders"               element={<AL><AdminOrders /></AL>} />
              <Route path="/admin/orders/:id"           element={<AL><AdminOrderDetail /></AL>} />
              <Route path="/admin/inventory"            element={<AL><AdminInventory /></AL>} />
              <Route path="/admin/categories"           element={<AL><AdminCategories /></AL>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
