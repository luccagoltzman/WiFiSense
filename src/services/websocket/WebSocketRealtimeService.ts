import { WS_RECONNECT_MS, WS_URL } from '@/constants'
import type { ConnectionStatus, RealtimeMessage } from '@/types'
import type { RealtimeListener, RealtimeService, StatusListener } from './RealtimeService'

export class WebSocketRealtimeService implements RealtimeService {
  private socket: WebSocket | null = null
  private status: ConnectionStatus = 'disconnected'
  private listeners = new Set<RealtimeListener>()
  private statusListeners = new Set<StatusListener>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private shouldReconnect = false

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN || this.status === 'connecting') {
      return
    }

    this.shouldReconnect = true
    this.setStatus('connecting')

    try {
      this.socket = new WebSocket(WS_URL)
    } catch {
      this.setStatus('error')
      this.scheduleReconnect()
      return
    }

    this.socket.onopen = () => {
      this.setStatus('connected')
    }

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(String(event.data)) as RealtimeMessage
        for (const listener of this.listeners) {
          listener(message)
        }
      } catch {
        // Ignora frames inválidos para não derrubar o stream.
      }
    }

    this.socket.onerror = () => {
      this.setStatus('error')
    }

    this.socket.onclose = () => {
      this.socket = null
      if (this.shouldReconnect) {
        this.setStatus('disconnected')
        this.scheduleReconnect()
      }
    }
  }

  disconnect(): void {
    this.shouldReconnect = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.socket?.close()
    this.socket = null
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

  private setStatus(status: ConnectionStatus): void {
    this.status = status
    for (const listener of this.statusListeners) {
      listener(status)
    }
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect || this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, WS_RECONNECT_MS)
  }
}
