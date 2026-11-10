import Image, { type ImageProps } from 'next/image'
import imageMetadata from '@/data/article-image-metadata.json'
import { cn } from '@/lib/utils'

type ArticleImageProps = Omit<ImageProps, 'width' | 'height'>

export function ArticleImage({ src, fill, className, ...props }: ArticleImageProps) {
  const dimensions = typeof src === 'string'
    ? (imageMetadata as Record<string, { width: number; height: number }>)[src]
    : undefined

  return (
    <Image
      {...props}
      src={src}
      fill={fill}
      {...(!fill && { width: dimensions?.width || 1280, height: dimensions?.height || 720 })}
      className={cn(fill ? 'object-contain' : 'block h-auto w-full', className)}
    />
  )
}
