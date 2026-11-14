'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Download,
  Star,
  Loader2,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ArtifactPreviewModal } from '@/components/artifacts/ArtifactPreviewModal'
import { ResourceThumbnail } from '@/components/artifacts/ResourceThumbnail'
import { FormatLogo } from '@/components/artifacts/FormatLogo'
import { formatBytes, formatResourceDate, getFileFormatInfo } from '@/lib/resource-utils'
import type { PublicResourceDTO } from '@/lib/services/resource.service'

interface ArtifactCardProps {
  resource: PublicResourceDTO
}

const previewBackdrop: Record<string, string> = {
  xlsx: 'from-emerald-950 to-slate-900',
  docx: 'from-sky-950 to-slate-900',
  pdf: 'from-rose-950 to-slate-900',
  other: 'from-slate-800 to-slate-900',
}

export function ArtifactCard({ resource }: ArtifactCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const primaryFile = resource.primaryFile
  const formatInfo = getFileFormatInfo(primaryFile?.mimeType, primaryFile?.originalFilename)

  const primaryCategory = resource.categories[0]
  const versionString = resource.currentVersion ? `v${resource.currentVersion.version}` : 'v1.0.0'

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDownloading(true)
    setDownloadError(null)

    try {
      const response = await fetch(`/api/resources/${resource.id}/download`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Download failed. Please try again.')
      }

      // Extract filename from response headers or fallback
      const disposition = response.headers.get('content-disposition')
      let filename = primaryFile?.originalFilename || `${resource.slug}${formatInfo.extension.toLowerCase()}`
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match?.[1]) filename = match[1]
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (err: unknown) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 text-slate-200 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-950/40 focus-within:ring-2 focus-within:ring-sky-400/60">
      {/* Header: format logo badge + file info */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <FormatLogo format={formatInfo.key} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{formatInfo.label}</p>
            <p className="text-xs text-slate-400">
              {formatInfo.extension}
              {primaryFile ? ` · ${formatBytes(primaryFile.fileSize)}` : ''}
              {' · '}
              {versionString}
            </p>
          </div>
        </div>

        {resource.isFeatured && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
            <Star className="size-3 fill-current" />
            Featured
          </span>
        )}
      </div>

      {/* Preview window */}
      <div
        className={cn(
          'relative z-10 mx-5 mt-4 flex h-44 items-start justify-center overflow-hidden rounded-xl border border-white/10 bg-linear-to-b pt-5 sm:mx-6',
          previewBackdrop[formatInfo.key]
        )}
      >
        {primaryFile ? (
          <ResourceThumbnail
            size="lg"
            previewBase="/api/resources"
            resourceId={resource.id}
            title={resource.title}
            file={primaryFile}
            onOpen={() => setIsPreviewOpen(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-slate-500">No file attached</div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
        {primaryCategory && (
          <span className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-400">
            {primaryCategory.name}
          </span>
        )}

        <h3 className="font-heading text-lg font-bold leading-snug text-white transition-colors group-hover:text-sky-300 line-clamp-2">
          <Link
            href={`/artifacts/${resource.slug}`}
            className="rounded-xs focus-visible:outline-none after:absolute after:inset-0 after:z-0 after:content-['']"
          >
            {resource.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-2">
          {resource.description || 'Comprehensive supply chain practitioner resource with structured templates, formulas, and guidance.'}
        </p>

        {/* Stats */}
        <dl className="mt-4 grid grid-cols-2 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/5 text-center">
          <div className="px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Downloads</dt>
            <dd className="text-sm font-semibold text-white">{resource.downloadCount.toLocaleString('en-US')}</dd>
          </div>
          <div className="px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Updated</dt>
            <dd className="text-sm font-semibold text-white">{formatResourceDate(resource.updatedAt)}</dd>
          </div>
        </dl>

        {downloadError && (
          <div role="alert" className="mt-3 rounded-lg border border-rose-400/20 bg-rose-500/10 p-2.5 text-xs text-rose-300">
            {downloadError}
          </div>
        )}

        {/* Actions (above the stretched title link so they stay clickable) */}
        <div className="relative z-10 mt-auto flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label={`Download ${resource.title}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-sky px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-sky-hover disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="size-4" />
                <span>Download</span>
              </>
            )}
          </button>

          {resource.files.length > 0 && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              aria-label={`Preview ${resource.title}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <Eye className="size-4" />
              <span>Preview</span>
            </button>
          )}
        </div>
      </div>

      {isPreviewOpen && (
        <ArtifactPreviewModal
          resource={resource}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </article>
  )
}
