import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Snowflake, Shield } from 'lucide-react'

interface WeatherBackgroundProps {
  weatherCondition: string
  isDay: boolean
  children: React.ReactNode
}

export function WeatherBackground({ weatherCondition, isDay, children }: WeatherBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => { setPrefersReducedMotion(e.matches) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setParticles([])
      return
    }
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
  }, [weatherCondition, prefersReducedMotion])

  const isRain = weatherCondition.toLowerCase().includes('rain') || weatherCondition.toLowerCase().includes('drizzle')
  const isSnow = weatherCondition.toLowerCase().includes('snow')

  return (
    <div className="relative min-h-screen">
      {/* Background Gradient */}
      <div
        className={`fixed inset-0 -z-20 transition-colors duration-1000 ${isDay ? 'bg-weather-day' : 'bg-weather-night'}`}
      />



      {/* Rain Particles */}
      {!prefersReducedMotion && (
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
      )}

      {/* Snow Particles */}
      {!prefersReducedMotion && (
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
      )}

      {/* Reduced motion fallback */}
      {prefersReducedMotion && (isRain || isSnow) && (
        <div className="fixed bottom-4 left-4 z-20 bg-card/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground flex items-center gap-2">
          <Shield className="h-3 w-3" />
          Weather effects hidden (reduced motion)
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
