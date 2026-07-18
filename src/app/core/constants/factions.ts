import { Faction, HeroFaction } from '../models/faction.model';
import heroTaxonomy from './hero-taxonomy.json';

// Display metadata for each faction. The canonical set of factions lives in
// hero-taxonomy.json, which scripts/validate-heroes.mjs also reads, so the
// two never drift apart.
const FACTION_METADATA: Record<HeroFaction, Omit<Faction, 'id' | 'slug'>> = {
  superman: {
    name: 'Superman Faction',
    shortName: 'Superman',
    description: 'Browse heroes and recommended builds from the Superman faction.',
  },
  technology: {
    name: 'Technology Faction',
    shortName: 'Technology',
    description: 'Browse heroes and recommended builds from the Technology faction.',
  },
  dark: {
    name: 'Dark Faction',
    shortName: 'Dark',
    description: 'Browse heroes and recommended builds from the Dark faction.',
  },
  nature: {
    name: 'Nature Faction',
    shortName: 'Nature',
    description: 'Browse heroes and recommended builds from the Nature faction.',
  },
  god: {
    name: 'God Faction',
    shortName: 'God',
    description: 'Browse heroes and recommended builds from the God faction.',
  },
  universe: {
    name: 'Universe Faction',
    shortName: 'Universe',
    description: 'Browse heroes and recommended builds from the Universe faction.',
  },
};

export const FACTIONS: Faction[] = heroTaxonomy.factions.map((slug) => {
  const faction = slug as HeroFaction;

  return {
    id: faction,
    slug: faction,
    ...FACTION_METADATA[faction],
  };
});

export interface FactionNavigationItem {
  id: HeroFaction;
  label: string;
  route: string;
}

export const FACTION_NAVIGATION: FactionNavigationItem[] = FACTIONS.map((faction) => ({
  id: faction.id,
  label: faction.shortName,
  route: `/factions/${faction.slug}`,
}));

export function getFactionBySlug(slug: string): Faction | undefined {
  return FACTIONS.find((faction) => faction.slug === slug);
}
