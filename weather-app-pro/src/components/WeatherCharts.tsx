import { useState } from 'react'
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
import { Droplets, Wind, Thermometer, ChevronDown, Waves, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChartType = 'temperature' | 'precipitation' | 'wind' | 'humidity' | 'pressure' | 'feels_like' | null

interface WeatherChartsProps {
  forecast: DailyForecast[]
  unit: 'metric' | 'imperial'
}

export function WeatherCharts({ forecast, unit }: WeatherChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>(null)

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
    pressure: 1013, // Default pressure (would need to be added to DailyForecast type)
    feelsLike: Math.round((day.temp.min + day.temp.max) / 2), // Approximate feels like
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
    {
      type: 'pressure' as ChartType,
      label: 'Pressure',
      icon: Gauge,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    },
    {
      type: 'feels_like' as ChartType,
      label: 'Feels Like',
      icon: Thermometer,
      gradient: 'from-rose-500 to-orange-500',
      bgGradient: 'bg-gradient-to-r from-rose-500 to-orange-500',
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name={`Max (${tempUnit})`}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="min"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name={`Min (${tempUnit})`}
                    dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '8px',
                      color: '#fff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ color: '#38BDF8' }}
                    formatter={(value: number) => [`${value}%`, 'Probability']}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="precipitation"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#precipGradient)"
                    name="Precipitation %"
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value} ${speedUnit}`, 'Wind']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="wind"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                    name={`Speed (${speedUnit})`}
                    dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value}%`, 'Humidity']}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    stroke="hsl(180, 70%, 50%)"
                    strokeWidth={3}
                    fill="url(#humidityGradient)"
                    name="Humidity %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeChart === 'pressure' && (
          <motion.div
            key="pressure"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <Gauge className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Pressure Trend</h3>
              </div>
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
                    domain={[990, 1030]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value} hPa`, 'Pressure']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={3}
                    name="Pressure (hPa)"
                    dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeChart === 'feels_like' && (
          <motion.div
            key="feels_like"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-rose-500/20 p-2 rounded-lg">
                  <Thermometer className="h-5 w-5 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Feels Like vs Actual</h3>
              </div>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number, name: string) => [`${value}${tempUnit}`, name]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Actual Temp"
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="feelsLike"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Feels Like"
                    dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
