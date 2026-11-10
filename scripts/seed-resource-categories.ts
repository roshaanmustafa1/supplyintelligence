import { prisma } from '../lib/db'

export async function seedResourceCategories() {
  const count = await prisma.resourceCategory.count()
  if (count === 0) {
    const categories = [
      {
        name: 'Procurement Strategy & Sourcing',
        slug: 'procurement-strategy',
        description: 'Diagnostic matrices, category management templates, and strategic intake rubrics.',
        displayOrder: 1,
      },
      {
        name: 'Supplier Risk & Compliance',
        slug: 'supplier-risk-compliance',
        description: 'Multi-tier supplier scorecards, ESG compliance checklists, and risk matrices.',
        displayOrder: 2,
      },
      {
        name: 'Logistics & Freight Operations',
        slug: 'logistics-freight',
        description: 'Freight corridor calculators, carrier SLA scorecards, and customs clearance trackers.',
        displayOrder: 3,
      },
      {
        name: 'Inventory & Working Capital',
        slug: 'inventory-working-capital',
        description: 'Safety stock formulas, ABC cycle count models, and EOQ optimization sheets.',
        displayOrder: 4,
      },
      {
        name: 'Digital Transformation & AI',
        slug: 'digital-transformation-ai',
        description: 'Enterprise AI roadmaps, prompt library templates, and automation feasibility scorecards.',
        displayOrder: 5,
      },
    ]

    for (const cat of categories) {
      await prisma.resourceCategory.create({ data: cat })
    }
    console.log(`Successfully seeded ${categories.length} default resource categories.`)
  } else {
    console.log(`Resource categories already configured (${count} found).`)
  }
}

if (process.argv[1]?.includes('seed-resource-categories')) {
  seedResourceCategories()
    .catch((err) => {
      console.error('Failed seeding categories:', err)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}

