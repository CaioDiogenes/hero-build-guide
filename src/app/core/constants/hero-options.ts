import { HeroFaction } from "../models/faction.model";
import { HeroTier, HeroType } from "../models/hero.model";

export interface SelectOption<T extends string> {
    value: T;
    label: string;
}

export const HERO_FACTION_OPTIONS: SelectOption<HeroFaction>[] = [
    {
        value: 'superman',
        label: 'Superman',
    },
    {
        value: 'technology',
        label: 'Technology',
    },
    {
        value: 'dark',
        label: 'Dark',
    },
    {
        value: 'nature',
        label: 'Nature',
    },
    {
        value: 'god',
        label: 'God',
    },
    {
        value: 'universe',
        label: 'Universe',
    },
];

export const HERO_TIER_OPTIONS: SelectOption<HeroTier>[] = [
    {
        value: 'S+',
        label: 'S+',
    },
    {
        value: 'S',
        label: 'S',
    },
    {
        value: 'A',
        label: 'A',
    },
    {
        value: 'B',
        label: 'B',
    },
];

export const HERO_TYPE_OPTIONS: SelectOption<HeroType>[] = [
    {
        value: 'Tank',
        label: 'Tank',
    },
    {
        value: 'DPS',
        label: 'DPS',
    },
    {
        value: 'Support',
        label: 'Support',
    },
    {
        value: 'Buffer',
        label: 'Buffer',
    },
    {
        value: 'Debuffer',
        label: 'Debuffer',
    },
    {
        value: 'CC',
        label: 'CC',
    },
    {
        value: 'Healer',
        label: 'Healer',
    },
    {
        value: 'True DMG',
        label: 'True DMG',
    },
    {
        value: 'Holy DMG',
        label: 'Holy DMG',
    },
];