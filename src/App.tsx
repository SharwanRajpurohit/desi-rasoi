import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/customer/Home'
import AdminHome from './pages/admin/AdminHome'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sand px-4 text-center">
            <h1 className="font-display text-4xl text-brand">404</h1>
            <p className="text-warm-gray">Page not found.</p>
            <Link to="/" className="text-brand underline hover:text-brand-dark">
              Back to home
            </Link>
          </div>
        }
      />
    </Routes>
  )
}
