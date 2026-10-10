import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide' | 'full'
}

export function Container({
  children,
  className,
  size = 'default',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full px-6 sm:px-10 lg:px-16 xl:px-24',
        className
      )}
      data-container-size={size}
      {...props}
    >
      {children}
    </div>
  )
}
