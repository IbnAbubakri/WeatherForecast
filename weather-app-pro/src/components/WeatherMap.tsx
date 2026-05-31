import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Thermometer, CloudRain, Cloud, Wind, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface WeatherMapProps {
  lat: number
  lon: number
}

type MapLayer = 'temp_new' | 'precipitation_new' | 'clouds_new' | 'wind_new'

const layerConfig: Array<{ id: MapLayer; name: string; icon: React.ElementType }> = [
  { id: 'temp_new', name: 'Temperature', icon: Thermometer },
  { id: 'precipitation_new', name: 'Precipitation', icon: CloudRain },
  { id: 'clouds_new', name: 'Clouds', icon: Cloud },
  { id: 'wind_new', name: 'Wind', icon: Wind },
]

export function WeatherMap({ lat, lon }: WeatherMapProps) {
  const [open, setOpen] = useState(false)
  const [activeLayer, setActiveLayer] = useState<MapLayer>('temp_new')

  return (
    <>
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

          <Button onClick={() => setOpen(true)} size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <DialogTitle className="flex items-center gap-3">
                <Map className="h-5 w-5 text-primary" />
                Weather Map
              </DialogTitle>
              <div className="flex gap-1 sm:gap-2" role="tablist" aria-label="Map layers">
                {layerConfig.map(({ id, name, icon: Icon }) => (
                  <Button
                    key={id}
                    variant={activeLayer === id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveLayer(id)}
                    role="tab"
                    aria-selected={activeLayer === id}
                  >
                    <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 relative bg-muted">
            {open && (
              <iframe
                src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${activeLayer}&lat=${lat}&lon=${lon}&zoom=10`}
                className="absolute inset-0 w-full h-full border-0"
                title={`Weather map showing ${layerConfig.find(l => l.id === activeLayer)?.name.toLowerCase() ?? 'weather'} layer`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
