/** Posição no plano da residência (metros). */
export interface Position {
  x: number
  y: number
}

/** Movimento estimado a partir do CSI processado. */
export interface Movement {
  /** Direção em graus (0 = +X, sentido anti-horário). */
  direction: number
  /** Velocidade em m/s. */
  speed: number
}

/** Qualidade da estimativa. */
export interface DetectionQuality {
  /** Confiança entre 0 e 1. */
  confidence: number
}

/**
 * Payload que o React recebe do backend.
 * CSI bruto nunca chega ao frontend.
 */
export interface PersonDetection {
  id: string
  position: Position
  movement: Movement
  quality: DetectionQuality
  timestamp: number
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export interface SensorInfo {
  id: string
  name: string
  position: Position
  active: boolean
  rssi?: number
}

export interface SystemMetrics {
  fps: number
  latencyMs: number
  packetsReceived: number
  processingTimeMs: number
  peopleDetected: number
  sensorsActive: number
  connectionStatus: ConnectionStatus
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  id: string
  level: LogLevel
  message: string
  timestamp: number
  meta?: Record<string, unknown>
}

export type RealtimeEventType =
  | 'detection'
  | 'metrics'
  | 'sensor'
  | 'log'
  | 'heartbeat'

export interface RealtimeMessage<T = unknown> {
  type: RealtimeEventType
  payload: T
  timestamp: number
}

/** Elementos geométricos da planta (metros). */
export interface WallSegment {
  id: string
  from: Position
  to: Position
}

export interface FloorPlanFeature {
  id: string
  kind: 'door' | 'window'
  from: Position
  to: Position
}

export interface FloorPlan {
  id: string
  name: string
  width: number
  height: number
  walls: WallSegment[]
  features: FloorPlanFeature[]
  sensors: SensorInfo[]
}
