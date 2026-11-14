'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileSpreadsheet,
  FileText,
  FileType,
  Download,
  Calendar,
  HardDrive,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ArtifactPreviewModal } from '@/components/artifacts/ArtifactPreviewModal'
import { formatBytes, formatResourceDate, getFileFormatInfo } from '@/lib/resource-utils'
import type { PublicResourceDTO } from '@/lib/services/resource.service'

interface ArtifactCardProps {
  resource: PublicResourceDTO
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

  const renderFormatIcon = () => {
    switch (formatInfo.key) {
      case 'xlsx':
        return <FileSpreadsheet className="size-6 text-emerald-600 dark:text-emerald-400" />
      case 'docx':
        return <FileText className="size-6 text-sky-600 dark:text-sky-400" />
      case 'pdf':
        return <FileType className="size-6 text-rose-600 dark:text-rose-400" />
      default:
        return <FileText className="size-6 text-slate-600 dark:text-slate-400" />
    }
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-slate-400 hover:shadow-md">
      <div>
        {/* Top Badges & Meta */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={cn('flex size-11 items-center justify-center rounded-lg border border-slate-200', formatInfo.bgSoftClass)}>
              {renderFormatIcon()}
            </div>
            <div>
              <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-wider', formatInfo.colorBadgeClass)}>
                {formatInfo.extension.replace('.', '')}
              </span>
              <span className="ml-2 text-xs font-medium text-slate-400">
                {versionString}
              </span>
            </div>
          </div>

          {resource.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
              Featured
            </span>
          )}
        </div>

        {/* Primary Category Pill */}
        {primaryCategory && (
          <div className="mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-sky">
              {primaryCategory.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-brand-sky transition-colors line-clamp-2">
          <Link href={`/artifacts/${resource.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky rounded-xs">
            {resource.title}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
          {resource.description || 'Comprehensive supply chain practitioner resource with structured templates, formulas, and guidance.'}
        </p>

        {/* File Specs Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {primaryFile && (
            <div className="flex items-center gap-1">
              <HardDrive className="size-3.5 text-slate-400" />
              <span>{formatBytes(primaryFile.fileSize)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="size-3.5 text-slate-400" />
            <span>Updated {formatResourceDate(resource.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span>Security Scanned</span>
          </div>
        </div>

        {downloadError && (
          <div className="mt-3 rounded-md bg-rose-50 p-2 text-xs text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            {downloadError}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
        <Link
          href={`/artifacts/${resource.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-sky transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="flex items-center gap-2">
          {resource.files.length > 0 && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              aria-label={`Preview ${resource.title}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
            >
              <Eye className="size-3.5" />
              <span>Preview</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label={`Download ${resource.title}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-brand-sky disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isPreviewOpen && (
        <ArtifactPreviewModal
          resource={resource}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  )
}

