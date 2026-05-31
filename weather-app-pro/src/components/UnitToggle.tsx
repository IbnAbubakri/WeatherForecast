import { Button } from '@/components/ui/button'
import { TemperatureUnit } from '@/types/weather'
import { motion } from 'framer-motion'

interface UnitToggleProps {
  unit: TemperatureUnit
  onToggle: () => void
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Temperature Unit</span>
      <div
        className="flex items-center gap-1 bg-muted/50 border border-border rounded-lg p-1"
        role="radiogroup"
        aria-label="Temperature unit"
      >
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            variant={unit === 'metric' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => unit !== 'metric' && onToggle()}
            className="min-w-[60px] cursor-pointer"
            role="radio"
            aria-checked={unit === 'metric'}
          >
            °C
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            variant={unit === 'imperial' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => unit !== 'imperial' && onToggle()}
            className="min-w-[60px] cursor-pointer"
            role="radio"
            aria-checked={unit === 'imperial'}
          >
            °F
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
