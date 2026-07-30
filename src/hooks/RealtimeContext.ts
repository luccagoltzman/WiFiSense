import { createContext, useContext } from 'react'
import type { ConnectionStatus, LogEntry, PersonDetection, SystemMetrics } from '@/types'

export interface RealtimeSessionValue {
  status: ConnectionStatus
  detection: PersonDetection | null
  trail: PersonDetection[]
  metrics: SystemMetrics
  logs: LogEntry[]
}

export const RealtimeContext = createContext<RealtimeSessionValue | null>(null)

export function useRealtime(): RealtimeSessionValue {
  const value = useContext(RealtimeContext)
  if (!value) {
    throw new Error('useRealtime deve ser usado dentro de MainLayout')
  }
  return value
}
