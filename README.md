# CampusConnect — Placement & Career Portal

A full-featured campus placement portal built with React, now with a Node.js + MongoDB backend for user registration/login.

## 🚀 Quick Start

```bash
cd campusconnect
npm install
npm run backend:install
```

### Start Backend (MongoDB)

```bash
npm run backend
```

The backend runs on **http://localhost:5000**

### Start Frontend

```bash
npm start
```

Opens at **http://localhost:3000**

---

## 🔌 Backend Environment

Create [backend/.env](backend/.env) (already added in this project) with:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Optional frontend API override in root [.env](.env):

```bash
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## 🔑 Demo Credentials

| Role       | Email                    | Password      |
|------------|--------------------------|---------------|
| Student    | student@campus.edu       | password123   |
| TPO/Admin  | admin@campus.edu         | admin123      |

Or **Sign Up** to create a new account — registration data is now saved in MongoDB.

---

## 📁 Project Structure

```
src/
├── App.js                        # Root router + providers
├── index.js                      # Entry point
├── index.css                     # Global styles & design tokens
│
├── context/
│   ├── AuthContext.js            # Auth + user state (localStorage)
│   └── JobsContext.js            # Jobs state (localStorage for admin jobs)
│
├── hooks/
│   └── useTheme.js               # Dark/light mode hook
│
├── data/
│   └── jobs.js                   # Static seed data
│
├── components/
│   ├── common/
│   │   ├── Navbar.js             # Top navigation bar
│   │   ├── Footer.js             # Footer
│   │   ├── StatusBadge.js        # Job/application status pill
│   │   └── CompanyAvatar.js      # Company logo avatar
│   │
│   ├── auth/
│   │   └── AuthModal.js          # Login / Signup modal
│   │
│   ├── home/
│   │   ├── HeroSection.js        # Hero + ticker
│   │   ├── StatsRow.js           # Stat cards
│   │   └── FeaturedRecruiters.js # Company grid
│   │
│   ├── jobs/
│   │   ├── JobCard.js            # Single job card + apply modal
│   │   └── JobFilters.js         # Search + filter bar
│   │
│   ├── dashboard/
│   │   └── StudentDashboard.js   # Student: overview, applications, saved, profile
│   │
│   └── admin/
│       └── AdminPanel.js         # TPO: overview, manage jobs, post job, applicants
│
└── pages/
    ├── HomePage.js               # Home page
    ├── JobsPage.js               # Jobs listing page
    ├── CompaniesPage.js          # Companies page
    └── AnalyticsPage.js          # Analytics & charts
```

---

## ✅ Features

### Authentication (localStorage persistent)
- Sign up with name, email, password, role, branch, CGPA, roll number
- Log in / Log out with session persistence (survives refresh)
- Role-based access: Student, Recruiter, TPO/Admin

### Student Features
- Browse & search/filter jobs
- Apply to jobs (with confirmation modal)
- Save / bookmark jobs
- Dashboard: view applications, saved jobs, edit profile
- Application status tracking (Applied → Shortlisted → Placed)

### TPO/Admin Features
- Post new job drives (saved to localStorage)
- Manage all jobs (update status, delete admin-posted jobs)
- View all applicants across all jobs
- Update applicant status (Applied / Shortlisted / Interviewing / Placed / Rejected)

### UI
- Light / Dark mode (system-synced + manual toggle)
- Responsive design
- Animated job cards, hero, stats
- Toast notifications for actions

---

## 🔧 Tech Stack

- **React 18** (Create React App)
- **localStorage** for data persistence
- **Lucide React** for icons (optional, not required)
- **Plus Jakarta Sans** + **JetBrains Mono** fonts

---

## 🌐 For Real Backend

Replace `localStorage` calls in `AuthContext.js` and `JobsContext.js` with:
- `fetch('/api/auth/login', ...)` → Node.js + Express
- MongoDB / PostgreSQL for storage
- JWT for session tokens
- bcrypt for password hashing
