import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Customer } from '../types'
import {
  loginCustomer,
  logoutCustomer,
  getCurrentCustomer,
  isCustomerLoggedIn,
  loginAdmin,
  logoutAdmin,
  isAdminLoggedIn,
} from '../services/auth'

interface AuthContextValue {
  customer: Customer | null
  isCustomer: boolean
  isAdmin: boolean
  signIn: (email: string, name: string) => Promise<void>
  signOut: () => void
  adminLogin: (username: string, password: string) => Promise<boolean>
  adminLogout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => getCurrentCustomer())
  const [isAdmin, setIsAdmin] = useState(() => isAdminLoggedIn())

  useEffect(() => {
    setCustomer(getCurrentCustomer())
    setIsAdmin(isAdminLoggedIn())
  }, [])

  const signIn = useCallback(async (email: string, name: string) => {
    const c = await loginCustomer(email, name)
    setCustomer(c)
  }, [])

  const signOut = useCallback(() => {
    logoutCustomer()
    setCustomer(null)
  }, [])

  const adminLogin = useCallback(async (username: string, password: string) => {
    const ok = await loginAdmin(username, password)
    setIsAdmin(ok)
    return ok
  }, [])

  const adminLogout = useCallback(() => {
    logoutAdmin()
    setIsAdmin(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        customer,
        isCustomer: isCustomerLoggedIn(),
        isAdmin,
        signIn,
        signOut,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
