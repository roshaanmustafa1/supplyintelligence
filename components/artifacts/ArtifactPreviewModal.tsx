"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilePreviewPane } from "@/components/artifacts/FilePreviewPane"
import { getFileFormatInfo } from "@/lib/resource-utils"
import type { PublicResourceDTO } from "@/lib/services/resource.service"

interface ArtifactPreviewModalProps {
  resource: PublicResourceDTO
  onClose: () => void
}

/** Read-only preview of a published artifact's files, opened from a listing card. */
export function ArtifactPreviewModal({
  resource,
  onClose,
}: ArtifactPreviewModalProps) {
  const files = resource.files
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const activeFile =
    files.find((f) => f.id === activeFileId) ??
    files.find((f) => f.isPrimary) ??
    files[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${resource.title}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="min-w-0">
            <h3 className="truncate font-heading text-lg font-bold text-slate-900">
              {resource.title}
            </h3>
            <p className="text-xs text-slate-500">Read-only preview</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            autoFocus
            className="rounded-md text-slate-500 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>

        {files.length > 1 && (
          <div
            role="tablist"
            aria-label="Attached files"
            className="flex flex-wrap gap-2"
          >
            {files.map((file) => {
              const info = getFileFormatInfo(
                file.mimeType,
                file.originalFilename
              )
              const isActive = file.id === activeFile?.id
              return (
                <button
                  key={file.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFileId(file.id)}
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
        )}

        <div className="min-h-0 flex-1 overflow-auto">
          {activeFile ? (
            <FilePreviewPane
              key={activeFile.id}
              previewUrl={`/api/resources/${resource.id}/preview?fileId=${encodeURIComponent(activeFile.id)}`}
              title={resource.title}
              mimeType={activeFile.mimeType}
              filename={activeFile.originalFilename}
            />
          ) : (
            <p className="text-sm text-slate-500">No file attached.</p>
          )}
        </div>
      </div>
    </div>
  )
}
