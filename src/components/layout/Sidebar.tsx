import { NavLink } from 'react-router-dom'
import { APP_NAME, ROUTES } from '@/constants'

const links = [
  { to: ROUTES.dashboard, label: 'Dashboard' },
  { to: ROUTES.floorMap, label: 'Planta' },
  { to: ROUTES.console, label: 'Console' },
]

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-panel/80 backdrop-blur-sm">
      <div className="border-b border-line px-5 py-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-signal uppercase">CSI · MVP</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{APP_NAME}</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === ROUTES.dashboard}
            className={({ isActive }) =>
              [
                'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-signal-soft text-signal'
                  : 'text-ink-muted hover:bg-surface hover:text-ink',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-4 font-mono text-[11px] text-ink-muted">
        Fase 1 · em memória
      </div>
    </aside>
  )
}
