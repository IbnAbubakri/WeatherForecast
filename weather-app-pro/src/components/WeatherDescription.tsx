import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react'

interface WeatherDescriptionProps {
  temp: number
  condition: string
  description: string
  isDay: boolean
  unit: 'metric' | 'imperial'
}

export function WeatherDescription({ temp, condition, description, isDay, unit }: WeatherDescriptionProps) {
  const getDynamicDescription = () => {
    const tempC = unit === 'imperial' ? (temp - 32) * 5/9 : temp
    const conditionLower = condition.toLowerCase()

    // Time-based greeting
    const hour = new Date().getHours()
    let greeting = 'Good evening'
    if (hour < 12) greeting = 'Good morning'
    else if (hour < 18) greeting = 'Good afternoon'

    // Weather-based descriptions
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      if (isDay) {
        if (tempC > 25) return `${greeting}! It's a beautiful hot sunny day. Perfect for the beach!`
        if (tempC > 18) return `${greeting}! Lovely weather ahead. Great day to be outdoors!`
        return `${greeting}! Clear skies and crisp air. Enjoy the sunshine!`
      }
      return `${greeting}! Clear night sky. Perfect for stargazing!`
    }

    if (conditionLower.includes('cloud')) {
      if (tempC > 20) return `${greeting}! Partly cloudy with warm temperatures. Comfortable day!`
      return `${greeting}! Cloudy skies providing some nice shade. Mild temperatures.`
    }

    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return `${greeting}! Don't forget your umbrella. Rain is in the forecast today.`
    }

    if (conditionLower.includes('snow')) {
      return `${greeting}! Snow is falling! Bundle up and stay warm.`
    }

    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return `${greeting}! Stormy weather ahead. Stay safe and indoors if possible.`
    }

    if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return `${greeting}! Reduced visibility due to fog. Drive carefully!`
    }

    return `${greeting}! ${description.charAt(0).toUpperCase() + description.slice(1)}.`
  }

  const getWeatherIcon = () => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      return Sun
    }
    if (conditionLower.includes('cloud')) {
      return Cloud
    }
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return CloudRain
    }
    if (conditionLower.includes('snow')) {
      return CloudSnow
    }
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return CloudLightning
    }
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return CloudFog
    }
    return Cloud
  }

  const WeatherIcon = getWeatherIcon()
  const dynamicDescription = getDynamicDescription()

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <WeatherIcon className="h-12 w-12 text-primary" />
      </motion.div>

      <motion.p
        className="text-xl font-medium text-foreground leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {dynamicDescription}
      </motion.p>
    </motion.div>
  )
}
