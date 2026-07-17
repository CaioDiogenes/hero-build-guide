export interface GuideNotice {
    title: string;
    description: string;
    type: 'info' | 'warning' | 'important';
}

export interface GuideVersion {
    version: string;
    changes: string[];
}

export interface GuideIntroduction {
    title: string;
    version: string;
    author: string;
    description: string[];
    coveredPvpModes: string[];
    coveredPveModes: string[];
    notices: GuideNotice[];
    versionNotes: GuideVersion;
}

export interface TeamRoleRecommendation {
    id: string;
    title: string;
    minimum: number;
    maximum: number;
    description: string;
    examples: string[];
}

export interface PlacementAdvice {
    title: string;
    description: string;
    priority: number;
}

export interface BeginnerTeamGuide {
    title: string;
    introduction: string[];
    roles: TeamRoleRecommendation[];
    placementAdvice: PlacementAdvice[];
    compositionNotes: string[];
    disclaimer: string;
}

export type AHeroUtility =
    | 'Healing'
    | 'Healing Reduction'
    | 'Attack Buff'
    | 'Armor Buff'
    | 'Speed Buff'
    | 'Damage Reduction'
    | 'Energy Drain'
    | 'Stun'
    | 'Freeze'
    | 'Crowd Control';

export interface AHeroPveEntry {
    id: string;
    name: string;
    description: string;
    utilities: AHeroUtility[];
    notes?: string[];
}

export interface AHeroPveGuide {
    title: string;
    introduction: string[];
    warning: string;
    heroes: AHeroPveEntry[];
}

export type ControlRestriction =
    | 'Basic'
    | 'Ultimate'
    | 'Basic and Ultimate'
    | 'Other';

export interface CrowdControlEffect {
    id: string;
    name: string;
    description: string;
    restriction: ControlRestriction;
    additionalEffects?: string[];
}

export interface DotEffect {
    id: string;
    name: string;
    source: string;
    timing: string;
    countedAsDot: boolean;
    notes?: string[];
}

export interface DotInteraction {
    type:
    | 'Increase damage'
    | 'Immunity'
    | 'Remove effect';
    source: string;
    description: string;
}

export interface CrowdControlDotGuide {
    title: string;
    introduction: string[];
    crowdControl: CrowdControlEffect[];
    damageOverTime: DotEffect[];
    dotInteractions: DotInteraction[];
}

export interface GuideAcronym {
    id: string;
    term: string;
    meaning: string;
    description: string;
    category:
    | 'Role'
    | 'Combat'
    | 'Game mode'
    | 'Attack';
}

export interface GuideFaqEntry {
    id: string;
    question: string;
    answer: string[];
    relatedTerms?: string[];
}

export interface AcronymFaqGuide {
    title: string;
    introduction: string[];
    acronyms: GuideAcronym[];
    faq: GuideFaqEntry[];
}