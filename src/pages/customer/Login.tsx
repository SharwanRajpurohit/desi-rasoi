import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function Login() {
  const { signIn, customer } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  if (customer) {
    navigate(from, { replace: true })
    return null
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signIn(email, name)
      success(`Welcome, ${name.split(' ')[0]}!`)
      navigate(from, { replace: true })
    } catch (err) {
      error(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
            <ChefHat className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl text-charcoal">Welcome to Desi Rasoi</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Sign in or create your account — just enter your name and email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-md space-y-4"
        >
          <Input
            label="Your Name"
            required
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <Button type="submit" loading={loading} fullWidth className="mt-2">
            Continue to Shop
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-warm-gray">
          Demo mode — any email registers a new account.{' '}
          <Link to="/about" className="text-brand hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  )
}
