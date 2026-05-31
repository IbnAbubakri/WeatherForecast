import { motion } from 'framer-motion'
import { Building2, Landmark } from 'lucide-react'

interface QuickCityProps {
  onCitySelect: (city: string) => void
}

export function QuickCityPresets({ onCitySelect }: QuickCityProps) {
  const popularCities = [
    { name: 'New York', icon: Building2 },
    { name: 'London', icon: Landmark },
    { name: 'Tokyo', icon: Building2 },
    { name: 'Paris', icon: Landmark },
    { name: 'Dubai', icon: Building2 },
    { name: 'Sydney', icon: Building2 },
  ]

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Popular Cities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {popularCities.map((city, index) => {
          const Icon = city.icon
          return (
            <motion.button
              key={city.name}
              onClick={() => onCitySelect(city.name)}
              className="flex items-center gap-2 p-3 bg-card/50 hover:bg-card border border-border hover:border-primary/50 rounded-lg transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{city.name}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
