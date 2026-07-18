import { HeroFaction } from '../models/faction.model';
import { HeroTier, HeroType } from '../models/hero.model';
import { FACTIONS } from './factions';
import heroTaxonomy from './hero-taxonomy.json';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const HERO_FACTION_OPTIONS: SelectOption<HeroFaction>[] = FACTIONS.map((faction) => ({
  value: faction.id,
  label: faction.shortName,
}));

export const HERO_TIER_OPTIONS: SelectOption<HeroTier>[] = heroTaxonomy.tiers.map((tier) => ({
  value: tier as HeroTier,
  label: tier,
}));

export const HERO_TYPE_OPTIONS: SelectOption<HeroType>[] = heroTaxonomy.types.map((type) => ({
  value: type as HeroType,
  label: type,
}));
