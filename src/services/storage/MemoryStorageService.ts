import { MAX_DETECTION_HISTORY, MAX_LOG_ENTRIES } from '@/constants'
import { DEMO_FLOOR_PLAN } from '@/models/floorPlan'
import type { FloorPlan, LogEntry, PersonDetection, SystemMetrics } from '@/types'
import type { StorageService } from './StorageService'

const DEFAULT_METRICS: SystemMetrics = {
  fps: 0,
  latencyMs: 0,
  packetsReceived: 0,
  processingTimeMs: 0,
  peopleDetected: 0,
  sensorsActive: DEMO_FLOOR_PLAN.sensors.filter((s) => s.active).length,
  connectionStatus: 'disconnected',
}

/**
 * Implementação em memória para o MVP.
 * Troque por SupabaseStorageService sem alterar a UI.
 */
export class MemoryStorageService implements StorageService {
  private floorPlan: FloorPlan = structuredClone(DEMO_FLOOR_PLAN)
  private detections: PersonDetection[] = []
  private logs: LogEntry[] = []
  private metrics: SystemMetrics = { ...DEFAULT_METRICS }

  async getFloorPlan(): Promise<FloorPlan | null> {
    return structuredClone(this.floorPlan)
  }

  async saveFloorPlan(plan: FloorPlan): Promise<void> {
    this.floorPlan = structuredClone(plan)
  }

  async getDetections(): Promise<PersonDetection[]> {
    return [...this.detections]
  }

  async appendDetection(detection: PersonDetection): Promise<void> {
    this.detections.push(detection)
    if (this.detections.length > MAX_DETECTION_HISTORY) {
      this.detections = this.detections.slice(-MAX_DETECTION_HISTORY)
    }
  }

  async clearDetections(): Promise<void> {
    this.detections = []
  }

  async getLogs(): Promise<LogEntry[]> {
    return [...this.logs]
  }

  async appendLog(entry: LogEntry): Promise<void> {
    this.logs.push(entry)
    if (this.logs.length > MAX_LOG_ENTRIES) {
      this.logs = this.logs.slice(-MAX_LOG_ENTRIES)
    }
  }

  async clearLogs(): Promise<void> {
    this.logs = []
  }

  async getMetrics(): Promise<SystemMetrics | null> {
    return { ...this.metrics }
  }

  async saveMetrics(metrics: SystemMetrics): Promise<void> {
    this.metrics = { ...metrics }
  }
}
