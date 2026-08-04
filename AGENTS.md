# AGENTS.md - Komorebi Learning Development Guide

## Project Structure

```
learning_japanese/
├── frontend/           # React Vite + TypeScript
├── backend/            # Laravel API (PHP 8.0+)
└── design/             # HTML/CSS design references
    ├── komorebi_learning/DESIGN.md
    └── *_code.html     # Design HTML pages
```

## Frontend (React + Vite)

**Development:**
```bash
cd frontend
npm run dev           # Vite dev server at http://localhost:5173
npm run build         # Production build
npm run lint          # Run oxlint
```

**Key Commands:**
- `npm run dev` - Start dev server (hot reload)
- `npm run build` - Production build (`tsc && vite build`)
- `npm run lint` - Lint with oxlint
- `npm run preview` - Preview production build

**Architecture:**
- `@/` aliases to `src/`
- `src/components/` - Reusable UI components (layout, dashboard, ui)
- `src/pages/` - Route pages (Dashboard, Login, Profile, Practice, Sensei)
- `src/services/` - API clients (supabase.ts, api.ts)
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utility functions

**Styling:**
- Tailwind CSS v4 with design tokens from `DESIGN.md`
- Custom utilities: `sakura-pattern`, `.squish:active`
- Design system colors: primary (`#864e5a`), secondary (`#ba002c`), surface, etc.

## Backend (Laravel 9.x)

**Development:**
```bash
cd backend
php artisan serve        # API at http://localhost:8000
php artisan migrate      # Run migrations (SQLite local)
php artisan db:seed      # Seed sample lessons
```

**Architecture:**
- `app/Http/Controllers/Api/` - API controllers (Auth, Dashboard, Lesson, Progress)
- `app/Services/SupabaseService.php` - HTTP client for Supabase REST API
- `app/Http/Middleware/SupabaseAuth.php` - Supabase JWT authentication middleware
- `app/Models/` - Eloquent models
- `database/migrations/` - Database migrations (for local SQLite)
- `database/seeders/` - Database seeders
- `database/supabase_schema.sql` - Supabase SQL schema (import to Supabase)
- `config/supabase.php` - Supabase connection configuration

**API Routes (all prefixed with `/api`):**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/sign-in` | No | Sign in with email/OTP |
| POST | `/user` | Yes | Get current user |
| GET | `/dashboard` | Yes | Get dashboard data |
| GET | `/lessons` | Yes | List all lessons |
| GET | `/lessons/{lesson}` | Yes | Get lesson details |
| POST | `/lessons/{lesson}/complete` | Yes | Complete lesson with XP |
| GET | `/progress` | Yes | Get user progress |
| GET | `/progress/daily-goal` | Yes | Get daily goal |
| POST | `/progress` | Yes | Store progress |
| PUT | `/progress/{progress}` | Yes | Update progress |

**Authentication Flow:**
1. Frontend gets JWT from Supabase Auth (`supabase.auth.signInWithOtp`)
2. Frontend calls Laravel API with `Authorization: Bearer <jwt>`
3. `SupabaseAuth` middleware validates JWT against Supabase `/auth/v1/user` endpoint
4. Middleware sets `supabase_user_id` in request attributes
5. Controllers use this user ID for Supabase data API calls

## Supabase Setup

1. Create a project at [supabase.co](https://supabase.co)
2. Go to SQL Editor and import `backend/database/supabase_schema.sql`
3. Enable Row Level Security (RLS) - included in the schema
4. Copy the following from Project Settings > API:
   - `SUPABASE_URL` - Project URL
   - `SUPABASE_ANON_KEY` - anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` - service_role secret (for server-side)
5. Update `.env` files in both `frontend/` and `backend/`

## Environment Variables

**Frontend `.env`:**
```
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_API_BASE_URL=http://localhost:8000/api
```

**Backend `.env`:**
```
SUPABASE_URL=<supabase-url>
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## Running Everything

```bash
# Terminal 1 - Backend API
cd backend
php artisan serve

# Terminal 2 - Frontend dev server
cd frontend
npm run dev

# Optional - Frontend production preview
cd frontend
npm run build
cd ../backend
php artisan serve  # serves both API and frontend at /
```
