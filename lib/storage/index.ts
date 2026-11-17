import { LocalStorageProvider } from './local-storage'
import { BlobStorageProvider } from './blob-storage'
import type { StorageProvider } from './types'

let activeProvider: StorageProvider | null = null

export function getStorageProvider(): StorageProvider {
  if (activeProvider) {
    return activeProvider
  }

  const local = new LocalStorageProvider()
  // Vercel's filesystem is read-only/ephemeral, so use Blob whenever a token is configured.
  activeProvider = process.env.BLOB_READ_WRITE_TOKEN ? new BlobStorageProvider(local) : local

  return activeProvider
}

export const storage = getStorageProvider()
export * from './types'
export * from './validation'
export * from './local-storage'
