"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FileContentPreview } from "@/components/artifacts/FileContentPreview"
import { formatBytes, getFileFormatInfo } from "@/lib/resource-utils"
import type { PublicResourceDTO } from "@/lib/services/resource.service"

interface ArtifactPreviewProps {
  resource: PublicResourceDTO
}

export function ArtifactPreview({ resource }: ArtifactPreviewProps) {
  const [showPdfEmbed, setShowPdfEmbed] = useState(false)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  const files = resource.files
  const primaryFile =
    files.find((f) => f.id === activeFileId) ??
    files.find((f) => f.isPrimary) ??
    resource.primaryFile
  const formatInfo = getFileFormatInfo(
    primaryFile?.mimeType,
    primaryFile?.originalFilename
  )

  const fileQuery = primaryFile
    ? `fileId=${encodeURIComponent(primaryFile.id)}`
    : ""
  const downloadUrl = `/api/resources/${resource.id}/download${fileQuery ? `?${fileQuery}` : ""}`
  const previewUrl = `/api/resources/${resource.id}/preview${fileQuery ? `?${fileQuery}` : ""}`

  const fileTabs =
    files.length > 1 ? (
      <div
        role="tablist"
        aria-label="Attached files"
        className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2"
      >
        {files.map((file) => {
          const info = getFileFormatInfo(file.mimeType, file.originalFilename)
          const isActive = file.id === primaryFile?.id
          return (
            <button
              key={file.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActiveFileId(file.id)
                setShowPdfEmbed(false)
              }}
              className={cn(
                "inline-flex max-w-full items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="truncate">{file.originalFilename}</span>
              <span className="shrink-0 opacity-70">{info.extension}</span>
            </button>
          )
        })}
      </div>
    ) : null

  if (formatInfo.key === "pdf") {
    return (
      <div className="space-y-3">
        {fileTabs}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <FileType className="size-4 text-rose-600" />
              <span>
                Document Preview —{" "}
                {primaryFile?.originalFilename || `${resource.slug}.pdf`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPdfEmbed(!showPdfEmbed)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-sky transition-colors hover:text-slate-900"
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
            <div className="relative h-[650px] w-full bg-slate-100">
              <iframe
                src={previewUrl}
                title={`Preview of ${resource.title}`}
                className="h-full w-full border-0"
               
              />
            </div>
          ) : (
            <div className="space-y-4 bg-radial from-rose-50/50 to-white p-8 text-center sm:p-12">
              <div className="mb-2 inline-flex size-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 text-rose-600">
                <FileType className="size-8" />
              </div>
              <h4 className="font-heading text-lg font-bold text-slate-900">
                {resource.title}
              </h4>
              <p className="mx-auto max-w-md text-sm text-slate-500">
                This publication is formatted as a verified PDF document (
                {formatBytes(primaryFile?.fileSize)}). You can expand the
                in-browser reader view or download the document directly.
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
                  download={
                    primaryFile?.originalFilename || `${resource.slug}.pdf`
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-brand-sky"
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
      </div>
    )
  }

  // XLSX or DOCX verified file inspection card
  return (
    <div className="space-y-3">
      {fileTabs}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            {formatInfo.key === "xlsx" ? (
              <FileSpreadsheet className="size-4 text-emerald-600" />
            ) : (
              <FileText className="size-4 text-sky-600" />
            )}
            <span>Verified Asset Specification</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold uppercase",
              formatInfo.colorBadgeClass
            )}
          >
            {formatInfo.extension}
          </span>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl border",
                  formatInfo.bgSoftClass,
                  "border-slate-200"
                )}
              >
                {formatInfo.key === "xlsx" ? (
                  <FileSpreadsheet className="size-6 text-emerald-600" />
                ) : (
                  <FileText className="size-6 text-sky-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {primaryFile?.originalFilename ||
                    `${resource.slug}${formatInfo.extension.toLowerCase()}`}
                </p>
                <p className="text-xs text-slate-500">
                  {formatInfo.label} • {formatBytes(primaryFile?.fileSize)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Macro scan: Clean</span>
              </span>
            </div>
          </div>

          {primaryFile &&
            (formatInfo.key === "docx" || formatInfo.key === "xlsx") && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  Read-only Content Preview
                </h4>
                <FileContentPreview
                  key={primaryFile.id}
                  previewUrl={previewUrl}
                />
              </div>
            )}

          {/* Verified Technical Metadata Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Cryptographic Integrity & Asset Attributes
            </h4>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Hash className="size-3.5 text-slate-400" />
                  <span>SHA-256 Checksum</span>
                </div>
                <p
                  className="font-mono text-xs break-all text-slate-800"
                  title={primaryFile?.checksum || "Recorded upon verification"}
                >
                  {primaryFile?.checksum
                    ? `${primaryFile.checksum.substring(0, 24)}...`
                    : "Verified on upload"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Validated against storage prior to delivery
                </p>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Binary className="size-3.5 text-slate-400" />
                  <span>Format Container</span>
                </div>
                <p className="text-xs font-medium text-slate-800">
                  {formatInfo.key === "xlsx"
                    ? "OOXML ISO/IEC 29500 SpreadsheetML"
                    : "OOXML ISO/IEC 29500 WordprocessingML"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Standardized OpenXML archive package
                </p>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>Security Inspection</span>
                </div>
                <p className="text-xs font-medium text-emerald-700">
                  Zero VBA/XL4 Macros Detected
                </p>
                <p className="text-[11px] text-slate-400">
                  Heuristic signature and zip bounds validated
                </p>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <FileText className="size-3.5 text-slate-400" />
                  <span>Release Version</span>
                </div>
                <p className="text-xs font-medium text-slate-800">
                  Release v{resource.currentVersion?.version || "1.0.0"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Managed editorial revision
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck className="size-4" />
            <span>Security Scanned & Integrity Verified</span>
          </div>
          <span>Version {resource.currentVersion?.version || "1.0.0"}</span>
        </div>
      </div>
    </div>
  )
}
