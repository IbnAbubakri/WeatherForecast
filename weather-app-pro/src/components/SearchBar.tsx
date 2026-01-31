import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Loader2, Navigation } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { geocodingService, CitySuggestion } from '@/services/geocodingService'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBarProps {
  onSearch: (city: string) => void
  onLocationClick?: () => void
  loading?: boolean
}

export function SearchBar({ onSearch, onLocationClick, loading }: SearchBarProps) {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Don't search if input is too short
    if (city.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce the API call
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true)
      try {
        const results = await geocodingService.searchCities(city, 5)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch (error) {
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoadingSuggestions(false)
      }
    }, 300)

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [city])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (suggestion: CitySuggestion) => {
    setCity(suggestion.name)
    setShowSuggestions(false)
    onSearch(suggestion.name)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <motion.div
          className="relative flex items-center bg-card border-2 border-border rounded-xl overflow-hidden focus-within:border-primary transition-all shadow-sm"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {onLocationClick && (
            <motion.button
              type="button"
              onClick={onLocationClick}
              disabled={loading}
              className="pl-4 pr-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Navigation className={`h-5 w-5 ${loading ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} />
            </motion.button>
          )}
          <motion.div
            className="pl-3 pr-3"
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </motion.div>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoComplete="off"
          />
          {isLoadingSuggestions && (
            <div className="pr-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoadingSuggestions && city.trim() && (
            <Button
              type="submit"
              disabled={loading}
              className="mr-2"
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </Button>
          )}
        </motion.div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuggestions(false)}
            />
            <motion.div
              className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-h-80 overflow-y-auto py-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={`${suggestion.name}-${suggestion.country}-${index}`}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelectSuggestion(suggestion)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 border-b border-border/50 last:border-b-0"
                    whileHover={{ x: 4 }}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">
                        {suggestion.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
