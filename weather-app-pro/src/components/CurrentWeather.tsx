import { WeatherData } from '@/types/weather'
import { Card, CardContent } from '@/components/ui/card'
import { WeatherIcon } from '@/components/WeatherIcon'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'

interface CurrentWeatherProps {
  data: WeatherData
  unit: 'metric' | 'imperial'
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Temperature and Icon */}
          <div className="flex items-center gap-6">
            <WeatherIcon
              iconCode={data.weather[0].icon}
              size={128}
              className="text-yellow-500 dark:text-yellow-400"
            />
            <div>
              <h2 className="text-6xl font-bold">
                {Math.round(data.main.temp)}{tempUnit}
              </h2>
              <p className="text-xl text-muted-foreground capitalize mt-2">
                {data.weather[0].description}
              </p>
            </div>
          </div>

          {/* Right: Location and Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-semibold">{data.name}</h3>
              <p className="text-muted-foreground">
                Feels like {Math.round(data.main.feels_like)}{tempUnit}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Wind</p>
                  <p className="font-medium">
                    {Math.round(data.wind.speed)} {speedUnit}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-medium">{data.main.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Visibility</p>
                  <p className="font-medium">
                    {(data.visibility / 1000).toFixed(1)} km
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Pressure</p>
                  <p className="font-medium">{data.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
