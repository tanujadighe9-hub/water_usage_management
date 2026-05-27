# 💧 AquaTrack — Full Stack MERN Water Usage Dashboard

A complete MERN stack application for tracking, understanding, and reducing daily water consumption.

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, React Router 6, Recharts, Axios       |
| Backend   | Node.js, Express 4                              |
| Database  | MongoDB (Mongoose ODM)                          |
| Auth      | JWT (jsonwebtoken) + bcryptjs password hashing  |
| Fonts     | DM Sans + Space Mono                            |

---

## Project Structure

```
aquatrack-fullstack/
├── backend/
│   ├── models/
│   │   ├── User.js          ← User schema + password hashing
│   │   ├── WaterUsage.js    ← Daily usage per category
│   │   └── Goal.js          ← Per-user daily goal
│   ├── routes/
│   │   ├── auth.js          ← Register, Login, /me
│   │   ├── user.js          ← Profile get/update
│   │   ├── usage.js         ← Save & fetch usage, alerts
│   │   └── goal.js          ← Set & get daily goal
│   ├── middleware/
│   │   └── auth.js          ← JWT verification middleware
│   ├── server.js            ← Express app entry point
│   ├── .env                 ← Environment variables
│   └── package.json
│
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.js    ← Global auth state
    │   │   ├── ToastContext.jsx  ← Popup notifications
    │   │   └── Toast.css
    │   ├── components/
    │   │   ├── Navbar            ← Top nav + user menu + logout
    │   │   ├── PrivateRoute      ← Auth guard
    │   │   ├── MetricCards       ← KPI summary (real data)
    │   │   ├── UsageCharts       ← Line + Bar + Donut (Recharts)
    │   │   ├── ManualInput       ← Per-category usage logger
    │   │   ├── GoalSetter        ← Set daily goal + progress bar
    │   │   ├── TipCard           ← Rotating water-saving tips
    │   │   └── Badges            ← Achievement badges (real logic)
    │   ├── pages/
    │   │   ├── Login.jsx         ← Login page
    │   │   ├── Register.jsx      ← Registration page
    │   │   ├── ProfileSetup.jsx  ← Profile setup + edit
    │   │   └── Dashboard.jsx     ← Main dashboard
    │   ├── api.js                ← Axios instance with JWT
    │   ├── App.jsx               ← Router + providers
    │   ├── index.js              ← React entry point
    │   └── index.css             ← Global CSS variables
    └── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org (download LTS)
- **MongoDB** — choose one:
  - Local: https://www.mongodb.com/try/download/community
  - Cloud (free): https://www.mongodb.com/atlas (recommended for beginners)

---

## Setup & Installation

### Step 1 — Configure environment

Open `backend/.env` and update if needed:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aquatrack
JWT_SECRET=aquatrack_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aquatrack
```

### Step 2 — Install & start the backend

```bash
cd backend
npm install
npm run dev        # development (with nodemon auto-restart)
# OR
npm start          # production
```

Backend runs at: **http://localhost:5000**

### Step 3 — Install & start the frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## Quick Start (copy-paste)

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm start
```

---

## API Endpoints

| Method | Endpoint              | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| POST   | /api/auth/register    | ✗    | Register new user                  |
| POST   | /api/auth/login       | ✗    | Login, receive JWT                 |
| GET    | /api/auth/me          | ✓    | Get current user                   |
| GET    | /api/user/profile     | ✓    | Get profile                        |
| PUT    | /api/user/profile     | ✓    | Update profile                     |
| GET    | /api/usage/today      | ✓    | Today's usage                      |
| GET    | /api/usage/week       | ✓    | Last 7 days                        |
| GET    | /api/usage/history    | ✓    | Full history                       |
| POST   | /api/usage            | ✓    | Save/update today's usage + alerts |
| GET    | /api/goal             | ✓    | Get daily goal                     |
| POST   | /api/goal             | ✓    | Set daily goal                     |

---

## Features

- **User registration & login** with JWT authentication
- **Profile setup & edit** (name, age, city, household size, phone)
- **Logout** from user dropdown menu in navbar
- **Manual usage logging** per category (Shower, Kitchen, Laundry, Drinking, Toilet)
- **Daily goal setting** — set a litre target, see progress bar update live
- **Smart alerts** (popup notifications):
  - ✓ Registration successful
  - ✓ Login successful
  - ⚠ You used extra water (over goal) — red alert
  - 🎉 Congratulations, you used less than yesterday
  - 📈 You used more water than yesterday
  - ✓ Within daily goal
- **Charts show real user data** — line, bar, and donut charts all pull from MongoDB
- **Achievements/badges** computed from real weekly data
- **Daily water saving tips** (India/Pune focused)
- **Dark themed** water-blue UI, fully mobile responsive

---

## Common Issues

| Problem | Fix |
|---|---|
| `ECONNREFUSED` on backend start | MongoDB not running — start MongoDB service or use Atlas |
| Frontend shows blank / network error | Make sure backend is running on port 5000 |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then retry |
| JWT errors after restart | Token may be expired — just log in again |
| Port 3000 already in use | Type `Y` when React asks to use a different port |

---

*Built with React · Node.js · Express · MongoDB · Recharts*
