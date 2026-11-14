'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilePreview } from '@/lib/file-preview'
import { getFileFormatInfo } from '@/lib/resource-utils'

interface ResourceThumbnailProps {
  resourceId: string
  title: string
  file?: { id: string; originalFilename: string; mimeType: string } | null
  onOpen?: () => void
  /** 'sm' is a table thumbnail; 'lg' is a page-sized preview for cards. */
  size?: 'sm' | 'lg'
  /** Base path of the preview API: admin (default) or public. */
  previewBase?: string
}

// Remember results so paging/sorting the table doesn't re-parse the same files.
const previewCache = new Map<string, FilePreview | 'unavailable'>()

const DOCX_MINI =
  'text-[12px] leading-snug text-slate-800 [&_h1]:mb-1 [&_h1]:text-[16px] [&_h1]:font-bold [&_h2]:mb-1 [&_h2]:text-[14px] [&_h2]:font-bold [&_h3]:font-semibold [&_p]:mb-1.5 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_table]:w-full [&_td]:border [&_td]:border-slate-200 [&_th]:border [&_th]:border-slate-200'

/**
 * Small "first page" thumbnail of a resource's primary file, shown by default in the
 * artifacts list (like the featured image in the articles list). Loads lazily once visible.
 */
export function ResourceThumbnail({
  resourceId,
  title,
  file,
  onOpen,
  size = 'sm',
  previewBase = '/api/admin/resources',
}: ResourceThumbnailProps) {
  const scaleClass = size === 'lg' ? 'scale-[0.78]' : 'scale-[0.25]'
  const holderRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [preview, setPreview] = useState<FilePreview | 'unavailable' | null>(null)

  const format = file ? getFileFormatInfo(file.mimeType, file.originalFilename) : null
  const previewUrl = file ? `${previewBase}/${resourceId}/preview?fileId=${file.id}` : null
  const cacheKey = previewUrl

  useEffect(() => {
    const el = holderRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !previewUrl || !cacheKey || !format) return
    if (format.key !== 'docx' && format.key !== 'xlsx') return
    if (previewCache.has(cacheKey)) return
    const controller = new AbortController()
    fetch(previewUrl, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => null)
        const value: FilePreview | 'unavailable' = res.ok && body ? (body as FilePreview) : 'unavailable'
        previewCache.set(cacheKey, value)
        setPreview(value)
      })
      .catch(() => {
        if (!controller.signal.aborted) setPreview('unavailable')
      })
    return () => controller.abort()
  }, [visible, previewUrl, cacheKey, format])

  const resolved = preview ?? (cacheKey ? previewCache.get(cacheKey) : undefined) ?? null
  const hasContent = resolved && resolved !== 'unavailable'
  const isPdf = format?.key === 'pdf'

  const content = () => {
    if (!file || !format) {
      return <FileText className="size-5 text-dashboard-muted-foreground" />
    }
    if (isPdf && visible && previewUrl) {
      return (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={`First page of ${title}`}
          tabIndex={-1}
          loading="lazy"
          className={cn('pointer-events-none h-[320px] w-[256px] origin-top-left border-0 bg-white', scaleClass)}
        />
      )
    }
    if (hasContent && resolved.kind === 'docx') {
      return (
        <div
          className={cn('pointer-events-none h-[320px] w-[256px] origin-top-left overflow-hidden bg-white p-3', scaleClass, DOCX_MINI)}
          dangerouslySetInnerHTML={{ __html: resolved.html }}
        />
      )
    }
    if (hasContent && resolved.kind === 'xlsx') {
      const rows = (resolved.sheets[0]?.rows ?? []).slice(0, 14)
      return (
        <div className={cn('pointer-events-none h-[320px] w-[256px] origin-top-left overflow-hidden bg-white p-2', scaleClass)}>
          <table className="w-full table-fixed border-collapse text-[11px] text-slate-800">
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.slice(0, 5).map((cell, c) => (
                    <td
                      key={c}
                      className={cn('truncate border border-slate-200 px-1 py-0.5', r === 0 && 'bg-emerald-50 font-semibold')}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    // Loading, unavailable, or unsupported format: show the file-type tile.
    return (
      <div className={cn('flex size-full flex-col items-center justify-center gap-1', format.bgSoftClass)}>
        <FileText className={cn('size-6', format.iconColorClass)} />
      </div>
    )
  }

  const body = (
    <div
      ref={holderRef}
      className={cn(
        'relative shrink-0 overflow-hidden border border-slate-200 bg-white',
        size === 'lg' ? 'h-full w-[200px] rounded-t-md shadow-md' : 'h-20 w-16 rounded-lg shadow-xs'
      )}
    >
      {content()}
      {format && (
        <span
          className={cn(
            'absolute bottom-0.5 right-0.5 rounded border px-1 text-[9px] font-bold leading-tight uppercase backdrop-blur-sm',
            format.colorBadgeClass
          )}
        >
          {format.extension.replace('.', '')}
        </span>
      )}
    </div>
  )

  if (!onOpen || !file) return body
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Preview files of ${title}`}
      title="Open full preview"
      className={cn('shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-brand-blue', size === 'lg' && 'h-full')}
    >
      {body}
    </button>
  )
}
