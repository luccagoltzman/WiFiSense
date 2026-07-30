import { MetricCard } from '@/components/dashboard/MetricCard'
import { FloorMap } from '@/components/floor-map/FloorMap'
import { useFloorPlan } from '@/hooks/useFloorPlan'
import { useRealtime } from '@/hooks/RealtimeContext'
import { PageShell } from '@/layouts/MainLayout'
import { formatConfidence, formatFps, formatLatency } from '@/utils/format'

export function DashboardPage() {
  const { metrics, detection, trail, status } = useRealtime()
  const { floorPlan, loading } = useFloorPlan()

  return (
    <PageShell>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Conexão" value={status} hint="WebSocket / simulador" />
        <MetricCard label="FPS" value={formatFps(metrics.fps)} />
        <MetricCard label="Latência" value={formatLatency(metrics.latencyMs)} />
        <MetricCard
          label="Sensores ativos"
          value={String(metrics.sensorsActive)}
          hint={`${metrics.packetsReceived} pacotes`}
        />
        <MetricCard
          label="Pessoas"
          value={String(metrics.peopleDetected)}
          hint={
            detection
              ? `confiança ${formatConfidence(detection.quality.confidence)}`
              : 'sem detecção'
          }
        />
      </div>

      <section className="min-h-0 flex-1 overflow-hidden rounded-lg border border-line bg-panel">
        <div className="border-b border-line px-4 py-3">
          <h3 className="font-medium">Visão rápida da planta</h3>
          <p className="text-sm text-ink-muted">
            O frontend recebe apenas posição, movimento e confiança — nunca CSI bruto.
          </p>
        </div>
        <div className="h-[480px] p-2">
          {loading || !floorPlan ? (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">
              Carregando planta…
            </div>
          ) : (
            <FloorMap floorPlan={floorPlan} detection={detection} trail={trail} />
          )}
        </div>
      </section>
    </PageShell>
  )
}
