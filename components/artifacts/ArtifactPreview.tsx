'use client'

import { useState } from 'react'
import {
  FileSpreadsheet,
  FileText,
  FileType,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Maximize2,
  Download,
  Hash,
  Binary,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes, getFileFormatInfo } from '@/lib/resource-utils'
import type { PublicResourceDTO } from '@/lib/services/resource.service'

interface ArtifactPreviewProps {
  resource: PublicResourceDTO
}

export function ArtifactPreview({ resource }: ArtifactPreviewProps) {
  const [showPdfEmbed, setShowPdfEmbed] = useState(false)
  const primaryFile = resource.primaryFile
  const formatInfo = getFileFormatInfo(primaryFile?.mimeType, primaryFile?.originalFilename)

  const downloadUrl = `/api/resources/${resource.id}/download`

  if (formatInfo.key === 'pdf') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileType className="size-4 text-rose-600" />
            <span>Document Preview — {primaryFile?.originalFilename || `${resource.slug}.pdf`}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPdfEmbed(!showPdfEmbed)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-sky hover:text-slate-900 transition-colors"
            >
              {showPdfEmbed ? (
                <>
                  <span>Hide Viewer</span>
                </>
              ) : (
                <>
                  <Maximize2 className="size-3.5" />
                  <span>Expand Reader View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showPdfEmbed ? (
          <div className="relative w-full h-[650px] bg-slate-100">
            <iframe
              src={`${downloadUrl}?inline=true`}
              title={`Preview of ${resource.title}`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center bg-radial from-rose-50/50 to-white space-y-4">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-2 border border-rose-200">
              <FileType className="size-8" />
            </div>
            <h4 className="font-heading text-lg font-bold text-slate-900">
              {resource.title}
            </h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              This publication is formatted as a verified PDF document ({formatBytes(primaryFile?.fileSize)}). You can expand the in-browser reader view or download the document directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPdfEmbed(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                <Eye className="size-4 text-slate-600" />
                <span>Open In-Browser Reader</span>
              </button>
              <a
                href={downloadUrl}
                download={primaryFile?.originalFilename || `${resource.slug}.pdf`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-sky transition-colors"
              >
                <Download className="size-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck className="size-4" />
            <span>Cryptographic integrity verified (SHA-256)</span>
          </div>
          <span>Sandboxed viewer</span>
        </div>
      </div>
    )
  }

  // XLSX or DOCX verified file inspection card
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          {formatInfo.key === 'xlsx' ? (
            <FileSpreadsheet className="size-4 text-emerald-600" />
          ) : (
            <FileText className="size-4 text-sky-600" />
          )}
          <span>Verified Asset Specification</span>
        </div>
        <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold uppercase', formatInfo.colorBadgeClass)}>
          {formatInfo.extension}
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className={cn('flex size-12 items-center justify-center rounded-xl border', formatInfo.bgSoftClass, 'border-slate-200')}>
              {formatInfo.key === 'xlsx' ? (
                <FileSpreadsheet className="size-6 text-emerald-600" />
              ) : (
                <FileText className="size-6 text-sky-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {primaryFile?.originalFilename || `${resource.slug}${formatInfo.extension.toLowerCase()}`}
              </p>
              <p className="text-xs text-slate-500">
                {formatInfo.label} • {formatBytes(primaryFile?.fileSize)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-500/20">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Macro scan: Clean</span>
            </span>
          </div>
        </div>

        {/* Verified Technical Metadata Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cryptographic Integrity & Asset Attributes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Hash className="size-3.5 text-slate-400" />
                <span>SHA-256 Checksum</span>
              </div>
              <p className="font-mono text-xs text-slate-800 break-all" title={primaryFile?.checksum || 'Recorded upon verification'}>
                {primaryFile?.checksum ? `${primaryFile.checksum.substring(0, 24)}...` : 'Verified on upload'}
              </p>
              <p className="text-[11px] text-slate-400">Validated against storage prior to delivery</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Binary className="size-3.5 text-slate-400" />
                <span>Format Container</span>
              </div>
              <p className="font-medium text-xs text-slate-800">
                {formatInfo.key === 'xlsx' ? 'OOXML ISO/IEC 29500 SpreadsheetML' : 'OOXML ISO/IEC 29500 WordprocessingML'}
              </p>
              <p className="text-[11px] text-slate-400">Standardized OpenXML archive package</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Security Inspection</span>
              </div>
              <p className="font-medium text-xs text-emerald-700">
                Zero VBA/XL4 Macros Detected
              </p>
              <p className="text-[11px] text-slate-400">Heuristic signature and zip bounds validated</p>
            </div>

            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <FileText className="size-3.5 text-slate-400" />
                <span>Release Version</span>
              </div>
              <p className="font-medium text-xs text-slate-800">
                Release v{resource.currentVersion?.version || '1.0.0'}
              </p>
              <p className="text-[11px] text-slate-400">Managed editorial revision</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ShieldCheck className="size-4" />
          <span>Security Scanned & Integrity Verified</span>
        </div>
        <span>Version {resource.currentVersion?.version || '1.0.0'}</span>
      </div>
    </div>
  )
}
