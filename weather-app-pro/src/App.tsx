import { useEffect, useState, lazy, Suspense } from 'react'
import { useWeather } from '@/hooks/useWeather'
import { SearchBar } from '@/components/SearchBar'
import { UnitToggle } from '@/components/UnitToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AnimatedCurrentWeather } from '@/components/AnimatedCurrentWeather'
import { AnimatedWeatherForecast } from '@/components/AnimatedWeatherForecast'
import { HourlyForecast } from '@/components/HourlyForecast'
import { RecentCities, addRecentCity } from '@/components/RecentCities'
import { WeatherBackground } from '@/components/WeatherBackground'
import { WeatherMap } from '@/components/WeatherMap'

import { WeatherSkeleton, ForecastSkeleton } from '@/components/WeatherSkeleton'
import { Cloud, CloudRain, AlertCircle, ChevronDown, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const WeatherCharts = lazy(() => import('@/components/WeatherCharts').then(m => ({ default: m.WeatherCharts })))

function App() {
  const { currentWeather, dailyForecast, hourlyForecast, loading, error, unit, fetchWeather, fetchWeatherByLocation, toggleUnit } = useWeather()
  const [showForecast, setShowForecast] = useState(false)

  useEffect(() => {
    // Load default city (Lagos) on mount
    fetchWeather('Lagos')
  }, [])

  const handleSearch = (city: string) => {
    fetchWeather(city)
    addRecentCity(city)
  }

  const handleRecentCitySelect = (city: string) => {
    fetchWeather(city)
  }

  return (
    <WeatherBackground
      weatherCondition={currentWeather?.weather[0]?.main || ''}
      isDay={true}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg">
        Skip to main content
      </a>
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl">
          {/* Header */}
          <motion.header
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.div
                className="flex items-center gap-3 sm:gap-4"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.div
                  className="bg-gradient-to-br from-primary/20 to-secondary/20 p-2 sm:p-3 rounded-xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                >
                  <CloudRain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    WeatherSphere
                  </h1>

                </div>
              </motion.div>
              <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <UnitToggle unit={unit} onToggle={toggleUnit} />
                </motion.div>
                <ThemeToggle />
              </div>
            </div>
          </motion.header>

          {/* Search */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SearchBar onSearch={handleSearch} onLocationClick={fetchWeatherByLocation} loading={loading} />
          </motion.div>

          {/* Recent Cities */}
          <RecentCities onCitySelect={handleRecentCitySelect} />

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                role="alert"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Unable to fetch weather</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchWeather('Lagos')}
                >
                  Try Lagos
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Weather */}
          {loading && !currentWeather ? (
            <motion.div
              className="mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <WeatherSkeleton />
            </motion.div>
          ) : currentWeather ? (
            <>
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatedCurrentWeather data={currentWeather} unit={unit} index={0} />
              </motion.div>

              {/* Hourly Forecast */}
              {hourlyForecast.length > 0 && (
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  <HourlyForecast hourly={hourlyForecast} unit={unit} />
                </motion.div>
              )}

              {/* Weather Map */}
              <div className="mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  <WeatherMap lat={currentWeather.coord.lat} lon={currentWeather.coord.lon} />
                </motion.div>
              </div>

            </>
          ) : null}

          {/* Forecast */}
          {loading && !dailyForecast.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ForecastSkeleton />
            </motion.div>
          ) : dailyForecast.length > 0 ? (
            <>
              {/* 5-Day Forecast Toggle Button */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    onClick={() => setShowForecast(!showForecast)}
                    variant="outline"
                    className="w-full justify-between h-auto py-5 px-6
                      bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10
                      hover:from-primary/20 hover:via-primary/10 hover:to-secondary/20
                      border-2 border-primary/20 hover:border-primary/40
                      shadow-lg hover:shadow-xl
                      rounded-2xl
                      transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl"
                        animate={{
                          rotate: showForecast ? [0, 10, -10, 0] : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                        }}
                      >
                        <Calendar className="h-5 w-5 text-primary" />
                      </motion.div>
                      <span className="font-semibold text-lg">5-Day Forecast</span>
                    </span>
                    <motion.div
                      animate={{ rotate: showForecast ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="p-1 bg-primary/10 rounded-lg"
                    >
                      <ChevronDown className="h-5 w-5 text-primary" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Collapsible Forecast Content */}
              <AnimatePresence>
                {showForecast && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mb-10"
                    >
                      <AnimatedWeatherForecast forecast={dailyForecast} unit={unit} />
                    </motion.div>

                    {/* Weather Charts */}
                    <Suspense fallback={<div className="h-10" />}>
                      <WeatherCharts forecast={dailyForecast} unit={unit} />
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>


            </>
          ) : null}

          {/* Empty State */}
          {!loading && !currentWeather && !error && (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mb-6"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Cloud className="h-10 w-10 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No Weather Data
              </h2>
              <p className="text-muted-foreground mb-6">
                Search for a city to get started
              </p>
              <motion.div
                className="flex flex-wrap justify-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {['London', 'New York', 'Tokyo', 'Paris', 'Lagos'].map((city, index) => (
                  <motion.button
                    key={city}
                    onClick={() => fetchWeather(city)}
                    className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all hover:scale-105 hover:shadow-md cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {city}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.footer
            className="mt-20 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p>
              Powered by{' '}
              <a
                href="https://openweathermap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                OpenWeatherMap
              </a>{' '}
              API
            </p>
          </motion.footer>
        </div>
      </div>
    </WeatherBackground>
  )
}

export default App
