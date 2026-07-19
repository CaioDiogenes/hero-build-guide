# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                 # dev server at localhost:4200 (ng serve)
npm run build              # production build, outputs to dist/
npm test                   # run unit tests (Vitest via @angular/build:unit-test)
npm run validate:data      # validate all hero JSON files in public/data/heroes/
npm run list:hero-routes   # print /heroes/:slug for every hero, sorted by name
npm run format              # prettier --write across src/ and scripts/
npm run format:check        # prettier --check (same scope) — run before considering work done
npx ng deploy              # deploy to GitHub Pages via angular-cli-ghpages

# Firestore hero data sync (requires GOOGLE_APPLICATION_CREDENTIALS to point at a
# Firebase service account key — see "Collaborative hero editing" below)
npm run sync:heroes        # export Firestore heroes -> public/data/heroes/*.json, then validate
npm run export:heroes      # export-only, no validation
npm run migrate:heroes     # one-time seed of Firestore from the static JSON — do not rerun once
                            # contributors have made live edits, it will overwrite their changes
```

To run a single test file, pass a path filter to the Vitest-backed test runner, e.g.
`npm test -- src/app/app.spec.ts`. There is no separate lint script — Prettier is the only
formatting gate (`.prettierrc`: single quotes, 100 print width, `angular` parser for `*.html`).

**After editing any file under `public/data/heroes/*.json`, run `npm run validate:data`.** It
hard-fails on required fields, valid `tier`/`types` enums (sourced from
`core/constants/hero-taxonomy.json`), per-faction hero counts, a total of 86 heroes, and
duplicate `id`/`slug`. It also **warns** (non-fatal) on missing icon assets for portraits, gems,
artifacts, stigmata, and collections — see the icon-mapping pattern below. The expected-count
table in `scripts/validate-heroes.mjs` must be updated by hand if heroes are added/removed.

## Architecture

Angular 21 standalone components throughout — no NgModules, `standalone: true` omitted (implicit
default). Component classes use **no `Component` suffix** (`HeroCard`, `AppShell`, `Chip`, not
`HeroCardComponent`) — this is an enforced convention, not an accident. All feature routes are
lazy-loaded via `loadComponent` in `src/app/app.routes.ts`.

**`src/app/`**
- `app.routes.ts` — all route definitions; the root path (`''`) points at the credits guide page,
  not a dashboard/home (there is no home route)
- `core/`
  - `services/` — `HeroService`, `GuideService`, and one `*ImageService` per icon-bearing item
    type: `HeroImageService`, `GemImageService`, `ArtifactImageService`, `StigmaImageService`,
    `CollectionImageService`. All URL building goes through `AppPathService.getUrl(path)` — no
    service builds a `new URL(...)` itself.
  - `models/` — `Hero`, `HeroFaction`, `HeroNavigation`, guide page shapes, etc. (all suffixed
    `*.model.ts`)
  - `constants/` — `factions.ts` (`FACTIONS`, `FACTION_NAVIGATION`, `getFactionBySlug`),
    `hero-options.ts` (`HERO_FACTION_OPTIONS`/`HERO_TIER_OPTIONS`/`HERO_TYPE_OPTIONS`, all derived
    from `hero-taxonomy.json`), `hero-taxonomy.json` (the single source of truth for the
    faction/tier/type lists — read by both the Angular constants above *and*
    `scripts/validate-heroes.mjs`, so they can't drift), `artifact-icons.json` (see below),
    `firebase.config.ts` (the Firebase web app config — not a secret, safe to commit; see
    "Collaborative hero editing" below)
- `features/` — one folder per route: `heroes` (`hero-directory`, `hero-detail`, `hero-card`,
  `hero-filters`, `hero-form` — the shared reactive form embedded by both `hero-edit` and
  `hero-add`, which are modal content, not routes — see "Collaborative hero editing" below),
  `factions/faction-details`, `guide` (`guide-index` plus one folder per guide page:
  `beginner-team`, `a-hero-pve`, `cc-dot`, `acronyms-faq`, `credits`), `about`, `style-guide`
- `layout/` — `AppShell` wraps every route (header, sidebar, mobile-navigation, footer,
  `router-outlet`); it auto-closes the mobile menu on `NavigationEnd`
- `shared/components/` — presentational components: `badge`, `tier-badge`, `faction-badge`,
  `chip`, `panel`, `status-message`, `build-section`, `modal` (native `<dialog>` wrapper — see
  "Collaborative hero editing" below), `tag-list-input` (a `ControlValueAccessor` chip editor for
  the `string[]` fields on `Hero`, used throughout `HeroForm`; its optional `options` input drives
  a suggestion dropdown)

**Data loading pattern:** guide/faction content lives as static JSON under `public/data/` (not an
API), fetched with `HttpClient` and cached via `shareReplay({ bufferSize: 1, refCount: true })`.
URLs for that content are always resolved via `AppPathService.getUrl(path)`, which builds against
`document.baseURI` rather than a root-absolute path — required because the app deploys to a
GitHub Pages subpath, where a literal `/data/...` URL would 404 in production. Every new
data/asset fetch must go through this service. **Hero data is the exception** — see below.

**Hero data:** lives in Firestore (collection `heroes`, one document per hero, doc ID = hero
`slug`), not static JSON — this is what lets signed-in contributors add/edit heroes directly in
the app. `HeroService` reads it via `collectionData()` from `@angular/fire/firestore` instead of
`HttpClient`, but keeps the same public method signatures (`getHeroes()`, `getHeroBySlug()`,
`getHeroesByFaction()`, `getHeroNavigationBySlug()`) plus `addHero()`/`updateHero()`. The shape is
still defined by the `Hero` interface in `core/models/hero.model.ts`.
`public/data/heroes/{superman,technology,dark,nature,god,universe}.json` still exists, but only as
a generated backup/offline snapshot — regenerate it with `npm run export:heroes` (or
`npm run sync:heroes` to also validate it) rather than hand-editing it; hand edits there don't
affect the live app.

**Icon-mapping pattern (portraits/gems/artifacts/stigmata/collections):** each icon-bearing item
type has a matching folder under `public/data/assets/<type>/` and a `*ImageService` with a
`getImageUrl(name): string | undefined` method. Most services (gems, stigmata, collections,
heroes) assume a uniform `.webp` extension and slugify the item name directly
(`lowercase, strip apostrophes, non-alphanumeric → dash`). `ArtifactImageService` is the
exception — the artifact art mixes extensions, so it looks the slug up in
`core/constants/artifact-icons.json` (a generated `{slug: filename}` manifest) instead of
assuming an extension. When adding a new icon set, check the actual asset folder's extensions
before deciding which of the two approaches to copy.

Icons are wired into `hero-detail` via `Chip`'s optional `icon`/`iconSize` inputs and
`BuildSection`'s matching `iconFor`/`iconSize` inputs (`iconFor: (item: string) => string |
undefined`, resolved per chip). Current sizes: gems 32px (default), stigmata/collections 50px,
artifacts 60px — each `<app-build-section [iconSize]="N">` call sets its own. An item with no
matching icon renders as a plain text chip with no request/error — `*ImageService.getImageUrl`
returns `undefined` for unmapped names (artifacts) or `Chip`'s `(error)` handler hides a 404'd
`<img>` (everything else). `scripts/validate-heroes.mjs` has a matching warn-only check for each
icon type, so a missing/misnamed asset shows up in `npm run validate:data` output instead of
silently degrading in the UI.

**Collaborative hero editing:** only allowlisted editors can add or edit heroes — being signed in
with Google (via `AuthService`, `core/services/auth.service.ts`) is not enough by itself.
`AuthService.isEditor$` derives editor status from whether a doc exists at
`editors/{uid}` in Firestore; that collection is not client-writable, so it's managed exclusively
via `scripts/manage-editors.mjs` (`npm run editors -- add|remove|list <email>`) or directly in
the Firebase console. `hero-directory`/`hero-detail` only render their "Add hero"/"Edit hero"
triggers when `isEditor()` is true, and `firestore.rules` independently re-checks the same
`editors/{uid}` existence before allowing any write — the UI check is convenience, the rules
check is the actual enforcement.

Add/edit happens in a modal, not a routed page — clicking "Add hero" or "Edit hero" opens
`HeroAdd`/`HeroEdit` (`features/heroes/hero-add/`, `features/heroes/hero-edit/`) inline over the
current page via the shared `Modal` component (`shared/components/modal/`, a native `<dialog>`
wrapper: presence in the DOM *is* the open state, mirroring how `MobileNavigation` already works
— no separate `open` input). Both wrap the shared `HeroForm` (`features/heroes/hero-form/`),
which emits a `HeroDraft` (`Hero` minus `id`/`slug`); the caller attaches the slug — generated
from the name via `core/utils/slug.util.ts` for new heroes, checked for uniqueness against the
loaded hero list before creating. Because `hero-detail` stays mounted underneath the edit modal
and reads Firestore live, closing the modal after a successful save shows the updated data with
no extra refetch. There is no review queue — writes go live immediately. Every
`HeroService.addHero()`/`updateHero()` call also appends an entry to the `heroEdits` Firestore
collection (`heroSlug`, `editorUid`/`editorEmail`, `previousValue`, `newValue`, `timestamp`) — an
append-only audit trail that exists specifically *because* there's no review step, so a bad edit
can still be traced and manually rolled back.

For the closed-vocabulary fields (stigmata, collections, artifacts, gems — the game rarely
introduces genuinely new ones), `HeroForm` derives suggestion lists from every hero already in
Firestore via `HeroService.getDistinctValues()`, and passes them to `TagListInput`'s optional
`options` input, which shows a filtered dropdown while typing. Typing something not in the list
is still accepted as freeform on Enter/Add — the dropdown is a convenience, not a restriction, so
new game content is never blocked.

Firestore security is defined in `firestore.rules` (public read on `heroes`; write requires
`isEditor()` plus field/enum checks mirroring `scripts/validate-heroes.mjs`; `heroEdits` is
create-only by editors; `editors` is read-only to its own owner, never client-writable); deploy
changes with `npx firebase-tools deploy --only firestore:rules --project hero-build-guide`.
`scripts/migrate-heroes-to-firestore.mjs`, `scripts/export-heroes-from-firestore.mjs`, and
`scripts/manage-editors.mjs` (see Commands above) all need `GOOGLE_APPLICATION_CREDENTIALS`
pointing at a Firebase service account key — never commit that key; `.gitignore` already excludes
`*firebase-adminsdk*.json`/`*serviceAccountKey*.json`.

**Guide content:** `public/data/guide/*.json` (`introduction`, `beginner-team-building`,
`a-hero-pve`, `cc-dot`, `acronyms-faq`, `credits`, `navigation`), loaded by `GuideService`.

**Styles** (`src/styles/`)
- Single dark theme only — no light/dark toggle. All design tokens are CSS custom properties in
  `_variables.scss`: colors, tier colors (`--tier-s-plus/-s/-a/-b`), faction colors
  (`--faction-<name>`), spacing (`--space-1`–`--space-8`), radii, shadows, transitions
- `_mixins.scss` provides `page-hero`, `eyebrow-label`, `card-surface`, `respond-min`/
  `respond-max`, and `faction-variants($property)` (generates one
  `&[data-faction='<slug>'] { <property>: <color> }` block per faction from the `$faction-colors`
  map — use this instead of hand-writing per-faction selectors). Component styles use these via
  `@use 'mixins' as *;` — `angular.json`'s `stylePreprocessorOptions.includePaths: ["src/styles"]`
  makes `src/styles/*` resolvable from any component `.scss` regardless of nesting depth, so
  always `@use 'mixins'` / `@use 'variables'` by that bare name, not a relative path.
- Component styles live next to their component as a sibling `.scss` file, set via `styleUrl`

**Factions:** `superman`, `technology`, `dark`, `nature`, `god`, `universe` — each has a
`--faction-<name>` CSS variable, a `/factions/:slug` route, and its own hero JSON file. The
faction list is centralized in `core/constants/factions.ts` — don't hardcode it elsewhere.

**TypeScript:** `strict: true` plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noImplicitReturns`, `noFallthroughCasesInSwitch`, `resolveJsonModule: true` (needed for the
`.json` constant imports above), and Angular's `strictTemplates`/`strictInjectionParameters`/
`strictInputAccessModifiers` are all on.
