'use client'

import { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopbar } from './DashboardTopbar'

interface DashboardShellProps {
  children: React.ReactNode
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
    image?: string | null
  }
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-dashboard-background p-2.5 text-dashboard-body text-dashboard-foreground max-md:p-2 min-[1600px]:px-4 min-[1600px]:py-3.5 **:focus-visible:outline-2 **:focus-visible:outline-offset-3 **:focus-visible:outline-brand-blue">
      <DashboardTopbar onOpenMobile={() => setMobileOpen(true)} user={user} />
      <div className="flex min-h-0 flex-1 gap-4.5 min-[1600px]:gap-7">
        <div
          className="relative hidden h-full w-13 shrink-0 md:block"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') setSidebarExpanded(true)
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') setSidebarExpanded(false)
          }}
        >
          <DashboardSidebar
            user={user}
            compact={!sidebarExpanded}
            onToggleCompact={() => setSidebarExpanded((expanded) => !expanded)}
          />
        </div>

        {mobileOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
              <DashboardSidebar user={user} onCloseMobile={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        <main className="min-w-0 flex-1 overflow-y-auto pt-1 pr-2 pb-5 [scrollbar-color:var(--dashboard-border)_transparent] [scrollbar-width:thin] max-md:px-px [&_input]:rounded-xl [&_select]:rounded-xl [&_textarea]:rounded-xl">
          <div className="mx-auto max-w-420">{children}</div>
        </main>
      </div>
    </div>
  )
}
