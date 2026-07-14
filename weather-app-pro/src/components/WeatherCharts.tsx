// © 2026 Abubakri Faaruq Adebowale (IbnAbubakri). All rights reserved.
// Faruqsuzay@gmail.com | +2349061345507

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { DailyForecast } from '@/types/weather'
import { Droplets, Wind, Thermometer, ChevronDown, Waves } from 'lucide-react'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

type ChartType = 'temperature' | 'precipitation' | 'wind' | 'humidity' | null

interface WeatherChartsProps {
  forecast: DailyForecast[]
  unit: 'metric' | 'imperial'
}

export function WeatherCharts({ forecast, unit }: WeatherChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>(null)
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  // Prepare data for charts
  const chartData = forecast.map((day) => ({
    name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    min: Math.round(day.temp.min),
    max: Math.round(day.temp.max),
    avg: Math.round((day.temp.min + day.temp.max) / 2),
    wind: Math.round(day.windSpeed * (unit === 'imperial' ? 2.237 : 1)),
    humidity: day.humidity,
    precipitation: day.pop, // Probability percentage (0-100)
  }))

  const chartButtons = [
    {
      type: 'temperature' as ChartType,
      label: 'Temperature',
      icon: Thermometer,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      type: 'precipitation' as ChartType,
      label: 'Precipitation',
      icon: Droplets,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    },
    {
      type: 'wind' as ChartType,
      label: 'Wind',
      icon: Wind,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
    {
      type: 'humidity' as ChartType,
      label: 'Humidity',
      icon: Waves,
      gradient: 'from-teal-500 to-emerald-500',
      bgGradient: 'bg-gradient-to-r from-teal-500 to-emerald-500',
    },
  ]

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Chart Selector Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {chartButtons.map(({ type, label, icon: Icon, gradient, bgGradient }) => (
          <motion.button
            key={label}
            onClick={() => setActiveChart(activeChart === type ? null : type)}
            className={`relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeChart === type
                ? `${bgGradient} text-white shadow-lg scale-105`
                : 'bg-card text-foreground border-2 border-border hover:border-primary/50 hover:shadow-md'
            }`}
            whileHover={{ scale: activeChart === type ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                activeChart === type ? 'bg-white/20' : 'bg-gradient-to-br ' + gradient
              }`}>
                <Icon className={`h-4 w-4 ${activeChart === type ? 'text-white' : 'text-white'}`} />
              </div>
              <span>{label}</span>
              <motion.div
                animate={{ rotate: activeChart === type ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Chart Display */}
      <AnimatePresence mode="wait">
        {activeChart === 'temperature' && (
          <motion.div
            key="temperature"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Thermometer className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Temperature Forecast</h3>
              </div>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border/30" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="max"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name={`Max (${tempUnit})`}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={!reducedMotion}
                    />
                    <Line
                      type="monotone"
                      dataKey="min"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      name={`Min (${tempUnit})`}
                      dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={!reducedMotion}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>
        )}

        {activeChart === 'precipitation' && (
          <motion.div
            key="precipitation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Precipitation Probability</h3>
              </div>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border/30" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="precipitation"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fill="url(#precipGradient)"
                      name="Precipitation %"
                      isAnimationActive={!reducedMotion}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>
        )}

        {activeChart === 'wind' && (
          <motion.div
            key="wind"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <Wind className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Wind Speed Forecast</h3>
              </div>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border/30" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="wind"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name={`Speed (${speedUnit})`}
                      dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={!reducedMotion}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>
        )}

        {activeChart === 'humidity' && (
          <motion.div
            key="humidity"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-500/20 p-2 rounded-lg">
                  <Waves className="h-5 w-5 text-teal-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Humidity Levels</h3>
              </div>
              <ChartContainer>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(180, 70%, 50%)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="stroke-border/30" />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: '12px' }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="humidity"
                      stroke="hsl(180, 70%, 50%)"
                      strokeWidth={3}
                      fill="url(#humidityGradient)"
                      name="Humidity %"
                      isAnimationActive={!reducedMotion}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  )
}
