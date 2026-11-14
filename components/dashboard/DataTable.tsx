'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Loader2,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SortValue = string | number | null | undefined

export interface DataTableColumn<T> {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  /** Provide a value to make the column sortable. */
  sortValue?: (row: T) => SortValue
  align?: 'left' | 'right'
  /** Hidden until the user turns the column on from the Columns menu. */
  defaultHidden?: boolean
  /** Cannot be hidden from the Columns menu (e.g. the title or actions column). */
  alwaysVisible?: boolean
  cellClassName?: string
}

export interface DataTableFilter<T> {
  id: string
  label: string
  options: { label: string; value: string }[]
  predicate: (row: T, value: string) => boolean
}

export interface DataTableBulkAction<T> {
  id: string
  label: string
  icon?: React.ReactNode
  destructive?: boolean
  /** Build the confirmation text; omit to run without confirming. */
  confirm?: (rows: T[]) => string
  onRun: (rows: T[]) => void | Promise<void>
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  getRowId: (row: T) => string
  /** Text used by the search box. Omit to hide search. */
  searchText?: (row: T) => string
  searchPlaceholder?: string
  filters?: DataTableFilter<T>[]
  bulkActions?: DataTableBulkAction<T>[]
  /** Rows that cannot be selected (e.g. your own user account). */
  isRowSelectable?: (row: T) => boolean
  defaultSort?: { columnId: string; direction: 'asc' | 'desc' }
  pageSize?: number
  pageSizeOptions?: number[]
  hidePagination?: boolean
  emptyMessage?: string
  noun?: string
}

