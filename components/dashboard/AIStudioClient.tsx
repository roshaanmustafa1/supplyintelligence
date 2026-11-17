"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
  Link2,
  MessageSquarePlus,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AIStudioClientProps {
  categories: Array<{ id: string; name: string }>
}

interface GeneratedAIResult {
  title?: string
  slug?: string
  excerpt?: string
  bodyHtml?: string
  seoTitle?: string
  seoDescription?: string
  primaryKeyword?: string
  secondaryKeywords?: string
  readingTimeMinutes?: number
  wordCount?: number
  qaScore?: number
  factCheckSummary?: string
  modelUsed?: string
  tags?: string[]
  featuredImage?: string | null
  featuredImageAlt?: string | null
  sourceUrl?: string
  sourceName?: string
  sourceText?: string
  imagesImported?: number
}

export function AIStudioClient({ categories }: AIStudioClientProps) {
  const router = useRouter()

  const [topic, setTopic] = useState(
    "Agentic AI in Real-Time Freight Dispatch and Route Optimization"
  )
  const [category, setCategory] = useState(
    categories[0]?.name || "Logistics & Transportation"
  )
  const [contentType, setContentType] = useState("ANALYSIS")
  const [targetLength, setTargetLength] = useState<
    "short" | "medium" | "deep-dive"
  >("medium")
  const [tone, setTone] = useState("Executive, Analytical, Data-Backed")
  const [customInstructions, setCustomInstructions] = useState("")

  const [mode, setMode] = useState<"topic" | "import">("topic")
  const [sourceUrl, setSourceUrl] = useState("")
  const [importInstructions, setImportInstructions] = useState("")
  const [changeRequest, setChangeRequest] = useState("")
  const [appliedChanges, setAppliedChanges] = useState<string[]>([])
  const [isRevising, setIsRevising] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] =
    useState<GeneratedAIResult | null>(null)
  const [isSendingToDraft, setIsSendingToDraft] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleGenerate() {
    if (!topic.trim()) {
      setErrorMessage("Please specify an intelligence topic to generate.")
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(err.error || "Failed to generate content")
      }

      const data = await res.json()
      setGeneratedResult(data)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error running AI generation"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleImport() {
    if (!sourceUrl.trim()) {
      setErrorMessage("Paste the link of the article you want to import.")
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/ai/import-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: sourceUrl.trim(),
          category,
          instructions: importInstructions,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok || !data) {
        throw new Error(data?.error || "Failed to import the article")
      }

      setGeneratedResult(data)
      setAppliedChanges([])
      setChangeRequest("")
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error importing the article"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleRevise() {
    if (!generatedResult || !changeRequest.trim()) return

    setIsRevising(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/ai/revise-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article: generatedResult,
          instruction: changeRequest.trim(),
          sourceUrl: generatedResult.sourceUrl,
          sourceText: generatedResult.sourceText,
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok || !data) {
        throw new Error(data?.error || "Failed to apply the changes")
      }

      // Keep the cover image and source details; only the written content changes.
      setGeneratedResult((previous) => ({ ...previous, ...data }))
      setAppliedChanges((previous) => [...previous, changeRequest.trim()])
      setChangeRequest("")
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error applying the changes"
      )
    } finally {
      setIsRevising(false)
    }
  }

  async function handleSendToDraft() {
    if (!generatedResult) return
    setIsSendingToDraft(true)

    const catObj = categories.find((c) => c.name === category)

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedResult.title,
          slug: generatedResult.slug,
          excerpt: generatedResult.excerpt,
          bodyHtml: generatedResult.bodyHtml,
          categoryId: catObj?.id || null,
          status: "NEEDS_REVIEW",
          contentType,
          seoTitle: generatedResult.seoTitle,
          seoDescription: generatedResult.seoDescription,
          primaryKeyword: generatedResult.primaryKeyword,
          secondaryKeywords: generatedResult.secondaryKeywords,
          readingTimeMinutes: generatedResult.readingTimeMinutes,
          tags: generatedResult.tags || [category, "AI", "Supply Chain"],
          featuredImage: generatedResult.featuredImage || undefined,
          featuredImageAlt: generatedResult.featuredImageAlt || undefined,
          isAiGenerated: true,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create draft article")
      }

      const created = await res.json()
      router.push(`/dashboard/articles/${created.id}`)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving to draft")
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
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-purple-600 uppercase dark:text-purple-400">
            <Sparkles className="size-4" />
            <span>AI Content Studio & Synthesis Engine</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Enterprise Intelligence Studio
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Generate strategic executive supply chain articles with research
            verification, automated QA scoring, and SEO optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400">
            <Bot className="size-3.5" />
            <span>Gemini 3.8 Flash Engine</span>
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
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Generation Controls */}
        <div className="space-y-5 lg:col-span-5">
          <div
            role="tablist"
            aria-label="Generation mode"
            className="grid grid-cols-2 gap-1 rounded-xl border border-dashboard-border bg-dashboard-card p-1"
          >
            {(
              [
                ["topic", "Write from topic", Wand2],
                ["import", "Import from link", Link2],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={mode === key}
                onClick={() => setMode(key)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  mode === key
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "text-dashboard-muted-foreground hover:bg-dashboard-accent"
                )}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {mode === "topic" && (
            <div className="space-y-4 rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 border-b border-dashboard-border pb-3 font-heading text-dashboard-body font-semibold text-dashboard-foreground">
                <Wand2 className="size-4 text-purple-500" />
                <span>Prompt Parameters</span>
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
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
                  <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
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
                  <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
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
                  <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
                    Target Length
                  </label>
                  <select
                    value={targetLength}
                    onChange={(e) =>
                      setTargetLength(
                        e.target.value as "short" | "medium" | "deep-dive"
                      )
                    }
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-purple-500 focus:outline-none"
                  >
                    <option value="short">Brief (500-700 words)</option>
                    <option value="medium">Standard (800-1,200 words)</option>
                    <option value="deep-dive">Deep-Dive (1,500+ words)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
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
                <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-brand-blue to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all hover:opacity-95 disabled:opacity-50"
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
          )}

          {mode === "import" && (
            <div className="space-y-4 rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 border-b border-dashboard-border pb-3 font-heading text-dashboard-body font-semibold text-dashboard-foreground">
                <Link2 className="size-4 text-purple-500" />
                <span>Import from Article Link</span>
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
                  Article Link *
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
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
                <label className="mb-1 block text-sm font-medium text-dashboard-muted-foreground">
                  Your Requirements (Optional)
                </label>
                <textarea
                  value={importInstructions}
                  onChange={(e) => setImportInstructions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Keep it under 900 words, add a key takeaways list, focus on the procurement angle..."
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-purple-500 focus:outline-none"
                />
              </div>

              <p className="text-dashboard-caption text-dashboard-muted-foreground">
                The AI reads the page, downloads its images (converted to WebP),
                rewrites the article in original wording and credits the source.
                You can request more changes after the draft appears.
              </p>

              <button
                type="button"
                onClick={handleImport}
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-brand-blue to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition-all hover:opacity-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Reading and rewriting the article...</span>
                  </>
                ) : (
                  <>
                    <Link2 className="size-4" />
                    <span>Import &amp; Rewrite with AI</span>
                  </>
                )}
              </button>
            </div>
          )}

          {mode === "topic" && (
            <div className="space-y-3 rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
              <h3 className="font-heading text-sm font-bold tracking-wider text-dashboard-muted-foreground uppercase">
                Trending Supply Chain Prompts
              </h3>
              <div className="space-y-2">
                {[
                  "Nearshoring the Tier-2 Supplier Base: Empirical Tradeoffs in Total Landed Cost",
                  "Agentic Workflows in Automated Freight Matching: Beyond Simple Digital Brokerage",
                  "Predictive Safety Stock Calibration: Mitigating Blank Sailings with Bayesian Sensing",
                  "Scope 3 Decarbonization Mandates: Enforcing Supplier Auditability in High-Emission Supply Chains",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTopic(preset)}
                    className="line-clamp-2 w-full rounded-xl border border-dashboard-border/80 bg-dashboard-background/50 p-2.5 text-left text-sm text-dashboard-foreground transition-colors hover:border-purple-500/40 hover:bg-dashboard-accent"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Synthesis Output Canvas */}
        <div className="space-y-5 lg:col-span-7">
          {generatedResult ? (
            <div className="space-y-6 rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm">
              {/* Output Header with Action Bar */}
              <div className="flex flex-col justify-between gap-3 border-b border-dashboard-border pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-sm font-semibold text-purple-600 dark:text-purple-400">
                      <Sparkles className="size-3" />
                      <span>Synthesized</span>
                    </span>
                    <span className="text-sm text-dashboard-muted-foreground">
                      {generatedResult.wordCount} words &bull;{" "}
                      {generatedResult.readingTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="mt-2 font-heading text-lg font-bold text-dashboard-foreground sm:text-xl">
                    {generatedResult.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyHtml}
                    className="flex items-center gap-1 rounded-xl border border-dashboard-border px-3 py-1.5 text-sm font-medium text-dashboard-foreground hover:bg-dashboard-accent"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    <span>{copied ? "Copied" : "Copy HTML"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToDraft}
                    disabled={isSendingToDraft}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
                  >
                    <Send className="size-3.5" />
                    <span>
                      {isSendingToDraft
                        ? "Creating Draft..."
                        : "Send to Articles"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Quality & Fact-Check Scorecard */}
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-dashboard-border/80 bg-dashboard-accent/40 p-3.5 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400">
                    {generatedResult.qaScore}
                  </div>
                  <div>
                    <p className="font-semibold text-dashboard-foreground">
                      Editorial Quality Score
                    </p>
                    <p className="text-dashboard-caption text-dashboard-muted-foreground">
                      Tone and coherence verified
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-dashboard-caption text-dashboard-muted-foreground">
                  <ShieldCheck className="size-4 shrink-0 text-sky-500" />
                  <span>{generatedResult.factCheckSummary}</span>
                </div>
              </div>

              {/* Cover image and source */}
              {generatedResult.featuredImage && (
                <div className="overflow-hidden rounded-xl border border-dashboard-border/60">
                  <Image
                    src={generatedResult.featuredImage}
                    alt={
                      generatedResult.featuredImageAlt ||
                      generatedResult.title ||
                      "Featured image"
                    }
                    width={1200}
                    height={630}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
              {generatedResult.sourceUrl && (
                <p className="text-dashboard-caption text-dashboard-muted-foreground">
                  Imported from{" "}
                  <a
                    href={generatedResult.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-purple-600 underline dark:text-purple-400"
                  >
                    {generatedResult.sourceName || generatedResult.sourceUrl}
                  </a>
                  {typeof generatedResult.imagesImported === "number" &&
                    " · " +
                      generatedResult.imagesImported +
                      " image(s) saved as WebP"}
                </p>
              )}

              {/* Request changes */}
              <div className="space-y-3 rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-dashboard-foreground uppercase">
                  <MessageSquarePlus className="size-4 text-purple-500" />
                  <span>Request Changes</span>
                </p>
                {appliedChanges.length > 0 && (
                  <ul className="space-y-1 text-dashboard-caption text-dashboard-muted-foreground">
                    {appliedChanges.map((change, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <textarea
                  value={changeRequest}
                  onChange={(e) => setChangeRequest(e.target.value)}
                  rows={2}
                  placeholder="e.g. Make the intro shorter, add a conclusion section, change the tone to more technical..."
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleRevise}
                  disabled={isRevising || !changeRequest.trim()}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50"
                >
                  {isRevising ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      <span>Applying changes...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="size-4" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Excerpt */}
              <div className="rounded-xl border border-dashboard-border/60 bg-dashboard-background/50 p-4">
                <p className="mb-1 text-sm font-semibold tracking-wider text-dashboard-foreground uppercase">
                  Executive Excerpt
                </p>
                <p className="text-sm leading-relaxed text-dashboard-muted-foreground">
                  {generatedResult.excerpt}
                </p>
              </div>

              {/* Body Render */}
              <div className="prose prose-slate dark:prose-invert max-w-none border-t border-dashboard-border pt-4 text-sm sm:text-dashboard-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: generatedResult.bodyHtml || "",
                  }}
                />
              </div>

              {/* SEO Tags */}
              <div className="space-y-1 border-t border-dashboard-border pt-4 text-sm">
                <p className="font-semibold text-dashboard-foreground">
                  Target Keywords & Metadata:
                </p>
                <p className="text-dashboard-muted-foreground">
                  <strong>Primary:</strong> {generatedResult.primaryKeyword}{" "}
                  &bull; <strong>Secondary:</strong>{" "}
                  {generatedResult.secondaryKeywords}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-dashboard-border bg-dashboard-card/40 p-12 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="size-7" />
              </div>
              <h3 className="font-heading text-base font-semibold text-dashboard-foreground">
                AI Synthesis Canvas Ready
              </h3>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-dashboard-muted-foreground">
                Configure your strategic topic and parameters on the left and
                click &ldquo;Synthesize with AI&rdquo; to draft high-impact
                supply chain content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
