import { useEffect } from 'react'

const BASE = 'Desi Rasoi'

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Taste of Rajasthan`
    return () => { document.title = `${BASE} — Taste of Rajasthan` }
  }, [title])
}
