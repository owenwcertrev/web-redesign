'use client'

import { motion } from 'framer-motion'

interface PricingSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function PricingSlider({ value, onChange, min = 2, max = 56 }: PricingSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Labels */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <p className="text-sm font-semibold text-navy/60 uppercase tracking-wide">Occasional Updates</p>
          <p className="text-xs text-navy/40">{min} posts/month</p>
        </div>
        <div className="text-center px-6">
          <motion.p
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-coral font-serif"
          >
            {value}
          </motion.p>
          <p className="text-sm text-navy/60">posts/month</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-navy/60 uppercase tracking-wide">High Velocity</p>
          <p className="text-xs text-navy/40">{max} posts/month</p>
        </div>
      </div>

      {/* Slider */}
      <div className="relative py-8">
        {/* Visual track background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 bg-beige rounded-full border-2 border-navy shadow-sm">
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 bg-lime rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .pricing-slider {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
              cursor: pointer;
              width: 100%;
              position: relative;
              z-index: 10;
              height: 2rem;
            }

            .pricing-slider::-webkit-slider-track {
              background: transparent;
              height: 1.25rem;
            }

            .pricing-slider::-moz-range-track {
              background: transparent;
              height: 1.25rem;
            }

            .pricing-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              background: #0A1B3F;
              height: 2.5rem;
              width: 2.5rem;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 2px 8px rgba(10, 27, 63, 0.3);
              transition: all 0.2s ease;
              cursor: grab;
            }

            .pricing-slider::-moz-range-thumb {
              background: #0A1B3F;
              height: 2.5rem;
              width: 2.5rem;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 2px 8px rgba(10, 27, 63, 0.3);
              transition: all 0.2s ease;
              cursor: grab;
            }

            .pricing-slider:active::-webkit-slider-thumb {
              cursor: grabbing;
            }

            .pricing-slider:active::-moz-range-thumb {
              cursor: grabbing;
            }

            .pricing-slider:hover::-webkit-slider-thumb {
              transform: scale(1.1);
              box-shadow: 0 4px 12px rgba(10, 27, 63, 0.4);
            }

            .pricing-slider:hover::-moz-range-thumb {
              transform: scale(1.1);
              box-shadow: 0 4px 12px rgba(10, 27, 63, 0.4);
            }

            .pricing-slider:focus {
              outline: none;
            }
          `
        }} />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pricing-slider"
        />
      </div>
    </div>
  )
}
