"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FilePreview } from "@/lib/file-preview"

interface FileContentPreviewProps {
  previewUrl: string
}

type PreviewState =
  | { url: string; status: "ready"; data: FilePreview }
  | { url: string; status: "error"; message: string }

const DOCX_PROSE =
  "text-sm leading-relaxed text-slate-800 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left"

export function FileContentPreview({ previewUrl }: FileContentPreviewProps) {
  const [state, setState] = useState<PreviewState | null>(null)
  const [activeSheet, setActiveSheet] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetch(previewUrl, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => null)
        if (!res.ok || !body) {
          throw new Error(body?.error || "Preview is not available")
        }
        setState({
          url: previewUrl,
          status: "ready",
          data: body as FilePreview,
        })
        setActiveSheet(0)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          url: previewUrl,
          status: "error",
          message:
            error instanceof Error ? error.message : "Preview is not available",
        })
      })
    return () => controller.abort()
  }, [previewUrl])

  const current = state && state.url === previewUrl ? state : null

  if (!current) {
    return (
      <div
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-10 text-sm text-slate-500"
        role="status"
      >
        <Loader2 className="size-4 animate-spin" />
        <span>Loading preview…</span>
      </div>
    )
  }

  if (current.status === "error") {
    return (
      <div
        className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        role="alert"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{current.message}</span>
      </div>
    )
  }

  const { data } = current

  if (data.kind === "docx") {
    return (
      <div className="space-y-2">
        <div
          className={cn(
            "max-h-[600px] overflow-auto rounded-xl border border-slate-200 bg-white p-6",
            DOCX_PROSE
          )}
          // HTML is sanitized server-side (lib/file-preview.ts): no scripts, links, images or styles.
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
        {data.truncated && (
          <p className="text-xs text-slate-500">
            Preview shortened. Download the file to read the full document.
          </p>
        )}
      </div>
    )
  }

  const sheet = data.sheets[Math.min(activeSheet, data.sheets.length - 1)]
  if (!sheet) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        This workbook has no sheets to preview.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {data.sheets.length > 1 && (
        <div
          role="tablist"
          aria-label="Worksheets"
          className="flex flex-wrap gap-1.5"
        >
          {data.sheets.map((s, index) => (
            <button
              key={`${s.name}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === activeSheet}
              onClick={() => setActiveSheet(index)}
              className={cn(
                "rounded-md border px-3 py-1 text-xs font-semibold transition-colors",
                index === activeSheet
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-[480px] overflow-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-xs text-slate-800">
          <tbody>
            {sheet.rows.map((row, r) => (
              <tr
                key={r}
                className={r === 0 ? "bg-slate-50 font-semibold" : undefined}
              >
                <th
                  scope="row"
                  className="sticky left-0 border border-slate-200 bg-slate-100 px-2 py-1 text-right font-normal text-slate-400"
                >
                  {r + 1}
                </th>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className="max-w-64 truncate border border-slate-200 px-2 py-1"
                    title={cell}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        {sheet.totalRows} rows × {sheet.totalCols} columns
        {sheet.truncated && " · showing the first rows and columns only"}
        {data.totalSheets > data.sheets.length &&
          ` · ${data.totalSheets - data.sheets.length} more sheet(s) not shown`}
        . Values are shown as saved in the file.
      </p>
    </div>
  )
}
