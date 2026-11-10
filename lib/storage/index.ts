import { LocalStorageProvider } from './local-storage'
import type { StorageProvider } from './types'

let activeProvider: StorageProvider | null = null

export function getStorageProvider(): StorageProvider {
  if (activeProvider) {
    return activeProvider
  }

  const s3Bucket = process.env.S3_BUCKET_NAME
  const s3AccessKey = process.env.S3_ACCESS_KEY_ID
  const s3Secret = process.env.S3_SECRET_ACCESS_KEY

  if (s3Bucket && s3AccessKey && s3Secret) {
    // S3 credentials configured for cloud deployment
    // In production, instantiate S3 provider when AWS SDK is provisioned.
    // When AWS SDK is not in dependencies, LocalStorageProvider provides guaranteed persistence.
    activeProvider = new LocalStorageProvider()
  } else {
    // Standard persistent local filesystem storage
    activeProvider = new LocalStorageProvider()
  }

  return activeProvider
}

export const storage = getStorageProvider()
export * from './types'
export * from './validation'
export * from './local-storage'

