'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface PublicReply {
  id: string
  authorName: string
  body: string
  isStaff: boolean
  createdAt: string
}

export interface PublicComment extends PublicReply {
  replies: PublicReply[]
}

interface ArticleCommentsProps {
  slug: string
  comments: PublicComment[]
}

const inputClass =
  'w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-all shadow-2xs'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 ring-2 ring-white shadow-2xs">
      {name.trim()[0]?.toUpperCase() || '?'}
    </div>
  )
}

export function ArticleComments({ slug, comments }: ArticleCommentsProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, body: message, website }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not submit your comment. Please try again.')
      }
      setIsSubmitted(true)
      setMessage('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not submit your comment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="comments" className="mt-12 space-y-10">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Comments ({total})</h3>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-500">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 transition-all hover:border-slate-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={comment.authorName} />
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">{comment.authorName}</h4>
                  <time className="text-xs text-slate-400 mt-0.5 block">{formatDate(comment.createdAt)}</time>
                </div>
              </div>

              <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap pl-0 sm:pl-14">
                {comment.body}
              </p>

              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l-2 border-slate-200 pl-4 sm:ml-14">
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-slate-800">{reply.authorName}</span>
                        {reply.isStaff && (
                          <span className="ml-2 rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-sky">
                            Team
                          </span>
                        )}
                        <span className="ml-2">{formatDate(reply.createdAt)}</span>
                      </p>
                      <p className="mt-1 text-xs sm:text-[13.5px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div id="leave-a-comment" className="pt-6">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Leave A Comment</h3>

        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-6 sm:p-8">
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">Join the discussion</h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your email address will not be published. Comments appear after review.
            </p>
          </div>

          {isSubmitted && (
            <div
              role="status"
              className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-800 text-sm font-medium"
            >
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your comment has been submitted and will appear once it is approved.</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3 text-rose-800 text-sm font-medium"
            >
              <AlertCircle className="size-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="comment-name" className="sr-only">Name</label>
                <input
                  id="comment-name"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="comment-email" className="sr-only">Email</label>
                <input
                  id="comment-email"
                  type="email"
                  required
                  maxLength={160}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Honeypot field: hidden from people, filled by bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="comment-website">Website</label>
              <input
                id="comment-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="comment-body" className="sr-only">Comment</label>
              <textarea
                id="comment-body"
                rows={4}
                required
                maxLength={2000}
                placeholder="Write your comment here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-sky hover:bg-brand-sky-hover active:bg-brand-sky-active text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2 disabled:opacity-60"
              >
                <span>Post Comment</span>
                {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
