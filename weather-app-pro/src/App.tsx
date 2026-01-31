import { useEffect, useState } from 'react'
import { useWeather } from '@/hooks/useWeather'
import { SearchBar } from '@/components/SearchBar'
import { UnitToggle } from '@/components/UnitToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AnimatedCurrentWeather } from '@/components/AnimatedCurrentWeather'
import { AnimatedWeatherForecast } from '@/components/AnimatedWeatherForecast'
import { WeatherCharts } from '@/components/WeatherCharts'
import { HourlyForecast } from '@/components/HourlyForecast'
import { AdditionalDetails } from '@/components/AdditionalDetails'
import { RecentCities, addRecentCity } from '@/components/RecentCities'
import { WeatherBackground } from '@/components/WeatherBackground'
import { WeatherMap } from '@/components/WeatherMap'
import { WindCompass } from '@/components/WindCompass'
import { WeatherTips } from '@/components/WeatherTips'
import { ShareWeather } from '@/components/ShareWeather'
import { WeeklySummary } from '@/components/WeeklySummary'
import { WeatherDescription } from '@/components/WeatherDescription'
import { WeatherSkeleton, ForecastSkeleton } from '@/components/WeatherSkeleton'
import { Cloud, CloudRain, AlertCircle, ChevronDown, Calendar, Compass, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const { currentWeather, dailyForecast, hourlyForecast, loading, error, unit, fetchWeather, fetchWeatherByLocation, toggleUnit } = useWeather()
  const [showForecast, setShowForecast] = useState(false)
  const [showWind, setShowWind] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Header */}
          <motion.header
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="flex items-center justify-between">
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.div
                  className="bg-gradient-to-br from-primary/20 to-secondary/20 p-3 rounded-xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                >
                  <CloudRain className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    WeatherSphere
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Professional Weather Intelligence
                  </p>
                </div>
              </motion.div>
              <div className="flex items-center gap-3">
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

          {/* Weather Description - moved to top */}
          {currentWeather && (
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <WeatherDescription
                temp={currentWeather.main.temp}
                condition={currentWeather.weather[0].main}
                description={currentWeather.weather[0].description}
                isDay={true}
                unit={unit}
              />
            </motion.div>
          )}

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
              >
                <motion.div
                  className="flex items-center gap-3"
                  animate={{
                    x: [0, -5, 5, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 1,
                  }}
                >
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Unable to fetch weather</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </motion.div>
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

              {/* Weather Details Toggle Button */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    onClick={() => setShowDetails(!showDetails)}
                    variant="outline"
                    className="w-full justify-between h-auto py-5 px-6
                      bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-cyan-500/10
                      hover:from-blue-500/20 hover:via-blue-500/10 hover:to-cyan-500/20
                      border-2 border-blue-500/20 hover:border-blue-500/40
                      shadow-lg hover:shadow-xl
                      rounded-2xl
                      transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl"
                        animate={{
                          rotate: showDetails ? [0, 10, -10, 0] : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                        }}
                      >
                        <Info className="h-5 w-5 text-blue-500" />
                      </motion.div>
                      <span className="font-semibold text-lg">Weather Details</span>
                    </span>
                    <motion.div
                      animate={{ rotate: showDetails ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="p-1 bg-blue-500/10 rounded-lg"
                    >
                      <ChevronDown className="h-5 w-5 text-blue-500" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Collapsible Weather Details Content */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mb-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AdditionalDetails weather={currentWeather} unit={unit} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wind Direction Toggle Button */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    onClick={() => setShowWind(!showWind)}
                    variant="outline"
                    className="w-full justify-between h-auto py-5 px-6
                      bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10
                      hover:from-emerald-500/20 hover:via-emerald-500/10 hover:to-teal-500/20
                      border-2 border-emerald-500/20 hover:border-emerald-500/40
                      shadow-lg hover:shadow-xl
                      rounded-2xl
                      transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <motion.div
                        className="p-2 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-xl"
                        animate={{
                          rotate: showWind ? [0, 15, -15, 0] : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                        }}
                      >
                        <Compass className="h-5 w-5 text-emerald-500" />
                      </motion.div>
                      <span className="font-semibold text-lg">Wind Direction</span>
                    </span>
                    <motion.div
                      animate={{ rotate: showWind ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="p-1 bg-emerald-500/10 rounded-lg"
                    >
                      <ChevronDown className="h-5 w-5 text-emerald-500" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Collapsible Wind Compass Content */}
              <AnimatePresence>
                {showWind && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mb-10"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <WindCompass direction={currentWeather.wind.deg} speed={currentWeather.wind.speed} unit={unit} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Weather Map & Quick Cities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  <WeatherMap lat={currentWeather.coord.lat} lon={currentWeather.coord.lon} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <ShareWeather
                    city={currentWeather.name}
                    temp={currentWeather.main.temp}
                    condition={currentWeather.weather[0].description}
                    unit={unit}
                  />
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
                    <WeatherCharts forecast={dailyForecast} unit={unit} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Weekly Summary & Weather Tips */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                >
                  <WeeklySummary dailyForecast={dailyForecast} unit={unit} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <WeatherTips
                    temp={currentWeather?.main.temp ?? 0}
                    humidity={currentWeather?.main.humidity ?? 0}
                    windSpeed={currentWeather?.wind.speed ?? 0}
                    pop={0}
                    condition={currentWeather?.weather[0]?.main ?? ''}
                    unit={unit}
                  />
                </motion.div>
              </div>
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
                    className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-lg transition-all hover:scale-105 hover:shadow-md"
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
              API. Built by IbnAbubakri
            </p>
          </motion.footer>
        </div>
      </div>
    </WeatherBackground>
  )
}

export default App
