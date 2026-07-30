import type { FloorPlan, SystemMetrics } from '@/types'

/**
 * Cliente HTTP para recursos que não precisam de tempo real.
 */
export interface ApiService {
  getHealth(): Promise<{ status: string; uptimeMs: number }>
  getMetrics(): Promise<SystemMetrics>
  getFloorPlan(): Promise<FloorPlan>
}
