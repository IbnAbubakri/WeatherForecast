import { DailyForecast } from '@/types/weather'
import { AnimatedForecastCard } from './AnimatedForecastCard'
import { motion } from 'framer-motion'

interface AnimatedWeatherForecastProps {
  forecast: DailyForecast[]
  unit: 'metric' | 'imperial'
}

export function AnimatedWeatherForecast({ forecast, unit }: AnimatedWeatherForecastProps) {
  return (
    <div className="space-y-6">
      <motion.h2
        className="text-2xl font-bold text-foreground"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        5-Day Forecast
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <AnimatedForecastCard key={index} data={day} unit={unit} index={index} />
        ))}
      </div>
    </div>
  )
}
