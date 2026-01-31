import { WeatherData, ForecastData, DailyForecast, HourlyForecast, TemperatureUnit } from '@/types/weather'

interface DailyDataMap {
  date: Date
  temp: { min: number; max: number }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }
  humidity: number
  windSpeed: number
  totalPrecipitation: number
  maxPop: number
  count: number
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

if (!API_KEY) {
  throw new Error(
    'VITE_WEATHER_API_KEY is not defined. Please set it in your .env file.'
  )
}

export class WeatherService {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY
    this.baseUrl = BASE_URL
  }

  async getCurrentWeather(city: string, unit: TemperatureUnit = 'metric'): Promise<WeatherData> {
    // Input validation: max length 100 characters, allow letters, spaces, commas, hyphens, apostrophes
    if (!city || city.length > 100 || !/^[a-zA-Z\s,\-'\.]+$/.test(city)) {
      throw new Error('Invalid city name')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`Weather data not found for "${city}"`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch weather data')
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number, unit: TemperatureUnit = 'metric'): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error('Weather data not found for your location')
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch weather data')
    }
  }

  async getForecast(city: string, unit: TemperatureUnit = 'metric'): Promise<ForecastData> {
    // Input validation: max length 100 characters, allow letters, spaces, commas, hyphens, apostrophes
    if (!city || city.length > 100 || !/^[a-zA-Z\s,\-'\.]+$/.test(city)) {
      throw new Error('Invalid city name')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error(`Forecast data not found for "${city}"`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch forecast data')
    }
  }

  async getForecastByCoordinates(lat: number, lon: number, unit: TemperatureUnit = 'metric'): Promise<ForecastData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error('Forecast data not found for your location')
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch forecast data')
    }
  }

  processDailyForecast(forecastData: ForecastData): DailyForecast[] {
    const dailyData = new Map<string, DailyDataMap>()
    const today = new Date().toDateString()

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()

      // Skip today's date - current weather is shown separately
      if (dateKey === today) {
        return
      }

      // Get precipitation amount (rain or snow) in mm
      const rain = item.rain?.['3h'] || item.rain?.['1h'] || 0
      const snow = item.snow?.['3h'] || item.snow?.['1h'] || 0
      const precipitation = rain + snow

      // Get probability of precipitation (0-1, convert to 0-100)
      const pop = item.pop ? Math.round(item.pop * 100) : 0

      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max,
          },
          weather: item.weather[0],
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          totalPrecipitation: precipitation,
          maxPop: pop,
          count: 1,
        })
      } else {
        const existing = dailyData.get(dateKey)!
        existing.temp.min = Math.min(existing.temp.min, item.main.temp_min)
        existing.temp.max = Math.max(existing.temp.max, item.main.temp_max)
        existing.totalPrecipitation += precipitation
        existing.maxPop = Math.max(existing.maxPop, pop)
        existing.count++

        // Update weather to most recent
        existing.weather = item.weather[0]
      }
    })

    // Convert to array and take first 5 days (excluding today)
    return Array.from(dailyData.values()).slice(0, 5).map(day => ({
      date: day.date,
      temp: day.temp,
      weather: day.weather,
      humidity: day.humidity,
      windSpeed: day.windSpeed,
      precipitation: Math.round(day.totalPrecipitation * 10) / 10, // Round to 1 decimal
      pop: day.maxPop,
    }))
  }

  async getWeatherWithForecast(
    city: string,
    unit: TemperatureUnit = 'metric'
  ): Promise<{ current: WeatherData; daily: DailyForecast[] }> {
    const [current, forecast] = await Promise.all([
      this.getCurrentWeather(city, unit),
      this.getForecast(city, unit),
    ])

    const daily = this.processDailyForecast(forecast)

    return { current, daily }
  }

  processHourlyForecast(forecastData: ForecastData): HourlyForecast[] {
    // Get next 24 hours of data
    return forecastData.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000),
      temp: item.main.temp,
      feels_like: item.main.feels_like || item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      windDeg: item.wind.deg || 0,
      clouds: item.clouds?.all || 0,
      pressure: item.main.pressure || 1013,
      weather: item.weather[0],
      pop: Math.round((item.pop || 0) * 100),
    }))
  }

  async getWeatherWithForecastByCoords(
    lat: number,
    lon: number,
    unit: TemperatureUnit = 'metric'
  ): Promise<{ current: WeatherData; daily: DailyForecast[]; hourly: HourlyForecast[] }> {
    const [current, forecast] = await Promise.all([
      this.getWeatherByCoordinates(lat, lon, unit),
      this.getForecastByCoordinates(lat, lon, unit),
    ])

    const daily = this.processDailyForecast(forecast)
    const hourly = this.processHourlyForecast(forecast)

    return { current, daily, hourly }
  }

  async getCompleteForecast(
    city: string,
    unit: TemperatureUnit = 'metric'
  ): Promise<{ current: WeatherData; daily: DailyForecast[]; hourly: HourlyForecast[] }> {
    const [current, forecast] = await Promise.all([
      this.getCurrentWeather(city, unit),
      this.getForecast(city, unit),
    ])

    const daily = this.processDailyForecast(forecast)
    const hourly = this.processHourlyForecast(forecast)

    return { current, daily, hourly }
  }
}

export const weatherService = new WeatherService()
