// © 2026 Abubakri Faaruq Adebowale (IbnAbubakri). All rights reserved.
// Faruqsuzay@gmail.com | +2349061345507

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full [&_.recharts-cartesian-grid-stroke]:stroke-border [&_.recharts-text]:fill-muted-foreground", className)}
      style={{
        ...(config
          ? Object.fromEntries(
              Object.entries(config).map(([key, val]) => [`--color-${key}`, val.color])
            )
          : {}),
      }}
      {...props}
    >
      {children}
    </div>
  )
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean
    payload?: Array<{ name?: string; value?: number; color?: string }>
    label?: string
  }
>(({ className, active, payload, label, ...props }, ref) => {
  if (!active || !payload?.length) return null
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card px-3 py-2 text-sm shadow-md",
        className
      )}
      {...props}
    >
      {label && <p className="font-medium text-foreground mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          {entry.color && (
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          )}
          <span className="text-muted-foreground">{entry.name ?? entry.name}:</span>
          <span className="font-medium text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltipContent }
