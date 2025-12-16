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
    estimateSize: () => 48,
    overscan: 10,
  })

  const virtualRows = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto rounded-lg border border-slate-700"
    >
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-slate-800 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-4 py-3 text-left text-sm font-semibold text-cyan-400 border-b border-slate-700 cursor-pointer hover:bg-slate-700"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' ↑',
                    desc: ' ↓',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {virtualRows.length > 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{ height: `${virtualRows[0].start}px` }}
              />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <tr
                key={row.id}
                className="hover:bg-slate-700/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm text-gray-300 border-b border-slate-700/50"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
          {virtualRows.length > 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  height: `${virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end}px`,
                }}
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
