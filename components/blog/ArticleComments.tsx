'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CornerDownLeft, Send, CheckCircle2 } from 'lucide-react'

interface Comment {
  id: string
  name: string
  date: string
  avatar: string
  body: string
}

const initialComments: Comment[] = [
  {
    id: '1',
    name: 'Matthew Larson',
    date: '15 March, 2025',
    avatar: '/images/commenter-matthew.jpg',
    body: 'In the realm of defense, our proficiency transcends the mere understanding of statutes; it delves into the nuanced artistry of legal advocacy. We are architects of defense, law sculpting compelling narratives that resonate with judges and juries, compelling them.',
  },
  {
    id: '2',
    name: 'Ben Ducket',
    date: '16 March, 2025',
    avatar: '/images/commenter-ben.jpg',
    body: 'In our pursuit of justice, we stand resolute, honoring the trust placed in us by those seeking guidance through the labyrinth of legal intricacies. We are more than legal practitioners; we are guardians of rights, advocates for fairness, and champions.',
  },
]

export function ArticleComments() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [saveInfo, setSaveInfo] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleReplyClick = (authorName: string) => {
    setReplyTo(authorName)
    const formElement = document.getElementById('leave-a-comment')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !message.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      name: `${firstName.trim()} ${lastName.trim()}`.trim() || 'Contributor',
      date: 'Just now',
      avatar: '/images/author-elena.jpg',
      body: replyTo ? `@${replyTo} ${message.trim()}` : message.trim(),
    }

    setComments((prev) => [...prev, newComment])
    setIsSubmitted(true)
    setMessage('')
    setReplyTo(null)

    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  return (
    <div id="comments" className="mt-12 space-y-10">
      {/* Comments Header */}
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment List matching screenshot */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 transition-all hover:border-slate-300"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="relative size-11 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white shadow-2xs shrink-0">
                  <Image
                    src={comment.avatar}
                    alt={comment.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    {comment.name}
                  </h4>
                  <time className="text-xs text-slate-400 mt-0.5 block">
                    {comment.date}
                  </time>
                </div>
              </div>

              {/* Reply Button matching screenshot */}
              <button
                type="button"
                onClick={() => handleReplyClick(comment.name)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0284c7] transition-colors px-3 py-1.5 rounded-lg hover:bg-white"
              >
                <CornerDownLeft className="size-3.5" />
                <span>Reply</span>
              </button>
            </div>

            {/* Comment Body */}
            <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-700 pl-0 sm:pl-14">
              {comment.body}
            </p>
          </div>
        ))}
      </div>

      {/* Leave A Comment Section matching screenshot */}
      <div id="leave-a-comment" className="pt-6">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">
          Leave A Comment
        </h3>

        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-6 sm:p-8">
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Send us a message
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide clear contact information, including phone number, email, and address.
            </p>

            {replyTo && (
              <div className="mt-3 inline-flex items-center gap-2 bg-sky-100 text-[#0284c7] px-3 py-1 rounded-md text-xs font-semibold">
                <span>Replying to {replyTo}</span>
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="hover:text-sky-900"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {isSubmitted && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-800 text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your comment has been posted successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="sr-only">First Name</label>
                <input
                  id="first-name"
                  type="text"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <div>
                <label htmlFor="last-name" className="sr-only">Last Name</label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="comment-email" className="sr-only">Email</label>
                <input
                  id="comment-email"
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              <div>
                <label htmlFor="comment-phone" className="sr-only">Phone</label>
                <input
                  id="comment-phone"
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="comment-body" className="sr-only">Comment</label>
              <textarea
                id="comment-body"
                rows={4}
                required
                placeholder="Write your comment here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all resize-y shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="save-info"
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#0284c7] focus:ring-[#0284c7]"
              />
              <label htmlFor="save-info" className="text-xs text-slate-500 select-none">
                Save my name, email, and website in this browser for the next time I comment.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284c7] focus-visible:ring-offset-2"
              >
                <span>Post Comment</span>
                <Send className="size-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
