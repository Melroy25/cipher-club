# 🛡️ CIPHER CLUB WEBSITE — BACKEND & CMS ADMIN DASHBOARD SETUP GUIDE

This project combines:
1. **Public Website**: React 19 + TypeScript + Vite + Tailwind CSS v3 with custom cyberpunk aesthetics, matrix rain canvas, CRT scanline effects, and interactive easter eggs.
2. **REST API Backend**: Node.js + Express + Prisma ORM + PostgreSQL.
3. **Private Admin Dashboard (`/admin`)**: Secure, full-featured CMS for managing leaders, events, workshops, activities, domains, projects, website copy, and media assets.

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **PostgreSQL Database**: Free cloud database (Neon, Supabase, Railway) or local PostgreSQL instance.

### 2. Configure Backend Environment
Navigate to `server/` and create your `.env` file (copied from `.env.example`):
```bash
cd server
copy .env.example .env
```
Open `server/.env` and update `DATABASE_URL` with your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@host:5432/cipher_db?sslmode=require"
SESSION_SECRET="generate-any-random-string-with-32-plus-characters"
JWT_SECRET="generate-any-random-string-with-32-plus-characters"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Content
Inside `server/`:
```bash
# Push schema to PostgreSQL database
npx prisma db push

# Seed initial website data (team members, events, activities, domains, text)
npm run seed
```

### 4. Create Your First Administrator Account
To ensure no hardcoded or default credentials exist, run the secure interactive setup CLI:
```bash
npm run create-admin
```
You will be prompted for:
- **Email**: Administrator email (e.g. `admin@cipher.sjec.ac.in`)
- **Name**: Administrator display name (e.g. `Lead Admin`)
- **Password**: Secure password (minimum 8 characters)

The script hashes the password with **bcrypt (cost factor 12)** and stores it safely in PostgreSQL.

---

### 5. Start Development Servers

**Terminal 1 — Backend API (port 4000):**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend & Admin UI (port 3000):**
```bash
# In project root (e:\cipher)
npm run dev
```

Open your browser:
- 🌐 **Public Website**: `http://localhost:3000`
- 🔒 **Private Admin Dashboard**: `http://localhost:3000/admin`

---

## 📊 Admin Dashboard Navigation & Sections

The admin dashboard is located at `/admin` and includes the 10 core sections:

| Section | Route | Capabilities |
|---|---|---|
| **Dashboard** | `/admin` | Metrics overview (members, events, activities, domains), quick actions, and security status. |
| **Team Members** | `/admin/members` | Full CRUD: name, role, department, biography, photo upload, GitHub/LinkedIn/Instagram URLs, order, active/draft toggle. |
| **Projects** | `/admin/projects` | Full CRUD: title, short description, detailed markdown/text, technologies, categories, GitHub and demo links, thumbnails. |
| **Events & Workshops** | `/admin/events` | Full CRUD: title, date tag, venue, status (Upcoming/Completed/Cancelled), full report description, and **photo slides gallery manager**. |
| **Activities** | `/admin/activities` | Full CRUD: numbered code (e.g. 01, 02), title, descriptions, display order, publish toggle. |
| **Domains** | `/admin/domains` | Full CRUD: domain name, session badge, description, icon picker (Code2, Crown, Users, Rocket, Cpu, etc.), publish toggle. |
| **Website Content** | `/admin/content` | Live text editor for Hero headings/subtitles, CTA buttons, About text, and Footer copyright/contact email. |
| **Media Library** | `/admin/media` | Upload new image assets, view file format and byte size, one-click copy image URL, preview, and safe delete. |
| **Settings** | `/admin/settings` | Change administrator password with verification, inspect runtime system metadata. |
| **Logout** | `/admin/login` | Invalidate HTTP-only cookie and destroy server-side session. |

---

## ☁️ Persistent Cloud Image Storage (Cloudinary)

To store uploaded photographs and posters persistently in production:
1. Create a free account at [cloudinary.com](https://cloudinary.com/).
2. Copy your credentials from the Cloudinary dashboard into `server/.env`:
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```
*Note: If Cloudinary keys are omitted, the backend automatically falls back to local disk storage in `server/public/uploads` for seamless local offline development.*

---

## 🚀 Production Deployment

### Option A: Frontend on Vercel + Backend on Render (Recommended Free Tier)
1. **Frontend (Vercel)**:
   - Your frontend is already configured for Vercel.
   - Add environment variable in Vercel Project Settings:
     `VITE_API_URL = https://your-backend-service.onrender.com`
2. **Backend (Render)**:
   - Create a **New Web Service** pointing to your GitHub repository with root directory `server`.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Add environment variables: `DATABASE_URL`, `SESSION_SECRET`, `JWT_SECRET`, `FRONTEND_URL`, and Cloudinary keys.

### Option B: Railway (One-click Postgres + Node)
1. In Railway, click **New Project** &rarr; **Provision PostgreSQL**.
2. Deploy the `server/` directory as a service. Railway automatically injects `DATABASE_URL`.
3. Run `npm run prisma:deploy` and `npm run seed`.

---

## 🔒 Security Summary
- **Authentication**: JWT token in HTTP-only, SameSite cookie + authorization headers.
- **Password Protection**: Salted bcrypt hash with cost factor 12.
- **Brute-Force Defense**: Rate limiting on `/api/auth/login` (5 requests per 15 minutes).
- **Public Isolation**: Public endpoints only return items marked `isActive: true` / `isPublished: true`.
- **Injection Safety**: Parameterized queries enforced through Prisma ORM.