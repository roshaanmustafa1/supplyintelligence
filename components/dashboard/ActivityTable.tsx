'use client'

import { DataTable, type DataTableColumn, type DataTableFilter } from '@/components/dashboard/DataTable'

export interface ActivityLogRow {
  id: string
  createdAt: string
  actor: string
  action: string
  resourceType: string | null
  resourceId: string | null
  changesAfter: string | null
}

const columns: DataTableColumn<ActivityLogRow>[] = [
  {
    id: 'timestamp',
    header: 'Timestamp',
    alwaysVisible: true,
    sortValue: (l) => new Date(l.createdAt).getTime(),
    cell: (l) => (
      <span className="whitespace-nowrap text-dashboard-muted-foreground">
        {new Date(l.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </span>
    ),
  },
  {
    id: 'actor',
    header: 'Actor',
    sortValue: (l) => l.actor,
    cell: (l) => <span className="font-medium text-dashboard-foreground">{l.actor}</span>,
  },
  {
    id: 'action',
    header: 'Action',
    sortValue: (l) => l.action,
    cell: (l) => (
      <span className="rounded bg-dashboard-accent px-2 py-0.5 font-mono text-dashboard-caption font-semibold text-brand-blue">
        {l.action}
      </span>
    ),
  },
  {
    id: 'resource',
    header: 'Resource',
    sortValue: (l) => l.resourceType,
    cell: (l) => (
      <span className="font-medium text-dashboard-foreground">
        {l.resourceType ? `${l.resourceType} (${l.resourceId || ''})` : '-'}
      </span>
    ),
  },
  {
    id: 'changes',
    header: 'Changes Snapshot',
    cell: (l) => (
      <span className="block max-w-xs truncate font-mono text-dashboard-caption text-dashboard-muted-foreground" title={l.changesAfter ?? undefined}>
        {l.changesAfter || '-'}
      </span>
    ),
  },
]

export function ActivityTable({ logs }: { logs: ActivityLogRow[] }) {
  const unique = (values: (string | null)[]) =>
    [...new Set(values.filter((v): v is string => Boolean(v)))].sort().map((v) => ({ label: v, value: v }))

  const filters: DataTableFilter<ActivityLogRow>[] = [
    { id: 'actor', label: 'All Actors', options: unique(logs.map((l) => l.actor)), predicate: (l, v) => l.actor === v },
    { id: 'action', label: 'All Actions', options: unique(logs.map((l) => l.action)), predicate: (l, v) => l.action === v },
    {
      id: 'resource',
      label: 'All Resources',
      options: unique(logs.map((l) => l.resourceType)),
      predicate: (l, v) => l.resourceType === v,
    },
  ]

  return (
    <DataTable
      data={logs}
      columns={columns}
      getRowId={(l) => l.id}
      searchText={(l) => `${l.actor} ${l.action} ${l.resourceType ?? ''} ${l.resourceId ?? ''} ${l.changesAfter ?? ''}`}
      searchPlaceholder="Search the activity log..."
      filters={filters}
      defaultSort={{ columnId: 'timestamp', direction: 'desc' }}
      pageSize={25}
      noun="events"
      emptyMessage="No activity logs recorded yet."
    />
  )
}
