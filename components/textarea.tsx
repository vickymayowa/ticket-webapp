"use client"

import * as React from "react"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className="input-field resize-none"
      ref={ref}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"

export { Textarea }
