import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import { getUsers, type User } from '@/data/demo.users'
import { VirtualTable } from '@/components/VirtualTable'

export const Route = createFileRoute('/demo/start/virtual-table')({
  component: RouteComponent,
  loader: async () => await getUsers(),
})

const columns: ColumnDef<User, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'age',
    header: 'Age',
    size: 80,
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ getValue }) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(getValue() as number),
  },
  {
    accessorKey: 'hireDate',
    header: 'Hire Date',
  },
]

function RouteComponent() {
  const users = Route.useLoaderData()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">
          Virtual Table Demo
        </h1>
        <p className="text-gray-400 mb-4">
          Displaying {users.length.toLocaleString()} rows with row
          virtualization
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

        <VirtualTable
          data={users}
          columns={columns}
          sorting={sorting}
          onSortingChange={setSorting}
          globalFilter={globalFilter}
        />
      </div>
    </div>
  )
}
