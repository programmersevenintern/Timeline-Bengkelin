# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Dashboard Timeline Marketing Bengkelin": a React 19 + Vite + Tailwind v4 SPA for the Bengkelin marketing team to plan and track a campaign (activities timeline, target workshops, weekly evaluations, social media account notes). Backend is Supabase only (auth + one table); there is no server code. Scaffolded from Google AI Studio, which explains `metadata.json`, the `DISABLE_HMR` switch in `vite.config.ts`, and the unused `@google/genai` / `express` / `dotenv` dependencies.

## Commands

- `npm run dev`: dev server on port 3000 (`--host=0.0.0.0`)
- `npm run build`: production build to `dist/`
- `npm run lint`: typecheck only (`tsc --noEmit`); there is no ESLint and no test suite

Env: copy `.env.example` to `.env` (it already holds the project's `VITE_SUPABASE_URL` and public anon key). Never put the Postgres connection string or other server secrets there; the app doesn't need them. Without the two vars the app renders `SupabaseSetupView` instead of the dashboard (`src/lib/supabase.ts` validates them).

## Architecture

- **Single shared document.** All data lives in one row of `public.marketing_app_state` (`id = 'shared'`, `data jsonb` holding `activities`, `workshops`, `evaluations`, `socialAccounts`). See `supabase/schema.sql` for the table and RLS (authenticated users only; `anon` revoked).
- **`src/App.tsx` owns all state.** After login it loads the row once, validates the shape with `isSharedAppData`, and keeps the four arrays in React state. Every change triggers a debounced (400 ms) upsert of the **whole document**. Consequence: last write wins; two users editing at once overwrite each other, and there is no realtime subscription.
- Child views (`TimelineTable`, `WorkshopTargetsView`, `WeeklyEvaluationView`, `SocialAccountsView`) are presentational and receive data plus handlers from `App.tsx`; IDs are generated client-side (`ws-${Date.now()}` etc.).
- **Adding a new collection** means touching: `SharedAppData` + `isSharedAppData`, the load effect, the save effect payload and deps, the sign-out reset, `handleResetData`, the `default` in `supabase/schema.sql`, and the type in `src/types/marketing.ts`. Existing rows without the new key fail `isSharedAppData`, so handle migration.
- Auth is email/password (`signInWithPassword` in `LoginView.tsx`); there is no sign-up flow, so accounts are created in the Supabase dashboard.
- PDF export is `window.print()` on a print-only report rendered at the bottom of `App.tsx`, toggled by `.print-only` rules in `src/index.css`.
- Domain enums (activity categories/statuses, workshop visit statuses) are string unions in `src/types/marketing.ts`; badge colors for them are in `src/utils/styleHelpers.ts`, Indonesian date formatting in `src/utils/dateUtils.ts`.

## Conventions

- UI text is Indonesian; keep new strings Indonesian.
- Icons from `lucide-react`, animation from `motion`.
- Files are stored LF in git but checked out CRLF (`core.autocrlf`); check `git diff --stat` after edits.
