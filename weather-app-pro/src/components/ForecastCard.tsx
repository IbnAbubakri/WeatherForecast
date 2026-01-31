import { DailyForecast } from '@/types/weather'
import { Card, CardContent } from '@/components/ui/card'
import { WeatherIcon } from '@/components/WeatherIcon'

interface ForecastCardProps {
  data: DailyForecast
  unit: 'metric' | 'imperial'
}

export function ForecastCard({ data, unit }: ForecastCardProps) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(data.date)
  const dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(data.date)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="font-semibold text-lg">{dayName}</p>
            <p className="text-sm text-muted-foreground">{dateStr}</p>
          </div>

          <WeatherIcon
            iconCode={data.weather.icon}
            size={64}
            className="text-primary"
          />

          <div className="text-center">
            <p className="text-sm text-muted-foreground capitalize">
              {data.weather.description}
            </p>
          </div>

          <div className="flex gap-4">
            <div>
              <p className="text-sm text-muted-foreground">High</p>
              <p className="font-semibold text-lg">
                {Math.round(data.temp.max)}{tempUnit}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low</p>
              <p className="font-semibold text-lg">
                {Math.round(data.temp.min)}{tempUnit}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
