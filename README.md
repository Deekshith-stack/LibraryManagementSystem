<div align="center">

# 📚 LMS - Library Management System

### Modern, Responsive & Intelligent Library Platform

<img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=26&duration=3500&pause=1000&color=06B6D4&center=true&vCenter=true&width=750&lines=LMS+%E2%80%A2+Library+Management+System;Student+%7C+Librarian+%7C+Admin+Portals;AI+Personalized+Book+Recommendations;Real-Time+Notification+Center+%E2%80%A2+Alerts;Clean+Centered+Navigation+%E2%80%A2+User+Switcher" alt="Typing SVG" />

<br/><br/>

<a href="https://deekshith-stack.github.io/LibraryManagementSystem/">
  <img src="https://img.shields.io/badge/🚀%20OPEN%20LMS-Visit%20Platform-06B6D4?style=for-the-badge" alt="Live Demo"/>
</a>
&nbsp;
<a href="https://github.com/Deekshith-stack/LibraryManagementSystem">
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Design%20System-Dark%20Glass-06B6D4?style=flat-square" />
<img src="https://img.shields.io/badge/Deployment-GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />

<br/><br/>

> **LMS** is a feature-rich, high-performance digital library management system built with **React 19**, **Vite**, and modern **Glassmorphism CSS**. Designed with clean centered navigation, quick user switching, AI book recommendations, multi-category notification alerts, collapsible sidebar navigation, and automated Indian Rupee (₹) overdue fine calculation.

</div>

---

## 🌐 Live Application & Links

- 🚀 **Live Production Link:** [https://deekshith-stack.github.io/LibraryManagementSystem/](https://deekshith-stack.github.io/LibraryManagementSystem/)
- 📂 **GitHub Repository:** [https://github.com/Deekshith-stack/LibraryManagementSystem](https://github.com/Deekshith-stack/LibraryManagementSystem)

---

## 👥 Three Tailored User Roles

<div align="center">

| 🎓 **Student** | 📖 **Librarian** | ⚙️ **Admin** |
| :---: | :---: | :---: |
| Browse & Search Catalog | Manage Book Inventory | View Analytics & Key Metrics |
| AI Smart Book Recommendations | Issue & Return Desk (+7, +14, +30d) | Manage User Directory & Roles |
| Track Active Loans & Due Dates | Approve/Reject Hold Requests | Configure Lending Policies |
| Pay Fines & Download Receipts (₹) | Send Overdue Reminder Notices | Export Books, Loans & Users as CSV |

</div>

---

## 🌟 Key Platform Features

- **🎯 Centered Navbar Branding:** Clean top navigation with centered **LMS** title and collapsible sidebar icon.
- **👤 User Switcher Popover:** Profile avatar in the top right displaying current user's name (`a`, `Librarian`, `Admin`) and title (`Student`, `Librarian`, `Admin`).
- **⭐ Smart Book Recommendations:** Intelligent scoring engine personalizing suggestions based on borrowing history, genre affinity, wishlist bookmarks, and reader ratings with match percentages (`98% Match`).
- **⭐ Notification Center:** Dropdown & modal hub delivering real-time alerts:
  - 🔔 *"Your book is due tomorrow."*
  - ⚠️ *"You have ₹40 pending fine."*
  - 📚 *"Your reserved book is now available."*
  - 🎉 *"New books added in Programming."*
- **🎛️ Collapsible Sidebar:** Toggle button in navbar and sidebar header to hide/unhide the navigation rail.
- **🕒 Live Clock & Status:** Real-time system clock in the navbar with pulsating live status dot.
- **💰 Indian Rupee (₹) Fine Engine:** Automatic calculation of late fees (default: `₹5.00/day`) and simulated UPI/Card payment checkout with receipts.
- **💾 Local Persistence:** Browser-backed state synchronization (`localStorage`) preserving custom books, transactions, and settings.

---

## 📁 Project Directory Structure

```text
LibraryManagementSystem/
├── .github/
│   └── workflows/
│       └── deploy.yml                      # GitHub Actions automated deployment
├── public/
│   ├── favicon.svg                         # Favicon
│   └── icons.svg                           # SVG sprite definitions
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx               # Metrics, charts & CSV exports
│   │   │   ├── LibrarySettings.jsx         # Circulation rules & fine rates (₹)
│   │   │   └── UserManagement.jsx          # User directory & access management
│   │   ├── Librarian/
│   │   │   ├── BookCatalog.jsx             # Inventory management & stock monitor
│   │   │   ├── IssueReturn.jsx             # Issue/return desk & renewals
│   │   │   └── Reservations.jsx            # Hold requests & approval queue
│   │   ├── Shared/
│   │   │   ├── Modal.jsx                   # Reusable glassmorphic modal
│   │   │   ├── Navbar.jsx                  # Centered LMS navbar & user switcher
│   │   │   ├── NotificationCenterModal.jsx # Multi-category notification center modal
│   │   │   └── Sidebar.jsx                 # Collapsible sidebar navigation
│   │   └── Student/
│   │       ├── SmartRecommendations.jsx    # AI personalized recommendations widget
│   │       ├── StudentCatalog.jsx          # Book discovery, search & reader reviews
│   │       ├── StudentDashboard.jsx        # Dashboard, reading streak & active loans
│   │       └── StudentFines.jsx            # Fine checkout gateway & digital receipts
│   ├── context/
│   │   └── LibraryContext.jsx              # Unified state & recommendation engine
│   ├── utils/
│   │   └── mockData.js                     # Starter dataset & seed alerts
│   ├── App.css                             # Layout helpers
│   ├── App.jsx                             # Application shell
│   ├── index.css                           # Design system & tokens
│   └── main.jsx                            # React 19 root mount
├── package.json                            # Scripts & dependencies
├── README.md                               # Project documentation
└── vite.config.js                          # Vite bundler configuration
```

---

## ⚡ Local Setup & Deployment

### Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/Deekshith-stack/LibraryManagementSystem.git
cd LibraryManagementSystem

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Production Build & Deploy
```bash
# Deploy to GitHub Pages
npm run deploy
```

---

## 📄 License

This project is licensed under the **MIT License**.
