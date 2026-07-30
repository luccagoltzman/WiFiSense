import { useEffect, useState } from 'react'
import type { ConnectionStatus, LogEntry, PersonDetection, SystemMetrics } from '@/types'
import { useServices } from './useServices'

const EMPTY_METRICS: SystemMetrics = {
  fps: 0,
  latencyMs: 0,
  packetsReceived: 0,
  processingTimeMs: 0,
  peopleDetected: 0,
  sensorsActive: 0,
  connectionStatus: 'disconnected',
}

export function useRealtimeSession() {
  const { realtime, storage } = useServices()
  const [status, setStatus] = useState<ConnectionStatus>(realtime.getStatus())
  const [detection, setDetection] = useState<PersonDetection | null>(null)
  const [trail, setTrail] = useState<PersonDetection[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics>(EMPTY_METRICS)
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const unsubStatus = realtime.onStatusChange(setStatus)
    realtime.connect()

    const unsub = realtime.subscribe((message) => {
      if (message.type === 'detection') {
        const payload = message.payload as PersonDetection
        setDetection(payload)
        setTrail((prev) => [...prev.slice(-40), payload])
        void storage.appendDetection(payload)
      }

      if (message.type === 'metrics') {
        const payload = message.payload as SystemMetrics
        setMetrics(payload)
        void storage.saveMetrics(payload)
      }

      if (message.type === 'log') {
        const payload = message.payload as LogEntry
        setLogs((prev) => [...prev.slice(-499), payload])
        void storage.appendLog(payload)
      }
    })

    return () => {
      unsub()
      unsubStatus()
      realtime.disconnect()
    }
  }, [realtime, storage])

  return { status, detection, trail, metrics, logs }
}
