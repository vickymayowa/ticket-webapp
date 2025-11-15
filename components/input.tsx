"use client"

import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className="input-field"
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
