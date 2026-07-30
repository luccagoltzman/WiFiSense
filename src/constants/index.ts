export const APP_NAME = 'WiFiSense'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
export const WS_URL = import.meta.env.VITE_WS_URL ?? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`

/** Intervalo de reconexão do WebSocket (ms). */
export const WS_RECONNECT_MS = 2000

/** Máximo de logs mantidos em memória. */
export const MAX_LOG_ENTRIES = 500

/** Máximo de detecções recentes mantidas para trail/histórico curto. */
export const MAX_DETECTION_HISTORY = 120

export const ROUTES = {
  dashboard: '/',
  floorMap: '/planta',
  console: '/console',
} as const
