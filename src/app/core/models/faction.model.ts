export type HeroFaction = 'superman' | 'technology' | 'dark' | 'nature' | 'god' | 'universe';

export interface Faction {
  id: HeroFaction;
  slug: HeroFaction;
  name: string;
  shortName: string;
  description: string;
}
