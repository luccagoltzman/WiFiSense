import { useEffect, useState } from 'react'
import type { FloorPlan } from '@/types'
import { useServices } from './useServices'

export function useFloorPlan() {
  const { storage, api } = useServices()
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      try {
        const fromApi = await api.getFloorPlan()
        if (!active) return
        await storage.saveFloorPlan(fromApi)
        setFloorPlan(fromApi)
      } catch {
        const fromStorage = await storage.getFloorPlan()
        if (active) setFloorPlan(fromStorage)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [api, storage])

  return { floorPlan, loading }
}
