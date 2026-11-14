'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export interface MediaItem {
  id: string
  originalName: string
  url: string
  altText: string | null
  sizeBytes: number
}

interface MediaLibraryProps {
  initialAssets: MediaItem[]
}

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

export function MediaLibrary({ initialAssets }: MediaLibraryProps) {
  const router = useRouter()
  const [assets, setAssets] = useState<MediaItem[]>(initialAssets)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAlt, setEditAlt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId || !editTitle.trim()) return
    setIsLoading(true)
    setStatusMessage(null)
    try {
      const res = await fetch(`/api/media/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalName: editTitle, altText: editAlt }),
      })
      if (!res.ok) throw new Error('Failed to update asset')
      const updated = await res.json()
      setAssets((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, originalName: updated.originalName, altText: updated.altText } : a
        )
      )
      setEditingId(null)
      setStatusMessage({ type: 'success', text: `Asset "${updated.originalName}" updated.` })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error updating asset' })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(asset: MediaItem) {
    if (!window.confirm(`Delete "${asset.originalName}" from the library? This cannot be undone.`)) return
    setStatusMessage(null)
    try {
      const res = await fetch(`/api/media/${asset.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete asset')
      setAssets((prev) => prev.filter((a) => a.id !== asset.id))
      setStatusMessage({ type: 'success', text: `Asset "${asset.originalName}" deleted.` })
      router.refresh()
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error deleting asset' })
    }
  }

  return (
    <div className="space-y-4">
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

      {assets.length === 0 && (
        <p className="text-sm text-dashboard-muted-foreground">No assets in the library.</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="group overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm transition-all hover:border-brand-blue/40 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <Image
                src={asset.url}
                alt={asset.altText ?? asset.originalName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {editingId === asset.id ? (
              <form onSubmit={handleUpdate} className="space-y-2 p-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  aria-label="Asset title"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                />
                <textarea
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  rows={2}
                  aria-label="Alt text"
                  placeholder="Alt text"
                  className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-xl border border-dashboard-border px-3 py-1.5 text-sm font-medium text-dashboard-foreground hover:bg-dashboard-accent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
                  >
                    {isLoading && <Loader2 className="size-3 animate-spin" />}
                    <span>Save</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 p-4">
                <h3 className="font-heading line-clamp-1 text-sm font-semibold text-dashboard-foreground">
                  {asset.originalName}
                </h3>
                <p className="truncate font-mono text-xs text-dashboard-muted-foreground">{asset.url}</p>

                <div className="flex items-center justify-between border-t border-dashboard-border pt-2 text-xs text-dashboard-muted-foreground">
                  <span>{formatSize(asset.sizeBytes)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(asset.id)
                        setEditTitle(asset.originalName)
                        setEditAlt(asset.altText ?? '')
                      }}
                      aria-label={`Edit ${asset.originalName}`}
                      className="rounded-lg p-1.5 hover:bg-dashboard-accent hover:text-brand-blue"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(asset)}
                      aria-label={`Delete ${asset.originalName}`}
                      className="rounded-lg p-1.5 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
