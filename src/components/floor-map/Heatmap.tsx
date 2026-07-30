import { Circle } from 'react-konva'
import type { PersonDetection } from '@/types'

interface HeatmapProps {
  trail: PersonDetection[]
  scale: number
}

/** Trail visual simples — heatmap completo fica para a Fase 2. */
export function Heatmap({ trail, scale }: HeatmapProps) {
  return (
    <>
      {trail.map((point, index) => {
        const opacity = ((index + 1) / trail.length) * 0.35
        return (
          <Circle
            key={`${point.timestamp}-${index}`}
            x={point.position.x * scale}
            y={point.position.y * scale}
            radius={6}
            fill={`rgba(13, 148, 136, ${opacity})`}
            listening={false}
          />
        )
      })}
    </>
  )
}
