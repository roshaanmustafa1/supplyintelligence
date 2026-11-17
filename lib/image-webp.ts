import os from 'node:os'
import { buffer2webpbuffer, grant_permission } from 'webp-converter'

export type ImageKind = { ext: string; mime: string }

export const WEBP_KIND: ImageKind = { ext: '.webp', mime: 'image/webp' }

/** Quality used for every conversion (visually lossless for photos and graphics). */
const WEBP_QUALITY_OPTION = '-q 82'

let permissionGranted = false

/** Identify the image type from magic bytes. Never trust a client-provided type or filename. */
export function detectImage(buf: Buffer): ImageKind | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: '.jpg', mime: 'image/jpeg' }
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: '.png', mime: 'image/png' }
  }
  if (buf.subarray(0, 4).toString('ascii') === 'GIF8') return { ext: '.gif', mime: 'image/gif' }
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return WEBP_KIND
  }
  return null
}

/**
 * Converts a JPG/PNG buffer to WebP. WebP is returned as-is and GIFs are kept
 * unchanged (they may be animated). If the converter is unavailable or fails,
 * the original image is returned so uploads never break.
 */
export async function toWebp(
  buffer: Buffer,
  kind: ImageKind
): Promise<{ buffer: Buffer; kind: ImageKind }> {
  if (kind.ext !== '.jpg' && kind.ext !== '.png') return { buffer, kind }

  try {
    if (!permissionGranted) {
      grant_permission()
      permissionGranted = true
    }
    const converted = await buffer2webpbuffer(
      buffer,
      kind.ext.slice(1),
      WEBP_QUALITY_OPTION,
      os.tmpdir()
    )
    if (detectImage(converted)?.ext !== '.webp') return { buffer, kind }
    return { buffer: converted, kind: WEBP_KIND }
  } catch (error) {
    console.warn('WebP conversion failed; keeping the original image:', error)
    return { buffer, kind }
  }
}
