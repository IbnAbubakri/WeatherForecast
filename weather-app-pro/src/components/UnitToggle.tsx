import { Button } from '@/components/ui/button'
import { TemperatureUnit } from '@/types/weather'
import { motion } from 'framer-motion'

interface UnitToggleProps {
  unit: TemperatureUnit
  onToggle: () => void
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  const handleMetricClick = () => {
    console.log('°C button clicked, current unit:', unit)
    if (unit !== 'metric') {
      console.log('Calling onToggle to switch to metric')
      onToggle()
    }
  }

  const handleImperialClick = () => {
    console.log('°F button clicked, current unit:', unit)
    if (unit !== 'imperial') {
      console.log('Calling onToggle to switch to imperial')
      onToggle()
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Temperature Unit</span>
      <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-lg p-1">
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            variant={unit === 'metric' ? 'default' : 'ghost'}
            size="sm"
            onClick={handleMetricClick}
            className={unit === 'metric' ? 'min-w-[60px]' : 'min-w-[60px]'}
          >
            °C
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Button
            type="button"
            variant={unit === 'imperial' ? 'default' : 'ghost'}
            size="sm"
            onClick={handleImperialClick}
            className={unit === 'imperial' ? 'min-w-[60px]' : 'min-w-[60px]'}
          >
            °F
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
