import { DailyForecast } from '@/types/weather'
import { Card, CardContent } from '@/components/ui/card'
import { WeatherIcon } from '@/components/WeatherIcon'
import { motion } from 'framer-motion'

interface AnimatedForecastCardProps {
  data: DailyForecast
  unit: 'metric' | 'imperial'
  index: number
}

// Helper function to convert temperature
function convertTemp(temp: number, fromUnit: 'metric' | 'imperial', toUnit: 'metric' | 'imperial'): number {
  if (fromUnit === toUnit) return temp
  if (fromUnit === 'metric') {
    // Convert Celsius to Fahrenheit
    return (temp * 9/5) + 32
  } else {
    // Convert Fahrenheit to Celsius
    return (temp - 32) * 5/9
  }
}

export function AnimatedForecastCard({ data, unit, index }: AnimatedForecastCardProps) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(data.date)
  const dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(data.date)

  // Data comes in metric from API, convert if needed
  const displayTempMax = convertTemp(data.temp.max, 'metric', unit)
  const displayTempMin = convertTemp(data.temp.min, 'metric', unit)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card className="glass-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl h-full">
        <CardContent className="p-5">
          <div className="flex flex-col items-center gap-4">
            {/* Date */}
            <div className="text-center w-full">
              <p className="font-semibold text-lg text-foreground">{dayName}</p>
              <p className="text-sm text-muted-foreground">{dateStr}</p>
            </div>

            {/* Weather Icon */}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatDelay: 4,
                delay: index * 0.3,
              }}
            >
              <WeatherIcon
                iconCode={data.weather.icon}
                size={72}
                className="text-primary"
              />
            </motion.div>

            {/* Weather Description */}
            <p className="text-sm text-muted-foreground capitalize text-center h-5">
              {data.weather.description}
            </p>

            {/* Temperature */}
            <div className="w-full flex gap-3">
              <motion.div
                className="flex-1 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-3 border border-accent/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">High</p>
                <p className="text-xl font-bold text-accent">
                  {Math.round(displayTempMax)}°
                </p>
              </motion.div>
              <motion.div
                className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">Low</p>
                <p className="text-xl font-bold text-primary">
                  {Math.round(displayTempMin)}°
                </p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
