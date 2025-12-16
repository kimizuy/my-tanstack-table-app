# TanStack Virtual Table Demo

TanStack Table + TanStack Virtual を使用した、大量データ（10,000行）でも高パフォーマンスなテーブルの実装例。

## Demo

https://my-tanstack-table-app.kimizuy.workers.dev/demo/start/virtual-table

## Features

- **行の仮想化**: 10,000行でもスムーズにスクロール
- **動的な行の高さ**: コンテンツに応じて行の高さが自動調整
- **ソート機能**: ヘッダークリックでソート
- **グローバルフィルタ**: 全カラムを対象とした検索

## Implementation

### 必要なパッケージ

```bash
npm install @tanstack/react-table @tanstack/react-virtual
```

### VirtualTable コンポーネント

`src/components/VirtualTable.tsx`

```tsx
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
    state: { sorting, globalFilter },
    onSortingChange: onSortingChange as (updater: unknown) => void,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,  // 推定行高さ
    overscan: 5,             // 追加レンダリング行数
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
              className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-slate-700 flex-shrink-0"
              style={{
                width: header.column.getSize(),
                flexGrow: header.column.getSize() === 150 ? 1 : 0,
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
            </div>
          ))
        )}
      </div>

      {/* Body - 計算可能な高さが仮想化の鍵 */}
      <div ref={parentRef} className="flex-1 min-h-0 overflow-auto">
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]
            return (
              <div
                key={row.id}
                data-index={virtualRow.index}
                ref={(node) => virtualizer.measureElement(node)}
                className="flex hover:bg-slate-700/50 border-b border-slate-700/50"
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
                    className="px-4 py-3 text-sm flex-shrink-0"
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
```

### 使用例

```tsx
import { useState } from 'react'
import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import { VirtualTable } from '@/components/VirtualTable'

type User = {
  id: number
  firstName: string
  lastName: string
  notes: string
}

const columns: ColumnDef<User, unknown>[] = [
  { accessorKey: 'id', header: 'ID', size: 70 },
  { accessorKey: 'firstName', header: 'First Name', size: 120 },
  { accessorKey: 'lastName', header: 'Last Name', size: 120 },
  { accessorKey: 'notes', header: 'Notes' },  // size未指定 = flexGrowで伸縮
]

function MyTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <>
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <VirtualTable
        data={data}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={globalFilter}
      />
    </>
  )
}
```

## Key Points

### 動的な行の高さ

`measureElement` を使用して実際のDOM要素の高さを計測:

```tsx
const virtualizer = useVirtualizer({
  // ...
  measureElement: (element) => element.getBoundingClientRect().height,
})

// 行のref設定で自動計測
<div ref={(node) => virtualizer.measureElement(node)}>
```

### カラム幅の整列

`<table>` ではなく flex レイアウトを使用。絶対位置指定された仮想行でもカラム幅が揃う:

```tsx
style={{
  width: cell.column.getSize(),
  flexGrow: cell.column.getSize() === 150 ? 1 : 0,  // デフォルトサイズ(150)なら伸縮
}}
```

### 仮想化の必須要件

1. **計算可能な高さのスクロールコンテナ**: `h-dvh`, `h-[600px]`, または親から継承した `h-full`
2. **相対位置の内部コンテナ**: `position: relative` + 全体の高さを設定
3. **絶対位置の行**: `position: absolute` + `transform: translateY()`

**高さの設定例（CSS Grid + dvh）:**
```tsx
// ルートレイアウト
<body className="h-dvh grid grid-rows-[auto_1fr]">
  <Header />
  <main className="min-h-0">{children}</main>
</body>

// ページ
<div className="h-full">
  <VirtualTable />  {/* h-full flex flex-col */}
</div>
```

- `h-dvh`: Dynamic Viewport Height（モバイルのアドレスバーも考慮）
- `grid-rows-[auto_1fr]`: ヘッダーは自動、残りは1fr
- `min-h-0`: グリッドアイテムの縮小を許可

## Tech Stack

- [TanStack Table](https://tanstack.com/table) - Headless table library
- [TanStack Virtual](https://tanstack.com/virtual) - Row virtualization
- [Tailwind CSS](https://tailwindcss.com/) - Styling
