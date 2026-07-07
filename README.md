<div align="center">

# 🌍 Global Earthquake Analytics Platform

**A production-grade, full-stack web application for real-time global seismic activity monitoring, advanced analytics, and collaborative incident management.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-Map-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

[Live Demo](#) · [API Docs](#-api-documentation) · [Report Bug](https://github.com/Kshitij-Pandey2605/global_earthquakes_kshitij_pandey/issues)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Data Source](#-data-source)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🔎 About the Project

The **Global Earthquake Analytics Platform** is a comprehensive, full-stack web application built to visualize, analyze, and manage over **21,500 significant global seismic events** spanning a decade (2015–2025). It combines a production-grade REST API backend with a modern, responsive React dashboard that enables users to:

- Explore earthquakes on a live **interactive world map** with magnitude-scaled, color-coded markers
- Analyse patterns through **real-time aggregated statistics** and trend charts
- Administer earthquake records via a complete **admin CRUD interface**
- Experience the data across **table, map, and split-view** layouts with dynamic filtering

---

## ✨ Key Features

### 🗺️ Interactive World Map
- **Leaflet.js** powered map with CartoDB light and dark basemaps
- Circle markers scaled by magnitude with color-coded severity (Red → Orange → Amber → Green)
- Pulsing CSS animation on major events (≥ 6.0 magnitude)
- Custom popup cards with location, depth, time, and "View Full Analysis" deep-link
- Live map updates when filters change on the Earthquakes Ledger page

### 📊 Analytics & Statistics
- Dashboard KPI cards: total events, average magnitude, max magnitude, deepest event
- Monthly trend area charts (Recharts)
- Distribution pie/bar charts by magnitude category
- Statistics page with top-10 country breakdown and magnitude category tables

### 🔐 Authentication & Security
- JWT-based authentication with **Access Token + Refresh Token** rotation
- Role-based access control (`admin` / `user`)
- bcrypt password hashing (cost factor 12)
- HTTP-only cookie storage + localStorage fallback
- Rate limiting, Helmet security headers, CORS whitelisting
- Input validation and sanitization on all endpoints

### 📋 Earthquake Ledger (CRUD)
- Paginated, sortable, and filterable table (search, magnitude, depth, status, network)
- Three view modes: **Table only**, **Map only**, **Split View** (map + table side by side)
- Admin inline Edit and Delete with confirmation dialogs
- Admin "Add Event" modal form

### 👤 User Profile
- Profile update (name, email)
- Password change with current password verification
- Account deletion

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js 18+** | Runtime environment |
| **Express.js 4** | HTTP server and routing |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose 8** | ODM with schemas and aggregations |
| **JSON Web Tokens** | Access and refresh token auth |
| **bcryptjs** | Password hashing |
| **express-rate-limit** | Route-level rate limiting |
| **Helmet** | Security HTTP headers |
| **Morgan** | HTTP request logging |
| **express-validator** | Input validation |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Leaflet.js** | Interactive world map |
| **Recharts** | Data visualization charts |
| **Axios** | HTTP client with interceptors |
| **React Router 6** | Client-side routing |
| **React Icons** | Icon library (Feather set) |

### DevOps & Deployment
| Platform | Service |
|---|---|
| **Render** | Backend API hosting |
| **Netlify** | Frontend static site hosting |
| **MongoDB Atlas** | Cloud database (Free M0 tier) |
| **GitHub** | Version control and CI |

---

## 📁 Repository Structure

```
global_earthquakes_kshitij_pandey/
│
├── backend/                        # Node.js REST API
│   ├── src/
│   │   ├── app.js                  # Express app setup, middleware, server init
│   │   ├── config/index.js         # Centralised env-var config
│   │   ├── controllers/            # Route handler logic
│   │   │   ├── auth.controller.js  # Register, login, logout, profile
│   │   │   └── earthquake.controller.js  # CRUD + aggregation stats
│   │   ├── middleware/             # Auth protect, rate limiter, cache, validator
│   │   ├── models/                 # Mongoose schemas (User, Earthquake)
│   │   ├── routes/                 # Express route definitions
│   │   ├── scripts/                # importData.js — seed MongoDB
│   │   └── utils/                  # AppError, asyncHandler, apiFeatures
│   ├── .env.example                # Environment variable template
│   └── package.json
│
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── EarthquakeMap.jsx   # Leaflet world map component
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (login, logout, register)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # KPI cards + map + charts
│   │   │   ├── Earthquakes.jsx     # Ledger with map/table/split views
│   │   │   ├── Statistics.jsx      # Aggregated stats tables
│   │   │   ├── Analytics.jsx       # Deep-dive charts
│   │   │   ├── EarthquakeDetails.jsx  # Single event detail view
│   │   │   ├── Admin.jsx           # User management (admin only)
│   │   │   ├── Profile.jsx         # User profile settings
│   │   │   ├── Login.jsx           # Sign in page
│   │   │   └── Register.jsx        # Sign up page
│   │   └── services/api.js         # Axios instance with JWT interceptors
│   ├── .env.example
│   └── package.json
│
├── netlify.toml                    # Netlify frontend deployment config
├── render.yaml                     # Render backend deployment config
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js **v18+** and npm v9+
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free M0 tier works)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Kshitij-Pandey2605/global_earthquakes_kshitij_pandey.git
cd global_earthquakes_kshitij_pandey
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy env template
cp .env.example .env

# Open .env and fill in your MONGODB_URI and JWT_SECRET
# (See Environment Variables section below)

# Seed the database with 21,500+ earthquake records
npm run import:data

# Start the dev server
npm run dev
# → API running at http://localhost:5000/api/v1
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create a local env file
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env

# Start the Vite dev server
npm run dev
# → App running at http://localhost:5173
```

### 4. Create Your First User

Visit **`http://localhost:5173/register`** and create an account. Your credentials are stored securely in MongoDB Atlas — anyone can self-register.

> **Admin access**: To get admin privileges (Edit/Delete earthquakes, User Management), open a MongoDB client or Atlas UI and update your user's `role` field to `"admin"`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ Yes | Access token signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | No | Access token lifetime (default: `7d`) |
| `JWT_REFRESH_SECRET` | ✅ Yes | Refresh token signing secret |
| `JWT_REFRESH_EXPIRE` | No | Refresh token lifetime (default: `7d`) |
| `CORS_ORIGIN` | ✅ Yes | Allowed frontend origin(s), comma-separated |
| `RATE_LIMIT_MAX` | No | Max requests per 15 min window (default: `100`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ Yes | Backend API base URL (e.g. `https://api.onrender.com/api/v1`) |

---

## 📬 API Documentation

The complete Postman collection is available at **[`/backend/postman_collection.json`](./backend/postman_collection.json)**.

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

All protected routes require a Bearer token in the `Authorization` header:

```http
Authorization: Bearer <your_access_token>
```

---

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create a new user account |
| `POST` | `/auth/login` | Public | Log in and receive JWT tokens |
| `POST` | `/auth/logout` | Public | Invalidate refresh token |
| `GET` | `/auth/profile` | 🔒 User | Get current user profile |
| `PATCH` | `/auth/profile` | 🔒 User | Update name / email |
| `POST` | `/auth/change-password` | 🔒 User | Change password |
| `POST` | `/auth/refresh` | Public | Refresh access token |

### Earthquake Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/earthquakes` | Public | List earthquakes (filterable, paginated) |
| `POST` | `/earthquakes` | 🔑 Admin | Create a new earthquake record |
| `GET` | `/earthquakes/stats` | Public | Get aggregated statistics |
| `GET` | `/earthquakes/:id` | Public | Get a single earthquake by ID |
| `PATCH` | `/earthquakes/:id` | 🔑 Admin | Update an earthquake record |
| `DELETE` | `/earthquakes/:id` | 🔑 Admin | Delete an earthquake record |

### Query Parameters (GET /earthquakes)

| Parameter | Type | Example | Description |
|---|---|---|---|
| `page` | number | `1` | Page number (default: 1) |
| `limit` | number | `20` | Records per page (default: 20, max: 500) |
| `sort` | string | `time` | Sort field: `time`, `mag`, `depth` |
| `order` | string | `desc` | Sort direction: `asc` or `desc` |
| `search` | string | `Japan` | Search by place name |
| `minMag` | number | `5.0` | Minimum magnitude filter |
| `maxMag` | number | `9.0` | Maximum magnitude filter |
| `minDepth` | number | `10` | Minimum depth in km |
| `maxDepth` | number | `700` | Maximum depth in km |
| `status` | string | `reviewed` | Filter by status: `reviewed` or `automatic` |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server liveness check |

---

## ☁️ Deployment

### Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect this GitHub repository
3. Render will auto-detect `render.yaml`
4. Add environment variables in the Render dashboard:
   - `MONGODB_URI` → your Atlas connection string
   - `CORS_ORIGIN` → your Netlify URL (after deploying frontend)
5. Click **Deploy**

### Deploy Frontend on Netlify

1. Go to [netlify.com](https://netlify.com) → **Add New Site** → **Import from Git**
2. Connect this GitHub repository — `netlify.toml` is auto-detected
3. Add environment variable in Netlify Site Settings:
   - `VITE_API_URL` → `https://your-render-service.onrender.com/api/v1`
4. Click **Deploy**

> ⚠️ After both are deployed, update `CORS_ORIGIN` on Render to your final Netlify URL and redeploy.

---

## 📊 Data Source

The earthquake dataset covers **10 years of global seismic activity (2015–2025)** and includes all events with a Richter magnitude ≥ 4.5, sourced from the **United States Geological Survey (USGS)** public earthquake catalog. Each record includes:

- Geographic coordinates (latitude, longitude, depth)
- Magnitude and magnitude type
- Event location description
- Timestamp (UTC)
- Seismographic network identifier
- Review status (automatic / reviewed)

> **Dataset size**: ~21,500 earthquake records | **Coverage**: Worldwide

---

## 🗺️ Future Roadmap

| Feature | Priority |
|---|---|
| Real-time earthquake feed via USGS WebSocket API | 🔴 High |
| Email/SMS alerts for major seismic events (≥ 7.0) | 🔴 High |
| Heatmap layer overlay on the world map | 🟡 Medium |
| Magnitude trend forecasting using ML (Python microservice) | 🟡 Medium |
| PWA support with offline caching and push notifications | 🟡 Medium |
| Public API key management for third-party access | 🟢 Low |
| Mobile app (React Native) | 🟢 Low |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 👨‍💻 Author

**Kshitij Pandey**

[![GitHub](https://img.shields.io/badge/GitHub-Kshitij--Pandey2605-181717?style=flat-square&logo=github)](https://github.com/Kshitij-Pandey2605)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ and a lot of seismic data.

⭐ Star this repo if you found it useful!

</div>
