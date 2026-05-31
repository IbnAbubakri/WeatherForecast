"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
    theme?: { light?: string; dark?: string }
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactElement
}

function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  const cssVars = React.useMemo(() => {
    const vars: Record<string, string> = {}
    Object.entries(config).forEach(([key, value]) => {
      if (value.color) {
        vars[`--color-${key}`] = value.color
      }
      if (value.theme?.light) {
        vars[`--color-${key}-light`] = value.theme.light
      }
      if (value.theme?.dark) {
        vars[`--color-${key}-dark`] = value.theme.dark
      }
    })
    return vars
  }, [config])

  return (
    <div
      className={cn("w-full", className)}
      style={cssVars as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; dataKey: string; stroke: string; fill: string }>
  label?: string
  labelKey?: string
  nameKey?: string
  indicator?: "dot" | "line" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  formatter?: (value: number, name: string) => string
}

function ChartTooltipContent({
  active,
  payload,
  label,
  labelKey,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  formatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      {!hideLabel && (
        <div className="mb-1 font-medium text-foreground">{label ?? labelKey}</div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry, index) => {
          const value = formatter
            ? formatter(entry.value, entry.name ?? entry.dataKey)
            : `${entry.value}`
          return (
            <div key={index} className="flex items-center gap-2">
              {!hideIndicator && indicator === "dot" && (
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.fill || entry.stroke }}
                />
              )}
              {!hideIndicator && indicator === "line" && (
                <div
                  className="h-0.5 w-4"
                  style={{ backgroundColor: entry.stroke }}
                />
              )}
              <span className="text-muted-foreground">{entry.name ?? entry.dataKey}:</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap items-center gap-4 pt-4", className)}
    {...props}
  />
))
ChartLegend.displayName = "ChartLegend"

interface ChartLegendContentProps {
  payload?: Array<{ value: string; color: string }>
}

function ChartLegendContent({ payload }: ChartLegendContentProps) {
  if (!payload?.length) return null
  return (
    <div className="flex flex-wrap gap-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent }
export type { ChartConfig }
