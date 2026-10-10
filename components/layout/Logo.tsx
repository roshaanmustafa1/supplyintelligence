import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface LogoProps {
  className?: string
  imageClassName?: string
  variant?: 'light' | 'dark'
  layout?: 'horizontal' | 'stacked' | 'mark'
  priority?: boolean
  showTagline?: boolean
}

export function Logo({
  className,
  imageClassName,
  variant = 'light',
  layout = 'horizontal',
  priority = true,
  showTagline = false,
}: LogoProps) {
  const isDark = variant === 'dark'

  // Determine source image and intrinsic aspect ratio
  let src = isDark ? '/images/logo-dark.png' : '/images/logo.png'
  let width = 1024
  let height = 313
  let defaultImgClass = 'h-8 sm:h-9 w-auto object-contain'

  if (layout === 'stacked') {
    src = isDark ? '/images/logo-stacked-dark.png' : '/images/logo-stacked.png'
    width = 1024
    height = 830
    defaultImgClass = 'h-14 sm:h-16 w-auto object-contain'
  } else if (layout === 'mark') {
    src = '/images/logo-mark.png'
    width = 416
    height = 479
    defaultImgClass = 'size-8 object-contain'
  }

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-3 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-sm select-none',
        className
      )}
      aria-label="Supply Intelligence Home"
    >
      <div className="relative flex shrink-0 items-center">
        <Image
          src={src}
          alt="Supply Intelligence"
          width={width}
          height={height}
          priority={priority}
          className={cn(defaultImgClass, imageClassName)}
        />
      </div>

      {showTagline && (
        <span className="hidden xl:inline-block text-[10px] text-slate-500 font-medium tracking-normal border-l border-slate-200 pl-3 py-1">
          Procurement &bull; Supply Chain &bull; AI &bull; Project Delivery
        </span>
      )}
    </Link>
  )
}

