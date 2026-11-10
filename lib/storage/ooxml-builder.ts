import zlib from 'node:zlib'

export interface ZipEntryInput {
  name: string
  content: Buffer | string
}

/**
 * Builds a standard, 100% structurally valid ZIP 2.0 archive in pure Node.js.
 */
export function buildZipArchive(entries: ZipEntryInput[]): Buffer {
  const localHeaders: Buffer[] = []
  const centralHeaders: Buffer[] = []
  let offset = 0

  for (const entry of entries) {
    const rawData = Buffer.isBuffer(entry.content) ? entry.content : Buffer.from(entry.content, 'utf8')
    const filenameBuf = Buffer.from(entry.name, 'utf8')
    const crc = zlib.crc32(rawData)
    const compressed = zlib.deflateRawSync(rawData)

    // Local file header: 30 bytes + filename + data
    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0) // PK\x03\x04
    localHeader.writeUInt16LE(20, 4)         // Version needed (2.0)
    localHeader.writeUInt16LE(0, 6)          // Flags
    localHeader.writeUInt16LE(8, 8)          // Compression: Deflate
    localHeader.writeUInt16LE(0, 10)         // Mod time
    localHeader.writeUInt16LE(0, 12)         // Mod date
    localHeader.writeUInt32LE(crc, 14)       // CRC-32
    localHeader.writeUInt32LE(compressed.length, 18) // Compressed size
    localHeader.writeUInt32LE(rawData.length, 22)    // Uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26) // Filename length
    localHeader.writeUInt16LE(0, 28)         // Extra field length

    const localRecord = Buffer.concat([localHeader, filenameBuf, compressed])
    localHeaders.push(localRecord)

    // Central directory header: 46 bytes + filename
    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0) // PK\x01\x02
    centralHeader.writeUInt16LE(20, 4)         // Version made by
    centralHeader.writeUInt16LE(20, 6)         // Version needed
    centralHeader.writeUInt16LE(0, 8)          // Flags
    centralHeader.writeUInt16LE(8, 10)         // Compression: Deflate
    centralHeader.writeUInt16LE(0, 12)         // Mod time
    centralHeader.writeUInt16LE(0, 14)         // Mod date
    centralHeader.writeUInt32LE(crc, 16)       // CRC-32
    centralHeader.writeUInt32LE(compressed.length, 20) // Compressed size
    centralHeader.writeUInt32LE(rawData.length, 24)    // Uncompressed size
    centralHeader.writeUInt16LE(filenameBuf.length, 28) // Filename length
    centralHeader.writeUInt16LE(0, 30)         // Extra field length
    centralHeader.writeUInt16LE(0, 32)         // Comment length
    centralHeader.writeUInt16LE(0, 34)         // Disk number start
    centralHeader.writeUInt16LE(0, 36)         // Internal attrs
    centralHeader.writeUInt32LE(0, 38)         // External attrs
    centralHeader.writeUInt32LE(offset, 42)    // Relative offset of local header

    const centralRecord = Buffer.concat([centralHeader, filenameBuf])
    centralHeaders.push(centralRecord)

    offset += localRecord.length
  }

  const centralDirectoryBuffer = Buffer.concat(centralHeaders)
  const cdOffset = offset
  const cdSize = centralDirectoryBuffer.length

  // End of Central Directory record (22 bytes)
  const eocd = Buffer.alloc(22)
  eocd.writeUInt32LE(0x06054b50, 0)           // PK\x05\x06
  eocd.writeUInt16LE(0, 4)                    // Disk number
  eocd.writeUInt16LE(0, 6)                    // Start disk
  eocd.writeUInt16LE(entries.length, 8)       // Entries on this disk
  eocd.writeUInt16LE(entries.length, 10)      // Total entries
  eocd.writeUInt32LE(cdSize, 12)              // Size of central directory
  eocd.writeUInt32LE(cdOffset, 16)            // Offset of central directory
  eocd.writeUInt16LE(0, 20)                   // Comment length

  return Buffer.concat([...localHeaders, centralDirectoryBuffer, eocd])
}

/**
 * Builds a valid, genuine minimal Excel (.xlsx) OpenXML workbook.
 */
export function buildGenuineXlsx(sheetName = 'Sheet1', cellValue = 'SupplyIntelligence Operational Model'): Buffer {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${sheetName}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`

  const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    <row r="1">
      <c r="A1" t="inlineStr">
        <is><t>${cellValue}</t></is>
      </c>
    </row>
  </sheetData>
</worksheet>`

  return buildZipArchive([
    { name: '[Content_Types].xml', content: contentTypes },
    { name: '_rels/.rels', content: rootRels },
    { name: 'xl/workbook.xml', content: workbook },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRels },
    { name: 'xl/worksheets/sheet1.xml', content: worksheet },
  ])
}

/**
 * Builds a valid, genuine minimal Word (.docx) OpenXML document.
 */
export function buildGenuineDocx(title = 'SupplyIntelligence Operational Framework', bodyText = 'Practitioner framework and governance documentation.'): Buffer {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r><w:t>${title}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>${bodyText}</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`

  return buildZipArchive([
    { name: '[Content_Types].xml', content: contentTypes },
    { name: '_rels/.rels', content: rootRels },
    { name: 'word/document.xml', content: document },
  ])
}

/**
 * Builds a valid, genuine minimal PDF document with proper xref table and catalog dictionary.
 */
export function buildGenuinePdf(title = 'SupplyIntelligence Blueprint', contentText = 'Verified Supply Chain Architecture Blueprint'): Buffer {
  const bodyTextEscaped = contentText.replace(/[()\\]/g, '')
  const titleEscaped = title.replace(/[()\\]/g, '')

  let pdf = `%PDF-1.4\n%âãÏÓ\n`
  const offsets: number[] = []

  // Object 1: Catalog
  offsets.push(Buffer.byteLength(pdf, 'utf8'))
  pdf += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`

  // Object 2: Pages
  offsets.push(Buffer.byteLength(pdf, 'utf8'))
  pdf += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`

  // Object 3: Page
  offsets.push(Buffer.byteLength(pdf, 'utf8'))
  pdf += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`

  // Object 4: Content Stream
  const streamData = `BT\n/F1 18 Tf\n50 720 Td\n(${titleEscaped}) Tj\n/F1 12 Tf\n0 -30 Td\n(${bodyTextEscaped}) Tj\nET`
  offsets.push(Buffer.byteLength(pdf, 'utf8'))
  pdf += `4 0 obj\n<< /Length ${Buffer.byteLength(streamData, 'utf8')} >>\nstream\n${streamData}\nendstream\nendobj\n`

  // Object 5: Font
  offsets.push(Buffer.byteLength(pdf, 'utf8'))
  pdf += `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`

  // Xref table
  const startXref = Buffer.byteLength(pdf, 'utf8')
  pdf += `xref\n0 6\n`
  pdf += `0000000000 65535 f \n`
  for (const off of offsets) {
    pdf += `${off.toString().padStart(10, '0')} 00000 n \n`
  }

  // Trailer
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\n`
  pdf += `startxref\n${startXref}\n%%EOF\n`

  return Buffer.from(pdf, 'utf8')
}

