import { HeroFaction } from '../models/faction.model';

export interface FactionNavigationItem {
    id: HeroFaction;
    label: string;
    route: string;
}

export const FACTION_NAVIGATION: FactionNavigationItem[] = [
    {
        id: 'superman',
        label: 'Superman',
        route: '/factions/superman',
    },
    {
        id: 'technology',
        label: 'Technology',
        route: '/factions/technology',
    },
    {
        id: 'dark',
        label: 'Dark',
        route: '/factions/dark',
    },
    {
        id: 'nature',
        label: 'Nature',
        route: '/factions/nature',
    },
    {
        id: 'god',
        label: 'God',
        route: '/factions/god',
    },
    {
        id: 'universe',
        label: 'Universe',
        route: '/factions/universe',
    },
];