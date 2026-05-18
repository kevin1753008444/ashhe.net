"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { BlockColor, Project } from "@/data/site-types";
import { MediaBlock } from "./MediaBlock";

const blockColorValues: Record<BlockColor, string> = {
    white: "#FFFFFF",
    lightGray: "#F6F6F6",
    midGray: "#EBE9E8",
    nightGray: "#141414",
    black: "#000000",
};

const tileVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.06, duration: 0.45, ease: [0.44, 0, 0.56, 1] as const },
    }),
};

function getTileStyle(project: Project) {
    return {
        "--home-title-color": blockColorValues[project.homeTitleColor ?? "black"],
    } as CSSProperties;
}

export function HomePage({ projects, adminMode = false }: { projects: Project[]; adminMode?: boolean }) {
    const routePrefix = adminMode ? "/admin" : "";

    return (
        <motion.div className="homeGrid" initial="hidden" animate="visible">
            {projects.map((project, index) => (
                <motion.div custom={index} variants={tileVariants} className="homeTile" id={project.slug} key={project.slug}>
                    <Link href={`${routePrefix}/${project.slug}`} className="projectPreviewTile" style={getTileStyle(project)}>
                        <div className="projectPreviewMedia">
                            <MediaBlock media={{ ...(project.homeCoverMedia ?? project.coverMedia), fit: "cover" }} />
                        </div>
                        <div className="projectPreviewMeta">
                            <strong>{project.navTitle}</strong>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
