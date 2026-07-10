import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return this.props.fallback ?? (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">⚠️</div>
        <h2 className="font-display text-xl text-charcoal">Something went wrong</h2>
        <p className="max-w-sm text-sm text-warm-gray">{this.state.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={this.handleReset}
          className="mt-2 rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }
}
