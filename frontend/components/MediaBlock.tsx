import type { CSSProperties } from "react";
import type { MediaAsset } from "@/data/site-types";
import { VideoHover } from "./VideoHover";

function getEmbedSrc(src: string) {
    try {
        const url = new URL(src);

        if (url.hostname.includes("youtu.be")) {
            const videoId = url.pathname.split("/").filter(Boolean)[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : src;
        }

        if (url.hostname.includes("youtube.com")) {
            const videoId = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1);
            return videoId ? `https://www.youtube.com/embed/${videoId}` : src;
        }

        if (url.hostname.includes("vimeo.com")) {
            const videoId = url.pathname.split("/").filter(Boolean).at(-1);
            return videoId ? `https://player.vimeo.com/video/${videoId}` : src;
        }

        return src;
    } catch {
        return src;
    }
}

export function MediaBlock({ media, className = "" }: { media: MediaAsset; className?: string }) {
    const style = { objectFit: media.fit ?? "cover" } as CSSProperties;

    if (media.type === "embed") {
        return (
            <iframe
                className={`mediaObject embedObject ${className}`}
                src={getEmbedSrc(media.src)}
                title={media.alt}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        );
    }

    if (media.type === "video") {
        return <VideoHover media={media} className={`mediaObject ${className}`} style={style} />;
    }

    return <img className={`mediaObject ${className}`} src={media.src} alt={media.alt} loading="lazy" style={style} />;
}
