import crypto from 'node:crypto'
import { put, get, head, del } from '@vercel/blob'
import type { StorageProvider, StorageFileMeta, StoredFile } from './types'
import { validateFileBuffer, computeSha256 } from './validation'
import { LocalStorageProvider } from './local-storage'

const PREFIX = 'resources/'

function mimeFromKey(storageKey: string): string {
  const lower = storageKey.toLowerCase()
  if (lower.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (lower.endsWith('.pdf')) return 'application/pdf'
  return 'application/octet-stream'
}

/**
 * Persistent storage on a private Vercel Blob store. Files are only reachable
 * through the app's authorized delivery routes. Reads fall back to the bundled
 * local `storage/resources` directory so files created before the Blob migration
 * keep working.
 */
export class BlobStorageProvider implements StorageProvider {
  constructor(private readonly fallback: LocalStorageProvider) {}

  async upload(file: { filename: string; buffer: Buffer; mimeType: string }): Promise<StorageFileMeta> {
    const validation = validateFileBuffer(file.buffer, file.filename, file.mimeType)
    if (!validation.valid) {
      throw new Error(`File validation failed: ${validation.error}`)
    }

    const storageKey = `${crypto.randomUUID()}${validation.extension}`
    await put(`${PREFIX}${storageKey}`, file.buffer, {
      access: 'private',
      addRandomSuffix: false,
      contentType: validation.mimeType,
    })

    return {
      storageKey,
      originalFilename: file.filename.split(/[\/]/).pop() || file.filename,
      mimeType: validation.mimeType,
      fileSize: validation.fileSize,
      checksum: validation.checksum,
    }
  }

  async download(storageKey: string): Promise<StoredFile | null> {
    const result = await get(`${PREFIX}${storageKey}`, { access: 'private' }).catch(() => null)
    if (result && result.stream) {
      const buffer = Buffer.from(await new Response(result.stream).arrayBuffer())
      return {
        storageKey,
        originalFilename: storageKey,
        mimeType: mimeFromKey(storageKey),
        fileSize: buffer.length,
        checksum: computeSha256(buffer),
        stream: buffer,
      }
    }
    return this.fallback.download(storageKey)
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      await del(`${PREFIX}${storageKey}`)
    } catch {
      /* fall through to local cleanup */
    }
    return this.fallback.delete(storageKey)
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      await head(`${PREFIX}${storageKey}`)
      return true
    } catch {
      return this.fallback.exists(storageKey)
    }
  }
}
