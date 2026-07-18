import { HeroFaction } from './faction.model';
import { HeroTier, HeroType } from './hero.model';

export type HeroSortOption = 'name-asc' | 'name-desc' | 'tier-high' | 'tier-low';

export interface HeroFilterState {
  search: string;
  faction: HeroFaction | '';
  tier: HeroTier | '';
  type: HeroType | '';
  sort: HeroSortOption;
}
