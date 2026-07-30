import { Arrow, Circle, Group } from 'react-konva'
import type { PersonDetection } from '@/types'

interface PersonProps {
  detection: PersonDetection
  scale: number
}

export function Person({ detection, scale }: PersonProps) {
  const x = detection.position.x * scale
  const y = detection.position.y * scale
  const confidence = detection.quality.confidence
  const radians = (detection.movement.direction * Math.PI) / 180
  const arrowLen = 22 + detection.movement.speed * 18

  return (
    <Group x={x} y={y}>
      <Circle radius={22} fill={`rgba(13, 148, 136, ${0.12 + confidence * 0.2})`} />
      <Circle
        radius={9}
        fill="#0f766e"
        stroke="#ccfbf1"
        strokeWidth={2}
        shadowBlur={8}
        shadowColor="#0d9488"
        shadowOpacity={0.45}
      />
      <Arrow
        points={[0, 0, Math.cos(radians) * arrowLen, Math.sin(radians) * arrowLen]}
        pointerLength={8}
        pointerWidth={8}
        fill="#0f766e"
        stroke="#0f766e"
        strokeWidth={2}
      />
    </Group>
  )
}
