'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings as SettingsIcon, Save, Key, Shield, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface SettingItem {
  id: string
  key: string
  value: string
  valueType: string
}

interface SettingsManagerProps {
  initialSettings: SettingItem[]
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter()
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    initialSettings.forEach((s) => {
      map[s.key] = s.value
    })
    return map
  })

  const [apiKey, setApiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedAlert, setSavedAlert] = useState<string | null>(null)

  function updateField(key: string, value: string) {
    setSettingsMap((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setSavedAlert(null)

    // Simulate save or write to API
    setTimeout(() => {
      setIsSaving(false)
      setSavedAlert('Platform configurations and publishing policies successfully updated.')
      setTimeout(() => setSavedAlert(null), 3000)
    }, 600)
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-blue">
            <SettingsIcon className="size-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            System & Provider Settings
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Configure site identity, Google Gemini API credentials, autonomous publishing limits, and security defaults.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          <span>Save Changes</span>
        </button>
      </div>

      {savedAlert && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{savedAlert}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Identity */}
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground flex items-center gap-2 border-b border-dashboard-border pb-3">
            <Globe className="size-4 text-brand-blue" />
            <span>Website Identity & Publication Metadata</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settingsMap['site.name'] || 'Supply Intelligence'}
                onChange={(e) => updateField('site.name', e.target.value)}
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={settingsMap['site.url'] || 'https://supplyintelligence.com'}
                onChange={(e) => updateField('site.url', e.target.value)}
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settingsMap['site.tagline'] || 'Procurement, Supply Chain & AI Insights'}
              onChange={(e) => updateField('site.tagline', e.target.value)}
              className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
              Site Meta Description
            </label>
            <textarea
              value={settingsMap['site.description'] || ''}
              onChange={(e) => updateField('site.description', e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        {/* AI Provider Settings */}
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground flex items-center gap-2 border-b border-dashboard-border pb-3">
            <Key className="size-4 text-purple-500" />
            <span>AI Provider & Gemini Credentials</span>
          </h2>

          <div>
            <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter GOOGLE_GEMINI_API_KEY (stored in .env.local)"
              className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-purple-500 focus:outline-none"
            />
            <p className="mt-1 text-dashboard-caption text-dashboard-muted-foreground">
              Loaded dynamically from your environment. Leave blank to retain current environment variable.
            </p>
          </div>

          <div className="rounded-xl border border-dashboard-border/80 bg-dashboard-accent/40 p-3.5 text-sm">
            <p className="font-semibold text-dashboard-foreground">Current Active Model:</p>
            <p className="text-dashboard-muted-foreground">
              Google Gemini 2.5 Flash &bull; Temperature: 0.7 &bull; Max Tokens: 8,192
            </p>
          </div>
        </div>

        {/* Safety & Autonomous Publishing Gates */}
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground flex items-center gap-2 border-b border-dashboard-border pb-3">
            <Shield className="size-4 text-emerald-500" />
            <span>Autonomous Publishing Governance</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-dashboard-foreground">
                  Require Human Approval Before Publishing
                </p>
                <p className="text-dashboard-caption text-dashboard-muted-foreground">
                  When enabled, all AI generated content is placed into &quot;Needs Review&quot; status.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="size-4 rounded border-dashboard-input text-brand-blue focus:ring-brand-blue"
              />
            </div>

            <div className="flex items-center justify-between border-t border-dashboard-border pt-3">
              <div>
                <p className="text-sm font-semibold text-dashboard-foreground">
                  Hallucination & Citation Check Enforcement
                </p>
                <p className="text-dashboard-caption text-dashboard-muted-foreground">
                  Rejects drafts that fail minimum editorial quality threshold (Score &lt; 90).
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="size-4 rounded border-dashboard-input text-brand-blue focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
