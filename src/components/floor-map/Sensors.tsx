import { Circle, Group, Text } from 'react-konva'
import type { SensorInfo } from '@/types'

interface SensorsProps {
  sensors: SensorInfo[]
  scale: number
}

export function Sensors({ sensors, scale }: SensorsProps) {
  return (
    <>
      {sensors.map((sensor) => {
        const x = sensor.position.x * scale
        const y = sensor.position.y * scale
        return (
          <Group key={sensor.id} x={x} y={y}>
            {sensor.active ? (
              <Circle radius={18} stroke="#0d9488" strokeWidth={1} opacity={0.35} />
            ) : null}
            <Circle
              radius={7}
              fill={sensor.active ? '#0d9488' : '#94a3b8'}
              stroke="#fff"
              strokeWidth={2}
            />
            <Text
              text={sensor.name}
              x={10}
              y={-8}
              fontSize={11}
              fontFamily="IBM Plex Mono"
              fill="#5b6b7c"
            />
          </Group>
        )
      })}
    </>
  )
}
