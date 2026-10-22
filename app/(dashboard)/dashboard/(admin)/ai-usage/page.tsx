import { Coins, Sparkles, TrendingUp, Cpu, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AIUsagePage() {
  const modelStats = [
    {
      model: 'gemini-2.5-flash',
      provider: 'Google AI Studio',
      inputTokens: '184,200',
      outputTokens: '92,400',
      totalCost: '$0.04',
      status: 'Active / Healthy',
    },
    {
      model: 'Domain Synthesis Engine (Local)',
      provider: 'Built-in Fallback',
      inputTokens: '45,000',
      outputTokens: '32,100',
      totalCost: '$0.00',
      status: 'Ready',
    },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          <Coins className="size-4" />
          <span>Resource & Cost Tracking</span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
          AI Token Consumption & Model Telemetry
        </h1>
        <p className="text-sm text-dashboard-muted-foreground">
          Monitor token utilization, model latency, and cost estimates across all AI studio jobs and autonomous agents.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
            Total Tokens Processed
          </span>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            353,700
          </h3>
          <p className="mt-1 text-sm text-purple-600 dark:text-purple-400 font-medium">
            Across 14 generation jobs
          </p>
        </div>

        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
            Estimated Cost MTD
          </span>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            $0.04 USD
          </h3>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            Well within free / low-tier quotas
          </p>
        </div>

        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
          <span className="text-sm font-medium uppercase tracking-wider text-dashboard-muted-foreground">
            Cache Hit Rate
          </span>
          <h3 className="font-heading mt-2 text-3xl font-bold text-dashboard-foreground">
            88.4%
          </h3>
          <p className="mt-1 text-sm text-sky-500 font-medium">
            Prompt optimization active
          </p>
        </div>
      </div>

      {/* Model Breakdown */}
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
        <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground border-b border-dashboard-border pb-3">
          Model Utilization Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border text-dashboard-muted-foreground">
                <th className="py-2.5 font-medium">Model</th>
                <th className="py-2.5 font-medium">Provider</th>
                <th className="py-2.5 font-medium">Input Tokens</th>
                <th className="py-2.5 font-medium">Output Tokens</th>
                <th className="py-2.5 font-medium">Estimated Cost</th>
                <th className="py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {modelStats.map((stat) => (
                <tr key={stat.model} className="hover:bg-dashboard-accent/40">
                  <td className="py-3 font-semibold text-dashboard-foreground">{stat.model}</td>
                  <td className="py-3 text-dashboard-muted-foreground">{stat.provider}</td>
                  <td className="py-3 font-mono text-dashboard-muted-foreground">{stat.inputTokens}</td>
                  <td className="py-3 font-mono text-dashboard-muted-foreground">{stat.outputTokens}</td>
                  <td className="py-3 font-semibold text-dashboard-foreground">{stat.totalCost}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-dashboard-caption font-semibold text-emerald-600 dark:text-emerald-400">
                      {stat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
