# Stack Profile

| Key | Value |
|---|---|
| mode | `standard` |
| stack | `nextjs` |
| framework version | Next.js 16.4.2 (App Router, Cache Components + Partial Prefetching on), React 19.3 |
| language | TypeScript 5.9 (strict) |
| package manager | npm (see Tooling note below) |

## Tooling versions (pinned)

| Tool | Version |
|---|---|
| framework | `next@16.4.2`, `react@19.3.0` |
| typescript | `^5` (5.9.3) |
| eslint | `^9` (9.39.5) + `eslint-config-next@16.4.2` |
| eslint-plugin-boundaries | `^7` (7.2.0) — lint config is written for v7, do not downgrade |
| eslint-import-resolver-typescript | `^4` (4.4.5) |
| typescript-eslint | via `eslint-config-next/typescript` |
| test runner | `vitest@^4` (4.1.12) + `@testing-library/react@16` + `jsdom` |
| UI kit | shadcn/ui (style `base-nova`, Base UI primitives), Tailwind CSS 4 |

**Tooling note:** npm 10 fails to install `vitest` here with `Cannot read properties of null (reading 'edgesOut')` (peer-set bug). Use `npx npm@11 install` when adding test tooling, or upgrade npm.

## Vendor skills

| Skill | Source | Version | Installed to |
|---|---|---|---|
| — | — | — | none installed yet (candidates: `references/nextjs.md` § 1) |

## Commands

| Purpose | Command |
|---|---|
| dev | `npm run dev` |
| lint | `npm run lint` |
| typecheck | `npm run typecheck` |
| test (all) | `npm test` |
| test (single file) | `npx vitest run <path>` |
| build | `npm run build` (mock: `NEXT_PUBLIC_USE_MOCK=true npm run build`) |
| skills | `npm run skills:sync` / `npm run skills:check` |

## Layer map

| Layer | Folder |
|---|---|
| kernel (`Result`, `AppError`) | `src/shared/kernel` |
| shared UI atoms | `src/shared/ui` |
| shared pure helpers (`formatOrDash`, message map, `cn`) | `src/shared/lib` |
| app-wide infrastructure (http client, auth, observability) | `src/core` |
| DI accessors (`createServerPorts`) | `src/core/di` |
| composition root (route/app shell) | `src/app` |
| feature domain | `src/features/<feature>/domain` |
| feature application (ports, use cases) | `src/features/<feature>/application` |
| feature infrastructure (adapters, mappers, constants) | `src/features/<feature>/infrastructure` (`server/` for server-only adapters) |
| feature presentation | `src/features/<feature>/presentation` (`server/` RSC sections, `client/` interactive, `actions.ts` Server Actions) |
| routes / pages | `src/app/**/page.tsx` |

## Dependency injection

| Key | Value |
|---|---|
| mechanism | Server: `createServerPorts()` factory per request (`src/core/di/server-ports.ts`); mock vs HTTP chosen by `NEXT_PUBLIC_USE_MOCK` |
| port token | `interface` (structural typing) |
| composition root location | `src/app/**` + `src/core/di/**` |

## State

| Key | Value |
|---|---|
| server state | Server Components read ports directly inside `<Suspense>`; mutations via Server Actions + `useActionState` |
| client/UI state | local React state; no global store yet |

## HTTP

| Key | Value |
|---|---|
| client | `fetch` via `src/core/http/server-http.ts` (server-only, never throws, reads `access_token` cookie) |
| base URL source | `API_BASE_URL` (server env) |
| endpoints file | `src/core/http/api-endpoints.ts` |
| error normalizer | `src/core/http/to-app-error.ts` (+ feature business-code maps) |
| API contracts location | `guideline/api-contracts/` |
| backend envelope shape | `{ status: { code, message }, data }` |
| backend success codes | per feature, e.g. `TOP20000` (OK), `TOP20101` (created) |

## Testing

| Key | Value |
|---|---|
| unit runner | Vitest, default environment `node` |
| component testing | Testing Library; component tests start with `/** @vitest-environment jsdom */` |
| e2e | not set up yet |
| test location | `__tests__/` next to source; setup files in `test/` (outside `src/`) |

## Naming

| Item | Convention |
|---|---|
| files | kebab-case |
| components | PascalCase |
| functions, variables | camelCase; **only React hooks start with `use`** (eslint `react-hooks/rules-of-hooks`) |

## Shared UI atoms available

| Atom | Path |
|---|---|
| Button (+ `buttonVariants` for links) | `src/shared/ui/button.tsx` |
| Input | `src/shared/ui/input.tsx` |
| Label | `src/shared/ui/label.tsx` |
| RadioGroup, RadioGroupItem | `src/shared/ui/radio-group.tsx` |
| Card (+ Header, Title, Description, Content, Footer) | `src/shared/ui/card.tsx` |
| Skeleton | `src/shared/ui/skeleton.tsx` |
| EmptyState, ErrorState | `src/shared/ui/empty-state.tsx`, `error-state.tsx` |
| Add more | `npx shadcn@latest add <name>` (aliases in `components.json` point to `src/shared/ui`) |

## Git

| Key | Value |
|---|---|
| commit format | `<type>: <subject>` (no ticket in this sample) |
| allowed types | feat, fix, refactor, test, chore, docs |
| ticket pattern | — |
| default branch | main |
| MR/PR tool | gh |
