import { Cloud, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Sun, Snow, Wind } from 'lucide-react'

interface WeatherIconProps {
  iconCode: string
  size?: number
  className?: string
}

export function WeatherIcon({ iconCode, size = 64, className = '' }: WeatherIconProps) {
  const getIcon = () => {
    // Clear sky
    if (iconCode === '01d' || iconCode === '01n') {
      return <Sun size={size} className={className} />
    }
    // Few clouds
    if (iconCode === '02d' || iconCode === '02n') {
      return <Cloud size={size} className={className} />
    }
    // Scattered clouds
    if (iconCode === '03d' || iconCode === '03n') {
      return <Cloud size={size} className={className} />
    }
    // Broken clouds
    if (iconCode === '04d' || iconCode === '04n') {
      return <Cloud size={size} className={className} />
    }
    // Shower rain
    if (iconCode === '09d' || iconCode === '09n') {
      return <CloudDrizzle size={size} className={className} />
    }
    // Rain
    if (iconCode === '10d' || iconCode === '10n') {
      return <CloudRain size={size} className={className} />
    }
    // Thunderstorm
    if (iconCode === '11d' || iconCode === '11n') {
      return <CloudLightning size={size} className={className} />
    }
    // Snow
    if (iconCode === '13d' || iconCode === '13n') {
      return <CloudSnow size={size} className={className} />
    }
    // Mist
    if (iconCode === '50d' || iconCode === '50n') {
      return <Wind size={size} className={className} />
    }
    // Default
    return <Sun size={size} className={className} />
  }

  return getIcon()
}
