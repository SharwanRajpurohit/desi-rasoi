import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
