"use client";

import { ExternalLink, GripVertical, PanelRightClose, PanelRightOpen, Plus, Rocket, Save, Trash2, Upload } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { BlockColor, CaseStudySection, MediaAsset, Project, SiteConfig } from "@/data/site-types";
import styles from "./AdminEditor.module.css";

type Tab = "content" | "sidebar" | "home" | "responsive" | "case" | "media";
type UploadTarget = "cover" | "section";

const tabs: { id: Tab; label: string }[] = [
    { id: "content", label: "内容" },
    { id: "sidebar", label: "侧边栏" },
    { id: "home", label: "首页" },
    { id: "case", label: "详情页" },
    { id: "media", label: "媒体" },
];

tabs.splice(3, 0, { id: "responsive", label: "自适应" });

const blockOptions: { value: CaseStudySection["layout"]; label: string; description: string; defaultMedia: number }[] = [
    { value: "hero", label: "详情页 Hero 大图", description: "详情页开头的大图 / 视频，也是一个可排序的 Block。", defaultMedia: 1 },
    { value: "singleMedia", label: "单图 / 单视频", description: "一个媒体独占一整行，适合主图、重点视频、完整展开截图。", defaultMedia: 1 },
    { value: "mediaGridTwo", label: "两列平分", description: "一个 Block 内最多 2 个媒体，左右平分展示。", defaultMedia: 2 },
    { value: "mediaGridThree", label: "三列平分", description: "一个 Block 内最多 3 个媒体，适合小图、组件、流程节点。", defaultMedia: 3 },
    { value: "mediaGrid", label: "主图 + 双列", description: "第 1 个媒体通栏，后 2 个媒体双列。", defaultMedia: 3 },
    { value: "mediaTextSplit", label: "左媒右文", description: "左侧 1 个媒体，右侧是这个 Block 的文字说明。", defaultMedia: 1 },
    { value: "textMediaSplit", label: "左文右图", description: "左侧是标题和文字，右侧是 1 个图片或视频。", defaultMedia: 1 },
    { value: "embedMedia", label: "YouTube / Vimeo", description: "只填写一个外部视频链接，并按单张全宽样式展示。", defaultMedia: 1 },
    { value: "fullBleedMedia", label: "全宽纵向", description: "多个媒体逐张全宽堆叠，适合长图和连续视频。", defaultMedia: Infinity },
    { value: "twoColumnText", label: "文字 / 标题", description: "不包含媒体。可只填左侧标题，也可做左标题右正文。", defaultMedia: 0 },
];

const blockColorOptions: { value: BlockColor; label: string; hex: string }[] = [
    { value: "white", label: "白色 #FFFFFF", hex: "#FFFFFF" },
    { value: "lightGray", label: "浅灰 #F6F6F6", hex: "#F6F6F6" },
    { value: "midGray", label: "中灰 #EBE9E8", hex: "#EBE9E8" },
    { value: "nightGray", label: "夜灰 #141414", hex: "#141414" },
    { value: "black", label: "黑色 #000000", hex: "#000000" },
];

function normalizeBlockColorValue(value: CaseStudySection["background"] | CaseStudySection["textColor"] | undefined, fallback: BlockColor): BlockColor {
    if (value === "canvas") {
        return "lightGray";
    }

    if (value === "paper") {
        return "white";
    }

    return value ?? fallback;
}

function linesToText(lines: string[]) {
    return lines.join("\n");
}

function textToLines(text: string) {
    return text.split("\n").map((line) => line.trimEnd()).filter(Boolean);
}

function getBlockOption(layout: CaseStudySection["layout"]) {
    return blockOptions.find((option) => option.value === layout) ?? blockOptions[0];
}

function getMediaLimit(layout: CaseStudySection["layout"]) {
    return getBlockOption(layout).defaultMedia;
}

function isMediaOnlyLayout(layout: CaseStudySection["layout"]) {
    return layout === "singleMedia" || layout === "mediaGridTwo" || layout === "mediaGridThree" || layout === "mediaGrid" || layout === "fullBleedMedia" || layout === "embedMedia" || layout === "hero";
}

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 64);
}

function getUniqueSlug(projects: Project[], baseValue: string, currentSlug?: string) {
    const baseSlug = slugify(baseValue) || "new_project";
    let nextSlug = baseSlug;
    let suffix = 2;

    while (projects.some((project) => project.slug === nextSlug && project.slug !== currentSlug)) {
        nextSlug = `${baseSlug}_${suffix}`;
        suffix += 1;
    }

    return nextSlug;
}

function createProject(projects: Project[]): Project {
    const slug = getUniqueSlug(projects, "new_project");

    return {
        slug,
        title: "New Project",
        year: new Date().getFullYear().toString(),
        navTitle: "New Project",
        role: "Product Designer",
        timeline: new Date().getFullYear().toString(),
        summary: ["Write a short project summary here."],
        coverMedia: { type: "image", src: "/assets/home/MJEUzqAUYToqEzCAPoptrTsdPGI.png", alt: "Project detail hero", fit: "contain" },
        homeCoverMedia: { type: "image", src: "/assets/home/MJEUzqAUYToqEzCAPoptrTsdPGI.png", alt: "Homepage project cover", fit: "cover" },
        homeTitleColor: "black",
        sections: [
            createBlock("hero"),
            {
                kicker: "",
                title: "New Project",
                body: ["Role · Product Designer", `Timeline · ${new Date().getFullYear()}`, "Write a short project summary here."],
                media: [],
                layout: "twoColumnText",
                minHeightPx: 0,
                background: "white",
                textColor: "black",
            },
        ],
        accentTheme: "placeholder",
        implemented: true,
        detailBlocksMigrated: true,
    };
}

function createBlock(layout: CaseStudySection["layout"]): CaseStudySection {
    const option = getBlockOption(layout);
    const needsText = layout === "mediaTextSplit" || layout === "textMediaSplit" || layout === "twoColumnText";

    return {
        kicker: needsText ? "新内容块" : "",
        title: needsText ? option.label : "",
        body: needsText ? ["在这里写这个内容块的说明。"] : [],
        media: [],
        layout,
        minHeightPx: layout === "hero" ? 720 : needsText ? 0 : undefined,
        paddingTopPx: layout === "hero" ? 0 : undefined,
        paddingBottomPx: layout === "hero" ? 0 : undefined,
        paddingX: layout === "hero" ? 0 : undefined,
        background: layout === "hero" || isMediaOnlyLayout(layout) ? "lightGray" : "white",
        textColor: "black",
    };
}

