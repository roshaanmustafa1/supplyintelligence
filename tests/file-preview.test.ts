import test from "node:test"
import assert from "node:assert/strict"
import ExcelJS from "exceljs"
import { PREVIEW_LIMITS, previewDocx, previewXlsx } from "../lib/file-preview"
import {
  buildGenuineDocx,
  buildGenuineXlsx,
} from "../lib/storage/ooxml-builder"

test("Preview Phase 2: DOCX is converted to sanitized read-only HTML", async () => {
  const preview = await previewDocx(
    buildGenuineDocx("Standard Operating Procedure", "Governance guidelines")
  )
  assert.equal(preview.kind, "docx")
  assert.match(preview.html, /Governance guidelines/)
  assert.equal(preview.truncated, false)
  assert.doesNotMatch(preview.html, /<script|<img|<a |onerror|style=/i)
})

test("Preview Phase 2: XLSX cached values are read into plain text rows", async () => {
  const preview = await previewXlsx(
    buildGenuineXlsx("Scorecard", "Supplier Score: 94.2")
  )
  assert.equal(preview.kind, "xlsx")
  assert.equal(preview.sheets[0].name, "Scorecard")
  assert.ok(
    preview.sheets[0].rows.flat().includes("Supplier Score: 94.2"),
    "cell text must appear in the preview"
  )
})

test("Preview Phase 2: XLSX output is bounded by sheet, row and column limits", async () => {
  const workbook = new ExcelJS.Workbook()
  for (let s = 1; s <= PREVIEW_LIMITS.maxSheets + 2; s++) {
    const sheet = workbook.addWorksheet(`S${s}`)
    if (s === 1) {
      for (let r = 1; r <= PREVIEW_LIMITS.maxRows + 50; r++) {
        sheet.addRow(
          Array.from({ length: PREVIEW_LIMITS.maxCols + 10 }, (_, c) =>
            c === 0
              ? "x".repeat(PREVIEW_LIMITS.maxCellChars + 100)
              : `${r}-${c}`
          )
        )
      }
    } else {
      sheet.addRow(["a"])
    }
  }
  const buffer = Buffer.from(await workbook.xlsx.writeBuffer())

  const preview = await previewXlsx(buffer)
  assert.equal(preview.sheets.length, PREVIEW_LIMITS.maxSheets)
  assert.equal(preview.totalSheets, PREVIEW_LIMITS.maxSheets + 2)
  assert.equal(preview.truncated, true)

  const first = preview.sheets[0]
  assert.equal(first.rows.length, PREVIEW_LIMITS.maxRows)
  assert.equal(first.rows[0].length, PREVIEW_LIMITS.maxCols)
  assert.equal(first.truncated, true)
  assert.ok(first.rows[0][0].length <= PREVIEW_LIMITS.maxCellChars + 1)
})

test("Preview Phase 2: XLSX formulas show the cached result and are never evaluated", async () => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet("Calc")
  sheet.getCell("A1").value = { formula: "1+1", result: 42 }
  const buffer = Buffer.from(await workbook.xlsx.writeBuffer())

  const preview = await previewXlsx(buffer)
  assert.equal(preview.sheets[0].rows[0][0], "42")
})

test("Preview Phase 2: XLSX with sheet names over 31 characters still previews", async () => {
  const longName = "Strategic Sourcing 7-Step Maturity Matrix"
  const preview = await previewXlsx(buildGenuineXlsx(longName, "Level 3"))
  assert.equal(preview.sheets[0].name, longName.slice(0, 31))
  assert.ok(preview.sheets[0].rows.flat().includes("Level 3"))
})

test("Preview Phase 2: corrupted files reject instead of returning content", async () => {
  const junk = Buffer.from("not an office document")
  await assert.rejects(() => previewDocx(junk))
  await assert.rejects(() => previewXlsx(junk))
})
