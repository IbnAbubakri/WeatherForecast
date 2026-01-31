import { WeatherData } from '@/types/weather'
import { Sunrise, Sunset, Eye, Gauge, Droplets, Thermometer } from 'lucide-react'
import { motion } from 'framer-motion'

interface AdditionalDetailsProps {
  weather: WeatherData
  unit: 'metric' | 'imperial'
}

export function AdditionalDetails({ weather, unit }: AdditionalDetailsProps) {
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'
  const distanceUnit = unit === 'metric' ? 'km' : 'miles'
  const pressureUnit = 'hPa'

  // Convert visibility from meters to km or miles
  const visibility = weather.visibility / 1000
  const visibilityConverted = unit === 'imperial' ? visibility * 0.621371 : visibility

  // Format sunrise and sunset times
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const details = [
    {
      icon: Sunrise,
      label: 'Sunrise',
      value: formatTime(weather.sys.sunrise),
      color: 'text-orange-500',
      bg: 'bg-orange-500/20',
    },
    {
      icon: Sunset,
      label: 'Sunset',
      value: formatTime(weather.sys.sunset),
      color: 'text-purple-500',
      bg: 'bg-purple-500/20',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${Math.round(visibilityConverted)} ${distanceUnit}`,
      color: 'text-blue-500',
      bg: 'bg-blue-500/20',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.main.pressure} ${pressureUnit}`,
      color: 'text-green-500',
      bg: 'bg-green-500/20',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/20',
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${Math.round(weather.main.feels_like)}${unit === 'metric' ? '°C' : '°F'}`,
      color: 'text-red-500',
      bg: 'bg-red-500/20',
    },
  ]

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Weather Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {details.map((detail, index) => {
          const Icon = detail.icon
          return (
            <motion.div
              key={detail.label}
              className="bg-card/50 border border-border rounded-xl p-4 hover:bg-card/80 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`inline-flex p-2 rounded-lg ${detail.bg} mb-3`}>
                <Icon className={`h-5 w-5 ${detail.color}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
              <p className="text-lg font-semibold text-foreground">{detail.value}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
