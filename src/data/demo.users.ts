export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  hireDate: string;
  notes: string;
};

// Seeded random number generator for deterministic data
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function generateUsers(count: number): User[] {
  const random = seededRandom(12345);

  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Wilson",
    "Taylor",
  ];
  const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
    "Support",
  ];
  const sentences = [
    "Excellent team player.",
    "Consistently meets deadlines.",
    "Strong technical skills.",
    "Great communication abilities.",
    "Proactive problem solver.",
    "Shows leadership potential.",
    "Needs improvement in time management.",
    "Highly motivated and dedicated.",
    "Works well under pressure.",
    "Creative and innovative thinker.",
  ];

  const generateNotes = () => {
    const noteCount = Math.floor(random() * 5) + 1;
    const selected: string[] = [];
    for (let i = 0; i < noteCount; i++) {
      selected.push(sentences[Math.floor(random() * sentences.length)]);
    }
    return selected.join(" ");
  };

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: firstNames[Math.floor(random() * firstNames.length)],
    lastName: lastNames[Math.floor(random() * lastNames.length)],
    email: `user${i + 1}@example.com`,
    age: Math.floor(random() * 40) + 22,
    department: departments[Math.floor(random() * departments.length)],
    salary: Math.floor(random() * 100000) + 40000,
    hireDate: `202${Math.floor(random() * 5)}-${String(Math.floor(random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(random() * 28) + 1).padStart(2, "0")}`,
    notes: generateNotes(),
  }));
}

// Static data generated at build time
export const users: User[] = generateUsers(10000);
