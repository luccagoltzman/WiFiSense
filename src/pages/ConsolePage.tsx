import { ConsolePanel } from '@/components/console/ConsolePanel'
import { useRealtime } from '@/hooks/RealtimeContext'
import { PageShell } from '@/layouts/MainLayout'

export function ConsolePage() {
  const { logs, metrics } = useRealtime()

  return (
    <PageShell>
      <ConsolePanel
        logs={logs}
        packetsReceived={metrics.packetsReceived}
        processingTimeMs={metrics.processingTimeMs}
      />
    </PageShell>
  )
}
