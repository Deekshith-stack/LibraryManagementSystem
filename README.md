<div align="center">

# ✨ Lumina Library OS

### Next-Gen Digital Knowledge & Circulation Platform

<img src="https://readme-typing-svg.demolab.com?font=Plus+Jakarta+Sans&weight=700&size=26&duration=3500&pause=1000&color=06B6D4&center=true&vCenter=true&width=750&lines=Lumina+Library+OS+%E2%80%A2+Next-Gen+Platform;Scholar+%7C+Circulation+%7C+Apex+Portals;AI+Smart+Recommendations+%E2%80%A2+Match+Scores;Multi-Category+Notification+Center;Luxury+Glassmorphic+Interface" alt="Typing SVG" />

<br/><br/>

<a href="https://deekshith-stack.github.io/LibraryManagementSystem/">
  <img src="https://img.shields.io/badge/🚀%20OPEN%20LUMINA%20OS-Visit%20Platform-06B6D4?style=for-the-badge" alt="Live Demo"/>
</a>
&nbsp;
<a href="https://github.com/Deekshith-stack/LibraryManagementSystem">
  <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Design%20System-Lumina%20Glass-06B6D4?style=flat-square" />
<img src="https://img.shields.io/badge/Deployment-GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />

<br/><br/>

> **Lumina Library OS** is a state-of-the-art digital library platform engineered with **React 19**, **Vite**, and custom **Glassmorphism CSS**. It offers distinctive portal editions tailored for **Scholars (Students)**, **Circulation Staff (Librarians)**, and **Apex Administrators**, unified with AI book recommendation scoring, instant notifications, collapsible rail navigation, and Indian Rupee (₹) automated fine settlement.

</div>

---

## 🌐 Live Application & Links

- 🚀 **Live Production Link:** [https://deekshith-stack.github.io/LibraryManagementSystem/](https://deekshith-stack.github.io/LibraryManagementSystem/)
- 📂 **GitHub Repository:** [https://github.com/Deekshith-stack/LibraryManagementSystem](https://github.com/Deekshith-stack/LibraryManagementSystem)

---

## 🎨 Three Distinct Portal Experiences

<div align="center">

| 🎓 **Lumina Scholar** | 📖 **Lumina Circulation** | ⚙️ **Lumina Apex Console** |
| :---: | :---: | :---: |
| *Cyan & Indigo Celestial Vibe* | *Emerald & Teal Operational Desk* | *Violet & Rose Executive Suite* |
| AI Recommendation Scoring | Shelf Stacks & Low-Stock Alerts | Real-Time Audit Telemetry Stream |
| Daily Reading Streaks | 1-Click Lending Windows (+7, +14, +30d) | Category Distribution Progress Bars |
| Active Loan Due-Date Chips | Hold Request Processing Queue | User Governance & RBAC Directory |
| Digital Receipts & UPI / Card Pay | Fine Recovery & Overdue Alerts | One-Click CSV System Snapshots |

</div>

---

## 🌟 Key Platform Features

- **⭐ Smart Book Recommendations:** Heuristic AI engine personalizing book suggestions based on user borrowing history, category affinity, wishlist bookmarks, and reader ratings, complete with match percentage tags (`98% Match`) and affinity reasons (*"Because you read Clean Code"*, *"Top Rated in Programming"*).
- **⭐ Real-Time Notification Center:** Dropdown & dedicated modal hub delivering instant alerts:
  - 🔔 *"Your book is due tomorrow."*
  - ⚠️ *"You have ₹40 pending fine."*
  - 📚 *"Your reserved book is now available."*
  - 🎉 *"New books added in Programming."*
- **🎛️ Collapsible Sidebar (Hide / Unhide):** Space-saving desktop icon-rail mode and fluid off-canvas drawer on mobile screens with top navbar toggle.
- **✨ Interactive Role Switcher:** Segmented top navbar pills with active glow accents allowing instant switching between Scholar, Circulation, and Apex views.
- **💰 Automated Indian Rupee (₹) Engine:** Real-time calculation of late fees (default: `₹5.00/day`), checkout drawer with card/UPI simulation, and digital receipt generation.
- **💾 Browser-Synced Local State:** LocalStorage caching ensures seamless offline-ready data persistence across browser sessions.

---

## 🏛️ System Architecture

```mermaid
graph TD
    App[Lumina Library OS - Root Shell] --> LP[LibraryProvider - React Context]
    LP --> Storage[(Browser LocalStorage - lms_v3)]
    
    LP --> Nav[Navbar - Interactive Role Switcher & Live Notifications]
    LP --> Side[Sidebar - Collapsible Navigation Rail]
    
    LP --> SP[🎓 Lumina Scholar Portal]
    LP --> LIB[📖 Lumina Circulation Desk]
    LP --> ADM[⚙️ Lumina Apex Console]
    
    SP --> S1[Scholar Dashboard & Streaks]
    SP --> S2[AI Smart Recommendations]
    SP --> S3[Interactive Library Catalog]
    SP --> S4[Fines & UPI/Card Payments]
    
    LIB --> L1[Book Inventory & Shelf Stacks]
    LIB --> L2[Issue / Return Desk + Presets]
    LIB --> L3[Hold Queue Approval Desk]
    
    ADM --> A1[Executive Analytics & Telemetry]
    ADM --> A2[Patron Directory & RBAC]
    ADM --> A3[Circulation Policies & CSV Exports]
```

---

## 📁 Project Directory Structure

```text
LibraryManagementSystem/
├── .github/
│   └── workflows/
│       └── deploy.yml                      # GitHub Actions automated deployment
├── public/
│   ├── favicon.svg                         # Lumina OS Favicon
│   └── icons.svg                           # SVG sprite definitions
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx               # Lumina Apex analytics & telemetry feed
│   │   │   ├── LibrarySettings.jsx         # Circulation policies & fine rates (₹)
│   │   │   └── UserManagement.jsx          # Patron & staff credentials management
│   │   ├── Librarian/
│   │   │   ├── BookCatalog.jsx             # Inventory cataloger & shelf stack monitor
│   │   │   ├── IssueReturn.jsx             # Circulation checkout desk & renewals
│   │   │   └── Reservations.jsx            # Student hold requests & approval queue
│   │   ├── Shared/
│   │   │   ├── Modal.jsx                   # Reusable glassmorphic popup modal
│   │   │   ├── Navbar.jsx                  # Segmented role switcher & notification hub
│   │   │   ├── NotificationCenterModal.jsx # Multi-category notification center modal
│   │   │   └── Sidebar.jsx                 # Collapsible navigation rail & brand badge
│   │   └── Student/
│   │       ├── SmartRecommendations.jsx    # AI personalized recommendations widget
│   │       ├── StudentCatalog.jsx          # Book discovery, search & reader reviews
│   │       ├── StudentDashboard.jsx        # Scholar dashboard, streaks & loan chips
│   │       └── StudentFines.jsx            # Fine checkout gateway & digital receipts
│   ├── context/
│   │   └── LibraryContext.jsx              # Lumina unified context & recommendation engine
│   ├── utils/
│   │   └── mockData.js                     # Lumina starter dataset & seed alerts
│   ├── App.css                             # Layout helpers
│   ├── App.jsx                             # Application shell & portal router
│   ├── index.css                           # Lumina Luxury Glassmorphic Design System
│   └── main.jsx                            # React 19 root mount
├── package.json                            # Scripts & dependencies
├── README.md                               # Comprehensive documentation
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
