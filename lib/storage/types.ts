import { Readable } from 'node:stream'

export type AllowedMimeType =
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/pdf'

export type AllowedExtension = '.xlsx' | '.docx' | '.pdf'

export interface StorageFileMeta {
  storageKey: string
  originalFilename: string
  mimeType: AllowedMimeType | string
  fileSize: number
  checksum: string
}

export interface StoredFile extends StorageFileMeta {
  stream: Readable | Buffer
}

export interface StorageProvider {
  upload(file: {
    filename: string
    buffer: Buffer
    mimeType: string
  }): Promise<StorageFileMeta>

  download(storageKey: string): Promise<StoredFile | null>

  delete(storageKey: string): Promise<boolean>

  exists(storageKey: string): Promise<boolean>
}

export interface FileScanResult {
  isClean: boolean
  threatName?: string
  scannerName: string
  scannedAt: Date
}

export interface FileSecurityScanner {
  scan(buffer: Buffer, filename: string): Promise<FileScanResult>
}

