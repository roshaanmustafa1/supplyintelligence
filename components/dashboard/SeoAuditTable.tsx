'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { DataTable, type DataTableColumn, type DataTableFilter } from '@/components/dashboard/DataTable'

export interface SeoAuditRow {
  id: string
  title: string
  primaryKeyword: string | null
  seoDescription: string | null
}

const columns: DataTableColumn<SeoAuditRow>[] = [
  {
    id: 'article',
    header: 'Article',
    alwaysVisible: true,
    sortValue: (a) => a.title,
    cell: (a) => <span className="block max-w-xs truncate font-semibold text-dashboard-foreground">{a.title}</span>,
  },
  {
    id: 'keyword',
    header: 'Primary Keyword',
    sortValue: (a) => a.primaryKeyword,
    cell: (a) =>
      a.primaryKeyword ? (
        <span className="text-dashboard-muted-foreground">{a.primaryKeyword}</span>
      ) : (
        <span className="italic text-amber-500">None set</span>
      ),
  },
  {
    id: 'description',
    header: 'Meta Description',
    sortValue: (a) => a.seoDescription?.length ?? 0,
    cell: (a) =>
      a.seoDescription ? (
        <span className="block max-w-xs truncate text-dashboard-muted-foreground">{a.seoDescription}</span>
      ) : (
        <span className="italic text-rose-500">Missing description</span>
      ),
  },
  {
    id: 'status',
    header: 'SERP Status',
    cell: () => (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-dashboard-caption font-semibold text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-3" />
        Indexed
      </span>
    ),
  },
  {
    id: 'action',
    header: 'Action',
    align: 'right',
    alwaysVisible: true,
    cell: (a) => (
      <Link href={`/dashboard/articles/${a.id}`} className="font-semibold text-brand-blue hover:underline">
        Edit SEO &rarr;
      </Link>
    ),
  },
]

const filters: DataTableFilter<SeoAuditRow>[] = [
  {
    id: 'keyword',
    label: 'Any Keyword State',
    options: [
      { label: 'Has keyword', value: 'has' },
      { label: 'Missing keyword', value: 'missing' },
    ],
    predicate: (a, v) => (v === 'has' ? Boolean(a.primaryKeyword) : !a.primaryKeyword),
  },
  {
    id: 'description',
    label: 'Any Description State',
    options: [
      { label: 'Has description', value: 'has' },
      { label: 'Missing description', value: 'missing' },
    ],
    predicate: (a, v) => (v === 'has' ? Boolean(a.seoDescription) : !a.seoDescription),
  },
]

export function SeoAuditTable({ articles }: { articles: SeoAuditRow[] }) {
  return (
    <DataTable
      data={articles}
      columns={columns}
      getRowId={(a) => a.id}
      searchText={(a) => `${a.title} ${a.primaryKeyword ?? ''} ${a.seoDescription ?? ''}`}
      searchPlaceholder="Search articles, keywords or descriptions..."
      filters={filters}
      defaultSort={{ columnId: 'article', direction: 'asc' }}
      noun="articles"
      emptyMessage="No published articles to audit."
    />
  )
}
