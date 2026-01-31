import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function WeatherSkeleton() {
  return (
    <Card className="glass-card">
      <CardContent className="p-6 md:p-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Temperature and Icon */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="space-y-3 text-center sm:text-left">
              <Skeleton className="h-16 w-40" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          {/* Right: Location and Details */}
          <div className="space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-24" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ForecastSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="h-full glass-card">
            <CardContent className="p-5">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-18 w-18 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-3 w-full">
                  <Skeleton className="h-16 flex-1" />
                  <Skeleton className="h-16 flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
