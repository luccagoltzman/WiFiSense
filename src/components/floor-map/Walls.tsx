import { Line } from 'react-konva'
import type { WallSegment } from '@/types'

interface WallsProps {
  walls: WallSegment[]
  scale: number
}

export function Walls({ walls, scale }: WallsProps) {
  return (
    <>
      {walls.map((wall) => (
        <Line
          key={wall.id}
          points={[
            wall.from.x * scale,
            wall.from.y * scale,
            wall.to.x * scale,
            wall.to.y * scale,
          ]}
          stroke="#1e293b"
          strokeWidth={4}
          lineCap="round"
        />
      ))}
    </>
  )
}
