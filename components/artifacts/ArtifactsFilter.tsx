'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search,
  X,
  Filter,
  FileSpreadsheet,
  FileText,
  FileType,
  Layers,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  FolderOpen,
} from 'lucide-react'
import { ArtifactCard } from './ArtifactCard'
import { cn } from '@/lib/utils'
import type { PublicResourceDTO } from '@/lib/services/resource.service'

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface ArtifactsFilterProps {
  initialResources: PublicResourceDTO[]
  categories: CategoryOption[]
  total: number
  currentPage: number
  totalPages: number
  initialQuery?: string
  initialType?: string
  initialFormat?: string
  initialCategory?: string
}

const TYPE_TABS = [
  { label: 'All Resources', value: 'ALL' },
  { label: 'Templates', value: 'TEMPLATE' },
  { label: 'Artifacts', value: 'ARTIFACT' },
]

const FORMAT_OPTIONS = [
  { label: 'All Formats', value: 'ALL', icon: Layers },
  { label: 'Excel (.xlsx)', value: 'xlsx', icon: FileSpreadsheet },
  { label: 'Word (.docx)', value: 'docx', icon: FileText },
  { label: 'PDF (.pdf)', value: 'pdf', icon: FileType },
]

export function ArtifactsFilter({
  initialResources,
  categories,
  total,
  currentPage,
  totalPages,
  initialQuery = '',
  initialType = 'ALL',
  initialFormat = 'ALL',
  initialCategory = 'ALL',
}: ArtifactsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedType, setSelectedType] = useState(initialType)
  const [selectedFormat, setSelectedFormat] = useState(initialFormat)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [error, setError] = useState<string | null>(null)

  // Update URL search parameters
  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    const nextState = {
      q: searchQuery,
      type: selectedType,
      format: selectedFormat,
      category: selectedCategory,
      page: '1',
      ...updates,
    }

    if (nextState.q?.trim()) params.set('q', nextState.q.trim())
    if (nextState.type && nextState.type !== 'ALL') params.set('type', nextState.type)
    if (nextState.format && nextState.format !== 'ALL') params.set('format', nextState.format)
    if (nextState.category && nextState.category !== 'ALL') params.set('category', nextState.category)
    if (nextState.page && nextState.page !== '1') params.set('page', nextState.page)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams({ q: searchQuery })
  }

  const handleTypeSelect = (typeValue: string) => {
    setSelectedType(typeValue)
    updateUrlParams({ type: typeValue })
  }

  const handleFormatSelect = (formatValue: string) => {
    setSelectedFormat(formatValue)
    updateUrlParams({ format: formatValue })
  }

  const handleCategoryChange = (catValue: string) => {
    setSelectedCategory(catValue)
    updateUrlParams({ category: catValue })
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedType('ALL')
    setSelectedFormat('ALL')
    setSelectedCategory('ALL')
    setError(null)
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage.toString() })
  }

  // Server-side filtering produces exact paginated records matching type, format, category and search query
  const displayedResources = initialResources

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'ALL' ||
    selectedFormat !== 'ALL' ||
    selectedCategory !== 'ALL'

  return (
    <div className="space-y-8">
      {/* Search and Filters Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        {/* Top Row: Search Input + Category Dropdown */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3.5 top-3 size-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, description, or keyword..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-sky focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-sky"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  updateUrlParams({ q: '' })
                }}
                aria-label="Clear search"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            )}
          </form>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-slate-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              aria-label="Filter by category"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-brand-sky focus:outline-none focus:ring-1 focus:ring-brand-sky"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Type Tabs & Format Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
          {/* Resource Type Pills */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Resource Types">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={selectedType === tab.value}
                onClick={() => handleTypeSelect(tab.value)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky',
                  selectedType === tab.value
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* File Format Buttons */}
          <div className="flex flex-wrap items-center gap-1.5" aria-label="File Formats">
            <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">Format:</span>
            {FORMAT_OPTIONS.map((fmt) => {
              const Icon = fmt.icon
              const isSelected = selectedFormat === fmt.value
              return (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => handleFormatSelect(fmt.value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky',
                    isSelected
                      ? 'border-brand-sky bg-brand-sky/10 text-brand-sky font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{fmt.label}</span>
                </button>
              )
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors ml-2"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading overlay during transition */}
      {isPending && (
        <div className="flex items-center justify-center py-6 text-sm text-slate-500">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-sky mr-2" />
          Updating resource catalog...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null)
              updateUrlParams({})
            }}
            className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Catalog Grid or Empty States */}
      {displayedResources.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Showing {displayedResources.length} of {total} published resources</span>
            <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedResources.map((resource) => (
              <ArtifactCard key={resource.id} resource={resource} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft className="size-4" />
                <span>Previous</span>
              </button>

              <span className="px-3 py-2 text-xs font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      ) : hasActiveFilters ? (
        /* No search results state */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
            <Search className="size-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            No matching resources found
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn&apos;t find any templates or artifacts matching your active filters. Try searching with different keywords or resetting your filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-sky transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Library empty state */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
            <FolderOpen className="size-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Resource Library Under Editorial Preparation
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Our practitioner templates and operational blueprints are currently being validated by supply chain directors and editors. Check back shortly for publication.
          </p>
        </div>
      )}
    </div>
  )
}
