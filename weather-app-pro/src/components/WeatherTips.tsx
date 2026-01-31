import { motion } from 'framer-motion'
import { Cloud, Umbrella, Sun, Thermometer, Droplets, AlertTriangle } from 'lucide-react'

interface WeatherTipProps {
  temp: number
  humidity: number
  windSpeed: number
  pop: number
  condition: string
  unit: 'metric' | 'imperial'
}

export function WeatherTips({ temp, humidity, windSpeed, pop, condition, unit }: WeatherTipProps) {
  const getTips = () => {
    const tips = []
    const tempC = unit === 'imperial' ? (temp - 32) * 5/9 : temp

    // Temperature tips
    if (tempC > 30) {
      tips.push({ icon: Thermometer, text: 'Stay hydrated and avoid prolonged sun exposure', color: 'text-red-500', bg: 'bg-red-500/20' })
    } else if (tempC < 5) {
      tips.push({ icon: Thermometer, text: 'Dress warmly in layers', color: 'text-blue-500', bg: 'bg-blue-500/20' })
    } else if (tempC >= 18 && tempC <= 25) {
      tips.push({ icon: Sun, text: 'Perfect weather for outdoor activities!', color: 'text-yellow-500', bg: 'bg-yellow-500/20' })
    }

    // Rain tips
    if (pop > 60) {
      tips.push({ icon: Umbrella, text: 'Take an umbrella with you', color: 'text-cyan-500', bg: 'bg-cyan-500/20' })
    }

    // Humidity tips
    if (humidity > 80) {
      tips.push({ icon: Droplets, text: 'High humidity - may feel warmer than actual temperature', color: 'text-blue-500', bg: 'bg-blue-500/20' })
    }

    // Wind tips
    if (windSpeed > 10) {
      tips.push({ icon: Cloud, text: 'Windy conditions - secure loose objects', color: 'text-gray-500', bg: 'bg-gray-500/20' })
    }

    // Condition-based tips
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      tips.push({ icon: AlertTriangle, text: 'Severe weather - stay indoors if possible', color: 'text-orange-500', bg: 'bg-orange-500/20' })
    }

    return tips
  }

  const tips = getTips()

  if (tips.length === 0) {
    return null
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Weather Tips</h3>
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-3 bg-card/50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`p-2 rounded-lg ${tip.bg} flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${tip.color}`} />
              </div>
              <p className="text-sm text-foreground">{tip.text}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
