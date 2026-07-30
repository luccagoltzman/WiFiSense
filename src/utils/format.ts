export function formatLatency(ms: number): string {
  if (ms < 1) return '<1 ms'
  return `${Math.round(ms)} ms`
}

export function formatFps(fps: number): string {
  return `${fps.toFixed(1)} fps`
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
}

export function metersToPixels(meters: number, scale: number): number {
  return meters * scale
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function createId(prefix = 'id'): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}
