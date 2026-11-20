# GU TECH Learning Management System

A responsive internal LMS built with React, Vite, Node.js, Express, and Supabase. Authenticated operations run through a server API; PostgreSQL row level security protects data and Supabase Storage keeps course materials private.

## Repository layout

- `Front end/` contains the React application.
- `Back end/` contains the Express API, authorization middleware, and Supabase integration.
- `Back end/supabase/migrations/` contains the initial database migration.
- `Back end/supabase/schema.sql` is the SQL Editor alternative.
- `Back end/supabase/seed.sql` adds an optional starter course after an admin profile exists.

## Supabase setup

1. Create a Supabase project. Disable public signups in hosted Auth settings and add `http://localhost:5173/reset-password` to the redirect allow list. Set project URL, anon key, and service role key in `Back end/.env`; set URL and anon key in `Front end/.env.local`. The service role key is server only.
2. Apply the initial migration using the Supabase CLI (`supabase link` then `supabase db push`) or run `Back end/supabase/schema.sql` once in the SQL Editor. Do not apply both.
3. Create the first account in Supabase Auth and promote it in SQL Editor: `update public.profiles set role = 'admin' where email = 'you@example.com';`. Teachers are created by an admin on the Administration page. Students can register themselves at `/register`; each registration stays inactive until an admin approves it there, and the student sees no courses until an admin enrolls them. Keep public sign-ups disabled in Supabase Auth: registration goes through this API, not Supabase's own sign-up. Apply every migration in `Back end/supabase/migrations/` in order (or `schema.sql`, which already includes them).
4. Before deployment, set `FRONTEND_ORIGIN` and `PASSWORD_RESET_REDIRECT` in `Back end/.env` to deployed origins and configure the reset redirect in Supabase Auth.

## Run locally

In separate terminals:

```sh
cd "Back end"
npm install
npm run dev
```

```sh
cd "Front end"
npm install
npm run dev
```

The API listens on port 4000 and Vite on port 5173 by default. Blank environment files are templates; authentication and live data require Supabase project values. The `.env.example` files document expected variables.

For local Supabase development, install the CLI, then run `npm run db:start` and `npm run db:reset` from `Back end/`. `config.toml` disables signup. The optional seed is safe to run repeatedly and inserts a starter course only when an admin profile exists.

## Included workflows

- Admin-managed account creation, activation, temporary password, course authoring, teacher assignment, and email-based student enrollment.
- Modules, lessons, private resources, assignments, submissions, grading, and CSV gradebook export.
- One-attempt timed quizzes with server scoring and separate private answer keys.
- Announcements, marks, classroom chat, complaints, profile editing, and password recovery/change.
- Audit records, role middleware, pagination, rate limits, private storage, and row level security policies.

Before production, configure HTTPS, Supabase Auth email delivery and redirect URLs, trusted frontend origins, backups, and monitoring. Never commit `.env` files or expose the service role key in the browser.

## UI / Design

The web app (`Front end/`) uses a small, token-based design system defined at the top of `src/styles.css`.

- **Typography:** Inter for body text and Plus Jakarta Sans for headings, loaded from Google Fonts. Body text is 14px or larger and labels are 12px or larger.
- **Colour:** a deep navy brand (`#0b1730` / `#10213f` / `#17305a`), a teal accent (`#14b8a6` / `#0d9488`) and an indigo secondary colour (`#6366f1`) on a `#f4f6fb` page background. Success, warning, danger and info tokens drive alerts and status pills.
- **Tokens:** a spacing scale (`--s-1` to `--s-10`), radius tokens (8 / 12 / 16px, and 14px for cards) and layered shadows (`--shadow-sm` / `--shadow-md` / `--shadow-lg`).
- **Components:** primary (navy gradient), secondary/outline, quiet and danger buttons at 40px height; 42px inputs with a teal focus ring and error states; status pills with one colour per status (draft, published, submitted, graded, overdue, due soon, pending, resolved, rejected and others); skeleton loading, empty and error states.
- **Motion:** page fade-in, modal scale-in and toast slide-in. All motion is turned off when the user sets `prefers-reduced-motion`.

### Responsive behaviour

| Width | Layout |
| --- | --- |
| ≥ 1440px | Content width is capped at 1320px and centred. |
| 1025–1439px | Full dark-navy sidebar. A topbar button collapses it to an icon-only rail (78px) with tooltips, and the choice is saved in `localStorage`. |
| 701–1024px | Tablet grid: two-column metrics, single-column dashboard panels, course cards that reflow, and a schedule week that scrolls sideways. |
| ≤ 700px | Off-canvas sidebar (Escape closes it and page scroll is locked while it is open), a fixed bottom navigation bar (Overview, Courses, Assignments, Schedule, Profile) with safe-area padding, touch targets of at least 44px, bottom-sheet modals, and tables that turn into stacked cards or scroll sideways. |

Print styles hide the sidebar, topbar and bottom navigation. The favicon and brand mark live in `public/favicon.svg` and the `BrandMark` component in `src/components/ui.jsx`.
