import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'

interface WindCompassProps {
  direction: number // degrees
  speed: number
  unit: 'metric' | 'imperial'
}

export function WindCompass({ direction, speed, unit }: WindCompassProps) {
  const getCardinalDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  const speedUnit = unit === 'metric' ? 'm/s' : 'mph'
  const convertedSpeed = unit === 'imperial' ? speed * 2.237 : speed

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-cyan-500/20 p-3 rounded-xl">
          <Compass className="h-6 w-6 text-cyan-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Wind Direction</h3>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Compass rose */}
          <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-45">
            {/* Outer circle */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />

            {/* Direction labels */}
            <text x="100" y="25" textAnchor="middle" className="fill-foreground text-sm font-medium">N</text>
            <text x="180" y="105" textAnchor="middle" className="fill-foreground text-sm font-medium">E</text>
            <text x="100" y="185" textAnchor="middle" className="fill-foreground text-sm font-medium">S</text>
            <text x="25" y="105" textAnchor="middle" className="fill-foreground text-sm font-medium">W</text>

            {/* Cross lines */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="hsl(var(--border))" strokeWidth="1" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="hsl(var(--border))" strokeWidth="1" />
          </svg>

          {/* Arrow showing wind direction */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ rotate: 0 }}
            animate={{ rotate: direction }}
            transition={{ duration: 1, type: 'spring' }}
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <Compass className="h-12 w-12 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="text-center mt-4 space-y-1">
        <p className="text-2xl font-bold text-foreground">{getCardinalDirection(direction)}</p>
        <p className="text-sm text-muted-foreground">{Math.round(convertedSpeed)} {speedUnit}</p>
      </div>
    </motion.div>
  )
}
