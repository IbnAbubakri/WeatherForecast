import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface WeeklySummaryProps {
  dailyForecast: any[]
  unit: 'metric' | 'imperial'
}

export function WeeklySummary({ dailyForecast, unit }: WeeklySummaryProps) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'

  // Calculate averages
  const avgHigh = Math.round(
    dailyForecast.reduce((sum, day) => sum + day.temp.max, 0) / dailyForecast.length
  )
  const avgLow = Math.round(
    dailyForecast.reduce((sum, day) => sum + day.temp.min, 0) / dailyForecast.length
  )
  const avgHumidity = Math.round(
    dailyForecast.reduce((sum, day) => sum + day.humidity, 0) / dailyForecast.length
  )

  // Count conditions
  const sunnyDays = dailyForecast.filter(d => d.weather.main.toLowerCase().includes('clear')).length
  const rainyDays = dailyForecast.filter(d =>
    d.weather.main.toLowerCase().includes('rain') ||
    d.weather.main.toLowerCase().includes('drizzle')
  ).length
  const cloudyDays = dailyForecast.filter(d => d.weather.main.toLowerCase().includes('cloud')).length

  const getWeeklyTrend = () => {
    const firstDay = dailyForecast[0].temp.max
    const lastDay = dailyForecast[dailyForecast.length - 1].temp.max
    if (lastDay > firstDay + 2) return { icon: TrendingUp, text: 'Warming up', color: 'text-red-500' }
    if (lastDay < firstDay - 2) return { icon: TrendingDown, text: 'Cooling down', color: 'text-blue-500' }
    return { icon: Minus, text: 'Stable', color: 'text-gray-500' }
  }

  const trend = getWeeklyTrend()
  const TrendIcon = trend.icon

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Weekly Summary</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-card/50 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Avg High</p>
          <p className="text-2xl font-bold text-foreground">{avgHigh}{tempUnit}</p>
        </div>

        <div className="bg-card/50 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Avg Low</p>
          <p className="text-2xl font-bold text-foreground">{avgLow}{tempUnit}</p>
        </div>

        <div className="bg-card/50 border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Avg Humidity</p>
          <p className="text-2xl font-bold text-foreground">{avgHumidity}%</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between bg-card/50 border border-border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <TrendIcon className={`h-5 w-5 ${trend.color}`} />
          <span className="text-sm text-foreground">{trend.text}</span>
        </div>

        <div className="flex gap-4 text-sm">
          <span>☀️ {sunnyDays}</span>
          <span>☁️ {cloudyDays}</span>
          <span>🌧️ {rainyDays}</span>
        </div>
      </div>
    </motion.div>
  )
}
