import crypto from 'node:crypto'
import path from 'node:path'
import type { AllowedExtension, AllowedMimeType, FileSecurityScanner, FileScanResult } from './types'

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB

export const ALLOWED_EXTENSIONS_MAP: Record<AllowedExtension, AllowedMimeType[]> = {
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.pdf': ['application/pdf'],
}

export interface ValidationSuccess {
  valid: true
  extension: AllowedExtension
  mimeType: AllowedMimeType
  checksum: string
  fileSize: number
}

export interface ValidationFailure {
  valid: false
  error: string
  code: 'SIZE_EXCEEDED' | 'DISALLOWED_EXTENSION' | 'MIME_MISMATCH' | 'SIGNATURE_MISMATCH' | 'CORRUPTED'
}

export type FileValidationResult = ValidationSuccess | ValidationFailure

/**
 * Validates initial file magic bytes against expected formats.
 */
export function verifyMagicBytes(buffer: Buffer, extension: AllowedExtension): boolean {
  if (buffer.length < 4) return false

  if (extension === '.pdf') {
    // PDF magic bytes: %PDF (0x25 0x50 0x44 0x46)
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    )
  }

  if (extension === '.xlsx' || extension === '.docx') {
    // OpenXML format is a ZIP archive: PK\x03\x04, PK\x05\x06, or PK\x07\x08
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
      (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
    )
  }

  return false
}

/**
 * Validates OOXML ZIP container structure, bounds, and required manifest entries.
 * Rejects 4-byte prefixes, malformed ZIPs, zip-bombs, and missing Office components.
 */
