import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { StorageProvider, StorageFileMeta, StoredFile } from './types'
import { validateFileBuffer, computeSha256 } from './validation'

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string

  constructor(customDir?: string) {
    this.baseDir = path.resolve(/*turbopackIgnore: true*/ customDir || process.env.STORAGE_LOCAL_DIR || path.join(process.cwd(), 'storage', 'resources'))
    if (!fsSync.existsSync(this.baseDir)) {
      fsSync.mkdirSync(this.baseDir, { recursive: true })
    }
  }

  getBaseDir(): string {
    return this.baseDir
  }

  private resolveSafePath(storageKey: string): string {
    // Sanitize storageKey: strip null bytes and directory navigation
    const sanitizedKey = path.basename(storageKey)
    const targetPath = path.resolve(this.baseDir, sanitizedKey)

    // Path traversal check
    if (!targetPath.startsWith(this.baseDir)) {
      throw new Error(`Path traversal attempt detected with key: ${storageKey}`)
    }

    return targetPath
  }

  async upload(file: {
    filename: string
    buffer: Buffer
    mimeType: string
  }): Promise<StorageFileMeta> {
    const validation = validateFileBuffer(file.buffer, file.filename, file.mimeType)
    if (!validation.valid) {
      throw new Error(`File validation failed: ${validation.error}`)
    }

    const uniqueId = crypto.randomUUID()
    const storageKey = `${uniqueId}${validation.extension}`
    const targetPath = this.resolveSafePath(storageKey)
    const tempPath = `${targetPath}.tmp.${crypto.randomBytes(4).toString('hex')}`

    try {
      await fs.writeFile(tempPath, file.buffer)
      await fs.rename(tempPath, targetPath)
    } catch (err) {
      if (fsSync.existsSync(tempPath)) {
        await fs.unlink(tempPath).catch(() => {})
      }
      throw err
    }

    return {
      storageKey,
      originalFilename: path.basename(file.filename),
      mimeType: validation.mimeType,
      fileSize: validation.fileSize,
      checksum: validation.checksum,
    }
  }

  async download(storageKey: string): Promise<StoredFile | null> {
    const targetPath = this.resolveSafePath(storageKey)
    if (!fsSync.existsSync(targetPath)) {
      return null
    }

    const stat = await fs.stat(targetPath)
    const buffer = await fs.readFile(targetPath)
    const ext = path.extname(storageKey).toLowerCase()

    let mimeType = 'application/octet-stream'
    if (ext === '.xlsx') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    else if (ext === '.pdf') mimeType = 'application/pdf'

    return {
      storageKey,
      originalFilename: path.basename(storageKey),
      mimeType,
      fileSize: stat.size,
      checksum: computeSha256(buffer),
      stream: buffer,
    }
  }

  async delete(storageKey: string): Promise<boolean> {
    try {
      const targetPath = this.resolveSafePath(storageKey)
      if (fsSync.existsSync(targetPath)) {
        await fs.unlink(targetPath)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      const targetPath = this.resolveSafePath(storageKey)
      return fsSync.existsSync(targetPath)
    } catch {
      return false
    }
  }
}
