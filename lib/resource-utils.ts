export function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const formatted = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)
  return `${formatted} ${units[i]}`
}

export function formatResourceDate(date?: Date | string | null): string {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export type FileFormatKey = 'xlsx' | 'docx' | 'pdf' | 'other'

export interface FileFormatMetadata {
  key: FileFormatKey
  label: string
  extension: string
  colorBadgeClass: string
  iconColorClass: string
  bgSoftClass: string
}

export function getFileFormatInfo(mimeType?: string | null, filename?: string | null): FileFormatMetadata {
  const lowerName = (filename || '').toLowerCase()
  const lowerMime = (mimeType || '').toLowerCase()

  if (
    lowerName.endsWith('.xlsx') ||
    lowerMime.includes('spreadsheetml') ||
    lowerMime.includes('excel')
  ) {
    return {
      key: 'xlsx',
      label: 'Excel Spreadsheet',
      extension: '.XLSX',
      colorBadgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
      iconColorClass: 'text-emerald-600 dark:text-emerald-400',
      bgSoftClass: 'bg-emerald-50 dark:bg-emerald-950/30',
    }
  }

  if (
    lowerName.endsWith('.docx') ||
    lowerMime.includes('wordprocessingml') ||
    lowerMime.includes('msword')
  ) {
    return {
      key: 'docx',
      label: 'Word Document',
      extension: '.DOCX',
      colorBadgeClass: 'bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-400',
      iconColorClass: 'text-sky-600 dark:text-sky-400',
      bgSoftClass: 'bg-sky-50 dark:bg-sky-950/30',
    }
  }

  if (lowerName.endsWith('.pdf') || lowerMime.includes('pdf')) {
    return {
      key: 'pdf',
      label: 'PDF Document',
      extension: '.PDF',
      colorBadgeClass: 'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-400',
      iconColorClass: 'text-rose-600 dark:text-rose-400',
      bgSoftClass: 'bg-rose-50 dark:bg-rose-950/30',
    }
  }

  return {
    key: 'other',
    label: 'Document Asset',
    extension: 'FILE',
    colorBadgeClass: 'bg-slate-500/10 text-slate-700 border-slate-500/30 dark:text-slate-400',
    iconColorClass: 'text-slate-600 dark:text-slate-400',
    bgSoftClass: 'bg-slate-50 dark:bg-slate-900',
  }
}

