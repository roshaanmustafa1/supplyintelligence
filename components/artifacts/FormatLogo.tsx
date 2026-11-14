import { cn } from '@/lib/utils'
import type { FileFormatKey } from '@/lib/resource-utils'

interface FormatLogoProps {
  format: FileFormatKey
  className?: string
}

/**
 * Brand-style file-format logo (Excel / Word / PDF) used as a badge on artifact cards.
 * Drawn as inline SVG so it stays crisp and needs no image assets.
 */
export function FormatLogo({ format, className }: FormatLogoProps) {
  const label = format === 'xlsx' ? 'Excel' : format === 'docx' ? 'Word' : format === 'pdf' ? 'PDF' : 'File'

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={`${label} file`}
      className={cn('size-11 shrink-0 drop-shadow-md', className)}
    >
      <defs>
        <linearGradient id="fl-xlsx" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#21a366" />
          <stop offset="1" stopColor="#107c41" />
        </linearGradient>
        <linearGradient id="fl-docx" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b7cd3" />
          <stop offset="1" stopColor="#185abd" />
        </linearGradient>
        <linearGradient id="fl-pdf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0483e" />
          <stop offset="1" stopColor="#c8271f" />
        </linearGradient>
        <linearGradient id="fl-other" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>

      {format === 'xlsx' && (
        <>
          <rect x="4" y="4" width="40" height="40" rx="9" fill="url(#fl-xlsx)" />
          <path d="M26 14h12M26 22h12M26 30h12M26 38h12" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
          <rect x="9" y="12" width="22" height="24" rx="4" fill="#0b5d30" />
          <path d="m15 19 10 10m0-10L15 29" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {format === 'docx' && (
        <>
          <rect x="4" y="4" width="40" height="40" rx="9" fill="url(#fl-docx)" />
          <path d="M26 14h12M26 22h12M26 30h12M26 38h12" stroke="#fff" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
          <rect x="9" y="12" width="22" height="24" rx="4" fill="#0f3f8a" />
          <path d="m13.5 19 3 10 3-8 3 8 3-10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}

      {format === 'pdf' && (
        <>
          <rect x="4" y="4" width="40" height="40" rx="9" fill="url(#fl-pdf)" />
          <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="0.5">PDF</text>
        </>
      )}

      {format === 'other' && (
        <>
          <rect x="4" y="4" width="40" height="40" rx="9" fill="url(#fl-other)" />
          <path d="M16 12h12l6 6v18a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2Z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M28 12v6h6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}
