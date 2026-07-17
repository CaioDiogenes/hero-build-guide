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