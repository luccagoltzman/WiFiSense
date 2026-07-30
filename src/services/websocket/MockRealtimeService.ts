import { createId } from '@/utils/format'
import type {
  ConnectionStatus,
  LogEntry,
  PersonDetection,
  RealtimeMessage,
  SystemMetrics,
} from '@/types'
import type { RealtimeListener, RealtimeService, StatusListener } from './RealtimeService'

/**
 * Simulador local para validar a UI sem ESP32/backend.
 * Emite detecções sintéticas via a mesma interface RealtimeService.
 */
export class MockRealtimeService implements RealtimeService {
  private status: ConnectionStatus = 'disconnected'
  private listeners = new Set<RealtimeListener>()
  private statusListeners = new Set<StatusListener>()
  private timer: ReturnType<typeof setInterval> | null = null
  private angle = 0
  private packets = 0

  connect(): void {
    if (this.timer) return
    this.setStatus('connecting')
    window.setTimeout(() => {
      this.setStatus('connected')
      this.emitLog('info', 'Simulador local conectado (sem backend)')
      this.timer = setInterval(() => this.tick(), 100)
    }, 300)
  }

  disconnect(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.setStatus('disconnected')
  }

  getStatus(): ConnectionStatus {
    return this.status
  }

  subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener)
    listener(this.status)
    return () => this.statusListeners.delete(listener)
  }

  private tick(): void {
    this.angle += 0.08
    this.packets += 1

    const detection: PersonDetection = {
      id: 'person-1',
      position: {
        x: 5 + Math.cos(this.angle) * 2.2,
        y: 4 + Math.sin(this.angle) * 1.6,
      },
      movement: {
        direction: ((this.angle * 180) / Math.PI + 90) % 360,
        speed: 0.6 + Math.sin(this.angle) * 0.2,
      },
      quality: {
        confidence: 0.72 + Math.sin(this.angle * 2) * 0.15,
      },
      timestamp: Date.now(),
    }

    const metrics: SystemMetrics = {
      fps: 10,
      latencyMs: 18 + Math.random() * 12,
      packetsReceived: this.packets,
      processingTimeMs: 4 + Math.random() * 6,
      peopleDetected: 1,
      sensorsActive: 2,
      connectionStatus: 'connected',
    }

    this.emit({ type: 'detection', payload: detection, timestamp: Date.now() })
    this.emit({ type: 'metrics', payload: metrics, timestamp: Date.now() })

    if (this.packets % 50 === 0) {
      this.emitLog('debug', `Pacote #${this.packets} processado`, {
        processingTimeMs: metrics.processingTimeMs,
      })
    }
  }

  private emitLog(level: LogEntry['level'], message: string, meta?: Record<string, unknown>): void {
    const entry: LogEntry = {
      id: createId('log'),
      level,
      message,
      timestamp: Date.now(),
      meta,
    }
    this.emit({ type: 'log', payload: entry, timestamp: entry.timestamp })
  }

  private emit(message: RealtimeMessage): void {
    for (const listener of this.listeners) {
      listener(message)
    }
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status
    for (const listener of this.statusListeners) {
      listener(status)
    }
  }
}
