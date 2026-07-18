# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                 # dev server at localhost:4200 (ng serve)
npm run build              # production build, outputs to dist/
npm test                   # run unit tests (Vitest via @angular/build:unit-test)
npm run validate:data      # validate all hero JSON files in public/data/heroes/
npm run list:hero-routes   # print /heroes/:slug for every hero, sorted by name
npx ng deploy              # deploy to GitHub Pages via angular-cli-ghpages
```

There is no lint script configured. Formatting is via Prettier (`.prettierrc`: single quotes,
100 print width, `angular` parser for `*.html`) — run `npx prettier --write <files>` if asked to
format.

To run a single test file, pass a path filter to the Vitest-backed test runner, e.g.
`npm test -- src/app/app.spec.ts`.

**After editing any file under `public/data/heroes/*.json`, run `npm run validate:data`.** It
enforces required fields, valid `tier`/`types` enums, per-faction hero counts, a total of 86
heroes, and no duplicate `id`/`slug` — the expected-count tables in
`scripts/validate-heroes.mjs` must be updated by hand if heroes are added/removed.

## Architecture

Angular 21 standalone components throughout — no NgModules. All feature routes are lazy-loaded
via `loadComponent` in `src/app/app.routes.ts`.

**`src/app/`**
- `app.routes.ts` — all route definitions; the root path (`''`) currently points at the credits
  guide page, not a dashboard/home
- `core/`
  - `services/` — `HeroService` (loads and joins all 6 faction hero JSON files into one stream),
    `GuideService` (loads the static guide JSON pages), `AppPathService` and `HeroImageService`
    (both resolve relative asset/data URLs against `document.baseURI`)
  - `models/` — `Hero`, `HeroFaction`, `HeroNavigation`, guide page shapes, etc.
  - `constants/` — `FACTIONS` / `FACTION_NAVIGATION` (`factions.ts`), hero filter option lists
    (`hero-options.ts`)
- `features/` — one folder per route: `home`, `heroes` (`hero-directory`, `hero-detail`,
  `hero-card`, `hero-filters`), `factions/faction-details`, `guide` (`guide-index` plus one
  folder per guide page: `beginner-team`, `a-hero-pve`, `cc-dot`, `acronyms-faq`, `credits`),
  `about`, `style-guide`
- `layout/` — `AppShellComponent` wraps every route (header, sidebar, mobile-navigation, footer,
  `router-outlet`); it auto-closes the mobile menu on `NavigationEnd`
- `shared/components/` — presentational components: `badge`, `tier-badge`, `faction-badge`,
  `chip`, `panel`, `status-message`, `build-section`

**Data loading pattern:** all app data lives as static JSON under `public/data/` (not an API).
Services fetch it with `HttpClient` and cache with `shareReplay({ bufferSize: 1, refCount: true })`.
URLs are always resolved relative to `document.baseURI` (via `AppPathService.resolve()` /
`HeroService`'s own `resolveUrl()` / `HeroImageService.getImageUrl()`) rather than using
root-absolute paths — this is required because the app deploys to a GitHub Pages subpath, so a
literal `/data/...` URL would 404 in production. Follow this pattern for any new data/asset
fetch.

**Hero data:** `public/data/heroes/{superman,technology,dark,nature,god,universe}.json`, one file
per faction, shape defined by the `Hero` interface in `core/models/hero.model.ts`. Hero portrait
images live in `public/data/assets/heroes/<slug>.webp`, served via `HeroImageService`.

**Guide content:** `public/data/guide/*.json` (`introduction`, `beginner-team-building`,
`a-hero-pve`, `cc-dot`, `acronyms-faq`, `credits`, `navigation`), loaded by `GuideService`.

**Styles** (`src/styles/`)
- Single dark theme only — no light/dark toggle. All design tokens are CSS custom properties in
  `_variables.scss`: colors, tier colors (`--tier-s-plus`, `--tier-s`, `--tier-a`, `--tier-b`),
  faction colors (`--faction-<name>`), spacing (`--space-1`–`--space-8`), radii, shadows,
  transitions
- Component styles live next to their component as a sibling `.scss` file, set via `styleUrl`

**Factions:** `superman`, `technology`, `dark`, `nature`, `god`, `universe` — each has a
`--faction-<name>` CSS variable, a `/factions/:slug` route, and its own hero JSON file. The
faction list is centralized in `core/constants/factions.ts` (`FACTIONS`, `FACTION_NAVIGATION`,
`getFactionBySlug`) — don't hardcode the faction list elsewhere.

**TypeScript:** `strict: true` plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`, and Angular's `strictTemplates`/
`strictInjectionParameters`/`strictInputAccessModifiers` are all on.
