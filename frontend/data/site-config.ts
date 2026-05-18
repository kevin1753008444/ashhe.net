import { promises as fs } from "fs";
import path from "path";
import type { BlockColor, CaseStudySection, MediaAsset, Project, SiteConfig } from "./site-types";

const CONFIG_PATH = path.join(process.cwd(), "data", "site-config.json");
const HISTORY_PATH = path.join(process.cwd(), "data", "site-config.history.jsonl");
const PUBLIC_ROOT = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_ROOT, "uploads");

export async function readSiteConfig(): Promise<SiteConfig> {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return normalizeSiteConfig(JSON.parse(raw) as SiteConfig);
}

function normalizeSiteConfig(config: SiteConfig): SiteConfig {
    const caseStudy = config.design.caseStudy;
    const home = config.design.home;
    const responsive = config.design.responsive;
    const defaultMediaHeight = caseStudy.mediaCardMinHeight ?? 420;

    return {
        ...config,
        site: {
            title: config.site?.title ?? "Ash's Hub",
            description: config.site?.description ?? "Product Design",
            icon: config.site?.icon ?? "/favicon.svg",
        },
        projects: config.projects.map((project) => normalizeProject(project, defaultMediaHeight)),
        design: {
            ...config.design,
            home: {
                ...home,
                tileAspectRatio: home.tileAspectRatio ?? 1,
                titleSize: home.titleSize ?? 16,
                titleBottom: home.titleBottom ?? 24,
                hoverOpacity: home.hoverOpacity ?? 20,
            },
            responsive: {
                compactBreakpoint: responsive?.compactBreakpoint ?? 1500,
                mobileBreakpoint: responsive?.mobileBreakpoint ?? 760,
                compactSidebarWidthVw: responsive?.compactSidebarWidthVw ?? 26,
                compactSidebarMinWidth: responsive?.compactSidebarMinWidth ?? 300,
                compactSidebarPaddingX: responsive?.compactSidebarPaddingX ?? 24,
                compactSidebarNameSize: responsive?.compactSidebarNameSize ?? 30,
                compactSidebarIntroSize: responsive?.compactSidebarIntroSize ?? 15,
                compactSidebarNavSize: responsive?.compactSidebarNavSize ?? 14,
                compactSidebarNavGap: responsive?.compactSidebarNavGap ?? 18,
                compactGalleryScale: responsive?.compactGalleryScale ?? 0.82,
                mobileHeaderHeight: responsive?.mobileHeaderHeight ?? 88,
                mobilePagePadding: responsive?.mobilePagePadding ?? 0,
                mobileMenuPadding: responsive?.mobileMenuPadding ?? 30,
                mobileMenuNameSize: responsive?.mobileMenuNameSize ?? 36,
                mobileMenuIntroSize: responsive?.mobileMenuIntroSize ?? 20,
                mobileMenuNavSize: responsive?.mobileMenuNavSize ?? 20,
                mobileTileHeight: responsive?.mobileTileHeight ?? 560,
                mobileTileGap: responsive?.mobileTileGap ?? 8,
                mobileTilePadding: responsive?.mobileTilePadding ?? 18,
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
        fallbackImage: media.fallbackImage ? normalizeMedia(media.fallbackImage, defaultMediaHeight) : undefined,
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
    return {
        kicker: "",
        title: project.title,
        meta: [
            ...(project.role ? [{ label: "Role", value: project.role }] : []),
            ...(project.timeline ? [{ label: "Timeline", value: project.timeline }] : []),
        ],
        body: [...project.summary],
        layout: "twoColumnText",
        media: [],
        minHeightPx: 0,
        background: "white",
        textColor: "black",
    };
}

function splitLegacyMeta(section: CaseStudySection, project: Project) {
    if (section.meta?.length) {
        return {
            meta: section.meta,
            body: section.body,
        };
    }

    const meta: NonNullable<CaseStudySection["meta"]> = [];
    const body: string[] = [];

    section.body.forEach((paragraph) => {
        const match = paragraph.match(/^(Role|Timeline)\s*(?:[·:路]|-)\s*(.+)$/i);
        if (match?.[1] && match[2]) {
            meta.push({ label: match[1], value: match[2].trim() });
            return;
        }

        body.push(paragraph);
    });

    if (meta.length === 0 && section.layout === "twoColumnText" && section.title === project.title) {
        if (project.role) {
            meta.push({ label: "Role", value: project.role });
        }
        if (project.timeline) {
            meta.push({ label: "Timeline", value: project.timeline });
        }
    }

    return { meta, body };
}

function normalizeProject(project: Project, defaultMediaHeight: number): Project {
    const sections = project.sections.map((section) => {
        const legacyText = splitLegacyMeta(section, project);

        return {
            ...section,
            body: legacyText.body,
            meta: legacyText.meta,
            background: normalizeBlockColor(
                section.background,
                section.layout === "hero" || section.layout === "singleMedia" || section.layout === "embedMedia" ? "lightGray" : "white",
            ),
            textColor: normalizeTextColor(section.textColor),
            media: section.media.map((media) => normalizeMedia(media, defaultMediaHeight)),
        };
    });
    const shouldMigrateDetailBlocks = !project.detailBlocksMigrated;
    const hasHeroBlock = sections.some((section) => section.layout === "hero");
    const hasIntroBlock = sections.some((section) => section.layout === "twoColumnText" && section.title === project.title);

    return {
        ...project,
        detailBlocksMigrated: true,
        homeTitleColor: project.homeTitleColor ?? "black",
        caseBackground: project.caseBackground ?? "white",
        homeCoverMedia: normalizeMedia(project.homeCoverMedia ?? {
            ...project.coverMedia,
            fit: "cover",
        }, defaultMediaHeight),
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
    await deleteUnreferencedUploads(config);
}

export async function getImplementedSlugs() {
    const config = await readSiteConfig();
    return config.projects.map((project) => project.slug);
}

export async function getProject(slug: string) {
    const config = await readSiteConfig();
    return config.projects.find((project) => project.slug === slug);
}

function collectUploadReferences(value: unknown, references = new Set<string>()) {
    if (typeof value === "string" && value.startsWith("/uploads/")) {
        references.add(path.basename(value));
        return references;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => collectUploadReferences(item, references));
        return references;
    }

    if (value && typeof value === "object") {
        Object.values(value).forEach((item) => collectUploadReferences(item, references));
    }

    return references;
}

async function deleteUnreferencedUploads(config: SiteConfig) {
    const referencedUploads = collectUploadReferences(config);

    let uploadEntries: string[];
    try {
        uploadEntries = await fs.readdir(UPLOAD_DIR);
    } catch {
        return;
    }

    await Promise.all(
        uploadEntries
            .filter((fileName) => !referencedUploads.has(fileName))
            .map((fileName) => fs.rm(path.join(UPLOAD_DIR, fileName), { force: true })),
    );
}
