import { WeatherData } from '@/types/weather'
import { Card, CardContent } from '@/components/ui/card'
import { WeatherIcon } from '@/components/WeatherIcon'
import { Wind, Droplets, Eye, Gauge } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnimatedCurrentWeatherProps {
  data: WeatherData
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

// Helper function to convert wind speed
function convertWind(speed: number, fromUnit: 'metric' | 'imperial', toUnit: 'metric' | 'imperial'): number {
  if (fromUnit === toUnit) return speed
  if (fromUnit === 'metric') {
    // Convert m/s to mph
    return speed * 2.237
  } else {
    // Convert mph to m/s
    return speed / 2.237
  }
}

export function AnimatedCurrentWeather({ data, unit, index }: AnimatedCurrentWeatherProps) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  // Data comes in metric from API, so we need to convert if needed
  const displayTemp = convertTemp(data.main.temp, 'metric', unit)
  const displayFeelsLike = convertTemp(data.main.feels_like, 'metric', unit)
  const displayWindSpeed = convertWind(data.wind.speed, 'metric', unit)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="glass-card premium-shadow overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-4 sm:p-6 md:p-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Left: Temperature and Icon */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <motion.div
                className="flex-shrink-0"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <WeatherIcon
                  iconCode={data.weather[0].icon}
                  size={120}
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-primary"
                />
              </motion.div>
              <div className="text-center sm:text-left">
                <motion.div
                  className="flex items-baseline justify-center sm:justify-start gap-1 sm:gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tighter">
                    {Math.round(displayTemp)}°
                  </span>
                  <span className="text-xl sm:text-2xl text-muted-foreground">{tempUnit.replace('°', '')}</span>
                </motion.div>
                <motion.p
                  className="text-base sm:text-lg text-muted-foreground capitalize mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {data.weather[0].description}
                </motion.p>
                <motion.p
                  className="text-sm text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Feels like {Math.round(displayFeelsLike)}{tempUnit}
                </motion.p>
              </div>
            </div>

            {/* Right: Location and Details */}
            <div className="space-y-6">
              <motion.div
                className="text-center sm:text-left"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-3xl font-bold text-foreground">{data.name}</h3>
                <p className="text-muted-foreground mt-1">{data.sys.country}</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Wind, label: 'Wind', value: Math.round(displayWindSpeed), unit: speedUnit, color: 'text-primary' },
                  { icon: Droplets, label: 'Humidity', value: data.main.humidity, unit: '%', color: 'text-primary' },
                  { icon: Eye, label: 'Visibility', value: (data.visibility / 1000).toFixed(1), unit: 'km', color: 'text-primary' },
                  { icon: Gauge, label: 'Pressure', value: data.main.pressure, unit: 'hPa', color: 'text-primary' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="bg-muted/50 rounded-lg p-4 border border-border/50 hover:bg-muted/70 transition-colors cursor-default"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {stat.value} <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
