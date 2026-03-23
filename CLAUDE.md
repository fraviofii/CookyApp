# CookyApp — CLAUDE.md

## Project Overview

**CookyApp** is a full-stack order management system for **Sucre Biscoiteria** (a bakery business). It handles order creation, kitchen workflow, client management, and reporting.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.4 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + shadcn/ui + Radix UI |
| Database | PostgreSQL 16 via `pg` (node-postgres) |
| Forms | React Hook Form + Zod |
| i18n | i18next (English + Portuguese BR) |
| Icons | Lucide React |
| Charts | Recharts |
| Notifications | Sonner |

## Project Structure

```
app/              # Next.js App Router pages & API routes
  api/init-db/    # DB initialization endpoint
  login/          # Auth page
  dashboard/      # Manager stats & analytics
  kitchen/        # Kitchen staff order view
  production/     # Order preparation view
  clients/        # Client (CRM) management
  orders/         # Orders list & management
  order/          # Create/view individual order
  products/       # Product catalog
  users/          # Staff management
  reports/        # Reports & analytics
  settings/       # App settings
  whatsapp-orders/# WhatsApp order integration
components/
  ui/             # shadcn/ui base components
  auth-provider.tsx
  dashboard-layout.tsx
  dashboard-nav.tsx
lib/
  db.ts           # Supabase CRUD operations
  supabase.ts     # Supabase client
  seed-db.ts      # Demo data seeding
  whatsapp-utils.ts
  i18n/           # Translations & language context
hooks/
  use-toast.ts
```

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```
DATABASE_URL=postgres://cooky:cooky@localhost:5432/cookyapp
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
```

**First-time setup**: Start a local PostgreSQL instance, then visit `/admin/init-db` to create the schema and seed demo data.

## Docker (local deployment)

```bash
docker compose up --build   # Starts PostgreSQL + app
docker compose down -v      # Stop and remove volumes
```

The PostgreSQL service auto-runs `database-setup.sql` on first boot (schema + seed data). The app is available at `http://localhost:3000`.

**Demo credentials** (after seeding):
- Manager: `manager@sucrebiscoiteria.com.br` / `password`
- Employee: `employee@sucrebiscoiteria.com.br` / `password`
- Sales: `sales@sucrebiscoiteria.com.br` / `password`

## Database Schema

5 tables in Supabase PostgreSQL:

- **users** — id, name, email, password, role (`manager|employee|sales`), created_at
- **products** — id, name, description, price, created_at
- **clients** — id, name, email, phone, created_at
- **orders** — id, client_id, total, status (`pending|accepted|in-progress|ready|delivered`), created_at
- **order_items** — id, order_id, product_id, quantity, price, observation, created_at

SQL schema lives in `database-setup.sql`.

## Architecture Notes

- **Auth**: Custom context-based auth stored in `localStorage`. No Supabase Auth. Role-based access control (RBAC) enforced in `components/auth-provider.tsx`.
- **Data access**: Direct Supabase client calls from components/pages (no API abstraction layer). All DB logic lives in `lib/db.ts`.
- **i18n**: Language state managed via `lib/i18n/language-context.tsx`. All translation keys defined in `lib/i18n/translations.ts`.
- **No tests**: No test framework is configured. Tests would need to be added.
- **Build flags**: `next.config.mjs` ignores ESLint and TypeScript errors during build — fix these before enabling strict checks.

## Role Permissions

| Feature | Manager | Sales | Employee |
|---|---|---|---|
| Dashboard | ✓ | ✓ | |
| Orders | ✓ | ✓ | |
| Clients | ✓ | ✓ | |
| Products | ✓ | | |
| Users | ✓ | | |
| Reports | ✓ | | |
| Kitchen | | | ✓ |

## Known Limitations

- Passwords stored in plaintext — must be hashed before production use.
- No test coverage.
- No API rate limiting or server-side auth validation.
- WhatsApp integration uses `wa.me/` links only (no official API).
