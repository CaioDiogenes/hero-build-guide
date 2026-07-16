import { Faction, HeroFaction } from "../models/faction.model";

export const FACTIONS: Faction[] = [
    {
        id: 'superman',
        slug: 'superman',
        name: 'Superman Faction',
        shortName: 'Superman',
        description:
            'Browse heroes and recommended builds from the Superman faction.',
    },
    {
        id: 'technology',
        slug: 'technology',
        name: 'Technology Faction',
        shortName: 'Technology',
        description:
            'Browse heroes and recommended builds from the Technology faction.',
    },
    {
        id: 'dark',
        slug: 'dark',
        name: 'Dark Faction',
        shortName: 'Dark',
        description:
            'Browse heroes and recommended builds from the Dark faction.',
    },
    {
        id: 'nature',
        slug: 'nature',
        name: 'Nature Faction',
        shortName: 'Nature',
        description:
            'Browse heroes and recommended builds from the Nature faction.',
    },
    {
        id: 'god',
        slug: 'god',
        name: 'God Faction',
        shortName: 'God',
        description:
            'Browse heroes and recommended builds from the God faction.',
    },
    {
        id: 'universe',
        slug: 'universe',
        name: 'Universe Faction',
        shortName: 'Universe',
        description:
            'Browse heroes and recommended builds from the Universe faction.',
    },
];

export interface FactionNavigationItem {
    id: HeroFaction;
    label: string;
    route: string;
}

export const FACTION_NAVIGATION: FactionNavigationItem[] =
    FACTIONS.map((faction) => ({
        id: faction.id,
        label: faction.shortName,
        route: `/factions/${faction.slug}`,
    }));

export function getFactionBySlug(slug: string): Faction | undefined {
    return FACTIONS.find(
        (faction) => faction.slug === slug,
    );
}