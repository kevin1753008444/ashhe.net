export type MediaAsset = {
    type: "image" | "video" | "embed";
    src: string;
    alt: string;
    widthPercent?: number;
    heightPx?: number;
    fit?: "cover" | "contain";
};

export type BlockColor = "white" | "lightGray" | "midGray" | "nightGray" | "black";

export type CaseStudySection = {
    kicker: string;
    title: string;
    body: string[];
    media: MediaAsset[];
    minHeightPx?: number;
    paddingTopPx?: number;
    paddingBottomPx?: number;
    paddingX?: number;
    background?: BlockColor | "paper" | "canvas";
    textColor?: BlockColor;
    layout:
        | "hero"
        | "twoColumnText"
        | "singleMedia"
        | "mediaGrid"
        | "mediaGridTwo"
        | "mediaGridThree"
        | "embedMedia"
        | "mediaTextSplit"
        | "textMediaSplit"
        | "fullBleedMedia";
};

export type Project = {
    slug: string;
    title: string;
    year: string;
    navTitle: string;
    role: string;
    timeline: string;
    summary: string[];
    coverMedia: MediaAsset;
    homeCoverMedia?: MediaAsset;
    homeTitleColor?: BlockColor;
    sections: CaseStudySection[];
    accentTheme: "willow" | "ios" | "tiktok" | "dark" | "placeholder";
    implemented: boolean;
    detailBlocksMigrated?: boolean;
};

export type Profile = {
    name: string;
    intro: string[];
    location: string;
};

export type SidebarDesign = {
    widthVw: number;
    minWidth: number;
    paddingTop: number;
    paddingX: number;
    paddingBottom: number;
    nameSize: number;
    introSize: number;
    navSize: number;
    navGap: number;
    introGap: number;
    clockSize: number;
};

export type HomeDesign = {
    tileHeight: number;
    tileGap: number;
    mediaScale: number;
    desktopPreviewWidth: number;
    phoneWidth: number;
    phoneMinWidth: number;
    titleSize: number;
    titleBottom: number;
    hoverOpacity: number;
};

export type CaseStudyDesign = {
    heroHeightVh: number;
    introPaddingY: number;
    introPaddingX: number;
    sectionPaddingY: number;
    sectionPaddingX: number;
    titleSize: number;
    bodySize: number;
    mediaGap: number;
    mediaGapY?: number;
    mediaGapX?: number;
    mediaCardMinHeight: number;
};

export type DesignSettings = {
    sidebar: SidebarDesign;
    home: HomeDesign;
    caseStudy: CaseStudyDesign;
};

export type SiteConfig = {
    profile: Profile;
    design: DesignSettings;
    projects: Project[];
};
