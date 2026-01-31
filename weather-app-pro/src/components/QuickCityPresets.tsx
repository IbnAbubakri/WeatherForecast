import { motion } from 'framer-motion'

interface QuickCityProps {
  onCitySelect: (city: string) => void
}

export function QuickCityPresets({ onCitySelect }: QuickCityProps) {
  const popularCities = [
    { name: 'New York', flag: '🗽' },
    { name: 'London', flag: '🇬🇧' },
    { name: 'Tokyo', flag: '🗼' },
    { name: 'Paris', flag: '🗼' },
    { name: 'Dubai', flag: '🏙️' },
    { name: 'Sydney', flag: '🦘' },
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
        {popularCities.map((city, index) => (
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
            <span className="text-xl">{city.flag}</span>
            <span className="text-sm font-medium text-foreground">{city.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
