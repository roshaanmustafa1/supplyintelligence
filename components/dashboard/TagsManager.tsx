'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tag as TagIcon, Plus, Search, Trash2, Pencil, X, Check, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface TagItem {
  id: string
  name: string
  slug: string
  _count?: {
    articleTags: number
  }
}

interface TagsManagerProps {
  initialTags: TagItem[]
}

export function TagsManager({ initialTags }: TagsManagerProps) {
  const router = useRouter()
  const [tags, setTags] = useState<TagItem[]>(initialTags)
  const [search, setSearch] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault()
    if (!newTagName.trim()) return

    setIsLoading(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim() }),
      })

      if (!res.ok) {
        throw new Error('Failed to create tag')
      }

      const created = await res.json()
      setTags((prev) => [...prev, { ...created, _count: { articleTags: 0 } }])
      setNewTagName('')
      setStatusMessage({ type: 'success', text: `Tag "${created.name}" created.` })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error creating tag' })
    } finally {
      setIsLoading(false)
    }
  }

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  async function handleUpdateTag(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId || !editName.trim()) return
    setStatusMessage(null)
    try {
      const res = await fetch(`/api/tags/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update tag')
      }
      const updated = await res.json()
      setTags((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...updated } : t)))
      setEditingId(null)
      setStatusMessage({ type: 'success', text: `Tag "${updated.name}" updated.` })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error updating tag' })
    }
  }

  async function handleDeleteTag(tag: TagItem) {
    const count = tag._count?.articleTags ?? 0
    const warning = count > 0 ? ` It will be removed from ${count} article(s).` : ''
    if (!window.confirm(`Delete tag "${tag.name}"?${warning} This cannot be undone.`)) return
    setStatusMessage(null)
    try {
      const res = await fetch(`/api/tags/${tag.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete tag')
      setTags((prev) => prev.filter((t) => t.id !== tag.id))
      setStatusMessage({ type: 'success', text: `Tag "${tag.name}" deleted.` })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error deleting tag' })
    }
  }

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Topic Tags & Taxonomy
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Manage granular indexing tags across supply chain workflows, technologies, and metrics.
          </p>
        </div>

        {/* Quick add tag input */}
        <form onSubmit={handleCreateTag} className="flex items-center gap-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Add new tag..."
            className="rounded-xl border border-dashboard-input bg-dashboard-card px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !newTagName.trim()}
            className="flex items-center gap-1 rounded-xl bg-brand-blue px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            <span>Add</span>
          </button>
        </form>
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-dashboard-muted-foreground" />
        <input
          type="text"
          placeholder="Filter tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-dashboard-input bg-dashboard-card py-2 pl-9 pr-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-brand-blue focus:outline-none"
        />
      </div>

      {/* Tag Badges Grid */}
      <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-sm">
        <div className="flex flex-wrap gap-2.5">
          {filtered.length === 0 ? (
            <p className="text-sm text-dashboard-muted-foreground py-4">No tags found.</p>
          ) : (
            filtered.map((t) => (
              <div
                key={t.id}
                className="group flex items-center gap-2 rounded-xl border border-dashboard-border bg-dashboard-background px-3 py-1.5 text-sm text-dashboard-foreground transition-all hover:border-brand-blue/50 hover:bg-dashboard-accent"
              >
                <TagIcon className="size-3 text-brand-blue" />
                {editingId === t.id ? (
                  <form onSubmit={handleUpdateTag} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      aria-label="Tag name"
                      autoFocus
                      className="w-32 rounded-lg border border-dashboard-input bg-dashboard-card px-2 py-0.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                    />
                    <button type="submit" aria-label="Save tag" className="rounded p-1 text-emerald-600 hover:bg-dashboard-accent">
                      <Check className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} aria-label="Cancel edit" className="rounded p-1 text-dashboard-muted-foreground hover:bg-dashboard-accent">
                      <X className="size-3.5" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="font-medium">{t.name}</span>
                    <span className="rounded-full bg-dashboard-accent px-1.5 py-0.2 text-xs font-semibold text-dashboard-muted-foreground">
                      {t._count?.articleTags ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(t.id)
                        setEditName(t.name)
                      }}
                      aria-label={`Edit ${t.name}`}
                      className="rounded p-1 text-dashboard-muted-foreground hover:bg-dashboard-card hover:text-brand-blue"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(t)}
                      aria-label={`Delete ${t.name}`}
                      className="rounded p-1 text-dashboard-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
