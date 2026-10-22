export const defaultCategories = [
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

export const defaultAgents = [
    { agentType: 'TOPIC_DISCOVERY', displayName: 'Topic Discovery Agent', description: 'Discovers and scores relevant supply chain topics from approved sources.' },
    { agentType: 'RESEARCH', displayName: 'Research Agent', description: 'Gathers credible, traceable information from permitted sources.' },
    { agentType: 'WRITER', displayName: 'Content Writer Agent', description: 'Converts verified research into original, high-quality supply chain articles.' },
    { agentType: 'EDITORIAL_QA', displayName: 'Editorial Quality Agent', description: 'Reviews generated content for accuracy, clarity, and journalistic standards.' },
    { agentType: 'SEO_OPTIMIZER', displayName: 'SEO Optimization Agent', description: 'Optimizes content for search visibility without sacrificing usefulness.' },
    { agentType: 'PUBLISHER', displayName: 'Publishing Agent', description: 'Handles final publication workflow with permission enforcement.' },
    { agentType: 'CONTENT_MAINTENANCE', displayName: 'Content Maintenance Agent', description: 'Detects outdated articles and prepares update proposals.' },
  ]

export const defaultSettings = [
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
