interface MetricCardProps {
  label: string
  value: string
  hint?: string
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-line bg-panel px-4 py-3">
      <p className="font-mono text-[11px] tracking-wide text-ink-muted uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  )
}
