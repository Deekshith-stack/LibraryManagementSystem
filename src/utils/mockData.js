export const initialBooks = [
  {
    id: "book-1",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Software Engineering",
    price: 49.99,
    copiesAvailable: 3,
    totalCopies: 4,
    location: "Shelf A-3"
  },
  {
    id: "book-2",
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm",
    isbn: "978-0201633610",
    category: "Computer Science",
    price: 54.95,
    copiesAvailable: 1,
    totalCopies: 2,
    location: "Shelf B-1"
  },
  {
    id: "book-3",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    price: 89.99,
    copiesAvailable: 2,
    totalCopies: 2,
    location: "Shelf B-4"
  },
  {
    id: "book-4",
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    isbn: "978-0135957059",
    category: "Software Engineering",
    price: 42.50,
    copiesAvailable: 5,
    totalCopies: 5,
    location: "Shelf A-1"
  },
  {
    id: "book-5",
    title: "You Don't Know JS Yet",
    author: "Kyle Simpson",
    isbn: "978-1933988696",
    category: "JavaScript",
    price: 29.99,
    copiesAvailable: 0,
    totalCopies: 2,
    location: "Shelf C-2"
  },
  {
    id: "book-6",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "978-0136042594",
    category: "Artificial Intelligence",
    price: 119.99,
    copiesAvailable: 1,
    totalCopies: 1,
    location: "Shelf D-1"
  },
  {
    id: "book-7",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    category: "Self-Help",
    price: 16.20,
    copiesAvailable: 4,
    totalCopies: 4,
    location: "Shelf E-2"
  },
  {
    id: "book-8",
    title: "Zero to One",
    author: "Peter Thiel",
    isbn: "978-0804139298",
    category: "Business",
    price: 21.00,
    copiesAvailable: 3,
    totalCopies: 3,
    location: "Shelf E-5"
  }
];

export const initialUsers = [
  {
    id: "user-student-1",
    name: "Alex Mercer",
    email: "alex.mercer@library.edu",
    role: "student",
    status: "active",
    enrollmentId: "STU-2026-001"
  },
  {
    id: "user-student-2",
    name: "Emma Watson",
    email: "emma.watson@library.edu",
    role: "student",
    status: "active",
    enrollmentId: "STU-2026-002"
  },
  {
    id: "user-student-3",
    name: "Bruce Wayne",
    email: "bruce.wayne@library.edu",
    role: "student",
    status: "suspended",
    enrollmentId: "STU-2026-003"
  },
  {
    id: "user-lib-1",
    name: "Sarah Connor",
    email: "sarah.connor@library.gov",
    role: "librarian",
    status: "active",
    employeeId: "LIB-2026-101"
  },
  {
    id: "user-admin-1",
    name: "Tony Stark",
    email: "tony.stark@stark.com",
    role: "admin",
    status: "active",
    employeeId: "ADM-2026-501"
  }
];

// Helper to generate ISO dates relative to current local time
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const initialTransactions = [
  {
    id: "tx-1",
    bookId: "book-1",
    bookTitle: "Clean Code",
    studentId: "user-student-1",
    studentName: "Alex Mercer",
    issueDate: daysAgo(20),
    dueDate: daysAgo(6),
    returnDate: daysAgo(6),
    fineAmount: 0,
    status: "returned"
  },
  {
    id: "tx-2",
    bookId: "book-5",
    bookTitle: "You Don't Know JS Yet",
    studentId: "user-student-1",
    studentName: "Alex Mercer",
    issueDate: daysAgo(25),
    dueDate: daysAgo(11),
    returnDate: null,
    fineAmount: 16.50, // Simulated overdue: 11 days overdue * fineRate
    status: "overdue"
  },
  {
    id: "tx-3",
    bookId: "book-2",
    bookTitle: "Design Patterns",
    studentId: "user-student-2",
    studentName: "Emma Watson",
    issueDate: daysAgo(5),
    dueDate: daysAgo(-9), // Due in 9 days
    returnDate: null,
    fineAmount: 0,
    status: "issued"
  },
  {
    id: "tx-4",
    bookId: "book-5",
    bookTitle: "You Don't Know JS Yet",
    studentId: "user-student-3",
    studentName: "Bruce Wayne",
    issueDate: daysAgo(30),
    dueDate: daysAgo(16),
    returnDate: null,
    fineAmount: 24.00,
    status: "overdue"
  }
];

export const initialReservations = [
  {
    id: "res-1",
    bookId: "book-6",
    bookTitle: "Artificial Intelligence: A Modern Approach",
    studentId: "user-student-1",
    studentName: "Alex Mercer",
    requestDate: daysAgo(2),
    status: "pending"
  },
  {
    id: "res-2",
    bookId: "book-3",
    bookTitle: "Introduction to Algorithms",
    studentId: "user-student-2",
    studentName: "Emma Watson",
    requestDate: daysAgo(1),
    status: "approved"
  }
];

export const initialSettings = {
  fineRatePerDay: 1.50,
  maxBooksAllowed: 4,
  borrowPeriodDays: 14
};
