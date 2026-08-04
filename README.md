# Komorebi Learning

A Japanese language learning application built with:

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Laravel 9.x (PHP 8.0+ API)
- **Database/Auth:** Supabase (PostgreSQL + Auth + Storage)

## Quick Start

### Prerequisites
- PHP 8.0+
- Composer
- Node.js 20+
- npm

### Setup

1. **Clone and install dependencies:**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
composer install
```

2. **Configure Supabase:**
- Create a project at [supabase.co](https://supabase.co)
- Import `backend/database/supabase_schema.sql` in the SQL Editor
- Copy your credentials and update `.env` files (both frontend and backend)

3. **Start development servers:**
```bash
# Terminal 1 - Backend API (port 8000)
cd backend
php artisan serve

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

## Project Structure

```
learning_japanese/
├── frontend/           # React Vite + TypeScript
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API clients (Supabase + Laravel API)
│   │   └── types/       # TypeScript types
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/            # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   ├── Services/SupabaseService.php
│   │   └── Http/Middleware/SupabaseAuth.php
│   ├── database/
│   │   ├── migrations/    # Local SQLite migrations
│   │   ├── seeders/       # Seeders
│   │   └── supabase_schema.sql  # Supabase SQL
│   └── config/supabase.php
├── design/             # Design reference files
│   ├── komorebi_learning/DESIGN.md
│   └── *_code.html     # HTML design pages
└── AGENTS.md           # Development guide
```

## Design System

This project follows the **Komorebi Learning** design system defined in `design/komorebi_learning/DESIGN.md`.

Key tokens:
- **Colors:** Sakura Pink (#864e5a primary), Imperial Red (#ba002c secondary)
- **Fonts:** Noto Sans JP (Japanese), Montserrat (headings), Inter (body)
- **Shape:** Rounded (lg=16px, xl=24px)
- **Spacing:** 8px linear unit grid

## Development Commands

### Frontend
```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Run linter
npm run preview   # Preview production build
```

### Backend
```bash
php artisan serve        # Start API server
php artisan migrate      # Run migrations
php artisan db:seed      # Seed sample data
php artisan route:list   # List routes
php artisan test         # Run tests
```

## Architecture

```
Browser (React)  -->  Laravel API  -->  Supabase (PostgreSQL + Auth)
                     ^
                     | (SupabaseService uses HTTP client)
                     v
                    Supabase REST API (/rest/v1)
```

- **Auth:** Frontend uses `@supabase/supabase-js` for authentication (magic links). JWT is passed to Laravel API for user identity.
- **Data:** Laravel API proxies to Supabase REST API using service role key for admin-level access.
- **RLS:** Supabase Row Level Security is handled server-side via `security_definer` functions.
