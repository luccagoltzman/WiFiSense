import type { FloorPlan } from '@/types'

/** Planta demo de uma residência simples (dimensões em metros). */
export const DEMO_FLOOR_PLAN: FloorPlan = {
  id: 'home-demo',
  name: 'Residência Demo',
  width: 10,
  height: 8,
  walls: [
    { id: 'w1', from: { x: 0, y: 0 }, to: { x: 10, y: 0 } },
    { id: 'w2', from: { x: 10, y: 0 }, to: { x: 10, y: 8 } },
    { id: 'w3', from: { x: 10, y: 8 }, to: { x: 0, y: 8 } },
    { id: 'w4', from: { x: 0, y: 8 }, to: { x: 0, y: 0 } },
    { id: 'w5', from: { x: 5, y: 0 }, to: { x: 5, y: 4.5 } },
    { id: 'w6', from: { x: 0, y: 4.5 }, to: { x: 5, y: 4.5 } },
  ],
  features: [
    { id: 'd1', kind: 'door', from: { x: 2.2, y: 4.5 }, to: { x: 3.2, y: 4.5 } },
    { id: 'd2', kind: 'door', from: { x: 5, y: 2 }, to: { x: 5, y: 3 } },
    { id: 'win1', kind: 'window', from: { x: 1, y: 0 }, to: { x: 2.5, y: 0 } },
    { id: 'win2', kind: 'window', from: { x: 6.5, y: 0 }, to: { x: 8.5, y: 0 } },
    { id: 'win3', kind: 'window', from: { x: 10, y: 3 }, to: { x: 10, y: 5 } },
  ],
  sensors: [
    {
      id: 'esp32-1',
      name: 'ESP32 Sala',
      position: { x: 7.5, y: 6 },
      active: true,
      rssi: -42,
    },
    {
      id: 'esp32-2',
      name: 'ESP32 Quarto',
      position: { x: 2.5, y: 2 },
      active: true,
      rssi: -48,
    },
  ],
}
