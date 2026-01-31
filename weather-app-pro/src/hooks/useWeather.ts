import { useState, useCallback, useRef } from 'react'
import type { WeatherState, TemperatureUnit, DailyForecast, HourlyForecast } from '@/types/weather'
import { weatherService } from '@/services/weatherService'

// Rate limiting: minimum time between API calls (in milliseconds)
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    currentWeather: null,
    forecast: null,
    loading: false,
    error: null,
    unit: 'metric',
  })

  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([])
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([])

  // Rate limiting refs
  const lastRequestTimeRef = useRef<number>(0)
  const pendingRequestRef = useRef<{ city: string; unit: TemperatureUnit } | null>(null)

  const fetchWeather = useCallback(async (city: string) => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current

    // Check if we need to rate limit
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      // Store the pending request
      pendingRequestRef.current = { city, unit: state.unit }

      // Schedule the request for later
      setTimeout(() => {
        if (pendingRequestRef.current) {
          fetchWeather(pendingRequestRef.current.city)
          pendingRequestRef.current = null
        }
      }, MIN_REQUEST_INTERVAL - timeSinceLastRequest)

      return
    }

    // Update the last request time
    lastRequestTimeRef.current = now

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const { current, daily, hourly } = await weatherService.getCompleteForecast(
        city,
        state.unit
      )

      setDailyForecast(daily)
      setHourlyForecast(hourly)

      setState((prev) => ({
        ...prev,
        currentWeather: current,
        loading: false,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }))
    }
  }, [state.unit])

  const fetchWeatherByLocation = useCallback(async () => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current

    // Check if we need to rate limit
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      // Schedule the request for later
      setTimeout(() => {
        fetchWeatherByLocation()
      }, MIN_REQUEST_INTERVAL - timeSinceLastRequest)

      return
    }

    // Update the last request time
    lastRequestTimeRef.current = now

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords

      const { current, daily, hourly } = await weatherService.getWeatherWithForecastByCoords(
        latitude,
        longitude,
        state.unit
      )

      setDailyForecast(daily)
      setHourlyForecast(hourly)

      setState((prev) => ({
        ...prev,
        currentWeather: current,
        loading: false,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get your location',
      }))
    }
  }, [state.unit])

  const toggleUnit = useCallback(() => {
    // Use functional state update to avoid stale closures
    setState((prev) => {
      const newUnit: TemperatureUnit = prev.unit === 'metric' ? 'imperial' : 'metric'
      return {
        ...prev,
        unit: newUnit,
      }
    })
  }, []) // Empty deps - this function never changes

  return {
    ...state,
    dailyForecast,
    hourlyForecast,
    fetchWeather,
    fetchWeatherByLocation,
    toggleUnit,
  }
}
