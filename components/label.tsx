"use client"

import * as React from "react"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className="block text-sm font-medium text-[--color-text] mb-2"
      {...props}
    />
  )
)
Label.displayName = "Label"

export { Label }
