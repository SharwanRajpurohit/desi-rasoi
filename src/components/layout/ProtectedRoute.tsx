import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { customer } = useAuth()
  const location = useLocation()

  if (!customer) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
