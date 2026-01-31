import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WeatherMapProps {
  lat: number
  lon: number
}

type MapLayer = 'temp_new' | 'precipitation_new' | 'clouds_new' | 'wind_new'

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [showMap, setShowMap] = useState(false)
  const [activeLayer, setActiveLayer] = useState<MapLayer>('temp_new')

  const layers = [
    { id: 'temp_new' as MapLayer, name: 'Temperature', icon: '🌡️' },
    { id: 'precipitation_new' as MapLayer, name: 'Precipitation', icon: '🌧️' },
    { id: 'clouds_new' as MapLayer, name: 'Clouds', icon: '☁️' },
    { id: 'wind_new' as MapLayer, name: 'Wind', icon: '💨' },
  ]

  if (!showMap) {
    return (
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <Map className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Weather Map</h3>
              <p className="text-sm text-muted-foreground">Interactive radar</p>
            </div>
          </div>

          <Button onClick={() => setShowMap(true)} size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Map className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Weather Map</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setShowMap(false)} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Map Layers */}
        <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
          {layers.map((layer) => (
            <Button
              key={layer.id}
              variant={activeLayer === layer.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveLayer(layer.id)}
            >
              <span className="mr-2">{layer.icon}</span>
              {layer.name}
            </Button>
          ))}
        </div>

        {/* Map */}
        <div className="flex-1 relative bg-muted">
          <iframe
            src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${activeLayer}&lat=${lat}&lon=${lon}&zoom=10`}
            className="absolute inset-0 w-full h-full border-0"
            title="Weather Map"
          />
        </div>
      </div>
    </motion.div>
  )
}
