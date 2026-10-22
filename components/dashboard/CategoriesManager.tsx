'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderTree, Plus, Search, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  _count?: {
    articles: number
  }
}

interface CategoriesManagerProps {
  initialCategories: CategoryItem[]
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleNameChange(val: string) {
    setNewName(val)
    if (!newSlug || newSlug === newName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
      setNewSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'))
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newSlug.trim()) return

    setIsLoading(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          slug: newSlug.trim(),
          description: newDescription.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create category')
      }

      const created = await res.json()
      setCategories((prev) => [...prev, { ...created, _count: { articles: 0 } }])
      setNewName('')
      setNewSlug('')
      setNewDescription('')
      setIsCreating(false)
      setStatusMessage({ type: 'success', text: `Category "${created.name}" created.` })
      router.refresh()
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error creating category' })
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Category Taxonomy
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Structure your supply chain editorial domains, navigation hierarchies, and topic hubs.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90"
        >
          <Plus className="size-4" />
          <span>{isCreating ? 'Cancel' : 'New Category'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-sm ${
            statusMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Create form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm space-y-4"
        >
          <h3 className="font-heading text-dashboard-body font-semibold text-dashboard-foreground">
            Add New Supply Chain Category
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Autonomous Logistics"
                required
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="autonomous-logistics"
                required
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dashboard-muted-foreground mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              placeholder="Scope and coverage for this category..."
              className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-xl border border-dashboard-border px-3.5 py-1.5 text-sm font-medium text-dashboard-foreground hover:bg-dashboard-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="size-3 animate-spin" />}
              <span>Save Category</span>
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-dashboard-muted-foreground" />
        <input
          type="text"
          placeholder="Filter categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-dashboard-input bg-dashboard-card py-2 pl-9 pr-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-brand-blue focus:outline-none"
        />
      </div>

      {/* Category List Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm transition-all hover:border-brand-blue/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <FolderTree className="size-4" />
                </div>
                <span className="rounded-full bg-dashboard-accent px-2 py-0.5 text-dashboard-caption font-semibold text-dashboard-foreground">
                  {cat._count?.articles ?? 0} Articles
                </span>
              </div>

              <h3 className="font-heading mt-3 text-dashboard-body font-semibold text-dashboard-foreground">
                {cat.name}
              </h3>
              <p className="font-mono text-dashboard-caption text-dashboard-muted-foreground">/{cat.slug}</p>
              {cat.description && (
                <p className="mt-2 text-sm text-dashboard-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-dashboard-border pt-3 text-dashboard-caption">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500"></span>
                Active
              </span>
              <a
                href={`/blog?category=${cat.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-blue hover:underline font-semibold"
              >
                View Hub &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
