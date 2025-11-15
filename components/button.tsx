"use client"

import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantStyles = {
      default: 'bg-[--color-primary] text-white hover:bg-[--color-primary-dark]',
      outline: 'border border-[--color-border] text-[--color-text] hover:bg-[--color-surface]',
      ghost: 'text-[--color-text] hover:bg-[--color-surface]',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`

    return (
      <button
        ref={ref}
        className={styles}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
