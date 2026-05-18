"use client";

import type { CSSProperties } from "react";
import type { MediaAsset } from "@/data/site-types";

export function VideoHover({ media, className = "", style }: { media: MediaAsset; className?: string; style?: CSSProperties }) {
    return (
        <video
            className={className}
            src={media.src}
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            style={style}
            aria-label={media.alt}
        />
    );
}
