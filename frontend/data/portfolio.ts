export type MediaAsset = {
    type: "image" | "video";
    src: string;
    alt: string;
};

export type CaseStudySection = {
    kicker: string;
    title: string;
    body: string[];
    media: MediaAsset[];
    layout: "hero" | "twoColumnText" | "mediaGrid" | "fullBleedMedia";
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
    sections: CaseStudySection[];
    accentTheme: "willow" | "ios" | "tiktok" | "dark" | "placeholder";
    implemented: boolean;
};

export const profile = {
    name: "Yiqi Yan",
    intro: ["Founding Designer @Willow", "Prev. @TikTok, @Tencent, @Meta", "HCI @Harvard @Tsinghua"],
    location: "San Jose, California",
};

export const projects: Project[] = [
    {
        slug: "willow_desktop",
        title: "Willow Desktop APP",
        year: "2026",
        navTitle: "Willow Desktop",
        role: "Founding Product Designer",
        timeline: "2026 - Present",
        coverMedia: {
            type: "image",
            src: "/assets/home/MJEUzqAUYToqEzCAPoptrTsdPGI.png",
            alt: "Willow desktop application interface",
        },
        accentTheme: "willow",
        implemented: true,
        summary: [
            "Willow is a voice-to-text desktop app that replaces your keyboard - press a hotkey, speak naturally, and perfectly formatted text appears in any app you're using.",
            "As the founding designer, I built the design system from zero to one and redesigned the responsive desktop app - from the core dictation surface to onboarding, education, dictionary, shortcuts, settings, team management, and more.",
        ],
        sections: [
            {
                kicker: "01 / Willow desktop dictation experience",
                title: "A writing surface built around speaking first.",
                body: [
                    "At Willow, dictation comes first. The experience makes voice input and AI writing tools feel effortless, integrated into the apps people use daily.",
                    "The interface keeps the system quiet, responsive, and highly polished while exposing the core actions only when they are needed.",
                ],
                layout: "mediaGrid",
                media: [
                    {
                        type: "video",
                        src: "/assets/willow-desktop/okEh9DYhx3VhJSGFPdR39BK4GCE.mp4",
                        alt: "Willow desktop interaction video",
                    },
                    {
                        type: "image",
                        src: "/assets/willow-desktop/K0xKeLEVNl60QAh4QVnIVwuNtQ.png",
                        alt: "Willow desktop dashboard",
                    },
                    {
                        type: "image",
                        src: "/assets/willow-desktop/QRbdkJ6aGCXM5kDuwkyVxQrmls.png",
                        alt: "Willow desktop flow",
                    },
                ],
            },
        ],
    },
    {
        slug: "willow_ios",
        title: "Willow iOS",
        year: "2026",
        navTitle: "Willow iOS",
        role: "Product Designer",
        timeline: "2026",
        coverMedia: {
            type: "image",
            src: "/assets/willow-ios/VFw4S3zjNJEv76mNbDq5HXsmvw.png",
            alt: "Willow iOS launch screen",
        },
        accentTheme: "ios",
        implemented: true,
        summary: [
            "I worked on the iOS design for Willow from zero to launch, owning the core user-facing experiences.",
            "Designed five key surfaces - Dictionary, Homepage, Dictation History, Style Matching, and Profile and Settings - with a focus on activation, retention, and conversion.",
        ],
        sections: [
            {
                kicker: "02 / User growth modules",
                title: "Education, activation, and monetization modules.",
                body: [
                    "Beyond the core dictation experience, the iOS system needed clear surfaces that guide users through their first meaningful moments.",
                    "Each module supports acquisition, education, activation, retention, and monetization while keeping the product calm and focused.",
                ],
                layout: "mediaGrid",
                media: [
                    {
                        type: "video",
                        src: "/assets/willow-ios/1ERXbztBoAFTlWiRMRi5xoEJU.mp4",
                        alt: "Willow iOS interaction video",
                    },
                    {
                        type: "image",
                        src: "/assets/willow-ios/ADs7tBCCGiuolr1mFPIRs6bb2fA.png",
                        alt: "Willow iOS screens",
                    },
                    {
                        type: "image",
                        src: "/assets/willow-ios/1cOdX9Pr8grndA20HR62OLP180.png",
                        alt: "Willow iOS growth module",
                    },
                ],
            },
        ],
    },
    {
        slug: "tiktok_product_infra",
        title: "TikTok Core Product Infra - The Main APP",
        year: "2025",
        navTitle: "TikTok Core Product Infra",
        role: "Product Designer",
        timeline: "2025",
        coverMedia: {
            type: "image",
            src: "/assets/tiktok/xLpbJ1fedWLqMDzRqPYeZETE4.png",
            alt: "TikTok product infrastructure screens",
        },
        accentTheme: "tiktok",
        implemented: true,
        summary: [
            "I served as a platform-level designer under TikTok's Core Product Infrastructure team, helping set component standards and running weekly app-wide design reviews.",
            "I owned foundational UI components used globally across the app, including pop-up modals, feed bottom actions, intro sheets, navigation bars, floating notices, and in-app push notifications.",
        ],
        sections: [
            {
                kicker: "01 / Main App components",
                title: "System-level standards for the main app.",
                body: [
                    "My work centered on defining, auditing, and iterating component standards that elevate the overall quality and consistency of the main app.",
                    "The work moved across discovery, consumption, revisit, and creation patterns so teams could share durable interaction foundations.",
                ],
                layout: "mediaGrid",
                media: [
                    {
                        type: "video",
                        src: "/assets/tiktok/nbG0ZNxQ512vKIp1UmcvGaxemXM.mp4",
                        alt: "TikTok product infrastructure video",
                    },
                    {
                        type: "image",
                        src: "/assets/tiktok/z3KJoLEHYlKhFuWf5iodBt3nmt4.png",
                        alt: "TikTok component standard",
                    },
                    {
                        type: "image",
                        src: "/assets/tiktok/YVGsh9d2qCK6Cc5Uel6kBGwFN3Y.png",
                        alt: "TikTok account design",
                    },
                ],
            },
        ],
    },
    {
        slug: "tiktok_entertainment",
        title: "TikTok Entertainment",
        year: "2024-25",
        navTitle: "TikTok Entertainment",
        role: "Product Designer",
        timeline: "2024-25",
        coverMedia: { type: "image", src: "/assets/home/YY47usy9IwbiBHqoSvv0xMDaSo.png", alt: "Project preview" },
        sections: [],
        accentTheme: "placeholder",
        implemented: false,
        summary: ["Placeholder case study route for future personal content."],
    },
    {
        slug: "oreo_agentic_ui",
        title: "Oreo Agentic UI",
        year: "2025",
        navTitle: "Oreo Agentic UI",
        role: "Product Designer",
        timeline: "2025",
        coverMedia: { type: "image", src: "/assets/home/NZvEkLr9cul3funaB1wxEXhKM.png", alt: "Project preview" },
        sections: [],
        accentTheme: "dark",
        implemented: false,
        summary: ["Placeholder case study route for future personal content."],
    },
    {
        slug: "longcut.ai",
        title: "Longcut.ai",
        year: "2025",
        navTitle: "Longcut.ai",
        role: "Product Designer",
        timeline: "2025",
        coverMedia: { type: "image", src: "/assets/home/MJEUzqAUYToqEzCAPoptrTsdPGI.png", alt: "Project preview" },
        sections: [],
        accentTheme: "placeholder",
        implemented: false,
        summary: ["Placeholder case study route for future personal content."],
    },
    {
        slug: "meta_2023",
        title: "Meta",
        year: "2023",
        navTitle: "Meta",
        role: "Product Designer",
        timeline: "2023",
        coverMedia: { type: "image", src: "/assets/home/YY47usy9IwbiBHqoSvv0xMDaSo.png", alt: "Project preview" },
        sections: [],
        accentTheme: "placeholder",
        implemented: false,
        summary: ["Placeholder case study route for future personal content."],
    },
    {
        slug: "call_of_duty_2020",
        title: "Call of Duty Mobile",
        year: "2020",
        navTitle: "Call of Duty Mobile",
        role: "Concept Designer",
        timeline: "2020",
        coverMedia: { type: "image", src: "/assets/home/llFQDYX8hVGGWR0KzQMwRTLPbSk.png", alt: "Project preview" },
        sections: [],
        accentTheme: "placeholder",
        implemented: false,
        summary: ["Placeholder case study route for future personal content."],
    },
    {
        slug: "game_concept_assassin",
        title: "Assassin - Concept Art",
        year: "2019",
        navTitle: "Assassin - Concept Art",
        role: "Concept Artist",
        timeline: "2019",
        coverMedia: { type: "image", src: "/assets/home/llFQDYX8hVGGWR0KzQMwRTLPbSk.png", alt: "Project preview" },
        sections: [],
        accentTheme: "placeholder",
        implemented: false,
        summary: ["Placeholder case study route for future personal content."],
    },
];

export const implementedSlugs = projects.filter((project) => project.implemented).map((project) => project.slug);

export function getProject(slug: string): Project | undefined {
    return projects.find((project) => project.slug === slug);
}
