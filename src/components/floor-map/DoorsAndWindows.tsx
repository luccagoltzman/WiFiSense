import { Line } from 'react-konva'
import type { FloorPlanFeature } from '@/types'

interface FeaturesProps {
  features: FloorPlanFeature[]
  scale: number
}

export function DoorsAndWindows({ features, scale }: FeaturesProps) {
  return (
    <>
      {features.map((feature) => (
        <Line
          key={feature.id}
          points={[
            feature.from.x * scale,
            feature.from.y * scale,
            feature.to.x * scale,
            feature.to.y * scale,
          ]}
          stroke={feature.kind === 'door' ? '#0d9488' : '#38bdf8'}
          strokeWidth={feature.kind === 'door' ? 6 : 5}
          lineCap="butt"
          dash={feature.kind === 'window' ? [8, 4] : undefined}
        />
      ))}
    </>
  )
}
