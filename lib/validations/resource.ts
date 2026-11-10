import { z } from 'zod'

export const resourceTypeSchema = z.enum([
  'TEMPLATE',
  'ARTIFACT',
  'INTERACTIVE_TOOL',
  'CALCULATOR',
])

export const resourceStatusSchema = z.enum([
  'DRAFT',
  'REVIEW',
  'PUBLISHED',
  'ARCHIVED',
])

export const createResourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(2000).optional(),
  resourceType: resourceTypeSchema,
  status: resourceStatusSchema.optional().default('DRAFT'),
  thumbnail: z.string().optional(),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(300).optional(),
  isFeatured: z.boolean().optional().default(false),
  featuredOrder: z.number().int().optional(),
  categoryIds: z.array(z.string()).optional(),
})

export const updateResourceSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().max(2000).optional(),
  resourceType: resourceTypeSchema.optional(),
  thumbnail: z.string().optional(),
  seoTitle: z.string().max(100).optional(),
  seoDescription: z.string().max(300).optional(),
  isFeatured: z.boolean().optional(),
  featuredOrder: z.number().int().optional(),
  categoryIds: z.array(z.string()).optional(),
})

export const transitionStatusSchema = z.object({
  status: resourceStatusSchema,
})

export const createVersionSchema = z.object({
  version: z
    .string()
    .min(1)
    .max(20)
    .regex(/^v?[0-9]+(\.[0-9]+)*$/, 'Version must follow semantic numbering (e.g. 1.0 or 1.0.0)'),
  changelog: z.string().max(1000).optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional(),
  displayOrder: z.number().int().optional().default(0),
})

