import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import { users, type User } from '@/data/demo.users'
import { VirtualTable } from '@/components/VirtualTable'

export const Route = createFileRoute('/demo/start/virtual-table')({
  component: RouteComponent,
})

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 70,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 120,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 120,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 130,
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
]

function RouteComponent() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          Virtual Table Demo
        </h1>
        <p className="text-gray-400 mb-4">
          Displaying {users.length.toLocaleString()} rows with row virtualization
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex-1 min-h-0">
          <VirtualTable
            data={users}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            globalFilter={globalFilter}
          />
        </div>
      </div>
    </div>
  )
}
