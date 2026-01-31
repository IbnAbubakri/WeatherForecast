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
}

const RECENT_CITIES_KEY = 'weather-app-recent-cities'
const MAX_RECENT = 5

export function RecentCities({ onCitySelect }: RecentCitiesProps) {
  const [recentCities, setRecentCities] = useState<RecentCity[]>([])

  useEffect(() => {
    // Load recent cities from localStorage
    const stored = localStorage.getItem(RECENT_CITIES_KEY)
    if (stored) {
      try {
        const cities = JSON.parse(stored) as RecentCity[]
        setRecentCities(cities)
      } catch (error) {
        console.error('Error parsing recent cities:', error)
      }
    }
  }, [])

  const addRecentCity = (cityName: string) => {
    const newCity: RecentCity = {
      name: cityName,
      timestamp: Date.now(),
    }

    setRecentCities((prev) => {
      // Remove if already exists
      const filtered = prev.filter((c) => c.name.toLowerCase() !== cityName.toLowerCase())
      // Add new city at the beginning and keep only MAX_RECENT
      const updated = [newCity, ...filtered].slice(0, MAX_RECENT)

      // Save to localStorage
      localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(updated))

      return updated
    })
  }

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

  // Expose addRecentCity function via a custom event or callback
  useEffect(() => {
    // Listen for custom event to add recent city
    const handleAddRecent = ((e: CustomEvent<{ city: string }>) => {
      addRecentCity(e.detail.city)
    }) as EventListener

    window.addEventListener('add-recent-city', handleAddRecent)

    return () => {
      window.removeEventListener('add-recent-city', handleAddRecent)
    }
  }, [])

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
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentCities.map((city, index) => (
          <motion.button
            key={city.name}
            onClick={() => onCitySelect(city.name)}
            className="group relative flex items-center gap-2 px-4 py-2 bg-card/50 border border-border rounded-lg hover:bg-card hover:border-primary/50 transition-all"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm text-foreground">{city.name}</span>
            <button
              onClick={(e) => removeCity(city.name, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
            </button>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Helper function to dispatch the add recent city event
export function addRecentCity(cityName: string) {
  window.dispatchEvent(new CustomEvent('add-recent-city', { detail: { city: cityName } }))
}
