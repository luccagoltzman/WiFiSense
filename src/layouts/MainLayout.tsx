import type { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'
import { RealtimeContext } from '@/hooks/RealtimeContext'

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Status da conexão, sensores e detecções',
  },
  '/planta': {
    title: 'Planta da Casa',
    subtitle: 'Mapa em tempo real com sensores e posição estimada',
  },
  '/console': {
    title: 'Console',
    subtitle: 'Pacotes, eventos e logs de processamento',
  },
}

export function MainLayout() {
  const location = useLocation()
  const session = useRealtimeSession()
  const meta = PAGE_META[location.pathname] ?? PAGE_META['/']

  return (
    <RealtimeContext.Provider value={session}>
      <div className="flex h-full min-h-0">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header title={meta.title} subtitle={meta.subtitle} status={session.status} />
          <main className="min-h-0 flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </RealtimeContext.Provider>
  )
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex h-full max-w-7xl flex-col gap-5">{children}</div>
}
