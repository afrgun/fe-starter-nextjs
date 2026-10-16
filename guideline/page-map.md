# Page Map

Agent lookup table: resolve vague UI terms in a prompt to files **before** any broad search, then read only the mapped files.

- Path prefix: `src/` = repo `src/`.
- Routes are defined in: `src/app/**/page.tsx` (Next.js App Router).
- Data flow for a mapped area: route file → feature section/page → Server Action or port → infrastructure adapter → mapper.
- **Route file** = `src/app/<path>/page.tsx`; **Entry point (feature)** = the feature component that route file renders.

**Maintenance rule:** if a prompt resolves to files that are not in this table, or an entry is stale, update this file in the same change — including the alias the user actually typed.

## Top up

| Term (raw-prompt aliases) | Route | Route file | Entry point (feature) | Also see |
|---|---|---|---|---|
| top up, topup, isi saldo, bank list, pilih bank | `/topup` | `src/app/topup/page.tsx` | `src/features/topup/presentation/server/banks-section.tsx` | form: `.../presentation/client/topup-form.tsx`; action: `.../presentation/actions.ts`; use case: `.../application/create-topup.ts`; adapters: `.../infrastructure/server/http-*-repository.ts`, `.../infrastructure/mock-*-repository.ts`; mappers: `.../infrastructure/*.mapper.ts`; ports wiring: `src/core/di/server-ports.ts` |
| home, landing | `/` | `src/app/page.tsx` | — | — |

## Navigation & redirect hotspots

| Situation | File | Note |
|---|---|---|
| Mock vs real backend | `src/core/di/server-ports.ts` | `NEXT_PUBLIC_USE_MOCK=true` selects mock adapters |
| Page renders a frozen error after deploy | `src/core/http/server-http.ts` | Request data (`cookies()`) must be read before any early return so the route stays dynamic |
