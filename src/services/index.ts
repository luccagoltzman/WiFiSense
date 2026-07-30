import { HttpApiService } from './api/HttpApiService'
import type { ApiService } from './api/ApiService'
import { MemoryStorageService } from './storage/MemoryStorageService'
import type { StorageService } from './storage/StorageService'
import { MockRealtimeService } from './websocket/MockRealtimeService'
import { WebSocketRealtimeService } from './websocket/WebSocketRealtimeService'
import type { RealtimeService } from './websocket/RealtimeService'

export interface AppServices {
  api: ApiService
  realtime: RealtimeService
  storage: StorageService
}

/**
 * Composition root.
 * Troque apenas as implementações aqui ao integrar Supabase/banco.
 */
export function createServices(): AppServices {
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

  return {
    api: new HttpApiService(),
    realtime: useMock ? new MockRealtimeService() : new WebSocketRealtimeService(),
    storage: new MemoryStorageService(),
  }
}

export type { ApiService, RealtimeService, StorageService }
