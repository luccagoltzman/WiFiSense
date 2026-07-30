import { FloorMap } from '@/components/floor-map/FloorMap'
import { useFloorPlan } from '@/hooks/useFloorPlan'
import { useRealtime } from '@/hooks/RealtimeContext'
import { PageShell } from '@/layouts/MainLayout'
import { formatConfidence } from '@/utils/format'

export function FloorMapPage() {
  const { detection, trail } = useRealtime()
  const { floorPlan, loading } = useFloorPlan()

  return (
    <PageShell>
      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <section className="overflow-hidden rounded-lg border border-line bg-panel">
          <div className="h-[min(70vh,640px)] p-2">
            {loading || !floorPlan ? (
              <div className="flex h-full items-center justify-center text-sm text-ink-muted">
                Carregando planta…
              </div>
            ) : (
              <FloorMap floorPlan={floorPlan} detection={detection} trail={trail} />
            )}
          </div>
        </section>

        <aside className="space-y-3">
          <InfoBlock
            title="Posição"
            lines={
              detection
                ? [`X ${detection.position.x.toFixed(2)} m`, `Y ${detection.position.y.toFixed(2)} m`]
                : ['Sem detecção']
            }
          />
          <InfoBlock
            title="Movimento"
            lines={
              detection
                ? [
                    `Direção ${detection.movement.direction.toFixed(0)}°`,
                    `Velocidade ${detection.movement.speed.toFixed(2)} m/s`,
                  ]
                : ['—']
            }
          />
          <InfoBlock
            title="Qualidade"
            lines={
              detection
                ? [`Confiança ${formatConfidence(detection.quality.confidence)}`]
                : ['—']
            }
          />
          <InfoBlock
            title="Legenda"
            lines={['Teal sólido · porta', 'Azul tracejado · janela', 'Ponto · sensor ESP32']}
          />
        </aside>
      </div>
    </PageShell>
  )
}

function InfoBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-line bg-panel px-4 py-3">
      <p className="font-mono text-[11px] tracking-wide text-ink-muted uppercase">{title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
