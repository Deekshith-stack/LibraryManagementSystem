export const initialBooks = [
  {
    id: "book-1",
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Programming",
    price: 499.00,
    copiesAvailable: 4,
    totalCopies: 5,
    location: "Shelf A-3",
    rating: 4.8,
    reviews: [
      {
        id: "rev-1",
        studentName: "a",
        rating: 5,
        comment: "A must-read handbook for every software craftsman. Practical and eye-opening.",
        date: "2026-08-25"
      }
    ],
    wishlist: []
  },
  {
    id: "book-2",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "978-0201633610",
    category: "Software Engineering",
    price: 599.00,
    copiesAvailable: 2,
    totalCopies: 3,
    location: "Shelf B-1",
    rating: 4.7,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-3",
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest",
    isbn: "978-0262033848",
    category: "Computer Science",
    price: 899.00,
    copiesAvailable: 3,
    totalCopies: 4,
    location: "Shelf B-4",
    rating: 4.9,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-4",
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    isbn: "978-0135957059",
    category: "Programming",
    price: 450.00,
    copiesAvailable: 5,
    totalCopies: 5,
    location: "Shelf A-1",
    rating: 4.9,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-5",
    title: "You Don't Know JS Yet: Scope & Closures",
    author: "Kyle Simpson",
    isbn: "978-1933988696",
    category: "Programming",
    price: 299.00,
    copiesAvailable: 1,
    totalCopies: 3,
    location: "Shelf C-2",
    rating: 4.6,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-6",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "978-0136042594",
    category: "Artificial Intelligence",
    price: 1199.00,
    copiesAvailable: 2,
    totalCopies: 2,
    location: "Shelf D-1",
    rating: 4.8,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-7",
    title: "Python Crash Course",
    author: "Eric Matthes",
    isbn: "978-1593279288",
    category: "Programming",
    price: 420.00,
    copiesAvailable: 4,
    totalCopies: 4,
    location: "Shelf A-2",
    rating: 4.7,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-8",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    category: "Self-Help",
    price: 399.00,
    copiesAvailable: 6,
    totalCopies: 6,
    location: "Shelf E-2",
    rating: 4.9,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-9",
    title: "Zero to One: Notes on Startups",
    author: "Peter Thiel, Blake Masters",
    isbn: "978-0804139298",
    category: "Business",
    price: 350.00,
    copiesAvailable: 3,
    totalCopies: 3,
    location: "Shelf E-5",
    rating: 4.5,
    reviews: [],
    wishlist: []
  },
  {
    id: "book-10",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "978-0262035613",
    category: "Artificial Intelligence",
    price: 950.00,
    copiesAvailable: 2,
    totalCopies: 2,
    location: "Shelf D-3",
    rating: 4.8,
    reviews: [],
    wishlist: []
  }
];

export const initialUsers = [
  {
    id: "user-a",
    name: "a",
    email: "a@library.edu",
    role: "student",
    status: "active",
    enrollmentId: "STU-2026-001"
  },
  {
    id: "user-lib",
    name: "Librarian",
    email: "librarian@library.gov",
    role: "librarian",
    status: "active",
    employeeId: "LIB-2026-101"
  },
  {
    id: "user-admin",
    name: "Admin",
    email: "admin@library.gov",
    role: "admin",
    status: "active",
    employeeId: "ADM-2026-501"
  }
];

export const initialTransactions = [];

export const initialReservations = [];

export const initialSettings = {
  fineRatePerDay: 5.00, // ₹5 per day
  maxBooksAllowed: 4,
  borrowPeriodDays: 14
};

export const initialNotifications = [
  {
    id: "notif-1",
    type: "due",
    icon: "bell",
    title: "Due Date Reminder",
    text: "🔔 Your book is due tomorrow.",
    timestamp: "Just now",
    read: false,
    role: "student",
    actionTab: "student-dashboard"
  },
  {
    id: "notif-2",
    type: "fine",
    icon: "warning",
    title: "Pending Fine Alert",
    text: "⚠️ You have ₹40 pending fine.",
    timestamp: "10 mins ago",
    read: false,
    role: "student",
    actionTab: "student-fines"
  },
  {
    id: "notif-3",
    type: "reservation",
    icon: "book",
    title: "Hold Available",
    text: "📚 Your reserved book is now available.",
    timestamp: "1 hour ago",
    read: false,
    role: "student",
    actionTab: "student-catalog"
  },
  {
    id: "notif-4",
    type: "new_arrival",
    icon: "sparkles",
    title: "New Catalog Arrivals",
    text: "🎉 New books added in Programming.",
    timestamp: "Today",
    read: false,
    role: "student",
    actionTab: "student-catalog"
  },
  {
    id: "notif-5",
    type: "system",
    icon: "info",
    title: "System Update",
    text: "LMS engine initialized with fresh seed catalog.",
    timestamp: "09:00 AM",
    read: true,
    role: "admin",
    actionTab: "admin-dashboard"
  },
  {
    id: "notif-6",
    type: "system",
    icon: "info",
    title: "Circulation Ready",
    text: "Issue & Return desk opened for circulation.",
    timestamp: "09:00 AM",
    read: true,
    role: "librarian",
    actionTab: "lib-issue-return"
  }
];
