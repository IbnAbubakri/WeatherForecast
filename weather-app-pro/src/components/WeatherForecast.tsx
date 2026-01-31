import { DailyForecast } from '@/types/weather'
import { ForecastCard } from './ForecastCard'

interface WeatherForecastProps {
  forecast: DailyForecast[]
  unit: 'metric' | 'imperial'
}

export function WeatherForecast({ forecast, unit }: WeatherForecastProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <ForecastCard key={index} data={day} unit={unit} />
        ))}
      </div>
    </div>
  )
}
