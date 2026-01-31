import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, CloudRain, Snowflake, Sun, Moon } from 'lucide-react'

interface WeatherBackgroundProps {
  weatherCondition: string
  isDay: boolean
  children: React.ReactNode
}

export function WeatherBackground({ weatherCondition, isDay, children }: WeatherBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    // Create particles for rain/snow
    if (weatherCondition.toLowerCase().includes('rain') || weatherCondition.toLowerCase().includes('snow')) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [weatherCondition])

  const isRain = weatherCondition.toLowerCase().includes('rain') || weatherCondition.toLowerCase().includes('drizzle')
  const isSnow = weatherCondition.toLowerCase().includes('snow')
  const isCloudy = weatherCondition.toLowerCase().includes('clouds') || weatherCondition.toLowerCase().includes('mist') || weatherCondition.toLowerCase().includes('fog')
  const isClear = weatherCondition.toLowerCase().includes('clear')

  return (
    <div className="relative min-h-screen">
      {/* Background Gradient */}
      <motion.div
        className="fixed inset-0 -z-20 transition-colors duration-1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: isDay
            ? 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 50%, #0EA5E9 100%)'
            : 'linear-gradient(135deg, #0B1220 0%, #111827 50%, #0F1729 100%)',
        }}
      />

      {/* Animated Sun/Moon */}
      <AnimatePresence>
        {isClear && (
          <motion.div
            className="fixed top-20 right-20 -z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 1, type: 'spring' }}
          >
            {isDay ? (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
                }}
              >
                <Sun className="h-32 w-32 text-yellow-300 opacity-80" />
              </motion.div>
            ) : (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
                }}
              >
                <Moon className="h-24 w-24 text-yellow-100 opacity-60" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Clouds */}
      <AnimatePresence>
        {isCloudy && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="fixed top-[10%] -z-10"
                style={{ left: `${20 + i * 30}%` }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: [0, 50, 0], opacity: [0, 0.6, 0.6] }}
                transition={{
                  x: { duration: 20 + i * 5, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 2 },
                }}
                exit={{ opacity: 0 }}
              >
                <Cloud className={`h-${32 - i * 4} w-${32 - i * 4} text-white/20`} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Rain Particles */}
      <AnimatePresence>
        {isRain && (
          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute top-0 w-0.5 h-8 bg-blue-400/30 rounded-full"
                style={{ left: `${particle.x}%` }}
                initial={{ y: -50, opacity: 0 }}
                animate={{
                  y: ['0vh', '100vh'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear',
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Snow Particles */}
      <AnimatePresence>
        {isSnow && (
          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute top-0"
                style={{ left: `${particle.x}%` }}
                initial={{ y: -50, opacity: 0, x: 0 }}
                animate={{
                  y: ['0vh', '100vh'],
                  opacity: [0, 1, 0],
                  x: [0, particle.x % 2 === 0 ? 30 : -30],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear',
                }}
                exit={{ opacity: 0 }}
              >
                <Snowflake className="h-4 w-4 text-white/50" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
