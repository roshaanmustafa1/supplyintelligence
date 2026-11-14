"use client"

import { FileContentPreview } from "@/components/artifacts/FileContentPreview"
import { getFileFormatInfo } from "@/lib/resource-utils"

interface FilePreviewPaneProps {
  previewUrl: string
  title: string
  mimeType: string
  filename: string
}

/** Read-only viewer that picks the right renderer for a file's format. */
export function FilePreviewPane({
  previewUrl,
  title,
  mimeType,
  filename,
}: FilePreviewPaneProps) {
  const format = getFileFormatInfo(mimeType, filename)

  if (format.key === "pdf") {
    return (
      <iframe
        src={previewUrl}
        title={`Preview of ${title}`}
        className="h-[70vh] w-full rounded-xl border border-slate-200 bg-slate-100"
       
      />
    )
  }

  if (format.key === "docx" || format.key === "xlsx") {
    return <FileContentPreview previewUrl={previewUrl} />
  }

  return (
    <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      Preview is not available for this file type.
    </p>
  )
}
