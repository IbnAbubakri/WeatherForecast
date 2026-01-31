import { motion } from 'framer-motion'
import { Share2, Link, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ShareWeatherProps {
  city: string
  temp: number
  condition: string
  unit: 'metric' | 'imperial'
}

export function ShareWeather({ city, temp, condition, unit }: ShareWeatherProps) {
  const [copied, setCopied] = useState(false)
  const tempUnit = unit === 'metric' ? '°C' : '°F'

  const shareText = `🌤️ Weather in ${city}: ${Math.round(temp)}${tempUnit}, ${condition} - Check it out on WeatherSphere!`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WeatherSphere',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-pink-500/20 p-3 rounded-xl">
          <Share2 className="h-6 w-6 text-pink-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Share Weather</h3>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-card/50 rounded-lg">
          <p className="text-sm text-muted-foreground line-clamp-2">{shareText}</p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Link className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>

          {navigator.share && (
            <Button
              onClick={handleShare}
              className="flex-1"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
