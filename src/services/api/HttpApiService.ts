import { API_BASE_URL } from '@/constants'
import { DEMO_FLOOR_PLAN } from '@/models/floorPlan'
import type { FloorPlan, SystemMetrics } from '@/types'
import type { ApiService } from './ApiService'

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`API ${path} falhou: ${response.status}`)
  }
  return response.json() as Promise<T>
}

/**
 * Cliente REST. Em falha de rede, o app pode cair no Storage/mock.
 */
export class HttpApiService implements ApiService {
  async getHealth(): Promise<{ status: string; uptimeMs: number }> {
    return request('/health')
  }

  async getMetrics(): Promise<SystemMetrics> {
    return request('/metrics')
  }

  async getFloorPlan(): Promise<FloorPlan> {
    try {
      return await request('/floor-plan')
    } catch {
      return structuredClone(DEMO_FLOOR_PLAN)
    }
  }
}
