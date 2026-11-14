'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageSquare, Check, Pause, ShieldAlert, Trash2, CornerDownRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReplyItem {
  id: string
  authorName: string
  body: string
  isStaff: boolean
  createdAt: string
}

interface CommentItem {
  id: string
  authorName: string
  authorEmail: string
  body: string
  status: string
  createdAt: string
  article: { id: string; title: string; slug: string }
  replies: ReplyItem[]
}

interface CommentsManagerProps {
  initialComments: CommentItem[]
  counts: Record<string, number>
  activeStatus: string
  articleFilter: { id: string; title: string } | null
}

const tabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Live', value: 'APPROVED' },
  { label: 'On Hold', value: 'PENDING' },
  { label: 'Spam', value: 'SPAM' },
]

const statusLabels: Record<string, string> = { PENDING: 'On hold', APPROVED: 'Live', SPAM: 'Spam' }

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  APPROVED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  SPAM: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function CommentsManager({ initialComments, counts, activeStatus, articleFilter }: CommentsManagerProps) {
  const router = useRouter()
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const baseHref = articleFilter ? `/dashboard/comments?articleId=${articleFilter.id}` : '/dashboard/comments'
  const tabHref = (value: string) =>
    value === 'ALL' ? baseHref : `${baseHref}${articleFilter ? '&' : '?'}status=${value}`

  async function request(id: string, init: RequestInit, url = `/api/comments/${id}`) {
    setBusyId(id)
    setStatusMessage(null)
    try {
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      return data
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Request failed' })
      return null
    } finally {
      setBusyId(null)
    }
  }

  async function changeStatus(c: CommentItem, status: string) {
    const data = await request(c.id, { method: 'PATCH', body: JSON.stringify({ status }) })
    if (!data) return
    // Keep it visible only if it still matches the active tab.
    setComments((prev) =>
      prev
        .map((x) => (x.id === c.id ? { ...x, status } : x))
        .filter((x) => activeStatus === 'ALL' || x.status === activeStatus)
    )
    setStatusMessage({ type: 'success', text: `Comment by ${c.authorName} is now ${(statusLabels[status] ?? status).toLowerCase()}.` })
    router.refresh()
  }

  async function remove(c: CommentItem) {
    if (!window.confirm(`Delete this comment by ${c.authorName}? This cannot be undone.`)) return
    const data = await request(c.id, { method: 'DELETE' })
    if (!data) return
    setComments((prev) => prev.filter((x) => x.id !== c.id))
    setStatusMessage({ type: 'success', text: 'Comment deleted.' })
    router.refresh()
  }

  async function sendReply(c: CommentItem) {
    if (!replyText.trim()) return
    const data = await request(c.id, { method: 'POST', body: JSON.stringify({ body: replyText }) }, `/api/comments/${c.id}/reply`)
    if (!data) return
    setComments((prev) =>
      prev.map((x) =>
        x.id === c.id
          ? {
              ...x,
              replies: [
                ...x.replies,
                { id: data.id, authorName: data.authorName, body: data.body, isStaff: true, createdAt: data.createdAt },
              ],
            }
          : x
      )
    )
    setReplyingId(null)
    setReplyText('')
    setStatusMessage({ type: 'success', text: 'Reply posted.' })
  }

  return (
    <div className="space-y-4 pb-16">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-blue">
          <MessageSquare className="size-4" />
          <span>Reader Engagement</span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">Comments</h1>
        <p className="text-sm text-dashboard-muted-foreground">
          Reader comments go live immediately. Put any comment on hold, mark it as spam, reply to it, or delete it. Only live comments appear on the site.
        </p>
        {articleFilter && (
          <p className="mt-2 text-sm text-dashboard-foreground">
            Showing comments for <span className="font-semibold">{articleFilter.title}</span> ·{' '}
            <Link href="/dashboard/comments" className="text-brand-blue hover:underline">
              Show all
            </Link>
          </p>
        )}
      </div>

      <div className="flex overflow-x-auto border-b border-dashboard-border">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tabHref(tab.value)}
            aria-current={activeStatus === tab.value ? 'page' : undefined}
            className={cn(
              '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              activeStatus === tab.value
                ? 'border-brand-blue font-semibold text-brand-blue'
                : 'border-transparent text-dashboard-muted-foreground hover:text-dashboard-foreground'
            )}
          >
            {tab.label} ({counts[tab.value] ?? 0})
          </Link>
        ))}
      </div>

      {statusMessage && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl p-3 text-sm',
            statusMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border border-destructive/30 bg-destructive/10 text-destructive'
          )}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card py-12 text-center text-dashboard-muted-foreground">
          <MessageSquare className="mx-auto mb-2 size-8 opacity-50" />
          <p className="font-medium">No comments here yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="rounded-2xl border border-dashboard-border bg-dashboard-card p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-dashboard-foreground">{c.authorName}</span>
                    <span className="text-dashboard-caption text-dashboard-muted-foreground">{c.authorEmail}</span>
                    <span className={cn('rounded-md px-2 py-0.5 text-xs font-semibold', statusStyles[c.status])}>{statusLabels[c.status] ?? c.status}</span>
                  </div>
                  <p className="mt-0.5 text-dashboard-caption text-dashboard-muted-foreground">
                    {formatDate(c.createdAt)} · on{' '}
                    <Link href={`/dashboard/articles/${c.article.id}`} className="text-brand-blue hover:underline">
                      {c.article.title}
                    </Link>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {busyId === c.id && <Loader2 className="size-4 animate-spin text-dashboard-muted-foreground" />}
                  {c.status !== 'APPROVED' && (
                    <button
                      type="button"
                      disabled={busyId === c.id}
                      onClick={() => changeStatus(c, 'APPROVED')}
                      className="flex items-center gap-1 rounded-lg border border-emerald-500/30 px-2.5 py-1 text-dashboard-caption font-semibold text-emerald-600 hover:bg-emerald-500/10 disabled:opacity-50 dark:text-emerald-400"
                    >
                      <Check className="size-3.5" /> {c.status === 'SPAM' ? 'Restore' : 'Publish'}
                    </button>
                  )}
                  {c.status !== 'PENDING' && (
                    <button
                      type="button"
                      disabled={busyId === c.id}
                      onClick={() => changeStatus(c, 'PENDING')}
                      className="flex items-center gap-1 rounded-lg border border-sky-500/30 px-2.5 py-1 text-dashboard-caption font-semibold text-sky-600 hover:bg-sky-500/10 disabled:opacity-50 dark:text-sky-400"
                    >
                      <Pause className="size-3.5" /> Hold
                    </button>
                  )}
                  {c.status !== 'SPAM' && (
                    <button
                      type="button"
                      disabled={busyId === c.id}
                      onClick={() => changeStatus(c, 'SPAM')}
                      className="flex items-center gap-1 rounded-lg border border-amber-500/30 px-2.5 py-1 text-dashboard-caption font-semibold text-amber-600 hover:bg-amber-500/10 disabled:opacity-50 dark:text-amber-400"
                    >
                      <ShieldAlert className="size-3.5" /> Spam
                    </button>
                  )}
                  {c.status === 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingId(replyingId === c.id ? null : c.id)
                        setReplyText('')
                      }}
                      className="flex items-center gap-1 rounded-lg border border-dashboard-border px-2.5 py-1 text-dashboard-caption font-semibold text-dashboard-foreground hover:bg-dashboard-accent"
                    >
                      <CornerDownRight className="size-3.5" /> Reply
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === c.id}
                    onClick={() => remove(c)}
                    aria-label={`Delete comment by ${c.authorName}`}
                    className="rounded-lg p-1.5 text-dashboard-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-dashboard-foreground">{c.body}</p>

              {c.replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-dashboard-border pl-4">
                  {c.replies.map((r) => (
                    <div key={r.id}>
                      <p className="text-dashboard-caption text-dashboard-muted-foreground">
                        <span className="font-semibold text-dashboard-foreground">{r.authorName}</span>
                        {r.isStaff && ' (staff)'} · {formatDate(r.createdAt)}
                      </p>
                      <p className="whitespace-pre-wrap text-sm text-dashboard-foreground">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyingId === c.id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    aria-label="Reply"
                    placeholder="Write a public reply as staff..."
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-background p-3 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingId(null)}
                      className="rounded-xl border border-dashboard-border px-3 py-1.5 text-sm font-medium text-dashboard-foreground hover:bg-dashboard-accent"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={busyId === c.id || !replyText.trim()}
                      onClick={() => sendReply(c)}
                      className="rounded-xl bg-brand-blue px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-brand-blue/90 disabled:opacity-50"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
