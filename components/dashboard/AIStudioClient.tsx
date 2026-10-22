'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Bot,
  Wand2,
  Send,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Search,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIStudioClientProps {
  categories: Array<{ id: string; name: string }>
}

export function AIStudioClient({ categories }: AIStudioClientProps) {
  const router = useRouter()

  const [topic, setTopic] = useState('Agentic AI in Real-Time Freight Dispatch and Route Optimization')
  const [category, setCategory] = useState(categories[0]?.name || 'Logistics & Transportation')
  const [contentType, setContentType] = useState('ANALYSIS')
  const [targetLength, setTargetLength] = useState<'short' | 'medium' | 'deep-dive'>('medium')
  const [tone, setTone] = useState('Executive, Analytical, Data-Backed')
  const [customInstructions, setCustomInstructions] = useState('')

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<any | null>(null)
  const [isSendingToDraft, setIsSendingToDraft] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleGenerate() {
    if (!topic.trim()) {
      setErrorMessage('Please specify an intelligence topic to generate.')
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category,
          contentType,
          targetLength,
          tone,
          customInstructions,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to generate content')
      }

      const data = await res.json()
      setGeneratedResult(data)
    } catch (err: any) {
      setErrorMessage(err.message || 'Error running AI generation')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSendToDraft() {
    if (!generatedResult) return
    setIsSendingToDraft(true)

    const catObj = categories.find((c) => c.name === category)

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generatedResult.title,
          slug: generatedResult.slug,
          excerpt: generatedResult.excerpt,
          bodyHtml: generatedResult.bodyHtml,
          categoryId: catObj?.id || null,
          status: 'NEEDS_REVIEW',
          contentType,
          seoTitle: generatedResult.seoTitle,
          seoDescription: generatedResult.seoDescription,
          primaryKeyword: generatedResult.primaryKeyword,
          secondaryKeywords: generatedResult.secondaryKeywords,
          readingTimeMinutes: generatedResult.readingTimeMinutes,
          tags: generatedResult.tags || [category, 'AI', 'Supply Chain'],
          isAiGenerated: true,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create draft article')
      }

      const created = await res.json()
      router.push(`/dashboard/articles/${created.id}`)
    } catch (err: any) {
      alert(err.message || 'Error saving to draft')
    } finally {
      setIsSendingToDraft(false)
    }
  }

  function handleCopyHtml() {
    if (!generatedResult?.bodyHtml) return
    navigator.clipboard.writeText(generatedResult.bodyHtml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Sparkles className="size-4" />
            <span>AI Content Studio & Synthesis Engine</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Enterprise Intelligence Studio
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Generate strategic executive supply chain articles with research verification, automated QA scoring, and SEO optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400">
            <Bot className="size-3.5" />
            <span>Gemini 2.5 Flash Engine</span>
          </span>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2-Panel Layout: Generation Controls (5 cols) + Output Canvas (7 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Generation Controls */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-4">
            <h2 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground flex items-center gap-2 border-b border-dashboard-border pb-3">
              <Wand2 className="size-4 text-purple-500" />
              <span>Prompt Parameters</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Strategic Topic or Headline *
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="e.g., Nearshoring the Tier-2 Supplier Base: Empirical Tradeoffs in Total Landed Cost"
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm font-medium text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  Industry Vertical
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-purple-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  Content Type
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-purple-500 focus:outline-none"
                >
                  <option value="ANALYSIS">Analysis & Deep-Dive</option>
                  <option value="EXPLAINER">Explainer</option>
                  <option value="NEWS">Industry News</option>
                  <option value="HOWTO">How-to Guide</option>
                  <option value="TECHNOLOGY">Tech Spotlight</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  Target Length
                </label>
                <select
                  value={targetLength}
                  onChange={(e) => setTargetLength(e.target.value as any)}
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-purple-500 focus:outline-none"
                >
                  <option value="short">Brief (500-700 words)</option>
                  <option value="medium">Standard (800-1,200 words)</option>
                  <option value="deep-dive">Deep-Dive (1,500+ words)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                  Editorial Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Executive, Analytical"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Custom Research Instructions (Optional)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={2}
                placeholder="Include a 4-point implementation checklist, quote an advisory partner, and reference port dwell metrics..."
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-brand-blue to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all hover:opacity-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>Synthesizing Intelligence Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Synthesize with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Ideas */}
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-dashboard-muted-foreground">
              Trending Supply Chain Prompts
            </h3>
            <div className="space-y-2">
              {[
                'Nearshoring the Tier-2 Supplier Base: Empirical Tradeoffs in Total Landed Cost',
                'Agentic Workflows in Automated Freight Matching: Beyond Simple Digital Brokerage',
                'Predictive Safety Stock Calibration: Mitigating Blank Sailings with Bayesian Sensing',
                'Scope 3 Decarbonization Mandates: Enforcing Supplier Auditability in High-Emission Supply Chains',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTopic(preset)}
                  className="w-full text-left rounded-xl border border-dashboard-border/80 bg-dashboard-background/50 p-2.5 text-sm text-dashboard-foreground transition-colors hover:border-purple-500/40 hover:bg-dashboard-accent line-clamp-2"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Synthesis Output Canvas */}
        <div className="space-y-5 lg:col-span-7">
          {generatedResult ? (
            <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm space-y-6">
              {/* Output Header with Action Bar */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-dashboard-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-sm font-semibold text-purple-600 dark:text-purple-400">
                      <Sparkles className="size-3" />
                      <span>Synthesized</span>
                    </span>
                    <span className="text-sm text-dashboard-muted-foreground">
                      {generatedResult.wordCount} words &bull; {generatedResult.readingTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="font-heading mt-2 text-lg font-bold text-dashboard-foreground sm:text-xl">
                    {generatedResult.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="flex items-center gap-1 rounded-xl border border-dashboard-border px-3 py-1.5 text-sm font-medium text-dashboard-foreground hover:bg-dashboard-accent"
                  >
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy HTML'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToDraft}
                    disabled={isSendingToDraft}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
                  >
                    <Send className="size-3.5" />
                    <span>{isSendingToDraft ? 'Creating Draft...' : 'Send to Articles'}</span>
                  </button>
                </div>
              </div>

              {/* Quality & Fact-Check Scorecard */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-xl border border-dashboard-border/80 bg-dashboard-accent/40 p-3.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {generatedResult.qaScore}
                  </div>
                  <div>
                    <p className="font-semibold text-dashboard-foreground">Editorial Quality Score</p>
                    <p className="text-dashboard-caption text-dashboard-muted-foreground">Tone and coherence verified</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-dashboard-muted-foreground text-dashboard-caption">
                  <ShieldCheck className="size-4 shrink-0 text-sky-500" />
                  <span>{generatedResult.factCheckSummary}</span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-background/50 p-4">
                <p className="text-sm font-semibold text-dashboard-foreground uppercase tracking-wider mb-1">
                  Executive Excerpt
                </p>
                <p className="text-sm text-dashboard-muted-foreground leading-relaxed">
                  {generatedResult.excerpt}
                </p>
              </div>

              {/* Body Render */}
              <div className="prose prose-slate max-w-none dark:prose-invert text-sm sm:text-dashboard-body border-t border-dashboard-border pt-4">
                <div dangerouslySetInnerHTML={{ __html: generatedResult.bodyHtml }} />
              </div>

              {/* SEO Tags */}
              <div className="border-t border-dashboard-border pt-4 text-sm space-y-1">
                <p className="font-semibold text-dashboard-foreground">Target Keywords & Metadata:</p>
                <p className="text-dashboard-muted-foreground">
                  <strong>Primary:</strong> {generatedResult.primaryKeyword} &bull;{' '}
                  <strong>Secondary:</strong> {generatedResult.secondaryKeywords}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-dashboard-border p-12 text-center bg-dashboard-card/40">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                <Sparkles className="size-7" />
              </div>
              <h3 className="font-heading text-base font-semibold text-dashboard-foreground">
                AI Synthesis Canvas Ready
              </h3>
              <p className="max-w-md text-sm text-dashboard-muted-foreground mt-1 leading-relaxed">
                Configure your strategic topic and parameters on the left and click
                &ldquo;Synthesize with AI&rdquo; to draft high-impact supply chain content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
