'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function SidebarSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/blog?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          aria-label="Search articles"
          className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200/70 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0aa79d] focus:bg-white transition-all"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-2 text-slate-400 hover:text-[#0aa79d] p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0aa79d] rounded-lg"
        >
          <Search className="size-4" />
        </button>
      </form>
    </div>
  )
}
