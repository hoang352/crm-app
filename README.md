# CRM System

Full-stack CRM matching the specification: customer registration, staff management, invoicing with automatic stats updates, and a manager dashboard.

## Stack

- **Backend:** Node.js, Express, Mongoose → MongoDB (`customers` and `invoices` collections)
- **Frontend:** React + Vite

## User roles (UI entry points)

| Role | Path | Capabilities |
|------|------|----------------|
| Customer | `/register` | Self-registration form → `customers` collection |
| Sales Staff | `/sales/*` | Add/browse customers, care notes, invoices, interaction history |
| Store Manager | `/manager/*` | Dashboard metrics, customer directory, analytics |

## Core modules (spec §6)

1. **Customer registration** — `POST /api/customers/register`
2. **Customer management** — CRUD + care notes at `/api/customers`
3. **Invoice management** — `POST /api/invoices` → `invoices` collection
4. **Stats auto-update** — On invoice create, `orderCount` and `totalSpending` update in a MongoDB transaction
5. **Dashboard** — `GET /api/dashboard/summary` (counts, revenue, segments, lead sources)

## Deploy (Vercel + hosted API)

Vercel runs the **frontend** only. The **Express backend** must be hosted separately (e.g. [Render](https://render.com), free tier).

### 1. Push the project to GitHub

Create a repo and push `crm-app` (do not commit `backend/.env`).

### 2. Deploy the backend (Render example)

1. [render.com](https://render.com) → **New** → **Web Service** → connect your repo.
2. **Root directory:** `backend`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. **Environment variables:**
   - `MONGODB_URI` — same Atlas string as local `.env`
   - `FRONTEND_URL` — your Vercel URL after step 3 (e.g. `https://your-crm.vercel.app`)
6. Deploy and copy the service URL, e.g. `https://crm-api.onrender.com`

In **Atlas → Network Access**, allow **0.0.0.0/0** (or Render’s outbound IPs) so the cloud server can reach MongoDB.

### 3. Deploy the frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
2. **Root directory:** `frontend`
3. **Framework:** Vite (auto-detected)
4. **Environment variable:**
   - `VITE_API_URL` = `https://crm-api.onrender.com/api` (your Render URL + `/api`)
5. Deploy → open the `*.vercel.app` URL.

### 4. Link Atlas ↔ Vercel (optional)

Atlas → **Connect** → **Connect with Vercel** only helps inject `MONGODB_URI` into **Vercel serverless** projects. This app keeps the database URI on the **backend** (Render), not in the Vercel frontend.

### Local vs production

| | Local | Production |
|---|--------|------------|
| Frontend | http://localhost:5173 | https://your-app.vercel.app |
| API | proxied `/api` → :5000 | `VITE_API_URL` → Render URL |
| Database | Atlas | Atlas (same cluster) |

---

## Setup

1. Install and run **MongoDB** locally (default URI: `mongodb://127.0.0.1:27017/crm`).

2. Backend:
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```

3. Frontend (new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open http://localhost:5173

Or from the repo root after installing root deps: `npm run install:all` then `npm run dev`.

## API reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers/register` | Public customer signup |
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Staff creates customer |
| PATCH | `/api/customers/:id` | Update contact / lead source |
| POST | `/api/customers/:id/notes` | Add care note |
| GET | `/api/invoices?customerId=` | List invoices |
| POST | `/api/invoices` | Create invoice + update customer stats |
| GET | `/api/dashboard/summary` | Manager metrics |

## Purchasing-value segments

| Segment | Total spending |
|---------|----------------|
| Bronze | &lt; $1,000 |
| Silver | $1,000 – $4,999 |
| Gold | $5,000 – $9,999 |
| Platinum | $10,000+ |
