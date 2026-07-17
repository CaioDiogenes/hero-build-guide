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