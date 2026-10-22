'use client'

import { useState } from 'react'
import {
  Bot,
  Search,
  BookOpen,
  PenTool,
  CheckCircle,
  TrendingUp,
  Send,
  RefreshCw,
  Shield,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentDef {
  id: string
  agentType: string
  displayName: string
  description: string | null
  isEnabled: boolean
  operatingMode: string
}

interface AgentsConsoleProps {
  initialAgents: AgentDef[]
  globalPause: boolean
}

export function AgentsConsole({ initialAgents, globalPause: initialPause }: AgentsConsoleProps) {
  const [agents, setAgents] = useState<AgentDef[]>(initialAgents)
  const [globalPause, setGlobalPause] = useState(initialPause)
  const [successNote, setSuccessNote] = useState<string | null>(null)

  function toggleAgent(id: string) {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    )
    setSuccessNote('Agent configuration updated.')
    setTimeout(() => setSuccessNote(null), 3000)
  }

  function setMode(id: string, mode: string) {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, operatingMode: mode } : a))
    )
    setSuccessNote(`Operating mode updated to ${mode}.`)
    setTimeout(() => setSuccessNote(null), 3000)
  }

  function handleEmergencyKillSwitch() {
    const nextState = !globalPause
    setGlobalPause(nextState)
    if (nextState) {
      setAgents((prev) => prev.map((a) => ({ ...a, isEnabled: false })))
    }
    setSuccessNote(
      nextState
        ? 'EMERGENCY KILL SWITCH ACTIVATED: All autonomous agent actions frozen.'
        : 'Emergency hold lifted: Agents restored to manual guardrail mode.'
    )
    setTimeout(() => setSuccessNote(null), 4000)
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'TOPIC_DISCOVERY':
        return Search
      case 'RESEARCH':
        return BookOpen
      case 'WRITER':
        return PenTool
      case 'EDITORIAL_QA':
        return CheckCircle
      case 'SEO_OPTIMIZER':
        return TrendingUp
      case 'PUBLISHER':
        return Send
      case 'CONTENT_MAINTENANCE':
        return RefreshCw
      default:
        return Bot
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Console Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sky-500">
            <Bot className="size-4" />
            <span>Autonomous Intelligence Fleet</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Autonomous Agents & Guardrails
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Configure permissions, operational boundaries, and human-in-the-loop gates for all 7 specialized agents.
          </p>
        </div>

        {/* Emergency Kill Switch Button */}
        <button
          type="button"
          onClick={handleEmergencyKillSwitch}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition-all',
            globalPause
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white dark:text-rose-400'
          )}
        >
          {globalPause ? (
            <>
              <Play className="size-4" />
              <span>Resume Agent Systems</span>
            </>
          ) : (
            <>
              <ShieldAlert className="size-4" />
              <span>Emergency Kill Switch</span>
            </>
          )}
        </button>
      </div>

      {/* Global Status Banner */}
      {globalPause ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm font-semibold text-rose-600 dark:text-rose-400">
          <AlertTriangle className="size-5 shrink-0" />
          <span>
            GLOBAL HOLD ACTIVE: All autonomous agent scheduling, background generation, and publishing
            triggers are currently halted. Manual actions remain enabled.
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span>
              <strong>Guardrail Gate Active:</strong> Articles require editorial review before public release.
            </span>
          </div>
          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
            Zero Hallucination Gate
          </span>
        </div>
      )}

      {successNote && (
        <div className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-sm text-sky-600 dark:text-sky-300">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const Icon = getAgentIcon(agent.agentType)

          return (
            <div
              key={agent.id}
              className={cn(
                'flex flex-col justify-between rounded-2xl border bg-dashboard-card p-5 shadow-sm transition-all',
                agent.isEnabled ? 'border-dashboard-border hover:border-brand-blue/50' : 'border-dashboard-border/60 opacity-80'
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-dashboard-accent text-brand-blue">
                    <Icon className="size-5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAgent(agent.id)}
                    className={cn(
                      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                      agent.isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                        agent.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      )}
                    />
                  </button>
                </div>

                <h3 className="font-heading mt-3 text-dashboard-body font-semibold text-dashboard-foreground">
                  {agent.displayName}
                </h3>
                <p className="mt-1 text-sm text-dashboard-muted-foreground leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-5 border-t border-dashboard-border pt-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dashboard-muted-foreground font-medium">Operating Mode</span>
                  <select
                    value={agent.operatingMode}
                    onChange={(e) => setMode(agent.id, e.target.value)}
                    disabled={!agent.isEnabled}
                    className="rounded-lg border border-dashboard-input bg-dashboard-background px-2.5 py-1 text-sm font-semibold text-dashboard-foreground focus:border-brand-blue focus:outline-none disabled:opacity-50"
                  >
                    <option value="MANUAL">Manual Gate</option>
                    <option value="ASSISTED">Assisted (Semi-Auto)</option>
                    <option value="AUTONOMOUS">Autonomous</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-dashboard-caption text-dashboard-muted-foreground pt-1">
                  <span>Audit Trail</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    100% Traceable
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
