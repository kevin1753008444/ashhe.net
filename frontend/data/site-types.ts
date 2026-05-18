export type MediaAsset = {
    type: "image" | "video" | "embed";
    src: string;
    alt: string;
    widthPercent?: number;
    heightPx?: number;
    fit?: "cover" | "contain";
    fallbackImage?: MediaAsset;
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
    letterSpacingPx?: number;
    lineHeight?: number;
    background?: BlockColor | "paper" | "canvas";
    textColor?: BlockColor;
    meta?: {
        label: string;
        value: string;
    }[];
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
    caseBackground?: BlockColor;
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
    tileAspectRatio?: number;
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

export type ResponsiveDesign = {
    compactBreakpoint: number;
    mobileBreakpoint: number;
    compactSidebarWidthVw: number;
    compactSidebarMinWidth: number;
    compactSidebarPaddingX: number;
    compactSidebarNameSize: number;
    compactSidebarIntroSize: number;
    compactSidebarNavSize: number;
    compactSidebarNavGap: number;
    compactGalleryScale: number;
    mobileHeaderHeight: number;
    mobilePagePadding: number;
    mobileMenuPadding: number;
    mobileMenuNameSize: number;
    mobileMenuIntroSize: number;
    mobileMenuNavSize: number;
    mobileTileHeight: number;
    mobileTileGap: number;
    mobileTilePadding: number;
};

export type DesignSettings = {
    sidebar: SidebarDesign;
    home: HomeDesign;
    caseStudy: CaseStudyDesign;
    responsive: ResponsiveDesign;
};

export type SiteMetadata = {
    title: string;
    description: string;
    icon: string;
};

export type SiteConfig = {
    site: SiteMetadata;
    profile: Profile;
    design: DesignSettings;
    projects: Project[];
};