function compare(a: SortValue, b: SortValue) {
  const aEmpty = a === null || a === undefined || a === ''
  const bEmpty = b === null || b === undefined || b === ''
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

const controlClass =
  'rounded-xl border border-dashboard-input bg-dashboard-card px-3 py-2 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none'

export function DataTable<T>({
  data,
  columns,
  getRowId,
  searchText,
  searchPlaceholder = 'Search...',
  filters = [],
  bulkActions = [],
  isRowSelectable,
  defaultSort,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  hidePagination = false,
  emptyMessage = 'No records match your filters.',
  noun = 'items',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<{ columnId: string; direction: 'asc' | 'desc' } | null>(defaultSort ?? null)
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id))
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [runningAction, setRunningAction] = useState<string | null>(null)
  const columnsMenuRef = useRef<HTMLDivElement>(null)

  const selectable = bulkActions.length > 0
  const canSelect = (row: T) => (isRowSelectable ? isRowSelectable(row) : true)

  useEffect(() => {
    if (!columnsOpen) return
    const onPointer = (e: MouseEvent) => {
      if (!columnsMenuRef.current?.contains(e.target as Node)) setColumnsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setColumnsOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [columnsOpen])

  const visibleColumns = columns.filter((c) => !hiddenColumns.has(c.id))

  const processed = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = data.filter((row) => {
      if (q && searchText && !searchText(row).toLowerCase().includes(q)) return false
      for (const f of filters) {
        const value = filterValues[f.id]
        if (value && !f.predicate(row, value)) return false
      }
      return true
    })
    const sortColumn = sort ? columns.find((c) => c.id === sort.columnId) : undefined
    if (sort && sortColumn?.sortValue) {
      const get = sortColumn.sortValue
      const dir = sort.direction === 'asc' ? 1 : -1
      rows = [...rows].sort((a, b) => dir * compare(get(a), get(b)))
    }
    return rows
  }, [data, query, filterValues, sort, columns, filters, searchText])

  const totalPages = hidePagination ? 1 : Math.max(1, Math.ceil(processed.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = hidePagination ? processed : processed.slice((safePage - 1) * pageSize, safePage * pageSize)

  const selectedRows = useMemo(
    () => data.filter((row) => selectedIds.has(getRowId(row)) && canSelect(row)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedIds]
  )
  const selectablePageRows = pageRows.filter(canSelect)
  const allPageSelected = selectablePageRows.length > 0 && selectablePageRows.every((r) => selectedIds.has(getRowId(r)))
  const somePageSelected = selectablePageRows.some((r) => selectedIds.has(getRowId(r)))
  const selectableFiltered = processed.filter(canSelect)
  const allFilteredSelected = selectableFiltered.length > 0 && selectableFiltered.every((r) => selectedIds.has(getRowId(r)))

  const activeFilterCount = Object.values(filterValues).filter(Boolean).length + (query.trim() ? 1 : 0)

  function toggleSort(columnId: string) {
    setPage(1)
    setSort((prev) => {
      if (!prev || prev.columnId !== columnId) return { columnId, direction: 'asc' }
      if (prev.direction === 'asc') return { columnId, direction: 'desc' }
      return null
    })
  }

  function toggleRow(row: T) {
    const id = getRowId(row)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function togglePage() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const r of selectablePageRows) {
        if (allPageSelected) next.delete(getRowId(r))
        else next.add(getRowId(r))
      }
      return next
    })
  }

  function selectAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const r of selectableFiltered) next.add(getRowId(r))
      return next
    })
  }

  function clearFilters() {
    setQuery('')
    setFilterValues({})
    setPage(1)
  }

  async function runBulkAction(action: DataTableBulkAction<T>) {
    if (selectedRows.length === 0) return
    if (action.confirm && !window.confirm(action.confirm(selectedRows))) return
    setRunningAction(action.id)
    try {
      await action.onRun(selectedRows)
      setSelectedIds(new Set())
    } finally {
      setRunningAction(null)
    }
  }

  const colSpan = visibleColumns.length + (selectable ? 1 : 0)

  return (
    <div className="space-y-3">
      {/* Toolbar: search, filters, column chooser */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {searchText && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 size-4 text-dashboard-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full rounded-xl border border-dashboard-input bg-dashboard-card py-2 pl-9 pr-3 text-sm text-dashboard-foreground placeholder:text-dashboard-muted-foreground focus:border-brand-blue focus:outline-none"
              />
            </div>
          )}
          {filters.map((f) => (
            <select
              key={f.id}
              value={filterValues[f.id] ?? ''}
              onChange={(e) => {
                setFilterValues((prev) => ({ ...prev, [f.id]: e.target.value }))
                setPage(1)
              }}
              aria-label={f.label}
              className={controlClass}
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-sm font-medium text-brand-blue hover:bg-dashboard-accent"
            >
              <X className="size-3.5" /> Clear filters
            </button>
          )}
        </div>

        <div className="relative" ref={columnsMenuRef}>
          <button
            type="button"
            onClick={() => setColumnsOpen((o) => !o)}
            aria-expanded={columnsOpen}
            aria-haspopup="true"
            className="flex items-center gap-1.5 rounded-xl border border-dashboard-border bg-dashboard-card px-3 py-2 text-sm font-medium text-dashboard-foreground hover:bg-dashboard-accent"
          >
            <Columns3 className="size-4" /> Columns
          </button>
          {columnsOpen && (
            <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-dashboard-border bg-dashboard-card p-2 shadow-lg">
              {columns.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-dashboard-foreground',
                    c.alwaysVisible ? 'opacity-50' : 'cursor-pointer hover:bg-dashboard-accent'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={!hiddenColumns.has(c.id)}
                    disabled={c.alwaysVisible}
                    onChange={() =>
                      setHiddenColumns((prev) => {
                        const next = new Set(prev)
                        if (next.has(c.id)) next.delete(c.id)
                        else next.add(c.id)
                        return next
                      })
                    }
                    className="size-4 accent-brand-blue"
                  />
                  <span>{c.header}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectable && selectedRows.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          className="flex flex-wrap items-center gap-2 rounded-xl border border-brand-blue/30 bg-brand-blue/10 px-4 py-2.5"
        >
          <span className="text-sm font-semibold text-dashboard-foreground">
            {selectedRows.length} selected
          </span>
          {!allFilteredSelected && selectableFiltered.length > selectedRows.length && (
            <button type="button" onClick={selectAllFiltered} className="text-sm font-medium text-brand-blue hover:underline">
              Select all {selectableFiltered.length} {noun}
            </button>
          )}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {bulkActions.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={runningAction !== null}
                onClick={() => runBulkAction(a)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold disabled:opacity-50',
                  a.destructive
                    ? 'border-destructive/30 text-destructive hover:bg-destructive/10'
                    : 'border-dashboard-border bg-dashboard-card text-dashboard-foreground hover:bg-dashboard-accent'
                )}
              >
                {runningAction === a.id ? <Loader2 className="size-3.5 animate-spin" /> : a.icon}
                {a.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-dashboard-muted-foreground hover:bg-dashboard-accent"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-dashboard-border bg-dashboard-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-dashboard-border bg-dashboard-muted/40 text-dashboard-muted-foreground">
                {selectable && (
                  <th className="w-10 px-4 py-3.5">
                    <input
                      type="checkbox"
                      aria-label="Select all rows on this page"
                      checked={allPageSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = somePageSelected && !allPageSelected
                      }}
                      onChange={togglePage}
                      disabled={selectablePageRows.length === 0}
                      className="size-4 accent-brand-blue"
                    />
                  </th>
                )}
                {visibleColumns.map((c) => {
                  const isSorted = sort?.columnId === c.id
                  return (
                    <th
                      key={c.id}
                      scope="col"
                      aria-sort={isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : c.sortValue ? 'none' : undefined}
                      className={cn('px-4 py-3.5 font-medium whitespace-nowrap', c.align === 'right' && 'text-right')}
                    >
                      {c.sortValue ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.id)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded font-medium hover:text-dashboard-foreground',
                            isSorted && 'text-dashboard-foreground'
                          )}
                        >
                          {c.header}
                          {isSorted ? (
                            sort.direction === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        c.header
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="py-12 text-center text-dashboard-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const id = getRowId(row)
                  const checked = selectedIds.has(id)
                  return (
                    <tr key={id} className={cn('transition-colors hover:bg-dashboard-accent/40', checked && 'bg-brand-blue/5')}>
                      {selectable && (
                        <td className="w-10 px-4 py-3.5">
                          <input
                            type="checkbox"
                            aria-label="Select row"
                            checked={checked}
                            disabled={!canSelect(row)}
                            onChange={() => toggleRow(row)}
                            className="size-4 accent-brand-blue disabled:opacity-30"
                          />
                        </td>
                      )}
                      {visibleColumns.map((c) => (
                        <td key={c.id} className={cn('px-4 py-3.5', c.align === 'right' && 'text-right', c.cellClassName)}>
                          {c.cell(row)}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: count + pagination */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-dashboard-border px-4 py-3 text-sm text-dashboard-muted-foreground sm:flex-row">
          <span>
            {processed.length === data.length
              ? `${data.length} ${noun}`
              : `${processed.length} of ${data.length} ${noun}`}
          </span>
          {!hidePagination && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                  }}
                  aria-label="Rows per page"
                  className="rounded-lg border border-dashboard-input bg-dashboard-card px-2 py-1 text-sm text-dashboard-foreground focus:border-brand-blue focus:outline-none"
                >
                  {pageSizeOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span>
                Page {safePage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                  aria-label="Previous page"
                  className="rounded-lg border border-dashboard-border p-1.5 hover:bg-dashboard-accent disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  aria-label="Next page"
                  className="rounded-lg border border-dashboard-border p-1.5 hover:bg-dashboard-accent disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
