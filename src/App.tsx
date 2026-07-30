import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { MainLayout } from '@/layouts/MainLayout'
import { ConsolePage } from '@/pages/ConsolePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FloorMapPage } from '@/pages/FloorMapPage'
import { ServicesContext } from '@/hooks/useServices'
import { createServices } from '@/services'

const services = createServices()

export default function App() {
  return (
    <ServicesContext.Provider value={services}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.floorMap} element={<FloorMapPage />} />
            <Route path={ROUTES.console} element={<ConsolePage />} />
            <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ServicesContext.Provider>
  )
}
