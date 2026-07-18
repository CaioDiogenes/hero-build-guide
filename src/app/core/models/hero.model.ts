import { HeroFaction } from './faction.model';

export type HeroTier = 'S+' | 'S' | 'A' | 'B';

export type HeroType =
  'Tank' | 'DPS' | 'Support' | 'Buffer' | 'Debuffer' | 'CC' | 'Healer' | 'True DMG' | 'Holy DMG';

export interface Hero {
  id: string;
  slug: string;
  name: string;
  title?: string;

  faction: HeroFaction;
  types: HeroType[];
  tier: HeroTier;

  minimumRelics?: number;
  minimumExclusiveEquipment: number;

  placement?: string;
  statFocus: string[];

  stigmataFourSet: string[];
  stigmataTwoSet: string[];

  collections: string[];
  artifacts: string[];

  generalTalentsPvp: string[];
  gems: string[];
  gemTalents: string[];

  notes?: string[];
}
