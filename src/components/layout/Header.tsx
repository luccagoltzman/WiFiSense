import type { ConnectionStatus } from '@/types'

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: 'Conectado',
  connecting: 'Conectando…',
  disconnected: 'Desconectado',
  error: 'Erro',
}

const STATUS_CLASS: Record<ConnectionStatus, string> = {
  connected: 'bg-ok/15 text-ok',
  connecting: 'bg-warn/15 text-warn',
  disconnected: 'bg-line text-ink-muted',
  error: 'bg-danger/15 text-danger',
}

interface HeaderProps {
  title: string
  subtitle?: string
  status: ConnectionStatus
}

export function Header({ title, subtitle, status }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-panel/70 px-6 py-4 backdrop-blur-sm">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p> : null}
      </div>

      <div
        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-xs ${STATUS_CLASS[status]}`}
      >
        <span
          className={`size-1.5 rounded-full ${
            status === 'connected' ? 'bg-ok animate-pulse' : 'bg-current'
          }`}
        />
        {STATUS_LABEL[status]}
      </div>
    </header>
  )
}
