import type { ConnectionStatus, RealtimeMessage } from '@/types'

export type RealtimeListener = (message: RealtimeMessage) => void
export type StatusListener = (status: ConnectionStatus) => void

/**
 * Canal em tempo real (WebSocket hoje; pode virar outro transporte depois).
 */
export interface RealtimeService {
  connect(): void
  disconnect(): void
  getStatus(): ConnectionStatus
  subscribe(listener: RealtimeListener): () => void
  onStatusChange(listener: StatusListener): () => void
}