function RangeField({
    label,
    value,
    min,
    max,
    step = 1,
    unit = "px",
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
}) {
    return (
        <label className={styles.rangeField}>
            <span>{label}</span>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
            <input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
            <em>{unit}</em>
        </label>
    );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
    return (
        <label className={styles.field}>
            <span>{label}</span>
            <input value={value} onChange={(event) => onChange(event.target.value)} />
        </label>
    );
}

function TextAreaField({
    label,
    value,
    rows = 5,
    onChange,
}: {
    label: string;
    value: string;
    rows?: number;
    onChange: (value: string) => void;
}) {
    return (
        <label className={styles.field}>
            <span>{label}</span>
            <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
        </label>
    );
}

function MediaThumb({ media }: { media: MediaAsset }) {
    if (media.type === "embed") {
        return (
            <div className={styles.embedThumb}>
                <span>EMBED</span>
                <small>{media.src}</small>
            </div>
        );
    }

    if (media.type === "video") {
        return <video src={media.src} muted loop autoPlay playsInline preload="metadata" />;
    }

    return <img src={media.src} alt={media.alt} loading="lazy" />;
}

export function AdminEditor({ initialConfig, initialProjectSlug }: { initialConfig: SiteConfig; initialProjectSlug?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const routeProjectSlug = pathname.match(/^\/admin\/([^/?#]+)/)?.[1];
    const [config, setConfig] = useState(initialConfig);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("content");
    const [selectedProjectSlug, setSelectedProjectSlug] = useState(
        initialProjectSlug ?? routeProjectSlug ?? initialConfig.projects[0]?.slug ?? "",
    );
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [uploadTarget, setUploadTarget] = useState<UploadTarget>("section");
    const [embedUrl, setEmbedUrl] = useState("");
    const [status, setStatus] = useState("当前没有未保存改动");
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const selectedProject = useMemo(
        () => config.projects.find((project) => project.slug === selectedProjectSlug) ?? config.projects[0],
        [config.projects, selectedProjectSlug],
    );
    const selectedSection = selectedProject?.sections[selectedSectionIndex];
    const mediaReferences = useMemo(() => {
        return config.projects.flatMap((project) => {
            const cover = [
                { project, media: project.homeCoverMedia ?? project.coverMedia, label: "Homepage 封面" },
                { project, media: project.coverMedia, label: "详情页 Hero" },
            ];
            const sectionMedia = project.sections.flatMap((section) =>
                section.media.map((media) => ({ project, media, label: section.kicker || getBlockOption(section.layout).label })),
            );
            return [...cover, ...sectionMedia];
        });
    }, [config.projects]);

    function closeDrawer() {
        setIsOpen(false);
    }

    function updateConfig(updater: (draft: SiteConfig) => void) {
        setConfig((current) => {
            const next = structuredClone(current);
            updater(next);
            return next;
        });
        setStatus("有未保存改动");
    }

    function updateSelectedProject(updater: (project: Project) => void) {
        updateConfig((draft) => {
            const project = draft.projects.find((item) => item.slug === selectedProjectSlug);
            if (project) {
                updater(project);
            }
        });
    }

    function updateSelectedSection(updater: (section: CaseStudySection) => void) {
        updateSelectedProject((project) => {
            const section = project.sections[selectedSectionIndex];
            if (section) {
                updater(section);
            }
        });
    }

    function selectProject(slug: string) {
        setSelectedProjectSlug(slug);
        setSelectedSectionIndex(0);
    }

    function addProject() {
        const nextProject = createProject(config.projects);
        updateConfig((draft) => {
            draft.projects.push(nextProject);
        });
        setSelectedProjectSlug(nextProject.slug);
        setSelectedSectionIndex(0);
    }

    function removeProject(index: number) {
        if (config.projects.length <= 1) {
            setStatus("至少需要保留 1 个项目");
            return;
        }

        const project = config.projects[index];

        if (!project) {
            return;
        }

        updateConfig((draft) => {
            draft.projects.splice(index, 1);
        });

        const nextProject = config.projects[index + 1] ?? config.projects[index - 1] ?? config.projects[0];
        if (nextProject) {
            setSelectedProjectSlug(nextProject.slug);
        }
        setSelectedSectionIndex(0);
    }

    function moveProject(index: number, direction: -1 | 1) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= config.projects.length) {
            return;
        }

        updateConfig((draft) => {
            const [project] = draft.projects.splice(index, 1);
            draft.projects.splice(targetIndex, 0, project);
        });
    }

    function changeSelectedProjectSlug(value: string) {
        const nextSlug = getUniqueSlug(config.projects, value, selectedProjectSlug);

        updateSelectedProject((project) => {
            project.slug = nextSlug;
        });
        setSelectedProjectSlug(nextSlug);
    }

    function addBlock(layout: CaseStudySection["layout"]) {
        updateSelectedProject((project) => {
            project.sections.push(createBlock(layout));
            setSelectedSectionIndex(project.sections.length - 1);
        });
    }

    function removeBlock(index: number) {
        updateSelectedProject((project) => {
            project.sections.splice(index, 1);
            setSelectedSectionIndex(Math.max(0, Math.min(index - 1, project.sections.length - 1)));
        });
    }

    function moveBlock(index: number, direction: -1 | 1) {
        updateSelectedProject((project) => {
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= project.sections.length) {
                return;
            }
            const [section] = project.sections.splice(index, 1);
            project.sections.splice(targetIndex, 0, section);
            setSelectedSectionIndex(targetIndex);
        });
    }

    function changeBlockLayout(layout: CaseStudySection["layout"]) {
        updateSelectedSection((section) => {
            section.layout = layout;
            if (layout === "embedMedia") {
                section.media = section.media.filter((media) => media.type === "embed").slice(0, 1);
                section.kicker = "";
                section.title = "";
                section.body = [];
                return;
            }
            if (layout === "twoColumnText") {
                section.media = [];
            }
            if (layout === "textMediaSplit" && section.media.length > 1) {
                section.media = section.media.slice(0, 1);
            }
            if (isMediaOnlyLayout(layout)) {
                section.kicker = "";
                section.title = "";
                section.body = [];
            }
        });
    }

    function insertMedia(media: MediaAsset) {
        updateSelectedProject((project) => {
            if (!project.sections[selectedSectionIndex]) {
                project.sections.push(createBlock(media.type === "embed" ? "embedMedia" : "singleMedia"));
            }

            const section = project.sections[selectedSectionIndex];
            const limit = getMediaLimit(section.layout);

            if (limit === 0) {
                setStatus("当前 Block 是纯文本，不能插入媒体");
                return;
            }

            if (section.layout === "embedMedia" && media.type !== "embed") {
                setStatus("YouTube / Vimeo Block 只能填写外部视频链接");
                return;
            }

            if (media.type === "embed" && section.layout !== "embedMedia") {
                section.layout = "embedMedia";
                section.media = [media];
                section.kicker = "";
                section.title = "";
                section.body = [];
                return;
            }

            if (Number.isFinite(limit) && section.media.length >= limit) {
                setStatus(`当前 Block 最多支持 ${limit} 个媒体`);
                return;
            }

            section.media.push({
                ...media,
                heightPx: media.type === "embed" ? media.heightPx : (media.heightPx ?? config.design.caseStudy.mediaCardMinHeight),
            });
        });
    }

    async function saveConfig() {
        setIsSaving(true);
        setStatus("正在保存...");

        try {
            const response = await fetch("/api/site-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            setStatus(`已保存 ${new Date().toLocaleTimeString()}`);
            router.refresh();
            return true;
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "保存失败");
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    async function publishSite() {
        setIsPublishing(true);
        setStatus("正在保存并发布...");

        try {
            const saved = await saveConfig();
            if (!saved) {
                throw new Error("保存失败，已取消发布。");
            }

            setStatus("正在构建静态站并推送 GitHub...");
            const response = await fetch("/api/publish", { method: "POST" });
            const result = (await response.json()) as { message?: string; error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "发布失败");
            }

            setStatus(result.message ?? "已推送到 GitHub，正在部署。");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "发布失败");
        } finally {
            setIsPublishing(false);
        }
    }

    async function uploadMedia(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !selectedProject) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setStatus("正在上传媒体...");

        const response = await fetch("/api/media", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            setStatus(await response.text());
            return;
        }

        const payload = (await response.json()) as { media: MediaAsset };
        insertMedia(payload.media);
        setStatus(`已上传 ${payload.media.src}`);
    }

    async function uploadCoverMedia(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !selectedProject) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setStatus("正在上传 Homepage 封面...");

        const response = await fetch("/api/media", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            setStatus(await response.text());
            return;
        }

        const payload = (await response.json()) as { media: MediaAsset };
        updateSelectedProject((project) => {
            project.homeCoverMedia = {
                ...payload.media,
                fit: "cover",
            };
        });
        setStatus(`已替换 Homepage 封面 ${payload.media.src}`);
    }

    function addEmbedMedia() {
        const trimmedUrl = embedUrl.trim();

        if (!trimmedUrl) {
            setStatus("请先粘贴 YouTube 或 Vimeo 链接");
            return;
        }

        insertMedia({
            type: "embed",
            src: trimmedUrl,
            alt: "外部视频",
            fit: "cover",
        });
        setEmbedUrl("");
        setStatus("已插入外部视频链接");
    }

    async function updateSelectedEmbedMedia(url: string) {
        const trimmedUrl = url.trim();

        if (!trimmedUrl) {
            setStatus("请先粘贴 YouTube 或 Vimeo 链接");
            return;
        }

        const nextConfig = structuredClone(config);
        const project = nextConfig.projects.find((item) => item.slug === selectedProjectSlug);
        const section = project?.sections[selectedSectionIndex];

        if (!section) {
            setStatus("请先选择一个 YouTube / Vimeo Block");
            return;
        }

        section.layout = "embedMedia";
        section.media = [{
            type: "embed",
            src: trimmedUrl,
            alt: "外部视频",
            fit: "cover",
        }];
        section.kicker = "";
        section.title = "";
        section.body = [];

        setConfig(nextConfig);
        setEmbedUrl("");
        setIsSaving(true);
        setStatus("正在保存并刷新外部视频...");

        try {
            const response = await fetch("/api/site-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nextConfig),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            setStatus("已插入外部视频并刷新预览");
            router.refresh();
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "外部视频保存失败");
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteUploadedFile(src: string) {
        if (!src.startsWith("/uploads/")) {
            return;
        }

        await fetch("/api/media", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ src }),
        });
    }

    async function removeSectionMedia(index: number) {
        const media = selectedSection?.media[index];
        if (!media) {
            return;
        }

        await deleteUploadedFile(media.src);
        updateSelectedSection((section) => {
            section.media.splice(index, 1);
        });
    }

    async function replaceSectionMedia(index: number, event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !selectedSection?.media[index]) {
            return;
        }

        const currentMedia = selectedSection.media[index];
        const formData = new FormData();
        formData.append("file", file);
        setStatus("正在替换当前媒体...");

        const response = await fetch("/api/media", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            setStatus(await response.text());
            return;
        }

        const payload = (await response.json()) as { media: MediaAsset };
        await deleteUploadedFile(currentMedia.src);
        updateSelectedSection((section) => {
            section.media[index] = {
                ...payload.media,
                alt: payload.media.alt || currentMedia.alt,
                widthPercent: currentMedia.widthPercent,
                heightPx: currentMedia.heightPx,
                fit: currentMedia.fit,
            };
        });
        setStatus(`已替换媒体 ${payload.media.src}`);
    }

    async function deleteMediaEverywhere(media: MediaAsset) {
        await deleteUploadedFile(media.src);
        updateConfig((draft) => {
            draft.projects.forEach((project) => {
                if (project.homeCoverMedia?.src === media.src) {
                    project.homeCoverMedia = { type: "image", src: "/assets/home/MJEUzqAUYToqEzCAPoptrTsdPGI.png", alt: "Homepage project cover", fit: "cover" };
                }
                if (project.coverMedia.src === media.src) {
                    project.coverMedia = { type: "image", src: "/assets/home/MJEUzqAUYToqEzCAPoptrTsdPGI.png", alt: "Project detail hero", fit: "contain" };
                }
                project.sections.forEach((section) => {
                    section.media = section.media.filter((item) => item.src !== media.src);
                });
            });
        });
    }

    function applyYiqiPreset() {
        updateConfig((draft) => {
            draft.design.sidebar = {
                ...draft.design.sidebar,
                paddingTop: 38,
                paddingX: 30,
                paddingBottom: 48,
                nameSize: 34,
                introSize: 18,
                navSize: 16,
                navGap: 20,
                introGap: 46,
                clockSize: 14,
            };
            draft.design.home = {
                ...draft.design.home,
                tileHeight: 610,
                tileGap: 8,
                mediaScale: 0.92,
                phoneWidth: 330,
                phoneMinWidth: 280,
                desktopPreviewWidth: 70,
                titleSize: 16,
                titleBottom: 24,
                hoverOpacity: 20,
            };
        });
    }

    return (
        <>
            <button className={styles.consoleButton} type="button" onClick={() => setIsOpen(true)}>
                <PanelRightOpen size={18} />
                控制台
            </button>
            <aside className={`${styles.consoleDrawer} ${isOpen ? styles.open : ""}`} data-console-drawer data-open={isOpen}>
                <header className={styles.drawerHeader}>
                    <div>
                        <strong>作品集控制台</strong>
                        <span>{status}</span>
                    </div>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={closeDrawer}
                        onPointerDown={(event) => {
                            event.preventDefault();
                            closeDrawer();
                        }}
                        aria-label="收起控制台"
                    >
                        <PanelRightClose size={18} />
                        收起
                    </button>
                </header>

                <div className={styles.drawerActions}>
                    <button type="button" className={styles.primaryButton} onClick={saveConfig} disabled={isSaving}>
                        <Save size={16} />
                        保存并应用
                    </button>
                    <button type="button" onClick={publishSite} disabled={isSaving || isPublishing}>
                        <Rocket size={16} />
                        {isPublishing ? "发布中..." : "Publish"}
                    </button>
                    <a href={pathname.replace(/^\/admin/, "") || "/"} target="_blank">
                        <ExternalLink size={16} />
                        打开公开页
                    </a>
                </div>

                <nav className={styles.tabbar}>
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            className={activeTab === tab.id ? styles.activeTab : ""}
                            onClick={() => setActiveTab(tab.id)}
                            key={tab.id}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <section className={styles.editorPanel}>
                    {activeTab === "content" && selectedProject && (
                        <div className={styles.stack}>
                            <h1>全站内容</h1>
                            <TextField label="姓名 / Logo" value={config.profile.name} onChange={(value) => updateConfig((draft) => { draft.profile.name = value; })} />
                            <TextAreaField label="个人简介，每行一段" value={linesToText(config.profile.intro)} onChange={(value) => updateConfig((draft) => { draft.profile.intro = textToLines(value); })} />
                            <TextField label="底部地点" value={config.profile.location} onChange={(value) => updateConfig((draft) => { draft.profile.location = value; })} />

                            <hr />
                            <ProjectManager
                                projects={config.projects}
                                selectedProjectSlug={selectedProjectSlug}
                                onSelect={selectProject}
                                onAdd={addProject}
                                onMove={moveProject}
                                onRemove={removeProject}
                            />
                            <ProjectPicker projects={config.projects} selectedProjectSlug={selectedProjectSlug} onSelect={selectProject} />
                            <TextField label="网址路径 / Slug" value={selectedProject.slug} onChange={changeSelectedProjectSlug} />
                            <TextField label="导航标题" value={selectedProject.navTitle} onChange={(value) => updateSelectedProject((project) => { project.navTitle = value; })} />
                            <label className={styles.field}>
                                <span>Homepage 标题颜色</span>
                                <select
                                    value={selectedProject.homeTitleColor ?? "black"}
                                    onChange={(event) => updateSelectedProject((project) => { project.homeTitleColor = event.target.value as BlockColor; })}
                                >
                                    {blockColorOptions.map((option) => (
                                        <option value={option.value} key={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </label>
                            <TextField label="年份" value={selectedProject.year} onChange={(value) => updateSelectedProject((project) => { project.year = value; })} />
                            <CoverMediaEditor
                                media={selectedProject.homeCoverMedia ?? selectedProject.coverMedia}
                                onUpload={uploadCoverMedia}
                                onAltChange={(value) => updateSelectedProject((project) => {
                                    project.homeCoverMedia = {
                                        ...(project.homeCoverMedia ?? project.coverMedia),
                                        alt: value,
                                        fit: "cover",
                                    };
                                })}
                            />
                        </div>
                    )}

                    {activeTab === "sidebar" && (
                        <div className={styles.stack}>
                            <h1>侧边栏系统</h1>
                            <button type="button" className={styles.presetButton} onClick={applyYiqiPreset}>套用 YIQI 紧凑比例</button>
                            <RangeField label="侧栏宽度" value={config.design.sidebar.widthVw} min={22} max={45} unit="vw" onChange={(value) => updateConfig((draft) => { draft.design.sidebar.widthVw = value; })} />
                            <RangeField label="最小宽度" value={config.design.sidebar.minWidth} min={280} max={620} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.minWidth = value; })} />
                            <RangeField label="顶部边距" value={config.design.sidebar.paddingTop} min={12} max={90} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.paddingTop = value; })} />
                            <RangeField label="左右边距" value={config.design.sidebar.paddingX} min={12} max={90} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.paddingX = value; })} />
                            <RangeField label="底部边距" value={config.design.sidebar.paddingBottom} min={20} max={120} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.paddingBottom = value; })} />
                            <RangeField label="姓名字号" value={config.design.sidebar.nameSize} min={20} max={56} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.nameSize = value; })} />
                            <RangeField label="简介字号" value={config.design.sidebar.introSize} min={12} max={34} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.introSize = value; })} />
                            <RangeField label="作品字号" value={config.design.sidebar.navSize} min={12} max={30} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.navSize = value; })} />
                            <RangeField label="作品行距" value={config.design.sidebar.navGap} min={8} max={42} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.navGap = value; })} />
                            <RangeField label="简介到列表距离" value={config.design.sidebar.introGap} min={12} max={90} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.introGap = value; })} />
                            <RangeField label="时间字号" value={config.design.sidebar.clockSize} min={10} max={24} onChange={(value) => updateConfig((draft) => { draft.design.sidebar.clockSize = value; })} />
                        </div>
                    )}

                    {activeTab === "home" && (
                        <div className={styles.stack}>
                            <h1>首页画布</h1>
                            <RangeField label="作品格高度" value={config.design.home.tileHeight} min={420} max={920} onChange={(value) => updateConfig((draft) => { draft.design.home.tileHeight = value; })} />
                            <RangeField label="格子间距" value={config.design.home.tileGap} min={0} max={24} onChange={(value) => updateConfig((draft) => { draft.design.home.tileGap = value; })} />
                            <RangeField label="媒体整体缩放" value={config.design.home.mediaScale} min={0.5} max={1.4} step={0.01} unit="x" onChange={(value) => updateConfig((draft) => { draft.design.home.mediaScale = value; })} />
                            <RangeField label="桌面图宽度" value={config.design.home.desktopPreviewWidth} min={40} max={100} unit="%" onChange={(value) => updateConfig((draft) => { draft.design.home.desktopPreviewWidth = value; })} />
                            <RangeField label="手机宽度" value={config.design.home.phoneWidth} min={220} max={520} onChange={(value) => updateConfig((draft) => { draft.design.home.phoneWidth = value; })} />
                            <RangeField label="手机最小宽度" value={config.design.home.phoneMinWidth} min={180} max={420} onChange={(value) => updateConfig((draft) => { draft.design.home.phoneMinWidth = value; })} />
                            <RangeField label="作品标题字号" value={config.design.home.titleSize ?? 16} min={10} max={36} onChange={(value) => updateConfig((draft) => { draft.design.home.titleSize = value; })} />
                            <RangeField label="作品标题底部间距" value={config.design.home.titleBottom ?? 24} min={0} max={120} onChange={(value) => updateConfig((draft) => { draft.design.home.titleBottom = value; })} />
                            <RangeField label="Hover 蒙层透明度" value={config.design.home.hoverOpacity ?? 20} min={0} max={80} unit="%" onChange={(value) => updateConfig((draft) => { draft.design.home.hoverOpacity = value; })} />
                        </div>
                    )}

                    {activeTab === "responsive" && (
                        <div className={styles.stack}>
                            <h1>自适应</h1>
                            <RangeField label="压缩模式开始宽度" value={config.design.responsive.compactBreakpoint} min={900} max={2200} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactBreakpoint = value; })} />
                            <RangeField label="竖屏模式开始宽度" value={config.design.responsive.mobileBreakpoint} min={420} max={1100} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileBreakpoint = value; })} />
                            <hr />
                            <h1>压缩模式</h1>
                            <RangeField label="侧栏宽度" value={config.design.responsive.compactSidebarWidthVw} min={18} max={34} unit="vw" onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarWidthVw = value; })} />
                            <RangeField label="侧栏最小宽度" value={config.design.responsive.compactSidebarMinWidth} min={220} max={440} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarMinWidth = value; })} />
                            <RangeField label="侧栏左右边距" value={config.design.responsive.compactSidebarPaddingX} min={12} max={60} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarPaddingX = value; })} />
                            <RangeField label="姓名字号" value={config.design.responsive.compactSidebarNameSize} min={20} max={48} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarNameSize = value; })} />
                            <RangeField label="简介字号" value={config.design.responsive.compactSidebarIntroSize} min={11} max={28} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarIntroSize = value; })} />
                            <RangeField label="作品字号" value={config.design.responsive.compactSidebarNavSize} min={11} max={24} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarNavSize = value; })} />
                            <RangeField label="作品行距" value={config.design.responsive.compactSidebarNavGap} min={8} max={34} onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactSidebarNavGap = value; })} />
                            <RangeField label="Gallery 整体缩放" value={config.design.responsive.compactGalleryScale} min={0.65} max={1} step={0.01} unit="x" onChange={(value) => updateConfig((draft) => { draft.design.responsive.compactGalleryScale = value; })} />
                            <hr />
                            <h1>竖屏模式</h1>
                            <RangeField label="顶部栏高度" value={config.design.responsive.mobileHeaderHeight} min={58} max={130} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileHeaderHeight = value; })} />
                            <RangeField label="页面边距" value={config.design.responsive.mobilePagePadding} min={0} max={40} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobilePagePadding = value; })} />
                            <RangeField label="菜单内边距" value={config.design.responsive.mobileMenuPadding} min={14} max={64} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileMenuPadding = value; })} />
                            <RangeField label="菜单姓名字号" value={config.design.responsive.mobileMenuNameSize} min={24} max={58} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileMenuNameSize = value; })} />
                            <RangeField label="菜单简介字号" value={config.design.responsive.mobileMenuIntroSize} min={13} max={32} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileMenuIntroSize = value; })} />
                            <RangeField label="菜单作品字号" value={config.design.responsive.mobileMenuNavSize} min={14} max={32} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileMenuNavSize = value; })} />
                            <RangeField label="单列作品高度" value={config.design.responsive.mobileTileHeight} min={320} max={900} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileTileHeight = value; })} />
                            <RangeField label="单列作品间距" value={config.design.responsive.mobileTileGap} min={0} max={32} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileTileGap = value; })} />
                            <RangeField label="封面完整显示边距" value={config.design.responsive.mobileTilePadding} min={0} max={60} onChange={(value) => updateConfig((draft) => { draft.design.responsive.mobileTilePadding = value; })} />
                        </div>
                    )}

                    {activeTab === "case" && selectedProject && (
                        <div className={styles.stack}>
                            <h1>详情页全局样式</h1>
                            <RangeField label="默认 Hero 高度" value={config.design.caseStudy.heroHeightVh} min={40} max={100} unit="vh" onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.heroHeightVh = value; })} />
                            <RangeField label="章节块上下边距" value={config.design.caseStudy.sectionPaddingY} min={20} max={240} onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.sectionPaddingY = value; })} />
                            <RangeField label="章节块左右边距" value={config.design.caseStudy.sectionPaddingX} min={0} max={120} onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.sectionPaddingX = value; })} />
                            <RangeField label="标题字号" value={config.design.caseStudy.titleSize} min={18} max={56} onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.titleSize = value; })} />
                            <RangeField label="正文字号" value={config.design.caseStudy.bodySize} min={12} max={34} onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.bodySize = value; })} />
                            <RangeField label="媒体块上下间距" value={config.design.caseStudy.mediaGapY ?? config.design.caseStudy.mediaGap} min={0} max={96} onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.mediaGapY = value; })} />
                            <RangeField label="媒体块左右横格间距" value={config.design.caseStudy.mediaGapX ?? config.design.caseStudy.mediaGap} min={0} max={64} onChange={(value) => updateConfig((draft) => { draft.design.caseStudy.mediaGapX = value; })} />

                            <hr />
                            <h1>内容块编排</h1>
                            <ProjectPicker projects={config.projects} selectedProjectSlug={selectedProjectSlug} onSelect={selectProject} />
                            <BlockList
                                sections={selectedProject.sections}
                                selectedIndex={selectedSectionIndex}
                                onSelect={setSelectedSectionIndex}
                                onMove={moveBlock}
                                onRemove={removeBlock}
                            />
                            <AddBlockPanel onAdd={addBlock} />
                            {selectedSection && (
                                <BlockEditor
                                    section={selectedSection}
                                    sectionIndex={selectedSectionIndex}
                                    config={config}
                                    uploadTarget={uploadTarget}
                                    setUploadTarget={setUploadTarget}
                                    embedUrl={embedUrl}
                                    setEmbedUrl={setEmbedUrl}
                                    uploadMedia={uploadMedia}
                                    addEmbedMedia={addEmbedMedia}
                                    updateSelectedEmbedMedia={(url) => void updateSelectedEmbedMedia(url)}
                                    onLayoutChange={changeBlockLayout}
                                    onUpdateSection={updateSelectedSection}
                                    onRemoveMedia={removeSectionMedia}
                                    onReplaceMedia={replaceSectionMedia}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "media" && (
                        <div className={styles.stack}>
                            <h1>媒体库</h1>
                            <ProjectPicker projects={config.projects} selectedProjectSlug={selectedProjectSlug} onSelect={selectProject} />
                            <UploadControl
                                disabled={false}
                                allowLocal
                                allowEmbed
                                uploadTarget={uploadTarget}
                                setUploadTarget={setUploadTarget}
                                uploadMedia={uploadMedia}
                                embedUrl={embedUrl}
                                setEmbedUrl={setEmbedUrl}
                                addEmbedMedia={addEmbedMedia}
                                helperText="媒体会插入当前选中的 Block；如果是外部视频，会自动切换成 YouTube / Vimeo Block。"
                            />
                            <div className={styles.mediaLibrary}>
                                {mediaReferences.map(({ project, media, label }) => (
                                    <div className={styles.libraryItem} key={`${project.slug}-${label}-${media.src}`}>
                                        <div className={styles.thumb}><MediaThumb media={media} /></div>
                                        <div>
                                            <span>{project.navTitle}</span>
                                            <strong>{label}</strong>
                                            <code>{media.src}</code>
                                        </div>
                                        <button type="button" onClick={() => void deleteMediaEverywhere(media)}>
                                            <Trash2 size={15} />
                                            删除{media.src.startsWith("/uploads/") ? "文件" : "引用"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </aside>
        </>
    );
}

function ProjectPicker({
    projects,
    selectedProjectSlug,
    onSelect,
}: {
    projects: Project[];
    selectedProjectSlug: string;
    onSelect: (slug: string) => void;
}) {
    return (
        <label className={styles.field}>
            <span>项目</span>
            <select value={selectedProjectSlug} onChange={(event) => onSelect(event.target.value)}>
                {projects.map((project) => (
                    <option value={project.slug} key={project.slug}>{project.navTitle}</option>
                ))}
            </select>
        </label>
    );
}

function ProjectManager({
    projects,
    selectedProjectSlug,
    onSelect,
    onAdd,
    onMove,
    onRemove,
}: {
    projects: Project[];
    selectedProjectSlug: string;
    onSelect: (slug: string) => void;
    onAdd: () => void;
    onMove: (index: number, direction: -1 | 1) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className={styles.projectManager}>
            <div className={styles.panelHeader}>
                <span>首页项目顺序</span>
                <button type="button" onClick={onAdd}>
                    <Plus size={13} />
                    新增项目
                </button>
            </div>
            <div className={styles.projectList}>
                {projects.map((project, index) => (
                    <div className={`${styles.projectItem} ${project.slug === selectedProjectSlug ? styles.activeProject : ""}`} key={project.slug}>
                        <button type="button" onClick={() => onSelect(project.slug)}>
                            <strong>{project.navTitle}</strong>
                            <small>{project.year} / {project.slug}</small>
                        </button>
                        <div>
                            <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0}>上移</button>
                            <button type="button" onClick={() => onMove(index, 1)} disabled={index === projects.length - 1}>下移</button>
                            <button type="button" onClick={() => onRemove(index)} disabled={projects.length <= 1}>删除</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CoverMediaEditor({
    media,
    onUpload,
    onAltChange,
}: {
    media: MediaAsset;
    onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    onAltChange: (value: string) => void;
}) {
    return (
        <div className={styles.coverEditor}>
            <div className={styles.panelHeader}>
                <span>Homepage 封面图</span>
                <label>
                    <Upload size={13} />
                    上传 / 更换
                    <input type="file" accept="image/*,video/*" onChange={onUpload} />
                </label>
            </div>
            <div className={styles.coverPreview}>
                <MediaThumb media={media} />
            </div>
            <TextField label="封面替代文本 / 标题" value={media.alt} onChange={onAltChange} />
            <p className={styles.coverNote}>Homepage 封面会铺满整个格子；如果图片比例不同，会自动裁剪边缘。</p>
        </div>
    );
}

function BlockList({
    sections,
    selectedIndex,
    onSelect,
    onMove,
    onRemove,
}: {
    sections: CaseStudySection[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onMove: (index: number, direction: -1 | 1) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className={styles.blockList}>
            <span>当前页面 Block 顺序</span>
            {sections.map((section, index) => {
                const option = getBlockOption(section.layout);
                return (
                    <div className={`${styles.blockItem} ${selectedIndex === index ? styles.activeBlock : ""}`} key={`${section.layout}-${index}`}>
                        <button type="button" onClick={() => onSelect(index)}>
                            <GripVertical size={14} />
                            <strong>{index + 1}. {option.label}</strong>
                            <small>{section.title || section.kicker || `${section.media.length} 个媒体`}</small>
                        </button>
                        <div>
                            <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0}>上移</button>
                            <button type="button" onClick={() => onMove(index, 1)} disabled={index === sections.length - 1}>下移</button>
                            <button type="button" onClick={() => onRemove(index)}>删除</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function AddBlockPanel({ onAdd }: { onAdd: (layout: CaseStudySection["layout"]) => void }) {
    return (
        <div className={styles.addBlockPanel}>
            <span>添加新 Block</span>
            <div>
                {blockOptions.map((option) => (
                    <button type="button" onClick={() => onAdd(option.value)} key={option.value}>
                        <Plus size={13} />
                        <strong>{option.label}</strong>
                    </button>
                ))}
            </div>
        </div>
    );
}

function BlockEditor({
    section,
    sectionIndex,
    config,
    uploadTarget,
    setUploadTarget,
    embedUrl,
    setEmbedUrl,
    uploadMedia,
    addEmbedMedia,
    updateSelectedEmbedMedia,
    onLayoutChange,
    onUpdateSection,
    onRemoveMedia,
    onReplaceMedia,
}: {
    section: CaseStudySection;
    sectionIndex: number;
    config: SiteConfig;
    uploadTarget: UploadTarget;
    setUploadTarget: (target: UploadTarget) => void;
    embedUrl: string;
    setEmbedUrl: (url: string) => void;
    uploadMedia: (event: ChangeEvent<HTMLInputElement>) => void;
    addEmbedMedia: () => void;
    updateSelectedEmbedMedia: (url: string) => void;
    onLayoutChange: (layout: CaseStudySection["layout"]) => void;
    onUpdateSection: (updater: (section: CaseStudySection) => void) => void;
    onRemoveMedia: (index: number) => Promise<void>;
    onReplaceMedia: (index: number, event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
    const limit = getMediaLimit(section.layout);
    const reachedLimit = Number.isFinite(limit) && section.media.length >= limit;
    const isEmbedBlock = section.layout === "embedMedia";
    const isTextOnly = section.layout === "twoColumnText";
    const showTextEditor = section.layout === "mediaTextSplit" || section.layout === "textMediaSplit" || section.layout === "twoColumnText";
    const currentEmbedUrl = isEmbedBlock ? section.media.find((media) => media.type === "embed")?.src ?? "" : "";
    const localMedia = section.media.filter((media) => media.type !== "embed");
    const blockMediaHeight = localMedia[0]?.heightPx ?? config.design.caseStudy.mediaCardMinHeight;

    return (
        <div className={styles.blockEditor}>
            <h1>编辑当前 Block</h1>
            <LayoutPicker value={section.layout} onChange={onLayoutChange} />
            <BlockLayoutControls
                section={section}
                sectionIndex={sectionIndex}
                config={config}
                onUpdateSection={onUpdateSection}
            />
            {showTextEditor && (
                <>
                    <TextField label="Block 标记 / Kicker" value={section.kicker} onChange={(value) => onUpdateSection((draft) => { draft.kicker = value; })} />
                    <TextField label="Block 标题" value={section.title} onChange={(value) => onUpdateSection((draft) => { draft.title = value; })} />
                    <TextAreaField label="Block 正文，每行一段" value={linesToText(section.body)} rows={7} onChange={(value) => onUpdateSection((draft) => { draft.body = textToLines(value); })} />
                </>
            )}
            {isEmbedBlock ? (
                <EmbedBlockEditor
                    value={embedUrl}
                    currentUrl={currentEmbedUrl}
                    onChange={setEmbedUrl}
                    onApply={updateSelectedEmbedMedia}
                />
            ) : (
                <UploadControl
                    disabled={reachedLimit || isTextOnly}
                    allowLocal={!isTextOnly}
                    allowEmbed={false}
                    uploadTarget={uploadTarget}
                    setUploadTarget={setUploadTarget}
                    uploadMedia={uploadMedia}
                    embedUrl={embedUrl}
                    setEmbedUrl={setEmbedUrl}
                    addEmbedMedia={addEmbedMedia}
                    helperText={
                        isTextOnly
                            ? "文字 / 标题 Block 不包含媒体；可以只填左侧标题，也可以填写右侧正文。"
                            : Number.isFinite(limit)
                              ? `当前 Block 最多支持 ${limit} 个图片或视频。`
                              : "当前 Block 支持多个图片或视频纵向堆叠。"
                    }
                />
            )}
            {localMedia.length > 0 && (
                <RangeField
                    label="当前 Block 媒体高度"
                    value={blockMediaHeight}
                    min={40}
                    max={1400}
                    onChange={(value) => onUpdateSection((draft) => {
                        draft.media.forEach((media) => {
                            if (media.type !== "embed") {
                                media.heightPx = value;
                            }
                        });
                    })}
                />
            )}
            <div className={styles.mediaStack}>
                {section.media.map((media, index) => (
                    <div className={styles.mediaRow} key={`${media.src}-${index}`}>
                        <div className={styles.thumb}><MediaThumb media={media} /></div>
                        <TextField label="替代文本 / 标题" value={media.alt} onChange={(value) => onUpdateSection((draft) => { draft.media[index].alt = value; })} />
                        {media.type !== "embed" && (
                            <>
                                <RangeField label="宽度" value={media.widthPercent ?? 100} min={25} max={100} unit="%" onChange={(value) => onUpdateSection((draft) => { draft.media[index].widthPercent = value; })} />
                                <RangeField label="高度" value={media.heightPx ?? config.design.caseStudy.mediaCardMinHeight} min={40} max={1400} onChange={(value) => onUpdateSection((draft) => { draft.media[index].heightPx = value; })} />
                                <label className={styles.field}>
                                    <span>图片填充方式</span>
                                    <select value={media.fit ?? "cover"} onChange={(event) => onUpdateSection((draft) => { draft.media[index].fit = event.target.value as MediaAsset["fit"]; })}>
                                        <option value="cover">cover：铺满容器</option>
                                        <option value="contain">contain：完整显示</option>
                                    </select>
                                </label>
                            </>
                        )}
                        <div className={styles.mediaRowActions}>
                            {media.type !== "embed" && (
                                <label>
                                    <Upload size={16} />
                                    替换
                                    <input type="file" accept="image/*,video/*" onChange={(event) => void onReplaceMedia(index, event)} />
                                </label>
                            )}
                            <button type="button" className={styles.dangerButton} onClick={() => void onRemoveMedia(index)}>
                                <Trash2 size={16} />
                                移除
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LayoutPicker({ value, onChange }: { value: CaseStudySection["layout"]; onChange: (value: CaseStudySection["layout"]) => void }) {
    return (
        <div className={styles.layoutPicker}>
            <label className={styles.field}>
                <span>当前 Block 样式</span>
                <select value={value} onChange={(event) => onChange(event.target.value as CaseStudySection["layout"])}>
                    {blockOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        </div>
    );
}

function BlockLayoutControls({
    section,
    sectionIndex,
    config,
    onUpdateSection,
}: {
    section: CaseStudySection;
    sectionIndex: number;
    config: SiteConfig;
    onUpdateSection: (updater: (section: CaseStudySection) => void) => void;
}) {
    const isFirstBlock = sectionIndex === 0;
    const fallbackHeight = section.layout === "hero" ? config.design.caseStudy.heroHeightVh * 10 : 0;
    const blockHeight = section.minHeightPx ?? fallbackHeight;
    const paddingTop = isFirstBlock ? 0 : (section.paddingTopPx ?? config.design.caseStudy.sectionPaddingY);
    const paddingBottom = isFirstBlock ? 0 : (section.paddingBottomPx ?? Math.max(config.design.caseStudy.sectionPaddingY - 4, 0));
    const paddingX = section.paddingX ?? config.design.caseStudy.sectionPaddingX;

    return (
        <div className={styles.blockLayoutControls}>
            <span>当前 Block 布局</span>
            {isFirstBlock && <p>第一个 Block 会始终贴到详情页顶部，顶部和底部内边距固定为 0。</p>}
            <RangeField
                label="Block 最小高度"
                value={blockHeight}
                min={0}
                max={1200}
                onChange={(value) => onUpdateSection((draft) => { draft.minHeightPx = value; })}
            />
            {!isFirstBlock && (
                <>
                    <RangeField
                        label="顶部内边距"
                        value={paddingTop}
                        min={1}
                        max={160}
                        onChange={(value) => onUpdateSection((draft) => { draft.paddingTopPx = value; })}
                    />
                    <RangeField
                        label="底部内边距"
                        value={paddingBottom}
                        min={1}
                        max={160}
                        onChange={(value) => onUpdateSection((draft) => { draft.paddingBottomPx = value; })}
                    />
                </>
            )}
            <RangeField
                label="左右内边距"
                value={paddingX}
                min={0}
                max={160}
                onChange={(value) => onUpdateSection((draft) => { draft.paddingX = value; })}
            />
            <label className={styles.field}>
                <span>背景色</span>
                <select
                    value={normalizeBlockColorValue(section.background, "white")}
                    onChange={(event) => onUpdateSection((draft) => { draft.background = event.target.value as BlockColor; })}
                >
                    {blockColorOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
            <label className={styles.field}>
                <span>文字颜色</span>
                <select
                    value={normalizeBlockColorValue(section.textColor, "black")}
                    onChange={(event) => onUpdateSection((draft) => { draft.textColor = event.target.value as BlockColor; })}
                >
                    {blockColorOptions.map((option) => (
                        <option value={option.value} key={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        </div>
    );
}

function EmbedBlockEditor({
    value,
    currentUrl,
    onChange,
    onApply,
}: {
    value: string;
    currentUrl: string;
    onChange: (value: string) => void;
    onApply: (url: string) => void;
}) {
    return (
        <div className={styles.embedEditor}>
            <p>YouTube / Vimeo Block 会直接在当前 Block 位置展示外部视频。</p>
            {currentUrl && (
                <div className={styles.currentEmbedUrl}>
                    <span>当前链接</span>
                    <code>{currentUrl}</code>
                </div>
            )}
            <div className={styles.embedBox}>
                <input
                    value={value}
                    placeholder={currentUrl || "粘贴 YouTube / Vimeo 链接"}
                    onChange={(event) => onChange(event.target.value)}
                />
                <button type="button" onClick={() => onApply(value || currentUrl)}>
                    {currentUrl ? "更新外部视频" : "插入外部视频"}
                </button>
            </div>
        </div>
    );
}

function UploadControl({
    disabled,
    allowLocal,
    allowEmbed,
    uploadTarget,
    setUploadTarget,
    uploadMedia,
    embedUrl,
    setEmbedUrl,
    addEmbedMedia,
    helperText,
}: {
    disabled: boolean;
    allowLocal: boolean;
    allowEmbed: boolean;
    uploadTarget: UploadTarget;
    setUploadTarget: (target: UploadTarget) => void;
    uploadMedia: (event: ChangeEvent<HTMLInputElement>) => void;
    embedUrl: string;
    setEmbedUrl: (url: string) => void;
    addEmbedMedia: () => void;
    helperText: string;
}) {
    return (
        <div className={styles.uploadBox}>
            <p>{helperText}</p>
            <select value={uploadTarget} onChange={(event) => setUploadTarget(event.target.value as UploadTarget)} disabled={disabled}>
                <option value="section">插入当前 Block</option>
            </select>
            {allowLocal && (
                <label aria-disabled={disabled}>
                    <Upload size={16} />
                    上传图片 / 视频
                    <input type="file" accept="image/*,video/*" onChange={uploadMedia} disabled={disabled} />
                </label>
            )}
            {allowEmbed && (
                <div className={styles.embedBox}>
                    <input
                        value={embedUrl}
                        placeholder="粘贴 YouTube / Vimeo 链接"
                        onChange={(event) => setEmbedUrl(event.target.value)}
                        disabled={disabled}
                    />
                    <button type="button" onClick={addEmbedMedia} disabled={disabled}>插入外部视频</button>
                </div>
            )}
        </div>
    );
}
