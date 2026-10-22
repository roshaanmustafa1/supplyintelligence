/**
 * Database seed script for SupplyIntelligence.
 *
 * Seeds:
 * 1. Default categories
 * 2. Default super admin user
 * 3. Existing 6 static articles (preserving original slugs and content)
 *
 * Run with: npx prisma db seed
 * Or:        npx tsx prisma/seed.ts
 *
 * SAFETY: Uses upsert operations — safe to run multiple times without
 * creating duplicates. Existing records are updated only if fields match.
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─── Default Categories ────────────────────────────────────────────
const defaultCategories = [
  { name: 'Supply Chain Management', slug: 'supply-chain-management', description: 'End-to-end supply chain strategy, optimization, and management insights.' },
  { name: 'Logistics & Transportation', slug: 'logistics', description: 'Freight, shipping, carriers, warehousing, and last-mile delivery.' },
  { name: 'Procurement', slug: 'procurement', description: 'Strategic sourcing, supplier management, and purchasing excellence.' },
  { name: 'Warehousing', slug: 'warehousing', description: 'Warehouse operations, automation, and fulfilment centre design.' },
  { name: 'Inventory Management', slug: 'inventory-management', description: 'Inventory optimization, demand planning, and safety stock strategies.' },
  { name: 'Supply Chain Technology', slug: 'supply-chain-technology', description: 'TMS, WMS, ERP integrations, and operational software.' },
  { name: 'Artificial Intelligence', slug: 'ai-digital-transformation', description: 'AI, machine learning, and digital transformation in supply chain.' },
  { name: 'Global Trade', slug: 'global-trade', description: 'International trade, customs, regulations, and cross-border logistics.' },
  { name: 'Manufacturing', slug: 'manufacturing', description: 'Production, factory operations, lean manufacturing, and Industry 4.0.' },
  { name: 'Sustainability', slug: 'sustainability', description: 'Green supply chains, ESG, carbon reduction, and circular economy.' },
  { name: 'Risk Management', slug: 'risk-management', description: 'Supply chain risk, resilience, disruption response, and business continuity.' },
  { name: 'Industry News', slug: 'industry-news', description: 'Breaking news, market developments, and current events in supply chain.' },
  { name: 'Supply Chain Analytics', slug: 'supply-chain-analytics', description: 'Data analytics, KPIs, dashboards, and performance measurement.' },
  { name: 'Supply Chain', slug: 'supply-chain', description: 'General supply chain topics and cross-functional insights.' },
  { name: 'Project Delivery', slug: 'project-delivery', description: 'Capital project governance, EPC contracting, and project procurement.' },
]

// ─── Existing Articles (preserving all original slugs and content) ─
const existingArticles = [
  {
    slug: 'connecting-supply-chain-workflows-measurable-results',
    title: 'From Process to Performance: Connecting Supply Chain Workflows to Measurable Results',
    excerpt: "A well-defined workflow shows how work moves. Measuring the right KPIs helps you find what's working, where it's not, and what to improve.",
    categorySlug: 'procurement',
    status: 'PUBLISHED',
    contentType: 'ANALYSIS',
    primaryKeyword: 'supply chain workflows',
    seoTitle: 'From Process to Performance: Connecting Supply Chain Workflows | Supply Intelligence',
    seoDescription: 'Discover how enterprise procurement teams translate structured workflow design into tangible cost reductions, cycle time improvements, and operational resilience.',
    featuredImage: '/images/procurement-workflows.jpg',
    featuredImageAlt: 'Corporate executive analytics display showing procurement process workflows and performance KPIs',
    readingTimeMinutes: 8,
    publishedAt: new Date('2025-04-28'),
    tags: ['Procurement', 'Workflows', 'KPIs', 'Performance Metrics', 'Operations'],
    authorEmail: 'admin@supplyintelligence.com',
    bodyHtml: `<h2>The Disconnect Between Mapping and Measurement</h2>
<p>Enterprise procurement and supply chain leaders routinely invest hundreds of hours drafting immaculate business process maps. Yet on the operating floor, a persistent paradox emerges: organizations possess meticulous process maps, but remain unable to answer basic performance questions in real time.</p>
<blockquote><p>A process map is merely a statement of intent. Performance measurement is the empirical test of reality.</p></blockquote>
<h2>Establishing the Core Hierarchy of Procurement Metrics</h2>
<p>To bridge this chasm, high-performing procurement teams construct a unified measurement framework that binds day-to-day execution directly to boardroom financial metrics.</p>
<ul><li>Requisition-to-PO Cycle Time</li><li>Approval Touchpoints per Order</li><li>First-Time-Right Invoice Rate</li><li>Working Capital Days Payable Outstanding (DPO) Variance</li></ul>`,
  },
  {
    slug: 'the-power-of-flow-designing-supply-chain-workflows',
    title: 'The Power of Flow: Designing Supply Chain Workflows for Better Process Understanding & Execution',
    excerpt: 'A well-designed workflow brings clarity, reduces friction and helps teams move from reactive firefighting to proactive planning.',
    categorySlug: 'supply-chain',
    status: 'PUBLISHED',
    contentType: 'ANALYSIS',
    primaryKeyword: 'supply chain workflow design',
    seoTitle: 'The Power of Flow: Designing Supply Chain Workflows | Supply Intelligence',
    seoDescription: 'Discover how principled workflow architecture eliminates operational friction and shifts supply chain management from reactive triage to resilient, proactive orchestration.',
    featuredImage: '/images/supply-chain-flow.jpg',
    featuredImageAlt: 'High-angle editorial photograph of modern automated distribution hub and intelligent conveyor sorting lines',
    readingTimeMinutes: 7,
    publishedAt: new Date('2025-04-22'),
    tags: ['Supply Chain', 'Process Flow', 'Logistics Operations', 'Warehouse Systems', 'Resilience'],
    authorEmail: 'admin@supplyintelligence.com',
    bodyHtml: `<h2>Why Operational Flow Matters More Than Speed</h2>
<p>In modern logistics and distribution networks, veteran supply chain architects understand that raw velocity without rhythmic flow is an invitation to systemic chaos.</p>
<blockquote><p>Velocity creates headlines; flow creates profitability and operational sanity.</p></blockquote>
<h2>The Three Antagonists of Seamless Flow</h2>
<ul><li>Information Asymmetry</li><li>Unsynchronized Batch Sizes</li><li>Fragmented Systems of Record</li></ul>`,
  },
  {
    slug: 'ai-in-procurement-practical-applications-real-value',
    title: 'AI in Procurement: Practical Applications That Deliver Real Value',
    excerpt: 'From supplier risk analysis to contract intelligence, AI is helping procurement teams work smarter, faster and with greater confidence.',
    categorySlug: 'ai-digital-transformation',
    status: 'PUBLISHED',
    contentType: 'ANALYSIS',
    primaryKeyword: 'AI in procurement',
    seoTitle: 'AI in Procurement: Practical Applications That Deliver Real Value | Supply Intelligence',
    seoDescription: 'Cut through enterprise AI hype to explore proven, high-ROI use cases in procurement, including contract intelligence, autonomous intake, and predictive supplier risk.',
    featuredImage: '/images/ai-procurement-analytics.jpg',
    featuredImageAlt: 'Data science and procurement team analyzing AI neural network diagrams and predictive procurement dashboards',
    readingTimeMinutes: 6,
    publishedAt: new Date('2025-04-15'),
    tags: ['Artificial Intelligence', 'Procurement Tech', 'Machine Learning', 'Contract Analytics', 'Digital Transformation'],
    authorEmail: 'admin@supplyintelligence.com',
    bodyHtml: `<h2>Moving Beyond the Hype: The Pragmatic AI Landscape</h2>
<p>Enterprise artificial intelligence in 2025 has reached an inflection point. Chief Procurement Officers no longer ask what AI could theoretically do; they demand concrete evidence of EBITDA impact.</p>
<blockquote><p>AI will not replace procurement executives, but procurement executives leveraging AI will systematically replace those who do not.</p></blockquote>`,
  },
  {
    slug: 'resilient-freight-corridors-global-bottlenecks',
    title: 'Resilient Freight Corridors: Mitigating Global Bottlenecks in Modern Shipping',
    excerpt: 'Analyzing multi-modal freight routes, container availability, and real-time carrier intelligence to insulate maritime supply lines from disruption.',
    categorySlug: 'logistics',
    status: 'PUBLISHED',
    contentType: 'ANALYSIS',
    primaryKeyword: 'freight corridors',
    seoTitle: 'Resilient Freight Corridors: Mitigating Global Shipping Bottlenecks | Supply Intelligence',
    seoDescription: 'Explore strategic frameworks for navigating maritime chokepoints, container repositioning imbalances, and multi-modal freight optimization.',
    featuredImage: '/images/logistics-freight-corridors.jpg',
    featuredImageAlt: 'Multi-modal freight terminal with intermodal railway trains and international shipping containers under morning sun',
    readingTimeMinutes: 9,
    publishedAt: new Date('2025-04-10'),
    tags: ['Logistics', 'Maritime', 'Freight Corridors', 'Shipping Ports', 'Global Trade'],
    authorEmail: 'admin@supplyintelligence.com',
    bodyHtml: `<h2>The Fragility of Concentrated Maritime Chokepoints</h2>
<p>Global commerce relies disproportionately on a handful of narrow geographical transit passages. Successive disruptions across the Suez Canal and Panama Canal have demonstrated the catastrophic cascading consequences.</p>`,
  },
  {
    slug: 'derisking-capital-projects-governance-procurement',
    title: 'De-risking Capital Projects: Governance, Procurement, and Lifecycle Execution',
    excerpt: 'How enterprise owners and EPC contractors leverage milestone-driven procurement controls to safeguard schedules and capital deployment.',
    categorySlug: 'project-delivery',
    status: 'PUBLISHED',
    contentType: 'ANALYSIS',
    primaryKeyword: 'capital project procurement',
    seoTitle: 'De-risking Capital Projects: Governance, Procurement & Execution | Supply Intelligence',
    seoDescription: 'A deep dive into capital expenditure governance, early equipment vendor involvement, and milestone-linked payment schedules for major infrastructure.',
    featuredImage: '/images/project-delivery-infrastructure.jpg',
    featuredImageAlt: 'Project directors and civil procurement engineers reviewing blueprints and digital project milestones on tablet',
    readingTimeMinutes: 10,
    publishedAt: new Date('2025-04-04'),
    tags: ['Project Delivery', 'Capital Projects', 'EPC Governance', 'Infrastructure', 'Risk Management'],
    authorEmail: 'admin@supplyintelligence.com',
    bodyHtml: `<h2>The Capital Project Conundrum</h2>
<p>Major capital projects remain notoriously susceptible to catastrophic schedule slip and cost escalation. Over 70% of mega-projects exceed initial capital expenditure budgets by more than 25%.</p>`,
  },
  {
    slug: 'autonomous-supply-chain-bridging-legacy-erps',
    title: 'The Autonomous Supply Chain: Bridging Legacy ERPs with Real-Time Visibility',
    excerpt: 'Why end-to-end data interoperability remains the missing link between predictive planning and autonomous warehouse fulfillment.',
    categorySlug: 'supply-chain',
    status: 'PUBLISHED',
    contentType: 'TECHNOLOGY',
    primaryKeyword: 'autonomous supply chain ERP',
    seoTitle: 'The Autonomous Supply Chain: Bridging Legacy ERPs | Supply Intelligence',
    seoDescription: 'Explore how progressive logistics organizations connect 20-year-old enterprise ERPs to real-time IoT feeds and autonomous fulfillment platforms.',
    featuredImage: '/images/hero-container-ship.jpg',
    featuredImageAlt: 'Modern container ship arriving at automated port with bright terminal cranes and logistics infrastructure',
    readingTimeMinutes: 7,
    publishedAt: new Date('2025-03-28'),
    tags: ['Supply Chain', 'ERP Integration', 'Automation', 'Enterprise Tech', 'Digital Architecture'],
    authorEmail: 'admin@supplyintelligence.com',
    bodyHtml: `<h2>The Enterprise Reality: Decades of Technical Debt</h2>
<p>Visionary whitepapers speak glowingly of autonomous supply chains, yet the reality inside most Global 2000 corporations is far messier: multiple disparate ERP instances acquired through decades of mergers and acquisitions.</p>`,
  },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // ── 1. Seed categories ──────────────────────────────────────────
  console.log('\n📂 Seeding categories...')
  const categoryMap = new Map<string, string>() // slug → id

  for (const cat of defaultCategories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    })
    categoryMap.set(cat.slug, created.id)
    console.log(`  ✓ ${cat.name}`)
  }

  // ── 2. Seed super admin user ────────────────────────────────────
  console.log('\n👤 Seeding admin user...')
  const adminPasswordHash = await bcrypt.hash('SupplyAdmin2025!', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@supplyintelligence.com' },
    update: {},
    create: {
      email: 'admin@supplyintelligence.com',
      name: 'Supply Intelligence Admin',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })
  console.log(`  ✓ admin@supplyintelligence.com (SUPER_ADMIN)`)
  console.log(`  ℹ Default password: SupplyAdmin2025! — change immediately after first login`)

  // ── 3. Seed existing articles ───────────────────────────────────
  console.log('\n📄 Seeding articles...')

  for (const articleData of existingArticles) {
    const categoryId = categoryMap.get(articleData.categorySlug)

    // Create or ensure tags exist
    const tagIds: string[] = []
    for (const tagName of articleData.tags) {
      const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      })
      tagIds.push(tag.id)
    }

    const { tags: _, categorySlug: __, authorEmail: ___, ...articleFields } = articleData

    const article = await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        title: articleData.title,
        status: articleData.status,
      },
      create: {
        ...articleFields,
        categoryId: categoryId ?? null,
        authorId: adminUser.id,
        isAiGenerated: false,
      },
    })

    // Upsert article-tag relations
    for (const tagId of tagIds) {
      await prisma.articleTag.upsert({
        where: { articleId_tagId: { articleId: article.id, tagId } },
        update: {},
        create: { articleId: article.id, tagId },
      })
    }

    console.log(`  ✓ ${article.title.substring(0, 60)}...`)
  }

  // ── 4. Seed default AI agents ───────────────────────────────────
  console.log('\n🤖 Seeding AI agent definitions...')
  const agents = [
    { agentType: 'TOPIC_DISCOVERY', displayName: 'Topic Discovery Agent', description: 'Discovers and scores relevant supply chain topics from approved sources.' },
    { agentType: 'RESEARCH', displayName: 'Research Agent', description: 'Gathers credible, traceable information from permitted sources.' },
    { agentType: 'WRITER', displayName: 'Content Writer Agent', description: 'Converts verified research into original, high-quality supply chain articles.' },
    { agentType: 'EDITORIAL_QA', displayName: 'Editorial Quality Agent', description: 'Reviews generated content for accuracy, clarity, and journalistic standards.' },
    { agentType: 'SEO_OPTIMIZER', displayName: 'SEO Optimization Agent', description: 'Optimizes content for search visibility without sacrificing usefulness.' },
    { agentType: 'PUBLISHER', displayName: 'Publishing Agent', description: 'Handles final publication workflow with permission enforcement.' },
    { agentType: 'CONTENT_MAINTENANCE', displayName: 'Content Maintenance Agent', description: 'Detects outdated articles and prepares update proposals.' },
  ]

  for (const agent of agents) {
    await prisma.aIAgent.upsert({
      where: { agentType: agent.agentType },
      update: { displayName: agent.displayName },
      create: {
        ...agent,
        isEnabled: false, // Disabled by default — admin must explicitly enable
        operatingMode: 'MANUAL',
      },
    })
    console.log(`  ✓ ${agent.displayName}`)
  }

  // ── 5. Seed default website settings ───────────────────────────
  console.log('\n⚙️  Seeding website settings...')
  const defaultSettings = [
    { key: 'site.name', value: 'Supply Intelligence', valueType: 'STRING' },
    { key: 'site.tagline', value: 'Procurement, Supply Chain & AI Insights', valueType: 'STRING' },
    { key: 'site.description', value: 'Practical insights and expert perspectives on procurement, supply chain, AI, logistics and project delivery.', valueType: 'STRING' },
    { key: 'site.url', value: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supplyintelligence.com', valueType: 'STRING' },
    { key: 'site.timezone', value: 'UTC', valueType: 'STRING' },
    { key: 'site.articlesPerPage', value: '12', valueType: 'NUMBER' },
    { key: 'ai.autonomousPublishing', value: 'false', valueType: 'BOOLEAN' },
    { key: 'ai.globalPauseAllAgents', value: 'false', valueType: 'BOOLEAN' },
    { key: 'ai.defaultOperatingMode', value: 'MANUAL', valueType: 'STRING' },
  ]

  for (const setting of defaultSettings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log(`  ✓ ${defaultSettings.length} settings`)

  console.log('\n✅ Seed complete!')
  console.log('\n⚠️  IMPORTANT: Change the default admin password immediately after first login.')
  console.log('    Email: admin@supplyintelligence.com')
  console.log('    Password: SupplyAdmin2025!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
