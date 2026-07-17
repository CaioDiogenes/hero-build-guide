import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Hero Build Guide',
    // [routerLinkActiveOptions]="{ exact: true }",
    loadComponent: () =>
      import('./features/home/home')
        .then(component => component.Home),
  },
  {
    path: 'heroes',
    title: 'Heroes | Hero Build Guide',
    loadComponent: () =>
      import('./features/heroes/hero-directory/hero-directory')
        .then(component => component.HeroDirectory),
  },
  {
    path: 'heroes/:slug',
    title: 'Hero Details | Hero Build Guide',
    loadComponent: () =>
      import('./features/heroes/hero-detail/hero-detail')
        .then(component => component.HeroDetail),
  },
  {
    path: 'factions/:slug',
    title: 'Faction | Hero Build Guide',
    loadComponent: () =>
      import('./features/factions/faction-details/faction-details')
        .then(component => component.FactionDetails),
  },
  {
    path: 'about',
    title: 'About | Hero Build Guide',
    loadComponent: () =>
      import('./features/about/about/about')
        .then(component => component.About),
  },
  {
    path: 'style-guide',
    title: 'Style Guide | Hero Build Guide',
    loadComponent: () =>
      import('./features/style-guide/style-guide')
        .then((component) => component.StyleGuide),
  },
  {
    path: 'guide/team-building',
    title: 'Beginner Team Building | Hero Build Guide',
    loadComponent: () =>
      import(
        './features/guide/beginner-team/beginner-team'
      ).then(
        (component) => component.BeginnerTeam,
      ),
  },
  {
    path: 'guide/a-hero-pve',
    title: 'A-Hero Skills for PVE | Hero Build Guide',
    loadComponent: () =>
      import(
        './features/guide/a-hero-pve/a-hero-pve'
      ).then(
        (component) => component.AHeroPve,
      ),
  },
  {
    path: 'guide/cc-dot',
    title: 'CC and DOT Glossary | Hero Build Guide',
    loadComponent: () =>
      import(
        './features/guide/cc-dot/cc-dot'
      ).then(
        (component) => component.CcDot,
      ),
  },
  {
    path: 'guide/acronyms-faq',
    title: 'Acronyms and FAQ | Hero Build Guide',
    loadComponent: () =>
      import(
        './features/guide/acronyms-faq/acronyms-faq'
      ).then(
        (component) => component.AcronymsFaq,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];