'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Edit3,
  Upload,
  Archive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  X,
  Send,
  ShieldCheck,
  HardDrive,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes, formatResourceDate, getFileFormatInfo } from '@/lib/resource-utils'
import type { ResourceType, ResourceStatus } from '@/lib/services/resource.service'

export interface AdminResourceItem {
  id: string
  title: string
  slug: string
  description?: string | null
  resourceType: string
  status: string
  thumbnail?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  isFeatured?: boolean
  downloadCount: number
  viewCount: number
  authorId?: string | null
  publishedAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
  categories: {
    category: {
      id: string
      name: string
      slug: string
    }
  }[]
  versions: {
    id: string
    version: string
    isCurrent: boolean
    createdAt: Date | string
  }[]
  files: {
    id: string
    originalFilename: string
    mimeType: string
    fileSize: number
    checksum: string
    isPrimary: boolean
  }[]
  author?: {
    id: string
    name: string | null
    email: string
    role: string
  } | null
}

export interface CategorySummary {
  id: string
  name: string
  slug: string
}

interface CurrentUserContext {
  id?: string
  role?: string
  name?: string | null
  email?: string | null
}

interface ArtifactsManagerProps {
  initialResources: AdminResourceItem[]
  total: number
  currentPage: number
  totalPages: number
  categories: CategorySummary[]
  currentUser?: CurrentUserContext
}

