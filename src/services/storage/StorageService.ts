import type { FloorPlan, LogEntry, PersonDetection, SystemMetrics } from '@/types'

/**
 * Camada de persistência.
 * MVP: memória. Futuro: Supabase / Firebase / PostgreSQL.
 */
export interface StorageService {
  getFloorPlan(): Promise<FloorPlan | null>
  saveFloorPlan(plan: FloorPlan): Promise<void>

  getDetections(): Promise<PersonDetection[]>
  appendDetection(detection: PersonDetection): Promise<void>
  clearDetections(): Promise<void>

  getLogs(): Promise<LogEntry[]>
  appendLog(entry: LogEntry): Promise<void>
  clearLogs(): Promise<void>

  getMetrics(): Promise<SystemMetrics | null>
  saveMetrics(metrics: SystemMetrics): Promise<void>
}
