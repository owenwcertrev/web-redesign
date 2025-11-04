interface TextureOverlayProps {
  type?: 'paper' | 'grain' | 'subtle'
  opacity?: number
  className?: string
}

export default function TextureOverlay({
  type = 'subtle',
  opacity = 0.5,
  className = ''
}: TextureOverlayProps) {
  const textureClasses = {
    paper: 'paper-texture',
    grain: 'grain-texture',
    subtle: 'paper-texture'
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${textureClasses[type]} ${className}`}
      style={{ opacity }}
    />
  )
}
