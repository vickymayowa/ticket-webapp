"use client"

import * as React from "react"

interface TabsContextType {
  activeTab: string
  onTabChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    return (
      <TabsContext.Provider value={{ activeTab, onTabChange: setActiveTab }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ ...props }, ref) => (
    <div
      ref={ref}
      className="flex border-b border-[--color-border] mb-6 gap-2"
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    if (!context) {
      throw new Error("TabsTrigger must be used within Tabs")
    }

    const isActive = context.activeTab === value

    return (
      <button
        ref={ref}
        onClick={() => context.onTabChange(value)}
        className={`px-4 py-2 font-medium border-b-2 transition-colors ${
          isActive
            ? 'border-[--color-primary] text-[--color-primary]'
            : 'border-transparent text-[--color-text-muted] hover:text-[--color-text]'
        }`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext)

    if (!context) {
      throw new Error("TabsContent must be used within Tabs")
    }

    if (context.activeTab !== value) {
      return null
    }

    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
