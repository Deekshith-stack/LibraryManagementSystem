# Library Management System — Documentation

**Repository:** https://github.com/Deekshith-stack/LibraryManagementSystem
**Live Demo:** https://deekshith-stack.github.io/LibraryManagementSystem/
**Developer:** Deekshith Reddy

---

## 1. Overview

This project is a modern, front-end Library Management System (LMS) built as a single-page web application. It simulates a full digital library workflow with three distinct user portals — **Student**, **Librarian**, and **Admin** — each with role-specific dashboards and permissions. All data is currently persisted in the browser via LocalStorage, making it a fully functional demo/prototype without needing a backend server.

| Portal | Focus |
|---|---|
| 🎓 Student | Browse & reserve books, track loans, pay fines |
| 📖 Librarian | Manage catalog, issue/return books, handle transactions |
| ⚙️ Admin | Full system control, analytics, user management, backups |

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite |
| Language | JavaScript |
| Styling | Vanilla CSS (glassmorphism design) |
| State management | React Context API |
| Data persistence | Browser LocalStorage |
| Icons | Lucide React |
| Hosting | GitHub Pages |

---

## 3. System Architecture

The app is structured around a central `LibraryContext` that reads from and writes to LocalStorage, feeding data down into three separate portal trees:

```
React App
 └── Library Context (state + LocalStorage sync)
      ├── Student Portal    → Dashboard, Catalog, Fines & Payments
      ├── Librarian Portal  → Book Management, Issue/Return, Reservations
      └── Admin Portal      → Analytics, User Management, Settings/Backup
```

---

## 4. Feature Breakdown

### 4.1 Student Portal
- Personalized dashboard with loan/fine summary
- Smart book search with advanced filters
- Borrowing history and due-date tracking
- Overdue alerts and notifications
- Book reservations and wishlist
- Ratings and reviews
- Fine tracking with payment receipts

**Typical flow:** Discover → Search/Filter → Check Availability → Reserve/Borrow → Track Due Date → Return

### 4.2 Librarian Portal
- Add, edit, and remove books
- Manage book copies and shelf locations
- Issue and return books
- Automatic due-date generation and fine calculation
- Transaction management
- Reservation queue processing

**Book issue flow:** Select Student → Select Book → Check Availability → Issue Book → Generate Due Date

### 4.3 Admin Portal
- Analytics dashboard (books, users, active loans, overdue counts, fine revenue)
- User, student, and librarian management
- Role-based access control and account suspension
- Inventory and overdue monitoring
- Activity logs
- Data export (CSV/JSON), system backup, restore, and factory reset

---

## 5. Core Mechanics

### 5.1 Automated Fine Calculation
Fines accrue automatically once a book passes its due date, at a configurable daily rate (default ₹10/day). Example:

- Issue date → Due date → Return date
- Fine = (days overdue) × (fine rate per day)

The rate is adjustable from the Admin Settings panel.

### 5.2 Reservation System
When a book is unavailable, students can queue a reservation. Once a copy is returned, the librarian approves the next request in the queue, and the student is notified automatically.

### 5.3 Notification System
A centralized notification center alerts users to events such as successful issues/returns, upcoming due dates, reservation availability, and pending fines.

### 5.4 Data Persistence
Data is stored client-side under LocalStorage keys, including:
```
lms_books
lms_users
lms_transactions
lms_reservations
lms_settings
lms_payment_records
lms_notifications
lms_system_logs
```
Note: This is a frontend-only prototype. The README indicates a possible future migration to a Java Spring Boot + MySQL backend for a full-stack, multi-user production version.

---

## 6. Project Structure

```
LibraryManagementSystem/
├── .github/workflows/deploy.yml     # GitHub Pages CI/CD
├── public/                          # Static assets (favicon, 404 page, icons)
├── assets/                          # Demo GIF, media
├── src/
│   ├── components/
│   │   ├── Admin/        (Dashboard, LibrarySettings, UserManagement)
│   │   ├── Librarian/    (BookCatalog, IssueReturn, Reservations)
│   │   ├── Shared/       (Navbar, Sidebar, Modal)
│   │   └── Student/      (StudentDashboard, StudentCatalog, StudentFines)
│   ├── context/LibraryContext.jsx   # Global state + LocalStorage sync
│   ├── utils/mockData.js            # Seed/demo data
│   ├── App.jsx
│   └── main.jsx
├── README.md
├── package.json
└── vite.config.js
```

---

## 7. Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Setup
```bash
git clone https://github.com/Deekshith-stack/LibraryManagementSystem.git
cd LibraryManagementSystem
npm install
npm run dev
```

### Production Build
```bash
npm run build      # creates optimized build
npm run preview    # preview the production build locally
```

### Deployment
The project deploys to GitHub Pages:
```bash
npm run deploy
```
Live at: https://deekshith-stack.github.io/LibraryManagementSystem/

---

## 8. Known Limitations / Roadmap

Since the app currently runs entirely client-side, notable limitations and planned enhancements include:

| Current State | Planned Enhancement |
|---|---|
| No real authentication | Real auth system |
| Browser-only storage | Java Spring Boot + MySQL backend |
| Manual data entry | AI-based book recommendations & library assistant |
| No physical scanning | Barcode / QR code integration |
| Web only | Native mobile application |
| — | Digital library (e-books) |
| Manual payments | Online fine payment integration |
| In-app notifications only | Email and WhatsApp notifications |
| Basic export | Advanced reporting |

---

## 9. What This Project Demonstrates

- React component architecture and Context API-based state management
- Role-based interface design (multi-portal UX)
- CRUD operations across books, users, and transactions
- Business logic implementation (fines, due dates, reservation queues)
- Client-side data persistence patterns
- Responsive, modern UI design (glassmorphism)
- CI/CD deployment to GitHub Pages

---

## 10. License & Credits

Licensed under **MIT**. Built by **Deekshith Reddy** using React and Vite.
