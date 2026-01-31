import { motion } from 'framer-motion'
import type { HourlyForecast as HourlyForecastType } from '@/types/weather'
import { Clock, Droplets, Wind } from 'lucide-react'
import { WeatherIcon } from '@/components/WeatherIcon'

interface HourlyForecastProps {
  hourly: HourlyForecastType[]
  unit: 'metric' | 'imperial'
}

export function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Hourly Forecast</h3>
        <span className="text-sm text-muted-foreground">Next 24 hours</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {hourly.map((hour, index) => {
          const timeStr = hour.time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          })

          return (
            <motion.div
              key={hour.time.toISOString()}
              className="flex-shrink-0 w-28 bg-card/50 border border-border rounded-xl p-4 hover:bg-card/80 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <p className="text-sm font-medium text-foreground mb-2">{timeStr}</p>
              <div className="flex justify-center mb-2">
                <WeatherIcon iconCode={hour.weather.icon} size={48} />
              </div>
              <p className="text-xl font-bold text-center text-foreground">
                {Math.round(hour.temp)}{tempUnit}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 justify-center">
                <Droplets className="h-3 w-3" />
                <span>{hour.pop}%</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 justify-center">
                <Wind className="h-3 w-3" />
                <span>{Math.round(hour.windSpeed * (unit === 'imperial' ? 2.237 : 1))}</span>
                <span className="text-[10px]">{speedUnit}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 justify-center">
                ☁️ <span>{hour.clouds}%</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
