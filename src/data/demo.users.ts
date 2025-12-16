import { createServerFn } from '@tanstack/react-start'

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  department: string
  salary: number
  hireDate: string
}

function generateUsers(count: number): User[] {
  const firstNames = [
    'John',
    'Jane',
    'Bob',
    'Alice',
    'Charlie',
    'Diana',
    'Eve',
    'Frank',
    'Grace',
    'Henry',
  ]
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Wilson',
    'Taylor',
  ]
  const departments = [
    'Engineering',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'Support',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `user${i + 1}@example.com`,
    age: Math.floor(Math.random() * 40) + 22,
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 100000) + 40000,
    hireDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  }))
}

export const getUsers = createServerFn({
  method: 'GET',
}).handler(async () => generateUsers(10000))
