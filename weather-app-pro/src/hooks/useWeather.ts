// © 2026 Abubakri Faaruq Adebowale (IbnAbubakri). All rights reserved.
// Faruqsuzay@gmail.com | +2349061345507

import { useState, useCallback, useRef } from 'react'
import type { WeatherState, TemperatureUnit, DailyForecast, HourlyForecast } from '@/types/weather'
import { weatherService } from '@/services/weatherService'

const MIN_REQUEST_INTERVAL = 2000

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

  const lastRequestTimeRef = useRef<number>(0)
  const pendingRequestRef = useRef<{ city: string; unit: TemperatureUnit } | null>(null)
  const unitRef = useRef<TemperatureUnit>(state.unit)

  unitRef.current = state.unit

  const fetchWeather = useCallback(async (city: string) => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      pendingRequestRef.current = { city, unit: unitRef.current }

      setTimeout(() => {
        if (pendingRequestRef.current) {
          fetchWeather(pendingRequestRef.current.city)
          pendingRequestRef.current = null
        }
      }, MIN_REQUEST_INTERVAL - timeSinceLastRequest)

      return
    }

    lastRequestTimeRef.current = now

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const currentUnit = unitRef.current
      const { current, daily, hourly } = await weatherService.getCompleteForecast(
        city,
        currentUnit
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
  }, [])

  const fetchWeatherByLocation = useCallback(async () => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      setTimeout(() => {
        fetchWeatherByLocation()
      }, MIN_REQUEST_INTERVAL - timeSinceLastRequest)

      return
    }

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
          maximumAge: 300000,
        })
      })

      const { latitude, longitude } = position.coords
      const currentUnit = unitRef.current

      const { current, daily, hourly } = await weatherService.getWeatherWithForecastByCoords(
        latitude,
        longitude,
        currentUnit
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
  }, [])

  const toggleUnit = useCallback(() => {
    setState((prev) => {
      const newUnit: TemperatureUnit = prev.unit === 'metric' ? 'imperial' : 'metric'
      return {
        ...prev,
        unit: newUnit,
      }
    })
  }, [])

  return {
    ...state,
    dailyForecast,
    hourlyForecast,
    fetchWeather,
    fetchWeatherByLocation,
    toggleUnit,
  }
}
