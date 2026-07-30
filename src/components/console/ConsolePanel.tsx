import type { LogEntry } from '@/types'
import { formatTimestamp } from '@/utils/format'

const LEVEL_CLASS: Record<LogEntry['level'], string> = {
  debug: 'text-ink-muted',
  info: 'text-signal',
  warn: 'text-warn',
  error: 'text-danger',
}

interface ConsolePanelProps {
  logs: LogEntry[]
  packetsReceived: number
  processingTimeMs: number
}

export function ConsolePanel({ logs, packetsReceived, processingTimeMs }: ConsolePanelProps) {
  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-lg border border-line bg-ink text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-xs">
        <span>console · eventos</span>
        <span className="text-slate-400">
          pkts {packetsReceived} · proc {processingTimeMs.toFixed(1)} ms
        </span>
      </div>

      <div className="flex-1 space-y-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
        {logs.length === 0 ? (
          <p className="text-slate-500">Aguardando eventos…</p>
        ) : (
          [...logs].reverse().map((log) => (
            <div key={log.id} className="grid grid-cols-[88px_52px_1fr] gap-3">
              <span className="text-slate-500">{formatTimestamp(log.timestamp)}</span>
              <span className={LEVEL_CLASS[log.level]}>{log.level}</span>
              <span>
                {log.message}
                {log.meta ? (
                  <span className="ml-2 text-slate-500">{JSON.stringify(log.meta)}</span>
                ) : null}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
