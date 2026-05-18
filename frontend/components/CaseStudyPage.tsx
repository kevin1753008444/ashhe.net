"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { BlockColor, MediaAsset, Project } from "@/data/site-types";
import { MediaBlock } from "./MediaBlock";

const blockColorValues: Record<BlockColor, string> = {
    white: "#FFFFFF",
    lightGray: "#F6F6F6",
    midGray: "#EBE9E8",
    nightGray: "#141414",
    black: "#000000",
};

function resolveBlockColor(value: Project["sections"][number]["background"] | undefined, fallback: BlockColor) {
    if (value === "canvas") {
        return blockColorValues.lightGray;
    }

    if (value === "paper") {
        return blockColorValues.white;
    }

    return blockColorValues[value ?? fallback];
}

function getMediaStyle(media: MediaAsset) {
    return {
        "--media-width": media.widthPercent ? `${media.widthPercent}%` : "100%",
        "--media-height": media.heightPx ? `${media.heightPx}px` : undefined,
    } as CSSProperties;
}

function getSectionStyle(section: Project["sections"][number], index: number) {
    return {
        "--block-min-height": section.minHeightPx ? `${section.minHeightPx}px` : undefined,
        "--block-padding-top": index === 0 ? "0px" : section.paddingTopPx ? `${section.paddingTopPx}px` : undefined,
        "--block-padding-bottom": index === 0 ? "0px" : section.paddingBottomPx ? `${section.paddingBottomPx}px` : undefined,
        "--block-padding-x": section.paddingX ? `${section.paddingX}px` : undefined,
        "--block-bg": resolveBlockColor(section.background, "white"),
        "--block-text": blockColorValues[section.textColor ?? "black"],
    } as CSSProperties;
}

function getMediaLimit(layout: Project["sections"][number]["layout"]) {
    if (layout === "twoColumnText") {
        return 0;
    }

    if (layout === "mediaGridTwo") {
        return 2;
    }

    if (layout === "mediaGridThree" || layout === "mediaGrid") {
        return 3;
    }

    if (layout === "singleMedia" || layout === "hero" || layout === "mediaTextSplit" || layout === "textMediaSplit" || layout === "embedMedia") {
        return 1;
    }

    return Infinity;
}

function hasSectionText(section: Project["sections"][number]) {
    return Boolean(section.kicker.trim() || section.title.trim() || section.body.some((paragraph) => paragraph.trim()));
}

function SectionCopy({ section }: { section: Project["sections"][number] }) {
    if (!hasSectionText(section)) {
        return null;
    }

    return (
        <div className="sectionText">
            <div>
                <h2>{section.kicker}</h2>
                <h3>{section.title}</h3>
            </div>
            <div>
                {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
}

function SectionMedia({ section }: { section: Project["sections"][number] }) {
    if (section.layout === "twoColumnText") {
        return null;
    }

    const mediaLimit = getMediaLimit(section.layout);
    const visibleMedia = section.media.slice(0, mediaLimit);

    return (
        <div className={`sectionMedia sectionMedia-${section.layout}`}>
            {visibleMedia.map((media) => (
                <div className="mediaCard" key={media.src} style={getMediaStyle(media)}>
                    <MediaBlock media={media} />
                </div>
            ))}
        </div>
    );
}

export function CaseStudyPage({ project }: { project: Project }) {
    return (
        <motion.article
            className={`caseStudy theme-${project.accentTheme}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.44, 0, 0.56, 1] }}
        >
            {project.sections.map((section, index) => (
                <section
                    className={`caseSection caseSection-${section.layout}`}
                    key={`${section.layout}-${section.kicker}-${index}`}
                    style={getSectionStyle(section, index)}
                >
                    {section.layout === "mediaTextSplit" ? (
                        <div className="mediaTextSplitBlock">
                            <SectionMedia section={section} />
                            <SectionCopy section={section} />
                        </div>
                    ) : section.layout === "textMediaSplit" ? (
                        <div className="textMediaSplitBlock">
                            <SectionCopy section={section} />
                            <SectionMedia section={section} />
                        </div>
                    ) : (
                        <>
                            <SectionCopy section={section} />
                            <SectionMedia section={section} />
                        </>
                    )}
                </section>
            ))}
        </motion.article>
    );
}
