import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { History, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RecentCity {
  name: string
  timestamp: number
}

interface RecentCitiesProps {
  onCitySelect: (city: string) => void
  recentCities?: RecentCity[]
  onAddRecent?: (cityName: string) => void
}

const RECENT_CITIES_KEY = 'weather-app-recent-cities'
const MAX_RECENT = 5

function loadRecentCities(): RecentCity[] {
  try {
    const stored = localStorage.getItem(RECENT_CITIES_KEY)
    if (stored) {
      return JSON.parse(stored) as RecentCity[]
    }
  } catch (error) {
    console.error('Error parsing recent cities:', error)
  }
  return []
}

export function RecentCities({ onCitySelect }: RecentCitiesProps) {
  const [recentCities, setRecentCities] = useState<RecentCity[]>(loadRecentCities)

  useEffect(() => {
    const handler = () => {
      setRecentCities(loadRecentCities())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const removeCity = (cityName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentCities((prev) => {
      const updated = prev.filter((c) => c.name !== cityName)
      localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearAll = () => {
    setRecentCities([])
    localStorage.removeItem(RECENT_CITIES_KEY)
  }

  if (recentCities.length === 0) {
    return null
  }

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentCities.map((city, index) => (
          <motion.button
            key={city.name}
            onClick={() => onCitySelect(city.name)}
            className="group relative flex items-center gap-2 px-4 py-2 bg-card/50 border border-border rounded-lg hover:bg-card hover:border-primary/50 transition-all cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm text-foreground">{city.name}</span>
            <button
              onClick={(e) => removeCity(city.name, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded cursor-pointer"
              aria-label={`Remove ${city.name}`}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function addRecentCity(cityName: string) {
  const cities = loadRecentCities()
  const filtered = cities.filter((c) => c.name.toLowerCase() !== cityName.toLowerCase())
  const updated = [{ name: cityName, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated))
  window.dispatchEvent(new Event('storage'))
}
