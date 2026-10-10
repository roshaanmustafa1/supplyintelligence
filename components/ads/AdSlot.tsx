import { cn } from '@/lib/utils'

export type AdSlotVariant = 'leaderboard' | 'in-content' | 'sidebar' | 'article-bottom'

interface AdSlotProps {
  slot: string
  variant?: AdSlotVariant
  className?: string
}

export function AdSlot({
  slot,
  variant = 'leaderboard',
  className,
}: AdSlotProps) {
  // Fixed dimensions for standard IAB ad formats to eliminate Cumulative Layout Shift (CLS)
  const variantStyles = {
    leaderboard: 'min-h-[90px] sm:min-h-[100px] max-w-[728px] lg:max-w-[970px]',
    'in-content': 'min-h-[120px] sm:min-h-[140px] max-w-[728px]',
    sidebar: 'min-h-[250px] sm:min-h-[300px] max-w-[300px] sm:max-w-[336px]',
    'article-bottom': 'min-h-[90px] sm:min-h-[120px] max-w-[728px]',
  }

  return (
    <aside
      aria-label="Advertisement container"
      data-ad-slot={slot}
      data-ad-variant={variant}
      className={cn(
        'my-8 mx-auto w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-subtle/80 p-4 transition-colors',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-1 text-center select-none pointer-events-none">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/80">
          ADVERTISEMENT
        </span>
        <span className="text-[11px] font-medium text-muted-foreground/60">
          Reserved Commercial Placement · Slot: {slot}
        </span>
      </div>
    </aside>
  )
}
