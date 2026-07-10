import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function AdminLogin() {
  const { adminLogin, isAdmin } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const ok = await adminLogin(username, password)
      if (ok) {
        success('Welcome back, Admin!')
        navigate('/admin/dashboard', { replace: true })
      } else {
        setErr('Invalid username or password')
        error('Invalid credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-indigo px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-2xl text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-white/60">Desi Rasoi Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl space-y-4">
          <Input
            label="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />
          {err && <p className="text-xs text-royal">{err}</p>}
          <Button type="submit" loading={loading} fullWidth>
            Sign In
          </Button>
          <p className="text-center text-xs text-warm-gray">
            Demo: <code className="rounded bg-sand px-1">admin / desirasoi2026</code>
          </p>
        </form>
        <p className="mt-6 text-center text-xs text-white/40">
          <a href="/" className="hover:text-white/70 transition-colors">← Back to store</a>
        </p>
      </div>
    </div>
  )
}
