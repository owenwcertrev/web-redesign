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
      <div className="relative py-4">
        <style jsx>{`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
            width: 100%;
          }

          input[type="range"]::-webkit-slider-track {
            background: linear-gradient(
              to right,
              #D4E157 0%,
              #D4E157 ${percentage}%,
              #E8E4DB ${percentage}%,
              #E8E4DB 100%
            );
            border-radius: 1.25rem;
            height: 1.25rem;
            border: 2px solid rgba(10, 27, 63, 0.15);
          }

          input[type="range"]::-moz-range-track {
            background: #E8E4DB;
            border-radius: 1.25rem;
            height: 1.25rem;
            border: 2px solid rgba(10, 27, 63, 0.15);
          }

          input[type="range"]::-moz-range-progress {
            background: #D4E157;
            border-radius: 1.25rem;
            height: 1.25rem;
          }

          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            margin-top: -7px;
            background: #0A1B3F;
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 2px 8px rgba(10, 27, 63, 0.2);
            transition: all 0.2s ease;
          }

          input[type="range"]::-moz-range-thumb {
            background: #0A1B3F;
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 2px 8px rgba(10, 27, 63, 0.2);
            transition: all 0.2s ease;
          }

          input[type="range"]:hover::-webkit-slider-thumb {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(10, 27, 63, 0.3);
          }

          input[type="range"]:hover::-moz-range-thumb {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(10, 27, 63, 0.3);
          }

          input[type="range"]:focus {
            outline: none;
          }
        `}</style>

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
