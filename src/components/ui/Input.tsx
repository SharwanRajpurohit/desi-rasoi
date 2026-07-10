import { type InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, required, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-charcoal">
            {label}
            {required && <span className="ml-0.5 text-royal">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={clsx(
            'h-10 w-full rounded-lg border px-3 text-sm text-charcoal placeholder-warm-gray transition focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-royal bg-red-50' : 'border-sand-dark bg-white hover:border-warm-gray',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-royal">{error}</p>}
        {hint && !error && <p className="text-xs text-warm-gray">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
