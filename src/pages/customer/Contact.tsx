import { useState, type FormEvent } from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useToast } from '../../context/ToastContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

export default function Contact() {
  useDocumentTitle('Contact Us')
  const { success } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    success('Message sent! (Demo mode — nothing was actually sent)')
    setForm({ name: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand">Get in Touch</p>
      <h1 className="mt-2 font-display text-3xl text-charcoal">Contact Us</h1>
      <p className="mt-3 text-warm-gray">
        Questions about our products or your order? We'd love to hear from you.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl bg-white p-8 shadow-md">
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-charcoal">
            Message <span className="text-royal">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-sand-dark bg-white px-3 py-2 text-sm text-charcoal placeholder-warm-gray focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Your message…"
          />
        </div>
        <Button type="submit" loading={loading} fullWidth>
          Send Message
        </Button>
      </form>
    </div>
  )
}

