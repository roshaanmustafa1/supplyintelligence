import mammoth from "mammoth"
import ExcelJS from "exceljs"
import sanitizeHtml from "sanitize-html"

/** Hard limits keep previews cheap and bounded regardless of file content. */
export const PREVIEW_LIMITS = {
  maxSheets: 5,
  maxRows: 100,
  maxCols: 20,
  maxCellChars: 500,
  maxHtmlChars: 300_000,
} as const

export interface DocxPreview {
  kind: "docx"
  html: string
  truncated: boolean
}

export interface XlsxSheetPreview {
  name: string
  rows: string[][]
  totalRows: number
  totalCols: number
  truncated: boolean
}

export interface XlsxPreview {
  kind: "xlsx"
  sheets: XlsxSheetPreview[]
  totalSheets: number
  truncated: boolean
}

export type FilePreview = DocxPreview | XlsxPreview

function sanitizePreviewHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "sub",
      "sup",
      "blockquote",
      "ul",
      "ol",
      "li",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "caption",
    ],
    allowedAttributes: {
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    // Links and images are dropped: a preview must never navigate or load remote/embedded content.
    disallowedTagsMode: "discard",
    allowedSchemes: [],
    allowProtocolRelative: false,
  })
}

/** Converts a DOCX buffer into sanitized, read-only HTML (images and links removed). */
export async function previewDocx(buffer: Buffer): Promise<DocxPreview> {
  const result = await mammoth.convertToHtml({ buffer })
  let html = sanitizePreviewHtml(result.value)
  let truncated = false
  if (html.length > PREVIEW_LIMITS.maxHtmlChars) {
    // Cut at the last closing block tag so the markup stays balanced enough for sanitize to repair.
    const cut = html.lastIndexOf("</p>", PREVIEW_LIMITS.maxHtmlChars)
    html = sanitizePreviewHtml(
      html.slice(0, cut > 0 ? cut + 4 : PREVIEW_LIMITS.maxHtmlChars)
    )
    truncated = true
  }
  return { kind: "docx", html, truncated }
}

function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return ""
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "object") {
    // Formulas: show the cached result only; formulas are never evaluated.
    if ("result" in value && value.result !== undefined) {
      return cellToString(value.result as ExcelJS.CellValue)
    }
    if ("richText" in value) return value.richText.map((r) => r.text).join("")
    if ("text" in value && typeof value.text === "string") return value.text
    if ("error" in value) return String(value.error)
    return ""
  }
  return String(value)
}

function clip(text: string): string {
  return text.length > PREVIEW_LIMITS.maxCellChars
    ? `${text.slice(0, PREVIEW_LIMITS.maxCellChars)}…`
    : text
}

let longSheetNamesPatched = false

/**
 * ExcelJS (4.4) fails to load workbooks whose sheet names exceed Excel's 31-char limit:
 * it truncates the name in the constructor, then assigns the full name again and rejects
 * it as a duplicate of itself. Some uploaded files (including our seeded artifacts) have
 * such names, so truncate before ExcelJS compares. Idempotent and preview-only.
 */
function allowLongSheetNames(): void {
  if (longSheetNamesPatched) return
  longSheetNamesPatched = true
  const proto = Object.getPrototypeOf(
    new ExcelJS.Workbook().addWorksheet("probe")
  )
  const descriptor = Object.getOwnPropertyDescriptor(proto, "name")
  const originalSet = descriptor?.set
  if (!descriptor || !originalSet) return
  Object.defineProperty(proto, "name", {
    ...descriptor,
    set(this: unknown, name: unknown) {
      originalSet.call(
        this,
        typeof name === "string" ? name.slice(0, 31) : name
      )
    },
  })
}

/** Reads cached cell values from an XLSX buffer into bounded plain-text rows. */
export async function previewXlsx(buffer: Buffer): Promise<XlsxPreview> {
  allowLongSheetNames()
  const workbook = new ExcelJS.Workbook()
  // ExcelJS typings predate Node's Buffer<ArrayBufferLike>; the runtime value is identical.
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer)

  const sheets: XlsxSheetPreview[] = []
  let truncated = workbook.worksheets.length > PREVIEW_LIMITS.maxSheets

  for (const sheet of workbook.worksheets.slice(0, PREVIEW_LIMITS.maxSheets)) {
    const totalRows = sheet.actualRowCount
    const totalCols = sheet.actualColumnCount
    const rowCount = Math.min(sheet.rowCount, PREVIEW_LIMITS.maxRows)
    const colCount = Math.min(totalCols, PREVIEW_LIMITS.maxCols)

    const rows: string[][] = []
    for (let r = 1; r <= rowCount; r++) {
      const row = sheet.getRow(r)
      const cells: string[] = []
      for (let c = 1; c <= colCount; c++) {
        cells.push(clip(cellToString(row.getCell(c).value)))
      }
      rows.push(cells)
    }

    const sheetTruncated =
      sheet.rowCount > PREVIEW_LIMITS.maxRows ||
      totalCols > PREVIEW_LIMITS.maxCols
    truncated ||= sheetTruncated
    sheets.push({
      name: sheet.name,
      rows,
      totalRows,
      totalCols,
      truncated: sheetTruncated,
    })
  }

  return {
    kind: "xlsx",
    sheets,
    totalSheets: workbook.worksheets.length,
    truncated,
  }
}
