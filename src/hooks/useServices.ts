import { createContext, useContext } from 'react'
import type { AppServices } from '@/services'

export const ServicesContext = createContext<AppServices | null>(null)

export function useServices(): AppServices {
  const services = useContext(ServicesContext)
  if (!services) {
    throw new Error('useServices deve ser usado dentro de ServicesProvider')
  }
  return services
}
