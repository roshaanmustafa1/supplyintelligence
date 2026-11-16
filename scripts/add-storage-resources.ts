/**
 * Registers the files in storage/resources as published Artifacts & Templates.
 * One resource per file (so each format is listed, filterable and downloadable).
 * Idempotent: files already registered by storageKey are skipped.
 *
 * Usage: npx tsx scripts/add-storage-resources.ts [--dry]
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../lib/db'
import {
  createResource,
  attachFileToResource,
  transitionPublicationStatus,
} from '../lib/services/resource.service'

type ResourceType = 'TEMPLATE' | 'ARTIFACT'

interface Document {
  /** Filename without extension. */
  base: string
  title: string
  summary: string
  categorySlug: string
  resourceType: ResourceType
}

const documents: Document[] = [
  { base: '01_Purchase_Requisition_PR_Blank', title: 'Purchase Requisition (PR)', summary: 'blank purchase requisition form', categorySlug: 'procurement-strategy', resourceType: 'TEMPLATE' },
  { base: '02_Request_For_Quotation_RFQ_Blank', title: 'Request for Quotation (RFQ)', summary: 'blank request for quotation form', categorySlug: 'procurement-strategy', resourceType: 'TEMPLATE' },
  { base: '03_Bid_Comparison_Statement_CS_Blank', title: 'Bid Comparison Statement (CS)', summary: 'blank bid comparison statement', categorySlug: 'procurement-strategy', resourceType: 'TEMPLATE' },
  { base: '04_Purchase_Order_PO_Blank', title: 'Purchase Order (PO)', summary: 'blank purchase order form', categorySlug: 'procurement-strategy', resourceType: 'TEMPLATE' },
  { base: '05_Delivery_Note_Packing_List_Blank', title: 'Delivery Note & Packing List', summary: 'blank delivery note and packing list', categorySlug: 'logistics-freight', resourceType: 'TEMPLATE' },
  { base: '05_Goods_Receipt_Note_GRN_Blank', title: 'Goods Receipt Note (GRN)', summary: 'blank goods receipt note', categorySlug: 'inventory-working-capital', resourceType: 'TEMPLATE' },
  { base: '05_Warehouse_Picking_List_Blank', title: 'Warehouse Picking List', summary: 'blank warehouse picking list', categorySlug: 'inventory-working-capital', resourceType: 'TEMPLATE' },
  { base: '06_Service_Entry_Sheet_SES_Blank', title: 'Service Entry Sheet (SES)', summary: 'blank service entry sheet', categorySlug: 'procurement-strategy', resourceType: 'TEMPLATE' },
  { base: '07_Vendor_Onboarding_PQQ_Blank', title: 'Vendor Onboarding (PQQ)', summary: 'blank vendor onboarding pre-qualification questionnaire', categorySlug: 'supplier-risk-compliance', resourceType: 'TEMPLATE' },
  { base: '08_Non_Conformance_Report_NCR_SCAR_Blank', title: 'Non-Conformance Report (NCR / SCAR)', summary: 'blank non-conformance report and supplier corrective action request', categorySlug: 'supplier-risk-compliance', resourceType: 'TEMPLATE' },
  { base: '09_Logistics_Trip_Delivery_Tracker_Blank', title: 'Logistics Trip & Delivery Tracker', summary: 'blank logistics trip and delivery tracker', categorySlug: 'logistics-freight', resourceType: 'TEMPLATE' },
  { base: '10_Material_Expediting_Customs_Report_Blank', title: 'Material Expediting & Customs Report', summary: 'blank material expediting and customs report', categorySlug: 'logistics-freight', resourceType: 'TEMPLATE' },
  { base: '11_Procurement_Spend_Savings_Report_Blank', title: 'Procurement Spend & Savings Report', summary: 'blank procurement spend and savings report', categorySlug: 'procurement-strategy', resourceType: 'TEMPLATE' },
  { base: '12_Supplier_Performance_KPI_Scorecard_Blank', title: 'Supplier Performance KPI Scorecard', summary: 'blank supplier performance KPI scorecard', categorySlug: 'supplier-risk-compliance', resourceType: 'TEMPLATE' },
  { base: '13_Supply_Chain_Master_KPI_Scorecard', title: 'Supply Chain Master KPI Scorecard', summary: 'supply chain master KPI scorecard workbook', categorySlug: 'procurement-strategy', resourceType: 'ARTIFACT' },
  { base: '14_Supply_Chain_Risk_Control_Suite', title: 'Supply Chain Risk Control Suite', summary: 'supply chain risk control workbook', categorySlug: 'supplier-risk-compliance', resourceType: 'ARTIFACT' },
]

const formats = {
  xlsx: { label: 'Excel', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  docx: { label: 'Word', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  pdf: { label: 'PDF', mime: 'application/pdf' },
} as const

type Format = keyof typeof formats

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const dry = process.argv.includes('--dry')
  const dir = path.join(process.cwd(), 'storage', 'resources')

  const author = await prisma.user.findFirst({ where: { isActive: true }, select: { id: true } })
  const categories = await prisma.resourceCategory.findMany({ select: { id: true, slug: true } })
  const categoryIds = new Map(categories.map((c) => [c.slug, c.id]))

  let created = 0
  let skipped = 0

  for (const doc of documents) {
    for (const format of Object.keys(formats) as Format[]) {
      const filename = `${doc.base}.${format}`
      const filePath = path.join(dir, filename)
      if (!fs.existsSync(filePath)) continue

      const existing = await prisma.resourceFile.findUnique({ where: { storageKey: filename } })
      if (existing) {
        skipped++
        continue
      }

      const { label, mime } = formats[format]
      const title = `${doc.title} (${label})`
      const slug = slugify(`${doc.base}-${format}`.replace(/^\d+-?/, ''))
      const categoryId = categoryIds.get(doc.categorySlug)
      if (!categoryId) throw new Error(`Missing category "${doc.categorySlug}"`)

      if (dry) {
        console.log(`[dry] ${doc.resourceType} | ${doc.categorySlug} | ${slug} | ${title}`)
        created++
        continue
      }

      const buffer = fs.readFileSync(filePath)
      const checksum = crypto.createHash('sha256').update(buffer).digest('hex')

      const resource = await createResource({
        title,
        slug,
        description: `${doc.title}: ${doc.summary}, available as a ${label} file.`,
        resourceType: doc.resourceType,
        status: 'DRAFT',
        authorId: author?.id,
        categoryIds: [categoryId],
      })
      if (!resource) throw new Error(`Failed to create resource "${title}"`)

      await attachFileToResource(resource.id, {
        originalFilename: filename,
        storageKey: filename,
        mimeType: mime,
        fileSize: buffer.length,
        checksum,
        isPrimary: true,
      })
      await transitionPublicationStatus(resource.id, 'REVIEW', author?.id)
      await transitionPublicationStatus(resource.id, 'PUBLISHED', author?.id)
      created++
      console.log(`Published: ${title} (${slug})`)
    }
  }

  console.log(`${dry ? 'Would create' : 'Created'} ${created}, already registered ${skipped}.`)
}

main()
  .catch((err) => {
    console.error('Failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
