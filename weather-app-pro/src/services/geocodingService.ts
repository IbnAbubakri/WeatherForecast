const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/geo/1.0'

if (!API_KEY) {
  throw new Error(
    'VITE_WEATHER_API_KEY is not defined. Please set it in your .env file.'
  )
}

export interface CitySuggestion {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

interface GeocodingAPIResponse {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

interface ReverseGeocodeResponse {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export class GeocodingService {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY
    this.baseUrl = BASE_URL
  }

  async searchCities(query: string, limit: number = 5): Promise<CitySuggestion[]> {
    if (!query || query.length < 2) {
      return []
    }

    // Input validation: max length 100 characters, allow letters, spaces, commas, hyphens, apostrophes
    if (query.length > 100 || !/^[a-zA-Z\s,\-'\.]+$/.test(query)) {
      return []
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${this.apiKey}`
      )

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.map((city: GeocodingAPIResponse) => ({
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        country: city.country,
        state: city.state,
      }))
    } catch (error) {
      return []
    }
  }

  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
      )

      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data: ReverseGeocodeResponse[] = await response.json()
      if (data && data.length > 0) {
        return data[0].name
      }
      throw new Error('No location found')
    } catch (error) {
      throw error
    }
  }
}

export const geocodingService = new GeocodingService()
