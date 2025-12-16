import { useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

type VirtualTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, unknown>[]
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  globalFilter?: string
}

export function VirtualTable<T>({
  data,
  columns,
  sorting = [],
  onSortingChange,
  globalFilter,
}: VirtualTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: onSortingChange as (updater: unknown) => void,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
    measureElement: (element) => element.getBoundingClientRect().height,
  })

  const virtualRows = virtualizer.getVirtualItems()

  return (
    <div className="h-full flex flex-col rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 bg-slate-800 border-b border-slate-700">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className="px-4 py-3 text-left text-sm font-semibold text-cyan-400 cursor-pointer hover:bg-slate-700 flex-shrink-0"
              style={{
                width: header.column.getSize(),
                flexGrow: header.column.getSize() === 150 ? 1 : 0,
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{
                asc: ' ↑',
                desc: ' ↓',
              }[header.column.getIsSorted() as string] ?? null}
            </div>
          ))
        )}
      </div>

      {/* Body */}
      <div
        ref={parentRef}
        className="flex-1 min-h-0 overflow-auto"
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <div
                key={row.id}
                data-index={virtualRow.index}
                ref={(node) => virtualizer.measureElement(node)}
                className="flex hover:bg-slate-700/50 transition-colors border-b border-slate-700/50"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-300 flex-shrink-0"
                    style={{
                      width: cell.column.getSize(),
                      flexGrow: cell.column.getSize() === 150 ? 1 : 0,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