const statusTabs = [
  { label: 'All Resources', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Needs Review', value: 'REVIEW' },
  { label: 'Drafts', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
]

export function ArtifactsManager({
  initialResources,
  total,
  currentPage,
  totalPages,
  categories,
  currentUser,
}: ArtifactsManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [resources, setResources] = useState<AdminResourceItem[]>(initialResources)
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Synchronize search, tab, and category with server pagination
  const updateQueryParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const nextTab = updates.status !== undefined ? updates.status : activeTab
    const nextCat = updates.categoryId !== undefined ? updates.categoryId : selectedCategory
    const nextSearch = updates.search !== undefined ? updates.search : searchQuery
    const nextPage = updates.page !== undefined ? updates.page : '1'

    if (nextTab && nextTab !== 'ALL') params.set('status', nextTab)
    if (nextCat) params.set('categoryId', nextCat)
    if (nextSearch && nextSearch.trim()) params.set('search', nextSearch.trim())
    if (nextPage && nextPage !== '1') params.set('page', nextPage)

    startTransition(() => {
      router.push(`/dashboard/artifacts${params.toString() ? `?${params.toString()}` : ''}`)
    })
  }

  const handleTabChange = (val: string) => {
    setActiveTab(val)
    updateQueryParams({ status: val, page: '1' })
  }

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
    updateQueryParams({ categoryId: val, page: '1' })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueryParams({ search: searchQuery, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage.toString() })
  }

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<AdminResourceItem | null>(null)
  const [uploadingForResource, setUploadingForResource] = useState<AdminResourceItem | null>(null)

  // Creation form state
  const [createTitle, setCreateTitle] = useState('')
  const [createSlug, setCreateSlug] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createType, setCreateType] = useState<ResourceType>('TEMPLATE')
  const [createCategoryIds, setCreateCategoryIds] = useState<string[]>([])
  const [createSeoTitle, setCreateSeoTitle] = useState('')
  const [createSeoDescription, setCreateSeoDescription] = useState('')
  const [createIsFeatured, setCreateIsFeatured] = useState(false)
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editType, setEditType] = useState<ResourceType>('TEMPLATE')
  const [editCategoryIds, setEditCategoryIds] = useState<string[]>([])
  const [editSeoTitle, setEditSeoTitle] = useState('')
  const [editSeoDescription, setEditSeoDescription] = useState('')
  const [editIsFeatured, setEditIsFeatured] = useState(false)
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false)

  // Upload file state
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Permission helpers
  const userRole = (currentUser?.role || 'AUTHOR').toUpperCase()
  const isSuperAdminOrAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'
  const isEditorOrAbove = isSuperAdminOrAdmin || userRole === 'EDITOR'

  const canEditResource = (item: AdminResourceItem) => {
    if (isEditorOrAbove) return true
    return item.authorId === currentUser?.id
  }

  const canPublishOrArchive = () => {
    return isEditorOrAbove
  }

  // Slug generator helper
  const handleTitleChange = (val: string) => {
    setCreateTitle(val)
    if (!createSlug || createSlug === createTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setCreateSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  // Filtered view from server records
  const filteredResources = resources

  // Create submission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createTitle.trim() || !createSlug.trim()) return

    setIsSubmittingCreate(true)
    setStatusMessage(null)

    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createTitle.trim(),
          slug: createSlug.trim(),
          description: createDescription.trim() || undefined,
          resourceType: createType,
          categoryIds: createCategoryIds.length > 0 ? createCategoryIds : undefined,
          seoTitle: createSeoTitle.trim() || undefined,
          seoDescription: createSeoDescription.trim() || undefined,
          isFeatured: createIsFeatured,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create resource')
      }

      const created = await res.json()
      setResources((prev) => [created, ...prev])
      setIsCreateOpen(false)
      setCreateTitle('')
      setCreateSlug('')
      setCreateDescription('')
      setCreateCategoryIds([])
      setStatusMessage({ type: 'success', text: `Resource "${created.title}" created successfully as DRAFT.` })

      // Open file upload prompt automatically
      setUploadingForResource(created)
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error creating resource' })
    } finally {
      setIsSubmittingCreate(false)
    }
  }

  // Open Edit Dialog
  const handleOpenEdit = (item: AdminResourceItem) => {
    setEditingResource(item)
    setEditTitle(item.title)
    setEditSlug(item.slug)
    setEditDescription(item.description || '')
    setEditType((item.resourceType as ResourceType) || 'TEMPLATE')
    setEditCategoryIds(item.categories.map((c) => c.category.id))
    setEditSeoTitle(item.seoTitle || '')
    setEditSeoDescription(item.seoDescription || '')
    setEditIsFeatured(Boolean(item.isFeatured))
  }

  // Edit submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingResource) return

    setIsSubmittingEdit(true)
    setStatusMessage(null)

    try {
      const res = await fetch(`/api/admin/resources/${editingResource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          slug: editSlug.trim(),
          description: editDescription.trim() || undefined,
          resourceType: editType,
          categoryIds: editCategoryIds,
          seoTitle: editSeoTitle.trim() || undefined,
          seoDescription: editSeoDescription.trim() || undefined,
          isFeatured: editIsFeatured,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to update resource')
      }

      const updated = await res.json()
      setResources((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setEditingResource(null)
      setStatusMessage({ type: 'success', text: `Resource "${updated.title}" updated successfully.` })
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error updating resource' })
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  // Upload file submission
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadingForResource || !selectedUploadFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedUploadFile)
      formData.append('isPrimary', 'true')

      const res = await fetch(`/api/admin/resources/${uploadingForResource.id}/files`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'File upload failed. Ensure format is .xlsx, .docx, or .pdf (max 25MB).')
      }

      const uploadedFile = await res.json()

      // Refresh resource in local state
      const refreshedRes = await fetch(`/api/admin/resources/${uploadingForResource.id}`)
      if (refreshedRes.ok) {
        const refreshedData = await refreshedRes.json()
        setResources((prev) => prev.map((r) => (r.id === refreshedData.id ? refreshedData : r)))
      }

      setUploadingForResource(null)
      setSelectedUploadFile(null)
      setStatusMessage({
        type: 'success',
        text: `File "${uploadedFile.originalFilename}" (${formatBytes(uploadedFile.fileSize)}) attached successfully to ${uploadingForResource.title}.`,
      })
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  // Status transitions
  const handleTransitionStatus = async (item: AdminResourceItem, targetStatus: ResourceStatus) => {
    setStatusMessage(null)

    // Client-side guard check before request
    if ((targetStatus === 'PUBLISHED' || targetStatus === 'ARCHIVED') && !canPublishOrArchive()) {
      setStatusMessage({
        type: 'error',
        text: 'Forbidden: Only Editors and Administrators have authority to publish or archive resources.',
      })
      return
    }

    if (targetStatus === 'PUBLISHED' && (!item.files || item.files.length === 0)) {
      setStatusMessage({
        type: 'error',
        text: `Cannot publish "${item.title}" because it has no uploaded files. Please upload an Excel, Word, or PDF file first.`,
      })
      return
    }

    try {
      // If moving from DRAFT to PUBLISHED directly, step through REVIEW per backend state machine
      if (item.status === 'DRAFT' && targetStatus === 'PUBLISHED') {
        const reviewRes = await fetch(`/api/admin/resources/${item.id}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'REVIEW' }),
        })
        if (!reviewRes.ok) {
          const err = await reviewRes.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to transition resource to review')
        }
      }

      const res = await fetch(`/api/admin/resources/${item.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Failed to transition status to ${targetStatus}`)
      }

      setResources((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: targetStatus } : r))
      )
      setStatusMessage({
        type: 'success',
        text: `Resource "${item.title}" transitioned to ${targetStatus}.`,
      })
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update publication status',
      })
    }
  }

  // Delete/Archive handler
  const handleDeleteOrArchive = async (item: AdminResourceItem) => {
    if (!confirm(`Are you sure you want to archive resource "${item.title}"? It will be removed from public listings.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/resources/${item.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to archive resource')
      }

      setResources((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: 'ARCHIVED' } : r))
      )
      setStatusMessage({
        type: 'success',
        text: `Resource "${item.title}" archived successfully.`,
      })
      startTransition(() => {
        router.refresh()
      })
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error archiving resource',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Published
          </span>
        )
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Needs Review
          </span>
        )
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="size-1.5 rounded-full bg-rose-500"></span>
            Archived
          </span>
        )
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-500/10 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="size-1.5 rounded-full bg-slate-400"></span>
            Draft
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Strip */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-dashboard-foreground">
            Artifacts & Templates Library
          </h1>
          <p className="text-sm text-dashboard-muted-foreground">
            Upload, version, inspect, and publish practitioner spreadsheets, frameworks, and decision tools.
            {total > 0 && ` (${total} total records${totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ''})`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isPending && (
            <div className="flex items-center gap-1.5 text-xs text-brand-blue mr-2">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Syncing...</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-blue/90"
          >
            <Plus className="size-4" />
            <span>Create Resource</span>
          </button>
        </div>
      </div>

      {/* Global Status Message Toast */}
      {statusMessage && (
        <div
          className={`flex items-center justify-between rounded-xl p-3.5 text-sm shadow-xs ${
            statusMessage.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="size-4.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="size-4.5 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto border-b border-dashboard-border">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeTab === tab.value
                ? 'border-brand-blue text-brand-blue font-semibold'
                : 'border-transparent text-dashboard-muted-foreground hover:text-dashboard-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-dashboard-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources by title, slug, or keywords (press Enter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-dashboard-input bg-dashboard-card py-2 pl-9 pr-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="rounded-xl border border-dashboard-input bg-dashboard-card px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Management Table */}
      <div className="overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-dashboard-foreground">
            <thead className="border-b border-dashboard-border bg-dashboard-muted/20 text-xs font-semibold text-dashboard-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Resource</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Primary Asset</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Version</th>
                <th className="px-4 py-3.5">Updated</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {filteredResources.length > 0 ? (
                filteredResources.map((item) => {
                  const primaryFile = item.files?.find((f) => f.isPrimary) || item.files?.[0]
                  const formatInfo = getFileFormatInfo(primaryFile?.mimeType, primaryFile?.originalFilename)
                  const categoryName = item.categories[0]?.category.name || 'Unassigned'
                  const isOwner = canEditResource(item)

                  return (
                    <tr key={item.id} className="hover:bg-dashboard-accent/30 transition-colors">
                      {/* Title & Slug */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-dashboard-foreground line-clamp-1" title={item.title}>
                            {item.title}
                          </span>
                          <span className="text-xs text-dashboard-muted-foreground font-mono">
                            /artifacts/{item.slug}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-md bg-dashboard-muted/40 px-2 py-0.5 text-xs text-dashboard-muted-foreground font-medium">
                          {categoryName}
                        </span>
                      </td>

                      {/* Primary Asset */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {primaryFile ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-dashboard-foreground">
                            <span className={cn('inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase', formatInfo.colorBadgeClass)}>
                              {formatInfo.extension.replace('.', '')}
                            </span>
                            <span className="truncate max-w-[140px]" title={primaryFile.originalFilename}>
                              {primaryFile.originalFilename}
                            </span>
                            <span className="text-xs text-dashboard-muted-foreground">
                              ({formatBytes(primaryFile.fileSize)})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                            <AlertCircle className="size-3.5" />
                            No file attached
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Version */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-dashboard-muted-foreground font-mono">
                        v{item.versions?.[0]?.version || '1.0.0'}
                      </td>

                      {/* Updated Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-dashboard-muted-foreground">
                        {formatResourceDate(item.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Upload File */}
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => setUploadingForResource(item)}
                              title="Upload or replace file"
                              className="p-1.5 text-dashboard-muted-foreground hover:text-brand-blue hover:bg-dashboard-accent rounded-lg transition-colors"
                            >
                              <Upload className="size-4" />
                            </button>
                          )}

                          {/* Edit Details */}
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit resource metadata"
                              className="p-1.5 text-dashboard-muted-foreground hover:text-brand-blue hover:bg-dashboard-accent rounded-lg transition-colors"
                            >
                              <Edit3 className="size-4" />
                            </button>
                          )}

                          {/* Status Action: Publish, Review, or Restore */}
                          {item.status === 'PUBLISHED' ? (
                            isEditorOrAbove && (
                              <button
                                type="button"
                                onClick={() => handleTransitionStatus(item, 'REVIEW')}
                                title="Revert to Review"
                                className="p-1.5 text-amber-600 hover:bg-amber-500/10 rounded-lg transition-colors text-xs font-semibold"
                              >
                                Unpublish
                              </button>
                            )
                          ) : item.status === 'REVIEW' ? (
                            isEditorOrAbove ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleTransitionStatus(item, 'PUBLISHED')}
                                  title="Publish Resource"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                                >
                                  <CheckCircle2 className="size-3" />
                                  <span>Publish</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleTransitionStatus(item, 'DRAFT')}
                                  title="Return to Draft"
                                  className="px-2 py-1 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold transition-colors"
                                >
                                  Draft
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-600 font-medium px-2 py-0.5 bg-amber-50 rounded">
                                In Review
                              </span>
                            )
                          ) : item.status === 'ARCHIVED' ? (
                            isEditorOrAbove && (
                              <button
                                type="button"
                                onClick={() => handleTransitionStatus(item, 'DRAFT')}
                                title="Restore to Draft"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-xs"
                              >
                                <RotateCcw className="size-3" />
                                <span>Restore</span>
                              </button>
                            )
                          ) : (
                            /* DRAFT */
                            isEditorOrAbove ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleTransitionStatus(item, 'REVIEW')}
                                  title="Move to Review"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                                >
                                  <Send className="size-3" />
                                  <span>Review</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleTransitionStatus(item, 'PUBLISHED')}
                                  title="Publish (requires attached file)"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-brand-blue text-white rounded-lg text-xs font-semibold hover:bg-brand-blue/90 transition-colors shadow-xs"
                                >
                                  <CheckCircle2 className="size-3" />
                                  <span>Publish</span>
                                </button>
                              </div>
                            ) : isOwner ? (
                              <button
                                type="button"
                                onClick={() => handleTransitionStatus(item, 'REVIEW')}
                                title="Submit for Editor Review"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-brand-sky transition-colors shadow-xs"
                              >
                                <Send className="size-3" />
                                <span>Submit</span>
                              </button>
                            ) : null
                          )}

                          {/* Preview Public Page */}
                          {item.status === 'PUBLISHED' && (
                            <Link
                              href={`/artifacts/${item.slug}`}
                              target="_blank"
                              title="View public page"
                              className="p-1.5 text-dashboard-muted-foreground hover:text-slate-900 hover:bg-dashboard-accent rounded-lg transition-colors"
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                          )}

                          {/* Archive/Delete Action */}
                          {isSuperAdminOrAdmin && item.status !== 'ARCHIVED' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteOrArchive(item)}
                              title="Archive Resource"
                              className="p-1.5 text-dashboard-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                              <Archive className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-dashboard-muted-foreground">
                    No resources match your active filters. Click &ldquo;Create Resource&rdquo; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-dashboard-muted-foreground">
            Showing <span className="font-semibold text-dashboard-foreground">{(currentPage - 1) * 20 + 1}</span> to{' '}
            <span className="font-semibold text-dashboard-foreground">{Math.min(currentPage * 20, total)}</span> of{' '}
            <span className="font-semibold text-dashboard-foreground">{total}</span> resources
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
              className="inline-flex items-center gap-1 rounded-lg border border-dashboard-border bg-dashboard-card px-3 py-1.5 text-xs font-semibold text-dashboard-foreground shadow-xs hover:bg-dashboard-accent disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  disabled={isPending}
                  className={cn(
                    'size-7 rounded-lg text-xs font-semibold transition-colors',
                    currentPage === p
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'border border-dashboard-border bg-dashboard-card text-dashboard-muted-foreground hover:bg-dashboard-accent'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
              className="inline-flex items-center gap-1 rounded-lg border border-dashboard-border bg-dashboard-card px-3 py-1.5 text-xs font-semibold text-dashboard-foreground shadow-xs hover:bg-dashboard-accent disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* CREATE RESOURCE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-dashboard-border pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-dashboard-foreground">
                  Create Artifact or Template
                </h3>
                <p className="text-xs text-dashboard-muted-foreground">
                  Configure the resource metadata. Files can be attached immediately after creation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-dashboard-muted-foreground hover:text-dashboard-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={createTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Strategic Sourcing 7-Step Maturity Matrix"
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={createSlug}
                    onChange={(e) => setCreateSlug(e.target.value)}
                    placeholder="e.g. strategic-sourcing-maturity-matrix"
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm font-mono text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Resource Type *
                  </label>
                  <select
                    value={createType}
                    onChange={(e) => setCreateType(e.target.value as ResourceType)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  >
                    <option value="TEMPLATE">TEMPLATE (Spreadsheet / Document)</option>
                    <option value="ARTIFACT">ARTIFACT (Framework / Blueprint)</option>
                    <option value="CALCULATOR">CALCULATOR (Model / Formula)</option>
                    <option value="INTERACTIVE_TOOL">INTERACTIVE_TOOL (Workflow)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Category Assignment
                  </label>
                  <select
                    multiple
                    value={createCategoryIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value)
                      setCreateCategoryIds(selected)
                    }}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none h-24"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-dashboard-muted-foreground mt-1">
                    Hold Ctrl (or Cmd) to select multiple categories.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Description & Practitioner Purpose
                  </label>
                  <textarea
                    rows={3}
                    value={createDescription}
                    onChange={(e) => setCreateDescription(e.target.value)}
                    placeholder="Summarize the operational utility, inputs, and formulas included in this resource..."
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={createSeoTitle}
                    onChange={(e) => setCreateSeoTitle(e.target.value)}
                    placeholder="Defaults to resource title"
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    value={createSeoDescription}
                    onChange={(e) => setCreateSeoDescription(e.target.value)}
                    placeholder="Defaults to description"
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={createIsFeatured}
                  onChange={(e) => setCreateIsFeatured(e.target.checked)}
                  className="size-4 rounded text-brand-blue focus:ring-brand-blue"
                />
                <label htmlFor="featuredToggle" className="text-xs font-medium text-dashboard-foreground cursor-pointer">
                  Feature this resource prominently on homepage & resource hubs
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-dashboard-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-dashboard-border bg-dashboard-card px-4 py-2 text-xs font-semibold text-dashboard-foreground hover:bg-dashboard-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
                >
                  {isSubmittingCreate && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Create & Proceed to Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RESOURCE MODAL */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-dashboard-border pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-dashboard-foreground">
                  Edit Resource Details
                </h3>
                <p className="text-xs text-dashboard-muted-foreground">
                  Updating: {editingResource.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="text-dashboard-muted-foreground hover:text-dashboard-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm font-mono text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Resource Type
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as ResourceType)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  >
                    <option value="TEMPLATE">TEMPLATE</option>
                    <option value="ARTIFACT">ARTIFACT</option>
                    <option value="CALCULATOR">CALCULATOR</option>
                    <option value="INTERACTIVE_TOOL">INTERACTIVE_TOOL</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Categories
                  </label>
                  <select
                    multiple
                    value={editCategoryIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value)
                      setEditCategoryIds(selected)
                    }}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none h-24"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={editSeoTitle}
                    onChange={(e) => setEditSeoTitle(e.target.value)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dashboard-foreground mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    value={editSeoDescription}
                    onChange={(e) => setEditSeoDescription(e.target.value)}
                    className="w-full rounded-xl border border-dashboard-input bg-dashboard-card p-2.5 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editFeaturedToggle"
                  checked={editIsFeatured}
                  onChange={(e) => setEditIsFeatured(e.target.checked)}
                  className="size-4 rounded text-brand-blue focus:ring-brand-blue"
                />
                <label htmlFor="editFeaturedToggle" className="text-xs font-medium text-dashboard-foreground cursor-pointer">
                  Featured resource
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-dashboard-border pt-4">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="rounded-xl border border-dashboard-border bg-dashboard-card px-4 py-2 text-xs font-semibold text-dashboard-foreground hover:bg-dashboard-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
                >
                  {isSubmittingEdit && <Loader2 className="size-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD FILE MODAL */}
      {uploadingForResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-dashboard-border bg-dashboard-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-dashboard-border pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-dashboard-foreground">
                  Upload Downloadable Asset
                </h3>
                <p className="text-xs text-dashboard-muted-foreground truncate max-w-sm">
                  Attaching to: {uploadingForResource.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadingForResource(null)
                  setSelectedUploadFile(null)
                  setUploadError(null)
                }}
                className="text-dashboard-muted-foreground hover:text-dashboard-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {uploadError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone / Picker */}
              <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-dashboard-border bg-dashboard-muted/10 p-6 text-center hover:bg-dashboard-muted/20 transition-colors">
                <Upload className="size-8 text-brand-blue mb-2" />
                <p className="text-xs font-semibold text-dashboard-foreground">
                  Click to select or drag and drop your file
                </p>
                <p className="text-[11px] text-dashboard-muted-foreground mt-1">
                  Supported formats: Excel (.xlsx), Word (.docx), Adobe PDF (.pdf) — Max 25MB
                </p>

                <input
                  type="file"
                  accept=".xlsx,.docx,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedUploadFile(file)
                      setUploadError(null)
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Selected File Details */}
              {selectedUploadFile && (
                <div className="flex items-center justify-between rounded-xl border border-dashboard-border bg-dashboard-card p-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HardDrive className="size-4 text-brand-blue shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-dashboard-foreground truncate">
                        {selectedUploadFile.name}
                      </p>
                      <p className="text-[11px] text-dashboard-muted-foreground">
                        {formatBytes(selectedUploadFile.size)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    Ready
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-dashboard-border pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setUploadingForResource(null)
                    setSelectedUploadFile(null)
                    setUploadError(null)
                  }}
                  className="rounded-xl border border-dashboard-border bg-dashboard-card px-4 py-2 text-xs font-semibold text-dashboard-foreground hover:bg-dashboard-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUploadFile || isUploading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-blue/90 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Scanning & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="size-3.5" />
                      <span>Upload & Attach File</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
