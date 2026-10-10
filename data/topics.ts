export interface Topic {
  id: string
  slug: string
  name: string
  shortName: string
  description: string
  iconName: 'ShoppingBag' | 'Network' | 'Sparkles' | 'Ship' | 'CheckCircle2'
  articleCount: number
}

export const topics: Topic[] = [
  {
    id: 'procurement',
    slug: 'procurement',
    name: 'Procurement',
    shortName: 'Procurement',
    description: 'Strategic sourcing, supplier lifecycle governance, spend analytics, and contract intelligence.',
    iconName: 'ShoppingBag',
    articleCount: 14,
  },
  {
    id: 'supply-chain',
    slug: 'supply-chain',
    name: 'Supply Chain',
    shortName: 'Supply Chain',
    description: 'End-to-end network design, inventory visibility, multi-tier risk, and demand orchestration.',
    iconName: 'Network',
    articleCount: 22,
  },
  {
    id: 'ai-digital-transformation',
    slug: 'ai-digital-transformation',
    name: 'AI & Digital Transformation',
    shortName: 'AI & Digital',
    description: 'Agentic workflows, machine learning forecasting, automated intake, and ERP modernization.',
    iconName: 'Sparkles',
    articleCount: 18,
  },
  {
    id: 'logistics',
    slug: 'logistics',
    name: 'Logistics',
    shortName: 'Logistics',
    description: 'Freight corridors, maritime shipping, cold chains, intermodal transit, and port operations.',
    iconName: 'Ship',
    articleCount: 16,
  },
  {
    id: 'project-delivery',
    slug: 'project-delivery',
    name: 'Project Delivery',
    shortName: 'Project Delivery',
    description: 'Capital projects, engineering procurement construction (EPC), milestones, and contractor management.',
    iconName: 'CheckCircle2',
    articleCount: 11,
  },
]
