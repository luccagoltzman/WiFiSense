import { useEffect, useMemo, useRef, useState } from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import { DoorsAndWindows } from '@/components/floor-map/DoorsAndWindows'
import { Heatmap } from '@/components/floor-map/Heatmap'
import { Person } from '@/components/floor-map/Person'
import { Sensors } from '@/components/floor-map/Sensors'
import { Walls } from '@/components/floor-map/Walls'
import type { FloorPlan, PersonDetection } from '@/types'

interface FloorMapProps {
  floorPlan: FloorPlan
  detection: PersonDetection | null
  trail?: PersonDetection[]
  className?: string
}

export function FloorMap({ floorPlan, detection, trail = [], className }: FloorMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 640, height: 480 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scale = useMemo(() => {
    const padding = 48
    const sx = (size.width - padding) / floorPlan.width
    const sy = (size.height - padding) / floorPlan.height
    return Math.max(20, Math.min(sx, sy))
  }, [floorPlan.height, floorPlan.width, size.height, size.width])

  const offsetX = (size.width - floorPlan.width * scale) / 2
  const offsetY = (size.height - floorPlan.height * scale) / 2

  return (
    <div ref={containerRef} className={className ?? 'h-full min-h-[420px] w-full'}>
      <Stage width={size.width} height={size.height}>
        <Layer x={offsetX} y={offsetY}>
          <Rect
            width={floorPlan.width * scale}
            height={floorPlan.height * scale}
            fill="#f8fafc"
            stroke="#d7e0e8"
            strokeWidth={1}
          />
          <Walls walls={floorPlan.walls} scale={scale} />
          <DoorsAndWindows features={floorPlan.features} scale={scale} />
          <Heatmap trail={trail} scale={scale} />
          <Sensors sensors={floorPlan.sensors} scale={scale} />
          {detection ? <Person detection={detection} scale={scale} /> : null}
        </Layer>
      </Stage>
    </div>
  )
}