export function validateOoxmlContainer(
  buffer: Buffer,
  extension: '.xlsx' | '.docx'
): { valid: true } | { valid: false; error: string; code: 'SIGNATURE_MISMATCH' | 'CORRUPTED' } {
  if (buffer.length < 22) {
    return {
      valid: false,
      error: 'Malformed archive: File is too small to be a valid ZIP container.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  // Find End of Central Directory (EOCD) record
  // EOCD signature is PK\x05\x06 (0x06054b50)
  let eocdOffset = -1
  const minEocdSearch = Math.max(0, buffer.length - 65557)
  for (let i = buffer.length - 22; i >= minEocdSearch; i--) {
    if (
      buffer[i] === 0x50 &&
      buffer[i + 1] === 0x4b &&
      buffer[i + 2] === 0x05 &&
      buffer[i + 3] === 0x06
    ) {
      eocdOffset = i
      break
    }
  }

  if (eocdOffset === -1) {
    return {
      valid: false,
      error: 'Malformed archive: End of Central Directory record not found. File is not a valid ZIP container.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  const totalEntries = buffer.readUInt16LE(eocdOffset + 10)
  const cdSize = buffer.readUInt32LE(eocdOffset + 12)
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16)

  if (totalEntries === 0) {
    return {
      valid: false,
      error: 'Malformed archive: ZIP container contains 0 entries.',
      code: 'CORRUPTED',
    }
  }

  if (totalEntries > 1000) {
    return {
      valid: false,
      error: 'Archive exceeds safety limits: Too many entries (>1000).',
      code: 'CORRUPTED',
    }
  }

  if (cdOffset + cdSize > eocdOffset || cdOffset >= buffer.length) {
    return {
      valid: false,
      error: 'Malformed archive: Central directory bounds are invalid.',
      code: 'CORRUPTED',
    }
  }

  // Parse entries from central directory
  const entries: string[] = []
  let curr = cdOffset
  let totalUncompressed = 0

  for (let e = 0; e < totalEntries; e++) {
    if (curr + 46 > buffer.length) {
      return {
        valid: false,
        error: 'Malformed archive: Central directory entry truncated.',
        code: 'CORRUPTED',
      }
    }

    const sig = buffer.readUInt32LE(curr)
    if (sig !== 0x02014b50) {
      return {
        valid: false,
        error: 'Malformed archive: Invalid central directory entry signature.',
        code: 'SIGNATURE_MISMATCH',
      }
    }

    const compressedSize = buffer.readUInt32LE(curr + 20)
    const uncompressedSize = buffer.readUInt32LE(curr + 24)
    const filenameLen = buffer.readUInt16LE(curr + 28)
    const extraLen = buffer.readUInt16LE(curr + 30)
    const commentLen = buffer.readUInt16LE(curr + 32)

    totalUncompressed += uncompressedSize

    // Zip bomb check
    if (uncompressedSize > compressedSize * 100 && uncompressedSize > 1024 * 1024) {
      return {
        valid: false,
        error: 'Security rejection: Compression ratio exceeds safe bounds (potential zip bomb).',
        code: 'CORRUPTED',
      }
    }

    if (totalUncompressed > 100 * 1024 * 1024) {
      return {
        valid: false,
        error: 'Security rejection: Total uncompressed archive size exceeds safety limit of 100 MB.',
        code: 'CORRUPTED',
      }
    }

    const filenameStart = curr + 46
    if (filenameStart + filenameLen > buffer.length) {
      return {
        valid: false,
        error: 'Malformed archive: Entry filename truncated.',
        code: 'CORRUPTED',
      }
    }

    const entryName = buffer.toString('utf8', filenameStart, filenameStart + filenameLen)
    if (entryName.includes('../') || entryName.includes('..\\')) {
      return {
        valid: false,
        error: 'Security rejection: Archive entry contains illegal path traversal components.',
        code: 'CORRUPTED',
      }
    }

    entries.push(entryName)
    curr += 46 + filenameLen + extraLen + commentLen
  }

  // Check required OOXML package structure
  const hasContentTypes = entries.some((name) => name.toLowerCase() === '[content_types].xml')
  if (!hasContentTypes) {
    return {
      valid: false,
      error: 'File is not a valid OpenXML package: Missing required [Content_Types].xml manifest.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  if (extension === '.xlsx') {
    const hasWorkbook = entries.some(
      (name) => name.toLowerCase() === 'xl/workbook.xml' || name.toLowerCase().startsWith('xl/')
    )
    if (!hasWorkbook) {
      return {
        valid: false,
        error: 'File is not a valid Excel (.xlsx) workbook: Missing xl/ workbook structure.',
        code: 'SIGNATURE_MISMATCH',
      }
    }
  } else if (extension === '.docx') {
    const hasDocument = entries.some(
      (name) => name.toLowerCase() === 'word/document.xml' || name.toLowerCase().startsWith('word/')
    )
    if (!hasDocument) {
      return {
        valid: false,
        error: 'File is not a valid Word (.docx) document: Missing word/ document structure.',
        code: 'SIGNATURE_MISMATCH',
      }
    }
  }

  return { valid: true }
}

/**
 * Validates PDF document structure beyond initial header.
 */
export function validatePdfStructure(
  buffer: Buffer
): { valid: true } | { valid: false; error: string; code: 'SIGNATURE_MISMATCH' | 'CORRUPTED' } {
  if (buffer.length < 128) {
    return {
      valid: false,
      error: 'Malformed PDF: File size is smaller than the minimum valid PDF structure.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    return {
      valid: false,
      error: 'Malformed PDF: Header missing %PDF- specification.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  // Must contain %%EOF near the end
  const tailSize = Math.min(buffer.length, 2048)
  const tail = buffer.subarray(buffer.length - tailSize).toString('binary')
  if (!tail.includes('%%EOF')) {
    return {
      valid: false,
      error: 'Malformed PDF: Missing standard %%EOF termination marker.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  // Must contain at least one indirect object definition (e.g. "1 0 obj" and "endobj")
  const content = buffer.toString('binary')
  const hasObj = /\d+\s+\d+\s+obj\b/.test(content)
  const hasEndObj = content.includes('endobj')
  if (!hasObj || !hasEndObj) {
    return {
      valid: false,
      error: 'Malformed PDF: Missing indirect object syntax.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  // Must contain catalog, pages dictionary, trailer or xref table
  const hasCatalogOrTrailer =
    content.includes('/Catalog') ||
    content.includes('trailer') ||
    content.includes('xref') ||
    content.includes('/Pages')
  if (!hasCatalogOrTrailer) {
    return {
      valid: false,
      error: 'Malformed PDF: Missing structural document catalog, pages dictionary, or xref table.',
      code: 'SIGNATURE_MISMATCH',
    }
  }

  return { valid: true }
}

/**
 * Computes SHA-256 cryptographic checksum of buffer.
 */
export function computeSha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Comprehensive validation of uploaded file buffer, extension, MIME type, magic bytes, and container structure.
 */
export function validateFileBuffer(
  buffer: Buffer,
  filename: string,
  declaredMimeType: string
): FileValidationResult {
  const fileSize = buffer.length

  if (fileSize === 0) {
    return {
      valid: false,
      error: 'File is empty (0 bytes).',
      code: 'CORRUPTED',
    }
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed size of 25 MB.`,
      code: 'SIZE_EXCEEDED',
    }
  }

  const ext = path.extname(filename).toLowerCase() as AllowedExtension
  if (!ALLOWED_EXTENSIONS_MAP[ext]) {
    return {
      valid: false,
      error: `File extension '${ext}' is not permitted. Only .xlsx, .docx, and .pdf are allowed.`,
      code: 'DISALLOWED_EXTENSION',
    }
  }

  const expectedMimes = ALLOWED_EXTENSIONS_MAP[ext]
  const normalizedDeclaredMime = declaredMimeType.trim().toLowerCase()
  const mimeMatches = expectedMimes.some(
    (m) => m === normalizedDeclaredMime || normalizedDeclaredMime === 'application/octet-stream'
  )

  if (!mimeMatches) {
    return {
      valid: false,
      error: `Declared MIME type '${declaredMimeType}' does not match permitted types for extension '${ext}'.`,
      code: 'MIME_MISMATCH',
    }
  }

  const signatureMatches = verifyMagicBytes(buffer, ext)
  if (!signatureMatches) {
    return {
      valid: false,
      error: `File signature does not match binary specification for '${ext}'. Potential corrupted or disguised file.`,
      code: 'SIGNATURE_MISMATCH',
    }
  }

  // Structural & Container integrity validation
  if (ext === '.xlsx' || ext === '.docx') {
    const ooxmlCheck = validateOoxmlContainer(buffer, ext)
    if (!ooxmlCheck.valid) {
      return {
        valid: false,
        error: ooxmlCheck.error,
        code: ooxmlCheck.code,
      }
    }
  } else if (ext === '.pdf') {
    const pdfCheck = validatePdfStructure(buffer)
    if (!pdfCheck.valid) {
      return {
        valid: false,
        error: pdfCheck.error,
        code: pdfCheck.code,
      }
    }
  }

  const checksum = computeSha256(buffer)

  return {
    valid: true,
    extension: ext,
    mimeType: expectedMimes[0],
    checksum,
    fileSize,
  }
}

/**
 * Default heuristic scanner for file security inspection.
 * Note: Performs targeted heuristic pattern detection (macro indicators and PDF scripts);
 * does not claim to replace enterprise host antivirus scanning.
 */
export class HeuristicSecurityScanner implements FileSecurityScanner {
  async scan(buffer: Buffer, filename: string): Promise<FileScanResult> {
    const ext = path.extname(filename).toLowerCase()

    // Check for executable or embedded macros in Office documents (VBA project binary)
    if ((ext === '.xlsx' || ext === '.docx') && buffer.includes(Buffer.from('vbaProject.bin'))) {
      return {
        isClean: false,
        threatName: 'MacroEnabledOfficeDocument (vbaProject.bin detected)',
        scannerName: 'HeuristicSecurityScanner',
        scannedAt: new Date(),
      }
    }

    // Check for suspicious JavaScript actions embedded in PDF
    if (ext === '.pdf' && (buffer.includes(Buffer.from('/JavaScript')) || buffer.includes(Buffer.from('/JS')))) {
      return {
        isClean: false,
        threatName: 'PdfEmbeddedJavaScript (active scripts detected in PDF)',
        scannerName: 'HeuristicSecurityScanner',
        scannedAt: new Date(),
      }
    }

    return {
      isClean: true,
      scannerName: 'HeuristicSecurityScanner',
      scannedAt: new Date(),
    }
  }
}
