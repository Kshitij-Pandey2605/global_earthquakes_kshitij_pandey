# 🌍 Global Earthquake Analytics Platform

A complete production-grade full-stack application for monitoring, analyzing, and administering global seismic activity.

---

## 📁 Repository Structure

This repository is split into two independent directory layers:

- **[`/backend`](./backend)**: Node.js, Express, and MongoDB REST API providing authentication, role-based controls, rate-limiting, and advanced query aggregations.
- **[`/frontend`](./frontend)**: React, Vite, and Tailwind CSS SPA dashboard featuring interactive Recharts visualization charts, an incident ledger table, and admin CRUD controls.

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB instance (Local or Atlas cloud connection)

---

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET keys

# Seed the database (optional)
npm run seed

# Start the API server
npm run dev
```
The server will run on `http://localhost:5000/api/v1`.

---

### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Setup environment variables
# Create a .env file and set the API location:
# VITE_API_URL=http://localhost:5000/api/v1

# Start the React dev server
npm run dev
```
The client app will be accessible at `http://localhost:5173`.

---

## 📬 Postman Collection & API Docs

- The backend's endpoints, request shapes, and auth schemes are documented in detail inside the [Backend README](./backend/README.md).
- A complete Postman collection is located at [`/backend/postman_collection.json`](./backend/postman_collection.json).
