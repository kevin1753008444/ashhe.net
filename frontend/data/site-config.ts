import { promises as fs } from "fs";
import path from "path";
import type { BlockColor, CaseStudySection, MediaAsset, Project, SiteConfig } from "./site-types";

const CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");
const HISTORY_PATH = path.join(process.cwd(), "data", "site-config.history.jsonl");

export async function readSiteConfig(): Promise<SiteConfig> {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return normalizeSiteConfig(JSON.parse(raw) as SiteConfig);
}

function normalizeSiteConfig(config: SiteConfig): SiteConfig {
    const caseStudy = config.design.caseStudy;
    const home = config.design.home;
    const defaultMediaHeight = caseStudy.mediaCardMinHeight ?? 420;

    return {
        ...config,
        projects: config.projects.map((project) => normalizeProject(project, defaultMediaHeight)),
        design: {
            ...config.design,
            home: {
                ...home,
                titleSize: home.titleSize ?? 16,
                titleBottom: home.titleBottom ?? 24,
                hoverOpacity: home.hoverOpacity ?? 20,
            },
            caseStudy: {
                ...caseStudy,
                introPaddingX: 28,
                sectionPaddingY: caseStudy.introPaddingY,
                sectionPaddingX: 28,
                mediaGapY: caseStudy.mediaGap,
                mediaGapX: caseStudy.mediaGap,
                ...(caseStudy.introPaddingX === undefined ? {} : { introPaddingX: caseStudy.introPaddingX }),
                ...(caseStudy.sectionPaddingY === undefined ? {} : { sectionPaddingY: caseStudy.sectionPaddingY }),
                ...(caseStudy.sectionPaddingX === undefined ? {} : { sectionPaddingX: caseStudy.sectionPaddingX }),
                ...(caseStudy.mediaGapY === undefined ? {} : { mediaGapY: caseStudy.mediaGapY }),
                ...(caseStudy.mediaGapX === undefined ? {} : { mediaGapX: caseStudy.mediaGapX }),
            },
        },
    };
}

function normalizeMedia(media: MediaAsset, defaultMediaHeight: number): MediaAsset {
    if (media.type === "embed") {
        return media;
    }

    return {
        ...media,
        heightPx: media.heightPx ?? defaultMediaHeight,
    };
}

function normalizeBlockColor(value: CaseStudySection["background"] | undefined, fallback: BlockColor): BlockColor {
    if (value === "canvas") {
        return "lightGray";
    }

    if (value === "paper") {
        return "white";
    }

    return value ?? fallback;
}

function normalizeTextColor(value: CaseStudySection["textColor"] | undefined): BlockColor {
    return value ?? "black";
}

function createHeroSection(project: Project): CaseStudySection {
    return {
        kicker: "",
        title: "",
        body: [],
        layout: "hero",
        minHeightPx: 720,
        paddingTopPx: 0,
        paddingBottomPx: 0,
        paddingX: 0,
        background: "lightGray",
        textColor: "black",
        media: [{
            ...project.coverMedia,
            fit: project.coverMedia.fit ?? "cover",
        }],
    };
}

function createIntroSection(project: Project): CaseStudySection {
    const details = [
        project.role ? `Role · ${project.role}` : "",
        project.timeline ? `Timeline · ${project.timeline}` : "",
    ].filter(Boolean);

    return {
        kicker: "",
        title: project.title,
        body: [...details, ...project.summary],
        layout: "twoColumnText",
        media: [],
        minHeightPx: 0,
        background: "white",
        textColor: "black",
    };
}

function normalizeProject(project: Project, defaultMediaHeight: number): Project {
    const sections = project.sections.map((section) => ({
        ...section,
        background: normalizeBlockColor(
            section.background,
            section.layout === "hero" || section.layout === "singleMedia" || section.layout === "embedMedia" ? "lightGray" : "white",
        ),
        textColor: normalizeTextColor(section.textColor),
        media: section.layout === "hero"
            ? section.media
            : section.media.map((media) => normalizeMedia(media, defaultMediaHeight)),
    }));
    const shouldMigrateDetailBlocks = !project.detailBlocksMigrated;
    const hasHeroBlock = sections.some((section) => section.layout === "hero");
    const hasIntroBlock = sections.some((section) => section.layout === "twoColumnText" && section.title === project.title);

    return {
        ...project,
        detailBlocksMigrated: true,
        homeTitleColor: project.homeTitleColor ?? "black",
        homeCoverMedia: project.homeCoverMedia ?? {
            ...project.coverMedia,
            fit: "cover",
        },
        coverMedia: normalizeMedia(project.coverMedia, defaultMediaHeight),
        sections: [
            ...(!shouldMigrateDetailBlocks || hasHeroBlock ? [] : [createHeroSection(project)]),
            ...(!shouldMigrateDetailBlocks || hasIntroBlock ? [] : [createIntroSection(project)]),
            ...sections,
        ],
    };
}

export async function writeSiteConfig(config: SiteConfig, summary = "Saved from portfolio console") {
    await fs.writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 4)}\n`, "utf8");
    await fs.appendFile(
        HISTORY_PATH,
        `${JSON.stringify({ savedAt: new Date().toISOString(), summary })}\n`,
        "utf8",
    );
}

export async function getImplementedSlugs() {
    const config = await readSiteConfig();
    return config.projects.map((project) => project.slug);
}

export async function getProject(slug: string) {
    const config = await readSiteConfig();
    return config.projects.find((project) => project.slug === slug);
}
